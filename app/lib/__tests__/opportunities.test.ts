import { describe, expect, it } from "vitest";
import { OPPORTUNITIES } from "../mock";
import { computePipelineMetrics } from "../opportunities";

describe("opportunities", () => {
  it("computes pipeline metrics from client opportunities", () => {
    const terra = OPPORTUNITIES.filter((o) => o.clientId === "terra_os");
    const metrics = computePipelineMetrics(terra);
    expect(metrics.qualified).toBe(2);
    expect(metrics.p1Moves).toBe(1);
    expect(metrics.approvalsPending).toBeGreaterThan(0);
  });

  it("includes evidence status on every opportunity", () => {
    for (const opp of OPPORTUNITIES) {
      expect(opp.evidenceStatus).toMatch(/verified|needs_proof|blocked/);
    }
  });
});
