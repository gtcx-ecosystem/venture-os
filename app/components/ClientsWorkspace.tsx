import { CLIENTS } from "@/lib/clients";
import { FleetClientCard } from "./FleetClientCard";

export function ClientsWorkspace() {
  return (
    <section className="content-grid" aria-label="Client directory">
      <div className="board-column">
        <div className="column-heading">
          <h2>Portfolio clients</h2>
          <span className="section-label">{CLIENTS.length} profiles</span>
        </div>
        <div className="review-stack">
          {CLIENTS.map((client) => (
            <FleetClientCard key={client.client_id} client={client} />
          ))}
        </div>
      </div>
      <aside className="agent-panel" aria-label="Client goals">
        <div className="agent-header">
          <div>
            <div className="section-label">Fleet integration</div>
            <h2>Owner repos + canon</h2>
          </div>
        </div>
        <p className="fleet-panel-copy">
          Each sidebar client loads <code>pm/canon/strategy.json</code> from its owner repo when the
          ecosystem checkout is available; staging and production fall back to bundled canon snapshots
          in <code>clients/canon-snapshots/</code>.
        </p>
      </aside>
    </section>
  );
}
