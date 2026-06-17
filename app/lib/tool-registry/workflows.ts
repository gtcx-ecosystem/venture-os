export type WorkflowId =
  | "rss_ingest"
  | "workflow_automation"
  | "auth"
  | "database_vector"
  | "brief_signals"
  | "brief_publish";

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
  brief_signals: { mustBeSelfHost: true, categories: ["feeds", "news_signals"], apiTypes: ["rss", "rest"] },
  brief_publish: {
    allowFairCode: true,
    needsWebhooks: true,
    categories: ["automation"],
    apiTypes: ["rest", "webhook"],
  },
};

export const WORKFLOW_LABELS: Record<WorkflowId, string> = {
  rss_ingest: "RSS / news ingestion",
  workflow_automation: "Workflow automation",
  auth: "Auth / identity",
  database_vector: "Database + vector",
  brief_signals: "Brief — signal ingestion",
  brief_publish: "Brief — publish + outreach",
};
