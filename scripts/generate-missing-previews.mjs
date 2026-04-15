#!/usr/bin/env node
/**
 * generate-missing-previews.mjs
 *
 * Diffs composition IDs from content/library/*.md against files already in
 * static/previews/showcase/<id>.png and static/previews/hero/<id>.mp4, then
 * renders only the missing ones via `npx remotion still` / `npx remotion render`.
 *
 * Usage:
 *   node scripts/generate-missing-previews.mjs           # render missing only
 *   node scripts/generate-missing-previews.mjs --force   # re-render all
 *   node scripts/generate-missing-previews.mjs --dry-run # print plan, no render
 *
 * Wired as predev and prebuild npm scripts so both
 *   npm run dev   (hugo server)
 *   npm run build (hugo --gc --minify)
 * automatically trigger it.
 */

import { execFileSync } from "child_process";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ── CLI flags ──────────────────────────────────────────────────────────────
const FORCE = process.argv.includes("--force");
const DRY_RUN = process.argv.includes("--dry-run");

// ── Paths ──────────────────────────────────────────────────────────────────
const LIBRARY_DIR = join(ROOT, "content", "library");
const SHOWCASE_DIR = join(ROOT, "static", "previews", "showcase");
const HERO_DIR = join(ROOT, "static", "previews", "hero");
const REMOTION_ENTRY = "src/remotion/index.ts";

// ── Parse content/library/*.md for primaryId + all variant IDs ────────────
function parseContentFiles() {
  const entries = [];
  const files = readdirSync(LIBRARY_DIR).filter(
    (f) => f.endsWith(".md") && f !== "_index.md"
  );

  for (const file of files) {
    const raw = readFileSync(join(LIBRARY_DIR, file), "utf-8");
    // Extract the YAML front-matter block between the first two ---
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) continue;
    const fm = fmMatch[1];

    const primaryMatch = fm.match(/^primaryId:\s*"?([^"\n]+)"?/m);
    if (!primaryMatch) continue;
    const primaryId = primaryMatch[1].trim();

    // Collect all variant IDs declared in the front-matter
    const variantIds = [];
    for (const m of fm.matchAll(/^\s+- id:\s*"([^"]+)"/gm)) {
      variantIds.push(m[1]);
    }

    entries.push({ file, primaryId, variantIds });
  }
  return entries;
}

// ── Determine which IDs need previews ─────────────────────────────────────
function findMissing(entries) {
  const missingShowcase = [];
  const missingHero = [];

  for (const { primaryId, variantIds } of entries) {
    const ids = [primaryId, ...variantIds];

    for (const id of ids) {
      const png = join(SHOWCASE_DIR, `${id}.png`);
      const mp4 = join(HERO_DIR, `${id}.mp4`);

      if (FORCE || !existsSync(png)) missingShowcase.push(id);
      if (FORCE || !existsSync(mp4)) missingHero.push(id);
    }
  }

  return {
    showcase: [...new Set(missingShowcase)],
    hero: [...new Set(missingHero)],
  };
}

// ── Shell helper (uses execFileSync — no shell injection risk) ─────────────
function run(label, bin, args, opts = {}) {
  console.log(`  → ${label}`);
  if (DRY_RUN) {
    console.log(`    [dry-run] ${bin} ${args.join(" ")}`);
    return;
  }
  try {
    execFileSync(bin, args, { cwd: ROOT, stdio: "inherit", ...opts });
  } catch {
    // Non-fatal: log and continue with remaining compositions
    console.error(`  ✗ Failed: ${label}`);
  }
}

// ── ID safety check — must match Remotion's allowed composition ID pattern ─
function isSafeId(id) {
  return /^[A-Za-z0-9_-]+$/.test(id);
}

// ── Max auto-render threshold (to avoid blocking dev server for hours) ─────
// If more than this many files are missing, warn and skip unless --force.
const AUTO_RENDER_MAX = 20;

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🎬 generate-missing-previews");
  console.log(
    `   Mode: ${FORCE ? "FORCE (re-render all)" : DRY_RUN ? "DRY RUN" : "missing only"}\n`
  );

  const entries = parseContentFiles();
  console.log(`   Found ${entries.length} content/library/*.md files`);

  const { showcase, hero } = findMissing(entries);
  console.log(`   Missing showcase PNGs : ${showcase.length}`);
  console.log(`   Missing hero MP4s     : ${hero.length}`);

  if (showcase.length === 0 && hero.length === 0) {
    console.log("\n   ✓ All previews present — nothing to render.\n");
    return;
  }

  const total = showcase.length + hero.length;
  if (!FORCE && !DRY_RUN && total > AUTO_RENDER_MAX) {
    console.warn(
      `\n   ⚠  ${total} assets missing — exceeds auto-render limit (${AUTO_RENDER_MAX}).`
    );
    console.warn(`   Run  npm run previews         to render missing ones.`);
    console.warn(`   Run  npm run previews:force   to re-render everything.\n`);
    return;
  }

  // Validate all IDs before we start rendering
  const badIds = [...showcase, ...hero].filter((id) => !isSafeId(id));
  if (badIds.length > 0) {
    console.error(`\n   ✗ Unsafe composition IDs (will not render):`);
    for (const id of badIds) console.error(`     - ${JSON.stringify(id)}`);
  }

  // ── Render showcase stills ────────────────────────────────────────────────
  if (showcase.length > 0) {
    console.log(`\n── Rendering ${showcase.length} showcase stills ──`);
    for (const id of showcase) {
      if (!isSafeId(id)) continue;
      run(
        `showcase still: ${id}`,
        "npx",
        [
          "remotion",
          "still",
          "--public-dir",
          "src/remotion/public",
          REMOTION_ENTRY,
          id,
          `static/previews/showcase/${id}.png`,
        ]
      );
    }
  }

  // ── Render hero MP4s ──────────────────────────────────────────────────────
  if (hero.length > 0) {
    console.log(`\n── Rendering ${hero.length} hero MP4s ──`);
    for (const id of hero) {
      if (!isSafeId(id)) continue;
      const mp4Out = `static/previews/hero/${id}.mp4`;
      run(
        `hero MP4: ${id}`,
        "npx",
        [
          "remotion",
          "render",
          "--public-dir",
          "src/remotion/public",
          "--concurrency=1",
          REMOTION_ENTRY,
          id,
          mp4Out,
        ]
      );

      // Convert MP4 → GIF if ffmpeg is available (non-fatal if absent)
      const gifOut = `static/previews/hero/${id}.gif`;
      if (existsSync(join(ROOT, mp4Out)) && (FORCE || !existsSync(join(ROOT, gifOut)))) {
        run(
          `GIF conversion: ${id}`,
          "ffmpeg",
          [
            "-y",
            "-i",
            mp4Out,
            "-vf",
            "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse",
            "-loop",
            "0",
            gifOut,
          ],
          { stdio: "pipe" } // suppress ffmpeg noise; errors logged by catch
        );
      }
    }
  }

  console.log("\n   ✓ Done generating missing previews.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
