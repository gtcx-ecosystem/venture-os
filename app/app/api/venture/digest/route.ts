import { formatBriefMarkdown } from "@/lib/brief";
import { getClient } from "@/lib/clients";
import { createAutomationReceipt } from "@/lib/automation/receipts";
import { appendAutomationReceipt } from "@/lib/automation/store";
import { APPROVAL_ITEMS, CALENDAR_EVENTS, OPPORTUNITIES, PIPELINE_ITEMS } from "@/lib/mock";
import { z } from "zod";

const digestRequestSchema = z.object({
  clientId: z.string().min(1),
  dryRun: z.boolean().optional(),
});

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

function checkWebhookAuth(request: Request) {
  const secret = process.env.VENTURE_WEBHOOK_SECRET;
  if (!secret) return true;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function POST(request: Request) {
  if (!checkWebhookAuth(request)) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = digestRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }

  const { clientId, dryRun = true } = parsed.data;
  const client = getClient(clientId);
  if (!client) {
    return Response.json({ error: "Unknown clientId" }, { status: 404 });
  }

  const priorities = OPPORTUNITIES.filter((o) => o.clientId === clientId);
  const pipeline = PIPELINE_ITEMS.filter((p) => p.clientId === clientId);
  const calendar = CALENDAR_EVENTS.filter((e) => e.clientId === clientId);
  const approvals = APPROVAL_ITEMS.filter((a) => a.clientId === clientId);
  const worklist72h = pipeline.filter((p) => {
    const match = p.horizon.match(/(\d+)/);
    return match ? Number(match[1]) <= 3 : false;
  });

  const markdown = formatBriefMarkdown({
    client,
    priorities,
    pipeline,
    worklist72h,
    calendar,
    approvals,
  });

  appendAutomationReceipt(
    createAutomationReceipt({
      kind: "digest_scheduled",
      clientId,
      summary: dryRun ? `Digest dry-run composed for ${client.name}` : `Digest queued for ${client.name}`,
      metadata: {
        dryRun: String(dryRun),
        approvalGate: "required",
        byteLength: String(markdown.length),
      },
    }),
  );

  return Response.json({
    ok: true,
    clientId,
    dryRun,
    approvalRequired: true,
    briefPreviewLength: markdown.length,
    message: dryRun
      ? "Digest composed (dry-run). Publish requires founder approval — automation does not bypass gates."
      : "Digest queued for approval review before send.",
  });
}
