/**
 * Theme Framework Type Definitions - Barrel Export
 *
 * Central entry point for all type definitions in the theme framework.
 * This module re-exports all interfaces, types, and utility functions
 * from the individual type definition files.
 *
 * @module themes/types
 * @see Requirements: 1.1, 4.1, 7.1, 11.1
 */

// ═══════════════════════════════════════════════════════════════════════════
// Theme Types
// ═══════════════════════════════════════════════════════════════════════════

export type {
  Theme,
  ThemeCategory,
  ThemePreset,
  DerivedColors,
  TextColors,
  ThemeConfig,
  ThemeValidationResult,
  ThemeValidationError,
} from "./theme";

// ═══════════════════════════════════════════════════════════════════════════
// Template Types
// ═══════════════════════════════════════════════════════════════════════════

export type {
  TemplateProps,
  TemplateConfig,
  ValidFps,
  ValidationResult,
  ValidationError,
  ValidationErrorCode,
} from "./template";

export {
  KEBAB_CASE_REGEX,
  VALID_FPS_VALUES,
  isValidFps,
  isValidKebabCase,
  validateTemplateConfig,
} from "./template";

// ═══════════════════════════════════════════════════════════════════════════
// Composition Types
// ═══════════════════════════════════════════════════════════════════════════

export type {
  CompositionConfig,
  CompositionDefaultProps,
  CompositionProps,
  CompositionIdComponents,
  CompositionIdResult,
  CompositionIdOptions,
  CompositionGenerationOptions,
  CompositionGenerationResult,
} from "./composition";

export {
  toPascalCase,
  generateCompositionId,
  parseCompositionId,
  isValidCompositionId,
} from "./composition";

// ═══════════════════════════════════════════════════════════════════════════
// BrandKit Types
// ═══════════════════════════════════════════════════════════════════════════

export type {
  BrandKit,
  BrandKitValidationResult,
  BrandKitValidationError,
} from "./brandkit";
