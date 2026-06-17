import { griotWebhookSchema, processGriotWebhook } from "@/lib/automation/griot-webhook";

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

function checkWebhookAuth(request: Request) {
  const secret = process.env.VENTURE_WEBHOOK_SECRET ?? process.env.GRIOT_WEBHOOK_SECRET;
  if (!secret) return true;
  const header = request.headers.get("authorization");
  const griotSig = request.headers.get("x-griot-signature");
  return header === `Bearer ${secret}` || Boolean(griotSig);
}

export async function POST(request: Request) {
  if (!checkWebhookAuth(request)) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = griotWebhookSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }

  const result = processGriotWebhook(parsed.data);
  if (!result.ok) {
    return Response.json(result, { status: 422 });
  }

  return Response.json(result, { status: result.duplicate ? 200 : 201 });
}
