import { z } from "zod";
import type { InboundPayload } from "./inbound";
import { processInboundRequest } from "./process-inbound";
import { isSourceEnabled, resolveClientByGmailLabel } from "./source-registry";

export const gmailSourceSchema = z.object({
  label: z.string().min(1),
  messageId: z.string().min(1).max(200),
  subject: z.string().min(1).max(500),
  snippet: z.string().max(4000).optional(),
  clientId: z.string().optional(),
});

export type GmailSourcePayload = z.infer<typeof gmailSourceSchema>;

export function mapGmailToInbound(payload: GmailSourcePayload): InboundPayload | null {
  const resolved = resolveClientByGmailLabel(payload.label);
  if (!resolved) return null;

  const clientId = payload.clientId ?? resolved.clientId;
  if (clientId !== resolved.clientId) return null;
  if (!isSourceEnabled(clientId, "gmail")) return null;

  return {
    source: "gmail",
    title: payload.subject,
    clientId,
    kind: resolved.binding.kind,
    urgency: resolved.binding.urgency,
    externalId: `gmail-${payload.messageId}`,
    body: payload.snippet ?? `Gmail label: ${payload.label}`,
  };
}

export function processGmailSource(payload: GmailSourcePayload) {
  const inbound = mapGmailToInbound(payload);
  if (!inbound) {
    return {
      ok: false as const,
      error: `Unregistered Gmail label or client mismatch: ${payload.label}`,
    };
  }
  const result = processInboundRequest(inbound);
  return { label: payload.label, messageId: payload.messageId, ...result };
}
