import { z } from "zod";

export const inboundPayloadSchema = z.object({
  source: z.enum(["gmail", "rss", "manual", "n8n", "calendar"]),
  title: z.string().min(1).max(500),
  clientId: z.string().min(1),
  kind: z.enum(["capital", "revenue", "partner", "visibility", "collateral"]).optional(),
  urgency: z.enum(["P1", "P2", "P3"]).optional(),
  externalId: z.string().max(200).optional(),
  body: z.string().max(4000).optional(),
});

export type InboundPayload = z.infer<typeof inboundPayloadSchema>;

export type InboundCandidateStatus = "new" | "duplicate";

export type InboundCandidate = {
  id: string;
  dedupeKey: string;
  receivedAt: string;
  status: InboundCandidateStatus;
  payload: InboundPayload;
};

export function buildDedupeKey(payload: InboundPayload): string {
  if (payload.externalId) {
    return `${payload.clientId}:${payload.source}:${payload.externalId}`;
  }
  const slug = payload.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  return `${payload.clientId}:${slug}`;
}

export function ingestCandidate(
  payload: InboundPayload,
  existing: InboundCandidate[],
): { candidate: InboundCandidate; duplicate: boolean } {
  const dedupeKey = buildDedupeKey(payload);
  const duplicate = existing.some((item) => item.dedupeKey === dedupeKey && item.status === "new");
  const candidate: InboundCandidate = {
    id: `inbound-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    dedupeKey,
    receivedAt: new Date().toISOString(),
    status: duplicate ? "duplicate" : "new",
    payload,
  };
  return { candidate, duplicate };
}

export function listNewCandidates(candidates: InboundCandidate[], clientId?: string) {
  return candidates.filter(
    (item) => item.status === "new" && (!clientId || item.payload.clientId === clientId),
  );
}
