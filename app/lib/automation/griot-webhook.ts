import { z } from "zod";
import type { InboundPayload } from "./inbound";
import { processInboundRequest } from "./process-inbound";

export const griotWebhookSchema = z.object({
  event: z.enum(["signal.created", "content.published", "score.updated"]),
  data: z.object({
    pieceId: z.string().optional(),
    signalId: z.string().optional(),
    title: z.string().optional(),
    headline: z.string().optional(),
    clientId: z.string().optional(),
    country: z.string().optional(),
    iso: z.string().optional(),
    summary: z.string().optional(),
    source: z.string().optional(),
  }),
});

export type GriotWebhookPayload = z.infer<typeof griotWebhookSchema>;

export function mapGriotWebhookToInbound(payload: GriotWebhookPayload): InboundPayload | null {
  const { event, data } = payload;
  const title = data.title ?? data.headline ?? data.summary;
  if (!title) return null;

  const clientId = data.clientId ?? "terminal_os";
  const externalId = data.pieceId ?? data.signalId ?? `${event}-${title.slice(0, 40)}`;

  const kind =
    event === "content.published"
      ? ("visibility" as const)
      : event === "score.updated"
        ? ("capital" as const)
        : ("partner" as const);

  return {
    source: "griot",
    title,
    clientId,
    kind,
    urgency: event === "signal.created" ? "P1" : "P2",
    externalId,
    body: data.summary ?? `Griot event: ${event}${data.iso ? ` · ${data.iso}` : ""}`,
  };
}

export function processGriotWebhook(payload: GriotWebhookPayload) {
  const inbound = mapGriotWebhookToInbound(payload);
  if (!inbound) {
    return { ok: false as const, error: "Missing title/headline in Griot payload" };
  }
  const result = processInboundRequest(inbound);
  return { event: payload.event, ...result };
}
