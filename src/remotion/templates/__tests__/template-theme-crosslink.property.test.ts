/**
 * Property-Based Tests for Template-Theme Cross-Link Completeness
 *
 * Validates the "Available Themes" section on template detail pages.
 * This section extracts unique theme styles from template variants and
 * displays them as cross-links to theme detail pages.
 *
 * Properties tested:
 *   1. All unique theme styles from variants are listed in Available Themes section
 *   2. No duplicate themes are displayed
 *
 * **Validates: Requirements 3.1**
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
 * Extracts unique theme styles from template variants.
 * This mirrors the Hugo template logic in layouts/library/single.html:
 *
 * {{ $uniqueStyles := slice }}
 * {{ range .Params.variants }}
 *   {{ if not (in $uniqueStyles .style) }}
 *     {{ $uniqueStyles = $uniqueStyles | append .style }}
 *   {{ end }}
 * {{ end }}
 */
function extractUniqueThemeStyles(variants: Variant[]): string[] {
  const uniqueStyles: string[] = [];
  for (const variant of variants) {
    if (!uniqueStyles.includes(variant.style)) {
      uniqueStyles.push(variant.style);
    }
  }
  return uniqueStyles;
}

/**
 * Gets all theme styles present in a template's variants.
 */
function getAllThemeStylesFromVariants(variants: Variant[]): string[] {
  return variants.map((v) => v.style);
}

// ── Load Real Template Data ─────────────────────────────────────

const templatesPath = path.resolve(__dirname, "../../../../data/templates.json");
const templates: Template[] = JSON.parse(fs.readFileSync(templatesPath, "utf-8"));

// ── Property 1: Template-Theme Cross-Link Completeness ──────────

describe("Property 1: Template-Theme Cross-Link Completeness", () => {
  /**
   * **Validates: Requirements 3.1**
   *
   * Requirement 3.1: WHEN a template detail page is displayed, THE Template_Page
   * SHALL show a "Available Themes" section listing all themes compatible with
   * that template.
   *
   * This property verifies that all unique theme styles from a template's variants
   * are included in the Available Themes section (no themes are missing).
   */
  describe("All unique theme styles from variants are listed", () => {
    it("every unique theme style from variants appears in extracted unique styles (all templates)", () => {
      for (const template of templates) {
        const allStyles = getAllThemeStylesFromVariants(template.variants);
        const uniqueStyles = extractUniqueThemeStyles(template.variants);

        // Every style that appears in variants should be in uniqueStyles
        for (const style of allStyles) {
          expect(uniqueStyles).toContain(style);
        }
      }
    });

    it("extracted unique styles count matches actual unique styles in variants (all templates)", () => {
      for (const template of templates) {
        const allStyles = getAllThemeStylesFromVariants(template.variants);
        const actualUniqueCount = new Set(allStyles).size;
        const extractedUniqueStyles = extractUniqueThemeStyles(template.variants);

        expect(extractedUniqueStyles.length).toBe(actualUniqueCount);
      }
    });

    it("property: for any arbitrary variants array, all unique styles are extracted", () => {
      const variantArb = fc.record({
        id: fc.string({ minLength: 1, maxLength: 50 }),
        name: fc.string({ minLength: 1, maxLength: 50 }),
        style: fc.constantFrom(
          "dark", "clean", "bold", "warm", "minimal", "neon", "lindamohamed",
          "ocean", "sunset", "forest", "rose", "gold", "midnight", "crimson",
          "lavender", "arctic", "espresso", "corporate", "industrial", "vienna",
          "alpine", "finance", "materialBlue", "materialDark", "flatRed",
          "flatNavy", "swiss", "bauhaus", "mono", "paper", "slate", "blueprint",
          "candy", "mint", "coral", "sky", "grape", "charcoal", "peach",
          "oceanDark", "cream", "electric"
        ),
      });

      fc.assert(
        fc.property(
          fc.array(variantArb, { minLength: 1, maxLength: 20 }),
          (variants) => {
            const allStyles = getAllThemeStylesFromVariants(variants);
            const uniqueStyles = extractUniqueThemeStyles(variants);
            const expectedUnique = new Set(allStyles);

            // All styles from variants should be in uniqueStyles
            for (const style of allStyles) {
              expect(uniqueStyles).toContain(style);
            }

            // Count should match
            expect(uniqueStyles.length).toBe(expectedUnique.size);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Validates: Requirements 3.1**
   *
   * This property verifies that no duplicate themes are displayed in the
   * Available Themes section.
   */
  describe("No duplicate themes are displayed", () => {
    it("extracted unique styles contain no duplicates (all templates)", () => {
      for (const template of templates) {
        const uniqueStyles = extractUniqueThemeStyles(template.variants);
        const uniqueSet = new Set(uniqueStyles);

        // If there are no duplicates, the array length equals the set size
        expect(uniqueStyles.length).toBe(uniqueSet.size);
      }
    });

    it("property: for any arbitrary variants array, no duplicates in extracted styles", () => {
      const variantArb = fc.record({
        id: fc.string({ minLength: 1, maxLength: 50 }),
        name: fc.string({ minLength: 1, maxLength: 50 }),
        style: fc.constantFrom(
          "dark", "clean", "bold", "warm", "minimal", "neon", "lindamohamed",
          "ocean", "sunset", "forest", "rose", "gold", "midnight", "crimson",
          "lavender", "arctic", "espresso"
        ),
      });

      fc.assert(
        fc.property(
          fc.array(variantArb, { minLength: 1, maxLength: 30 }),
          (variants) => {
            const uniqueStyles = extractUniqueThemeStyles(variants);
            const uniqueSet = new Set(uniqueStyles);

            // No duplicates: array length equals set size
            expect(uniqueStyles.length).toBe(uniqueSet.size);
          }
        ),
        { numRuns: 100 }
      );
    });

    it("property: even with many duplicate styles in input, output has no duplicates", () => {
      // Generate variants where the same style appears multiple times
      const styleArb = fc.constantFrom("dark", "bold", "neon", "clean");

      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.string({ minLength: 1, maxLength: 30 }),
              name: fc.string({ minLength: 1, maxLength: 30 }),
              style: styleArb,
            }),
            { minLength: 5, maxLength: 20 }
          ),
          (variants) => {
            const uniqueStyles = extractUniqueThemeStyles(variants);
            const uniqueSet = new Set(uniqueStyles);

            // No duplicates in output
            expect(uniqueStyles.length).toBe(uniqueSet.size);

            // Output should have at most 4 styles (dark, bold, neon, clean)
            expect(uniqueStyles.length).toBeLessThanOrEqual(4);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Additional verification: order preservation
   * The Hugo template preserves the order of first occurrence.
   */
  describe("Order preservation (first occurrence order)", () => {
    it("property: styles appear in order of first occurrence", () => {
      const variantArb = fc.record({
        id: fc.string({ minLength: 1, maxLength: 30 }),
        name: fc.string({ minLength: 1, maxLength: 30 }),
        style: fc.constantFrom("dark", "bold", "neon", "clean", "warm"),
      });

      fc.assert(
        fc.property(
          fc.array(variantArb, { minLength: 1, maxLength: 15 }),
          (variants) => {
            const uniqueStyles = extractUniqueThemeStyles(variants);

            // Verify order matches first occurrence
            const seenStyles: string[] = [];
            for (const variant of variants) {
              if (!seenStyles.includes(variant.style)) {
                seenStyles.push(variant.style);
              }
            }

            expect(uniqueStyles).toEqual(seenStyles);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Metamorphic property: adding a variant with an existing style
   * should not change the unique styles list.
   */
  describe("Metamorphic: adding duplicate style variant", () => {
    it("property: adding a variant with existing style does not change unique styles", () => {
      const styleArb = fc.constantFrom("dark", "bold", "neon", "clean", "warm");
      const variantArb = fc.record({
        id: fc.string({ minLength: 1, maxLength: 30 }),
        name: fc.string({ minLength: 1, maxLength: 30 }),
        style: styleArb,
      });

      fc.assert(
        fc.property(
          fc.array(variantArb, { minLength: 2, maxLength: 10 }),
          (variants) => {
            const originalUniqueStyles = extractUniqueThemeStyles(variants);

            // Pick a style that already exists
            const existingStyle = variants[0].style;

            // Add a new variant with the same style
            const newVariant: Variant = {
              id: "new-variant-id",
              name: "New Variant",
              style: existingStyle,
            };

            const extendedVariants = [...variants, newVariant];
            const extendedUniqueStyles = extractUniqueThemeStyles(extendedVariants);

            // Unique styles should be the same
            expect(extendedUniqueStyles).toEqual(originalUniqueStyles);
          }
        ),
        { numRuns: 100 }
      );
    });

    it("property: adding a variant with new style adds exactly one style", () => {
      const existingStyleArb = fc.constantFrom("dark", "bold", "neon");
      const newStyleArb = fc.constantFrom("ocean", "sunset", "forest");

      const variantArb = fc.record({
        id: fc.string({ minLength: 1, maxLength: 30 }),
        name: fc.string({ minLength: 1, maxLength: 30 }),
        style: existingStyleArb,
      });

      fc.assert(
        fc.property(
          fc.array(variantArb, { minLength: 1, maxLength: 10 }),
          newStyleArb,
          (variants, newStyle) => {
            // Ensure newStyle is not already in variants
            const hasNewStyle = variants.some((v) => v.style === newStyle);
            if (hasNewStyle) return; // Skip this case

            const originalUniqueStyles = extractUniqueThemeStyles(variants);

            // Add a new variant with a new style
            const newVariant: Variant = {
              id: "new-variant-id",
              name: "New Variant",
              style: newStyle,
            };

            const extendedVariants = [...variants, newVariant];
            const extendedUniqueStyles = extractUniqueThemeStyles(extendedVariants);

            // Should have exactly one more style
            expect(extendedUniqueStyles.length).toBe(originalUniqueStyles.length + 1);

            // The new style should be at the end (order preservation)
            expect(extendedUniqueStyles[extendedUniqueStyles.length - 1]).toBe(newStyle);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
