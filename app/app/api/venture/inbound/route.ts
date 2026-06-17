import { inboundPayloadSchema, listNewCandidates } from "@/lib/automation/inbound";
import { processInboundRequest } from "@/lib/automation/process-inbound";
import { getAutomationReceipts, getInboundCandidates } from "@/lib/automation/store";

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

function checkWebhookAuth(request: Request) {
  const secret = process.env.VENTURE_WEBHOOK_SECRET;
  if (!secret) return true;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!checkWebhookAuth(request)) return unauthorized();

  const url = new URL(request.url);
  const clientId = url.searchParams.get("clientId") ?? undefined;
  const candidates = listNewCandidates(getInboundCandidates(), clientId);

  return Response.json({
    candidates,
    receipts: getAutomationReceipts().slice(0, 20),
  });
}

export async function POST(request: Request) {
  if (!checkWebhookAuth(request)) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = inboundPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }

  const result = processInboundRequest(parsed.data);
  return Response.json(result, { status: result.duplicate ? 200 : 201 });
}
