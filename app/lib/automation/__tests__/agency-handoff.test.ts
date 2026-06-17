import { describe, expect, it, beforeEach } from "vitest";
import { processAgencyHandoff } from "../agency-handoff";
import { getAutomationReceipts, resetAutomationStoreForTests } from "../store";

describe("agency handoff", () => {
  beforeEach(() => {
    resetAutomationStoreForTests();
  });

  it("queues handoff when brief is approved", () => {
    const result = processAgencyHandoff({
      briefId: "brief-42",
      approvalId: "appr-9",
      approvalStatus: "approved",
      clientId: "gtcx",
      title: "Q2 investor narrative refresh",
      assetTypes: ["video", "social"],
      targetRepo: "ecosystem-os/agency",
    });

    expect(result.ok).toBe(true);
    expect(result.ticket.status).toBe("queued");
    const receipt = getAutomationReceipts()[0];
    expect(receipt?.kind).toBe("agency_handoff");
    expect(receipt?.metadata.briefId).toBe("brief-42");
  });
});
