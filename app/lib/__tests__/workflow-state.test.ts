import { describe, expect, it } from "vitest";
import {
  completeIntake,
  currentWorkflowStep,
  emptyWorkflowState,
  hasBlockingApprovals,
  setApprovalStatus,
} from "../workflow-state";

describe("workflow-state", () => {
  it("blocks publish until approvals clear", () => {
    let state = completeIntake(emptyWorkflowState());
    expect(currentWorkflowStep(state, ["a1"])).toBe("approve");
    state = setApprovalStatus(state, "a1", "approved");
    expect(hasBlockingApprovals(state, ["a1"])).toBe(false);
    expect(currentWorkflowStep(state, ["a1"])).toBe("brief");
  });
});
