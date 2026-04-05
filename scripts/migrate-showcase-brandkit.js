#!/usr/bin/env node
/**
 * Migrate all showcase wrapper components to accept an optional brandKit prop.
 *
 * For each *Showcase.tsx file:
 *   1. Add BrandKit and applyBrandKit to the import from ../_shared/themes
 *   2. Change: React.FC = () => (
 *      To:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
 *   3. Change: theme={THEME_XXX}
 *      To:     theme={applyBrandKit(THEME_XXX, brandKit)}
 */

const fs   = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TEMPLATES_DIR = path.join(ROOT, "src/remotion/templates");

function findShowcaseFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findShowcaseFiles(full));
    } else if (entry.isFile() && entry.name.endsWith("Showcase.tsx")) {
      results.push(full);
    }
  }
  return results;
}

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  const rel = path.relative(ROOT, filePath);

  // ── 1. Extend the themes import ────────────────────────────────
  // Matches both single-line and multi-line imports from ../_shared/themes
  content = content.replace(
    /import \{([^}]+)\} from "\.\.\/\_shared\/themes";/,
    (match, body) => {
      // Split on commas and/or whitespace-newline sequences
      const names = body
        .split(/,/)
        .map((s) => s.replace(/\s+/g, "").trim())
        .filter(Boolean);
      if (!names.includes("BrandKit"))    names.push("BrandKit");
      if (!names.includes("applyBrandKit")) names.push("applyBrandKit");
      // Always emit as multi-line for clarity
      return `import {\n  ${names.join(",\n  ")},\n} from "../_shared/themes";`;
    }
  );

  // ── 2. Update component signatures ─────────────────────────────
  // Matches: export const Foo: React.FC = () => (
  content = content.replace(
    /export const (\w+): React\.FC = \(\) => \(/g,
    "export const $1: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => ("
  );

  // ── 3. Wrap theme props ─────────────────────────────────────────
  // Matches: theme={THEME_ANYTHING}
  content = content.replace(
    /theme=\{(THEME_[A-Z_]+)\}/g,
    "theme={applyBrandKit($1, brandKit)}"
  );

  fs.writeFileSync(filePath, content, "utf-8");
  console.log("  updated:", rel);
}

const files = findShowcaseFiles(TEMPLATES_DIR);
console.log(`Found ${files.length} showcase files. Migrating...`);
for (const f of files) {
  migrateFile(f);
}
console.log("Done.");
