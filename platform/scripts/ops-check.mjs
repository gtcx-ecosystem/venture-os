#!/usr/bin/env node
/** @file operations:check — venture-os P35 + machine/operations + app smoke */
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
  'machine/manifest.json',
  'machine/execution-roadmap.md',
  'machine/backlog.json',
  'machine/roadmap/initiatives.json',
  'machine/roadmap/sprints/active.json',
  'machine/product',
  'machine/ci',
  'operations/README.md',
  'operations/manifest.json',
  'operations/pm/manifest.json',
  'agents/manifest.json',
  'config/repo-kind.json',
];

for (const rel of required) requirePath(rel);

if (existsSync(join(root, '01-docs'))) {
  errors.push('forbidden: 01-docs/ (use docs/ + machine/ per P35)');
}
if (existsSync(join(root, 'pm'))) {
  errors.push('forbidden: pm/ active root (use machine/)');
}
if (existsSync(join(root, 'ops'))) {
  errors.push('forbidden: ops/ active root (use operations/)');
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
run('machine:folder:check', process.execPath, [
  '-e',
  "const fs=require('fs'); const path=require('path'); const root=process.cwd(); const required=['machine/README.md','machine/manifest.json','machine/completion-model.json','machine/shipping-tracks.json','machine/roadmap/initiatives.json','machine/roadmap/sprints/active.json','machine/roadmap/README.md','machine/product','machine/ci','operations/README.md']; const missing=required.filter((rel)=>!fs.existsSync(path.join(root,rel))); if(missing.length){console.error('missing '+missing.join(', ')); process.exit(1)} console.log('machine/operations folders ok')",
]);

if (errors.length) {
  console.error('ops:check FAIL — venture-os');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log('operations:check ok — venture-os P35+machine/operations');
