"use client";

import type { ClientWorkflowState } from "@/lib/workflow-state";
import { currentWorkflowStep, type WorkflowStep } from "@/lib/workflow-state";

const STEPS: { id: WorkflowStep; label: string }[] = [
  { id: "intake", label: "Intake" },
  { id: "brief", label: "Brief" },
  { id: "approve", label: "Approve" },
  { id: "publish", label: "Publish" },
];

export function WorkflowProgress(props: { state: ClientWorkflowState; approvalIds: string[] }) {
  const active = currentWorkflowStep(props.state, props.approvalIds);

  return (
    <section className="toolbar" aria-label="Client workflow progress">
      {STEPS.map((step) => (
        <span key={step.id} className={active === step.id ? "tool-pill is-active" : "tool-pill"}>
          {step.label}
        </span>
      ))}
    </section>
  );
}
