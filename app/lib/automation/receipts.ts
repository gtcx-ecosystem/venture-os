export type AutomationReceiptKind = "inbound_capture" | "digest_scheduled" | "dedupe_skip";

export type AutomationReceipt = {
  id: string;
  timestamp: string;
  kind: AutomationReceiptKind;
  actor: string;
  clientId?: string;
  summary: string;
  metadata: Record<string, string>;
};

export function createAutomationReceipt(input: {
  kind: AutomationReceiptKind;
  summary: string;
  clientId?: string;
  metadata?: Record<string, string>;
  actor?: string;
}): AutomationReceipt {
  return {
    id: `auto-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    kind: input.kind,
    actor: input.actor ?? "n8n",
    clientId: input.clientId,
    summary: input.summary,
    metadata: input.metadata ?? {},
  };
}
