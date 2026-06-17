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
  workflow_automation: {
    allowFairCode: true,
    needsWebhooks: true,
    categories: ["automation", "workflow_engine"],
  },
  auth: { mustBeSelfHost: true, categories: ["auth"], apiTypes: ["oidc"] },
  database_vector: { categories: ["database", "vector"], apiTypes: ["sql"] },
};
