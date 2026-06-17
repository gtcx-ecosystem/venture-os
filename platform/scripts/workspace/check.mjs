#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const errors = [];
if (!existsSync(join(root, 'config/ops.manifest.json'))) errors.push('config/ops.manifest.json missing');
if (!existsSync(join(root, 'pm/manifest.json'))) errors.push('pm/manifest.json missing');

if (errors.length) {
  console.error('workspace:check FAIL — venture-os');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('workspace:check ok — venture-os');
