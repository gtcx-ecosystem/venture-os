import { z } from "zod";
import { createAutomationReceipt } from "./receipts";
import { appendAutomationReceipt, getAutomationReceipts } from "./store";

export const agencyHandoffSchema = z.object({
  briefId: z.string().min(1).max(120),
  approvalId: z.string().min(1).max(120),
  approvalStatus: z.literal("approved"),
  clientId: z.string().min(1),
  title: z.string().min(1).max(500),
  body: z.string().max(8000).optional(),
  assetTypes: z.array(z.enum(["video", "social", "deck", "email"])).min(1),
  targetRepo: z.literal("ecosystem-os/agency").default("ecosystem-os/agency"),
  channels: z.array(z.string()).optional(),
});

export type AgencyHandoffPayload = z.infer<typeof agencyHandoffSchema>;

export type AgencyHandoffTicket = {
  id: string;
  createdAt: string;
  status: "queued";
  payload: AgencyHandoffPayload;
  handoffUrl: string;
};

export function processAgencyHandoff(payload: AgencyHandoffPayload) {
  const ticket: AgencyHandoffTicket = {
    id: `agency-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    status: "queued",
    payload,
    handoffUrl: `https://github.com/gtcx-ecosystem/ecosystem-os/tree/main/docs/agency`,
  };

  appendAutomationReceipt(
    createAutomationReceipt({
      kind: "agency_handoff",
      actor: "venture-os",
      clientId: payload.clientId,
      summary: `Agency handoff queued: ${payload.title}`,
      metadata: {
        ticketId: ticket.id,
        briefId: payload.briefId,
        approvalId: payload.approvalId,
        assetTypes: payload.assetTypes.join(","),
        targetRepo: payload.targetRepo,
      },
    }),
  );

  return {
    ok: true as const,
    ticket,
    receipts: getAutomationReceipts().slice(0, 20),
  };
}
