import { z } from "zod";

const score = () => z.number().min(0).max(100);
const ternary = z.union([z.boolean(), z.literal("unknown")]);

export const ToolRecordSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  vendor: z.string().min(1),
  homepage: z.string().url(),
  categories: z.array(z.string().min(1)).min(1),
  platforms: z.array(z.enum(["self_host", "cloud", "hybrid"])).min(1),
  deployment: z.array(z.enum(["docker", "k8s", "binary", "managed"])).min(1),
  license_type: z.enum(["osi", "fair_code", "proprietary", "open_data"]),
  license_spdx: z.string().min(1).optional(),
  pricing_model: z.enum(["free", "freemium", "paid", "usage_based"]),
  free_tier: z.object({
    available: ternary,
    limit_band: z.enum(["none", "low", "medium", "high", "unknown"]),
    expires: ternary,
  }),
  cost_notes: z.string().min(1).optional(),
  quality_score: z.object({
    reliability: score(),
    security_posture: score(),
    docs_quality: score(),
    api_maturity: score(),
    community_health: score(),
    self_host_fit: score(),
  }),
  confidence: z.number().min(0).max(1),
  last_verified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  api: z.object({
    types: z
      .array(
        z.enum(["rest", "graphql", "webhook", "rss", "imap", "smtp", "oidc", "s3", "sql", "cli", "sdk"]),
      )
      .min(1),
    auth: z.array(z.enum(["api_key", "oauth2", "basic", "jwt", "session", "mtls"])).min(1),
    webhooks: ternary,
    sdks: z.array(z.enum(["js", "python", "go", "java"])).optional(),
  }),
  asset_types: z.array(z.string().min(1)).min(1),
  io_modes: z.array(z.enum(["ingest", "enrich", "transform", "publish", "archive"])).min(1),
  data_residency: z.enum(["configurable", "fixed", "unknown"]),
  compliance_flags: z.array(z.enum(["pii", "financial", "geo_sensitive"])).optional(),
  integration_effort: z.enum(["low", "med", "high"]).optional(),
  data_access: z.enum(["read", "write", "read_write"]).optional(),
  recommended_for: z.array(z.string().min(1)).optional(),
  notes: z.string().min(1).optional(),
});

export type ToolRecord = z.infer<typeof ToolRecordSchema>;

export const ToolDatasetSchema = z.object({
  version: z.literal("v1"),
  tools: z.array(ToolRecordSchema).min(1),
});

export function parseToolDataset(input: unknown) {
  return ToolDatasetSchema.parse(input);
}
