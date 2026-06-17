"use client";

import { useEffect, useState } from "react";

type InboundCandidate = {
  id: string;
  dedupeKey: string;
  receivedAt: string;
  status: "new" | "duplicate";
  payload: {
    source: string;
    title: string;
    clientId: string;
    urgency?: string;
  };
};

type AutomationReceipt = {
  id: string;
  timestamp: string;
  kind: string;
  summary: string;
};

export function InboundQueue(props: { clientId?: string; sourceFilter?: string }) {
  const [candidates, setCandidates] = useState<InboundCandidate[]>([]);
  const [receipts, setReceipts] = useState<AutomationReceipt[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const query = props.clientId ? `?clientId=${encodeURIComponent(props.clientId)}` : "";

    fetch(`/api/venture/inbound${query}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<{ candidates: InboundCandidate[]; receipts: AutomationReceipt[] }>;
      })
      .then((data) => {
        if (cancelled) return;
        const filtered =
          props.sourceFilter && props.sourceFilter !== "all"
            ? data.candidates.filter((item) => item.payload.source === props.sourceFilter)
            : data.candidates;
        setCandidates(filtered);
        setReceipts(data.receipts);
        setError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Could not load inbound queue.");
      });

    return () => {
      cancelled = true;
    };
  }, [props.clientId, props.sourceFilter, reloadToken]);

  return (
    <section className="content-grid" aria-label="Inbound automation queue">
      <div className="board-column">
        <div className="column-heading">
          <h2>Inbound candidates</h2>
          <button className="small-button" type="button" onClick={() => setReloadToken((n) => n + 1)}>
            Refresh
          </button>
        </div>
        {error ? <p style={{ color: "var(--muted)" }}>{error}</p> : null}
        <div className="review-stack">
          {candidates.length === 0 ? (
            <article className="review-card">
              <p>No inbound candidates yet. POST to <code>/api/venture/inbound</code> from n8n.</p>
            </article>
          ) : (
            candidates.map((item) => (
              <article key={item.id} className="review-card">
                <div className="review-topline">
                  <span>{item.payload.source}</span>
                  <strong>{item.payload.urgency ?? "P2"}</strong>
                </div>
                <p>{item.payload.title}</p>
                <p style={{ color: "var(--muted)", fontSize: 12 }}>
                  {item.payload.clientId} · {new Date(item.receivedAt).toLocaleString()}
                </p>
              </article>
            ))
          )}
        </div>
      </div>
      <aside className="agent-panel" aria-label="Automation receipts">
        <div className="agent-header">
          <div>
            <div className="section-label">Automation</div>
            <h2>Receipt log</h2>
          </div>
        </div>
        <div className="review-stack">
          {receipts.map((receipt) => (
            <article key={receipt.id} className="review-card">
              <div className="review-topline">
                <span>{receipt.kind}</span>
                <strong>{new Date(receipt.timestamp).toLocaleTimeString()}</strong>
              </div>
              <p>{receipt.summary}</p>
            </article>
          ))}
        </div>
      </aside>
    </section>
  );
}
