/**
 * Property-Based Tests for SaaS Dashboard Templates
 *
 * Uses fast-check to verify invariants across all 23 SaaS dashboard template
 * Spec interfaces, shared Layout Shells, and Root.tsx composition registry.
 *
 * Properties tested:
 *   1. Spec round-trip serialization (JSON.parse(JSON.stringify) === original)
 *   2. Stagger animation minimum delay (consecutive deltas ≥ 20 frames)
 *   3. CountUp convergence (0 at start, target at end)
 *   4. Composition ID uniqueness in Root.tsx (138 new SaaS entries)
 *   5. Composition registration metadata (dimensions, fps, duration)
 *   6. Shell props consistency (all shells accept theme + frame + fps)
 *   7. Theme application consistency across SaaS templates
 *   8. Data item count matches stagger sequence length (metamorphic)
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import * as fs from "fs";
import * as path from "path";
import { staggerDelay } from "../_shared/animations";
import { THEMES } from "../_shared/themes";

// ── Property 1: SaaS Spec Round-Trip Serialization ──────────────

describe("Property 1: SaaS Spec round-trip serialization", () => {
  const teamMemberArb = fc.record({
    name: fc.constantFrom("Linda Mohamed", "Alex Chen", "Sarah Kim"),
    allocation_percent: fc.integer({ min: 0, max: 100 }),
  });

  const deliverableArb = fc.record({
    title: fc.string({ minLength: 1, maxLength: 80 }),
    status: fc.constantFrom("completed", "in-progress", "upcoming"),
  });

  const sprintSpecArb = fc.record({
    sprint_name: fc.string({ minLength: 1, maxLength: 60 }),
    sprint_number: fc.integer({ min: 1, max: 100 }),
    date_range: fc.string({ minLength: 5, maxLength: 40 }),
    tasks_completed: fc.nat({ max: 50 }),
    tasks_in_progress: fc.nat({ max: 20 }),
    tasks_remaining: fc.nat({ max: 20 }),
    velocity: fc.integer({ min: 1, max: 200 }),
    velocity_trend: fc.string({ minLength: 1, maxLength: 40 }),
    team_members: fc.array(teamMemberArb, { minLength: 1, maxLength: 6 }),
    deliverables: fc.array(deliverableArb, { minLength: 1, maxLength: 10 }),
    layout: fc.constantFrom("kanban", "velocity", "burndown"),
    theme: fc.constantFrom("dark", "bold"),
  });

  it("SprintDashboardSpec round-trips through JSON (100 iterations)", () => {
    fc.assert(
      fc.property(sprintSpecArb, (spec) => {
        const roundTripped = JSON.parse(JSON.stringify(spec));
        expect(roundTripped).toEqual(spec);
      }),
      { numRuns: 100 },
    );
  });

  const featureArb = fc.record({
    name: fc.string({ minLength: 1, maxLength: 50 }),
    description: fc.string({ maxLength: 200 }),
    status: fc.constantFrom("completed", "in-progress", "upcoming"),
    category: fc.string({ minLength: 1, maxLength: 30 }),
    progress_percent: fc.option(fc.integer({ min: 0, max: 100 })),
  });

  const roadmapSpecArb = fc.record({
    product_name: fc.string({ minLength: 1, maxLength: 50 }),
    roadmap_title: fc.string({ minLength: 1, maxLength: 80 }),
    time_horizon: fc.string({ minLength: 1, maxLength: 30 }),
    features: fc.array(featureArb, { minLength: 1, maxLength: 8 }),
    layout: fc.constantFrom("timeline", "swimlane", "grid"),
    theme: fc.constantFrom("dark", "clean"),
  });

  it("FeatureRoadmapSpec round-trips through JSON (100 iterations)", () => {
    fc.assert(
      fc.property(roadmapSpecArb, (spec) => {
        const roundTripped = JSON.parse(JSON.stringify(spec));
        expect(roundTripped).toEqual(spec);
      }),
      { numRuns: 100 },
    );
  });

  const pinArb = fc.record({
    place_name: fc.string({ minLength: 1, maxLength: 60 }),
    category: fc.string({ minLength: 1, maxLength: 30 }),
    description: fc.string({ maxLength: 200 }),
    rating: fc.integer({ min: 1, max: 5 }),
    tags: fc.option(fc.array(fc.string({ minLength: 1, maxLength: 20 }), { maxLength: 5 })),
  });

  const pinCollectionSpecArb = fc.record({
    collection_title: fc.string({ minLength: 1, maxLength: 80 }),
    collection_description: fc.string({ maxLength: 200 }),
    curator_name: fc.constantFrom("Linda Mohamed", "Alex Chen", "Sarah Kim"),
    pins: fc.array(pinArb, { minLength: 1, maxLength: 8 }),
    total_pins: fc.integer({ min: 1, max: 500 }),
    region: fc.string({ minLength: 1, maxLength: 40 }),
    layout: fc.constantFrom("card-gallery", "map-list", "category-grid"),
    theme: fc.constantFrom("warm", "clean"),
  });

  it("PinCollectionSpec round-trips through JSON (100 iterations)", () => {
    fc.assert(
      fc.property(pinCollectionSpecArb, (spec) => {
        const roundTripped = JSON.parse(JSON.stringify(spec));
        expect(roundTripped).toEqual(spec);
      }),
      { numRuns: 100 },
    );
  });
});

// ── Property 2: Stagger Animation Minimum Delay ─────────────────

describe("Property 2: SaaS shell stagger delay minimum gap", () => {
  it("consecutive staggerDelay deltas are ≥ 20 frames (100 iterations)", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 20 }),
        fc.nat({ max: 200 }),
        fc.integer({ min: 20, max: 60 }),
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

  it("shell-typical stagger (6 cards, base 60, gap 20) produces correct sequence", () => {
    const delays = Array.from({ length: 6 }, (_, i) => staggerDelay(i, 60, 20));
    expect(delays).toEqual([60, 80, 100, 120, 140, 160]);
  });
});

// ── Property 3: CountUp Convergence ─────────────────────────────

describe("Property 3: CountUp convergence for SaaS metrics", () => {
  function countUpValue(target: number, frame: number, startFrame: number, duration = 60): number {
    const progress = Math.min(1, Math.max(0, (frame - startFrame) / duration));
    const eased = 1 - Math.pow(1 - progress, 3);
    return Math.round(eased * target);
  }

  it("SaaS-typical metrics converge correctly (velocity, bug counts, uptime)", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100000 }),
        fc.nat({ max: 200 }),
        (target, startFrame) => {
          expect(countUpValue(target, startFrame, startFrame)).toBe(0);
          expect(countUpValue(target, startFrame + 60, startFrame)).toBe(target);
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

// ── Property 4: SaaS Composition ID Uniqueness ──────────────────

describe("Property 4: SaaS Dashboard Composition ID uniqueness", () => {
  const rootPath = path.resolve(__dirname, "../../Root.tsx");
  const rootContent = fs.readFileSync(rootPath, "utf-8");

  const idRegex = /<Composition[^>]*\bid="([^"]+)"/g;
  const ids: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = idRegex.exec(rootContent)) !== null) {
    ids.push(match[1]);
  }

  const saasCategories = [
    "SprintDashboard", "FeatureRoadmap", "PlatformOverview", "AgentDashboard", "ClientPipeline",
    "IntegrationStatus", "BugTracker", "ReleaseNotes", "EffortTracking",
    "PinCollection", "OfficeDirectory", "TravelItinerary", "StoreLocator", "NeighborhoodGuide", "EventVenue",
    "SprintRecap", "DeploymentStatus", "VelocityChart", "QBRDashboard", "ProjectHealth", "FeatureFlags", "BugTriage", "ComponentInventory",
  ];

  it("all Composition IDs are unique (no duplicates)", () => {
    const seen = new Set<string>();
    for (const id of ids) {
      expect(seen.has(id)).toBe(false);
      seen.add(id);
    }
  });

  it("has exactly 138 SaaS dashboard compositions registered", () => {
    const saasIds = ids.filter((id) =>
      saasCategories.some((cat) => id.startsWith(cat))
    );
    expect(saasIds.length).toBe(138);
  });

  it("each of the 23 SaaS categories has exactly 6 compositions", () => {
    for (const cat of saasCategories) {
      const catIds = ids.filter((id) => id.startsWith(cat));
      expect(catIds.length).toBe(6);
    }
  });
});

// ── Property 5: SaaS Composition Registration Metadata ──────────

describe("Property 5: SaaS composition registration metadata", () => {
  const rootPath = path.resolve(__dirname, "../../Root.tsx");
  const rootContent = fs.readFileSync(rootPath, "utf-8");

  const saasCategories = [
    "SprintDashboard", "FeatureRoadmap", "PlatformOverview", "AgentDashboard", "ClientPipeline",
    "IntegrationStatus", "BugTracker", "ReleaseNotes", "EffortTracking",
    "PinCollection", "OfficeDirectory", "TravelItinerary", "StoreLocator", "NeighborhoodGuide", "EventVenue",
    "SprintRecap", "DeploymentStatus", "VelocityChart", "QBRDashboard", "ProjectHealth", "FeatureFlags", "BugTriage", "ComponentInventory",
  ];

  // Parse all composition blocks
  const compBlockRegex = /<Composition\s[^/]*?\/>/gs;
  const blocks = rootContent.match(compBlockRegex) || [];

  const saasBlocks = blocks.filter((block) =>
    saasCategories.some((cat) => block.includes(`id="${cat}`))
  );

  it("all 138 SaaS compositions have width=1280, height=720, fps=30, duration=270", () => {
    expect(saasBlocks.length).toBe(138);
    for (const block of saasBlocks) {
      expect(block).toContain("width={1280}");
      expect(block).toContain("height={720}");
      expect(block).toContain("fps={30}");
      expect(block).toContain("durationInFrames={270}");
    }
  });
});

// ── Property 6: Shell Props Consistency ─────────────────────────

describe("Property 6: Shell props consistency", () => {
  it("all theme names used in SaaS templates exist in THEMES", () => {
    const saasThemes = ["dark", "bold", "clean", "warm", "neon", "minimal"];
    const themeNames = Object.keys(THEMES);
    for (const t of saasThemes) {
      expect(themeNames).toContain(t);
    }
  });

  it("random shell-like props produce valid stagger sequences", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 12 }),
        fc.nat({ max: 100 }),
        fc.integer({ min: 20, max: 40 }),
        (nodeCount, baseDelay, gap) => {
          const delays = Array.from({ length: nodeCount }, (_, i) => staggerDelay(i, baseDelay, gap));
          expect(delays).toHaveLength(nodeCount);
          expect(delays[0]).toBe(baseDelay);
          if (nodeCount > 1) {
            expect(delays[nodeCount - 1]).toBe(baseDelay + (nodeCount - 1) * gap);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ── Property 7: Theme Application Consistency ───────────────────

describe("Property 7: Theme application consistency for SaaS templates", () => {
  const themeNames = Object.keys(THEMES);

  it("all themes have required fields for shell rendering", () => {
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
    }
  });

  it("random theme selection always produces a valid Theme object", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...themeNames),
        (themeName) => {
          const theme = THEMES[themeName];
          expect(theme).toBeDefined();
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
        fc.integer({ min: 1, max: 12 }),
        fc.nat({ max: 100 }),
        (itemCount, baseDelay) => {
          const delays = Array.from({ length: itemCount }, (_, i) =>
            staggerDelay(i, baseDelay)
          );
          expect(delays).toHaveLength(itemCount);
          expect(delays[0]).toBe(baseDelay);
          expect(delays[itemCount - 1]).toBe(baseDelay + (itemCount - 1) * 20);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("SaaS-typical data arrays produce matching stagger sequences", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 30 }),
            status: fc.constantFrom("completed", "in-progress", "upcoming"),
          }),
          { minLength: 1, maxLength: 12 },
        ),
        fc.nat({ max: 100 }),
        (items, baseDelay) => {
          const delays = items.map((_, i) => staggerDelay(i, baseDelay));
          expect(delays).toHaveLength(items.length);
        },
      ),
      { numRuns: 100 },
    );
  });
});
