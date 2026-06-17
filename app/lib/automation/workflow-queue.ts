import { z } from "zod";
import type { ReviewCard } from "@/lib/mock";
import { createAutomationReceipt } from "./receipts";
import { appendAutomationReceipt, getAutomationReceipts } from "./store";

export const workflowQueueSchema = z.object({
  clientId: z.string().min(1),
  prompt: z.string().min(1).max(4000),
});

export type WorkflowQueuePayload = z.infer<typeof workflowQueueSchema>;

export function processWorkflowQueue(payload: WorkflowQueuePayload) {
  const receipt = createAutomationReceipt({
    kind: "workflow_queued",
    actor: "venture-os-ui",
    clientId: payload.clientId,
    summary: `Workflow queued for ${payload.clientId}`,
    metadata: {
      prompt: payload.prompt.slice(0, 240),
      authorityClass: "R",
    },
  });

  appendAutomationReceipt(receipt);

  const reviews: ReviewCard[] = [
    {
      id: receipt.id,
      agent: "Chief of Staff Agent",
      status: "Queued",
      body: `Workflow queued (receipt ${receipt.id}). Routes to Capital Desk, Claims Review, and Collateral Factory.`,
      highlighted: true,
    },
    {
      id: "claims",
      agent: "Claims Reviewer",
      status: "Needs proof",
      body: "Claims in queued workflow require evidence links before external publish.",
      evidenceRef: "docs/foundation/milestones.md#m4-golden-transaction",
    },
    {
      id: "visibility",
      agent: "Visibility Desk",
      status: "Standby",
      body: "Collateral and visibility tasks activate after claims review passes.",
    },
  ];

  return {
    ok: true as const,
    receipt,
    reviews,
    receipts: getAutomationReceipts().slice(0, 10),
  };
}
