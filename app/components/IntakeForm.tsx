"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWorkspace } from "@/components/WorkspaceProvider";
import { WorkflowProgress } from "@/components/WorkflowProgress";
import { getClient } from "@/lib/clients";

export function IntakeForm() {
  const router = useRouter();
  const { selectedClientId, completeClientIntake, workflowState } = useWorkspace();
  const client = getClient(selectedClientId);
  const [status, setStatus] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    completeClientIntake();
    setStatus(`Intake saved for ${client?.name ?? selectedClientId}. Opening rolling brief…`);
    router.push("/brief");
  }

  const approvalIds: string[] = [];

  return (
    <>
      <WorkflowProgress state={workflowState} approvalIds={approvalIds} />
      <form className="review-stack" onSubmit={onSubmit}>
        <article className="review-card">
          <div className="review-topline">
            <span>Day 0</span>
            <strong>Intake</strong>
          </div>
          <p>Pre-fill from selected client profile where available. Submit advances to rolling brief.</p>
        </article>

        <label className="command-box">
          Company / product name
          <input name="company" defaultValue={client?.name ?? ""} />
        </label>
        <label className="command-box">
          Geography
          <input name="geography" defaultValue={client?.geographies.join(", ") ?? ""} />
        </label>
        <label className="command-box">
          Stage
          <input name="stage" defaultValue={client?.stage ?? "pilot"} />
        </label>
        <label className="command-box">
          Capital goal
          <textarea name="capitalGoal" rows={2} defaultValue={client?.goals.capital ?? ""} />
        </label>
        <label className="command-box">
          Revenue / pilot goal
          <textarea name="revenueGoal" rows={2} defaultValue={client?.goals.revenue ?? ""} />
        </label>
        <label className="command-box">
          Partnership goal
          <textarea name="partnershipGoal" rows={2} defaultValue={client?.goals.partnerships ?? ""} />
        </label>
        <label className="command-box">
          Visibility goal
          <textarea name="visibilityGoal" rows={2} defaultValue={client?.goals.visibility ?? ""} />
        </label>
        <label className="command-box">
          Sensitive claims and constraints
          <textarea name="constraints" rows={3} defaultValue={client?.constraints?.join("\n") ?? ""} />
        </label>

        <button className="primary-button full-width" type="submit">
          Save intake and open brief
        </button>
        {status ? <p style={{ color: "var(--subtle)", fontSize: 13 }}>{status}</p> : null}
      </form>
    </>
  );
}
