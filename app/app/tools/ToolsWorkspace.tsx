"use client";

import { useMemo, useState } from "react";
import { rankToolsForWorkflow } from "@/lib/tool-registry/ranking";
import { createSelectionReceipt } from "@/lib/tool-registry/receipts";
import type { ToolRecord } from "@/lib/tool-registry/schema";
import { WORKFLOW_DEFAULTS, WORKFLOW_LABELS, type WorkflowId } from "@/lib/tool-registry/workflows";
import { ReceiptLog } from "@/components/ReceiptLog";
import { useWorkspace } from "@/components/WorkspaceProvider";

function Badge(props: { children: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: 999,
        border: "1px solid var(--stroke)",
        background: "rgba(255,255,255,.02)",
        color: "var(--text)",
        fontSize: 12,
        fontWeight: 650,
      }}
    >
      {props.children}
    </span>
  );
}

function avgQuality(tool: ToolRecord) {
  const q = tool.quality_score;
  return Math.round(
    (q.reliability + q.security_posture + q.docs_quality + q.api_maturity + q.community_health + q.self_host_fit) / 6,
  );
}

const WORKFLOWS: WorkflowId[] = ["rss_ingest", "workflow_automation", "brief_signals", "brief_publish"];

export function ToolsWorkspace(props: { tools: ToolRecord[] }) {
  const { receipts, appendReceipt } = useWorkspace();
  const [query, setQuery] = useState("");
  const [workflowId, setWorkflowId] = useState<WorkflowId>("rss_ingest");

  const ranked = useMemo(
    () => rankToolsForWorkflow(workflowId, { tools: props.tools }),
    [props.tools, workflowId],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return props.tools;
    return props.tools.filter((t) => (t.name + " " + t.vendor + " " + t.categories.join(" ")).toLowerCase().includes(q));
  }, [query, props.tools]);

  function selectTopTool() {
    const top = ranked[0];
    if (!top) return;
    const receipt = createSelectionReceipt({
      workflowId,
      toolId: top.tool.id,
      toolName: top.tool.name,
      rankScore: top.rank_score,
      rationale: top.rationale,
      constraints: WORKFLOW_DEFAULTS[workflowId],
      actor: "founder",
    });
    appendReceipt(receipt);
  }

  return (
    <>
      <section className="toolbar" aria-label="Workflow ranking">
        {WORKFLOWS.map((id) => (
          <button
            key={id}
            className={workflowId === id ? "tool-pill is-active" : "tool-pill"}
            type="button"
            onClick={() => setWorkflowId(id)}
          >
            {WORKFLOW_LABELS[id]}
          </button>
        ))}
        <button className="primary-button" type="button" onClick={selectTopTool}>
          Select top ranked
        </button>
      </section>

      <section className="content-grid" aria-label="Tools and receipts">
        <div className="board-column">
          <div className="column-heading">
            <h2>Registry</h2>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools"
              style={{
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid var(--stroke)",
                background: "rgba(255,255,255,.02)",
                color: "var(--text)",
              }}
            />
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {visible.map((tool) => {
              const rank = ranked.find((r) => r.tool.id === tool.id);
              return (
                <div
                  key={tool.id}
                  style={{
                    border: "1px solid var(--stroke)",
                    borderRadius: 14,
                    padding: 14,
                    background: "rgba(255,255,255,.02)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontWeight: 760 }}>{tool.name}</div>
                      <div style={{ color: "var(--subtle)", fontSize: 12 }}>{tool.vendor}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <Badge>{tool.license_type}</Badge>
                      {rank ? <Badge>{`rank ${rank.rank_score}`}</Badge> : null}
                      <Badge>{`${avgQuality(tool)}/100`}</Badge>
                    </div>
                  </div>
                  {rank ? (
                    <p style={{ marginTop: 8, fontSize: 13, color: "var(--muted)" }}>{rank.rationale.join(" · ")}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <aside className="agent-panel" aria-label="Selection receipts">
          <div className="agent-header">
            <div>
              <div className="section-label">Trust &amp; safety</div>
              <h2>Selection receipts</h2>
            </div>
          </div>
          <ReceiptLog receipts={receipts} />
        </aside>
      </section>
    </>
  );
}
