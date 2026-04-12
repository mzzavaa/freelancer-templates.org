/**
 * Template Type Definitions
 *
 * Core type definitions for template configuration and registration.
 * These types define the structure of template configs, validation results,
 * and the base props interface that all templates will extend.
 *
 * @module themes/types/template
 * @see Requirements: 4.1-4.5, 5.1-5.7
 */

import type { ComponentType } from "react";
import type { Theme } from "./theme";
import type { BrandKit } from "./brandkit";

/**
 * Base props interface that all templates must extend.
 *
 * This interface defines the common props that every theme-aware
 * template component must accept. Templates can extend this with
 * their own specific props.
 *
 * @see Requirements: 1.1, 11.1
 */
export interface TemplateProps {
  /**
   * The theme to apply to the template.
   * Contains all color, typography, and styling information.
   */
  theme: Theme;

  /**
   * The layout variant to render.
   * Must be one of the layouts defined in the template's config.
   * @example "centered", "split", "editorial"
   */
  layout: string;

  /**
   * The specification data for the template.
   * Contains content-specific data like text, images, etc.
   */
  spec: Record<string, unknown>;

  /**
   * Optional brand kit for custom color overrides.
   * When provided, the template may apply brand-specific styling.
   */
  brandKit?: BrandKit;
}

/**
 * Template configuration interface.
 *
 * A TemplateConfig represents complete metadata about a template,
 * including its identity, component reference, layout variants,
 * dimensions, theme compatibility, and sample data.
 *
 * Validation Rules:
 * - `id` must be lowercase kebab-case
 * - `layouts` must have at least one entry
 * - `defaultLayout` must be present in the `layouts` array
 * - `width` and `height` must be positive integers
 * - `fps` must be one of 24, 25, 30, or 60
 * - `durationInFrames` must be a positive integer
 *
 * @see Requirements: 4.1-4.5, 5.1-5.7
 */
export interface TemplateConfig {
  // ── Identity ──────────────────────────────────────────────────────
  /**
   * Unique template identifier in lowercase kebab-case.
   * Used for lookup in TemplateRegistry and composition ID generation.
   * @example "testimonial", "case-study", "game-day-intro"
   */
  id: string;

  /**
   * Human-readable template name.
   * Used for display in UI and documentation.
   * @example "Testimonial", "Case Study", "GameDay Intro"
   */
  name: string;

  /**
   * Brief description of the template's purpose.
   * @example "Customer testimonial with quote and attribution"
   */
  description: string;

  // ── Component Reference ───────────────────────────────────────────
  /**
   * React component that renders this template.
   * Must accept TemplateProps (or an extension of it).
   */
  component: ComponentType<TemplateProps>;

  // ── Variants ──────────────────────────────────────────────────────
  /**
   * Available layout variants for this template.
   * Must contain at least one entry.
   * @example ["centered", "split", "editorial"]
   */
  layouts: string[];

  /**
   * Default layout to use when none is specified.
   * Must be present in the `layouts` array.
   */
  defaultLayout: string;

  // ── Dimensions ────────────────────────────────────────────────────
  /**
   * Video width in pixels.
   * Must be a positive integer.
   */
  width: number;

  /**
   * Video height in pixels.
   * Must be a positive integer.
   */
  height: number;

  /**
   * Frames per second.
   * Must be one of: 24, 25, 30, or 60.
   */
  fps: ValidFps;

  /**
   * Total duration in frames.
   * Must be a positive integer.
   */
  durationInFrames: number;

  // ── Theme Compatibility ───────────────────────────────────────────
  /**
   * List of theme names this template is compatible with.
   * If undefined, the template is compatible with all themes.
   * Takes precedence over `excludedThemes`.
   */
  compatibleThemes?: string[];

  /**
   * List of theme names to exclude from compatibility.
   * Only used when `compatibleThemes` is undefined.
   */
  excludedThemes?: string[];

  // ── Sample Data ───────────────────────────────────────────────────
  /**
   * Default props to use when no spec is provided.
   * Used for preview and testing purposes.
   */
  defaultProps: Record<string, unknown>;

  /**
   * Sample specifications for demonstration.
   * Array of example data that can be used to showcase the template.
   */
  sampleSpecs: Record<string, unknown>[];

  // ── Metadata ──────────────────────────────────────────────────────
  /**
   * Icon identifier for UI display.
   * Can be an emoji, icon name, or path.
   * @example "💬", "testimonial", "/icons/testimonial.svg"
   */
  icon: string;

  /**
   * Color associated with this template for UI display.
   * Should be a valid CSS color.
   * @example "#6366f1"
   */
  color: string;

  /**
   * Category for organizing templates.
   * @example "social", "marketing", "gameday", "presentation"
   */
  category: string;

  /**
   * Whether this template has a Remotion component implementation.
   * Set to `false` for orphaned templates (exist in data but no component).
   * @see Requirements: 6.1-6.3
   */
  hasImplementation: boolean;
}

/**
 * Valid FPS values for video compositions.
 *
 * Remotion supports these standard frame rates:
 * - 24: Film standard
 * - 25: PAL broadcast standard
 * - 30: NTSC broadcast standard
 * - 60: High frame rate for smooth motion
 *
 * @see Requirements: 5.5
 */
export type ValidFps = 24 | 25 | 30 | 60;

/**
 * Validation result for template configuration.
 *
 * Returned by TemplateRegistry.validateTemplate() to indicate
 * whether a template config is valid and provide detailed errors.
 *
 * @see Requirements: 5.7
 */
export interface ValidationResult {
  /**
   * Whether the template configuration is valid.
   */
  valid: boolean;

  /**
   * Array of validation errors, empty if valid.
   */
  errors: ValidationError[];
}

/**
 * Individual validation error.
 *
 * Provides detailed information about a specific validation failure.
 */
export interface ValidationError {
  /**
   * The field that failed validation.
   */
  field: keyof TemplateConfig | string;

  /**
   * Human-readable error message describing the issue.
   */
  message: string;

  /**
   * The invalid value that was provided (if applicable).
   */
  value?: unknown;

  /**
   * Error code for programmatic handling.
   */
  code?: ValidationErrorCode;
}

/**
 * Validation error codes for programmatic handling.
 *
 * These codes allow consumers to handle specific validation
 * errors programmatically without parsing error messages.
 */
export type ValidationErrorCode =
  | "INVALID_ID_FORMAT"
  | "EMPTY_LAYOUTS"
  | "INVALID_DEFAULT_LAYOUT"
  | "INVALID_WIDTH"
  | "INVALID_HEIGHT"
  | "INVALID_FPS"
  | "INVALID_DURATION"
  | "MISSING_REQUIRED_FIELD"
  | "INVALID_TYPE";

/**
 * Regular expression for validating kebab-case template IDs.
 *
 * Valid IDs:
 * - Must start with a lowercase letter
 * - Can contain lowercase letters, numbers, and hyphens
 * - Cannot start or end with a hyphen
 * - Cannot have consecutive hyphens
 *
 * @example "testimonial" ✓
 * @example "case-study" ✓
 * @example "game-day-intro" ✓
 * @example "CaseStudy" ✗ (uppercase)
 * @example "-testimonial" ✗ (starts with hyphen)
 * @example "case--study" ✗ (consecutive hyphens)
 */
export const KEBAB_CASE_REGEX = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

/**
 * Valid FPS values as an array for validation.
 */
export const VALID_FPS_VALUES: readonly ValidFps[] = [24, 25, 30, 60] as const;

/**
 * Type guard to check if a value is a valid FPS.
 *
 * @param value - The value to check
 * @returns True if the value is a valid FPS (24, 25, 30, or 60)
 */
export function isValidFps(value: unknown): value is ValidFps {
  return (
    typeof value === "number" &&
    VALID_FPS_VALUES.includes(value as ValidFps)
  );
}

/**
 * Type guard to check if a string is valid kebab-case.
 *
 * @param value - The string to check
 * @returns True if the string is valid lowercase kebab-case
 */
export function isValidKebabCase(value: string): boolean {
  return KEBAB_CASE_REGEX.test(value);
}

/**
 * Validates a template configuration and returns detailed errors.
 *
 * This function performs comprehensive validation of a TemplateConfig
 * object, checking all required fields and validation rules.
 *
 * @param config - The template configuration to validate
 * @returns ValidationResult with valid flag and any errors
 *
 * @see Requirements: 5.1-5.7
 */
export function validateTemplateConfig(
  config: Partial<TemplateConfig>
): ValidationResult {
  const errors: ValidationError[] = [];

  // Check required fields
  if (!config.id) {
    errors.push({
      field: "id",
      message: "Template id is required",
      code: "MISSING_REQUIRED_FIELD",
    });
  } else if (!isValidKebabCase(config.id)) {
    errors.push({
      field: "id",
      message: "Template id must be lowercase kebab-case (e.g., 'my-template')",
      value: config.id,
      code: "INVALID_ID_FORMAT",
    });
  }

  if (!config.name) {
    errors.push({
      field: "name",
      message: "Template name is required",
      code: "MISSING_REQUIRED_FIELD",
    });
  }

  if (!config.component) {
    errors.push({
      field: "component",
      message: "Template component is required",
      code: "MISSING_REQUIRED_FIELD",
    });
  }

  // Validate layouts
  if (!config.layouts || !Array.isArray(config.layouts)) {
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

  // Validate defaultLayout
  if (!config.defaultLayout) {
    errors.push({
      field: "defaultLayout",
      message: "Default layout is required",
      code: "MISSING_REQUIRED_FIELD",
    });
  } else if (
    config.layouts &&
    Array.isArray(config.layouts) &&
    !config.layouts.includes(config.defaultLayout)
  ) {
    errors.push({
      field: "defaultLayout",
      message: `Default layout '${config.defaultLayout}' must be present in layouts array`,
      value: config.defaultLayout,
      code: "INVALID_DEFAULT_LAYOUT",
    });
  }

  // Validate dimensions
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

  // Validate fps
  if (config.fps === undefined || config.fps === null) {
    errors.push({
      field: "fps",
      message: "FPS is required",
      code: "MISSING_REQUIRED_FIELD",
    });
  } else if (!isValidFps(config.fps)) {
    errors.push({
      field: "fps",
      message: "FPS must be one of: 24, 25, 30, or 60",
      value: config.fps,
      code: "INVALID_FPS",
    });
  }

  // Validate durationInFrames
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
