import { z } from "zod";
import registry from "../../../docs/operations/workflows/newsletter-source-registry.json";
import { createAutomationReceipt } from "./receipts";
import { appendAutomationReceipt, getAutomationReceipts } from "./store";

export const newsletterSendSchema = z.object({
  clientId: z.string().min(1),
  approvalId: z.string().min(1).max(120),
  approvalStatus: z.literal("approved"),
  subject: z.string().min(1).max(300),
  bodyHtml: z.string().min(1).max(50000),
  briefId: z.string().max(120).optional(),
  listmonkListId: z.number().int().positive().optional(),
  dryRun: z.boolean().optional(),
});

export type NewsletterSendPayload = z.infer<typeof newsletterSendSchema>;

export type ListmonkCampaignDraft = {
  name: string;
  subject: string;
  lists: number[];
  type: "regular";
  content_type: "html";
  body: string;
  messenger: "email";
  send_at: string | null;
};

type ClientRegistry = {
  listmonkListId?: number;
  defaultSubjectPrefix?: string;
};

const clientRegistry = registry.clients as Record<string, ClientRegistry>;

export function resolveListmonkListId(clientId: string, override?: number) {
  if (override) return override;
  return clientRegistry[clientId]?.listmonkListId ?? null;
}

export function buildListmonkCampaignDraft(
  payload: NewsletterSendPayload,
  listId: number,
): ListmonkCampaignDraft {
  const prefix = clientRegistry[payload.clientId]?.defaultSubjectPrefix;
  const subject = prefix && !payload.subject.startsWith(prefix) ? `${prefix} ${payload.subject}` : payload.subject;

  return {
    name: `venture-${payload.clientId}-${Date.now()}`,
    subject,
    lists: [listId],
    type: "regular",
    content_type: "html",
    body: payload.bodyHtml,
    messenger: "email",
    send_at: null,
  };
}

export function processNewsletterSend(payload: NewsletterSendPayload) {
  const dryRun = payload.dryRun ?? true;
  const listId = resolveListmonkListId(payload.clientId, payload.listmonkListId);

  if (!listId) {
    return {
      ok: false as const,
      error: `No Listmonk list configured for clientId: ${payload.clientId}`,
    };
  }

  const campaign = buildListmonkCampaignDraft(payload, listId);

  appendAutomationReceipt(
    createAutomationReceipt({
      kind: dryRun ? "newsletter_dry_run" : "newsletter_scheduled",
      actor: "venture-os",
      clientId: payload.clientId,
      summary: dryRun
        ? `Newsletter dry-run composed for ${payload.clientId}`
        : `Newsletter queued for ${payload.clientId}`,
      metadata: {
        approvalId: payload.approvalId,
        briefId: payload.briefId ?? "",
        listmonkListId: String(listId),
        dryRun: String(dryRun),
        subject: campaign.subject,
      },
    }),
  );

  return {
    ok: true as const,
    dryRun,
    clientId: payload.clientId,
    listmonkListId: listId,
    campaign,
    listmonkEndpoint: dryRun ? null : buildListmonkEndpoint(),
    approvalRequired: !dryRun,
    message: dryRun
      ? "Newsletter composed (Listmonk dry-run). Live send requires founder approval and LISTMONK_* credentials."
      : "Newsletter payload ready for Listmonk API — verify approval gate before dispatch.",
    receipts: getAutomationReceipts().slice(0, 20),
  };
}

function buildListmonkEndpoint() {
  const base = process.env.LISTMONK_URL;
  if (!base) return null;
  return `${base.replace(/\/$/, "")}/api/campaigns`;
}
