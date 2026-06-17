import { createAutomationReceipt } from "./receipts";
import { ingestCandidate, listNewCandidates, type InboundPayload } from "./inbound";
import {
  appendAutomationReceipt,
  appendInboundCandidate,
  getAutomationReceipts,
  getInboundCandidates,
} from "./store";

export function processInboundRequest(payload: InboundPayload) {
  const existing = getInboundCandidates();
  const { candidate, duplicate } = ingestCandidate(payload, existing);
  appendInboundCandidate(candidate);

  if (duplicate) {
    appendAutomationReceipt(
      createAutomationReceipt({
        kind: "dedupe_skip",
        clientId: payload.clientId,
        summary: `Duplicate inbound skipped: ${payload.title}`,
        metadata: { dedupeKey: candidate.dedupeKey, source: payload.source },
      }),
    );
  } else {
    appendAutomationReceipt(
      createAutomationReceipt({
        kind: "inbound_capture",
        clientId: payload.clientId,
        summary: `Inbound captured: ${payload.title}`,
        metadata: { source: payload.source, candidateId: candidate.id },
      }),
    );
  }

  return {
    ok: true as const,
    candidate,
    duplicate,
    queueSize: listNewCandidates(getInboundCandidates(), payload.clientId).length,
    receipts: getAutomationReceipts().slice(0, 20),
  };
}
