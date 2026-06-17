import registry from "../../../docs/operations/workflows/newsletter-source-registry.json";
import type { InboundPayload } from "./inbound";

export type FeedBinding = {
  feedId: number;
  name: string;
  url: string;
  kind?: InboundPayload["kind"];
  urgency?: InboundPayload["urgency"];
};

export type GmailLabelBinding = {
  label: string;
  kind?: InboundPayload["kind"];
  urgency?: InboundPayload["urgency"];
};

export type ClientSourceConfig = {
  listmonkListId?: number;
  sources: string[];
  defaultSubjectPrefix?: string;
  rss?: { feeds: FeedBinding[] };
  gmail?: { labels: GmailLabelBinding[] };
};

type RegistryFile = {
  clients: Record<string, ClientSourceConfig>;
};

const clients = (registry as RegistryFile).clients;

export function getClientSourceConfig(clientId: string): ClientSourceConfig | null {
  return clients[clientId] ?? null;
}

export function listRegisteredClients() {
  return Object.keys(clients);
}

export function listSourcesForClient(clientId: string) {
  const config = getClientSourceConfig(clientId);
  if (!config) return null;

  return {
    clientId,
    sources: config.sources,
    rssFeeds: config.rss?.feeds ?? [],
    gmailLabels: config.gmail?.labels ?? [],
    listmonkListId: config.listmonkListId ?? null,
  };
}

export function resolveClientByFeedId(feedId: number): { clientId: string; feed: FeedBinding } | null {
  for (const [clientId, config] of Object.entries(clients)) {
    const feed = config.rss?.feeds.find((item) => item.feedId === feedId);
    if (feed) return { clientId, feed };
  }
  return null;
}

export function resolveClientByGmailLabel(label: string): { clientId: string; binding: GmailLabelBinding } | null {
  for (const [clientId, config] of Object.entries(clients)) {
    const binding = config.gmail?.labels.find((item) => item.label === label);
    if (binding) return { clientId, binding };
  }
  return null;
}

export function isSourceEnabled(clientId: string, source: "rss" | "gmail") {
  const config = getClientSourceConfig(clientId);
  return Boolean(config?.sources.includes(source));
}
