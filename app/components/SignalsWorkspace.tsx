"use client";

import { useMemo, useState } from "react";
import { InboundQueue } from "./InboundQueue";
import { useWorkspace } from "./WorkspaceProvider";

const SOURCE_FILTERS = ["all", "rss", "gmail", "griot", "n8n", "manual"] as const;

type SourceFilter = (typeof SOURCE_FILTERS)[number];

export function SignalsWorkspace() {
  const { selectedClientId } = useWorkspace();
  const [filter, setFilter] = useState<SourceFilter>("all");

  const hint = useMemo(() => {
    if (filter === "all") return "All ingested signals for the selected client.";
    return `Filtered to source: ${filter}`;
  }, [filter]);

  return (
    <>
      <section className="hero-panel" aria-label="Signals filters">
        <div className="hero-copy">
          <div className="eyebrow">Phase 4 · Signals</div>
          <h1>Inbound signal feed</h1>
          <p>{hint}</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          {SOURCE_FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              className={filter === item ? "small-button" : "small-button"}
              style={filter === item ? { fontWeight: 700 } : undefined}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>
      <FilteredInboundQueue clientId={selectedClientId} sourceFilter={filter} />
    </>
  );
}

function FilteredInboundQueue(props: { clientId: string; sourceFilter: SourceFilter }) {
  if (props.sourceFilter === "all") {
    return <InboundQueue clientId={props.clientId} />;
  }
  return <InboundQueue clientId={props.clientId} sourceFilter={props.sourceFilter} />;
}
