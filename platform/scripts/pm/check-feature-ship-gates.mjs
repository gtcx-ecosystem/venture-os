#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncFeatureShipGates } from './sync-feature-ship-gates.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const MATRIX = join(ROOT, 'machine/ci/feature-coverage-matrix.json');
const WITNESS = join(ROOT, 'machine/ci/feature-ship-gates-latest.json');
const failures = [];

if (!existsSync(join(ROOT, 'machine/spec/feature-ship-gates-protocol.json'))) {
  failures.push('missing machine/spec/feature-ship-gates-protocol.json');
}

const dry = syncFeatureShipGates({ write: false });
const matrix = existsSync(MATRIX) ? JSON.parse(readFileSync(MATRIX, 'utf8')) : null;

if (!matrix?.features?.length) {
  failures.push('missing matrix features - run pnpm pm:feature-matrix:sync');
} else {
  const missing = matrix.features.filter((feature) => !feature.shipGates);
  if (missing.length) failures.push(`${missing.length} matrix rows missing shipGates`);
  const stale = matrix.features.filter((feature) => {
    const live = dry.features.find((row) => row.featureId === feature.id);
    return live && live.achievedRing !== feature.shipGates?.achievedRing;
  });
  if (stale.length) failures.push(`${stale.length} matrix shipGates stale - run pnpm pm:feature-matrix:sync`);
}

if (!existsSync(WITNESS)) {
  failures.push('missing feature-ship-gates witness - run pnpm pm:ship-gates:sync');
}

if (failures.length) {
  console.error('pm:ship-gates:check failed:');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(
  `pm:ship-gates:check passed - ${dry.witness.summary.featureCount} features - ${dry.witness.summary.shipGateClear} clear - ${dry.witness.summary.shipGateOpen} open`,
);
