import { describe, expect, it } from "vitest";
import dataset from "../dataset/tools.v1.json";
import { rankToolsForWorkflow } from "../ranking";
import { parseToolDataset } from "../schema";

describe("rankToolsForWorkflow", () => {
  it("prefers self-host OSS feeds for rss_ingest", () => {
    const parsed = parseToolDataset(dataset);
    const ranked = rankToolsForWorkflow("rss_ingest", { tools: parsed.tools });
    expect(ranked[0]?.tool.id).toBe("miniflux");
    expect(ranked[0]?.rationale.length).toBeGreaterThan(0);
  });

  it("prefers automation tools with webhooks for workflow_automation", () => {
    const parsed = parseToolDataset(dataset);
    const ranked = rankToolsForWorkflow("workflow_automation", { tools: parsed.tools });
    expect(["n8n", "node-red"]).toContain(ranked[0]?.tool.id);
  });
});
