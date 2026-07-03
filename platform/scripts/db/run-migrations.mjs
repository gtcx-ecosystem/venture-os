import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../../..', import.meta.url));
const migrationsDir = join(repoRoot, 'deploy/database/migrations');
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is required to run Venture OS database migrations.');
  process.exit(1);
}

const migrations = readdirSync(migrationsDir)
  .filter((file) => file.endsWith('.sql'))
  .sort();

if (migrations.length === 0) {
  console.error(`No SQL migrations found in ${migrationsDir}`);
  process.exit(1);
}

for (const migration of migrations) {
  const file = join(migrationsDir, migration);
  console.log(`Applying ${migration}`);
  const result = spawnSync(
    'psql',
    ['--set', 'ON_ERROR_STOP=1', databaseUrl, '--file', file],
    { stdio: 'inherit', env: { ...process.env, PAGER: 'cat' } },
  );
  if (result.error) {
    console.error(`Failed to execute psql for ${migration}: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`Applied ${migrations.length} Venture OS migration(s).`);
