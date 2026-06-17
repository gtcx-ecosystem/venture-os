import type { VentureClient } from "./clients";
import type { Opportunity, PipelineItem } from "./mock";

export function formatInvestorUpdateMarkdown(input: {
  client: VentureClient | undefined;
  periodLabel: string;
  pipeline: PipelineItem[];
  priorities: Opportunity[];
}) {
  const clientName = input.client?.name ?? "Client";
  const desks = ["capital", "growth", "visibility", "collateral"] as const;
  const byDesk = (desk: string) => input.pipeline.filter((p) => p.desk === desk);

  const lines = [
    `# Monthly investor update — ${clientName}`,
    "",
    `**Period:** ${input.periodLabel}`,
    "",
    "## Executive summary",
    "",
    input.client?.positioning.one_liner ?? "",
    "",
    "## Highlights",
    "",
    `- **Capital:** ${byDesk("capital")[0]?.title ?? "No active capital motion"}`,
    `- **Revenue / pilots:** ${byDesk("growth")[0]?.title ?? "No active growth motion"}`,
    `- **Partnerships:** ${input.priorities.find((p) => p.kind === "partner")?.headline ?? "—"}`,
    `- **Visibility:** ${byDesk("visibility")[0]?.title ?? "No active visibility motion"}`,
    "",
    "## Pipeline snapshot",
    "",
    "| Desk | Active | Status |",
    "|------|--------|--------|",
    ...desks.map((d) => {
      const item = byDesk(d)[0];
      return `| ${d} | ${item?.title ?? "—"} | ${item?.status ?? "—"} |`;
    }),
    "",
    "## Priority opportunities",
    "",
    ...input.priorities.slice(0, 5).map((p) => `- **${p.priority}** ${p.headline}`),
    "",
    "---",
    "",
    "_Draft from Venture OS. Review before send._",
  ];
  return lines.join("\n");
}
