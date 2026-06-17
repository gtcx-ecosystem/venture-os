import type { ToolRecord } from "./schema";
import { WORKFLOW_DEFAULTS, type WorkflowConstraints, type WorkflowId } from "./workflows";

export type RankedTool = { tool: ToolRecord; rank_score: number; rationale: string[] };

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

export function rankToolsForWorkflow(
  workflowId: WorkflowId,
  input: { tools: ToolRecord[]; constraints?: WorkflowConstraints },
): RankedTool[] {
  const defaults = WORKFLOW_DEFAULTS[workflowId];
  const constraints: WorkflowConstraints = { ...defaults, ...(input.constraints ?? {}) };

  const filtered = input.tools.filter((tool) => {
    if (constraints.mustBeSelfHost && !tool.platforms.includes("self_host")) return false;
    if (tool.license_type === "fair_code" && constraints.allowFairCode === false) return false;
    if (constraints.needsWebhooks && tool.api.webhooks !== true) return false;
    if (constraints.categories && !hasAny(tool.categories, constraints.categories)) return false;
    if (constraints.apiTypes && !hasAny(tool.api.types, constraints.apiTypes)) return false;
    return true;
  });

  return filtered
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
      const score = Math.round(quality * 0.75 + confidence * 0.15 + ossBoost + selfHostBoost + freeBoost + webhookBoost);

      if (tool.license_type === "osi") rationale.push("OSI-licensed");
      if (tool.platforms.includes("self_host")) rationale.push("Self-host capable");
      if (tool.pricing_model === "free" || tool.free_tier.available === true) {
        rationale.push("Free / free-tier available");
      }
      if (tool.api.webhooks === true) rationale.push("Supports webhooks");
      rationale.push(`Quality ${Math.round(quality)}/100 (confidence ${tool.confidence})`);

      return { tool, rank_score: score, rationale };
    })
    .sort((a, b) => b.rank_score - a.rank_score);
}
