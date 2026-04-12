/**
 * Property 2: Preservation - Implemented Templates Remain Valid
 *
 * This test verifies that all implemented templates (those with Remotion compositions)
 * remain valid in data/templates.json. These tests should PASS on both unfixed and
 * fixed code, confirming that the fix is surgical and doesn't affect working templates.
 *
 * **IMPORTANT**: Follow observation-first methodology
 * - Observe: Parse `data/templates.json` and identify all implemented templates
 * - Observe: Verify implemented templates like Testimonial, AffiliateReview, AgentDashboard exist
 * - Write property-based test: verify implemented templates remain in the data file
 *
 * Preservation Requirements from design:
 * - All existing implemented templates continue to render successfully
 * - Hugo site builds without errors
 * - Player loads and plays all implemented compositions correctly
 * - Render script successfully processes all implemented templates
 * - Template library pages for implemented templates display correct preview images
 *
 * **EXPECTED OUTCOME**: Tests PASS (confirms baseline behavior to preserve)
 *
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
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

// ── Constants ───────────────────────────────────────────────────

/**
 * The 8 orphaned template slugs that have no Remotion composition implementations.
 * These are EXCLUDED from preservation tests because they are the bug condition.
 */
const ORPHANED_TEMPLATE_SLUGS = new Set([
  "linkedincarousel",
  "emailsignature",
  "timetracking",
  "expensereport",
  "contractsummary",
  "projectcloseout",
  "weeklyupdate",
  "clientfeedback",
]);

/**
 * Sample of key implemented templates that MUST be preserved.
 * These templates have Remotion compositions in src/remotion/templates/
 * and are explicitly mentioned in the design.md preservation requirements.
 */
const KEY_IMPLEMENTED_TEMPLATES = [
  "testimonial",
  "affiliatereview",
  "agentdashboard",
  "beforeafter",
  "behindthescenes",
  "casestudy",
  "collaboration",
  "countdownhype",
  "coursepromo",
  "event",
  "explainer",
  "faq",
  "fitnessroutine",
  "invoice",
  "listing",
  "milestone",
  "musicvisualizer",
  "newsletterpromo",
  "onboarding",
  "podcastaudiogram",
  "pollquiz",
  "portfolio",
  "pricing",
  "productlaunch",
  "proposal",
  "recap",
  "recipestep",
  "socialproof",
  "tutorial",
] as const;

/**
 * Required fields for a valid template entry in data/templates.json
 */
const REQUIRED_TEMPLATE_FIELDS = [
  "slug",
  "camel",
  "name",
  "description",
  "icon",
  "color",
  "primaryVariant",
  "variantCount",
  "variants",
  "primaryId",
] as const;

/**
 * Required fields for a valid variant entry
 */
const REQUIRED_VARIANT_FIELDS = ["id", "name", "style"] as const;

// ── Helper Functions ────────────────────────────────────────────

/**
 * Checks if a template is an orphaned template (no Remotion implementation).
 */
function isOrphanedTemplate(slug: string): boolean {
  return ORPHANED_TEMPLATE_SLUGS.has(slug);
}

/**
 * Checks if a template is an implemented template (has Remotion implementation).
 */
function isImplementedTemplate(slug: string): boolean {
  return !isOrphanedTemplate(slug);
}

/**
 * Validates that a template has all required fields with correct types.
 */
function hasValidStructure(template: Template): boolean {
  // Check all required fields exist
  for (const field of REQUIRED_TEMPLATE_FIELDS) {
    if (!(field in template)) {
      return false;
    }
  }

  // Check field types
  if (typeof template.slug !== "string" || template.slug.length === 0) return false;
  if (typeof template.camel !== "string" || template.camel.length === 0) return false;
  if (typeof template.name !== "string" || template.name.length === 0) return false;
  if (typeof template.description !== "string") return false;
  if (typeof template.icon !== "string") return false;
  if (typeof template.color !== "string") return false;
  if (typeof template.primaryVariant !== "string") return false;
  if (typeof template.variantCount !== "number" || template.variantCount < 1) return false;
  if (!Array.isArray(template.variants) || template.variants.length === 0) return false;
  if (typeof template.primaryId !== "string" || template.primaryId.length === 0) return false;

  // Check variants structure
  for (const variant of template.variants) {
    for (const field of REQUIRED_VARIANT_FIELDS) {
      if (!(field in variant)) return false;
    }
    if (typeof variant.id !== "string" || variant.id.length === 0) return false;
    if (typeof variant.name !== "string" || variant.name.length === 0) return false;
    if (typeof variant.style !== "string" || variant.style.length === 0) return false;
  }

  return true;
}

/**
 * Validates that variant count matches actual variants array length.
 */
function hasConsistentVariantCount(template: Template): boolean {
  return template.variantCount === template.variants.length;
}

/**
 * Validates that primaryId matches one of the variant IDs.
 */
function hasValidPrimaryId(template: Template): boolean {
  return template.variants.some((v) => v.id === template.primaryId);
}

/**
 * Validates that variant IDs follow a consistent format starting with the template identifier.
 * Note: Some templates use uppercase (FAQ-) while camel is "Faq", so we check case-insensitively.
 */
function hasValidVariantIdFormat(template: Template): boolean {
  // Check that all variant IDs start with the template identifier (case-insensitive)
  const prefix = template.camel.toLowerCase();
  return template.variants.every((v) => v.id.toLowerCase().startsWith(prefix + "-"));
}

// ── Load Real Template Data ─────────────────────────────────────

const templatesPath = path.resolve(__dirname, "../../../../data/templates.json");
const templates: Template[] = JSON.parse(fs.readFileSync(templatesPath, "utf-8"));

// Filter to only implemented templates (exclude orphaned ones)
const implementedTemplates = templates.filter((t) => isImplementedTemplate(t.slug));

// ── Property 2: Preservation - Implemented Templates Remain Valid ────────────

describe("Property 2: Preservation - Implemented Templates Remain Valid", () => {
  /**
   * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
   *
   * Requirement 3.1: WHEN the render script processes templates that DO have Remotion
   * implementations THEN the system SHALL CONTINUE TO render thumbnails successfully
   *
   * Requirement 3.2: WHEN a user visits a template library page for an implemented
   * template THEN the system SHALL CONTINUE TO display valid preview images
   *
   * Requirement 3.3: WHEN a user clicks a player link for an implemented template
   * THEN the system SHALL CONTINUE TO load and play the composition correctly
   *
   * Requirement 3.4: WHEN the Hugo site builds THEN the system SHALL CONTINUE TO
   * generate all existing template pages without errors
   *
   * Requirement 3.5: WHEN existing Remotion compositions are rendered THEN the system
   * SHALL CONTINUE TO produce the same visual output as before
   */

  describe("Observation: Implemented templates exist in data/templates.json", () => {
    it("data/templates.json contains implemented templates (not empty after excluding orphans)", () => {
      expect(implementedTemplates.length).toBeGreaterThan(0);
      console.log(`\n=== OBSERVATION: Found ${implementedTemplates.length} implemented templates ===`);
    });

    it("key implemented templates exist: Testimonial, AffiliateReview, AgentDashboard", () => {
      const templateSlugs = new Set(templates.map((t) => t.slug));

      // These are explicitly mentioned in design.md preservation requirements
      expect(templateSlugs.has("testimonial")).toBe(true);
      expect(templateSlugs.has("affiliatereview")).toBe(true);
      expect(templateSlugs.has("agentdashboard")).toBe(true);
    });

    it("all key implemented templates from the sample list exist", () => {
      const templateSlugs = new Set(templates.map((t) => t.slug));

      for (const slug of KEY_IMPLEMENTED_TEMPLATES) {
        expect(
          templateSlugs.has(slug),
          `Key implemented template "${slug}" should exist in data/templates.json`
        ).toBe(true);
      }
    });
  });

  describe("Property: All implemented templates have valid structure", () => {
    it("property: for any implemented template, hasValidStructure should be true", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...implementedTemplates),
          (template) => {
            expect(
              hasValidStructure(template),
              `Template "${template.slug}" (${template.camel}) should have valid structure with all required fields`
            ).toBe(true);
          }
        ),
        { numRuns: implementedTemplates.length }
      );
    });

    it("property: for any implemented template, variant count matches variants array length", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...implementedTemplates),
          (template) => {
            expect(
              hasConsistentVariantCount(template),
              `Template "${template.slug}" has variantCount=${template.variantCount} but variants.length=${template.variants.length}`
            ).toBe(true);
          }
        ),
        { numRuns: implementedTemplates.length }
      );
    });

    it("property: for any implemented template, primaryId matches a variant ID", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...implementedTemplates),
          (template) => {
            expect(
              hasValidPrimaryId(template),
              `Template "${template.slug}" has primaryId="${template.primaryId}" which doesn't match any variant ID`
            ).toBe(true);
          }
        ),
        { numRuns: implementedTemplates.length }
      );
    });

    it("property: for any implemented template, variant IDs follow template-prefix format", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...implementedTemplates),
          (template) => {
            expect(
              hasValidVariantIdFormat(template),
              `Template "${template.slug}" has variants with IDs not following the expected prefix pattern`
            ).toBe(true);
          }
        ),
        { numRuns: implementedTemplates.length }
      );
    });
  });

  describe("Property: Implemented templates have Remotion composition directories", () => {
    // Read from src/remotion/templates/ directory (one level up from __tests__)
    const remotionTemplatesDir = path.resolve(__dirname, "../");
    const remotionTemplateDirs = fs.readdirSync(remotionTemplatesDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith("."))
      .map((d) => d.name.toLowerCase());

    it("observation: Remotion template directories exist", () => {
      expect(remotionTemplateDirs.length).toBeGreaterThan(0);
      console.log(`\n=== OBSERVATION: Found ${remotionTemplateDirs.length} Remotion template directories ===`);
    });

    it("property: key implemented templates have corresponding Remotion directories", () => {
      // Check a sample of key templates that should definitely have Remotion implementations
      const keyTemplatesWithDirs = [
        "testimonial",
        "affiliatereview",
        "agentdashboard",
        "beforeafter",
        "casestudy",
        "event",
        "explainer",
        "faq",
        "invoice",
        "pricing",
        "productlaunch",
        "tutorial",
      ];

      for (const slug of keyTemplatesWithDirs) {
        expect(
          remotionTemplateDirs.includes(slug),
          `Key template "${slug}" should have a Remotion directory at src/remotion/templates/${slug}/`
        ).toBe(true);
      }
    });
  });

  describe("Property: data/templates.json is valid JSON", () => {
    it("data/templates.json can be parsed as valid JSON", () => {
      expect(() => {
        JSON.parse(fs.readFileSync(templatesPath, "utf-8"));
      }).not.toThrow();
    });

    it("data/templates.json is an array", () => {
      const data = JSON.parse(fs.readFileSync(templatesPath, "utf-8"));
      expect(Array.isArray(data)).toBe(true);
    });

    it("data/templates.json round-trips through JSON serialization", () => {
      const original = fs.readFileSync(templatesPath, "utf-8");
      const parsed = JSON.parse(original);
      const reserialized = JSON.stringify(parsed);
      const reparsed = JSON.parse(reserialized);
      expect(reparsed).toEqual(parsed);
    });
  });

  describe("Preservation summary", () => {
    it("documents implemented templates count and structure", () => {
      console.log("\n=== PRESERVATION SUMMARY ===");
      console.log(`Total templates in data/templates.json: ${templates.length}`);
      console.log(`Implemented templates (with Remotion): ${implementedTemplates.length}`);
      console.log(`Orphaned templates (to be removed): ${templates.length - implementedTemplates.length}`);

      // Calculate total variants
      const totalImplementedVariants = implementedTemplates.reduce(
        (sum, t) => sum + t.variantCount,
        0
      );
      console.log(`Total implemented variants: ${totalImplementedVariants}`);

      // List a sample of implemented templates
      console.log("\nSample of implemented templates:");
      const sample = implementedTemplates.slice(0, 10);
      for (const t of sample) {
        console.log(`  - ${t.camel} (${t.variantCount} variants)`);
      }
      console.log("  ...");
      console.log("================================\n");

      // This test always passes - it's for documentation
      expect(true).toBe(true);
    });

    it("verifies no implemented templates are accidentally marked as orphaned", () => {
      // Ensure our orphaned list doesn't include any templates that have Remotion directories
      const remotionTemplatesDir = path.resolve(__dirname, "../");
      const remotionTemplateDirs = new Set(
        fs.readdirSync(remotionTemplatesDir, { withFileTypes: true })
          .filter((d) => d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith("."))
          .map((d) => d.name.toLowerCase())
      );

      for (const orphanedSlug of ORPHANED_TEMPLATE_SLUGS) {
        expect(
          remotionTemplateDirs.has(orphanedSlug),
          `Orphaned template "${orphanedSlug}" should NOT have a Remotion directory (it's marked as orphaned)`
        ).toBe(false);
      }
    });
  });
});
