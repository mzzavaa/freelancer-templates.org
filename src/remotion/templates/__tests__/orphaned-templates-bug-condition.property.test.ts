/**
 * Bug Condition Exploration Property Test - Orphaned Template Render Failure
 *
 * This test encodes the EXPECTED BEHAVIOR: all templates in data/templates.json
 * should have valid Remotion compositions (no orphaned templates).
 *
 * **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists.
 * **DO NOT attempt to fix the test or the code when it fails.**
 *
 * Bug Condition from design: `isBugCondition(templateEntry)` returns true when
 * `compositionId NOT IN remotionCompositions`
 *
 * The 8 orphaned templates that should NOT exist in data/templates.json after fix:
 * - LinkedinCarousel, EmailSignature, TimeTracking, ExpenseReport
 * - ContractSummary, ProjectCloseout, WeeklyUpdate, ClientFeedback
 *
 * **EXPECTED OUTCOME on UNFIXED code**: Test FAILS (orphaned templates exist)
 * **EXPECTED OUTCOME on FIXED code**: Test PASSES (orphaned templates removed)
 *
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
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
 * These templates are defined in data/templates.json but have no corresponding
 * <Composition> registration in src/remotion/Root.tsx.
 *
 * Bug manifestation:
 * - Render script fails with "Could not find composition with ID [TemplateName-Variant]"
 * - Broken preview images on template library pages
 * - Player errors when attempting to load these compositions
 */
const ORPHANED_TEMPLATE_SLUGS = [
  "linkedincarousel",
  "emailsignature",
  "timetracking",
  "expensereport",
  "contractsummary",
  "projectcloseout",
  "weeklyupdate",
  "clientfeedback",
] as const;

// ── Helper Functions ────────────────────────────────────────────

/**
 * Checks if a template slug is one of the known orphaned templates.
 * These templates have no Remotion composition implementations.
 */
function isOrphanedTemplate(slug: string): boolean {
  return ORPHANED_TEMPLATE_SLUGS.includes(slug as typeof ORPHANED_TEMPLATE_SLUGS[number]);
}

/**
 * Bug condition check: returns true if the template entry has no corresponding
 * Remotion composition (i.e., it's an orphaned template).
 *
 * Formal specification from design.md:
 * ```
 * FUNCTION isBugCondition(templateEntry)
 *   INPUT: templateEntry from data/templates.json
 *   OUTPUT: boolean
 *
 *   compositionId := templateEntry.variants[*].id
 *   remotionCompositions := getAllCompositionIds(src/remotion/Root.tsx)
 *
 *   RETURN compositionId NOT IN remotionCompositions
 * END FUNCTION
 * ```
 *
 * For this scoped PBT approach, we check against the known list of orphaned templates.
 */
function isBugCondition(template: Template): boolean {
  return isOrphanedTemplate(template.slug);
}

// ── Load Real Template Data ─────────────────────────────────────

const templatesPath = path.resolve(__dirname, "../../../../data/templates.json");
const templates: Template[] = JSON.parse(fs.readFileSync(templatesPath, "utf-8"));

// ── Property 1: Bug Condition - Orphaned Template Render Failure ────────────

describe("Property 1: Bug Condition - Orphaned Template Render Failure", () => {
  /**
   * **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
   *
   * Requirement 1.1: WHEN the render script attempts to render thumbnails for templates
   * defined in data/templates.json THEN the system fails with "Could not find composition"
   * errors for orphaned templates.
   *
   * Requirement 1.2: WHEN a user visits a template library page THEN the system displays
   * broken image placeholders because the preview images cannot be generated.
   *
   * Requirement 1.3: WHEN a user clicks a player link THEN the system returns an error
   * because the composition does not exist in Remotion.
   *
   * Requirement 1.4: WHEN the system iterates through data/templates.json to generate
   * composition IDs THEN it produces IDs for templates that have no corresponding
   * Remotion <Composition> registration.
   *
   * This property verifies that NO orphaned templates exist in data/templates.json.
   * On UNFIXED code, this test will FAIL because orphaned templates DO exist.
   * On FIXED code, this test will PASS because orphaned templates are removed.
   */
  describe("No orphaned templates should exist in data/templates.json", () => {
    it("data/templates.json should not contain any orphaned template entries", () => {
      // Get all template slugs from the data file
      const templateSlugs = templates.map((t) => t.slug);

      // Check each orphaned template slug
      const foundOrphanedTemplates: string[] = [];
      for (const orphanedSlug of ORPHANED_TEMPLATE_SLUGS) {
        if (templateSlugs.includes(orphanedSlug)) {
          foundOrphanedTemplates.push(orphanedSlug);
        }
      }

      // This assertion will FAIL on unfixed code (orphaned templates exist)
      // and PASS on fixed code (orphaned templates removed)
      expect(
        foundOrphanedTemplates,
        `Found ${foundOrphanedTemplates.length} orphaned templates in data/templates.json: ${foundOrphanedTemplates.join(", ")}. ` +
        `These templates have no Remotion composition implementations and cause render failures.`
      ).toHaveLength(0);
    });

    it("property: for any template in data/templates.json, isBugCondition should be false", () => {
      // This property test iterates over all templates and verifies none are orphaned
      fc.assert(
        fc.property(
          fc.constantFrom(...templates),
          (template) => {
            // The bug condition should be FALSE for all templates in the data file
            // (i.e., all templates should have valid Remotion compositions)
            const hasBugCondition = isBugCondition(template);

            // This will FAIL on unfixed code when it encounters an orphaned template
            expect(
              hasBugCondition,
              `Template "${template.slug}" (${template.camel}) is an orphaned template with no Remotion composition. ` +
              `Attempting to render composition ID "${template.variants[0]?.id}" would fail with "Could not find composition" error.`
            ).toBe(false);
          }
        ),
        { numRuns: templates.length } // Test all templates
      );
    });

    it("each specific orphaned template should NOT exist in data/templates.json", () => {
      const templateSlugs = new Set(templates.map((t) => t.slug));

      // Test each orphaned template individually for clear counterexample reporting
      // LinkedinCarousel
      expect(
        templateSlugs.has("linkedincarousel"),
        "LinkedinCarousel (16 variants) is orphaned - no Remotion composition exists"
      ).toBe(false);

      // EmailSignature
      expect(
        templateSlugs.has("emailsignature"),
        "EmailSignature (16 variants) is orphaned - no Remotion composition exists"
      ).toBe(false);

      // TimeTracking
      expect(
        templateSlugs.has("timetracking"),
        "TimeTracking (16 variants) is orphaned - no Remotion composition exists"
      ).toBe(false);

      // ExpenseReport
      expect(
        templateSlugs.has("expensereport"),
        "ExpenseReport (16 variants) is orphaned - no Remotion composition exists"
      ).toBe(false);

      // ContractSummary
      expect(
        templateSlugs.has("contractsummary"),
        "ContractSummary (16 variants) is orphaned - no Remotion composition exists"
      ).toBe(false);

      // ProjectCloseout
      expect(
        templateSlugs.has("projectcloseout"),
        "ProjectCloseout (16 variants) is orphaned - no Remotion composition exists"
      ).toBe(false);

      // WeeklyUpdate
      expect(
        templateSlugs.has("weeklyupdate"),
        "WeeklyUpdate (16 variants) is orphaned - no Remotion composition exists"
      ).toBe(false);

      // ClientFeedback
      expect(
        templateSlugs.has("clientfeedback"),
        "ClientFeedback (16 variants) is orphaned - no Remotion composition exists"
      ).toBe(false);
    });
  });

  /**
   * Diagnostic test to document the current state of orphaned templates.
   * This test always passes but logs the counterexamples found.
   */
  describe("Counterexample documentation", () => {
    it("documents orphaned templates found in data/templates.json", () => {
      const orphanedTemplatesFound = templates.filter((t) => isBugCondition(t));

      // Log counterexamples for documentation
      if (orphanedTemplatesFound.length > 0) {
        console.log("\n=== COUNTEREXAMPLES FOUND (Bug Condition Confirmed) ===");
        console.log(`Found ${orphanedTemplatesFound.length} orphaned templates:`);
        for (const template of orphanedTemplatesFound) {
          console.log(`  - ${template.camel} (slug: ${template.slug}, ${template.variantCount} variants)`);
          console.log(`    Primary composition ID: ${template.primaryId}`);
          console.log(`    Would fail with: "Could not find composition with ID ${template.primaryId}"`);
        }
        console.log("=======================================================\n");
      }

      // This test documents the state but doesn't fail
      // The actual assertions are in the tests above
      expect(true).toBe(true);
    });

    it("calculates total orphaned variants", () => {
      const orphanedTemplatesFound = templates.filter((t) => isBugCondition(t));
      const totalOrphanedVariants = orphanedTemplatesFound.reduce(
        (sum, t) => sum + t.variantCount,
        0
      );

      console.log(`\nTotal orphaned templates: ${orphanedTemplatesFound.length}`);
      console.log(`Total orphaned variants: ${totalOrphanedVariants}`);

      // Document expected counts from bugfix.md
      // Expected: 8 templates, 128 variants (8 * 16 = 128)
      if (orphanedTemplatesFound.length > 0) {
        expect(orphanedTemplatesFound.length).toBe(8);
        expect(totalOrphanedVariants).toBe(128);
      }
    });
  });
});
