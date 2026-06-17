import { describe, expect, it } from "vitest";
import { formatInvestorUpdateMarkdown } from "../investor-update";

describe("formatInvestorUpdateMarkdown", () => {
  it("includes client name and pipeline table", () => {
    const md = formatInvestorUpdateMarkdown({
      client: {
        id: "gtcx-ecosystem",
        name: "GTCX Ecosystem",
        positioning: { one_liner: "Programmable trust infrastructure." },
      } as never,
      periodLabel: "June 2026",
      pipeline: [{ desk: "capital", title: "Series A prep", status: "active", horizon: "30d" }],
      priorities: [{ priority: "P1", headline: "Strategic partner intro", kind: "partner" } as never],
    });
    expect(md).toContain("GTCX Ecosystem");
    expect(md).toContain("June 2026");
    expect(md).toContain("Series A prep");
    expect(md).toContain("Strategic partner intro");
  });
});
