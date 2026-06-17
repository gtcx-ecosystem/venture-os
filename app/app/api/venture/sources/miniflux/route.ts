import { minifluxWebhookSchema, processMinifluxWebhook } from "@/lib/automation/miniflux-webhook";

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

function checkAuth(request: Request) {
  const secret = process.env.VENTURE_WEBHOOK_SECRET ?? process.env.MINIFLUX_WEBHOOK_SECRET;
  if (!secret) return true;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function POST(request: Request) {
  if (!checkAuth(request)) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = minifluxWebhookSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }

  const result = processMinifluxWebhook(parsed.data);
  if (!result.ok) {
    return Response.json(result, { status: 422 });
  }

  return Response.json(result, { status: result.duplicate ? 200 : 201 });
}
