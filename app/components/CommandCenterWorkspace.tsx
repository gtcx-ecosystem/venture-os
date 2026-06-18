"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FILTER_OPTIONS, INITIAL_REVIEWS, type ReviewCard } from "../lib/mock";
import { getClient, getFleetClientEntry } from "../lib/clients";
import { getClientVisualTheme } from "../lib/client-visual";
import { heroCopyFromStrategy } from "../lib/automation/canon-strategy-shared";
import { computePipelineMetrics } from "../lib/opportunities";
import { useOpportunities } from "../lib/hooks/useOpportunities";
import { useClientStrategy } from "../lib/hooks/useClientStrategy";
import type { AutomationReceipt } from "../lib/automation/receipts";
import { OpportunityCard } from "./OpportunityCard";
import { AutomationReceiptLog } from "./AutomationReceiptLog";
import { useWorkspace } from "./WorkspaceProvider";
import {
  SkeletonOpportunityGrid,
  WorkspaceEmptyState,
  WorkspaceErrorState,
} from "./workspace/WorkspaceStates";

export function CommandCenterWorkspace() {
  const router = useRouter();
  const { search, activeFilter, setActiveFilter, selectedClientId } = useWorkspace();
  const client = getClient(selectedClientId);
  const fleet = getFleetClientEntry(selectedClientId);
  const clientVisual = getClientVisualTheme(selectedClientId);
  const { strategy } = useClientStrategy(selectedClientId);
  const { opportunities, loading, error, reload } = useOpportunities(selectedClientId);
  const [reviews, setReviews] = useState<ReviewCard[]>(INITIAL_REVIEWS);
  const [automationReceipts, setAutomationReceipts] = useState<AutomationReceipt[]>([]);
  const [queueError, setQueueError] = useState<string | null>(null);
  const [queueing, setQueueing] = useState(false);
  const [serviceHealth, setServiceHealth] = useState<"live" | "degraded" | "unknown">("unknown");
  const [agentPrompt, setAgentPrompt] = useState(
    "Create a TerraOS DFI concept note and route claims to proof review.",
  );

  useEffect(() => {
    fetch("/api/health")
      .then((r) => setServiceHealth(r.ok ? "live" : "degraded"))
      .catch(() => setServiceHealth("degraded"));
    fetch("/api/venture/receipts")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.receipts) setAutomationReceipts(data.receipts);
      })
      .catch(() => undefined);
  }, []);

  const visibleOpportunities = useMemo(() => {
    const term = search.trim().toLowerCase();
    return opportunities.filter((item) => {
      const matchesFilter = activeFilter === "all" || item.kind === activeFilter;
      const matchesSearch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.headline.toLowerCase().includes(term);
      return matchesFilter && matchesSearch;
    });
  }, [search, activeFilter, opportunities]);

  const metrics = useMemo(() => computePipelineMetrics(opportunities), [opportunities]);

  const queueWorkflow = useCallback(() => {
    setQueueing(true);
    setQueueError(null);
    fetch("/api/venture/workflow/queue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: selectedClientId, prompt: agentPrompt }),
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<{
          reviews: ReviewCard[];
          receipts: AutomationReceipt[];
        }>;
      })
      .then((data) => {
        setReviews(data.reviews);
        setAutomationReceipts(data.receipts);
      })
      .catch(() => setQueueError("Workflow queue failed — try again."))
      .finally(() => setQueueing(false));
  }, [agentPrompt, selectedClientId]);

  const healthLabel =
    serviceHealth === "live" ? "Live" : serviceHealth === "degraded" ? "Degraded" : "Checking";

  const metricValue = (value: number) => (loading ? "—" : String(value));
  const heroCopy = heroCopyFromStrategy(strategy, client?.positioning.one_liner);

  return (
    <>
      <section className="hero-panel" aria-label="Founder command center">
        <div className="hero-copy">
          <div className="eyebrow">
            Founder command center
            <span className={`client-identity client-identity--${clientVisual.motif}`}>
              {client?.name ?? selectedClientId} · {clientVisual.shortLabel}
            </span>
          </div>
          <h1>Run capital, growth, visibility, and partnerships from one desk.</h1>
          <p>{heroCopy.primary}</p>
          {heroCopy.secondary ? <p className="hero-mission">{heroCopy.secondary}</p> : null}
          {fleet ? (
            <div className="fleet-hero-links">
              <a
                href={fleet.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="fleet-link"
              >
                Open {fleet.ownerRepo}
              </a>
              {fleet.collateralUrl ? (
                <a
                  href={fleet.collateralUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="fleet-link"
                >
                  Published collateral
                </a>
              ) : null}
              {strategy ? (
                <span className="fleet-canon-source" title={fleet.canonStrategyPath}>
                  Canon · {strategy.source}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="hero-metrics" aria-label="Pipeline summary">
          <div>
            <strong>{metricValue(metrics.qualified)}</strong>
            <span>Qualified</span>
          </div>
          <div>
            <strong>{metricValue(metrics.p1Moves)}</strong>
            <span>P1 Moves</span>
          </div>
          <div>
            <strong>{metricValue(metrics.approvalsPending)}</strong>
            <span>Needs proof</span>
          </div>
        </div>
      </section>

      <section className="toolbar" aria-label="Workspace tools">
        {FILTER_OPTIONS.map((filter) => (
          <button
            key={filter.id}
            className={activeFilter === filter.id ? "tool-pill is-active" : "tool-pill"}
            type="button"
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </section>

      <section className="content-grid" aria-label="Venture workspace">
        <div className="board-column">
          <div className="column-heading">
            <h2>Priority Opportunities</h2>
            <button
              className="small-button"
              type="button"
              onClick={() => router.push("/opportunities")}
            >
              Open board
            </button>
          </div>

          {loading ? (
            <SkeletonOpportunityGrid />
          ) : error ? (
            <WorkspaceErrorState message={error} onRetry={reload} />
          ) : opportunities.length === 0 ? (
            <WorkspaceEmptyState
              title="No opportunities yet"
              detail={`${client?.name ?? "This client"} has no pipeline cards. Check Sources and Signals, or queue an agent workflow.`}
              actionLabel="View sources"
              onAction={() => router.push("/sources")}
            />
          ) : visibleOpportunities.length === 0 ? (
            <WorkspaceEmptyState
              title="No matches"
              detail="Try a different filter or clear search to see all opportunities for this client."
              actionLabel="Show all"
              onAction={() => setActiveFilter("all")}
            />
          ) : (
            <div className="card-grid" id="opportunityGrid">
              {visibleOpportunities.map((item) => (
                <OpportunityCard key={item.id} opportunity={item} />
              ))}
            </div>
          )}
        </div>

        <aside className="agent-panel" aria-label="Agent command panel">
          <div className="agent-header">
            <div>
              <div className="section-label">Agent review</div>
              <h2>Venture Desk</h2>
            </div>
            <span className={`status-dot status-dot--${serviceHealth}`}>{healthLabel}</span>
          </div>

          <div className="command-box">
            <label htmlFor="agentPrompt">Ask the team</label>
            <textarea
              id="agentPrompt"
              rows={4}
              value={agentPrompt}
              onChange={(event) => setAgentPrompt(event.target.value)}
            />
            <button
              className="primary-button full-width"
              id="runAgent"
              type="button"
              onClick={queueWorkflow}
              disabled={queueing}
            >
              {queueing ? "Queueing…" : "Queue workflow"}
            </button>
            {queueError ? <p className="form-error">{queueError}</p> : null}
          </div>

          <div className="review-stack" id="reviewStack">
            {reviews.map((card) => (
              <article key={card.id} className={card.highlighted ? "review-card is-highlighted" : "review-card"}>
                <div className="review-topline">
                  <span>{card.agent}</span>
                  <strong>{card.status}</strong>
                </div>
                <p>{card.body}</p>
                {card.evidenceRef ? (
                  <p className="evidence-ref" title={card.evidenceRef}>
                    Proof: {card.evidenceRef}
                  </p>
                ) : null}
              </article>
            ))}
          </div>

          <div className="section-label" style={{ marginTop: 16 }}>
            Receipts
          </div>
          <AutomationReceiptLog receipts={automationReceipts} />
        </aside>
      </section>

      <div className="create-dock" aria-label="Create menu">
        <button
          className="create-tile"
          type="button"
          onClick={() => router.push("/brief")}
        >
          <span className="tile-icon violet">N</span>
          <strong>Note</strong>
        </button>
        <button
          className="create-tile"
          type="button"
          onClick={() => router.push("/capital")}
        >
          <span className="tile-icon orange">P</span>
          <strong>Proposal</strong>
        </button>
        <button className="create-tile" type="button" onClick={queueWorkflow} disabled={queueing}>
          <span className="tile-icon white">A</span>
          <strong>Agent</strong>
        </button>
      </div>
    </>
  );
}
