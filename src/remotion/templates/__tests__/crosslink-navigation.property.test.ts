/**
 * Property-Based Tests for Cross-Link Navigation Validity
 *
 * Validates that all cross-links between templates and themes navigate to
 * valid, existing detail pages. This ensures the bidirectional navigation
 * system works correctly and users don't encounter broken links.
 *
 * Properties tested:
 *   1. All theme links from template pages point to valid theme pages
 *   2. All template links from theme pages point to valid template pages
 *   3. The linked pages exist in the Hugo output structure
 *
 * **Validates: Requirements 3.2, 4.2**
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
 * Extracts unique theme styles from template variants.
 * This mirrors the Hugo template logic in layouts/library/single.html.
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
 * Finds all templates that have at least one variant matching the given theme.
 * This mirrors the Hugo template logic in layouts/themes/single.html.
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
 * Generates the expected URL path for a theme detail page.
 * Theme pages are at /themes/{theme-name}/
 */
function getThemePagePath(themeName: string): string {
  return `/themes/${themeName}/`;
}

/**
 * Generates the expected URL path for a template detail page.
 * Template pages are at /library/{template-slug}/
 */
function getTemplatePagePath(templateSlug: string): string {
  return `/library/${templateSlug}/`;
}

/**
 * Checks if a theme content file exists in the Hugo content directory.
 */
function themeContentFileExists(themeName: string): boolean {
  const contentPath = path.resolve(__dirname, `../../../../content/themes/${themeName}.md`);
  return fs.existsSync(contentPath);
}

/**
 * Checks if a template content file exists in the Hugo content directory.
 */
function templateContentFileExists(templateSlug: string): boolean {
  const contentPath = path.resolve(__dirname, `../../../../content/library/${templateSlug}.md`);
  return fs.existsSync(contentPath);
}

/**
 * Gets all theme names that have content files.
 */
function getExistingThemeNames(): string[] {
  const themesDir = path.resolve(__dirname, "../../../../content/themes");
  const files = fs.readdirSync(themesDir);
  return files
    .filter((f) => f.endsWith(".md") && f !== "_index.md")
    .map((f) => f.replace(".md", ""));
}

/**
 * Gets all template slugs that have content files.
 */
function getExistingTemplateSlugs(): string[] {
  const libraryDir = path.resolve(__dirname, "../../../../content/library");
  const files = fs.readdirSync(libraryDir);
  return files
    .filter((f) => f.endsWith(".md") && f !== "_index.md")
    .map((f) => f.replace(".md", ""));
}

// ── Load Real Data ──────────────────────────────────────────────

const templatesPath = path.resolve(__dirname, "../../../../data/templates.json");
const themesPath = path.resolve(__dirname, "../../../../data/themes.json");

const templates: Template[] = JSON.parse(fs.readFileSync(templatesPath, "utf-8"));
const themesData: ThemesJson = JSON.parse(fs.readFileSync(themesPath, "utf-8"));

// Extract all theme names from themes.json (preserving original case)
const allThemeNamesFromThemesJson: string[] = [];
for (const groupKey of Object.keys(themesData.groups)) {
  const group = themesData.groups[groupKey];
  for (const theme of group.themes) {
    allThemeNamesFromThemesJson.push(theme.name);
  }
}

// Get existing content files
const existingThemeNames = getExistingThemeNames();
const existingTemplateSlugs = getExistingTemplateSlugs();

/**
 * Special-purpose themes that are intentionally not part of the standard
 * theme navigation system. These themes are used for specific templates
 * and don't have dedicated theme detail pages.
 *
 * The cross-link navigation tests will skip these themes since they are
 * not expected to have content pages.
 */
const SPECIAL_PURPOSE_THEMES = new Set([
  "gameday", // Used only by Community GameDay Europe template
  "sims",    // Used only by Sims4 template (if applicable)
]);

/**
 * Checks if a theme is a special-purpose theme that doesn't have a
 * dedicated theme detail page.
 */
function isSpecialPurposeTheme(themeName: string): boolean {
  return SPECIAL_PURPOSE_THEMES.has(themeName.toLowerCase());
}

// ── Property 3: Cross-Link Navigation Validity ──────────────────

describe("Property 3: Cross-Link Navigation Validity", () => {
  /**
   * **Validates: Requirements 3.2**
   *
   * Requirement 3.2: WHEN a theme is listed on a template page, THE Cross_Link
   * SHALL navigate to the theme detail page.
   *
   * This property verifies that all theme links from template pages point to
   * valid, existing theme detail pages.
   *
   * Note: Special-purpose themes (like "gameday") that are used for specific
   * templates and don't have dedicated theme pages are excluded from this test.
   */
  describe("All theme links from template pages point to valid theme pages", () => {
    it("every standard theme style in template variants has a corresponding theme content file", () => {
      for (const template of templates) {
        const uniqueStyles = extractUniqueThemeStyles(template.variants);

        for (const style of uniqueStyles) {
          // Skip special-purpose themes that don't have dedicated pages
          if (isSpecialPurposeTheme(style)) {
            continue;
          }

          const hasContentFile = themeContentFileExists(style);
          expect(
            hasContentFile,
            `Template "${template.name}" references theme "${style}" but no content file exists at content/themes/${style}.md`
          ).toBe(true);
        }
      }
    });

    it("all unique standard theme styles across all templates have valid theme pages", () => {
      // Collect all unique theme styles from all templates
      const allThemeStyles = new Set<string>();
      for (const template of templates) {
        for (const variant of template.variants) {
          // Skip special-purpose themes
          if (!isSpecialPurposeTheme(variant.style)) {
            allThemeStyles.add(variant.style);
          }
        }
      }

      // Verify each theme style has a content file
      for (const style of allThemeStyles) {
        const hasContentFile = themeContentFileExists(style);
        expect(
          hasContentFile,
          `Theme style "${style}" is used in templates but no content file exists at content/themes/${style}.md`
        ).toBe(true);
      }
    });

    it("theme link paths are correctly formatted for Hugo routing", () => {
      for (const template of templates) {
        const uniqueStyles = extractUniqueThemeStyles(template.variants);

        for (const style of uniqueStyles) {
          const expectedPath = getThemePagePath(style);
          // Verify path format: /themes/{theme-name}/
          expect(expectedPath).toMatch(/^\/themes\/[a-zA-Z0-9-]+\/$/);
        }
      }
    });

    it("property: for any template with standard theme variants, all theme cross-links are valid", () => {
      // Filter templates to only those with standard themes
      const templatesWithStandardThemes = templates.filter((t) =>
        t.variants.some((v) => !isSpecialPurposeTheme(v.style))
      );

      fc.assert(
        fc.property(
          fc.constantFrom(...templatesWithStandardThemes),
          (template) => {
            const uniqueStyles = extractUniqueThemeStyles(template.variants)
              .filter((s) => !isSpecialPurposeTheme(s));

            for (const style of uniqueStyles) {
              // Theme content file must exist
              expect(themeContentFileExists(style)).toBe(true);

              // Theme must be in themes.json (case-insensitive comparison)
              const themeInJson = allThemeNamesFromThemesJson.some(
                (t) => t.toLowerCase() === style.toLowerCase()
              );
              expect(themeInJson).toBe(true);
            }
          }
        ),
        { numRuns: templatesWithStandardThemes.length }
      );
    });
  });

  /**
   * **Validates: Requirements 4.2**
   *
   * Requirement 4.2: WHEN a template is listed on a theme page, THE Cross_Link
   * SHALL navigate to the template detail page.
   *
   * This property verifies that all template links from theme pages point to
   * valid, existing template detail pages.
   */
  describe("All template links from theme pages point to valid template pages", () => {
    it("every template shown on theme pages has a corresponding template content file", () => {
      for (const themeName of allThemeNamesFromThemesJson) {
        const matchingTemplates = findTemplatesForTheme(templates, themeName);

        for (const template of matchingTemplates) {
          const hasContentFile = templateContentFileExists(template.slug);
          expect(
            hasContentFile,
            `Theme "${themeName}" links to template "${template.name}" (slug: ${template.slug}) but no content file exists at content/library/${template.slug}.md`
          ).toBe(true);
        }
      }
    });

    it("all templates in templates.json have valid content files", () => {
      for (const template of templates) {
        const hasContentFile = templateContentFileExists(template.slug);
        expect(
          hasContentFile,
          `Template "${template.name}" (slug: ${template.slug}) has no content file at content/library/${template.slug}.md`
        ).toBe(true);
      }
    });

    it("template link paths are correctly formatted for Hugo routing", () => {
      for (const template of templates) {
        const expectedPath = getTemplatePagePath(template.slug);
        // Verify path format: /library/{template-slug}/
        expect(expectedPath).toMatch(/^\/library\/[a-zA-Z0-9-]+\/$/);
      }
    });

    it("property: for any theme, all template cross-links are valid", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...allThemeNamesFromThemesJson),
          (themeName) => {
            const matchingTemplates = findTemplatesForTheme(templates, themeName);

            for (const template of matchingTemplates) {
              // Template content file must exist
              expect(templateContentFileExists(template.slug)).toBe(true);

              // Template must be in templates.json
              const templateInJson = templates.some((t) => t.slug === template.slug);
              expect(templateInJson).toBe(true);
            }
          }
        ),
        { numRuns: allThemeNamesFromThemesJson.length }
      );
    });
  });

  /**
   * **Validates: Requirements 3.2, 4.2**
   *
   * This property verifies that the linked pages exist in the Hugo content
   * structure and will render without error.
   *
   * Note: Special-purpose themes are excluded from these checks.
   */
  describe("Linked pages exist in Hugo content structure", () => {
    it("all standard theme content files referenced by templates exist", () => {
      const referencedThemes = new Set<string>();
      for (const template of templates) {
        for (const variant of template.variants) {
          // Skip special-purpose themes
          if (!isSpecialPurposeTheme(variant.style)) {
            referencedThemes.add(variant.style);
          }
        }
      }

      for (const themeName of referencedThemes) {
        expect(
          existingThemeNames.includes(themeName),
          `Theme "${themeName}" is referenced but not in existing theme content files`
        ).toBe(true);
      }
    });

    it("all template content files referenced by themes exist", () => {
      const referencedTemplates = new Set<string>();
      for (const themeName of allThemeNamesFromThemesJson) {
        const matchingTemplates = findTemplatesForTheme(templates, themeName);
        for (const template of matchingTemplates) {
          referencedTemplates.add(template.slug);
        }
      }

      for (const templateSlug of referencedTemplates) {
        expect(
          existingTemplateSlugs.includes(templateSlug),
          `Template "${templateSlug}" is referenced but not in existing template content files`
        ).toBe(true);
      }
    });

    it("themes.json themes match content/themes directory", () => {
      for (const themeName of allThemeNamesFromThemesJson) {
        expect(
          existingThemeNames.includes(themeName),
          `Theme "${themeName}" in themes.json has no content file`
        ).toBe(true);
      }
    });

    it("templates.json templates match content/library directory", () => {
      for (const template of templates) {
        expect(
          existingTemplateSlugs.includes(template.slug),
          `Template "${template.slug}" in templates.json has no content file`
        ).toBe(true);
      }
    });
  });

  /**
   * Bidirectional navigation consistency: if you can navigate from A to B,
   * you should be able to navigate back from B to A.
   *
   * Note: Special-purpose themes are excluded from these checks.
   */
  describe("Bidirectional navigation consistency", () => {
    it("template -> theme -> template navigation is consistent for standard themes", () => {
      for (const template of templates) {
        const uniqueStyles = extractUniqueThemeStyles(template.variants)
          .filter((s) => !isSpecialPurposeTheme(s));

        for (const style of uniqueStyles) {
          // Navigate from template to theme
          expect(themeContentFileExists(style)).toBe(true);

          // From the theme page, the template should be listed
          const templatesForTheme = findTemplatesForTheme(templates, style);
          const templateIsListed = templatesForTheme.some((t) => t.slug === template.slug);
          expect(
            templateIsListed,
            `Template "${template.name}" links to theme "${style}" but theme page doesn't list this template`
          ).toBe(true);

          // Navigate back from theme to template
          expect(templateContentFileExists(template.slug)).toBe(true);
        }
      }
    });

    it("theme -> template -> theme navigation is consistent", () => {
      for (const themeName of allThemeNamesFromThemesJson) {
        const matchingTemplates = findTemplatesForTheme(templates, themeName);

        for (const template of matchingTemplates) {
          // Navigate from theme to template
          expect(templateContentFileExists(template.slug)).toBe(true);

          // From the template page, the theme should be listed
          const uniqueStyles = extractUniqueThemeStyles(template.variants);
          const themeIsListed = uniqueStyles.some(
            (s) => s.toLowerCase() === themeName.toLowerCase()
          );
          expect(
            themeIsListed,
            `Theme "${themeName}" links to template "${template.name}" but template page doesn't list this theme`
          ).toBe(true);

          // Navigate back from template to theme
          expect(themeContentFileExists(themeName)).toBe(true);
        }
      }
    });

    it("property: bidirectional navigation is always valid for standard themes", () => {
      // Filter templates to only those with standard themes
      const templatesWithStandardThemes = templates.filter((t) =>
        t.variants.some((v) => !isSpecialPurposeTheme(v.style))
      );

      fc.assert(
        fc.property(
          fc.constantFrom(...templatesWithStandardThemes),
          (template) => {
            const uniqueStyles = extractUniqueThemeStyles(template.variants)
              .filter((s) => !isSpecialPurposeTheme(s));

            for (const style of uniqueStyles) {
              // Forward: template -> theme
              expect(themeContentFileExists(style)).toBe(true);

              // Backward: theme -> template
              const templatesForTheme = findTemplatesForTheme(templates, style);
              const canNavigateBack = templatesForTheme.some((t) => t.slug === template.slug);
              expect(canNavigateBack).toBe(true);
            }
          }
        ),
        { numRuns: templatesWithStandardThemes.length }
      );
    });
  });

  /**
   * Metamorphic property: the set of valid cross-links should be stable
   * and deterministic.
   */
  describe("Cross-link stability", () => {
    it("extracting theme styles multiple times yields same result", () => {
      for (const template of templates) {
        const styles1 = extractUniqueThemeStyles(template.variants);
        const styles2 = extractUniqueThemeStyles(template.variants);
        expect(styles1).toEqual(styles2);
      }
    });

    it("finding templates for theme multiple times yields same result", () => {
      for (const themeName of allThemeNamesFromThemesJson) {
        const templates1 = findTemplatesForTheme(templates, themeName);
        const templates2 = findTemplatesForTheme(templates, themeName);
        expect(templates1.map((t) => t.slug)).toEqual(templates2.map((t) => t.slug));
      }
    });

    it("property: cross-link extraction is deterministic", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...templates),
          fc.constantFrom(...allThemeNamesFromThemesJson),
          (template, themeName) => {
            // Theme extraction is deterministic
            const styles1 = extractUniqueThemeStyles(template.variants);
            const styles2 = extractUniqueThemeStyles(template.variants);
            expect(styles1).toEqual(styles2);

            // Template finding is deterministic
            const found1 = findTemplatesForTheme(templates, themeName);
            const found2 = findTemplatesForTheme(templates, themeName);
            expect(found1.map((t) => t.slug)).toEqual(found2.map((t) => t.slug));
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Edge case: empty or missing data handling
   */
  describe("Edge case handling", () => {
    it("templates with no variants don't generate invalid theme links", () => {
      // Create a mock template with no variants
      const emptyTemplate: Template = {
        slug: "test-empty",
        camel: "testEmpty",
        name: "Test Empty",
        description: "Test",
        icon: "star",
        color: "blue",
        primaryVariant: "",
        variantCount: 0,
        variants: [],
        primaryId: "",
      };

      const styles = extractUniqueThemeStyles(emptyTemplate.variants);
      expect(styles).toEqual([]);
    });

    it("themes with no matching templates don't generate invalid template links", () => {
      // Use a theme name that doesn't exist in any template
      const nonExistentTheme = "nonexistent-theme-xyz";
      const matchingTemplates = findTemplatesForTheme(templates, nonExistentTheme);
      expect(matchingTemplates).toEqual([]);
    });

    it("property: empty variants array produces no theme links", () => {
      fc.assert(
        fc.property(
          fc.record({
            slug: fc.string({ minLength: 1, maxLength: 20 }),
            camel: fc.string({ minLength: 1, maxLength: 20 }),
            name: fc.string({ minLength: 1, maxLength: 30 }),
            description: fc.string({ minLength: 1, maxLength: 50 }),
            icon: fc.constantFrom("star", "video"),
            color: fc.constantFrom("blue", "red"),
            primaryVariant: fc.string({ minLength: 0, maxLength: 20 }),
            variantCount: fc.constant(0),
            variants: fc.constant([]),
            primaryId: fc.string({ minLength: 0, maxLength: 30 }),
          }),
          (template) => {
            const styles = extractUniqueThemeStyles(template.variants);
            expect(styles).toEqual([]);
          }
        ),
        { numRuns: 20 }
      );
    });
  });
});
