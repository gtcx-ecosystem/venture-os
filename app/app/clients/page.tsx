import { AppShell } from "@/components/AppShell";
import { ClientsWorkspace } from "@/components/ClientsWorkspace";

export default function ClientsPage() {
  return (
    <AppShell topbarTitle="Clients">
      <section className="hero-panel" aria-label="Clients intro">
        <div className="hero-copy">
          <div className="eyebrow">Phase 4 · Clients</div>
          <h1>Client command profiles</h1>
          <p>Portfolio companies and internal GTCX pilots — scoped goals, geographies, and source bindings.</p>
        </div>
      </section>
      <ClientsWorkspace />
    </AppShell>
  );
}
