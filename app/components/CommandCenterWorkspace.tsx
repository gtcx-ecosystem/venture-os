"use client";

import { useMemo, useState } from "react";
import { FILTER_OPTIONS, INITIAL_REVIEWS, OPPORTUNITIES, type ReviewCard } from "../lib/mock";
import { useWorkspace } from "./WorkspaceProvider";

export function CommandCenterWorkspace() {
  const { search, activeFilter, setActiveFilter } = useWorkspace();
  const [reviews, setReviews] = useState<ReviewCard[]>(INITIAL_REVIEWS);

  const visibleOpportunities = useMemo(() => {
    const term = search.trim().toLowerCase();
    return OPPORTUNITIES.filter((item) => {
      const matchesFilter = activeFilter === "all" || item.kind === activeFilter;
      const matchesSearch = !term || item.title.includes(term);
      return matchesFilter && matchesSearch;
    });
  }, [search, activeFilter]);

  function queueWorkflow() {
    setReviews((prev) => [
      {
        id: `queued-${Date.now()}`,
        agent: "Chief of Staff Agent",
        status: "Queued now",
        body: "Workflow queued. Tasks will route to Capital Desk, Claims Review, and Collateral Factory before approval.",
        highlighted: true,
      },
      ...prev.map((card) => ({ ...card, highlighted: false })),
    ]);
  }

  return (
    <>
      <section className="hero-panel" aria-label="Founder command center">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="hero-copy">
          <div className="eyebrow">Founder command center</div>
          <h1>Run capital, growth, visibility, and partnerships from one desk.</h1>
          <p>
            Monitor Africa-focused opportunities, draft investor materials, coordinate agents, and approve external
            moves without losing the operating thread.
          </p>
        </div>
        <div className="hero-metrics" aria-label="Pipeline summary">
          <div>
            <strong>42</strong>
            <span>Qualified</span>
          </div>
          <div>
            <strong>11</strong>
            <span>P1 Moves</span>
          </div>
          <div>
            <strong>7</strong>
            <span>Approvals</span>
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
            <button className="small-button" type="button">
              New
            </button>
          </div>

          <div className="card-grid" id="opportunityGrid">
            {visibleOpportunities.map((item) => (
              <article key={item.id} className="opportunity-card" data-kind={item.kind} data-title={item.title}>
                <div className={`card-visual ${item.visualClass}`}>
                  <span className="card-badge">{item.kind === "revenue" ? "Revenue" : item.kind.charAt(0).toUpperCase() + item.kind.slice(1)}</span>
                  <div className={item.visualClass === "visual-land" ? "mini-map" : item.visualClass === "visual-market" ? "wave-line" : item.visualClass === "visual-channel" ? "phone-stack" : "headline-stack"} />
                </div>
                <div className="card-body">
                  <h3>{item.headline}</h3>
                  <p>{item.description}</p>
                  <div className="card-meta">
                    <span>{item.priority}</span>
                    <span>{item.horizon}</span>
                    <span>{item.fit}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="agent-panel" aria-label="Agent command panel">
          <div className="agent-header">
            <div>
              <div className="section-label">Agent review</div>
              <h2>Venture Desk</h2>
            </div>
            <span className="status-dot">Live</span>
          </div>

          <div className="command-box">
            <label htmlFor="agentPrompt">Ask the team</label>
            <textarea id="agentPrompt" rows={4} defaultValue="Create a TerraOS DFI concept note and route claims to proof review." />
            <button className="primary-button full-width" id="runAgent" type="button" onClick={queueWorkflow}>
              Queue workflow
            </button>
          </div>

          <div className="review-stack" id="reviewStack">
            {reviews.map((card) => (
              <article key={card.id} className={card.highlighted ? "review-card is-highlighted" : "review-card"}>
                <div className="review-topline">
                  <span>{card.agent}</span>
                  <strong>{card.status}</strong>
                </div>
                <p>{card.body}</p>
                {card.highlighted ? (
                  <div className="review-actions">
                    <button type="button">Open task</button>
                    <button type="button">Assign</button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </aside>
      </section>

      <div className="create-dock" aria-label="Create menu">
        <button className="create-tile" type="button">
          <span className="tile-icon blue">D</span>
          <strong>Deck</strong>
        </button>
        <button className="create-tile" type="button">
          <span className="tile-icon violet">N</span>
          <strong>Note</strong>
        </button>
        <button className="create-tile" type="button">
          <span className="tile-icon orange">P</span>
          <strong>Proposal</strong>
        </button>
        <button className="create-tile" type="button">
          <span className="tile-icon white">A</span>
          <strong>Agent</strong>
        </button>
      </div>
    </>
  );
}
