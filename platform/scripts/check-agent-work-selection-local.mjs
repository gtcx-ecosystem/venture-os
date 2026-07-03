#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const errors = [];
const warnings = [];

function requireFile(relPath, label) {
  const abs = join(ROOT, relPath);
  if (!existsSync(abs)) {
    errors.push(`Missing ${label}: ${relPath}`);
    return null;
  }
  return readFileSync(abs, 'utf8');
}

function requireFirstExisting(candidates, label) {
  for (const relPath of candidates) {
    const normalized = String(relPath).replace(/^\.\//, '');
    const abs = join(ROOT, normalized);
    if (existsSync(abs)) return readFileSync(abs, 'utf8');
  }
  errors.push(`Missing ${label}: tried ${candidates.join(', ')}`);
  return null;
}

function requireIncludes(content, needle, label) {
  if (content && !content.includes(needle)) errors.push(label);
}

const manifest = requireFirstExisting(
  ['docs/operations/agent-work-selection.md', 'docs/operations/runbooks/agent-work-selection.md'],
  'work-selection manifest',
);
const autoDev = requireFirstExisting(
  ['machine/auto-dev-state.md', 'pm/auto-dev-state.md', 'audit/auto-dev-state.md'],
  'session pointer (auto-dev-state)',
);
const agents = requireFile('AGENTS.md', 'AGENTS.md');
const coordination = requireFirstExisting(
  ['docs/operations/cross-repo-coordination.md', 'docs/operations/runbooks/cross-repo-coordination.md', 'docs/conventions.md'],
  'P24 coordination doc',
);

requireFile('platform/scripts/agent/agent-next-work.mjs', 'selection script');
requireFirstExisting(
  [
    'machine/execution-roadmap.md',
    'machine/backlog.json',
    'audit/execution-roadmap.md',
    'docs/strategy/execution-roadmap.md',
    'pm/ecosystem-sprint-backlog.json',
    'pm/backlog.json',
  ],
  'execution roadmap / backlog SoR',
);
requireFile('config/ops.manifest.json', 'workspace root manifest');
requireFile('platform/scripts/workspace/check.mjs', 'workspace check script');
requireFile('docs/README.md', 'docs index');
requireFile('docs/sor.json', 'docs sor v1');

const pkgRaw = requireFile('package.json', 'package.json');
if (pkgRaw) {
  const pkg = JSON.parse(pkgRaw);
  for (const script of ['agent:next-work', 'agent:work-selection:check']) {
    if (!pkg.scripts?.[script]) errors.push(`package.json missing script: ${script}`);
  }
}

if (agents) {
  requireIncludes(agents, 'Protocol 22', 'AGENTS.md missing Protocol 22');
  requireIncludes(agents, 'Phase 5.4', 'AGENTS.md missing Phase 5.4');
  requireIncludes(agents, 'Protocol 24', 'AGENTS.md missing Protocol 24');
  requireIncludes(agents, 'Protocol 26', 'AGENTS.md missing Protocol 26');
  requireIncludes(agents, 'Protocol 27', 'AGENTS.md missing Protocol 27');
  requireIncludes(agents, 'Protocol 28', 'AGENTS.md missing Protocol 28');
  requireIncludes(agents, 'Authority class', 'AGENTS.md missing Protocol 28 Authority class');
}

if (manifest) {
  if (!(manifest.includes('OPS-AWS-AGT-001') || manifest.includes('OPS-AWS-001'))) {
    errors.push('Manifest missing document_id OPS-AWS-AGT-001 or OPS-AWS-001');
  }
  requireIncludes(manifest, 'Protocol 26', 'Manifest missing Protocol 26');
  requireIncludes(manifest, 'Protocol 27', 'Manifest missing Protocol 27');
  requireIncludes(manifest, 'Protocol 28', 'Manifest missing Protocol 28');
  if (!/Never ask the operator to choose/i.test(manifest)) {
    errors.push('Manifest missing forbidden-prompt rule');
  }
}

if (coordination && !coordination.includes('Protocol 24')) {
  errors.push('coordination doc missing Protocol 24');
}

if (autoDev && !autoDev.includes('Next work (computed')) {
  errors.push('auto-dev-state missing "Next work (computed)" section');
}

for (const rule of [
  '.cursor/rules/protocol-26-agent-proceed-confirmation.mdc',
  '.cursor/rules/protocol-27-agent-execution-obligation.mdc',
  '.cursor/rules/protocol-28-agent-authority-classification.mdc',
]) {
  if (!existsSync(join(ROOT, rule))) warnings.push(`Optional Cursor rule missing: ${rule}`);
}

for (const warning of warnings) console.warn(`[protocols-adoption] warn: ${warning}`);

if (errors.length > 0) {
  console.error('Agent protocols adoption check failed:\n');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log('Agent protocols adoption check passed (P22, P24, P26, P27, P28 - machine paths).');
