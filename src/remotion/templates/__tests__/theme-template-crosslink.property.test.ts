/**
 * Property-Based Tests for Theme-Template Cross-Link Completeness
 *
 * Validates the "Templates in this Theme" section on theme detail pages.
 * This section queries all templates that have variants matching the theme name
 * and displays them as cross-links to template detail pages.
 *
 * Properties tested:
 *   1. All templates with matching variants are listed in Templates in this Theme section
 *   2. No duplicate templates are displayed
 *
 * **Validates: Requirements 4.1**
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

interface ThemeData {
  name: string;
  displayName: string;
  constName: string;
  bg: string;
  accent: string;
  [key: string]: unknown;
}

interface ThemeGroup {
  label: string;
  description: string;
  themes: ThemeData[];
}

interface ThemesJson {
  totalThemes: number;
  groups: Record<string, ThemeGroup>;
}

// ── Helper Functions ────────────────────────────────────────────

/**
 * Finds all templates that have at least one variant matching the given theme.
 * This mirrors the Hugo template logic in layouts/themes/single.html:
 *
 * The Hugo template iterates through all library pages, checks if each page
 * has variants, filters variants by style matching the target theme, and
 * includes the template if any matching variants are found.
 */
function findTemplatesForTheme(templates: Template[], themeName: string): Template[] {
  const targetTheme = themeName.toLowerCase();
  const matchingTemplates: Template[] = [];

  for (const template of templates) {
    if (template.variants && template.variants.length > 0) {
      const matchingVariants = template.variants.filter(
        (v) => v.style.toLowerCase() === targetTheme
      );
      if (matchingVariants.length > 0) {
        matchingTemplates.push(template);
      }
    }
  }

  return matchingTemplates;
}

/**
 * Gets all unique template slugs from a list of templates.
 */
function getTemplateSlugs(templates: Template[]): string[] {
  return templates.map((t) => t.slug);
}

/**
 * Checks if a template has any variant with the given theme style.
 */
function templateHasTheme(template: Template, themeName: string): boolean {
  const targetTheme = themeName.toLowerCase();
  return template.variants.some((v) => v.style.toLowerCase() === targetTheme);
}

/**
 * Gets all unique theme names from all templates.
 */
function getAllThemeNames(templates: Template[]): string[] {
  const themeSet = new Set<string>();
  for (const template of templates) {
    for (const variant of template.variants) {
      themeSet.add(variant.style.toLowerCase());
    }
  }
  return Array.from(themeSet);
}

// ── Load Real Data ──────────────────────────────────────────────

const templatesPath = path.resolve(__dirname, "../../../../data/templates.json");
const themesPath = path.resolve(__dirname, "../../../../data/themes.json");

const templates: Template[] = JSON.parse(fs.readFileSync(templatesPath, "utf-8"));
const themesData: ThemesJson = JSON.parse(fs.readFileSync(themesPath, "utf-8"));

// Extract all theme names from themes.json
const allThemeNamesFromThemesJson: string[] = [];
for (const groupKey of Object.keys(themesData.groups)) {
  const group = themesData.groups[groupKey];
  for (const theme of group.themes) {
    allThemeNamesFromThemesJson.push(theme.name.toLowerCase());
  }
}

// ── Property 2: Theme-Template Cross-Link Completeness ──────────

describe("Property 2: Theme-Template Cross-Link Completeness", () => {
  /**
   * **Validates: Requirements 4.1**
   *
   * Requirement 4.1: WHEN a theme detail page is displayed, THE Theme_Page
   * SHALL show a "Templates in this Theme" section listing all templates
   * available in that theme.
   *
   * This property verifies that all templates with variants matching the theme
   * are included in the Templates in this Theme section (no templates are missing).
   */
  describe("All templates with matching variants are listed", () => {
    it("every template with a matching variant is found (all real themes)", () => {
      for (const themeName of allThemeNamesFromThemesJson) {
        const foundTemplates = findTemplatesForTheme(templates, themeName);

        // Verify: every template that has this theme should be in foundTemplates
        for (const template of templates) {
          if (templateHasTheme(template, themeName)) {
            const isFound = foundTemplates.some((t) => t.slug === template.slug);
            expect(isFound).toBe(true);
          }
        }
      }
    });

    it("no templates without matching variants are included (all real themes)", () => {
      for (const themeName of allThemeNamesFromThemesJson) {
        const foundTemplates = findTemplatesForTheme(templates, themeName);

        // Verify: every template in foundTemplates actually has this theme
        for (const template of foundTemplates) {
          expect(templateHasTheme(template, themeName)).toBe(true);
        }
      }
    });

    it("found templates count matches actual templates with theme (all real themes)", () => {
      for (const themeName of allThemeNamesFromThemesJson) {
        const foundTemplates = findTemplatesForTheme(templates, themeName);
        const actualCount = templates.filter((t) => templateHasTheme(t, themeName)).length;

        expect(foundTemplates.length).toBe(actualCount);
      }
    });

    it("property: for any arbitrary templates and theme, all matching templates are found", () => {
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
            const foundTemplates = findTemplatesForTheme(generatedTemplates, targetTheme);

            // Every template with matching variant should be found
            for (const template of generatedTemplates) {
              if (templateHasTheme(template, targetTheme)) {
                const isFound = foundTemplates.some((t) => t.slug === template.slug);
                expect(isFound).toBe(true);
              }
            }

            // Every found template should have matching variant
            for (const template of foundTemplates) {
              expect(templateHasTheme(template, targetTheme)).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Validates: Requirements 4.1**
   *
   * This property verifies that no duplicate templates are displayed in the
   * Templates in this Theme section.
   */
  describe("No duplicate templates are displayed", () => {
    it("found templates contain no duplicates (all real themes)", () => {
      for (const themeName of allThemeNamesFromThemesJson) {
        const foundTemplates = findTemplatesForTheme(templates, themeName);
        const slugs = getTemplateSlugs(foundTemplates);
        const uniqueSlugs = new Set(slugs);

        // If there are no duplicates, the array length equals the set size
        expect(slugs.length).toBe(uniqueSlugs.size);
      }
    });

    it("property: for any arbitrary templates with unique slugs and theme, no duplicates in found templates", () => {
      const themeStyleArb = fc.constantFrom(
        "dark", "clean", "bold", "warm", "minimal", "neon"
      );

      const variantArb = fc.record({
        id: fc.string({ minLength: 1, maxLength: 50 }),
        name: fc.string({ minLength: 1, maxLength: 50 }),
        style: themeStyleArb,
      });

      // Generate templates with unique slugs using uniqueArray
      const templateArb = (index: number) => fc.record({
        slug: fc.constant(`template-${index}`),
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

      // Generate array of templates with unique slugs
      const templatesArb = fc.integer({ min: 1, max: 20 }).chain((count) =>
        fc.tuple(...Array.from({ length: count }, (_, i) => templateArb(i)))
      );

      fc.assert(
        fc.property(
          templatesArb,
          themeStyleArb,
          (generatedTemplates, targetTheme) => {
            const foundTemplates = findTemplatesForTheme(generatedTemplates, targetTheme);
            const slugs = getTemplateSlugs(foundTemplates);
            const uniqueSlugs = new Set(slugs);

            // No duplicates: array length equals set size
            expect(slugs.length).toBe(uniqueSlugs.size);
          }
        ),
        { numRuns: 100 }
      );
    });

    it("property: even with templates having multiple variants of same theme, no duplicates", () => {
      // Generate templates where the same theme appears multiple times in variants
      const themeStyleArb = fc.constantFrom("dark", "bold", "neon");

      // Create variants that may have the same style multiple times
      const variantArb = fc.record({
        id: fc.string({ minLength: 1, maxLength: 50 }),
        name: fc.string({ minLength: 1, maxLength: 50 }),
        style: themeStyleArb,
      });

      // Generate templates with unique slugs
      const templateArb = (index: number) => fc.record({
        slug: fc.constant(`template-${index}`),
        camel: fc.string({ minLength: 1, maxLength: 30 }),
        name: fc.string({ minLength: 1, maxLength: 50 }),
        description: fc.string({ minLength: 1, maxLength: 100 }),
        icon: fc.constantFrom("star", "video"),
        color: fc.constantFrom("blue", "red"),
        primaryVariant: fc.string({ minLength: 1, maxLength: 30 }),
        variantCount: fc.integer({ min: 1, max: 20 }),
        // Multiple variants, potentially with same style
        variants: fc.array(variantArb, { minLength: 3, maxLength: 8 }),
        primaryId: fc.string({ minLength: 1, maxLength: 50 }),
      });

      // Generate array of templates with unique slugs
      const templatesArb = fc.integer({ min: 3, max: 10 }).chain((count) =>
        fc.tuple(...Array.from({ length: count }, (_, i) => templateArb(i)))
      );

      fc.assert(
        fc.property(
          templatesArb,
          themeStyleArb,
          (generatedTemplates, targetTheme) => {
            const foundTemplates = findTemplatesForTheme(generatedTemplates, targetTheme);
            const slugs = getTemplateSlugs(foundTemplates);
            const uniqueSlugs = new Set(slugs);

            // No duplicates in output even if template has multiple variants with same theme
            expect(slugs.length).toBe(uniqueSlugs.size);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Metamorphic property: adding a variant with an existing theme to a template
   * that already has that theme should not change the found templates list.
   */
  describe("Metamorphic: adding duplicate theme variant to template", () => {
    it("property: adding variant with existing theme to template does not change found templates", () => {
      const themeStyleArb = fc.constantFrom("dark", "bold", "neon", "clean", "warm");

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
        variants: fc.array(variantArb, { minLength: 2, maxLength: 6 }),
        primaryId: fc.string({ minLength: 1, maxLength: 30 }),
      });

      fc.assert(
        fc.property(
          fc.array(templateArb, { minLength: 2, maxLength: 8 }),
          (generatedTemplates) => {
            // Find a template that has at least one variant
            const templateWithVariants = generatedTemplates.find(
              (t) => t.variants.length > 0
            );
            if (!templateWithVariants) return;

            // Get an existing theme from this template
            const existingTheme = templateWithVariants.variants[0].style;

            // Get original found templates for this theme
            const originalFound = findTemplatesForTheme(generatedTemplates, existingTheme);
            const originalSlugs = new Set(getTemplateSlugs(originalFound));

            // Add another variant with the same theme to the template
            const modifiedTemplates = generatedTemplates.map((t) => {
              if (t.slug === templateWithVariants.slug) {
                return {
                  ...t,
                  variants: [
                    ...t.variants,
                    { id: "new-variant", name: "New Variant", style: existingTheme },
                  ],
                };
              }
              return t;
            });

            const modifiedFound = findTemplatesForTheme(modifiedTemplates, existingTheme);
            const modifiedSlugs = new Set(getTemplateSlugs(modifiedFound));

            // Found templates should be the same
            expect(modifiedSlugs.size).toBe(originalSlugs.size);
            for (const slug of originalSlugs) {
              expect(modifiedSlugs.has(slug)).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it("property: adding variant with new theme to template adds template to that theme's list", () => {
      const existingThemeArb = fc.constantFrom("dark", "bold", "neon");
      const newThemeArb = fc.constantFrom("ocean", "sunset", "forest");

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
        variants: fc.array(variantArb, { minLength: 1, maxLength: 5 }),
        primaryId: fc.string({ minLength: 1, maxLength: 30 }),
      });

      fc.assert(
        fc.property(
          fc.array(templateArb, { minLength: 1, maxLength: 8 }),
          newThemeArb,
          (generatedTemplates, newTheme) => {
            // Find a template that doesn't have the new theme
            const templateWithoutNewTheme = generatedTemplates.find(
              (t) => !templateHasTheme(t, newTheme)
            );
            if (!templateWithoutNewTheme) return;

            // Get original found templates for the new theme
            const originalFound = findTemplatesForTheme(generatedTemplates, newTheme);
            const originalHasTemplate = originalFound.some(
              (t) => t.slug === templateWithoutNewTheme.slug
            );

            // Template should not be in original list
            expect(originalHasTemplate).toBe(false);

            // Add a variant with the new theme to the template
            const modifiedTemplates = generatedTemplates.map((t) => {
              if (t.slug === templateWithoutNewTheme.slug) {
                return {
                  ...t,
                  variants: [
                    ...t.variants,
                    { id: "new-variant", name: "New Variant", style: newTheme },
                  ],
                };
              }
              return t;
            });

            const modifiedFound = findTemplatesForTheme(modifiedTemplates, newTheme);
            const modifiedHasTemplate = modifiedFound.some(
              (t) => t.slug === templateWithoutNewTheme.slug
            );

            // Template should now be in the list
            expect(modifiedHasTemplate).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Bidirectional consistency: if a template appears in a theme's list,
   * then that theme should appear in the template's available themes.
   */
  describe("Bidirectional consistency with template-theme cross-links", () => {
    it("if template is in theme's list, theme is in template's variants (all real data)", () => {
      for (const themeName of allThemeNamesFromThemesJson) {
        const foundTemplates = findTemplatesForTheme(templates, themeName);

        for (const template of foundTemplates) {
          // The template should have at least one variant with this theme
          const hasTheme = template.variants.some(
            (v) => v.style.toLowerCase() === themeName.toLowerCase()
          );
          expect(hasTheme).toBe(true);
        }
      }
    });

    it("property: bidirectional consistency holds for arbitrary data", () => {
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
            const foundTemplates = findTemplatesForTheme(generatedTemplates, targetTheme);

            // For each found template, verify it has the theme in its variants
            for (const template of foundTemplates) {
              expect(templateHasTheme(template, targetTheme)).toBe(true);
            }

            // For each template with the theme, verify it's in the found list
            for (const template of generatedTemplates) {
              if (templateHasTheme(template, targetTheme)) {
                const isFound = foundTemplates.some((t) => t.slug === template.slug);
                expect(isFound).toBe(true);
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
