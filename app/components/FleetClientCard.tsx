"use client";

import Link from "next/link";
import { listSourcesForClient } from "@/lib/automation/source-registry";
import { getFleetClientEntry, type VentureClient } from "@/lib/clients";
import { useClientStrategy } from "@/lib/hooks/useClientStrategy";

export function FleetClientCard({ client }: { client: VentureClient }) {
  const fleet = getFleetClientEntry(client.client_id);
  const { strategy } = useClientStrategy(client.client_id);
  const sources = listSourcesForClient(client.client_id);

  return (
    <article className="review-card fleet-client-card">
      <div className="review-topline">
        <span>{client.segment}</span>
        <strong>{client.stage}</strong>
      </div>
      <h3 className="fleet-client-title">{client.name}</h3>
      <p>{strategy?.vision.statement ?? client.positioning.one_liner}</p>
      {strategy?.mission ? <p className="fleet-client-mission">{strategy.mission}</p> : null}
      <p className="fleet-client-meta">
        {client.geographies.join(" · ")} · {sources?.rssFeeds.length ?? 0} RSS ·{" "}
        {sources?.gmailLabels.length ?? 0} Gmail labels
      </p>
      <div className="fleet-client-actions">
        <Link href={`/sources?clientId=${client.client_id}`} className="small-button">
          View sources
        </Link>
        {fleet ? (
          <a
            href={fleet.githubUrl}
            className="small-button"
            target="_blank"
            rel="noreferrer"
          >
            Open {fleet.ownerRepo}
          </a>
        ) : null}
        {fleet?.collateralUrl ? (
          <a
            href={fleet.collateralUrl}
            className="small-button"
            target="_blank"
            rel="noreferrer"
          >
            Collateral surface
          </a>
        ) : null}
      </div>
    </article>
  );
}
