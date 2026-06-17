export type WorkflowStep = "intake" | "brief" | "approve" | "publish";

export type ApprovalStatus = "pending" | "approved" | "held";

export type ClientWorkflowState = {
  intakeComplete: boolean;
  intakeCompletedAt?: string;
  approvalStatuses: Record<string, ApprovalStatus>;
  publishedAt?: string;
};

export function emptyWorkflowState(): ClientWorkflowState {
  return { intakeComplete: false, approvalStatuses: {} };
}

export function completeIntake(state: ClientWorkflowState): ClientWorkflowState {
  return {
    ...state,
    intakeComplete: true,
    intakeCompletedAt: new Date().toISOString(),
  };
}

export function setApprovalStatus(
  state: ClientWorkflowState,
  approvalId: string,
  status: ApprovalStatus,
): ClientWorkflowState {
  return {
    ...state,
    approvalStatuses: { ...state.approvalStatuses, [approvalId]: status },
  };
}

export function hasBlockingApprovals(
  state: ClientWorkflowState,
  approvalIds: string[],
): boolean {
  return approvalIds.some((id) => {
    const status = state.approvalStatuses[id];
    return !status || status === "pending" || status === "held";
  });
}

export function markPublished(state: ClientWorkflowState): ClientWorkflowState {
  return { ...state, publishedAt: new Date().toISOString() };
}

export function currentWorkflowStep(
  state: ClientWorkflowState,
  approvalIds: string[],
): WorkflowStep {
  if (!state.intakeComplete) return "intake";
  if (hasBlockingApprovals(state, approvalIds)) return "approve";
  if (state.publishedAt) return "publish";
  return "brief";
}
