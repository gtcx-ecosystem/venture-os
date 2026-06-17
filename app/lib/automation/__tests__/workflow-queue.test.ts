import { describe, expect, it, beforeEach } from "vitest";
import { processWorkflowQueue } from "../workflow-queue";
import { resetAutomationStoreForTests } from "../store";

describe("workflow-queue", () => {
  beforeEach(() => {
    resetAutomationStoreForTests();
  });

  it("creates automation receipt and review cards", () => {
    const result = processWorkflowQueue({
      clientId: "terra_os",
      prompt: "Create TerraOS DFI concept note",
    });
    expect(result.ok).toBe(true);
    expect(result.receipt.kind).toBe("workflow_queued");
    expect(result.receipt.clientId).toBe("terra_os");
    expect(result.reviews[0]?.highlighted).toBe(true);
    expect(result.receipts[0]?.id).toBe(result.receipt.id);
  });
});
