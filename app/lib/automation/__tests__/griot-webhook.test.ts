import { describe, expect, it, beforeEach } from "vitest";
import { mapGriotWebhookToInbound, processGriotWebhook } from "../griot-webhook";
import { resetAutomationStoreForTests } from "../store";

describe("griot webhook adapter", () => {
  beforeEach(() => {
    resetAutomationStoreForTests();
  });

  it("maps signal.created to inbound payload", () => {
    const mapped = mapGriotWebhookToInbound({
      event: "signal.created",
      data: {
        signalId: "sig-1",
        headline: "Ghana cocoa export rule change",
        iso: "GHA",
      },
    });
    expect(mapped?.source).toBe("griot");
    expect(mapped?.clientId).toBe("terminal_os");
    expect(mapped?.externalId).toBe("sig-1");
  });

  it("processes content.published into inbound queue", () => {
    const result = processGriotWebhook({
      event: "content.published",
      data: {
        pieceId: "piece-99",
        title: "Weekly commodity brief",
        clientId: "griot_ai",
      },
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.duplicate).toBe(false);
      expect(result.candidate.payload.clientId).toBe("griot_ai");
    }
  });
});
