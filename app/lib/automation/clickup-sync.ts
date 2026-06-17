import { z } from "zod";
import type { Opportunity } from "@/lib/mock";
import { OPPORTUNITIES } from "@/lib/mock";
import { createAutomationReceipt } from "./receipts";
import { appendAutomationReceipt, getAutomationReceipts } from "./store";

export const CLICKUP_STATUSES = [
  "Inbox",
  "Qualified",
  "Outreach Ready",
  "Contacted",
  "Meeting Scheduled",
  "Diligence",
  "Proposal Submitted",
  "Won",
  "Lost / Parked",
] as const;

export type ClickUpStatus = (typeof CLICKUP_STATUSES)[number];

export type ClickUpTaskDraft = {
  name: string;
  description: string;
  status: ClickUpStatus;
  custom_fields: {
    desk: string;
    priority: string;
    fit_score: number;
    horizon: string;
    venture_opportunity_id: string;
  };
  list_id: string;
};

const KIND_TO_DESK: Record<Opportunity["kind"], string> = {
  capital: "Capital",
  revenue: "Growth",
  partner: "Partnerships",
  visibility: "Visibility",
  collateral: "Collateral",
};

export function parseFitScore(fit: string) {
  const match = fit.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

export function inferClickUpStatus(opportunity: Opportunity): ClickUpStatus {
  if (opportunity.priority === "P1") return "Qualified";
  return "Inbox";
}

export function mapOpportunityToClickUpTask(opportunity: Opportunity): ClickUpTaskDraft {
  return {
    name: opportunity.headline,
    description: opportunity.description,
    status: inferClickUpStatus(opportunity),
    custom_fields: {
      desk: KIND_TO_DESK[opportunity.kind],
      priority: opportunity.priority,
      fit_score: parseFitScore(opportunity.fit),
      horizon: opportunity.horizon,
      venture_opportunity_id: opportunity.id,
    },
    list_id: process.env.CLICKUP_LIST_ID ?? "venture-opportunities-stub",
  };
}

export const clickUpSyncSchema = z.object({
  clientId: z.string().min(1),
  opportunityIds: z.array(z.string()).optional(),
  dryRun: z.boolean().optional(),
});

export type ClickUpSyncPayload = z.infer<typeof clickUpSyncSchema>;

export function listOpportunitiesForClient(clientId: string) {
  return OPPORTUNITIES.filter((item) => item.clientId === clientId);
}

export function processClickUpSync(payload: ClickUpSyncPayload) {
  const dryRun = payload.dryRun ?? true;
  const pool = listOpportunitiesForClient(payload.clientId);
  const selected =
    payload.opportunityIds && payload.opportunityIds.length > 0
      ? pool.filter((item) => payload.opportunityIds!.includes(item.id))
      : pool;

  if (selected.length === 0) {
    return { ok: false as const, error: `No opportunities for clientId: ${payload.clientId}` };
  }

  const tasks = selected.map(mapOpportunityToClickUpTask);

  appendAutomationReceipt(
    createAutomationReceipt({
      kind: dryRun ? "clickup_sync_dry_run" : "clickup_sync_scheduled",
      actor: "venture-os",
      clientId: payload.clientId,
      summary: dryRun
        ? `ClickUp dry-run: ${tasks.length} task draft(s) for ${payload.clientId}`
        : `ClickUp sync queued: ${tasks.length} task(s)`,
      metadata: {
        dryRun: String(dryRun),
        count: String(tasks.length),
        listId: tasks[0]?.list_id ?? "",
      },
    }),
  );

  return {
    ok: true as const,
    dryRun,
    clientId: payload.clientId,
    tasks,
    clickupEndpoint: dryRun ? null : buildClickUpEndpoint(),
    message: dryRun
      ? "ClickUp task drafts composed (dry-run). Set CLICKUP_API_TOKEN + CLICKUP_LIST_ID for live sync."
      : "Tasks ready for ClickUp API — verify list id before dispatch.",
    receipts: getAutomationReceipts().slice(0, 20),
  };
}

function buildClickUpEndpoint() {
  const listId = process.env.CLICKUP_LIST_ID;
  if (!listId) return null;
  return `https://api.clickup.com/api/v2/list/${listId}/task`;
}
