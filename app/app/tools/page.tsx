import { AppShell } from "@/components/AppShell";
import dataset from "@/lib/tool-registry/dataset/tools.v1.json";
import { parseToolDataset } from "@/lib/tool-registry/schema";
import { ToolsWorkspace } from "./ToolsWorkspace";

export default function ToolsPage() {
  const parsed = parseToolDataset(dataset);

  return (
    <AppShell topbarTitle="Tool Registry">
      <section className="hero-panel" aria-label="Tool registry">
        <div className="hero-copy">
          <div className="eyebrow">Integrations</div>
          <h1>FOSS-first tool registry with explainable ranking.</h1>
          <p>Inspect metadata, rank by workflow, and log selection receipts for audit replay.</p>
        </div>
      </section>
      <ToolsWorkspace tools={parsed.tools} />
    </AppShell>
  );
}
