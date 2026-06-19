---
title: 'Tool Registry v1 Implementation Plan'
status: current
date: 2026-06-17
owner: venture-os
document_type: product
tier: critical
tags: ['venture-os', 'tool-registry', 'implementation-plan']
review_cycle: on-change
---

# Tool Registry v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a machine-readable Tool Registry with categorical pricing metadata, validation, and explainable ranking that the Venture OS app can use to select “best available” tools per workflow.

**Architecture:** Store registry data as a versioned JSON dataset, validate it with a runtime schema (Zod), and expose deterministic ranking helpers. Provide a minimal in-app UI route (`/tools`) for inspection and pinning defaults (v1: read-only).

**Tech Stack:** Next.js (App Router), TypeScript, Zod (schema validation), Vitest (unit tests).

---

## File structure (locked)

**Create**

- `app/lib/tool-registry/types.ts` — shared types and vocab unions
- `app/lib/tool-registry/schema.ts` — Zod schemas + `parseToolRecord` helpers
- `app/lib/tool-registry/dataset/tools.v1.json` — initial tool dataset (small, representative)
- `app/lib/tool-registry/ranking.ts` — ranking function + rationale output
- `app/lib/tool-registry/workflows.ts` — workflow ids + constraints mapping
- `app/lib/tool-registry/__tests__/schema.test.ts` — dataset validation tests
- `app/lib/tool-registry/__tests__/ranking.test.ts` — deterministic ranking tests
- `app/app/tools/page.tsx` — read-only registry browser (filter + badges)
- `app/app/tools/ToolTable.tsx` — table component (client)
- `app/vitest.config.ts` — Vitest config for TS + path aliases

**Modify**

- `app/package.json` — add `test` script and dev deps

---

### Task 1: Add test + schema dependencies (Vitest + Zod)

**Files:**

- Modify: `app/package.json`

- [ ] **Step 1: Add dev dependencies**

Run:

```bash
cd /Users/amanianai/Sites/gtcx-ecosystem/venture-os
pnpm --dir app add -D vitest @vitest/coverage-v8 zod
```

Expected: packages added and lockfile updated, exit code 0.

- [ ] **Step 2: Add `test` script**

Edit `app/package.json` scripts to include:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run"
  }
}
```

- [ ] **Step 3: Add `vitest.config.ts`**

Create `app/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 4: Run tests (should pass with 0 tests)**

Run:

```bash
cd /Users/amanianai/Sites/gtcx-ecosystem/venture-os
pnpm --dir app test
```

Expected: exit code 0, “0 tests” reported.

- [ ] **Step 5: Commit**

```bash
cd /Users/amanianai/Sites/gtcx-ecosystem/venture-os
git add app/package.json app/pnpm-lock.yaml app/vitest.config.ts pnpm-lock.yaml
git commit -m "$(cat <<'EOF'
chore(app): add vitest and zod for tool registry.

Introduce unit test runner and runtime schema validation dependencies.
EOF
)"
```

---

### Task 2: Implement `ToolRecord` types + Zod schema

**Files:**

- Create: `app/lib/tool-registry/types.ts`
- Create: `app/lib/tool-registry/schema.ts`
- Test: `app/lib/tool-registry/__tests__/schema.test.ts`

- [ ] **Step 1: Write failing test for schema validation**

Create `app/lib/tool-registry/__tests__/schema.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { ToolRecordSchema } from "../schema";

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
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
cd /Users/amanianai/Sites/gtcx-ecosystem/venture-os
pnpm --dir app test
```

Expected: FAIL because `ToolRecordSchema` does not exist.

- [ ] **Step 3: Create types**

Create `app/lib/tool-registry/types.ts`:

```ts
export type LicenseType = "osi" | "fair_code" | "proprietary" | "open_data";
export type PricingModel = "free" | "freemium" | "paid" | "usage_based";

export type Platform = "self_host" | "cloud" | "hybrid";
export type Deployment = "docker" | "k8s" | "binary" | "managed";

export type Category =
  | "automation"
  | "workflow_engine"
  | "crm"
  | "feeds"
  | "news_signals"
  | "search"
  | "scraping"
  | "database"
  | "vector"
  | "bi"
  | "storage"
  | "email"
  | "calendar"
  | "docs"
  | "media"
  | "auth"
  | "ai";

export type FreeTierLimitBand = "none" | "low" | "medium" | "high" | "unknown";
export type Ternary = true | false | "unknown";

export type ApiType =
  | "rest"
  | "graphql"
  | "webhook"
  | "rss"
  | "imap"
  | "smtp"
  | "oidc"
  | "s3"
  | "sql"
  | "cli"
  | "sdk";

export type ApiAuth = "api_key" | "oauth2" | "basic" | "jwt" | "session" | "mtls";
export type SdkLang = "js" | "python" | "go" | "java";

export type AssetType =
  | "text"
  | "html"
  | "pdf"
  | "doc"
  | "sheet"
  | "slide"
  | "email"
  | "calendar_event"
  | "contact"
  | "company"
  | "deal"
  | "image"
  | "audio"
  | "video"
  | "web_article"
  | "rss_item"
  | "social_post";

export type IoMode = "ingest" | "enrich" | "transform" | "publish" | "archive";

export type DataResidency = "configurable" | "fixed" | "unknown";

export type ComplianceFlag = "pii" | "financial" | "geo_sensitive";

export type ToolRecord = {
  id: string;
  name: string;
  vendor: string;
  homepage: string;
  categories: Category[];
  platforms: Platform[];
  deployment: Deployment[];
  license_type: LicenseType;
  license_spdx?: string;
  pricing_model: PricingModel;
  free_tier: { available: Ternary; limit_band: FreeTierLimitBand; expires: Ternary };
  cost_notes?: string;
  quality_score: {
    reliability: number;
    security_posture: number;
    docs_quality: number;
    api_maturity: number;
    community_health: number;
    self_host_fit: number;
  };
  confidence: number;
  last_verified: string;
  api: { types: ApiType[]; auth: ApiAuth[]; webhooks: Ternary; sdks?: SdkLang[] };
  asset_types: AssetType[];
  io_modes: IoMode[];
  data_residency: DataResidency;
  compliance_flags?: ComplianceFlag[];
  integration_effort?: "low" | "med" | "high";
  data_access?: "read" | "write" | "read_write";
  recommended_for?: string[];
  notes?: string;
};
```

- [ ] **Step 4: Implement Zod schema + exports**

Create `app/lib/tool-registry/schema.ts`:

```ts
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
  last_verified: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/),
  api: z.object({
    types: z.array(z.enum(["rest", "graphql", "webhook", "rss", "imap", "smtp", "oidc", "s3", "sql", "cli", "sdk"])).min(1),
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
```

- [ ] **Step 5: Run tests**

Run:

```bash
cd /Users/amanianai/Sites/gtcx-ecosystem/venture-os
pnpm --dir app test
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
cd /Users/amanianai/Sites/gtcx-ecosystem/venture-os
git add app/lib/tool-registry
git commit -m "$(cat <<'EOF'
feat(app): add tool registry schema and types.

Define ToolRecord validation and baseline vocabulary for ranking.
EOF
)"
```

---

### Task 3: Add tool dataset (`tools.v1.json`) and validate it in tests

**Files:**

- Create: `app/lib/tool-registry/dataset/tools.v1.json`
- Modify: `app/lib/tool-registry/__tests__/schema.test.ts`

- [ ] **Step 1: Write failing test for dataset parse**

Append to `schema.test.ts`:

```ts
import dataset from "../dataset/tools.v1.json";
import { parseToolDataset } from "../schema";

it("parses the bundled dataset", () => {
  const parsed = parseToolDataset(dataset);
  expect(parsed.version).toBe("v1");
  expect(parsed.tools.length).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Expected: FAIL because dataset file does not exist.

- [ ] **Step 3: Create dataset file**

Create `app/lib/tool-registry/dataset/tools.v1.json`:

```json
{
  "version": "v1",
  "tools": [
    {
      "id": "n8n",
      "name": "n8n",
      "vendor": "n8n",
      "homepage": "https://n8n.io",
      "categories": ["automation", "workflow_engine"],
      "platforms": ["self_host", "cloud"],
      "deployment": ["docker", "k8s", "managed"],
      "license_type": "fair_code",
      "pricing_model": "freemium",
      "free_tier": { "available": true, "limit_band": "medium", "expires": "unknown" },
      "quality_score": {
        "reliability": 84,
        "security_posture": 78,
        "docs_quality": 82,
        "api_maturity": 86,
        "community_health": 86,
        "self_host_fit": 88
      },
      "confidence": 0.6,
      "last_verified": "2026-06-17",
      "api": { "types": ["rest", "webhook"], "auth": ["api_key", "oauth2"], "webhooks": true, "sdks": ["js"] },
      "asset_types": ["web_article", "rss_item", "email", "calendar_event", "contact", "company", "deal", "text"],
      "io_modes": ["ingest", "enrich", "transform", "publish"],
      "data_residency": "configurable",
      "integration_effort": "low",
      "data_access": "read_write",
      "notes": "Automation backbone; used as execution rail and connector hub."
    },
    {
      "id": "node-red",
      "name": "Node-RED",
      "vendor": "OpenJS Foundation",
      "homepage": "https://nodered.org",
      "categories": ["automation"],
      "platforms": ["self_host"],
      "deployment": ["docker", "binary", "k8s"],
      "license_type": "osi",
      "license_spdx": "Apache-2.0",
      "pricing_model": "free",
      "free_tier": { "available": true, "limit_band": "high", "expires": false },
      "quality_score": {
        "reliability": 82,
        "security_posture": 75,
        "docs_quality": 78,
        "api_maturity": 72,
        "community_health": 80,
        "self_host_fit": 86
      },
      "confidence": 0.6,
      "last_verified": "2026-06-17",
      "api": { "types": ["rest", "webhook"], "auth": ["basic", "api_key"], "webhooks": true, "sdks": ["js"] },
      "asset_types": ["text", "email", "web_article", "rss_item"],
      "io_modes": ["ingest", "transform", "publish"],
      "data_residency": "configurable"
    },
    {
      "id": "miniflux",
      "name": "Miniflux",
      "vendor": "Miniflux",
      "homepage": "https://miniflux.app",
      "categories": ["feeds"],
      "platforms": ["self_host"],
      "deployment": ["docker", "binary"],
      "license_type": "osi",
      "license_spdx": "Apache-2.0",
      "pricing_model": "free",
      "free_tier": { "available": true, "limit_band": "high", "expires": false },
      "quality_score": {
        "reliability": 80,
        "security_posture": 72,
        "docs_quality": 74,
        "api_maturity": 70,
        "community_health": 70,
        "self_host_fit": 90
      },
      "confidence": 0.5,
      "last_verified": "2026-06-17",
      "api": { "types": ["rest", "rss"], "auth": ["api_key"], "webhooks": false },
      "asset_types": ["rss_item", "web_article", "text"],
      "io_modes": ["ingest", "archive"],
      "data_residency": "fixed",
      "integration_effort": "low",
      "data_access": "read"
    },
    {
      "id": "postgres-pgvector",
      "name": "PostgreSQL + pgvector",
      "vendor": "PostgreSQL Community",
      "homepage": "https://www.postgresql.org",
      "categories": ["database", "vector"],
      "platforms": ["self_host", "cloud"],
      "deployment": ["docker", "k8s", "managed"],
      "license_type": "osi",
      "license_spdx": "PostgreSQL",
      "pricing_model": "free",
      "free_tier": { "available": true, "limit_band": "high", "expires": false },
      "quality_score": {
        "reliability": 92,
        "security_posture": 88,
        "docs_quality": 90,
        "api_maturity": 92,
        "community_health": 92,
        "self_host_fit": 88
      },
      "confidence": 0.7,
      "last_verified": "2026-06-17",
      "api": { "types": ["sql"], "auth": ["basic", "mtls"], "webhooks": "unknown" },
      "asset_types": ["text", "email", "calendar_event", "contact", "company", "deal"],
      "io_modes": ["ingest", "enrich", "transform", "archive"],
      "data_residency": "configurable",
      "integration_effort": "med",
      "data_access": "read_write"
    },
    {
      "id": "keycloak",
      "name": "Keycloak",
      "vendor": "Keycloak",
      "homepage": "https://www.keycloak.org",
      "categories": ["auth"],
      "platforms": ["self_host"],
      "deployment": ["docker", "k8s"],
      "license_type": "osi",
      "license_spdx": "Apache-2.0",
      "pricing_model": "free",
      "free_tier": { "available": true, "limit_band": "high", "expires": false },
      "quality_score": {
        "reliability": 84,
        "security_posture": 88,
        "docs_quality": 78,
        "api_maturity": 82,
        "community_health": 80,
        "self_host_fit": 86
      },
      "confidence": 0.6,
      "last_verified": "2026-06-17",
      "api": { "types": ["oidc", "rest"], "auth": ["oauth2"], "webhooks": "unknown" },
      "asset_types": ["text"],
      "io_modes": ["enrich"],
      "data_residency": "configurable"
    }
  ]
}
```

- [ ] **Step 4: Run tests**

Run:

```bash
cd /Users/amanianai/Sites/gtcx-ecosystem/venture-os
pnpm --dir app test
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd /Users/amanianai/Sites/gtcx-ecosystem/venture-os
git add app/lib/tool-registry/dataset/tools.v1.json app/lib/tool-registry/__tests__/schema.test.ts
git commit -m "$(cat <<'EOF'
feat(app): add v1 tool registry dataset.

Bundle a minimal FOSS-first tool list and validate it via schema tests.
EOF
)"
```

---

### Task 4: Implement deterministic ranking with explainable rationale

**Files:**

- Create: `app/lib/tool-registry/workflows.ts`
- Create: `app/lib/tool-registry/ranking.ts`
- Test: `app/lib/tool-registry/__tests__/ranking.test.ts`

- [ ] **Step 1: Write failing ranking tests**

Create `app/lib/tool-registry/__tests__/ranking.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import dataset from "../dataset/tools.v1.json";
import { parseToolDataset } from "../schema";
import { rankToolsForWorkflow } from "../ranking";

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
    expect([\"n8n\", \"node-red\"]).toContain(ranked[0]?.tool.id);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Expected: FAIL because `rankToolsForWorkflow` not implemented.

- [ ] **Step 3: Define workflow constraints**

Create `app/lib/tool-registry/workflows.ts`:

```ts
export type WorkflowId = "rss_ingest" | "workflow_automation" | "auth" | "database_vector";

export type WorkflowConstraints = {
  mustBeSelfHost?: boolean;
  allowFairCode?: boolean;
  needsWebhooks?: boolean;
  categories?: string[];
  apiTypes?: string[];
};

export const WORKFLOW_DEFAULTS: Record<WorkflowId, WorkflowConstraints> = {
  rss_ingest: { mustBeSelfHost: true, categories: ["feeds"], apiTypes: ["rss", "rest"] },
  workflow_automation: { allowFairCode: true, needsWebhooks: true, categories: ["automation", "workflow_engine"] },
  auth: { mustBeSelfHost: true, categories: ["auth"], apiTypes: ["oidc"] },
  database_vector: { categories: ["database", "vector"], apiTypes: ["sql"] },
};
```

- [ ] **Step 4: Implement ranking**

Create `app/lib/tool-registry/ranking.ts`:

```ts
import type { ToolRecord } from "./schema";
import { WORKFLOW_DEFAULTS, type WorkflowConstraints, type WorkflowId } from "./workflows";

type RankedTool = { tool: ToolRecord; rank_score: number; rationale: string[] };

function avg(values: number[]) {
  return values.reduce((a, b) => a + b, 0) / Math.max(1, values.length);
}

function baseQuality(tool: ToolRecord) {
  return avg([
    tool.quality_score.reliability,
    tool.quality_score.security_posture,
    tool.quality_score.docs_quality,
    tool.quality_score.api_maturity,
    tool.quality_score.community_health,
    tool.quality_score.self_host_fit,
  ]);
}

function hasAny(haystack: string[], needles?: string[]) {
  if (!needles?.length) return true;
  return needles.some((n) => haystack.includes(n));
}

function ternaryTrue(value: ToolRecord["api"]["webhooks"]) {
  return value === true;
}

export function rankToolsForWorkflow(
  workflowId: WorkflowId,
  input: { tools: ToolRecord[]; constraints?: WorkflowConstraints },
) {
  const defaults = WORKFLOW_DEFAULTS[workflowId];
  const constraints: WorkflowConstraints = { ...defaults, ...(input.constraints ?? {}) };

  const filtered = input.tools.filter((tool) => {
    if (constraints.mustBeSelfHost && !tool.platforms.includes("self_host")) return false;
    if (tool.license_type === "fair_code" && constraints.allowFairCode === false) return false;
    if (constraints.needsWebhooks && !ternaryTrue(tool.api.webhooks)) return false;
    if (constraints.categories && !hasAny(tool.categories, constraints.categories)) return false;
    if (constraints.apiTypes && !hasAny(tool.api.types, constraints.apiTypes)) return false;
    return true;
  });

  const ranked = filtered
    .map((tool): RankedTool => {
      const rationale: string[] = [];
      const quality = baseQuality(tool);
      const confidence = tool.confidence * 100;
      const ossBoost = tool.license_type === "osi" ? 6 : tool.license_type === "fair_code" ? 2 : -6;
      const selfHostBoost = tool.platforms.includes("self_host") ? 6 : -2;
      const freeBoost =
        tool.pricing_model === "free"
          ? 4
          : tool.free_tier.available === true
            ? 2
            : tool.free_tier.available === false
              ? -2
              : 0;

      const webhookBoost = constraints.needsWebhooks ? 0 : tool.api.webhooks === true ? 1 : 0;
      const score = Math.round(quality * 0.75 + confidence * 0.15 + (ossBoost + selfHostBoost + freeBoost + webhookBoost));

      if (tool.license_type === "osi") rationale.push("OSI-licensed");
      if (tool.platforms.includes("self_host")) rationale.push("Self-host capable");
      if (tool.pricing_model === "free" || tool.free_tier.available === true) rationale.push("Free / free-tier available");
      if (tool.api.webhooks === true) rationale.push("Supports webhooks");
      rationale.push(`Quality ${Math.round(quality)}/100 (confidence ${tool.confidence})`);

      return { tool, rank_score: score, rationale };
    })
    .sort((a, b) => b.rank_score - a.rank_score);

  return ranked;
}
```

- [ ] **Step 5: Run tests**

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
cd /Users/amanianai/Sites/gtcx-ecosystem/venture-os
git add app/lib/tool-registry/ranking.ts app/lib/tool-registry/workflows.ts app/lib/tool-registry/__tests__/ranking.test.ts
git commit -m "$(cat <<'EOF'
feat(app): add explainable tool ranking for workflows.

Introduce deterministic ranking with constraints and rationale output.
EOF
)"
```

---

### Task 5: Add `/tools` inspection UI (read-only)

**Files:**

- Create: `app/app/tools/page.tsx`
- Create: `app/app/tools/ToolTable.tsx`

- [ ] **Step 1: Create the `/tools` route**

Create `app/app/tools/page.tsx`:

```tsx
import dataset from "@/lib/tool-registry/dataset/tools.v1.json";
import { parseToolDataset } from "@/lib/tool-registry/schema";
import { ToolTable } from "./ToolTable";

export default function ToolsPage() {
  const parsed = parseToolDataset(dataset);
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ margin: 0 }}>Tools</h1>
      <p style={{ marginTop: 10, color: "var(--muted)" }}>Tool Registry v1 (FOSS-first). Inspect, filter, and verify metadata.</p>
      <ToolTable tools={parsed.tools} />
    </div>
  );
}
```

- [ ] **Step 2: Create a client-side table with search + badges**

Create `app/app/tools/ToolTable.tsx`:

```tsx
"use client";

import { useMemo, useState } from "react";
import type { ToolRecord } from "@/lib/tool-registry/schema";

function Badge(props: { children: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: 999,
        border: "1px solid var(--stroke)",
        background: "rgba(255,255,255,.02)",
        color: "var(--text)",
        fontSize: 12,
        fontWeight: 650,
        gap: 6,
      }}
    >
      {props.children}
    </span>
  );
}

export function ToolTable(props: { tools: ToolRecord[] }) {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return props.tools;
    return props.tools.filter((t) => (t.name + " " + t.vendor + " " + t.categories.join(" ")).toLowerCase().includes(q));
  }, [query, props.tools]);

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools (name, vendor, category)"
          style={{
            width: "min(560px, 100%)",
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid var(--stroke)",
            background: "rgba(255,255,255,.02)",
            color: "var(--text)",
          }}
        />
        <span style={{ color: "var(--subtle)", fontSize: 12 }}>{visible.length} tools</span>
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
        {visible.map((tool) => (
          <div
            key={tool.id}
            style={{
              border: "1px solid var(--stroke)",
              borderRadius: 14,
              padding: 14,
              background: "rgba(255,255,255,.02)",
              display: "grid",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 760 }}>{tool.name}</div>
                <div style={{ color: "var(--subtle)", fontSize: 12, marginTop: 4 }}>{tool.vendor}</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Badge>{tool.license_type}</Badge>
                <Badge>{tool.pricing_model}</Badge>
                <Badge>{tool.free_tier.limit_band}</Badge>
                <Badge>{tool.platforms.includes("self_host") ? "self_host" : "cloud"}</Badge>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {tool.categories.map((c) => (
                <Badge key={c}>{c}</Badge>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
              <div style={{ color: "var(--muted)", fontSize: 12 }}>
                <div className="section-label">API</div>
                <div style={{ marginTop: 6, color: "var(--text)" }}>{tool.api.types.join(", ")}</div>
              </div>
              <div style={{ color: "var(--muted)", fontSize: 12 }}>
                <div className="section-label">Assets</div>
                <div style={{ marginTop: 6, color: "var(--text)" }}>{tool.asset_types.slice(0, 5).join(", ")}{tool.asset_types.length > 5 ? "…" : ""}</div>
              </div>
              <div style={{ color: "var(--muted)", fontSize: 12 }}>
                <div className="section-label">Quality</div>
                <div style={{ marginTop: 6, color: "var(--text)" }}>
                  {Math.round((tool.quality_score.reliability + tool.quality_score.security_posture + tool.quality_score.docs_quality + tool.quality_score.api_maturity + tool.quality_score.community_health + tool.quality_score.self_host_fit) / 6)}
                  /100 · conf {tool.confidence}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Build + lint**

Run:

```bash
cd /Users/amanianai/Sites/gtcx-ecosystem/venture-os
pnpm lint
pnpm build
pnpm --dir app test
```

Expected: all exit code 0.

- [ ] **Step 4: Commit**

```bash
cd /Users/amanianai/Sites/gtcx-ecosystem/venture-os
git add app/app/tools
git commit -m "$(cat <<'EOF'
feat(app): add tools registry inspection page.

Expose the tool registry dataset in a searchable, badge-rich UI for power users.
EOF
)"
```

---

## Self-review checklist (run after plan execution)

- **Spec coverage:** `ToolRecord` includes pricing categorical bands, quality_score, API metadata, platforms, asset_types, io_modes, and governance flags; ranking returns explainable rationale.
- **Placeholder scan:** no TBD/TODO steps; every file and command path is explicit.
- **Type consistency:** `ToolRecordSchema` and `ToolRecord` are single source of truth via Zod inference.

