import { describe, expect, it, beforeEach } from "vitest";
import { mapGmailToInbound, processGmailSource } from "../gmail-source";
import { mapMinifluxToInbound, processMinifluxWebhook } from "../miniflux-webhook";
import {
  listSourcesForClient,
  resolveClientByFeedId,
  resolveClientByGmailLabel,
} from "../source-registry";
import { resetAutomationStoreForTests } from "../store";

describe("source registry", () => {
  it("resolves terra_os feed binding", () => {
    const resolved = resolveClientByFeedId(101);
    expect(resolved?.clientId).toBe("terra_os");
    expect(resolved?.feed.name).toBe("AfDB Press");
  });

  it("lists rss and gmail sources for client", () => {
    const sources = listSourcesForClient("nyota_ai");
    expect(sources?.rssFeeds).toHaveLength(1);
    expect(sources?.gmailLabels.length).toBeGreaterThanOrEqual(2);
  });

  it("resolves gmail label binding", () => {
    const resolved = resolveClientByGmailLabel("VO/terminal_os/inbox-opportunities");
    expect(resolved?.clientId).toBe("terminal_os");
  });
});

describe("miniflux webhook adapter", () => {
  beforeEach(() => {
    resetAutomationStoreForTests();
  });

  it("maps entry to rss inbound", () => {
    const mapped = mapMinifluxToInbound({
      feed: { id: 101 },
      entry: {
        id: 9001,
        title: "AfDB approves regional trade facility",
        url: "https://example.com/story",
      },
    });
    expect(mapped?.source).toBe("rss");
    expect(mapped?.clientId).toBe("terra_os");
    expect(mapped?.externalId).toBe("miniflux-entry-9001");
  });

  it("processes registered feed into inbound queue", () => {
    const result = processMinifluxWebhook({
      feed: { id: 301 },
      entry: { id: 42, title: "FAO crop outlook" },
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.duplicate).toBe(false);
  });
});

describe("gmail source adapter", () => {
  beforeEach(() => {
    resetAutomationStoreForTests();
  });

  it("maps labeled message to gmail inbound", () => {
    const mapped = mapGmailToInbound({
      label: "VO/terra_os/inbox-opportunities",
      messageId: "msg-abc",
      subject: "Pilot intro from DFI partner",
      snippet: "Following up on sovereign data room",
    });
    expect(mapped?.source).toBe("gmail");
    expect(mapped?.urgency).toBe("P1");
  });

  it("rejects clientId mismatch", () => {
    const mapped = mapGmailToInbound({
      label: "VO/terra_os/inbox-opportunities",
      messageId: "msg-xyz",
      subject: "Mismatch test",
      clientId: "nyota_ai",
    });
    expect(mapped).toBeNull();
  });

  it("processes gmail source into inbound queue", () => {
    const result = processGmailSource({
      label: "VO/nyota_ai/diligence",
      messageId: "msg-77",
      subject: "Data room follow-up",
    });
    expect(result.ok).toBe(true);
  });
});
