#!/usr/bin/env node
/** @file ops:check — venture-os P35 + PM + app smoke */
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

function requirePath(rel) {
  if (!existsSync(join(root, rel))) errors.push(`missing: ${rel}`);
}

const required = [
  'docs/sor.json',
  'docs/INDEX.md',
  'docs/conventions.md',
  'docs/FOLDER-SPEC.md',
  'docs/operations/repo/root-allowlist.json',
  'pm/manifest.json',
  'pm/execution-roadmap.md',
  'pm/backlog.json',
  'agents/manifest.json',
  'config/repo-kind.json',
];

for (const rel of required) requirePath(rel);

if (existsSync(join(root, '01-docs'))) {
  errors.push('forbidden: 01-docs/ (use docs/ + pm/ per P35)');
}

function run(label, cmd, args, cwd = root) {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', stdio: 'pipe' });
  if (r.status !== 0) {
    const tail = (r.stderr || r.stdout || '').trim().split('\n').slice(-3).join(' ');
    errors.push(`${label} exit ${r.status}${tail ? ` — ${tail}` : ''}`);
  }
}

run('test', 'pnpm', ['test']);
run('lint', 'pnpm', ['lint']);
run(
  'layout:check',
  process.execPath,
  ['../bridge-os/platform/scripts/workspace/p35-layout-check.mjs', '--repo', 'venture-os'],
);
run('pm:folder:check', process.execPath, [
  '../bridge-os/platform/scripts/workspace/pm-folder-check.mjs',
]);
run('agent:work-selection:check', process.execPath, [
  '../bridge-os/platform/scripts/checks/check-agent-work-selection.mjs',
]);

if (errors.length) {
  console.error('ops:check FAIL — venture-os');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log('ops:check ok — venture-os');
