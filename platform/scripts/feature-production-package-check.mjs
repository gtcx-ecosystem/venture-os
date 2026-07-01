#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const manifestPath = join(root, 'pm/spec/feature-registry/manifest.json');
const errors = [];

function readJson(relOrAbs) {
  const abs = relOrAbs.startsWith('/') ? relOrAbs : join(root, relOrAbs);
  return JSON.parse(readFileSync(abs, 'utf8'));
}

function loadFeatures() {
  if (!existsSync(manifestPath)) {
    errors.push('missing pm/spec/feature-registry/manifest.json');
    return [];
  }
  const manifest = readJson(manifestPath);
  const features = [];
  for (const shard of manifest.shards ?? []) {
    const shardPath = join(root, shard);
    if (!existsSync(shardPath)) {
      errors.push(`missing ${shard}`);
      continue;
    }
    features.push(...(readJson(shardPath).features ?? []));
  }
  return features;
}

const features = loadFeatures();
for (const feature of features) {
  const id = String(feature.id ?? '').toLowerCase();
  const base = `pm/features/${id}`;
  const required = [
    `${base}/record.json`,
    `${base}/forensic-spec.json`,
    `${base}/audits/mpr.json`,
    `${base}/audits/signal.json`,
    `${base}/feature-pack/manifest.json`,
  ];

  for (const rel of required) {
    if (!existsSync(join(root, rel))) errors.push(`${feature.id}: missing ${rel}`);
  }

  if (!errors.some((error) => error.startsWith(`${feature.id}:`))) {
    const pack = readJson(`${base}/feature-pack/manifest.json`);
    if (!Array.isArray(pack.acceptanceCriteria) || pack.acceptanceCriteria.length === 0) errors.push(`${feature.id}: missing acceptance criteria`);
    if (!Array.isArray(pack.qaTesting) || pack.qaTesting.length === 0) errors.push(`${feature.id}: missing qaTesting`);
    if (!Array.isArray(pack.sprintPlans) || pack.sprintPlans.length === 0) errors.push(`${feature.id}: missing sprintPlans`);
    if (!pack.mprReview || pack.mprReview.score100 !== 100) errors.push(`${feature.id}: missing MPR review`);
    if (!pack.signalReview || pack.signalReview.level !== 'L5' || pack.signalReview.score100 !== 100) errors.push(`${feature.id}: missing SIGNAL review`);
  }
}

console.log(`feature:production-package:check score ${errors.length === 0 ? 100 : 0}/100 - ${features.length}/${features.length} feature packages reviewed`);
if (errors.length) {
  for (const error of errors.slice(0, 50)) console.log(`FAIL ${error}`);
}
process.exit(errors.length === 0 ? 0 : 1);
