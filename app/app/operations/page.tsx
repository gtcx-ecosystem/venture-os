import { AppShell } from "@/components/AppShell";
import { OperationsHub } from "@/components/OperationsHub";

export default function OperationsPage() {
  return (
    <AppShell topbarTitle="Operations">
      <section className="hero-panel" aria-label="Operations hub">
        <div className="hero-copy">
          <div className="eyebrow">Phase 2 — managed service</div>
          <h1>Operating system setup</h1>
          <p>ClickUp, Gmail, Calendar, and n8n rails — mapped to Venture OS app surfaces.</p>
        </div>
      </section>
      <OperationsHub />
    </AppShell>
  );
}
