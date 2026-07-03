import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BLOCKING_GAPS = ['production-gap', 'impl-only', 'impl-ahead-of-spec', 'gap'];
const RINGS = ['demo', 'pilot', 'production', 'enterprise', 'ga'];

function candidatePaths(root, rel) {
  const pathPart = String(rel ?? '').split('#')[0];
  if (!pathPart) return [];
  const candidates = [pathPart];
  if (pathPart.startsWith('pm/')) candidates.push(pathPart.replace(/^pm\//, 'machine/'));
  if (pathPart.startsWith('03-platform/')) candidates.push(pathPart.replace(/^03-platform\//, 'platform/'));
  return candidates.map((candidate) => join(root, candidate));
}

function pathExists(root, rel) {
  for (const candidate of candidatePaths(root, rel)) {
    if (!existsSync(candidate)) continue;
    try {
      const stat = statSync(candidate);
      if (stat.isFile() || stat.isDirectory()) return true;
    } catch {
      // Keep checking fallback candidates.
    }
  }
  return false;
}

function inE2eCatalog(feature, e2eWorkflowIds) {
  if (feature.workflowId && e2eWorkflowIds.has(feature.workflowId)) return true;
  if (feature.uatId) return true;
  return Boolean(feature.apiRef);
}

export function evaluateChecks(feature, ctx) {
  const covered = feature.status === 'covered';
  const blockingGap = BLOCKING_GAPS.includes(feature.gapClass);
  const workflowStep = feature.featureClass === 'workflow-step';
  const gtmCritical = Boolean(feature.gtmCritical);

  return {
    'spec-ref': pathExists(ctx.root, feature.specRef),
    'impl-ref': pathExists(ctx.root, feature.implementationRef),
    'evidence-path': pathExists(ctx.root, feature.evidence),
    'coverage-90': (feature.coveragePercent ?? 0) >= 90,
    'status-covered': covered,
    'no-blocking-gap': !blockingGap,
    'workflow-or-api': inE2eCatalog(feature, ctx.e2eWorkflowIds),
    'jtbd-linked': workflowStep ? (feature.jtbdIds?.length ?? 0) > 0 : true,
    'persona-set': gtmCritical ? Boolean(feature.persona) : true,
    'forensic-aligned': feature.forensicStatus === 'aligned',
    'phase-shipped': typeof feature.phase === 'string' && feature.phase.startsWith('Phase-'),
  };
}

export function resolveTargetRing(feature) {
  if (feature.shipGateOverrides?.targetRing) return feature.shipGateOverrides.targetRing;
  if (feature.featureClass === 'spec-gap') return 'demo';
  if (feature.featureClass === 'workflow-step') return 'pilot';
  if (feature.gtmCritical && feature.featureTier === 'moat') return 'enterprise';
  if (feature.gtmCritical) return 'production';
  if (typeof feature.phase === 'string' && feature.phase.startsWith('Phase-')) return 'production';
  return 'demo';
}

const RING_CHECKS = {
  demo: ['spec-ref', 'impl-ref', 'evidence-path'],
  pilot: ['spec-ref', 'impl-ref', 'evidence-path', 'coverage-90', 'workflow-or-api', 'jtbd-linked', 'persona-set'],
  production: [
    'spec-ref',
    'impl-ref',
    'evidence-path',
    'coverage-90',
    'workflow-or-api',
    'jtbd-linked',
    'persona-set',
    'status-covered',
    'no-blocking-gap',
  ],
  enterprise: [
    'spec-ref',
    'impl-ref',
    'evidence-path',
    'coverage-90',
    'workflow-or-api',
    'jtbd-linked',
    'persona-set',
    'status-covered',
    'no-blocking-gap',
    'forensic-aligned',
  ],
  ga: [
    'spec-ref',
    'impl-ref',
    'evidence-path',
    'coverage-90',
    'workflow-or-api',
    'jtbd-linked',
    'persona-set',
    'status-covered',
    'no-blocking-gap',
    'forensic-aligned',
    'phase-shipped',
  ],
};

function ringMet(checks, ringId) {
  return (RING_CHECKS[ringId] ?? []).every((id) => checks[id] === true);
}

export function evaluateFeatureShipGates(feature, ctx) {
  const checks = evaluateChecks(feature, ctx);
  const targetRing = resolveTargetRing(feature);

  const rings = {};
  for (const ringId of RINGS) {
    const required = RING_CHECKS[ringId] ?? [];
    const detail = required.map((id) => ({ id, ok: checks[id] === true }));
    const met = ringMet(checks, ringId);
    rings[ringId] = {
      status: met ? 'met' : 'open',
      checks: detail,
      openCount: detail.filter((c) => !c.ok).length,
    };
  }

  let achievedRing = null;
  for (const ringId of [...RINGS].reverse()) {
    if (rings[ringId].status === 'met') {
      achievedRing = ringId;
      break;
    }
  }

  const targetIdx = RINGS.indexOf(targetRing);
  const achievedIdx = achievedRing ? RINGS.indexOf(achievedRing) : -1;

  return {
    protocol: 'machine/spec/feature-ship-gates-protocol.json',
    targetRing,
    achievedRing,
    shipGateClear: achievedIdx >= targetIdx,
    rings,
    openChecks: Object.entries(checks)
      .filter(([, ok]) => !ok)
      .map(([id]) => id),
  };
}

export function evaluateFleetShipGates(features, ctx) {
  const e2eWorkflowIds = new Set((ctx.e2eCatalog?.workflows ?? []).map((workflow) => workflow.id));
  const evaluated = features.map((feature) => ({
    featureId: feature.id,
    ...evaluateFeatureShipGates(feature, { root: ctx.root, e2eWorkflowIds }),
  }));

  const byRing = Object.fromEntries(RINGS.map((ring) => [ring, { met: 0, open: 0 }]));
  for (const row of evaluated) {
    for (const ringId of RINGS) {
      if (row.rings[ringId].status === 'met') byRing[ringId].met += 1;
      else byRing[ringId].open += 1;
    }
  }

  const backlog = evaluated
    .filter((row) => !row.shipGateClear)
    .map((row) => ({
      id: `SHIP-GATE-${row.featureId}`,
      featureId: row.featureId,
      targetRing: row.targetRing,
      achievedRing: row.achievedRing,
      openChecks: row.openChecks,
      priority: row.targetRing === 'ga' ? 'P0' : row.targetRing === 'enterprise' ? 'P1' : 'P2',
      type: 'ship-gate',
      resolve: `pnpm pm:feature-matrix:sync after fixing open checks for ${row.featureId}`,
    }));

  return {
    evaluated,
    byRing,
    backlog,
    summary: {
      featureCount: features.length,
      shipGateClear: evaluated.filter((row) => row.shipGateClear).length,
      shipGateOpen: evaluated.filter((row) => !row.shipGateClear).length,
    },
  };
}
