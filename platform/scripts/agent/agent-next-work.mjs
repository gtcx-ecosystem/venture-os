#!/usr/bin/env node
/** Delegates P22 to bridge-os (venture-os satellite). */
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const bridgeRoot = join(dirname(fileURLToPath(import.meta.url)), '../../../../bridge-os');
const bridgeScript = join(bridgeRoot, 'platform/scripts/agent-next-work.mjs');
const args = process.argv.slice(2);

const out = execFileSync('node', [bridgeScript, ...args], {
  cwd: bridgeRoot,
  encoding: 'utf8',
  maxBuffer: 16 * 1024 * 1024,
});

process.stdout.write(out);
