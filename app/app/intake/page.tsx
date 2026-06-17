import { AppShell } from "@/components/AppShell";
import { IntakeForm } from "@/components/IntakeForm";

export default function IntakePage() {
  return (
    <AppShell topbarTitle="Client Intake">
      <section className="hero-panel" aria-label="Client intake">
        <div className="hero-copy">
          <div className="eyebrow">Phase 2 — managed service</div>
          <h1>Day 0 client intake</h1>
          <p>Capture founder context, goals, and constraints to bootstrap the operating system in five days.</p>
        </div>
      </section>
      <IntakeForm />
    </AppShell>
  );
}
