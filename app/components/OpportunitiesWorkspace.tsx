"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Opportunity } from "@/lib/mock";
import { useWorkspace } from "./WorkspaceProvider";

type SyncResult = {
  ok: boolean;
  dryRun?: boolean;
  tasks?: { name: string; status: string }[];
  message?: string;
};

export function OpportunitiesWorkspace() {
  const { selectedClientId } = useWorkspace();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch(`/api/venture/opportunities?clientId=${encodeURIComponent(selectedClientId)}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<{ opportunities: Opportunity[] }>;
      })
      .then((data) => {
        setOpportunities(data.opportunities);
        setError(null);
      })
      .catch(() => setError("Could not load opportunities."));
  }, [selectedClientId]);

  useEffect(() => {
    load();
  }, [load]);

  const grouped = useMemo(() => {
    const map = new Map<string, Opportunity[]>();
    for (const opp of opportunities) {
      const bucket = map.get(opp.kind) ?? [];
      bucket.push(opp);
      map.set(opp.kind, bucket);
    }
    return map;
  }, [opportunities]);

  function syncToClickUp() {
    fetch("/api/venture/opportunities/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: selectedClientId, dryRun: true }),
    })
      .then((response) => response.json() as Promise<SyncResult>)
      .then((data) => {
        if (!data.ok) {
          setSyncResult("Sync failed.");
          return;
        }
        setSyncResult(data.message ?? `Queued ${data.tasks?.length ?? 0} ClickUp task draft(s).`);
      })
      .catch(() => setSyncResult("Sync request failed."));
  }

  return (
    <>
      <section className="hero-panel" aria-label="Opportunities intro">
        <div className="hero-copy">
          <div className="eyebrow">Phase 4 · Opportunities</div>
          <h1>Venture opportunities board</h1>
          <p>Qualified leads across capital, revenue, partners, and visibility — ClickUp sync stub (dry-run).</p>
        </div>
        <button className="small-button" type="button" onClick={syncToClickUp}>
          ClickUp sync (dry-run)
        </button>
      </section>
      {syncResult ? <p style={{ color: "var(--muted)", marginBottom: 12 }}>{syncResult}</p> : null}
      {error ? <p style={{ color: "var(--muted)" }}>{error}</p> : null}
      <section className="content-grid" aria-label="Opportunity board">
        {Array.from(grouped.entries()).map(([kind, items]) => (
          <div key={kind} className="board-column">
            <div className="column-heading">
              <h2>{kind}</h2>
              <span className="section-label">{items.length}</span>
            </div>
            <div className="review-stack">
              {items.map((opp) => (
                <article key={opp.id} className="review-card">
                  <div className="review-topline">
                    <span>{opp.priority}</span>
                    <strong>{opp.horizon}</strong>
                  </div>
                  <p>{opp.headline}</p>
                  <p style={{ color: "var(--muted)", fontSize: 12 }}>{opp.fit}</p>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
