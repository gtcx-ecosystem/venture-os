import { describe, expect, it, beforeEach } from "vitest";
import { buildListmonkCampaignDraft, processNewsletterSend } from "../newsletter-send";
import { getAutomationReceipts, resetAutomationStoreForTests } from "../store";

describe("newsletter send rail", () => {
  beforeEach(() => {
    resetAutomationStoreForTests();
  });

  it("builds Listmonk campaign draft with client subject prefix", () => {
    const campaign = buildListmonkCampaignDraft(
      {
        clientId: "terra_os",
        approvalId: "appr-1",
        approvalStatus: "approved",
        subject: "June investor pulse",
        bodyHtml: "<p>Highlights</p>",
      },
      1,
    );
    expect(campaign.subject).toBe("[Terra OS] June investor pulse");
    expect(campaign.lists).toEqual([1]);
    expect(campaign.content_type).toBe("html");
  });

  it("dry-runs newsletter send with automation receipt", () => {
    const result = processNewsletterSend({
      clientId: "terminal_os",
      approvalId: "appr-2",
      approvalStatus: "approved",
      subject: "Commodity brief",
      bodyHtml: "<p>Weekly signals</p>",
      dryRun: true,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.dryRun).toBe(true);
      expect(result.listmonkListId).toBe(2);
    }
    expect(getAutomationReceipts()[0]?.kind).toBe("newsletter_dry_run");
  });

  it("rejects unknown client without list mapping", () => {
    const result = processNewsletterSend({
      clientId: "unknown_client",
      approvalId: "appr-3",
      approvalStatus: "approved",
      subject: "Test",
      bodyHtml: "<p>x</p>",
    });
    expect(result.ok).toBe(false);
  });
});
