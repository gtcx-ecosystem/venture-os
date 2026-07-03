#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateFeatureShipGates } from './lib/feature-ship-gates.mjs';
import { syncFeatureShipGates } from './sync-feature-ship-gates.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const MANIFEST = join(ROOT, 'machine/spec/feature-registry/manifest.json');
const E2E = join(ROOT, 'machine/spec/workflows/e2e-catalog.json');
const OUT = join(ROOT, 'machine/ci/feature-coverage-matrix.json');

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

const manifest = readJson(MANIFEST);
const e2eCatalog = existsSync(E2E) ? readJson(E2E) : { workflows: [] };
const e2eWorkflowIds = new Set((e2eCatalog.workflows ?? []).map((workflow) => workflow.id));
const features = [];

for (const rel of manifest.shards ?? []) {
  const path = resolveRepoPath(rel);
  if (!existsSync(path)) throw new Error(`missing shard: ${rel}`);
  features.push(...(readJson(path).features ?? []));
}

const pillarCounts = {};
const tierCounts = { core: 0, competitive: 0, moat: 0, foundation: 0 };
const classCounts = { capability: 0, 'workflow-step': 0, 'spec-gap': 0 };
const shipGateIndex = { clear: 0, open: 0 };

for (const feature of features) {
  for (const pillar of feature.pillars ?? []) pillarCounts[pillar] = (pillarCounts[pillar] ?? 0) + 1;
  if (feature.featureTier) tierCounts[feature.featureTier] = (tierCounts[feature.featureTier] ?? 0) + 1;
  if (feature.featureClass) classCounts[feature.featureClass] = (classCounts[feature.featureClass] ?? 0) + 1;
}

const mapped = features.map((feature) => {
  const covered = feature.status === 'covered' || feature.status === 'partial';
  const blockingGap = ['production-gap', 'impl-only', 'impl-ahead-of-spec', 'gap'].includes(feature.gapClass);
  const gtmReady = feature.featureClass !== 'spec-gap' && covered && !blockingGap;
  const shipGates = evaluateFeatureShipGates(feature, { root: ROOT, e2eWorkflowIds });
  if (shipGates.shipGateClear) shipGateIndex.clear += 1;
  else shipGateIndex.open += 1;

  return {
    id: feature.id,
    name: feature.name,
    domain: feature.domain,
    featureTier: feature.featureTier ?? null,
    featureClass: feature.featureClass ?? 'capability',
    workflowId: feature.workflowId ?? null,
    workflowStep: feature.workflowStep ?? null,
    jtbdIds: feature.jtbdIds ?? [],
    plane: feature.plane ?? null,
    exrRef: feature.exrRef ?? null,
    uatId: feature.uatId ?? null,
    capabilityId: feature.capabilityId ?? null,
    status: feature.status,
    shipStatus: feature.status === 'covered' ? 'shipped' : feature.status === 'partial' ? 'partial' : 'spec-only',
    coveragePercent: feature.coveragePercent ?? 0,
    covered,
    gtmReady,
    shipGates,
    evidence: feature.evidence ?? '',
    implementationRef: feature.implementationRef ?? null,
    specRef: feature.specRef ?? null,
    specDepth: feature.specDepth ?? null,
    apiRef: feature.apiRef ?? null,
    surfaceRoute: feature.surfaceRoute ?? null,
    serviceRef: feature.serviceRef ?? null,
    persona: feature.persona ?? null,
    pillars: feature.pillars ?? [],
    phase: feature.phase ?? 'M1',
    gtmCritical: feature.gtmCritical ?? false,
    forensicStatus: feature.forensicStatus ?? null,
    gapClass: feature.gapClass ?? null,
    registryRef: feature.id,
  };
});

const coveredCount = mapped.filter((feature) => feature.covered).length;
const gtmEligible = mapped.filter((feature) => feature.featureClass !== 'spec-gap');
const gtmReadyCount = gtmEligible.filter((feature) => feature.gtmReady).length;

const out = {
  $schema: 'gtcx://venture-os/feature-coverage-matrix/v2',
  version: '2.2.0',
  repo: 'venture-os',
  updated: new Date().toISOString().slice(0, 10),
  syncSource: 'machine/spec/feature-registry/manifest.json',
  registrySoR: 'machine/spec/feature-registry/manifest.json',
  registrySchema: manifest.$schema,
  shipGatesProtocol: 'machine/spec/feature-ship-gates-protocol.json',
  syncCommand: 'pnpm pm:feature-matrix:sync',
  minCoveragePercent: 90,
  pillarIndex: pillarCounts,
  featureCount: mapped.length,
  gtmCriticalCount: mapped.filter((feature) => feature.gtmCritical).length,
  featureTierIndex: tierCounts,
  featureClassIndex: classCounts,
  shipGateIndex,
  forensicAudit: 'machine/ci/forensic-feature-audit-latest.json',
  shipGatesWitness: 'machine/ci/feature-ship-gates-latest.json',
  e2eCatalog: 'machine/spec/workflows/e2e-catalog.json',
  jtbdCatalog: 'machine/ux/jtbd/catalog.json',
  coveragePercent: mapped.length ? Math.round((coveredCount / mapped.length) * 100) : 0,
  gtmReadyPercent: Math.round((gtmReadyCount / Math.max(1, gtmEligible.length)) * 100),
  features: mapped,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(out, null, 2)}\n`);
syncFeatureShipGates({ write: true });

console.log(
  JSON.stringify(
    {
      ok: true,
      featureCount: mapped.length,
      coveragePercent: out.coveragePercent,
      gtmCritical: out.gtmCriticalCount,
      shipGateIndex,
      featureClassIndex: classCounts,
    },
    null,
    2,
  ),
);
