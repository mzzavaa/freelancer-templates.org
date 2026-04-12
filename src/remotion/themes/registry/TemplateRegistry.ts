/**
 * TemplateRegistry - Central registry for template configurations
 *
 * Provides storage, retrieval, and management of template configurations.
 * Templates are stored with their metadata including layouts, dimensions,
 * theme compatibility rules, and implementation status.
 *
 * @module themes/registry/TemplateRegistry
 * @see Requirements: 4.1-4.5, 5.1-5.7, 6.1-6.3
 */

import type {
  TemplateConfig,
  ValidationResult,
  ValidationError,
} from "../types";
import {
  isValidKebabCase,
  isValidFps,
  VALID_FPS_VALUES,
} from "../types";
import { TemplateValidationError } from "../errors";

/**
 * Central registry for all template configurations.
 *
 * The TemplateRegistry provides:
 * - Storage and retrieval of templates by ID
 * - Iteration over all registered templates
 * - Filtering by category
 * - Orphaned template detection (templates without implementations)
 * - Template validation on registration
 *
 * Templates are stored by their lowercase ID for case-insensitive lookup.
 *
 * @example
 * ```typescript
 * const registry = new TemplateRegistry();
 * registry.registerTemplate(testimonialConfig);
 *
 * const template = registry.getTemplate("testimonial");
 * const allTemplates = registry.getAllTemplates();
 * const orphans = registry.getOrphanedTemplates();
 * ```
 *
 * @see Requirements: 4.1-4.5, 5.1-5.7, 6.1-6.3
 */
export class TemplateRegistry {
  /**
   * Internal storage for templates.
   * Uses Map for O(1) lookup by ID.
   * Template IDs are stored in lowercase for case-insensitive lookup.
   */
  private readonly templates: Map<string, TemplateConfig> = new Map();

  /**
   * Retrieves a template by ID.
   *
   * Performs case-insensitive lookup by converting the ID to lowercase.
   * Returns the exact template config that was registered.
   *
   * @param id - The template ID to look up (case-insensitive)
   * @returns The TemplateConfig if found, undefined otherwise
   *
   * @precondition id is a non-empty string
   * @postcondition Returns TemplateConfig if template with matching ID exists
   * @postcondition Returns undefined if no matching template found
   *
   * @example
   * ```typescript
   * const template = registry.getTemplate("testimonial");
   * if (template) {
   *   console.log(template.layouts); // Use template properties
   * }
   * ```
   *
   * @see Requirements: 4.1, 4.2, 4.3
   */
  getTemplate(id: string): TemplateConfig | undefined {
    if (!id || typeof id !== "string") {
      return undefined;
    }
    return this.templates.get(id.toLowerCase());
  }

  /**
   * Retrieves all registered templates as an array.
   *
   * Returns a new array containing all template configs.
   * The array is a new copy, so modifying it doesn't affect the registry.
   *
   * @returns Array of all registered TemplateConfig objects
   *
   * @postcondition Returns array of all registered templates
   * @postcondition Array is a new copy (modifying it doesn't affect registry)
   *
   * @example
   * ```typescript
   * const templates = registry.getAllTemplates();
   * templates.forEach(t => console.log(t.name));
   * ```
   *
   * @see Requirements: 4.4
   */
  getAllTemplates(): TemplateConfig[] {
    return Array.from(this.templates.values());
  }

  /**
   * Registers a template configuration.
   *
   * Validates the template config and stores it in the registry.
   * The ID is converted to lowercase for case-insensitive lookup.
   *
   * @param config - The template configuration to register
   * @throws {TemplateValidationError} If the template config fails validation
   *
   * @precondition config is a valid TemplateConfig object
   * @postcondition Template is stored in registry with lowercase ID
   *
   * @example
   * ```typescript
   * registry.registerTemplate({
   *   id: "testimonial",
   *   name: "Testimonial",
   *   // ... other required fields
   * });
   * ```
   *
   * @see Requirements: 5.1-5.7
   */
  registerTemplate(config: TemplateConfig): void {
    const validation = this.validateTemplate(config);
    if (!validation.valid) {
      throw new TemplateValidationError(
        `Invalid template configuration for '${config.id || "unknown"}'`,
        validation.errors.map(e => ({
          field: String(e.field),
          message: e.message,
          value: e.value,
        })),
        config.id
      );
    }

    const normalizedId = config.id.toLowerCase();
    this.templates.set(normalizedId, { ...config, id: normalizedId });
  }

  /**
   * Validates a template configuration.
   *
   * Performs comprehensive validation of a TemplateConfig object,
   * checking all required fields and validation rules:
   * - `id` must be lowercase kebab-case
   * - `layouts` array must have at least one entry
   * - `defaultLayout` must be present in the `layouts` array
   * - `width` and `height` must be positive integers
   * - `fps` must be one of 24, 25, 30, or 60
   * - `durationInFrames` must be a positive integer
   *
   * @param config - The template configuration to validate
   * @returns ValidationResult with valid flag and any errors
   *
   * @see Requirements: 5.1-5.7
   */
  validateTemplate(config: TemplateConfig): ValidationResult {
    const errors: ValidationError[] = [];

    // Requirement 5.1: Validate id is lowercase kebab-case
    if (!config.id) {
      errors.push({
        field: "id",
        message: "Template id is required",
        code: "MISSING_REQUIRED_FIELD",
      });
    } else if (typeof config.id !== "string") {
      errors.push({
        field: "id",
        message: "Template id must be a string",
        value: config.id,
        code: "INVALID_TYPE",
      });
    } else if (!isValidKebabCase(config.id)) {
      errors.push({
        field: "id",
        message: "Template id must be lowercase kebab-case (e.g., 'my-template')",
        value: config.id,
        code: "INVALID_ID_FORMAT",
      });
    }

    // Validate name is present
    if (!config.name) {
      errors.push({
        field: "name",
        message: "Template name is required",
        code: "MISSING_REQUIRED_FIELD",
      });
    }

    // Validate component is present
    if (!config.component) {
      errors.push({
        field: "component",
        message: "Template component is required",
        code: "MISSING_REQUIRED_FIELD",
      });
    }

    // Requirement 5.2: Validate layouts array has at least one entry
    if (!config.layouts) {
      errors.push({
        field: "layouts",
        message: "Layouts array is required",
        code: "MISSING_REQUIRED_FIELD",
      });
    } else if (!Array.isArray(config.layouts)) {
      errors.push({
        field: "layouts",
        message: "Layouts must be an array",
        value: config.layouts,
        code: "INVALID_TYPE",
      });
    } else if (config.layouts.length === 0) {
      errors.push({
        field: "layouts",
        message: "Layouts array must have at least one entry",
        value: config.layouts,
        code: "EMPTY_LAYOUTS",
      });
    }

    // Requirement 5.3: Validate defaultLayout is present in layouts array
    if (!config.defaultLayout) {
      errors.push({
        field: "defaultLayout",
        message: "Default layout is required",
        code: "MISSING_REQUIRED_FIELD",
      });
    } else if (
      config.layouts &&
      Array.isArray(config.layouts) &&
      config.layouts.length > 0 &&
      !config.layouts.includes(config.defaultLayout)
    ) {
      errors.push({
        field: "defaultLayout",
        message: `Default layout '${config.defaultLayout}' must be present in layouts array`,
        value: config.defaultLayout,
        code: "INVALID_DEFAULT_LAYOUT",
      });
    }

    // Requirement 5.4: Validate width and height are positive integers
    if (config.width === undefined || config.width === null) {
      errors.push({
        field: "width",
        message: "Width is required",
        code: "MISSING_REQUIRED_FIELD",
      });
    } else if (!Number.isInteger(config.width) || config.width <= 0) {
      errors.push({
        field: "width",
        message: "Width must be a positive integer",
        value: config.width,
        code: "INVALID_WIDTH",
      });
    }

    if (config.height === undefined || config.height === null) {
      errors.push({
        field: "height",
        message: "Height is required",
        code: "MISSING_REQUIRED_FIELD",
      });
    } else if (!Number.isInteger(config.height) || config.height <= 0) {
      errors.push({
        field: "height",
        message: "Height must be a positive integer",
        value: config.height,
        code: "INVALID_HEIGHT",
      });
    }

    // Requirement 5.5: Validate fps is one of 24, 25, 30, or 60
    if (config.fps === undefined || config.fps === null) {
      errors.push({
        field: "fps",
        message: "FPS is required",
        code: "MISSING_REQUIRED_FIELD",
      });
    } else if (!isValidFps(config.fps)) {
      errors.push({
        field: "fps",
        message: `FPS must be one of: ${VALID_FPS_VALUES.join(", ")}`,
        value: config.fps,
        code: "INVALID_FPS",
      });
    }

    // Requirement 5.6: Validate durationInFrames is positive
    if (config.durationInFrames === undefined || config.durationInFrames === null) {
      errors.push({
        field: "durationInFrames",
        message: "Duration in frames is required",
        code: "MISSING_REQUIRED_FIELD",
      });
    } else if (
      !Number.isInteger(config.durationInFrames) ||
      config.durationInFrames <= 0
    ) {
      errors.push({
        field: "durationInFrames",
        message: "Duration in frames must be a positive integer",
        value: config.durationInFrames,
        code: "INVALID_DURATION",
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Retrieves templates filtered by category.
   *
   * Returns all templates that match the specified category.
   *
   * @param category - The category to filter by
   * @returns Array of TemplateConfig objects matching the category
   *
   * @postcondition Returns array of templates where template.category === category
   * @postcondition Array is a new copy (modifying it doesn't affect registry)
   *
   * @example
   * ```typescript
   * const socialTemplates = registry.getTemplatesByCategory("social");
   * console.log(`Found ${socialTemplates.length} social templates`);
   * ```
   *
   * @see Requirements: 4.5
   */
  getTemplatesByCategory(category: string): TemplateConfig[] {
    // Placeholder - full implementation in task 4.3
    return this.getAllTemplates().filter(
      (template) => template.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Retrieves all orphaned templates.
   *
   * Orphaned templates are those that exist in data files but lack
   * Remotion component implementations (hasImplementation === false).
   *
   * @returns Array of TemplateConfig objects where hasImplementation is false
   *
   * @postcondition Returns templates where hasImplementation === false
   * @postcondition Array is sorted by template ID
   *
   * @example
   * ```typescript
   * const orphans = registry.getOrphanedTemplates();
   * console.log(`Found ${orphans.length} orphaned templates`);
   * orphans.forEach(t => console.log(`- ${t.id}: ${t.name}`));
   * ```
   *
   * @see Requirements: 6.1-6.3
   */
  getOrphanedTemplates(): TemplateConfig[] {
    // Placeholder - full implementation in task 4.3
    return this.getAllTemplates()
      .filter((template) => !template.hasImplementation)
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  /**
   * Returns the number of registered templates.
   *
   * Useful for testing and debugging.
   *
   * @returns The count of registered templates
   */
  get size(): number {
    return this.templates.size;
  }

  /**
   * Checks if a template with the given ID is registered.
   *
   * @param id - The template ID to check (case-insensitive)
   * @returns true if the template exists, false otherwise
   */
  hasTemplate(id: string): boolean {
    if (!id || typeof id !== "string") {
      return false;
    }
    return this.templates.has(id.toLowerCase());
  }

  /**
   * Clears all registered templates.
   *
   * Primarily useful for testing.
   */
  clear(): void {
    this.templates.clear();
  }
}
