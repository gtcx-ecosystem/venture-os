import type { AutomationReceipt } from "./receipts";
import type { InboundCandidate } from "./inbound";

type AutomationStore = {
  candidates: InboundCandidate[];
  automationReceipts: AutomationReceipt[];
};

const globalStore = globalThis as typeof globalThis & { __ventureAutomationStore?: AutomationStore };

function getStore(): AutomationStore {
  if (!globalStore.__ventureAutomationStore) {
    globalStore.__ventureAutomationStore = { candidates: [], automationReceipts: [] };
  }
  return globalStore.__ventureAutomationStore;
}

export function getInboundCandidates() {
  return [...getStore().candidates];
}

export function getAutomationReceipts() {
  return [...getStore().automationReceipts];
}

export function appendInboundCandidate(candidate: InboundCandidate) {
  const store = getStore();
  store.candidates = [candidate, ...store.candidates].slice(0, 200);
}

export function appendAutomationReceipt(receipt: AutomationReceipt) {
  const store = getStore();
  store.automationReceipts = [receipt, ...store.automationReceipts].slice(0, 100);
}

export function resetAutomationStoreForTests() {
  globalStore.__ventureAutomationStore = { candidates: [], automationReceipts: [] };
}
