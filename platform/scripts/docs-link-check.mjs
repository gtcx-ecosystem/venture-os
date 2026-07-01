#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const roots = ['README.md', 'AGENTS.md', 'CHANGELOG.md', 'docs', 'pm', 'ops', 'agents', 'agile', 'workstream'];
const skipDirs = new Set(['.git', 'node_modules', 'archive']);
const links = [];
const broken = [];

function walk(rel, out = []) {
  const abs = join(root, rel);
  if (!existsSync(abs)) return out;
  const stat = readdirSafe(rel);
  if (stat === null) {
    if (rel.endsWith('.md')) out.push(rel);
    return out;
  }
  for (const entry of stat) {
    if (skipDirs.has(entry.name)) continue;
    const child = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) walk(child, out);
    else if (entry.isFile() && entry.name.endsWith('.md')) out.push(child);
  }
  return out;
}

function readdirSafe(rel) {
  try {
    const abs = join(root, rel);
    if (!existsSync(abs) || !readdirSync(abs, { withFileTypes: true })) return null;
    return readdirSync(abs, { withFileTypes: true });
  } catch {
    return null;
  }
}

function candidateTargets(fromRel, href) {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean || clean.startsWith('http:') || clean.startsWith('https:') || clean.startsWith('mailto:')) return [];
  if (clean.startsWith('#')) return [];
  if (clean.startsWith('/')) return [clean.slice(1)];
  const base = normalize(join(dirname(fromRel), clean)).replaceAll('\\\\', '/');
  const values = [base];
  if (!extname(base)) {
    values.push(`${base}.md`, `${base}/README.md`);
  }
  return values;
}

for (const rootRel of roots) {
  const abs = join(root, rootRel);
  if (!existsSync(abs)) continue;
  if (rootRel.endsWith('.md')) {
    walk(rootRel, []);
  }
}

const files = roots.flatMap((rel) => rel.endsWith('.md') ? [rel] : walk(rel));
const linkRe = /(?<!!)[[^\]]+\]\(([^)]+)\)/g;
for (const file of files) {
  const text = readFileSync(join(root, file), 'utf8');
  for (const match of text.matchAll(linkRe)) {
    const href = match[1].trim();
    if (file.includes('/assets/model-pages/') || href.includes('[') || href.includes(']')) continue;
    const targets = candidateTargets(file, href);
    if (targets.length === 0) continue;
    links.push({ file, href });
    if (!targets.some((target) => existsSync(join(root, target)))) {
      broken.push({ file, href, targets });
    }
  }
}

console.log(`Checked ${links.length} links, ${broken.length} broken link(s) found`);
if (broken.length) {
  for (const item of broken.slice(0, 50)) {
    console.log(`BROKEN ${item.file} -> ${item.href}`);
  }
}
process.exit(broken.length === 0 ? 0 : 1);
