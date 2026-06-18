import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getFleetClientEntry } from "@/lib/fleet-registry";
import type { CanonStrategySummary } from "./canon-strategy-shared";

export type { CanonStrategySummary } from "./canon-strategy-shared";
export { heroCopyFromStrategy } from "./canon-strategy-shared";

const VENTURE_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../..");

function ecosystemRoot() {
  return process.env.FLEET_ECOSYSTEM_ROOT ?? join(VENTURE_ROOT, "..");
}

function parseStrategyPayload(text: string, source: "live" | "snapshot"): CanonStrategySummary | null {
  try {
    const data = JSON.parse(text) as {
      productId?: string;
      repo?: string;
      updated?: string;
      vision?: { statement?: string; horizon?: string };
      mission?: string;
    };
    const statement = data.vision?.statement?.trim();
    const mission = data.mission?.trim();
    if (!statement || !mission) return null;
    return {
      productId: data.productId ?? data.repo ?? "unknown",
      repo: data.repo ?? data.productId ?? "unknown",
      updated: data.updated ?? "unknown",
      vision: { statement, horizon: data.vision?.horizon },
      mission,
      source,
    };
  } catch {
    return null;
  }
}

function readSnapshot(_clientId: string, snapshotRel: string) {
  const snapshotPath = join(VENTURE_ROOT, snapshotRel);
  if (!existsSync(snapshotPath)) return null;
  return parseStrategyPayload(readFileSync(snapshotPath, "utf8"), "snapshot");
}

function readLive(ownerRepo: string, canonStrategyPath: string) {
  const livePath = join(ecosystemRoot(), ownerRepo, canonStrategyPath);
  if (!existsSync(livePath)) return null;
  return parseStrategyPayload(readFileSync(livePath, "utf8"), "live");
}

export function resolveCanonStrategy(clientId: string): CanonStrategySummary | null {
  const fleet = getFleetClientEntry(clientId);
  if (!fleet) return null;

  const live = readLive(fleet.ownerRepo, fleet.canonStrategyPath);
  if (live) return live;

  return readSnapshot(clientId, fleet.canonSnapshot);
}
