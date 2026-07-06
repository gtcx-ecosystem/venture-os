#!/usr/bin/env node
/** Consumer pin check — resolve canon-os SoR, never fork. */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { repoRootFromImportMeta } from './lib/repo-root.mjs';

const REPO = repoRootFromImportMeta(import.meta.url);
const CONTRACT_ID = 'CANON-PRODUCT-CANON-V1';
const pinPath = join(REPO, 'config/product-canon-contract.json');

function main() {
  if (!existsSync(pinPath)) {
    console.log('canon:contracts:check SKIP — no consumer pin');
    process.exit(0);
  }
  const pin = JSON.parse(readFileSync(pinPath, 'utf8'));
  if (pin.contractId !== CONTRACT_ID) {
    console.error(`canon:contracts:check FAIL — pin contractId ${pin.contractId}`);
    process.exit(1);
  }
  const sorAbs = resolve(REPO, pin.sor);
  if (!existsSync(sorAbs)) {
    console.error(`canon:contracts:check FAIL — sor not found: ${pin.sor}`);
    process.exit(1);
  }
  const contract = JSON.parse(readFileSync(sorAbs, 'utf8'));
  if (contract.contractId !== CONTRACT_ID) {
    console.error(`canon:contracts:check FAIL — provider contractId ${contract.contractId}`);
    process.exit(1);
  }
  console.log(`canon:contracts:check PASS — consumer pinned to ${CONTRACT_ID}@${pin.version ?? contract.version}`);
}

main();
