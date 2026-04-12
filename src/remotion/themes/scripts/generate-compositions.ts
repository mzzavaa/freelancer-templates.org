/**
 * Composition Generation Script
 *
 * Initializes the theme framework registries and generates all composition
 * configurations by combining templates with compatible themes.
 *
 * This script:
 * 1. Imports ThemeRegistry, TemplateRegistry, CompositionGenerator from the theme framework
 * 2. Imports all theme presets (THEME_PRESETS from presets)
 * 3. Imports template configs (TESTIMONIAL_CONFIG from templates/testimonial)
 * 4. Creates and populates registries
 * 5. Generates compositions using CompositionGenerator
 * 6. Exports the generated compositions for use in Root.tsx
 * 7. Optionally writes to a JSON manifest file
 *
 * @module themes/scripts/generate-compositions
 * @see Requirements: 7.1-7.6, 14.1-14.3
 */

import {
  ThemeRegistry,
  TemplateRegistry,
  CompositionGenerator,
  THEME_PRESETS,
} from "..";
import { TESTIMONIAL_CONFIG } from "../../templates/testimonial/config";

// ═══════════════════════════════════════════════════════════════════════════
// Registry Initialization
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Theme registry instance populated with all theme presets.
 *
 * Contains all original, extended, and custom themes from THEME_PRESETS.
 *
 * @see Requirements: 1.1, 1.7
 */
const themeRegistry = new ThemeRegistry();

/**
 * Template registry instance populated with all template configurations.
 *
 * Contains all registered templates including Testimonial.
 *
 * @see Requirements: 4.1, 4.2
 */
const templateRegistry = new TemplateRegistry();

// ═══════════════════════════════════════════════════════════════════════════
// Theme Registration
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Register all themes from THEME_PRESETS.
 *
 * Iterates through all theme presets and registers each theme
 * with the ThemeRegistry using its name as the key.
 *
 * @see Requirements: 1.1, 1.7, 10.2, 10.3
 */
Object.entries(THEME_PRESETS).forEach(([name, theme]) => {
  themeRegistry.registerTheme(name, theme);
});

// ═══════════════════════════════════════════════════════════════════════════
// Template Registration
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Register all template configurations.
 *
 * Currently includes:
 * - Testimonial template with centered, split, and editorial layouts
 *
 * Additional templates can be registered here as they are implemented.
 *
 * @see Requirements: 4.1, 5.1-5.7
 */
templateRegistry.registerTemplate(TESTIMONIAL_CONFIG);

// Future templates can be registered here:
// templateRegistry.registerTemplate(CASE_STUDY_CONFIG);
// templateRegistry.registerTemplate(GAMEDAY_CONFIG);

// ═══════════════════════════════════════════════════════════════════════════
// Composition Generation
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Composition generator instance.
 *
 * Combines templates from TemplateRegistry with themes from ThemeRegistry
 * to generate all composition configurations.
 *
 * @see Requirements: 7.1-7.6
 */
const generator = new CompositionGenerator(templateRegistry, themeRegistry);

/**
 * Generated composition configurations.
 *
 * Array of CompositionConfig objects for all template × theme × layout
 * combinations. Each composition has a unique ID and includes:
 * - Component reference
 * - Dimensions (width, height, fps, durationInFrames)
 * - Default props (theme, layout, spec)
 * - Metadata (templateId, themeName, layoutName)
 *
 * @see Requirements: 7.1-7.6
 */
const compositions = generator.generateCompositions();

// ═══════════════════════════════════════════════════════════════════════════
// Exports
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Export all generated compositions and registries for use in Root.tsx.
 *
 * Usage in Root.tsx:
 * ```typescript
 * import { compositions, themeRegistry, templateRegistry, generator } from "./themes/scripts/generate-compositions";
 *
 * export const RemotionRoot: React.FC = () => {
 *   return (
 *     <>
 *       {compositions.map((comp) => (
 *         <Composition
 *           key={comp.id}
 *           id={comp.id}
 *           component={comp.component}
 *           durationInFrames={comp.durationInFrames}
 *           fps={comp.fps}
 *           width={comp.width}
 *           height={comp.height}
 *           defaultProps={comp.defaultProps}
 *         />
 *       ))}
 *     </>
 *   );
 * };
 * ```
 *
 * @see Requirements: 14.1, 14.3
 */
export { compositions, themeRegistry, templateRegistry, generator };

// ═══════════════════════════════════════════════════════════════════════════
// JSON Manifest Generation (Optional)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generates a JSON manifest of all compositions.
 *
 * The manifest includes metadata about each composition:
 * - id: Unique composition identifier
 * - templateId: Source template ID
 * - themeName: Applied theme name
 * - layoutName: Layout variant
 * - dimensions: width, height, fps, durationInFrames
 *
 * @returns JSON string containing the composition manifest
 *
 * @example
 * ```typescript
 * import { generateManifest } from "./themes/scripts/generate-compositions";
 * import fs from "fs";
 *
 * const manifest = generateManifest();
 * fs.writeFileSync("compositions.json", manifest);
 * ```
 *
 * @see Requirements: 14.2
 */
export function generateManifest(): string {
  return generator.exportToJson();
}

/**
 * Generates Root.tsx JSX content for all compositions.
 *
 * Returns a string containing valid JSX that can be inserted into Root.tsx
 * to register all compositions with Remotion.
 *
 * @returns JSX string for Root.tsx
 *
 * @example
 * ```typescript
 * import { generateRootContent } from "./themes/scripts/generate-compositions";
 *
 * const rootContent = generateRootContent();
 * console.log(rootContent);
 * ```
 *
 * @see Requirements: 14.1, 14.3
 */
export function generateRootContent(): string {
  return generator.exportToRoot();
}

// ═══════════════════════════════════════════════════════════════════════════
// Generation Statistics
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generates compositions with detailed metadata about the generation process.
 *
 * Returns additional information including:
 * - Total compositions generated
 * - Templates processed and skipped
 * - Themes used
 * - Orphaned templates detected
 * - Any warnings encountered
 *
 * @returns CompositionGenerationResult with compositions and metadata
 *
 * @example
 * ```typescript
 * import { generateWithStats } from "./themes/scripts/generate-compositions";
 *
 * const result = generateWithStats();
 * console.log(`Generated ${result.compositions.length} compositions`);
 * console.log(`Processed ${result.templatesProcessed} templates`);
 * console.log(`Used ${result.themesUsed} themes`);
 * if (result.orphanedTemplates.length > 0) {
 *   console.log(`Orphaned templates: ${result.orphanedTemplates.join(", ")}`);
 * }
 * ```
 *
 * @see Requirements: 7.1-7.6, 16.1-16.3
 */
export function generateWithStats() {
  return generator.generateWithMetadata();
}

// ═══════════════════════════════════════════════════════════════════════════
// CLI Support (when run directly)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Main function for CLI execution.
 *
 * When this script is run directly (not imported), it outputs
 * generation statistics and optionally writes the manifest to a file.
 *
 * Usage:
 * ```bash
 * npx ts-node src/remotion/themes/scripts/generate-compositions.ts
 * ```
 */
function main(): void {
  const result = generator.generateWithMetadata();

  console.log("═══════════════════════════════════════════════════════════════");
  console.log("  Composition Generation Complete");
  console.log("═══════════════════════════════════════════════════════════════");
  console.log(`  Total Compositions: ${result.compositions.length}`);
  console.log(`  Templates Processed: ${result.templatesProcessed}`);
  console.log(`  Templates Skipped: ${result.templatesSkipped}`);
  console.log(`  Themes Used: ${result.themesUsed}`);
  console.log("═══════════════════════════════════════════════════════════════");

  if (result.orphanedTemplates.length > 0) {
    console.log("\n  Orphaned Templates (no implementation):");
    result.orphanedTemplates.forEach((id) => {
      console.log(`    - ${id}`);
    });
  }

  if (result.warnings.length > 0) {
    console.log("\n  Warnings:");
    result.warnings.forEach((warning) => {
      console.log(`    ⚠ ${warning}`);
    });
  }

  console.log("\n  Generated Compositions:");
  result.compositions.forEach((comp) => {
    console.log(`    - ${comp.id}`);
  });

  console.log("\n═══════════════════════════════════════════════════════════════");
}

// Run main function if this script is executed directly
// Note: This check works in Node.js environments
if (typeof require !== "undefined" && require.main === module) {
  main();
}
