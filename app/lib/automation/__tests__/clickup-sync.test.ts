import { describe, expect, it, beforeEach } from "vitest";
import {
  inferClickUpStatus,
  listOpportunitiesForClient,
  mapOpportunityToClickUpTask,
  processClickUpSync,
} from "../clickup-sync";
import { getAutomationReceipts, resetAutomationStoreForTests } from "../store";

describe("clickup sync stub", () => {
  beforeEach(() => {
    resetAutomationStoreForTests();
  });

  it("maps opportunity to ClickUp task draft", () => {
    const [opp] = listOpportunitiesForClient("terra_os");
    const task = mapOpportunityToClickUpTask(opp);
    expect(task.name).toBe(opp.headline);
    expect(task.custom_fields.desk).toBe("Capital");
    expect(task.custom_fields.venture_opportunity_id).toBe(opp.id);
  });

  it("infers Qualified for P1 opportunities", () => {
    const [opp] = listOpportunitiesForClient("markets_os");
    expect(inferClickUpStatus(opp)).toBe("Qualified");
  });

  it("dry-runs sync for client", () => {
    const result = processClickUpSync({ clientId: "terminal_os", dryRun: true });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.tasks.length).toBeGreaterThan(0);
      expect(result.dryRun).toBe(true);
    }
    expect(getAutomationReceipts()[0]?.kind).toBe("clickup_sync_dry_run");
  });
});
