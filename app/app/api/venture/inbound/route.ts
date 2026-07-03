import { inboundPayloadSchema, listNewCandidates } from "@/lib/automation/inbound";
import { processInboundRequest } from "@/lib/automation/process-inbound";
import { getAutomationReceipts, getInboundCandidates } from "@/lib/automation/store";
import {
  isPostgresDataBackend,
  listPostgresInboundCandidates,
  listPostgresReceipts,
  processPostgresInboundRequest,
} from "@/lib/automation/postgres-store";

export const runtime = "nodejs";

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
  if (isPostgresDataBackend()) {
    const candidates = listNewCandidates(await listPostgresInboundCandidates(clientId), clientId);

    return Response.json({
      backend: "postgres",
      candidates,
      receipts: await listPostgresReceipts(),
    });
  }

  const candidates = listNewCandidates(getInboundCandidates(), clientId);

  return Response.json({
    backend: "memory",
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

  const result = isPostgresDataBackend()
    ? await processPostgresInboundRequest(parsed.data)
    : processInboundRequest(parsed.data);
  return Response.json(result, { status: result.duplicate ? 200 : 201 });
}
