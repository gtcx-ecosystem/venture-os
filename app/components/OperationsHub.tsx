"use client";

import Link from "next/link";
import { WorkflowProgress } from "@/components/WorkflowProgress";
import { useWorkspace } from "@/components/WorkspaceProvider";

const CHECKLIST = [
  { id: "clickup", label: "ClickUp space + Venture Opportunities list", doc: "01-docs/workflows/clickup-board-template.md" },
  { id: "gmail", label: "Gmail labels + Calendar prefixes", doc: "01-docs/workflows/gmail-calendar-setup.md" },
  { id: "drive", label: "Drive folder structure per client", doc: "01-docs/workflows/gmail-calendar-setup.md" },
  { id: "n8n", label: "n8n inbound + digest workflows", doc: "01-docs/workflows/n8n-workflows.v1.json" },
  { id: "intake", label: "Day 0 intake complete", route: "/intake" },
  { id: "brief", label: "Rolling brief cadence live", route: "/brief" },
];

export function OperationsHub() {
  const { workflowState } = useWorkspace();

  return (
    <>
      <WorkflowProgress state={workflowState} approvalIds={[]} />
      <section className="review-stack" aria-label="Operating system checklist">
        {CHECKLIST.map((item) => (
          <article key={item.id} className="review-card">
            <div className="review-topline">
              <span>Day 4</span>
              <strong>Setup</strong>
            </div>
            <p>{item.label}</p>
            {item.route ? (
              <Link href={item.route} className="small-button" style={{ display: "inline-block", marginTop: 8 }}>
                Open
              </Link>
            ) : (
              <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 8 }}>Doc: {item.doc}</p>
            )}
          </article>
        ))}
      </section>
    </>
  );
}
