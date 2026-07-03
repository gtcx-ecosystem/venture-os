#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateFleetShipGates } from './lib/feature-ship-gates.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const MANIFEST = join(ROOT, 'machine/spec/feature-registry/manifest.json');
const E2E = join(ROOT, 'machine/spec/workflows/e2e-catalog.json');
const WITNESS = join(ROOT, 'machine/ci/feature-ship-gates-latest.json');
const BACKLOG = join(ROOT, 'machine/ci/feature-ship-gates-backlog.json');

function resolveRepoPath(rel) {
  const candidates = [
    join(ROOT, rel),
    rel.startsWith('pm/') ? join(ROOT, rel.replace(/^pm\//, 'machine/')) : null,
    rel.startsWith('03-platform/') ? join(ROOT, rel.replace(/^03-platform\//, 'platform/')) : null,
  ].filter(Boolean);
  return candidates.find((candidate) => existsSync(candidate)) ?? candidates[0];
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function syncFeatureShipGates({ write = true } = {}) {
  const manifest = readJson(MANIFEST);
  const e2eCatalog = existsSync(E2E) ? readJson(E2E) : { workflows: [] };
  const features = [];

  for (const rel of manifest.shards ?? []) {
    const shardPath = resolveRepoPath(rel);
    if (!existsSync(shardPath)) throw new Error(`missing shard: ${rel}`);
    features.push(...(readJson(shardPath).features ?? []));
  }

  const result = evaluateFleetShipGates(features, { root: ROOT, e2eCatalog });
  const generatedAt = new Date().toISOString();
  const witness = {
    schema: 'gtcx://venture-os/feature-ship-gates/v1',
    repo: 'venture-os',
    generatedAt,
    protocol: 'machine/spec/feature-ship-gates-protocol.json',
    ok: result.summary.shipGateOpen === 0,
    summary: result.summary,
    byRing: result.byRing,
    maturityRingSpec: 'machine/spec/ship-release-tiers.json',
  };

  const backlog = {
    schema: 'gtcx://venture-os/feature-ship-gates-backlog/v1',
    repo: 'venture-os',
    generatedAt,
    openCount: result.backlog.length,
    items: result.backlog,
  };

  if (write) {
    mkdirSync(join(ROOT, 'machine/ci'), { recursive: true });
    writeFileSync(WITNESS, `${JSON.stringify(witness, null, 2)}\n`);
    writeFileSync(BACKLOG, `${JSON.stringify(backlog, null, 2)}\n`);
  }

  return { witness, backlog, features: result.evaluated, result };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const out = syncFeatureShipGates({ write: true });
  console.log(JSON.stringify({ ok: out.witness.ok, ...out.witness.summary, backlog: out.backlog.openCount }, null, 2));
  process.exit(0);
}
