import { describe, expect, it } from "vitest";
import { buildDedupeKey, ingestCandidate, type InboundPayload } from "../inbound";

const basePayload: InboundPayload = {
  source: "gmail",
  title: "Intro to AfDB DPI window",
  clientId: "terra_os",
  kind: "capital",
  urgency: "P1",
};

describe("inbound dedupe", () => {
  it("builds stable slug key without externalId", () => {
    expect(buildDedupeKey(basePayload)).toBe("terra_os:intro-to-afdb-dpi-window");
  });

  it("prefers externalId when present", () => {
    const key = buildDedupeKey({ ...basePayload, externalId: "msg-123" });
    expect(key).toBe("terra_os:gmail:msg-123");
  });

  it("marks second ingest as duplicate", () => {
    const first = ingestCandidate(basePayload, []);
    const second = ingestCandidate(basePayload, [first.candidate]);
    expect(first.duplicate).toBe(false);
    expect(second.duplicate).toBe(true);
    expect(second.candidate.status).toBe("duplicate");
  });
});
