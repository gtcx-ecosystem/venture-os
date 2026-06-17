"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "./WorkspaceProvider";

type FeedBinding = {
  feedId: number;
  name: string;
  url: string;
  kind?: string;
  urgency?: string;
};

type GmailLabelBinding = {
  label: string;
  kind?: string;
  urgency?: string;
};

type ClientSources = {
  clientId: string;
  sources: string[];
  rssFeeds: FeedBinding[];
  gmailLabels: GmailLabelBinding[];
  listmonkListId: number | null;
};

export function SourceRegistryWorkspace(props: { clientId?: string }) {
  const { selectedClientId } = useWorkspace();
  const clientId = props.clientId ?? selectedClientId;
  const [data, setData] = useState<ClientSources | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const query = clientId ? `?clientId=${encodeURIComponent(clientId)}` : "";

    fetch(`/api/venture/sources${query}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<ClientSources & { ok?: boolean }>;
      })
      .then((payload) => {
        if (cancelled) return;
        setData(payload);
        setError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Could not load source registry.");
        setData(null);
      });

    return () => {
      cancelled = true;
    };
  }, [clientId]);

  if (error) {
    return <p style={{ color: "var(--muted)" }}>{error}</p>;
  }

  if (!data) {
    return <p style={{ color: "var(--muted)" }}>Loading source registry…</p>;
  }

  return (
    <section className="content-grid" aria-label="Source registry">
      <div className="board-column">
        <div className="column-heading">
          <h2>RSS feeds (Miniflux)</h2>
          <span className="section-label">{data.rssFeeds.length} registered</span>
        </div>
        <div className="review-stack">
          {data.rssFeeds.length === 0 ? (
            <article className="review-card">
              <p>No RSS feeds registered for this client.</p>
            </article>
          ) : (
            data.rssFeeds.map((feed) => (
              <article key={feed.feedId} className="review-card">
                <div className="review-topline">
                  <span>feed {feed.feedId}</span>
                  <strong>{feed.urgency ?? "P2"}</strong>
                </div>
                <p>{feed.name}</p>
                <p style={{ color: "var(--muted)", fontSize: 12 }}>{feed.url}</p>
              </article>
            ))
          )}
        </div>
      </div>
      <aside className="agent-panel" aria-label="Gmail labels">
        <div className="agent-header">
          <div>
            <div className="section-label">Gmail</div>
            <h2>Label bindings</h2>
          </div>
        </div>
        <div className="review-stack">
          {data.gmailLabels.map((label) => (
            <article key={label.label} className="review-card">
              <div className="review-topline">
                <span>{label.kind ?? "inbox"}</span>
                <strong>{label.urgency ?? "P2"}</strong>
              </div>
              <p style={{ fontSize: 13 }}>{label.label}</p>
            </article>
          ))}
        </div>
        <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 16 }}>
          Listmonk list #{data.listmonkListId ?? "—"} · enabled: {data.sources.join(", ")}
        </p>
      </aside>
    </section>
  );
}
