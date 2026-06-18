import rawRegistry from "../../clients/fleet-registry.json";

export type FleetClientEntry = {
  clientId: string;
  ownerRepo: string;
  canonStrategyPath: string;
  canonSnapshot: string;
  collateralUrl?: string;
  githubUrl: string;
  localPath: string;
};

type FleetRegistry = {
  githubOrg: string;
  clients: Omit<FleetClientEntry, "githubUrl" | "localPath">[];
};

const registry = rawRegistry as FleetRegistry;

function enrich(entry: FleetRegistry["clients"][number]): FleetClientEntry {
  return {
    ...entry,
    githubUrl: `https://github.com/${registry.githubOrg}/${entry.ownerRepo}`,
    localPath: `../${entry.ownerRepo}`,
  };
}

const BY_CLIENT = new Map(registry.clients.map((entry) => [entry.clientId, enrich(entry)]));

export function getFleetClientEntry(clientId: string): FleetClientEntry | undefined {
  return BY_CLIENT.get(clientId);
}

export function listFleetClientEntries(): FleetClientEntry[] {
  return registry.clients.map(enrich);
}
