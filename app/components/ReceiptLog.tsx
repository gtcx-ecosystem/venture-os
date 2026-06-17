"use client";

import type { SelectionReceipt } from "@/lib/tool-registry/receipts";
import { WORKFLOW_LABELS } from "@/lib/tool-registry/workflows";

export function ReceiptLog(props: { receipts: SelectionReceipt[] }) {
  if (props.receipts.length === 0) {
    return (
      <section className="review-stack" aria-label="Selection receipts">
        <article className="review-card">
          <p>No tool selections logged yet. Rank and select a tool to create a receipt.</p>
        </article>
      </section>
    );
  }

  return (
    <section className="review-stack" aria-label="Selection receipts">
      {props.receipts.map((receipt) => (
        <article key={receipt.id} className="review-card">
          <div className="review-topline">
            <span>{WORKFLOW_LABELS[receipt.workflowId]}</span>
            <strong>{receipt.rankScore}</strong>
          </div>
          <p>
            {receipt.toolName} · {new Date(receipt.timestamp).toLocaleString()}
          </p>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>{receipt.rationale.join(" · ")}</p>
        </article>
      ))}
    </section>
  );
}
