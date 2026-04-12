/**
 * CompositionGenerator - Dynamic composition configuration generator
 *
 * Generates Remotion composition configurations by combining templates
 * from TemplateRegistry with themes from ThemeRegistry. Each template
 * can have multiple layouts, and each layout can be combined with
 * compatible themes to create unique compositions.
 *
 * @module themes/generator/CompositionGenerator
 * @see Requirements: 7.1-7.6, 9.1-9.3
 */

import type { ThemeRegistry } from "../registry/ThemeRegistry";
import type { TemplateRegistry } from "../registry/TemplateRegistry";
import type { Theme } from "../types/theme";
import type { TemplateConfig } from "../types/template";
import type {
  CompositionConfig,
  CompositionDefaultProps,
  CompositionGenerationOptions,
  CompositionGenerationResult,
  CompositionIdOptions,
} from "../types/composition";
import { generateCompositionId } from "../types/composition";

/**
 * Generates Remotion composition configurations from template and theme registries.
 *
 * The CompositionGenerator provides:
 * - Generation of all template × theme × layout combinations
 * - Filtering by specific template or theme
 * - Unique ID generation with conflict resolution
 * - Orphaned template handling (skip templates without implementations)
 * - Configurable default dimensions and timing
 * - Legacy ID mapping for backward compatibility
 *
 * @example
 * ```typescript
 * const generator = new CompositionGenerator(templateRegistry, themeRegistry);
 * const compositions = generator.generateCompositions();
 *
 * // Generate for specific template
 * const testimonialComps = generator.generateForTemplate("testimonial");
 *
 * // Generate for specific theme
 * const oceanComps = generator.generateForTheme("ocean");
 *
 * // Set up legacy ID mapping for backward compatibility
 * generator.setLegacyIdMapping(new Map([
 *   ["Testimonial-Dark-Centered", "TestimonialDark"],
 *   ["Testimonial-Ocean-Centered", "TestimonialOcean"],
 * ]));
 * ```
 *
 * @see Requirements: 7.1-7.6, 9.1-9.3
 */
export class CompositionGenerator {
  /**
   * Template registry containing all template configurations.
   */
  private readonly templateRegistry: TemplateRegistry;

  /**
   * Theme registry containing all theme definitions.
   */
  private readonly themeRegistry: ThemeRegistry;

  /**
   * Default duration in frames for generated compositions.
   * Can be overridden by template-specific settings.
   */
  private defaultDurationInFrames: number = 300;

  /**
   * Default frames per second for generated compositions.
   * Can be overridden by template-specific settings.
   */
  private defaultFps: number = 30;

  /**
   * Default width in pixels for generated compositions.
   * Can be overridden by template-specific settings.
   */
  private defaultWidth: number = 1920;

  /**
   * Default height in pixels for generated compositions.
   * Can be overridden by template-specific settings.
   */
  private defaultHeight: number = 1080;

  /**
   * Mapping from new composition IDs to legacy IDs for backward compatibility.
   * Keys are new IDs (e.g., "Testimonial-Dark-Centered"), values are legacy IDs (e.g., "TestimonialDark").
   * @see Requirements: 9.1-9.3
   */
  private legacyIdMapping: Map<string, string> = new Map();

  /**
   * Creates a new CompositionGenerator instance.
   *
   * @param templateRegistry - Registry containing template configurations
   * @param themeRegistry - Registry containing theme definitions
   *
   * @precondition templateRegistry is a valid TemplateRegistry instance
   * @precondition themeRegistry is a valid ThemeRegistry instance
   */
  constructor(templateRegistry: TemplateRegistry, themeRegistry: ThemeRegistry) {
    this.templateRegistry = templateRegistry;
    this.themeRegistry = themeRegistry;
  }

  /**
   * Generates composition configurations for all template × theme × layout combinations.
   *
   * Iterates through all templates in the registry, and for each template:
   * 1. Skips if hasImplementation is false (orphaned template)
   * 2. Gets compatible themes based on template's compatibility rules
   * 3. Generates a composition for each theme × layout combination
   *
   * @param options - Optional generation options
   * @returns Array of CompositionConfig objects
   *
   * @precondition templateRegistry is initialized with templates
   * @precondition themeRegistry is initialized with themes
   * @postcondition Returns array of valid CompositionConfig objects
   * @postcondition All returned compositions have unique IDs
   * @postcondition Orphaned templates are skipped
   *
   * @example
   * ```typescript
   * const compositions = generator.generateCompositions();
   * console.log(`Generated ${compositions.length} compositions`);
   * ```
   *
   * @see Requirements: 7.1-7.6
   */
  generateCompositions(options: CompositionGenerationOptions = {}): CompositionConfig[] {
    const {
      skipOrphaned = true,
      templateFilter,
      themeFilter,
    } = options;

    const compositions: CompositionConfig[] = [];
    const usedIds = new Set<string>();

    // Get all templates, optionally filtered
    let templates = this.templateRegistry.getAllTemplates();
    if (templateFilter && templateFilter.length > 0) {
      const filterSet = new Set(templateFilter.map(id => id.toLowerCase()));
      templates = templates.filter(t => filterSet.has(t.id.toLowerCase()));
    }

    // Iterate through all templates
    for (const template of templates) {
      // Skip orphaned templates (no implementation)
      if (skipOrphaned && !template.hasImplementation) {
        continue;
      }

      // Get compatible themes for this template
      let themes = this.getCompatibleThemesForTemplate(template);
      
      // Apply theme filter if specified
      if (themeFilter && themeFilter.length > 0) {
        const filterSet = new Set(themeFilter.map(name => name.toLowerCase()));
        themes = themes.filter(t => filterSet.has(t.name.toLowerCase()));
      }

      // Generate compositions for each theme × layout combination
      for (const theme of themes) {
        for (const layout of template.layouts) {
          const config = this.createCompositionConfig(template, theme, layout, usedIds);
          usedIds.add(config.id);
          compositions.push(config);
        }
      }
    }

    return compositions;
  }

  /**
   * Generates composition configurations for a specific template.
   *
   * Creates compositions for all compatible themes and layouts
   * of the specified template.
   *
   * @param templateId - The template ID to generate compositions for
   * @returns Array of CompositionConfig objects for the template
   *
   * @precondition templateId is a valid template identifier
   * @postcondition Returns compositions for all theme × layout combinations
   * @postcondition Returns empty array if template not found or is orphaned
   *
   * @example
   * ```typescript
   * const testimonialComps = generator.generateForTemplate("testimonial");
   * console.log(`Generated ${testimonialComps.length} testimonial compositions`);
   * ```
   *
   * @see Requirements: 7.1-7.3
   */
  generateForTemplate(templateId: string): CompositionConfig[] {
    const template = this.templateRegistry.getTemplate(templateId);
    
    // Return empty array if template not found or is orphaned
    if (!template || !template.hasImplementation) {
      return [];
    }

    const compositions: CompositionConfig[] = [];
    const usedIds = new Set<string>();

    // Get compatible themes for this template
    const themes = this.getCompatibleThemesForTemplate(template);

    // Generate compositions for each theme × layout combination
    for (const theme of themes) {
      for (const layout of template.layouts) {
        const config = this.createCompositionConfig(template, theme, layout, usedIds);
        usedIds.add(config.id);
        compositions.push(config);
      }
    }

    return compositions;
  }

  /**
   * Generates composition configurations for a specific theme.
   *
   * Creates compositions for all templates that are compatible
   * with the specified theme, across all their layouts.
   *
   * @param themeName - The theme name to generate compositions for
   * @returns Array of CompositionConfig objects using the theme
   *
   * @precondition themeName is a valid theme name
   * @postcondition Returns compositions for all compatible templates
   * @postcondition Returns empty array if theme not found
   *
   * @example
   * ```typescript
   * const oceanComps = generator.generateForTheme("ocean");
   * console.log(`Generated ${oceanComps.length} ocean-themed compositions`);
   * ```
   *
   * @see Requirements: 7.1-7.3
   */
  generateForTheme(themeName: string): CompositionConfig[] {
    const theme = this.themeRegistry.getTheme(themeName);
    
    // Return empty array if theme not found
    if (!theme) {
      return [];
    }

    const compositions: CompositionConfig[] = [];
    const usedIds = new Set<string>();

    // Get all templates with implementations
    const templates = this.templateRegistry
      .getAllTemplates()
      .filter(t => t.hasImplementation);

    // Generate compositions for each compatible template
    for (const template of templates) {
      // Check if this theme is compatible with the template
      if (!this.isThemeCompatibleWithTemplate(theme, template)) {
        continue;
      }

      // Generate compositions for each layout
      for (const layout of template.layouts) {
        const config = this.createCompositionConfig(template, theme, layout, usedIds);
        usedIds.add(config.id);
        compositions.push(config);
      }
    }

    return compositions;
  }

  /**
   * Sets the default duration in frames for generated compositions.
   *
   * @param frames - Duration in frames (must be positive)
   *
   * @see Requirements: 8.1
   */
  setDefaultDuration(frames: number): void {
    if (frames > 0) {
      this.defaultDurationInFrames = frames;
    }
  }

  /**
   * Sets the default FPS for generated compositions.
   *
   * @param fps - Frames per second (must be positive)
   *
   * @see Requirements: 8.2
   */
  setDefaultFps(fps: number): void {
    if (fps > 0) {
      this.defaultFps = fps;
    }
  }

  /**
   * Sets the default dimensions for generated compositions.
   *
   * @param width - Width in pixels (must be positive)
   * @param height - Height in pixels (must be positive)
   *
   * @see Requirements: 8.3
   */
  setDefaultDimensions(width: number, height: number): void {
    if (width > 0) {
      this.defaultWidth = width;
    }
    if (height > 0) {
      this.defaultHeight = height;
    }
  }

  /**
   * Sets the legacy ID mapping for backward compatibility.
   *
   * Legacy IDs allow existing URLs to continue working after migration
   * to the new composition ID format. The mapping is from new IDs
   * (e.g., "Testimonial-Dark-Centered") to legacy IDs (e.g., "TestimonialDark").
   *
   * @param mapping - Map from new composition IDs to legacy IDs
   *
   * @example
   * ```typescript
   * generator.setLegacyIdMapping(new Map([
   *   ["Testimonial-Dark-Centered", "TestimonialDark"],
   *   ["Testimonial-Ocean-Centered", "TestimonialOcean"],
   *   ["CaseStudy-Bold-Split", "CaseStudyBold"],
   * ]));
   * ```
   *
   * @see Requirements: 9.1-9.3
   */
  setLegacyIdMapping(mapping: Map<string, string>): void {
    this.legacyIdMapping = new Map(mapping);
  }

  /**
   * Adds a single legacy ID mapping.
   *
   * @param newId - The new composition ID (e.g., "Testimonial-Dark-Centered")
   * @param legacyId - The legacy composition ID (e.g., "TestimonialDark")
   *
   * @example
   * ```typescript
   * generator.addLegacyIdMapping("Testimonial-Dark-Centered", "TestimonialDark");
   * ```
   *
   * @see Requirements: 9.1-9.3
   */
  addLegacyIdMapping(newId: string, legacyId: string): void {
    this.legacyIdMapping.set(newId, legacyId);
  }

  /**
   * Gets the legacy ID for a composition ID, if one exists.
   *
   * @param compositionId - The new composition ID to look up
   * @returns The legacy ID if a mapping exists, undefined otherwise
   *
   * @see Requirements: 9.1-9.3
   */
  getLegacyId(compositionId: string): string | undefined {
    return this.legacyIdMapping.get(compositionId);
  }

  /**
   * Clears all legacy ID mappings.
   *
   * @see Requirements: 9.1-9.3
   */
  clearLegacyIdMappings(): void {
    this.legacyIdMapping.clear();
  }

  /**
   * Gets all legacy ID mappings.
   *
   * @returns A new Map containing all legacy ID mappings
   *
   * @see Requirements: 9.1-9.3
   */
  getLegacyIdMappings(): Map<string, string> {
    return new Map(this.legacyIdMapping);
  }

  /**
   * Gets compatible themes for a template based on its compatibility rules.
   *
   * @param template - The template configuration
   * @returns Array of compatible Theme objects
   */
  private getCompatibleThemesForTemplate(template: TemplateConfig): Theme[] {
    return this.themeRegistry.getCompatibleThemes({
      compatibleThemes: template.compatibleThemes,
      excludedThemes: template.excludedThemes,
    });
  }

  /**
   * Checks if a theme is compatible with a template.
   *
   * @param theme - The theme to check
   * @param template - The template configuration
   * @returns true if the theme is compatible with the template
   */
  private isThemeCompatibleWithTemplate(theme: Theme, template: TemplateConfig): boolean {
    // If template specifies compatible themes, check if this theme is in the list
    if (template.compatibleThemes && template.compatibleThemes.length > 0) {
      return template.compatibleThemes
        .map(name => name.toLowerCase())
        .includes(theme.name.toLowerCase());
    }

    // If template specifies excluded themes, check if this theme is NOT in the list
    if (template.excludedThemes && template.excludedThemes.length > 0) {
      return !template.excludedThemes
        .map(name => name.toLowerCase())
        .includes(theme.name.toLowerCase());
    }

    // If neither is specified, all themes are compatible
    return true;
  }

  /**
   * Creates a CompositionConfig for a template, theme, and layout combination.
   *
   * @param template - The template configuration
   * @param theme - The theme to apply
   * @param layout - The layout variant
   * @param usedIds - Set of already-used composition IDs
   * @returns A complete CompositionConfig object
   *
   * @see Requirements: 7.1-7.6, 9.1-9.3
   */
  private createCompositionConfig(
    template: TemplateConfig,
    theme: Theme,
    layout: string,
    usedIds: Set<string>
  ): CompositionConfig {
    // Generate unique composition ID
    const idOptions: CompositionIdOptions = {
      usedIds,
      ensureUnique: true,
      separator: "-",
    };

    const idResult = generateCompositionId(
      {
        templateId: template.id,
        themeName: theme.name,
        layoutName: layout,
      },
      idOptions
    );

    // Create default props
    const defaultProps: CompositionDefaultProps = {
      theme,
      layout,
      spec: template.defaultProps,
    };

    // Use template-specific dimensions/timing, or fall back to defaults
    const width = template.width || this.defaultWidth;
    const height = template.height || this.defaultHeight;
    const fps = template.fps || this.defaultFps;
    const durationInFrames = template.durationInFrames || this.defaultDurationInFrames;

    // Look up legacy ID for backward compatibility
    // @see Requirements: 9.1-9.3
    const legacyId = this.legacyIdMapping.get(idResult.id);

    const config: CompositionConfig = {
      id: idResult.id,
      component: template.component,
      width,
      height,
      fps,
      durationInFrames,
      defaultProps,
      templateId: template.id,
      themeName: theme.name,
      layoutName: layout,
    };

    // Include legacyId only when a mapping exists
    if (legacyId) {
      config.legacyId = legacyId;
    }

    return config;
  }

  /**
   * Exports generated compositions as valid Root.tsx JSX content.
   *
   * Generates a string containing JSX `<Composition>` elements for all
   * generated compositions. The output can be inserted into Root.tsx
   * to register all compositions with Remotion.
   *
   * The generated JSX includes:
   * - Import statements for template components and themes
   * - `<Composition>` elements with all required props
   * - Proper formatting for readability
   *
   * @param options - Optional generation options
   * @returns A string containing valid JSX for Root.tsx
   *
   * @example
   * ```typescript
   * const rootContent = generator.exportToRoot();
   * // Output:
   * // <Composition
   * //   id="Testimonial-Dark-Centered"
   * //   component={TestimonialTemplate}
   * //   durationInFrames={300}
   * //   fps={30}
   * //   width={1920}
   * //   height={1080}
   * //   defaultProps={{
   * //     theme: darkTheme,
   * //     layout: "centered",
   * //     spec: {}
   * //   }}
   * // />
   * ```
   *
   * @see Requirements: 14.1, 14.3
   */
  exportToRoot(options: CompositionGenerationOptions = {}): string {
    const compositions = this.generateCompositions(options);

    if (compositions.length === 0) {
      return "// No compositions generated";
    }

    // Group compositions by template for organized output
    const compositionsByTemplate = new Map<string, CompositionConfig[]>();
    for (const comp of compositions) {
      const existing = compositionsByTemplate.get(comp.templateId) || [];
      existing.push(comp);
      compositionsByTemplate.set(comp.templateId, existing);
    }

    // Generate import statements
    const imports = this.generateImportStatements(compositions);

    // Generate Composition elements
    const compositionElements: string[] = [];

    const templateEntries = Array.from(compositionsByTemplate.entries());
    for (const [templateId, templateComps] of templateEntries) {
      // Add a comment header for each template group
      compositionElements.push(`{/* ${this.toPascalCase(templateId)} Compositions */}`);

      for (const comp of templateComps) {
        compositionElements.push(this.generateCompositionElement(comp));
      }

      compositionElements.push(""); // Empty line between template groups
    }

    // Combine imports and composition elements
    const output = [
      "// Auto-generated composition registrations",
      "// Generated by CompositionGenerator",
      "",
      imports,
      "",
      "// Composition elements for Root.tsx",
      "<>",
      ...compositionElements.map(el => `  ${el}`),
      "</>",
    ];

    return output.join("\n");
  }

  /**
   * Exports generated compositions as a JSON manifest.
   *
   * Generates a JSON string containing metadata for all generated
   * compositions. This manifest is useful for documentation,
   * external tooling, or build-time processing.
   *
   * The manifest includes:
   * - Total composition count
   * - Generation timestamp
   * - Array of composition metadata (id, templateId, themeName, layoutName, dimensions)
   *
   * @param options - Optional generation options
   * @returns A JSON string containing the composition manifest
   *
   * @example
   * ```typescript
   * const manifest = generator.exportToJson();
   * // Output:
   * // {
   * //   "generatedAt": "2024-01-15T10:30:00.000Z",
   * //   "totalCompositions": 42,
   * //   "compositions": [
   * //     {
   * //       "id": "Testimonial-Dark-Centered",
   * //       "templateId": "testimonial",
   * //       "themeName": "dark",
   * //       "layoutName": "centered",
   * //       "width": 1920,
   * //       "height": 1080,
   * //       "fps": 30,
   * //       "durationInFrames": 300
   * //     },
   * //     ...
   * //   ]
   * // }
   * ```
   *
   * @see Requirements: 14.2
   */
  exportToJson(options: CompositionGenerationOptions = {}): string {
    const compositions = this.generateCompositions(options);

    // Create manifest structure
    const manifest = {
      generatedAt: new Date().toISOString(),
      totalCompositions: compositions.length,
      compositions: compositions.map(comp => ({
        id: comp.id,
        legacyId: comp.legacyId,
        templateId: comp.templateId,
        themeName: comp.themeName,
        layoutName: comp.layoutName,
        width: comp.width,
        height: comp.height,
        fps: comp.fps,
        durationInFrames: comp.durationInFrames,
      })),
    };

    return JSON.stringify(manifest, null, 2);
  }

  /**
   * Generates import statements for the compositions.
   *
   * @param compositions - Array of composition configs
   * @returns Import statements as a string
   */
  private generateImportStatements(compositions: CompositionConfig[]): string {
    // Collect unique template IDs and theme names
    const templateIds = new Set<string>();
    const themeNames = new Set<string>();

    for (const comp of compositions) {
      templateIds.add(comp.templateId);
      themeNames.add(comp.themeName);
    }

    const imports: string[] = [
      '// Import Remotion',
      'import { Composition } from "remotion";',
      '',
      '// Import templates (adjust paths as needed)',
    ];

    // Add template imports
    const templateIdArray = Array.from(templateIds);
    for (const templateId of templateIdArray) {
      const pascalName = this.toPascalCase(templateId);
      imports.push(`// import { ${pascalName}Template } from "./templates/${templateId}/${pascalName}";`);
    }

    imports.push('');
    imports.push('// Import themes (adjust paths as needed)');

    // Add theme imports
    const themeNameArray = Array.from(themeNames);
    for (const themeName of themeNameArray) {
      const camelName = this.toCamelCase(themeName);
      imports.push(`// import { ${camelName}Theme } from "./themes/presets";`);
    }

    return imports.join("\n");
  }

  /**
   * Generates a single Composition JSX element.
   *
   * @param comp - The composition config
   * @returns JSX string for the Composition element
   */
  private generateCompositionElement(comp: CompositionConfig): string {
    const themeCamelCase = this.toCamelCase(comp.themeName);
    const templatePascalCase = this.toPascalCase(comp.templateId);

    // Build the defaultProps object as a string
    const defaultPropsStr = [
      "{",
      `    theme: ${themeCamelCase}Theme,`,
      `    layout: "${comp.layoutName}",`,
      "    spec: {}",
      "  }",
    ].join("\n");

    const lines = [
      "<Composition",
      `  id="${comp.id}"`,
    ];

    // Include legacyId as a comment if it exists
    if (comp.legacyId) {
      lines.push(`  // legacyId: "${comp.legacyId}"`);
    }

    lines.push(
      `  component={${templatePascalCase}Template}`,
      `  durationInFrames={${comp.durationInFrames}}`,
      `  fps={${comp.fps}}`,
      `  width={${comp.width}}`,
      `  height={${comp.height}}`,
      `  defaultProps={${defaultPropsStr}}`,
      "/>"
    );

    return lines.join("\n  ");
  }

  /**
   * Converts a string to PascalCase.
   *
   * @param str - The string to convert
   * @returns The string in PascalCase
   */
  private toPascalCase(str: string): string {
    return str
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("");
  }

  /**
   * Converts a string to camelCase.
   *
   * @param str - The string to convert
   * @returns The string in camelCase
   */
  private toCamelCase(str: string): string {
    const pascal = this.toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
  }

  /**
   * Generates compositions with detailed result metadata.
   *
   * Similar to generateCompositions but returns additional metadata
   * about the generation process including counts and warnings.
   *
   * @param options - Optional generation options
   * @returns CompositionGenerationResult with compositions and metadata
   *
   * @see Requirements: 7.1-7.6, 16.1-16.3
   */
  generateWithMetadata(options: CompositionGenerationOptions = {}): CompositionGenerationResult {
    const {
      skipOrphaned = true,
      templateFilter,
      themeFilter,
    } = options;

    const compositions: CompositionConfig[] = [];
    const usedIds = new Set<string>();
    const orphanedTemplates: string[] = [];
    const warnings: string[] = [];
    let templatesProcessed = 0;
    let templatesSkipped = 0;
    const themesUsedSet = new Set<string>();

    // Get all templates, optionally filtered
    let templates = this.templateRegistry.getAllTemplates();
    if (templateFilter && templateFilter.length > 0) {
      const filterSet = new Set(templateFilter.map(id => id.toLowerCase()));
      templates = templates.filter(t => filterSet.has(t.id.toLowerCase()));
    }

    // Iterate through all templates
    for (const template of templates) {
      // Handle orphaned templates
      if (!template.hasImplementation) {
        orphanedTemplates.push(template.id);
        if (skipOrphaned) {
          templatesSkipped++;
          warnings.push(`Skipped orphaned template: ${template.id}`);
          continue;
        }
      }

      templatesProcessed++;

      // Get compatible themes for this template
      let themes = this.getCompatibleThemesForTemplate(template);
      
      // Apply theme filter if specified
      if (themeFilter && themeFilter.length > 0) {
        const filterSet = new Set(themeFilter.map(name => name.toLowerCase()));
        themes = themes.filter(t => filterSet.has(t.name.toLowerCase()));
      }

      // Generate compositions for each theme × layout combination
      for (const theme of themes) {
        themesUsedSet.add(theme.name);
        for (const layout of template.layouts) {
          const config = this.createCompositionConfig(template, theme, layout, usedIds);
          usedIds.add(config.id);
          compositions.push(config);
        }
      }
    }

    return {
      compositions,
      templatesProcessed,
      templatesSkipped,
      themesUsed: themesUsedSet.size,
      orphanedTemplates,
      warnings,
    };
  }
}
