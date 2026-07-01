#!/usr/bin/env node
/**
 * docs:compliance-nest:check — docs/operations/compliance/ artifact-type taxonomy
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { repoRootFromImportMeta } from './lib/repo-root.mjs';

const REPO = repoRootFromImportMeta(import.meta.url);
const WRITE = process.argv.includes('--write');
const WITNESS = join(REPO, 'audit/evidence/docs-compliance-nest-latest.json');

function gate(id, ok, detail = null) {
  return { id, ok, ...(detail ? { detail } : {}) };
}

function loadNest() {
  const candidates = [
    join(REPO, 'machine/spec/docs-operations-compliance-nest.json'),
    join(REPO, '../canon-os/machine/spec/docs-operations-compliance-nest.json'),
    join(REPO, '../canon-os/pm/spec/docs-operations-compliance-nest.json'),
  ];
  for (const path of candidates) {
    if (!existsSync(path)) continue;
    return { path, spec: JSON.parse(readFileSync(path, 'utf8')) };
  }
  return null;
}

function main() {
  const gates = [];
  const loaded = loadNest();
  const complianceDir = join(REPO, 'docs/operations/compliance');

  gates.push(gate('nest-spec:present', !!loaded, loaded?.path ?? 'docs-operations-compliance-nest.json'));

  if (!loaded) {
    emit(gates);
    return;
  }

  const nest = loaded.spec;
  gates.push(gate('compliance-dir:present', existsSync(complianceDir), 'docs/operations/compliance/'));

  if (!existsSync(complianceDir)) {
    emit(gates);
    return;
  }

  const forbidden = new Set(nest.forbiddenChildFolders ?? []);
  const bad = readdirSync(complianceDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && forbidden.has(e.name))
    .map((e) => e.name);
  gates.push(
    gate('compliance:forbid-slices', bad.length === 0, bad.length ? bad.join(', ') : 'artifact-type taxonomy only'),
  );

  const allowed = new Set([...(nest.allowedChildFolders ?? []), '_archive']);
  const unknown = readdirSync(complianceDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.') && !allowed.has(e.name))
    .map((e) => e.name);
  gates.push(
    gate('compliance:allowed-children', unknown.length === 0, unknown.length ? unknown.join(', ') : 'nest allowlist'),
  );

  emit(gates);
}

function emit(gates) {
  const ok = gates.every((g) => g.ok);
  const witness = {
    schema: 'gtcx://canon-os/docs-compliance-nest-check/v1',
    generatedAt: new Date().toISOString(),
    repo: JSON.parse(readFileSync(join(REPO, 'package.json'), 'utf8')).name,
    ok,
    gates,
  };
  if (WRITE) {
    mkdirSync(join(REPO, 'audit/evidence'), { recursive: true });
    writeFileSync(WITNESS, `${JSON.stringify(witness, null, 2)}\n`);
  }
  console.log(ok ? `PASS — ${gates.filter((g) => g.ok).length}/${gates.length}` : `FAIL — ${gates.filter((g) => g.ok).length}/${gates.length}`);
  for (const g of gates.filter((x) => !x.ok)) {
    console.log(`  FAIL ${g.id}: ${g.detail ?? ''}`);
  }
  process.exit(ok ? 0 : 1);
}

main();
