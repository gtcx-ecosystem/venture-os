import type { Opportunity } from "./mock";

export type PipelineMetrics = {
  qualified: number;
  p1Moves: number;
  approvalsPending: number;
};

export function computePipelineMetrics(opportunities: Opportunity[]): PipelineMetrics {
  const qualified = opportunities.filter((o) => o.priority === "P1" || o.priority === "P2").length;
  const p1Moves = opportunities.filter((o) => o.priority === "P1").length;
  const approvalsPending = opportunities.filter(
    (o) => o.evidenceStatus === "needs_proof" || o.evidenceStatus === "blocked",
  ).length;
  return { qualified, p1Moves, approvalsPending };
}

export function evidenceStatusLabel(status: Opportunity["evidenceStatus"]) {
  switch (status) {
    case "verified":
      return "Verified";
    case "needs_proof":
      return "Needs proof";
    case "blocked":
      return "Blocked";
  }
}
