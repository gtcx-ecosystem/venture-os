import { AppShell } from "@/components/AppShell";
import { SourceRegistryWorkspace } from "@/components/SourceRegistryWorkspace";

export default function SourcesPage() {
  return (
    <AppShell topbarTitle="Sources">
      <section className="hero-panel" aria-label="Sources intro">
        <div className="hero-copy">
          <div className="eyebrow">Phase 4 · Sources</div>
          <h1>Newsletter and ingest source registry</h1>
          <p>Miniflux RSS feeds and Gmail labels mapped per client — drives inbound dedupe and Listmonk lists.</p>
        </div>
      </section>
      <SourceRegistryWorkspace />
    </AppShell>
  );
}
