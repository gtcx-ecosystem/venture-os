import { AppShell } from "@/components/AppShell";
import dataset from "@/lib/tool-registry/dataset/tools.v1.json";
import { parseToolDataset } from "@/lib/tool-registry/schema";
import { ToolTable } from "./ToolTable";

export default function ToolsPage() {
  const parsed = parseToolDataset(dataset);

  return (
    <AppShell topbarTitle="Tool Registry">
      <section className="hero-panel" aria-label="Tool registry">
        <div className="hero-copy">
          <div className="eyebrow">Integrations</div>
          <h1>FOSS-first tool registry with explainable ranking.</h1>
          <p>Inspect metadata, pricing bands, API coverage, and quality scores for workflow selection.</p>
        </div>
      </section>
      <ToolTable tools={parsed.tools} />
    </AppShell>
  );
}
