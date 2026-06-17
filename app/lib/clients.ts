import rawClients from "../../clients/internal-gtcx-clients.json";

export type VentureClient = {
  client_id: string;
  name: string;
  segment: string;
  stage: string;
  geographies: string[];
  sectors: string[];
  goals: {
    capital: string;
    revenue: string;
    partnerships: string;
    visibility: string;
    investor_relations: string;
  };
  positioning: {
    one_liner: string;
    narrative: string;
    differentiators: string[];
  };
};

export const CLIENTS = rawClients as VentureClient[];

export const SIDEBAR_CLIENT_IDS = ["terra_os", "markets_os", "compliance_os", "nyota_ai", "terminal_os"] as const;

export const SIDEBAR_CLIENTS = SIDEBAR_CLIENT_IDS.map((id) => {
  const client = CLIENTS.find((item) => item.client_id === id);
  if (!client) throw new Error(`Missing sidebar client: ${id}`);
  return client;
});

export function getClient(clientId: string) {
  return CLIENTS.find((item) => item.client_id === clientId);
}

export function getClientLabel(clientId: string) {
  return getClient(clientId)?.name ?? clientId;
}
