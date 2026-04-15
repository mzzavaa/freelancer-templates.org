#!/usr/bin/env node
/**
 * add-navgroup-frontmatter.mjs
 *
 * One-time migration script: reads the slug→navgroup mapping from
 * data/navgroups.yaml and injects a `navgroup:` field into each matching
 * content/library/*.md frontmatter block.
 *
 * Run: node scripts/add-navgroup-frontmatter.mjs
 * Safe to re-run (idempotent — skips files that already have navgroup).
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ── Build slug → navgroup map from navgroups.yaml ─────────────────────────
// (Simple YAML parse — no dependency needed for this flat structure)
function parseNavgroups() {
  const raw = readFileSync(join(ROOT, "data", "navgroups.yaml"), "utf-8");
  const slugToGroup = {};

  let currentGroup = null;
  for (const line of raw.split("\n")) {
    const groupMatch = line.match(/^\s+- name:\s*"([^"]+)"/);
    if (groupMatch) { currentGroup = groupMatch[1]; continue; }

    const slugMatch = line.match(/slug:\s*"?([^"}\n,]+)"?/);
    if (slugMatch && currentGroup) {
      slugToGroup[slugMatch[1].trim()] = currentGroup;
    }
  }
  return slugToGroup;
}

// ── Inject navgroup into a content file ───────────────────────────────────
function processFile(filePath, navgroup) {
  const raw = readFileSync(filePath, "utf-8");

  // Already has navgroup → skip
  if (/^navgroup:/m.test(raw)) return false;

  // Find the slug line and insert navgroup after it
  const updated = raw.replace(
    /^(slug:\s*.+)$/m,
    `$1\nnavgroup: "${navgroup}"`
  );

  if (updated === raw) return false; // no slug line found

  writeFileSync(filePath, updated, "utf-8");
  return true;
}

// ── Main ──────────────────────────────────────────────────────────────────
const slugToGroup = parseNavgroups();
const LIBRARY_DIR = join(ROOT, "content", "library");
const files = readdirSync(LIBRARY_DIR).filter(
  (f) => f.endsWith(".md") && f !== "_index.md"
);

let updated = 0;
let skipped = 0;
let unmapped = 0;

for (const file of files) {
  const slug = file.replace(".md", "");
  const navgroup = slugToGroup[slug];

  if (!navgroup) {
    console.warn(`  ⚠ No navgroup for: ${file}`);
    unmapped++;
    continue;
  }

  const wasUpdated = processFile(join(LIBRARY_DIR, file), navgroup);
  if (wasUpdated) {
    console.log(`  ✓ ${file} → "${navgroup}"`);
    updated++;
  } else {
    skipped++;
  }
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped, ${unmapped} unmapped.`);
