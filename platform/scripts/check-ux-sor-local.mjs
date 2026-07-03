#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const BRIDGE = join(ROOT, '..', 'bridge-os');
const REGISTRY = join(BRIDGE, 'machine/spec/ux-sor-registry.json');
const WRITE = process.argv.includes('--write');

function repoPath(relPath) {
  const normalized = String(relPath ?? '');
  const candidates = [
    normalized,
    normalized.startsWith('pm/') ? normalized.replace(/^pm\//, 'machine/') : null,
    normalized.startsWith('03-platform/') ? normalized.replace(/^03-platform\//, 'platform/') : null,
  ].filter(Boolean);
  return candidates.find((candidate) => existsSync(join(ROOT, candidate))) ?? candidates[0];
}

function pathSatisfied(relPath) {
  return existsSync(join(ROOT, repoPath(relPath)));
}

function countInDir(relDir, patternSrc) {
  const dir = join(ROOT, repoPath(relDir));
  if (!existsSync(dir)) return 0;
  const re = new RegExp(patternSrc);
  return readdirSync(dir).filter((file) => re.test(file)).length;
}

function readmeHasSection(relPath, section) {
  const path = join(ROOT, repoPath(relPath));
  if (!existsSync(path)) return false;
  const text = readFileSync(path, 'utf8');
  return new RegExp(`^#+\\s+${section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'im').test(text);
}

function validateExrPack() {
  const script = join(BRIDGE, 'platform/scripts/evidence/validate-exr-pack.mjs');
  if (!existsSync(script)) return { ok: false, detail: 'validate-exr-pack.mjs missing' };
  const result = spawnSync(process.execPath, [script], { cwd: ROOT, encoding: 'utf8' });
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim().split('\n').slice(-1)[0] ?? '';
  return { ok: (result.status ?? 1) === 0, detail: output || `exit ${result.status ?? 1}` };
}

function evaluateItem(item) {
  const check = item.check ?? {};
  switch (check.type) {
    case 'path': {
      const pass = pathSatisfied(check.path);
      return { pass, detail: pass ? repoPath(check.path) : `missing ${repoPath(check.path)}` };
    }
    case 'paths-any': {
      const found = (check.paths ?? []).map(repoPath).find((relPath) => existsSync(join(ROOT, relPath)));
      return { pass: Boolean(found), detail: found ?? `missing one of: ${(check.paths ?? []).map(repoPath).join(', ')}` };
    }
    case 'min-count': {
      const count = countInDir(check.dir, check.pattern ?? '.*');
      return { pass: count >= (check.min ?? 1), detail: `${repoPath(check.dir)}: ${count}/${check.min ?? 1}` };
    }
    case 'readme-section': {
      const pass = readmeHasSection(check.path, check.section);
      return { pass, detail: pass ? `${check.section} present` : `missing ## ${check.section} in ${repoPath(check.path)}` };
    }
    case 'exr-pack-valid': {
      const result = validateExrPack();
      return { pass: result.ok, detail: result.detail };
    }
    default:
      return { pass: false, detail: `unknown check type ${check.type}` };
  }
}

if (!existsSync(REGISTRY)) {
  console.error('FAIL missing bridge UX SoR registry');
  process.exit(1);
}

const registry = JSON.parse(readFileSync(REGISTRY, 'utf8'));
const repoKind = 'product';
const violations = [];
let itemsTotal = 0;
let itemsPass = 0;
let openP1 = 0;
let openP2 = 0;

for (const pack of registry.packs ?? []) {
  const required = (pack.requiredFor ?? []).includes(repoKind);
  const optional = (pack.optionalFor ?? []).includes(repoKind);
  if (!required && !optional) continue;
  for (const item of pack.items ?? []) {
    itemsTotal++;
    const result = evaluateItem(item);
    if (result.pass) {
      itemsPass++;
      continue;
    }
    if (!required) continue;
    violations.push({
      packId: pack.id,
      itemId: item.id,
      severity: item.severity ?? 'P2',
      detail: result.detail,
    });
    if (item.severity === 'P1') openP1++;
    else openP2++;
  }
}

const score100 = itemsTotal ? Math.round((itemsPass / itemsTotal) * 100) : 100;
const ok = openP1 === 0 && score100 >= (registry.unlockThreshold?.score100Min ?? 70);
const witness = {
  schema: 'gtcx.uxSorPack.v1',
  repo: 'venture-os',
  repoKind,
  pilotDeep: false,
  ok,
  score100,
  openP1,
  openP2,
  itemsPass,
  itemsTotal,
  violations,
  at: new Date().toISOString(),
};

if (WRITE) {
  const out = join(ROOT, registry.witness?.perRepo ?? 'audit/evidence/ux-sor-latest.json');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, `${JSON.stringify(witness, null, 2)}\n`);
}

console.log('=== ecosystem:ux-sor:check ===\n');
console.log(`${ok ? 'OK' : 'FAIL'} venture-os - score=${score100}/100 P1=${openP1} kind=${repoKind}`);
for (const violation of violations.slice(0, 4)) {
  console.log(`  [${violation.severity}] ${violation.packId}/${violation.itemId}: ${violation.detail}`);
}
console.log(`\nPilot deep: 0/3 (min ${registry.unlockThreshold?.pilotDeepPassMin ?? 3}) - Fleet: ${ok ? 1 : 0}/1`);
console.log(`${ok ? 'PASS' : 'FAIL'} - mode=repo-local-machine`);
if (WRITE) console.log('witness: audit/evidence/ux-sor-latest.json');

process.exit(ok ? 0 : 1);
