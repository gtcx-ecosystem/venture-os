"use client";

import type { AutomationReceipt } from "@/lib/automation/receipts";

export function AutomationReceiptLog(props: { receipts: AutomationReceipt[] }) {
  if (props.receipts.length === 0) {
    return (
      <section className="review-stack" aria-label="Automation receipts">
        <article className="review-card">
          <p>No automation receipts yet. Queue a workflow to create one.</p>
        </article>
      </section>
    );
  }

  return (
    <section className="review-stack" aria-label="Automation receipts">
      {props.receipts.map((receipt) => (
        <article key={receipt.id} className="review-card">
          <div className="review-topline">
            <span>{receipt.kind.replace(/_/g, " ")}</span>
            <strong>{receipt.metadata.authorityClass ?? "R"}</strong>
          </div>
          <p>{receipt.summary}</p>
          <p style={{ color: "var(--muted)", fontSize: 12, fontFamily: "var(--font-mono)" }}>{receipt.id}</p>
        </article>
      ))}
    </section>
  );
}
