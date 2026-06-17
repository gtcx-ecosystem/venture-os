import { z } from "zod";
import type { InboundPayload } from "./inbound";
import { processInboundRequest } from "./process-inbound";
import { isSourceEnabled, resolveClientByFeedId } from "./source-registry";

export const minifluxWebhookSchema = z.object({
  feed: z.object({
    id: z.number().int().positive(),
    title: z.string().optional(),
  }),
  entry: z.object({
    id: z.number().int().positive(),
    title: z.string().min(1),
    url: z.string().url().optional(),
    content: z.string().max(4000).optional(),
    author: z.string().optional(),
  }),
});

export type MinifluxWebhookPayload = z.infer<typeof minifluxWebhookSchema>;

export function mapMinifluxToInbound(payload: MinifluxWebhookPayload): InboundPayload | null {
  const resolved = resolveClientByFeedId(payload.feed.id);
  if (!resolved) return null;
  if (!isSourceEnabled(resolved.clientId, "rss")) return null;

  const bodyParts = [
    payload.entry.content,
    payload.entry.url ? `Source: ${payload.entry.url}` : null,
    payload.entry.author ? `Author: ${payload.entry.author}` : null,
  ].filter(Boolean);

  return {
    source: "rss",
    title: payload.entry.title,
    clientId: resolved.clientId,
    kind: resolved.feed.kind,
    urgency: resolved.feed.urgency,
    externalId: `miniflux-entry-${payload.entry.id}`,
    body: bodyParts.join("\n").slice(0, 4000) || `RSS: ${resolved.feed.name}`,
  };
}

export function processMinifluxWebhook(payload: MinifluxWebhookPayload) {
  const inbound = mapMinifluxToInbound(payload);
  if (!inbound) {
    return {
      ok: false as const,
      error: `Unregistered Miniflux feed id: ${payload.feed.id}`,
    };
  }
  const result = processInboundRequest(inbound);
  return { feedId: payload.feed.id, entryId: payload.entry.id, ...result };
}
