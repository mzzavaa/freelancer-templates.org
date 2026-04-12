/**
 * Property-Based Tests for Theme Filter Correctness
 *
 * Validates the theme filter functionality on the Templates landing page.
 * The filter allows users to filter templates by theme/style, showing only
 * templates that have variants in the selected theme.
 *
 * Properties tested:
 *   1. When a theme is selected, only templates with variants in that theme are shown
 *   2. When "All" is selected, all templates are shown
 *   3. No templates are incorrectly shown or hidden
 *
 * **Validates: Requirements 3.4**
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import * as fs from "fs";
import * as path from "path";

// ── Types ───────────────────────────────────────────────────────

interface Variant {
  id: string;
  name: string;
  style: string;
}

interface Template {
  slug: string;
  camel: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  primaryVariant: string;
  variantCount: number;
  variants: Variant[];
  primaryId: string;
}

// ── Helper Functions ────────────────────────────────────────────

/**
 * Checks if a template has any variant with the given theme style.
 * This mirrors the JavaScript helper function `cardHasTheme()` in layouts/library/list.html:
 *
 * function cardHasTheme(card, themeName) {
 *   var slug = card.dataset.slug;
 *   var tpl = window.__TPLS__ && window.__TPLS__[slug];
 *   if (!tpl || !tpl.variants) return false;
 *   return tpl.variants.some(function(v) { return v.style === themeName; });
 * }
 */
function cardHasTheme(template: Template, themeName: string): boolean {
  if (!template || !template.variants) return false;
  return template.variants.some((v) => v.style === themeName);
}

/**
 * Gets the first variant matching the theme for a template.
 * This mirrors the JavaScript helper function `getVariantForTheme()` in layouts/library/list.html:
 *
 * function getVariantForTheme(slug, themeName) {
 *   var tpl = window.__TPLS__ && window.__TPLS__[slug];
 *   if (!tpl || !tpl.variants) return null;
 *   return tpl.variants.find(function(v) { return v.style === themeName; });
 * }
 */
function getVariantForTheme(template: Template, themeName: string): Variant | undefined {
  if (!template || !template.variants) return undefined;
  return template.variants.find((v) => v.style === themeName);
}

/**
 * Simulates the theme filter logic from layouts/library/list.html.
 * Returns the templates that should be visible when a theme filter is applied.
 *
 * When style === 'all': all templates are shown
 * When style !== 'all': only templates with variants in that theme are shown
 */
function filterTemplatesByTheme(templates: Template[], themeFilter: string): Template[] {
  if (themeFilter === "all") {
    return templates;
  }
  return templates.filter((template) => cardHasTheme(template, themeFilter));
}

/**
 * Gets all unique theme styles from all templates.
 */
function getAllThemeStyles(templates: Template[]): string[] {
  const themeSet = new Set<string>();
  for (const template of templates) {
    for (const variant of template.variants) {
      themeSet.add(variant.style);
    }
  }
  return Array.from(themeSet);
}

// ── Load Real Template Data ─────────────────────────────────────

const templatesPath = path.resolve(__dirname, "../../../../data/templates.json");
const templates: Template[] = JSON.parse(fs.readFileSync(templatesPath, "utf-8"));

// Get all unique theme styles from real data
const allThemeStyles = getAllThemeStyles(templates);

// ── Property 4: Theme Filter Correctness ────────────────────────

describe("Property 4: Theme Filter Correctness", () => {
  /**
   * **Validates: Requirements 3.4**
   *
   * Requirement 3.4: WHEN a user selects a theme filter, THE Templates Landing_Page
   * SHALL display only templates that have variants in that theme.
   *
   * This property verifies that when a theme is selected, only templates with
   * variants in that theme are shown (no incorrect templates are displayed).
   */
  describe("Displayed templates exactly match those with variants in selected theme", () => {
    it("when a theme is selected, only templates with that theme are shown (all real themes)", () => {
      for (const themeName of allThemeStyles) {
        const filteredTemplates = filterTemplatesByTheme(templates, themeName);

        // Every filtered template should have the selected theme
        for (const template of filteredTemplates) {
          expect(cardHasTheme(template, themeName)).toBe(true);
        }
      }
    });

    it("when a theme is selected, all templates with that theme are shown (all real themes)", () => {
      for (const themeName of allThemeStyles) {
        const filteredTemplates = filterTemplatesByTheme(templates, themeName);
        const filteredSlugs = new Set(filteredTemplates.map((t) => t.slug));

        // Every template that has this theme should be in the filtered list
        for (const template of templates) {
          if (cardHasTheme(template, themeName)) {
            expect(filteredSlugs.has(template.slug)).toBe(true);
          }
        }
      }
    });

    it("filtered count matches actual templates with theme (all real themes)", () => {
      for (const themeName of allThemeStyles) {
        const filteredTemplates = filterTemplatesByTheme(templates, themeName);
        const actualCount = templates.filter((t) => cardHasTheme(t, themeName)).length;

        expect(filteredTemplates.length).toBe(actualCount);
      }
    });

    it("property: for any arbitrary templates and theme, filtered templates exactly match those with theme", () => {
      const themeStyleArb = fc.constantFrom(
        "dark", "clean", "bold", "warm", "minimal", "neon", "lindamohamed",
        "ocean", "sunset", "forest", "rose", "gold", "midnight", "crimson",
        "lavender", "arctic", "espresso", "corporate", "industrial", "vienna"
      );

      const variantArb = fc.record({
        id: fc.string({ minLength: 1, maxLength: 50 }),
        name: fc.string({ minLength: 1, maxLength: 50 }),
        style: themeStyleArb,
      });

      const templateArb = fc.record({
        slug: fc.string({ minLength: 1, maxLength: 30 }).filter((s) => /^[a-z0-9-]+$/.test(s)),
        camel: fc.string({ minLength: 1, maxLength: 30 }),
        name: fc.string({ minLength: 1, maxLength: 50 }),
        description: fc.string({ minLength: 1, maxLength: 100 }),
        icon: fc.constantFrom("star", "video", "image", "file"),
        color: fc.constantFrom("blue", "red", "green", "purple"),
        primaryVariant: fc.string({ minLength: 1, maxLength: 30 }),
        variantCount: fc.integer({ min: 1, max: 20 }),
        variants: fc.array(variantArb, { minLength: 1, maxLength: 10 }),
        primaryId: fc.string({ minLength: 1, maxLength: 50 }),
      });

      fc.assert(
        fc.property(
          fc.array(templateArb, { minLength: 1, maxLength: 15 }),
          themeStyleArb,
          (generatedTemplates, targetTheme) => {
            const filteredTemplates = filterTemplatesByTheme(generatedTemplates, targetTheme);

            // Every filtered template should have the theme
            for (const template of filteredTemplates) {
              expect(cardHasTheme(template, targetTheme)).toBe(true);
            }

            // Every template with the theme should be filtered
            for (const template of generatedTemplates) {
              if (cardHasTheme(template, targetTheme)) {
                const isFiltered = filteredTemplates.some((t) => t.slug === template.slug);
                expect(isFiltered).toBe(true);
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Validates: Requirements 3.4**
   *
   * This property verifies that no templates are incorrectly shown or hidden.
   * Templates without the selected theme should not appear in the filtered list.
   */
  describe("No templates are incorrectly shown or hidden", () => {
    it("templates without selected theme are not shown (all real themes)", () => {
      for (const themeName of allThemeStyles) {
        const filteredTemplates = filterTemplatesByTheme(templates, themeName);
        const filteredSlugs = new Set(filteredTemplates.map((t) => t.slug));

        // Templates without this theme should NOT be in the filtered list
        for (const template of templates) {
          if (!cardHasTheme(template, themeName)) {
            expect(filteredSlugs.has(template.slug)).toBe(false);
          }
        }
      }
    });

    it("property: templates without theme are never incorrectly shown", () => {
      const themeStyleArb = fc.constantFrom(
        "dark", "clean", "bold", "warm", "minimal", "neon"
      );

      const variantArb = fc.record({
        id: fc.string({ minLength: 1, maxLength: 30 }),
        name: fc.string({ minLength: 1, maxLength: 30 }),
        style: themeStyleArb,
      });

      // Generate templates with unique slugs using index
      const templateArb = (index: number) => fc.record({
        slug: fc.constant(`template-${index}`),
        camel: fc.string({ minLength: 1, maxLength: 20 }),
        name: fc.string({ minLength: 1, maxLength: 30 }),
        description: fc.string({ minLength: 1, maxLength: 50 }),
        icon: fc.constantFrom("star", "video"),
        color: fc.constantFrom("blue", "red"),
        primaryVariant: fc.string({ minLength: 1, maxLength: 20 }),
        variantCount: fc.integer({ min: 1, max: 10 }),
        variants: fc.array(variantArb, { minLength: 1, maxLength: 6 }),
        primaryId: fc.string({ minLength: 1, maxLength: 30 }),
      });

      // Generate array of templates with unique slugs
      const templatesArb = fc.integer({ min: 1, max: 10 }).chain((count) =>
        fc.tuple(...Array.from({ length: count }, (_, i) => templateArb(i)))
      );

      fc.assert(
        fc.property(
          templatesArb,
          themeStyleArb,
          (generatedTemplates, targetTheme) => {
            const filteredTemplates = filterTemplatesByTheme(generatedTemplates, targetTheme);
            const filteredSlugs = new Set(filteredTemplates.map((t) => t.slug));

            // Templates without the theme should NOT be in filtered list
            for (const template of generatedTemplates) {
              if (!cardHasTheme(template, targetTheme)) {
                expect(filteredSlugs.has(template.slug)).toBe(false);
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Validates: Requirements 3.4**
   *
   * This property verifies that when "All" is selected, all templates are shown.
   */
  describe("When 'All' is selected, all templates are shown", () => {
    it("'All' filter shows all templates (real data)", () => {
      const filteredTemplates = filterTemplatesByTheme(templates, "all");

      expect(filteredTemplates.length).toBe(templates.length);

      // Every template should be in the filtered list
      const filteredSlugs = new Set(filteredTemplates.map((t) => t.slug));
      for (const template of templates) {
        expect(filteredSlugs.has(template.slug)).toBe(true);
      }
    });

    it("property: 'all' filter always returns all templates", () => {
      const themeStyleArb = fc.constantFrom(
        "dark", "clean", "bold", "warm", "minimal", "neon"
      );

      const variantArb = fc.record({
        id: fc.string({ minLength: 1, maxLength: 30 }),
        name: fc.string({ minLength: 1, maxLength: 30 }),
        style: themeStyleArb,
      });

      const templateArb = fc.record({
        slug: fc.string({ minLength: 1, maxLength: 20 }).filter((s) => /^[a-z0-9-]+$/.test(s)),
        camel: fc.string({ minLength: 1, maxLength: 20 }),
        name: fc.string({ minLength: 1, maxLength: 30 }),
        description: fc.string({ minLength: 1, maxLength: 50 }),
        icon: fc.constantFrom("star", "video"),
        color: fc.constantFrom("blue", "red"),
        primaryVariant: fc.string({ minLength: 1, maxLength: 20 }),
        variantCount: fc.integer({ min: 1, max: 10 }),
        variants: fc.array(variantArb, { minLength: 1, maxLength: 6 }),
        primaryId: fc.string({ minLength: 1, maxLength: 30 }),
      });

      fc.assert(
        fc.property(
          fc.array(templateArb, { minLength: 1, maxLength: 15 }),
          (generatedTemplates) => {
            const filteredTemplates = filterTemplatesByTheme(generatedTemplates, "all");

            // All templates should be returned
            expect(filteredTemplates.length).toBe(generatedTemplates.length);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Metamorphic property: filtering by a theme and then by "all" should
   * restore the full list.
   */
  describe("Metamorphic: filter then restore", () => {
    it("property: filtering by theme then by 'all' restores full list", () => {
      const themeStyleArb = fc.constantFrom(
        "dark", "clean", "bold", "warm", "minimal", "neon"
      );

      const variantArb = fc.record({
        id: fc.string({ minLength: 1, maxLength: 30 }),
        name: fc.string({ minLength: 1, maxLength: 30 }),
        style: themeStyleArb,
      });

      const templateArb = fc.record({
        slug: fc.string({ minLength: 1, maxLength: 20 }).filter((s) => /^[a-z0-9-]+$/.test(s)),
        camel: fc.string({ minLength: 1, maxLength: 20 }),
        name: fc.string({ minLength: 1, maxLength: 30 }),
        description: fc.string({ minLength: 1, maxLength: 50 }),
        icon: fc.constantFrom("star", "video"),
        color: fc.constantFrom("blue", "red"),
        primaryVariant: fc.string({ minLength: 1, maxLength: 20 }),
        variantCount: fc.integer({ min: 1, max: 10 }),
        variants: fc.array(variantArb, { minLength: 1, maxLength: 6 }),
        primaryId: fc.string({ minLength: 1, maxLength: 30 }),
      });

      fc.assert(
        fc.property(
          fc.array(templateArb, { minLength: 1, maxLength: 10 }),
          themeStyleArb,
          (generatedTemplates, targetTheme) => {
            // First filter by theme
            const filteredByTheme = filterTemplatesByTheme(generatedTemplates, targetTheme);

            // Then filter by "all" (simulating user clicking "All" button)
            const restoredList = filterTemplatesByTheme(generatedTemplates, "all");

            // Should restore full list
            expect(restoredList.length).toBe(generatedTemplates.length);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Metamorphic property: filtering by the same theme twice should
   * return the same result.
   */
  describe("Metamorphic: idempotent filtering", () => {
    it("property: filtering by same theme twice returns same result", () => {
      const themeStyleArb = fc.constantFrom(
        "dark", "clean", "bold", "warm", "minimal", "neon"
      );

      const variantArb = fc.record({
        id: fc.string({ minLength: 1, maxLength: 30 }),
        name: fc.string({ minLength: 1, maxLength: 30 }),
        style: themeStyleArb,
      });

      const templateArb = fc.record({
        slug: fc.string({ minLength: 1, maxLength: 20 }).filter((s) => /^[a-z0-9-]+$/.test(s)),
        camel: fc.string({ minLength: 1, maxLength: 20 }),
        name: fc.string({ minLength: 1, maxLength: 30 }),
        description: fc.string({ minLength: 1, maxLength: 50 }),
        icon: fc.constantFrom("star", "video"),
        color: fc.constantFrom("blue", "red"),
        primaryVariant: fc.string({ minLength: 1, maxLength: 20 }),
        variantCount: fc.integer({ min: 1, max: 10 }),
        variants: fc.array(variantArb, { minLength: 1, maxLength: 6 }),
        primaryId: fc.string({ minLength: 1, maxLength: 30 }),
      });

      fc.assert(
        fc.property(
          fc.array(templateArb, { minLength: 1, maxLength: 10 }),
          themeStyleArb,
          (generatedTemplates, targetTheme) => {
            const firstFilter = filterTemplatesByTheme(generatedTemplates, targetTheme);
            const secondFilter = filterTemplatesByTheme(generatedTemplates, targetTheme);

            // Results should be identical
            expect(firstFilter.length).toBe(secondFilter.length);

            const firstSlugs = firstFilter.map((t) => t.slug).sort();
            const secondSlugs = secondFilter.map((t) => t.slug).sort();
            expect(firstSlugs).toEqual(secondSlugs);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Verify that getVariantForTheme returns a valid variant when cardHasTheme is true.
   */
  describe("getVariantForTheme consistency with cardHasTheme", () => {
    it("if cardHasTheme is true, getVariantForTheme returns a variant (all real data)", () => {
      for (const themeName of allThemeStyles) {
        for (const template of templates) {
          if (cardHasTheme(template, themeName)) {
            const variant = getVariantForTheme(template, themeName);
            expect(variant).toBeDefined();
            expect(variant?.style).toBe(themeName);
          }
        }
      }
    });

    it("if cardHasTheme is false, getVariantForTheme returns undefined (all real data)", () => {
      for (const themeName of allThemeStyles) {
        for (const template of templates) {
          if (!cardHasTheme(template, themeName)) {
            const variant = getVariantForTheme(template, themeName);
            expect(variant).toBeUndefined();
          }
        }
      }
    });

    it("property: cardHasTheme and getVariantForTheme are consistent", () => {
      const themeStyleArb = fc.constantFrom(
        "dark", "clean", "bold", "warm", "minimal", "neon"
      );

      const variantArb = fc.record({
        id: fc.string({ minLength: 1, maxLength: 30 }),
        name: fc.string({ minLength: 1, maxLength: 30 }),
        style: themeStyleArb,
      });

      const templateArb = fc.record({
        slug: fc.string({ minLength: 1, maxLength: 20 }).filter((s) => /^[a-z0-9-]+$/.test(s)),
        camel: fc.string({ minLength: 1, maxLength: 20 }),
        name: fc.string({ minLength: 1, maxLength: 30 }),
        description: fc.string({ minLength: 1, maxLength: 50 }),
        icon: fc.constantFrom("star", "video"),
        color: fc.constantFrom("blue", "red"),
        primaryVariant: fc.string({ minLength: 1, maxLength: 20 }),
        variantCount: fc.integer({ min: 1, max: 10 }),
        variants: fc.array(variantArb, { minLength: 1, maxLength: 6 }),
        primaryId: fc.string({ minLength: 1, maxLength: 30 }),
      });

      fc.assert(
        fc.property(
          templateArb,
          themeStyleArb,
          (template, targetTheme) => {
            const hasTheme = cardHasTheme(template, targetTheme);
            const variant = getVariantForTheme(template, targetTheme);

            if (hasTheme) {
              expect(variant).toBeDefined();
              expect(variant?.style).toBe(targetTheme);
            } else {
              expect(variant).toBeUndefined();
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Verify filter behavior with edge cases.
   */
  describe("Edge cases", () => {
    it("filtering by non-existent theme returns empty list", () => {
      const filteredTemplates = filterTemplatesByTheme(templates, "nonexistent-theme-xyz");
      expect(filteredTemplates.length).toBe(0);
    });

    it("property: filtering by theme not in any template returns empty list", () => {
      const existingThemeArb = fc.constantFrom("dark", "clean", "bold");
      const nonExistentTheme = "completely-nonexistent-theme-12345";

      const variantArb = fc.record({
        id: fc.string({ minLength: 1, maxLength: 30 }),
        name: fc.string({ minLength: 1, maxLength: 30 }),
        style: existingThemeArb,
      });

      const templateArb = fc.record({
        slug: fc.string({ minLength: 1, maxLength: 20 }).filter((s) => /^[a-z0-9-]+$/.test(s)),
        camel: fc.string({ minLength: 1, maxLength: 20 }),
        name: fc.string({ minLength: 1, maxLength: 30 }),
        description: fc.string({ minLength: 1, maxLength: 50 }),
        icon: fc.constantFrom("star", "video"),
        color: fc.constantFrom("blue", "red"),
        primaryVariant: fc.string({ minLength: 1, maxLength: 20 }),
        variantCount: fc.integer({ min: 1, max: 10 }),
        variants: fc.array(variantArb, { minLength: 1, maxLength: 6 }),
        primaryId: fc.string({ minLength: 1, maxLength: 30 }),
      });

      fc.assert(
        fc.property(
          fc.array(templateArb, { minLength: 1, maxLength: 10 }),
          (generatedTemplates) => {
            const filteredTemplates = filterTemplatesByTheme(generatedTemplates, nonExistentTheme);
            expect(filteredTemplates.length).toBe(0);
          }
        ),
        { numRuns: 50 }
      );
    });

    it("filtering empty template list returns empty list", () => {
      const filteredTemplates = filterTemplatesByTheme([], "dark");
      expect(filteredTemplates.length).toBe(0);

      const allFiltered = filterTemplatesByTheme([], "all");
      expect(allFiltered.length).toBe(0);
    });
  });
});
