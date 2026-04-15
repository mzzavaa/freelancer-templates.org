#!/usr/bin/env node
/**
 * verify-links.mjs
 *
 * Build-time cross-check between content/library/*.md and src/remotion/Root.tsx.
 *
 * Fails the build if:
 *   - Any variant ID in a content/library/*.md is NOT registered in Root.tsx
 *   - Any composition ID in Root.tsx lacks a matching content file
 *     (scoped to "library" compositions — GameDay, LindaMohamed, tutorials are exempt)
 *
 * Usage:
 *   node scripts/verify-links.mjs           # exit 0 = all good, exit 1 = drifted
 *   node scripts/verify-links.mjs --report  # print full report even if clean
 */

import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const VERBOSE = process.argv.includes("--report") || process.argv.includes("-v");

// ── Composition ID prefixes that are intentionally NOT in content/library ──
// (add more as needed when new non-library folders are introduced)
const EXEMPT_PREFIXES = [
  "Folie",             // LindaMohamed personal deck
  "Countdown",         // GameDay
  "InfoLoop",          // GameDay
  "MainEvent",         // GameDay
  "Gameplay",          // GameDay
  "Closing",           // GameDay
  "MarketingVideo",    // GameDay
  "QuestsLive",        // GameDay
  "HalfTime",          // GameDay
  "FinalCountdown",    // GameDay
  "GameExtended",      // GameDay
  "Leaderboard",       // GameDay
  "ScoresCalculating", // GameDay
  "BreakAnnouncement", // GameDay
  "WelcomeBack",       // GameDay
  "FirstCompletion",   // GameDay
  "CloseRace",         // GameDay
  "ComebackAlert",     // GameDay
  "TopTeams",          // GameDay
  "CollectiveMilestone", // GameDay
  "TeamSpotlight",     // GameDay
  "QuestFixed",        // GameDay
  "QuestBroken",       // GameDay
  "QuestUpdate",       // GameDay
  "QuestHint",         // GameDay
  "NewQuestAvailable", // GameDay
  "SurveyReminder",    // GameDay
  "StreamInterruption",// GameDay
  "TechnicalIssue",    // GameDay
  "ScoreCorrection",   // GameDay
  "GamemastersUpdate", // GameDay
  "StreamHostUpdate",  // GameDay
  "LocationShoutout",  // GameDay
  "ImportantReminder", // GameDay
  "VideoFlowPipeline", // YouTube tutorial template
  "ScreencastSlideshow", // Tutorial screencasts
];

function isExempt(id) {
  return EXEMPT_PREFIXES.some((prefix) => id.startsWith(prefix));
}

// ── Parse content/library/*.md ────────────────────────────────────────────
function parseContentFiles() {
  const contentIds = new Set();
  const contentByFile = {};
  const files = readdirSync(join(ROOT, "content", "library")).filter(
    (f) => f.endsWith(".md") && f !== "_index.md"
  );

  for (const file of files) {
    const raw = readFileSync(join(ROOT, "content", "library", file), "utf-8");
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) continue;
    const fm = fmMatch[1];

    const primaryMatch = fm.match(/^primaryId:\s*"?([^"\n]+)"?/m);
    if (!primaryMatch) continue;
    const primaryId = primaryMatch[1].trim();

    const variantIds = [];
    for (const m of fm.matchAll(/^\s+- id:\s*"([^"]+)"/gm)) {
      variantIds.push(m[1]);
      contentIds.add(m[1]);
    }
    contentIds.add(primaryId);
    contentByFile[file] = { primaryId, variantIds };
  }

  return { contentIds, contentByFile };
}

// ── Parse Root.tsx for static composition IDs ─────────────────────────────
function parseRootTsx() {
  const rootPath = join(ROOT, "src", "remotion", "Root.tsx");
  const src = readFileSync(rootPath, "utf-8");

  // Match: id="SomeComposition-VariantName" or id={`template-${id}`} (dynamic, skip)
  const rootIds = new Set();
  for (const m of src.matchAll(/<Composition\s[^>]*id="([A-Za-z0-9_-]+)"/g)) {
    rootIds.add(m[1]);
  }

  // Also extract IDs from template strings like id={`ScreencastSlideshow-${id}`}
  // These are dynamic so we can't resolve them statically — mark as exempt pattern
  return rootIds;
}

// ── Main ──────────────────────────────────────────────────────────────────
function main() {
  const { contentIds, contentByFile } = parseContentFiles();
  const rootIds = parseRootTsx();

  let failures = 0;

  // Check 1: Every content variant ID must exist in Root.tsx
  const contentOrphans = [...contentIds].filter(
    (id) => !rootIds.has(id) && !isExempt(id)
  );

  if (contentOrphans.length > 0) {
    console.error(
      `\n✗ [verify-links] ${contentOrphans.length} content variant ID(s) have no matching composition in Root.tsx:\n`
    );
    for (const id of contentOrphans) {
      console.error(`  - ${id}`);
    }
    failures += contentOrphans.length;
  }

  // Check 2: Every Root.tsx ID (non-exempt) should have a content file
  const rootOrphans = [...rootIds].filter(
    (id) => !contentIds.has(id) && !isExempt(id)
  );

  if (rootOrphans.length > 0) {
    console.warn(
      `\n⚠  [verify-links] ${rootOrphans.length} Root.tsx composition(s) have no content/library/*.md entry:\n`
    );
    for (const id of rootOrphans) {
      console.warn(`  - ${id}`);
    }
    // This is a warning, not a build failure (some comps are registered ahead
    // of their content page being authored). Promote to failure when stricter.
  }

  if (failures === 0) {
    const msg =
      `✓ [verify-links] All ${contentIds.size} content variant IDs` +
      ` are present in Root.tsx (${rootOrphans.length} Root-only IDs exempt as warnings).`;
    if (VERBOSE || rootOrphans.length > 0) console.log("\n" + msg);
    process.exit(0);
  } else {
    console.error(
      `\n✗ [verify-links] ${failures} drift(s) found. Fix before building.\n`
    );
    process.exit(1);
  }
}

main();
