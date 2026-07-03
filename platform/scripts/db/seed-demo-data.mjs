import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

if (process.env.NODE_ENV === 'production') {
  console.error('Refusing to seed synthetic Venture OS demo data when NODE_ENV=production.');
  process.exit(1);
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is required to seed Venture OS demo data.');
  process.exit(1);
}

const repoRoot = fileURLToPath(new URL('../../..', import.meta.url));
const seedFile = join(repoRoot, 'deploy/database/seeds/demo.sql');

const result = spawnSync(
  'psql',
  ['--set', 'ON_ERROR_STOP=1', databaseUrl, '--file', seedFile],
  { stdio: 'inherit', env: { ...process.env, PAGER: 'cat' } },
);

if (result.error) {
  console.error(`Failed to execute psql for demo seed: ${result.error.message}`);
  process.exit(1);
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log('Seeded synthetic Venture OS demo data.');
