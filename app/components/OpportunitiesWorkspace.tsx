"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Opportunity } from "@/lib/mock";
import { getClient, getClientLabel } from "@/lib/clients";
import { getClientVisualTheme } from "@/lib/client-visual";
import { useOpportunities } from "@/lib/hooks/useOpportunities";
import { EvidenceChip } from "./EvidenceChip";
import { useWorkspace } from "./WorkspaceProvider";
import {
  SkeletonOpportunityGrid,
  WorkspaceEmptyState,
  WorkspaceErrorState,
} from "./workspace/WorkspaceStates";

type SyncResult = {
  ok: boolean;
  dryRun?: boolean;
  tasks?: { name: string; status: string }[];
  message?: string;
};

function BoardCard({ opportunity }: { opportunity: Opportunity }) {
  const theme = getClientVisualTheme(opportunity.clientId);

  return (
    <article className="review-card opportunity-board-card" data-client={opportunity.clientId}>
      <div className={`board-card-accent board-card-accent--${theme.motif}`} aria-hidden="true" />
      <div className="review-topline">
        <span>{opportunity.priority}</span>
        <strong>{opportunity.horizon}</strong>
      </div>
      <p>{opportunity.headline}</p>
      <p className="board-card-fit">{opportunity.fit}</p>
      <EvidenceChip status={opportunity.evidenceStatus} refPath={opportunity.evidenceRef} />
    </article>
  );
}

export function OpportunitiesWorkspace() {
  const router = useRouter();
  const { selectedClientId } = useWorkspace();
  const client = getClient(selectedClientId);
  const clientVisual = getClientVisualTheme(selectedClientId);
  const { opportunities, loading, error, reload } = useOpportunities(selectedClientId);
  const [syncResult, setSyncResult] = useState<string | null>(null);

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
          <div className="eyebrow">
            Phase 4 · Opportunities
            <span className={`client-identity client-identity--${clientVisual.motif}`}>
              {getClientLabel(selectedClientId)} · {clientVisual.shortLabel}
            </span>
          </div>
          <h1>Venture opportunities board</h1>
          <p>
            Qualified leads across capital, revenue, partners, and visibility — ClickUp sync stub
            (dry-run).
          </p>
        </div>
        <button className="small-button" type="button" onClick={syncToClickUp} disabled={loading}>
          ClickUp sync (dry-run)
        </button>
      </section>
      {syncResult ? <p className="sync-banner">{syncResult}</p> : null}

      {loading ? (
        <section className="content-grid content-grid--single" aria-label="Opportunity board loading">
          <SkeletonOpportunityGrid count={3} />
        </section>
      ) : error ? (
        <WorkspaceErrorState message={error} onRetry={reload} />
      ) : opportunities.length === 0 ? (
        <WorkspaceEmptyState
          title="Board is empty"
          detail={`No opportunities for ${client?.name ?? selectedClientId}. Add sources or run intake before syncing to ClickUp.`}
          actionLabel="Open sources"
          onAction={() => router.push("/sources")}
        />
      ) : (
        <section className="content-grid" aria-label="Opportunity board">
          {Array.from(grouped.entries()).map(([kind, items]) => (
            <div key={kind} className="board-column">
              <div className="column-heading">
                <h2>{kind}</h2>
                <span className="section-label">{items.length}</span>
              </div>
              <div className="review-stack">
                {items.map((opp) => (
                  <BoardCard key={opp.id} opportunity={opp} />
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
