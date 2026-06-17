import type { Opportunity } from "@/lib/mock";
import { getClientVisualTheme } from "@/lib/client-visual";
import { EvidenceChip } from "./EvidenceChip";

function visualMotifClass(visualClass: string) {
  if (visualClass === "visual-land") return "mini-map";
  if (visualClass === "visual-market") return "wave-line";
  if (visualClass === "visual-channel") return "phone-stack";
  return "headline-stack";
}

type OpportunityCardProps = {
  opportunity: Opportunity;
};

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const clientTheme = getClientVisualTheme(opportunity.clientId);
  const kindLabel =
    opportunity.kind === "revenue"
      ? "Revenue"
      : opportunity.kind.charAt(0).toUpperCase() + opportunity.kind.slice(1);

  return (
    <article
      className="opportunity-card"
      data-kind={opportunity.kind}
      data-client={opportunity.clientId}
      data-title={opportunity.title}
    >
      <div className={`card-visual ${opportunity.visualClass}`}>
        <span className="card-badge">{kindLabel}</span>
        <span className={`card-client-badge card-client-badge--${clientTheme.motif}`}>
          {clientTheme.shortLabel}
        </span>
        <div className={visualMotifClass(opportunity.visualClass)} aria-hidden="true" />
      </div>
      <div className="card-body">
        <h3>{opportunity.headline}</h3>
        <p>{opportunity.description}</p>
        <div className="card-meta">
          <span>{opportunity.priority}</span>
          <span>{opportunity.horizon}</span>
          <span>{opportunity.fit}</span>
          <EvidenceChip status={opportunity.evidenceStatus} refPath={opportunity.evidenceRef} />
        </div>
        {opportunity.evidenceRef ? (
          <p className="evidence-ref" title={opportunity.evidenceRef}>
            Evidence: {opportunity.evidenceRef}
          </p>
        ) : null}
      </div>
    </article>
  );
}
