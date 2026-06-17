"use client";

import { useMemo, useState } from "react";
import dataset from "@/lib/tool-registry/dataset/tools.v1.json";
import { getClient } from "@/lib/clients";
import {
  APPROVAL_ITEMS,
  CALENDAR_EVENTS,
  OPPORTUNITIES,
  PIPELINE_ITEMS,
  type ApprovalItem,
} from "@/lib/mock";
import { rankToolsForWorkflow } from "@/lib/tool-registry/ranking";
import { parseToolDataset } from "@/lib/tool-registry/schema";
import { WORKFLOW_LABELS } from "@/lib/tool-registry/workflows";
import { formatBriefMarkdown } from "@/lib/brief";
import { useWorkspace } from "./WorkspaceProvider";

const TOOL_DATASET = parseToolDataset(dataset);

function parseHorizonDays(horizon: string) {
  const match = horizon.match(/(\d+)/);
  return match ? Number(match[1]) : 99;
}

export function ApprovalsDrawer(props: { open: boolean; onClose: () => void; items: ApprovalItem[] }) {
  if (!props.open) return null;

  return (
    <aside className="agent-panel" style={{ position: "fixed", top: 0, right: 0, height: "100vh", width: 380, zIndex: 50, overflow: "auto" }} aria-label="Approvals drawer">
      <div className="agent-header">
        <div>
          <div className="section-label">Approvals</div>
          <h2>Queue</h2>
        </div>
        <button className="ghost-button" type="button" onClick={props.onClose}>
          Close
        </button>
      </div>
      <div className="review-stack">
        {props.items.map((item) => (
          <article key={item.id} className={item.highlighted ? "review-card is-highlighted" : "review-card"}>
            <div className="review-topline">
              <span>{item.kind}</span>
              <strong>{item.status}</strong>
            </div>
            <p>{item.body}</p>
            <div className="review-actions">
              <button type="button">Approve</button>
              <button type="button">Hold</button>
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
}

export function RollingBriefWorkspace() {
  const { selectedClientId, approvalsDrawerOpen, setApprovalsDrawerOpen } = useWorkspace();
  const client = getClient(selectedClientId);
  const [updatedAt, setUpdatedAt] = useState(() => new Date());
  const [status, setStatus] = useState<string | null>(null);

  const priorities = useMemo(
    () =>
      OPPORTUNITIES.filter((o) => o.clientId === selectedClientId).sort((a, b) => {
        if (a.priority === b.priority) return parseHorizonDays(a.horizon) - parseHorizonDays(b.horizon);
        return a.priority.localeCompare(b.priority);
      }),
    [selectedClientId],
  );

  const pipeline = useMemo(
    () => PIPELINE_ITEMS.filter((p) => p.clientId === selectedClientId),
    [selectedClientId],
  );

  const calendar = useMemo(
    () => CALENDAR_EVENTS.filter((e) => e.clientId === selectedClientId),
    [selectedClientId],
  );

  const worklist72h = useMemo(
    () => pipeline.filter((p) => parseHorizonDays(p.horizon) <= 3),
    [pipeline],
  );

  const approvals = useMemo(
    () => APPROVAL_ITEMS.filter((a) => a.clientId === selectedClientId),
    [selectedClientId],
  );

  const signalTool = useMemo(
    () => rankToolsForWorkflow("brief_signals", { tools: TOOL_DATASET.tools })[0],
    [],
  );

  const publishTool = useMemo(
    () => rankToolsForWorkflow("brief_publish", { tools: TOOL_DATASET.tools })[0],
    [],
  );

  const briefMarkdown = useMemo(
    () =>
      formatBriefMarkdown({
        client,
        priorities,
        pipeline,
        worklist72h,
        calendar,
        approvals,
      }),
    [client, priorities, pipeline, worklist72h, calendar, approvals],
  );

  async function exportBrief() {
    try {
      await navigator.clipboard.writeText(briefMarkdown);
      setStatus("Brief exported to clipboard.");
      setUpdatedAt(new Date());
    } catch {
      setStatus("Export failed — clipboard unavailable.");
    }
  }

  function publishBrief() {
    if (approvals.some((a) => a.status.toLowerCase().includes("needs") || a.status.toLowerCase().includes("review"))) {
      setStatus("Publish blocked — approvals pending.");
      setApprovalsDrawerOpen(true);
      return;
    }
    setStatus(`Published via ${publishTool?.tool.name ?? "automation rail"} (mock).`);
    setUpdatedAt(new Date());
  }

  return (
    <>
      <section className="hero-panel" aria-label="Rolling founder brief">
        <div className="hero-copy">
          <div className="eyebrow">Rolling founder brief</div>
          <h1>{client?.name ?? "Client"} — operating snapshot</h1>
          <p>{client?.positioning.one_liner ?? "Priority moves, pipeline, and approvals in one rolling view."}</p>
          <p style={{ color: "var(--subtle)", fontSize: 12, marginTop: 8 }}>
            Updated {updatedAt.toLocaleTimeString()} · rolling cadence
          </p>
        </div>
        <div className="hero-metrics" aria-label="Brief summary">
          <div>
            <strong>{priorities.length}</strong>
            <span>Priorities</span>
          </div>
          <div>
            <strong>{pipeline.length}</strong>
            <span>Pipeline</span>
          </div>
          <div>
            <strong>{approvals.length}</strong>
            <span>Approvals</span>
          </div>
        </div>
      </section>

      <div style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button className="ghost-button" type="button" onClick={exportBrief}>
          Export
        </button>
        <button className="primary-button" type="button" onClick={publishBrief}>
          Publish
        </button>
        <button className="primary-button" type="button" onClick={() => setApprovalsDrawerOpen(true)}>
          Approvals · {approvals.length}
        </button>
        {status ? <span style={{ color: "var(--subtle)", fontSize: 13 }}>{status}</span> : null}
      </div>

      <section className="toolbar" aria-label="Workflow map">
        <span className="tool-pill is-active">Signals · {signalTool?.tool.name ?? "—"}</span>
        <span className="tool-pill">Enrich · n8n</span>
        <span className="tool-pill">Approve · drawer</span>
        <span className="tool-pill">Publish · {publishTool?.tool.name ?? "—"}</span>
      </section>

      <section className="content-grid" aria-label="Rolling brief workspace">
        <div className="board-column">
          <div className="column-heading">
            <h2>Priority list</h2>
          </div>
          <div className="review-stack">
            {priorities.map((item) => (
              <article key={item.id} className="review-card">
                <div className="review-topline">
                  <span>{item.priority}</span>
                  <strong>{item.horizon}</strong>
                </div>
                <p>{item.headline}</p>
                <p style={{ color: "var(--muted)", fontSize: 13 }}>{item.description}</p>
              </article>
            ))}
          </div>

          <div className="column-heading" style={{ marginTop: 20 }}>
            <h2>Pipeline highlights</h2>
          </div>
          <div className="review-stack">
            {pipeline.map((item) => (
              <article key={item.id} className="review-card">
                <div className="review-topline">
                  <span>{item.desk}</span>
                  <strong>{item.status}</strong>
                </div>
                <p>{item.title}</p>
                <div className="card-meta">
                  <span>{item.horizon}</span>
                  <span>{item.owner}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="column-heading" style={{ marginTop: 20 }}>
            <h2>Next 72 hours</h2>
          </div>
          <div className="review-stack">
            {worklist72h.length === 0 ? (
              <article className="review-card">
                <p>No items due within 72 hours for this client.</p>
              </article>
            ) : (
              worklist72h.map((item) => (
                <article key={item.id} className="review-card is-highlighted">
                  <div className="review-topline">
                    <span>{item.owner}</span>
                    <strong>{item.horizon}</strong>
                  </div>
                  <p>{item.title}</p>
                </article>
              ))
            )}
          </div>
        </div>

        <aside className="agent-panel" aria-label="Calendar rail">
          <div className="agent-header">
            <div>
              <div className="section-label">Calendar</div>
              <h2>This week</h2>
            </div>
          </div>
          <div className="review-stack">
            {calendar.length === 0 ? (
              <article className="review-card">
                <p>No calendar events for this client.</p>
              </article>
            ) : (
              calendar.map((event) => (
                <article key={event.id} className="review-card">
                  <div className="review-topline">
                    <span>{event.day}</span>
                    <strong>Scheduled</strong>
                  </div>
                  <p>{event.title}</p>
                  <p style={{ color: "var(--muted)", fontSize: 13 }}>{event.detail}</p>
                </article>
              ))
            )}
          </div>

          <div className="agent-header" style={{ marginTop: 20 }}>
            <div>
              <div className="section-label">AI-native stack</div>
              <h2>Recommended tools</h2>
            </div>
          </div>
          <div className="review-stack">
            {signalTool ? (
              <article className="review-card">
                <div className="review-topline">
                  <span>{WORKFLOW_LABELS.brief_signals}</span>
                  <strong>{signalTool.rank_score}</strong>
                </div>
                <p>{signalTool.tool.name}</p>
                <p style={{ color: "var(--muted)", fontSize: 13 }}>{signalTool.rationale.slice(0, 2).join(" · ")}</p>
              </article>
            ) : null}
            {publishTool ? (
              <article className="review-card">
                <div className="review-topline">
                  <span>{WORKFLOW_LABELS.brief_publish}</span>
                  <strong>{publishTool.rank_score}</strong>
                </div>
                <p>{publishTool.tool.name}</p>
                <p style={{ color: "var(--muted)", fontSize: 13 }}>{publishTool.rationale.slice(0, 2).join(" · ")}</p>
              </article>
            ) : null}
          </div>
        </aside>
      </section>

      <ApprovalsDrawer open={approvalsDrawerOpen} onClose={() => setApprovalsDrawerOpen(false)} items={approvals} />
    </>
  );
}
