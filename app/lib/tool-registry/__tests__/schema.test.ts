import { describe, expect, it } from "vitest";
import dataset from "../dataset/tools.v1.json";
import { parseToolDataset, ToolRecordSchema } from "../schema";

describe("ToolRecordSchema", () => {
  it("rejects invalid license_type", () => {
    const result = ToolRecordSchema.safeParse({
      id: "bad",
      name: "Bad Tool",
      vendor: "Bad",
      homepage: "https://example.com",
      categories: ["automation"],
      platforms: ["self_host"],
      deployment: ["docker"],
      license_type: "nonsense",
      pricing_model: "free",
      free_tier: { available: true, limit_band: "high", expires: false },
      quality_score: {
        reliability: 80,
        security_posture: 80,
        docs_quality: 80,
        api_maturity: 80,
        community_health: 80,
        self_host_fit: 80,
      },
      confidence: 0.8,
      last_verified: "2026-06-17",
      api: { types: ["rest"], auth: ["api_key"], webhooks: true, sdks: ["js"] },
      asset_types: ["text"],
      io_modes: ["ingest"],
      data_residency: "unknown",
    });

    expect(result.success).toBe(false);
  });

  it("parses the bundled dataset", () => {
    const parsed = parseToolDataset(dataset);
    expect(parsed.version).toBe("v1");
    expect(parsed.tools.length).toBeGreaterThan(0);
  });
});
