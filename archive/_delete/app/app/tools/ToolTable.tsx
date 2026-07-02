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
      }}
    >
      {props.children}
    </span>
  );
}

function avgQuality(tool: ToolRecord) {
  const q = tool.quality_score;
  return Math.round(
    (q.reliability + q.security_posture + q.docs_quality + q.api_maturity + q.community_health + q.self_host_fit) / 6,
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
                <div style={{ marginTop: 6, color: "var(--text)" }}>
                  {tool.asset_types.slice(0, 5).join(", ")}
                  {tool.asset_types.length > 5 ? "…" : ""}
                </div>
              </div>
              <div style={{ color: "var(--muted)", fontSize: 12 }}>
                <div className="section-label">Quality</div>
                <div style={{ marginTop: 6, color: "var(--text)" }}>
                  {avgQuality(tool)}/100 · conf {tool.confidence}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
