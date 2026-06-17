import type { VentureClient } from "./clients";
import type { ApprovalItem, CalendarEvent, Opportunity, PipelineItem } from "./mock";

export function formatBriefMarkdown(input: {
  client: VentureClient | undefined;
  priorities: Opportunity[];
  pipeline: PipelineItem[];
  worklist72h: PipelineItem[];
  calendar: CalendarEvent[];
  approvals: ApprovalItem[];
}) {
  const clientName = input.client?.name ?? "Client";
  const lines = [
    `# Rolling Founder Brief — ${clientName}`,
    "",
    `> ${input.client?.positioning.one_liner ?? ""}`,
    "",
    "## Priority list",
    ...input.priorities.map((p) => `- **${p.priority}** ${p.headline} (${p.horizon})`),
    "",
    "## Pipeline highlights",
    ...input.pipeline.map((p) => `- **${p.desk}** ${p.title} — ${p.status}`),
    "",
    "## Next 72 hours",
    ...(input.worklist72h.length
      ? input.worklist72h.map((p) => `- ${p.title} (${p.horizon})`)
      : ["- No items due within 72 hours"]),
    "",
    "## Calendar",
    ...input.calendar.map((e) => `- **${e.day}** ${e.title} — ${e.detail}`),
    "",
    "## Approvals pending",
    ...input.approvals.map((a) => `- **${a.kind}** ${a.status}: ${a.body}`),
  ];
  return lines.join("\n");
}
