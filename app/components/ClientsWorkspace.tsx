import Link from "next/link";
import { listSourcesForClient } from "@/lib/automation/source-registry";
import { CLIENTS } from "@/lib/clients";

export function ClientsWorkspace() {
  return (
    <section className="content-grid" aria-label="Client directory">
      <div className="board-column">
        <div className="column-heading">
          <h2>Portfolio clients</h2>
          <span className="section-label">{CLIENTS.length} profiles</span>
        </div>
        <div className="review-stack">
          {CLIENTS.map((client) => {
            const sources = listSourcesForClient(client.client_id);
            return (
              <article key={client.client_id} className="review-card">
                <div className="review-topline">
                  <span>{client.segment}</span>
                  <strong>{client.stage}</strong>
                </div>
                <h3 style={{ margin: "8px 0" }}>{client.name}</h3>
                <p>{client.positioning.one_liner}</p>
                <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 8 }}>
                  {client.geographies.join(" · ")} · {sources?.rssFeeds.length ?? 0} RSS ·{" "}
                  {sources?.gmailLabels.length ?? 0} Gmail labels
                </p>
                <Link href={`/sources?clientId=${client.client_id}`} className="small-button" style={{ display: "inline-block", marginTop: 8 }}>
                  View sources
                </Link>
              </article>
            );
          })}
        </div>
      </div>
      <aside className="agent-panel" aria-label="Client goals">
        <div className="agent-header">
          <div>
            <div className="section-label">Operating model</div>
            <h2>Desk goals</h2>
          </div>
        </div>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>
          Each client profile links capital, revenue, partnership, and visibility desks. Select a client in the
          sidebar to scope briefs, signals, and source registry.
        </p>
      </aside>
    </section>
  );
}
