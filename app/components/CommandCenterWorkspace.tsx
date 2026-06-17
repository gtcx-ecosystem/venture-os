"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { FILTER_OPTIONS, INITIAL_REVIEWS, type ReviewCard } from "../lib/mock";
import { getClient } from "../lib/clients";
import { computePipelineMetrics } from "../lib/opportunities";
import { useOpportunities } from "../lib/hooks/useOpportunities";
import type { AutomationReceipt } from "../lib/automation/receipts";
import { EvidenceChip } from "./EvidenceChip";
import { AutomationReceiptLog } from "./AutomationReceiptLog";
import { useWorkspace } from "./WorkspaceProvider";

export function CommandCenterWorkspace() {
  const { search, activeFilter, setActiveFilter, selectedClientId } = useWorkspace();
  const client = getClient(selectedClientId);
  const { opportunities, loading, error } = useOpportunities(selectedClientId);
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
      const matchesSearch = !term || item.title.includes(term) || item.headline.toLowerCase().includes(term);
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

  return (
    <>
      <section className="hero-panel" aria-label="Founder command center">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="hero-copy">
          <div className="eyebrow">Founder command center</div>
          <h1>Run capital, growth, visibility, and partnerships from one desk.</h1>
          <p>
            {client?.positioning.one_liner ??
              "Monitor Africa-focused opportunities, draft investor materials, coordinate agents, and approve external moves without losing the operating thread."}
          </p>
        </div>
        <div className="hero-metrics" aria-label="Pipeline summary">
          <div>
            <strong>{metrics.qualified}</strong>
            <span>Qualified</span>
          </div>
          <div>
            <strong>{metrics.p1Moves}</strong>
            <span>P1 Moves</span>
          </div>
          <div>
            <strong>{metrics.approvalsPending}</strong>
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
            <button className="small-button" type="button" disabled title="Use Opportunities desk to sync">
              New
            </button>
          </div>

          {loading ? (
            <div className="review-stack" aria-busy="true">
              <article className="review-card">
                <p>Loading opportunities…</p>
              </article>
            </div>
          ) : error ? (
            <div className="review-stack">
              <article className="review-card">
                <p>{error}</p>
              </article>
            </div>
          ) : visibleOpportunities.length === 0 ? (
            <div className="review-stack">
              <article className="review-card">
                <p>No opportunities match this filter for {client?.name ?? "this client"}.</p>
              </article>
            </div>
          ) : (
            <div className="card-grid" id="opportunityGrid">
              {visibleOpportunities.map((item) => (
                <article key={item.id} className="opportunity-card" data-kind={item.kind} data-title={item.title}>
                  <div className={`card-visual ${item.visualClass}`}>
                    <span className="card-badge">
                      {item.kind === "revenue" ? "Revenue" : item.kind.charAt(0).toUpperCase() + item.kind.slice(1)}
                    </span>
                    <div
                      className={
                        item.visualClass === "visual-land"
                          ? "mini-map"
                          : item.visualClass === "visual-market"
                            ? "wave-line"
                            : item.visualClass === "visual-channel"
                              ? "phone-stack"
                              : "headline-stack"
                      }
                    />
                  </div>
                  <div className="card-body">
                    <h3>{item.headline}</h3>
                    <p>{item.description}</p>
                    <div className="card-meta">
                      <span>{item.priority}</span>
                      <span>{item.horizon}</span>
                      <span>{item.fit}</span>
                      <EvidenceChip status={item.evidenceStatus} refPath={item.evidenceRef} />
                    </div>
                    {item.evidenceRef ? (
                      <p className="evidence-ref" title={item.evidenceRef}>
                        Evidence: {item.evidenceRef}
                      </p>
                    ) : null}
                  </div>
                </article>
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
        <button className="create-tile" type="button" disabled title="Collateral Factory — coming soon">
          <span className="tile-icon blue">D</span>
          <strong>Deck</strong>
        </button>
        <button className="create-tile" type="button" disabled title="Rolling Brief — use /brief">
          <span className="tile-icon violet">N</span>
          <strong>Note</strong>
        </button>
        <button className="create-tile" type="button" disabled title="Capital Desk — use /capital">
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
