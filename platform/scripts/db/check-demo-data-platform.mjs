import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../../..', import.meta.url));
const migrationsDir = join(repoRoot, 'deploy/database/migrations');
const seedFile = join(repoRoot, 'deploy/database/seeds/demo.sql');
const seedManifest = join(repoRoot, 'machine/demo/seed-data/venture-demo-seed.json');

const failures = [];

const migrations = existsSync(migrationsDir)
  ? readdirSync(migrationsDir).filter((file) => file.endsWith('.sql')).sort()
  : [];

if (migrations.length < 2) {
  failures.push('expected guarded extension and demo-store migrations');
}

for (const required of ['001_adr002_extensions.sql', '002_venture_demo_store.sql']) {
  if (!migrations.includes(required)) failures.push(`missing migration ${required}`);
}

for (const path of [seedFile, seedManifest]) {
  if (!existsSync(path)) failures.push(`missing ${path}`);
}

const combinedSql = migrations
  .map((file) => readFileSync(join(migrationsDir, file), 'utf8'))
  .join('\n');

for (const expected of [
  'CREATE EXTENSION IF NOT EXISTS vector',
  'CREATE EXTENSION IF NOT EXISTS pg_cron',
  'CREATE EXTENSION IF NOT EXISTS pg_partman',
  'PARTITION BY RANGE (received_at)',
  'PARTITION BY RANGE ("timestamp")',
  'USING brin (received_at)',
  'USING brin ("timestamp")',
]) {
  if (!combinedSql.includes(expected)) failures.push(`missing SQL marker: ${expected}`);
}

if (/vector\s*\(/i.test(combinedSql)) {
  failures.push('found a vector column; venture-os has no verified embedding consumer path');
}

const seedSql = existsSync(seedFile) ? readFileSync(seedFile, 'utf8') : '';
if (!seedSql.includes('missing verified migration column')) {
  failures.push('demo seed does not verify migration columns before insert');
}

if (failures.length > 0) {
  console.error('Venture OS data platform check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Venture OS data platform check passed (${migrations.length} migrations).`);
