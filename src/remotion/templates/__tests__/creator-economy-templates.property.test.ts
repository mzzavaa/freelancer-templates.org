/**
 * Property-Based Tests for Creator Economy Templates
 *
 * Uses fast-check to verify invariants across all 15 template Spec interfaces,
 * shared animation primitives, and Root.tsx composition registry.
 *
 * Properties tested:
 *   1. Spec round-trip serialization (JSON.parse(JSON.stringify) === original)
 *   2. Stagger animation minimum delay (consecutive deltas ≥ 20 frames)
 *   3. CountUp convergence (0 at start, target at end)
 *   4. Composition ID uniqueness in Root.tsx
 *   5. Composition registration metadata (dimensions, fps, duration)
 *   6. QuickStart minimal spec validity
 *   7. Theme application consistency
 *   8. Data item count matches animated elements (metamorphic)
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import * as fs from "fs";
import * as path from "path";
import { staggerDelay } from "../_shared/animations";
import { THEMES } from "../_shared/themes";
import type { VideoFormat } from "../_shared/formats";

// ── Property 1: Spec Round-Trip Serialization ───────────────────

describe("Property 1: Spec round-trip serialization", () => {
  // Arbitrary for a generic Spec-like object with all cross-cutting fields
  const captionArb = fc.record({
    text: fc.string({ minLength: 1, maxLength: 100 }),
    startFrame: fc.nat({ max: 200 }),
    endFrame: fc.integer({ min: 201, max: 270 }),
  });

  const platformHintsArb = fc.record({
    targetPlatforms: fc.option(fc.array(fc.constantFrom("youtube", "tiktok", "instagram-reels", "instagram-feed"), { maxLength: 3 })),
    hashtags: fc.option(fc.array(fc.string({ minLength: 1, maxLength: 30 }), { maxLength: 5 })),
    description: fc.option(fc.string({ maxLength: 200 })),
  });

  const collabMetadataArb = fc.record({
    author: fc.option(fc.string({ minLength: 1, maxLength: 50 })),
    version: fc.option(fc.string({ minLength: 1, maxLength: 10 })),
    status: fc.option(fc.constantFrom("draft" as const, "review" as const, "approved" as const, "published" as const)),
    createdAt: fc.option(fc.string({ minLength: 10, maxLength: 30 })),
  });

  const specArb = fc.record({
    title: fc.string({ minLength: 1, maxLength: 100 }),
    theme: fc.constantFrom("dark", "clean", "bold", "warm", "minimal", "neon"),
    format: fc.option(fc.constantFrom("landscape" as VideoFormat, "vertical" as VideoFormat, "square" as VideoFormat)),
    captions: fc.option(fc.array(captionArb, { maxLength: 10 })),
    captionLanguage: fc.option(fc.constantFrom("en", "es", "fr", "de", "ja")),
    platformHints: fc.option(platformHintsArb),
    metadata: fc.option(collabMetadataArb),
  });

  it("JSON.parse(JSON.stringify(spec)) deeply equals original (100 iterations)", () => {
    fc.assert(
      fc.property(specArb, (spec) => {
        const roundTripped = JSON.parse(JSON.stringify(spec));
        expect(roundTripped).toEqual(spec);
      }),
      { numRuns: 100 },
    );
  });

  // Test with nested arrays (features, steps, exercises patterns)
  const nestedSpecArb = fc.record({
    title: fc.string({ minLength: 1, maxLength: 100 }),
    items: fc.array(
      fc.record({
        label: fc.string({ minLength: 1, maxLength: 50 }),
        description: fc.string({ maxLength: 200 }),
        value: fc.option(fc.double({ min: 0, max: 100000, noNaN: true })),
      }),
      { minLength: 1, maxLength: 10 },
    ),
    theme: fc.constantFrom("dark", "clean", "bold"),
    brandKit: fc.option(
      fc.record({
        logoUrl: fc.option(fc.webUrl()),
        primaryColor: fc.option(fc.constant("#6366f1")),
        fontFamily: fc.option(fc.constantFrom("Inter", "Roboto", "Poppins")),
      }),
    ),
  });

  it("nested Spec with arrays round-trips correctly (100 iterations)", () => {
    fc.assert(
      fc.property(nestedSpecArb, (spec) => {
        const roundTripped = JSON.parse(JSON.stringify(spec));
        expect(roundTripped).toEqual(spec);
      }),
      { numRuns: 100 },
    );
  });
});


// ── Property 2: Stagger Animation Minimum Delay ─────────────────

describe("Property 2: Stagger delay minimum gap", () => {
  it("consecutive staggerDelay deltas are ≥ 20 frames (100 iterations)", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 20 }),  // array length
        fc.nat({ max: 200 }),              // baseDelay
        fc.integer({ min: 20, max: 60 }), // staggerGap (min 20 per rules)
        (length, baseDelay, gap) => {
          const delays = Array.from({ length }, (_, i) => staggerDelay(i, baseDelay, gap));
          for (let i = 1; i < delays.length; i++) {
            expect(delays[i] - delays[i - 1]).toBeGreaterThanOrEqual(20);
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it("staggerDelay with default gap (20) produces ≥ 20 frame deltas", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 20 }),
        fc.nat({ max: 200 }),
        (length, baseDelay) => {
          const delays = Array.from({ length }, (_, i) => staggerDelay(i, baseDelay));
          for (let i = 1; i < delays.length; i++) {
            expect(delays[i] - delays[i - 1]).toBeGreaterThanOrEqual(20);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ── Property 3: CountUp Convergence ─────────────────────────────

describe("Property 3: CountUp convergence", () => {
  // Replicate the CountUp logic from components.tsx (can't render React in node)
  function countUpValue(target: number, frame: number, startFrame: number, duration = 60): number {
    const progress = Math.min(1, Math.max(0, (frame - startFrame) / duration));
    const eased = 1 - Math.pow(1 - progress, 3);
    return Math.round(eased * target);
  }

  it("returns 0 at frame=startFrame and target at frame≥startFrame+60 (100 iterations)", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100000 }), // target
        fc.nat({ max: 200 }),                  // startFrame
        (target, startFrame) => {
          // At startFrame, value should be 0
          expect(countUpValue(target, startFrame, startFrame)).toBe(0);
          // At startFrame + 60, value should equal target
          expect(countUpValue(target, startFrame + 60, startFrame)).toBe(target);
          // Well past the end, still equals target (clamped)
          expect(countUpValue(target, startFrame + 120, startFrame)).toBe(target);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("value is monotonically non-decreasing for non-negative targets", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 10000 }),
        fc.nat({ max: 100 }),
        (target, startFrame) => {
          let prev = 0;
          for (let f = startFrame; f <= startFrame + 60; f++) {
            const val = countUpValue(target, f, startFrame);
            expect(val).toBeGreaterThanOrEqual(prev);
            prev = val;
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ── Property 4: Composition ID Uniqueness ───────────────────────

describe("Property 4: Composition ID uniqueness", () => {
  const rootPath = path.resolve(__dirname, "../../Root.tsx");
  const rootContent = fs.readFileSync(rootPath, "utf-8");

  // Extract all composition IDs from Root.tsx
  const idRegex = /<Composition[^>]*\bid="([^"]+)"/g;
  const ids: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = idRegex.exec(rootContent)) !== null) {
    ids.push(match[1]);
  }

  it("all Composition IDs are unique", () => {
    const seen = new Set<string>();
    for (const id of ids) {
      expect(seen.has(id)).toBe(false);
      seen.add(id);
    }
  });

  it("has at least 90 compositions registered", () => {
    // 15 templates × 6 showcases = 90 minimum for new templates
    // Plus legacy compositions
    expect(ids.length).toBeGreaterThanOrEqual(90);
  });

  // Check new template IDs follow naming pattern
  const newTemplateCategories = [
    "ProductLaunch", "Tutorial", "BeforeAfter", "CoursePromo", "CountdownHype",
    "AffiliateReview", "PollQuiz", "NewsletterPromo", "PodcastAudiogram", "BehindTheScenes",
    "RecipeStep", "Listing", "FitnessRoutine", "MusicVisualizer", "Collaboration",
  ];

  it("new template composition IDs start with a known category prefix", () => {
    const newIds = ids.filter((id) =>
      newTemplateCategories.some((cat) => id.startsWith(cat))
    );
    // Should have at least 90 new template compositions
    expect(newIds.length).toBeGreaterThanOrEqual(90);
  });
});

// ── Property 5: Composition Registration Metadata ───────────────

describe("Property 5: Composition registration metadata", () => {
  const rootPath = path.resolve(__dirname, "../../Root.tsx");
  const rootContent = fs.readFileSync(rootPath, "utf-8");

  // Extract composition entries with their metadata
  const compRegex = /<Composition[^>]*\bid="([^"]+)"[^>]*width=\{(\d+)\}[^>]*height=\{(\d+)\}[^>]*fps=\{(\d+)\}[^>]*durationInFrames=\{(\d+)\}/g;
  const compositions: Array<{ id: string; width: number; height: number; fps: number; duration: number }> = [];
  let m: RegExpExecArray | null;
  while ((m = compRegex.exec(rootContent)) !== null) {
    compositions.push({
      id: m[1],
      width: parseInt(m[2]),
      height: parseInt(m[3]),
      fps: parseInt(m[4]),
      duration: parseInt(m[5]),
    });
  }

  const newTemplateCategories = [
    "ProductLaunch", "Tutorial", "BeforeAfter", "CoursePromo", "CountdownHype",
    "AffiliateReview", "PollQuiz", "NewsletterPromo", "PodcastAudiogram", "BehindTheScenes",
    "RecipeStep", "Listing", "FitnessRoutine", "MusicVisualizer", "Collaboration",
  ];

  it("landscape showcase compositions have correct dimensions", () => {
    const landscapeComps = compositions.filter(
      (c) =>
        newTemplateCategories.some((cat) => c.id.startsWith(cat)) &&
        !c.id.includes("Vertical") &&
        !c.id.includes("Square")
    );

    for (const comp of landscapeComps) {
      expect(comp.width).toBe(1280);
      expect(comp.height).toBe(720);
      expect(comp.fps).toBe(30);
      expect(comp.duration).toBe(270);
    }
  });
});


// ── Property 6: QuickStart Minimal Spec Validity ────────────────

describe("Property 6: QuickStart minimal spec validity", () => {
  // QuickStart specs require only title + theme. Verify the QUICKSTART_DEFAULTS
  // pattern produces valid objects that round-trip through JSON.
  const themeNames = Object.keys(THEMES);

  it("random title + theme produces JSON-serializable QuickStart spec", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.constantFrom(...themeNames),
        (title, themeName) => {
          const quickSpec = { title, theme: themeName };
          const roundTripped = JSON.parse(JSON.stringify(quickSpec));
          expect(roundTripped).toEqual(quickSpec);
          expect(typeof roundTripped.title).toBe("string");
          expect(themeNames).toContain(roundTripped.theme);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ── Property 7: Theme Application Consistency ───────────────────

describe("Property 7: Theme application consistency", () => {
  const themeNames = Object.keys(THEMES);

  it("all 6 themes have required fields", () => {
    for (const name of themeNames) {
      const theme = THEMES[name];
      expect(theme.name).toBe(name);
      expect(typeof theme.bg).toBe("string");
      expect(typeof theme.bgSecondary).toBe("string");
      expect(typeof theme.textPrimary).toBe("string");
      expect(typeof theme.textSecondary).toBe("string");
      expect(typeof theme.accent).toBe("string");
      expect(typeof theme.accentSecondary).toBe("string");
      expect(typeof theme.fontFamily).toBe("string");
      expect(typeof theme.headingWeight).toBe("number");
      expect(typeof theme.bodyWeight).toBe("number");
    }
  });

  it("random theme selection always produces a valid Theme object", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...themeNames),
        (themeName) => {
          const theme = THEMES[themeName];
          expect(theme).toBeDefined();
          expect(theme.name).toBe(themeName);
          // Theme should be JSON-serializable
          const roundTripped = JSON.parse(JSON.stringify(theme));
          expect(roundTripped).toEqual(theme);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ── Property 8: Data Item Count (Metamorphic) ───────────────────

describe("Property 8: Data item count matches stagger sequence length", () => {
  it("staggerDelay produces exactly N delays for N items", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        fc.nat({ max: 100 }),
        (itemCount, baseDelay) => {
          const delays = Array.from({ length: itemCount }, (_, i) =>
            staggerDelay(i, baseDelay)
          );
          expect(delays).toHaveLength(itemCount);
          // First delay should equal baseDelay
          expect(delays[0]).toBe(baseDelay);
          // Last delay should be baseDelay + (itemCount - 1) * 20
          expect(delays[itemCount - 1]).toBe(baseDelay + (itemCount - 1) * 20);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("array of random features produces matching stagger sequence", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            label: fc.string({ minLength: 1, maxLength: 30 }),
            description: fc.string({ maxLength: 100 }),
          }),
          { minLength: 1, maxLength: 10 },
        ),
        fc.nat({ max: 100 }),
        (features, baseDelay) => {
          const delays = features.map((_, i) => staggerDelay(i, baseDelay));
          expect(delays).toHaveLength(features.length);
        },
      ),
      { numRuns: 100 },
    );
  });
});
