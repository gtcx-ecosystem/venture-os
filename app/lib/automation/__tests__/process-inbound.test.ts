import { describe, expect, it, beforeEach } from "vitest";
import { processInboundRequest } from "../process-inbound";
import { resetAutomationStoreForTests } from "@/lib/automation/store";

describe("processInboundRequest", () => {
  beforeEach(() => {
    resetAutomationStoreForTests();
  });

  it("captures new inbound and records receipt", () => {
    const result = processInboundRequest({
      source: "n8n",
      title: "Warm intro from partner",
      clientId: "terra_os",
    });
    expect(result.duplicate).toBe(false);
    expect(result.candidate.status).toBe("new");
    expect(result.queueSize).toBe(1);
  });

  it("skips duplicate with dedupe receipt", () => {
    processInboundRequest({ source: "rss", title: "Same signal", clientId: "terra_os" });
    const second = processInboundRequest({ source: "rss", title: "Same signal", clientId: "terra_os" });
    expect(second.duplicate).toBe(true);
    expect(second.queueSize).toBe(1);
  });
});
