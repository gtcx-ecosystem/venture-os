import { describe, expect, it } from "vitest";
import { createSelectionReceipt } from "../receipts";

describe("createSelectionReceipt", () => {
  it("creates a receipt with rationale and constraints", () => {
    const receipt = createSelectionReceipt({
      workflowId: "rss_ingest",
      toolId: "miniflux",
      toolName: "Miniflux",
      rankScore: 82,
      rationale: ["OSI-licensed", "Self-host capable"],
      constraints: { mustBeSelfHost: true },
      actor: "founder",
    });

    expect(receipt.toolId).toBe("miniflux");
    expect(receipt.workflowId).toBe("rss_ingest");
    expect(receipt.rationale).toHaveLength(2);
    expect(receipt.constraints.mustBeSelfHost).toBe(true);
    expect(receipt.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
