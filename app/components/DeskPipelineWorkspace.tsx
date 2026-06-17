"use client";

import { useMemo } from "react";
import { getClient } from "../lib/clients";
import { PIPELINE_ITEMS, type DeskKind } from "../lib/mock";
import { useWorkspace } from "./WorkspaceProvider";

const DESK_COPY: Record<
  DeskKind,
  { eyebrow: string; title: string; description: string; goalKey: "capital" | "revenue" | "visibility" | "partnerships" }
> = {
  capital: {
    eyebrow: "Capital desk",
    title: "Pipeline, investor operations, and approvals.",
    description: "Route opportunities, draft collateral, and approve external moves.",
    goalKey: "capital",
  },
  growth: {
    eyebrow: "Growth desk",
    title: "Revenue pipeline, pilots, and partnerships.",
    description: "Turn signals into pilots, pilots into revenue, and revenue into repeatable playbooks.",
    goalKey: "revenue",
  },
  visibility: {
    eyebrow: "Visibility desk",
    title: "Press, content, and executive audience growth.",
    description: "Package intelligence into publishable narratives and coordinated external visibility.",
    goalKey: "visibility",
  },
  collateral: {
    eyebrow: "Collateral factory",
    title: "Decks, notes, proposals, and proof packs.",
    description: "Produce investor-grade collateral with claims review before external use.",
    goalKey: "capital",
  },
};

export function DeskPipelineWorkspace(props: { desk: DeskKind }) {
  const { selectedClientId } = useWorkspace();
  const client = getClient(selectedClientId);
  const copy = DESK_COPY[props.desk];

  const pipeline = useMemo(
    () => PIPELINE_ITEMS.filter((item) => item.clientId === selectedClientId && item.desk === props.desk),
    [selectedClientId, props.desk],
  );

  const goal = client?.goals[copy.goalKey];

  return (
    <>
      <section className="hero-panel" aria-label={copy.eyebrow}>
        <div className="hero-copy">
          <div className="eyebrow">{copy.eyebrow}</div>
          <h1>{copy.title}</h1>
          <p>{goal ?? copy.description}</p>
        </div>
        <div className="hero-metrics" aria-label="Desk summary">
          <div>
            <strong>{pipeline.length}</strong>
            <span>Active</span>
          </div>
          <div>
            <strong>{client?.stage ?? "pilot"}</strong>
            <span>Stage</span>
          </div>
          <div>
            <strong>{client?.geographies[0] ?? "Africa"}</strong>
            <span>Region</span>
          </div>
        </div>
      </section>

      <section className="content-grid" aria-label={`${copy.eyebrow} pipeline`}>
        <div className="board-column">
          <div className="column-heading">
            <h2>{client?.name ?? "Client"} pipeline</h2>
            <button className="small-button" type="button">
              Add
            </button>
          </div>

          <div className="review-stack">
            {pipeline.length === 0 ? (
              <article className="review-card">
                <div className="review-topline">
                  <span>{copy.eyebrow}</span>
                  <strong>Empty</strong>
                </div>
                <p>No active pipeline items for this client yet. Queue a workflow from Command Center.</p>
              </article>
            ) : (
              pipeline.map((item) => (
                <article key={item.id} className="review-card">
                  <div className="review-topline">
                    <span>{item.owner}</span>
                    <strong>{item.status}</strong>
                  </div>
                  <p>{item.title}</p>
                  <div className="card-meta">
                    <span>{item.horizon}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <aside className="agent-panel" aria-label="Client positioning">
          <div className="agent-header">
            <div>
              <div className="section-label">Client profile</div>
              <h2>{client?.name ?? "Client"}</h2>
            </div>
            <span className="status-dot">Pilot</span>
          </div>

          <div className="review-stack">
            <article className="review-card is-highlighted">
              <div className="review-topline">
                <span>Positioning</span>
                <strong>Active</strong>
              </div>
              <p>{client?.positioning.narrative ?? "Select a client from the sidebar to load profile context."}</p>
            </article>
            {(client?.positioning.differentiators ?? []).map((item) => (
              <article key={item} className="review-card">
                <div className="review-topline">
                  <span>Differentiator</span>
                  <strong>Proof</strong>
                </div>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </>
  );
}
