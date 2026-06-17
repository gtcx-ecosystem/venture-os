/**
 * Resolve repo root from platform/scripts/*.mjs (fleet repos).
 */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Repo root for scripts in platform/scripts/*.mjs (walk up to package.json). */
export function repoRootFromImportMeta(metaUrl) {
  const scriptDir = dirname(fileURLToPath(metaUrl));
  let dir = join(scriptDir, '..');
  while (true) {
    if (existsSync(join(dir, 'package.json'))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return join(scriptDir, '../..');
}
