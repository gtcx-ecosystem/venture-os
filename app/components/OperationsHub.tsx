"use client";

import Link from "next/link";
import { InboundQueue } from "@/components/InboundQueue";
import { WorkflowProgress } from "@/components/WorkflowProgress";
import { useWorkspace } from "@/components/WorkspaceProvider";

const CHECKLIST = [
  { id: "clickup", label: "ClickUp space + Venture Opportunities list", doc: "docs/operations/workflows/clickup-board-template.md" },
  { id: "gmail", label: "Gmail labels + Calendar prefixes", doc: "docs/operations/workflows/gmail-calendar-setup.md" },
  { id: "drive", label: "Drive folder structure per client", doc: "docs/operations/workflows/gmail-calendar-setup.md" },
  { id: "n8n", label: "n8n inbound + digest workflows", doc: "docs/operations/workflows/n8n-workflows.v1.json" },
  { id: "dedupe", label: "Inbound dedupe rules", doc: "docs/operations/workflows/dedupe-rules.md" },
  { id: "griot", label: "Griot webhook adapter", doc: "pm/stories/S8-01-griot-webhook-adapter.md" },
  { id: "agency", label: "Agency handoff (approved brief)", doc: "docs/operations/workflows/agency-handoff.md" },
  { id: "newsletter", label: "Newsletter send rail (Listmonk)", doc: "docs/operations/workflows/newsletter-send.md" },
  { id: "intake", label: "Day 0 intake complete", route: "/intake" },
  { id: "brief", label: "Rolling brief cadence live", route: "/brief" },
  { id: "templates", label: "Investor update + pricing templates", doc: "docs/operations/templates/monthly-investor-update.md" },
];

export function OperationsHub() {
  const { workflowState, selectedClientId } = useWorkspace();

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
      <InboundQueue clientId={selectedClientId} />
    </>
  );
}
