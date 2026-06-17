import type { EvidenceStatus } from "@/lib/mock";
import { evidenceStatusLabel } from "@/lib/opportunities";

export function EvidenceChip(props: { status: EvidenceStatus; refPath?: string }) {
  const className = `evidence-chip evidence-chip--${props.status.replace("_", "-")}`;
  return (
    <span className={className} title={props.refPath ?? undefined}>
      {evidenceStatusLabel(props.status)}
    </span>
  );
}
