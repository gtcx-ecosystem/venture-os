import type { WorkflowConstraints, WorkflowId } from "./workflows";

export type SelectionReceipt = {
  id: string;
  timestamp: string;
  actor: string;
  workflowId: WorkflowId;
  toolId: string;
  toolName: string;
  rankScore: number;
  rationale: string[];
  constraints: WorkflowConstraints;
};

export function createSelectionReceipt(input: {
  workflowId: WorkflowId;
  toolId: string;
  toolName: string;
  rankScore: number;
  rationale: string[];
  constraints: WorkflowConstraints;
  actor?: string;
}): SelectionReceipt {
  return {
    id: `receipt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    actor: input.actor ?? "founder",
    workflowId: input.workflowId,
    toolId: input.toolId,
    toolName: input.toolName,
    rankScore: input.rankScore,
    rationale: input.rationale,
    constraints: input.constraints,
  };
}
