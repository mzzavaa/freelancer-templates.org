/**
 * Theme Framework - Main Entry Point
 *
 * Central barrel export for the configuration-based theme framework.
 * This module provides a single entry point for all theme framework
 * functionality including:
 *
 * - **ThemeRegistry**: Central registry for theme definitions
 * - **TemplateRegistry**: Central registry for template configurations
 * - **CompositionGenerator**: Dynamic composition configuration generator
 * - **ThemeFactory**: Theme creation and preset management
 * - **Types**: All interfaces and type definitions
 * - **Presets**: Built-in theme presets (dark, bold, ocean, etc.)
 * - **Errors**: Custom error classes for validation failures
 *
 * @module themes
 * @see Requirements: 1.1, 4.1, 7.1, 10.1, 11.1
 *
 * @example
 * ```typescript
 * import {
 *   ThemeRegistry,
 *   TemplateRegistry,
 *   CompositionGenerator,
 *   ThemeFactory,
 *   THEME_DARK,
 *   THEME_PRESETS,
 * } from "./themes";
 *
 * // Create registries
 * const themeRegistry = new ThemeRegistry();
 * const templateRegistry = new TemplateRegistry();
 *
 * // Register themes
 * Object.entries(THEME_PRESETS).forEach(([name, theme]) => {
 *   themeRegistry.registerTheme(name, theme);
 * });
 *
 * // Generate compositions
 * const generator = new CompositionGenerator(templateRegistry, themeRegistry);
 * const compositions = generator.generateCompositions();
 * ```
 */

// ═══════════════════════════════════════════════════════════════════════════
// Registry Classes
// ═══════════════════════════════════════════════════════════════════════════

export { ThemeRegistry } from "./registry/ThemeRegistry";
export type { TemplateCompatibilityConfig } from "./registry/ThemeRegistry";

export { TemplateRegistry } from "./registry/TemplateRegistry";

// ═══════════════════════════════════════════════════════════════════════════
// Generator Classes
// ═══════════════════════════════════════════════════════════════════════════

export { CompositionGenerator } from "./generator/CompositionGenerator";

// ═══════════════════════════════════════════════════════════════════════════
// Factory Classes
// ═══════════════════════════════════════════════════════════════════════════

export {
  ThemeFactory,
  hexToRgb,
  calculateLuminance,
  shiftColor,
} from "./factory/ThemeFactory";

// ═══════════════════════════════════════════════════════════════════════════
// Types and Interfaces
// ═══════════════════════════════════════════════════════════════════════════

export * from "./types";

// ═══════════════════════════════════════════════════════════════════════════
// Theme Presets
// ═══════════════════════════════════════════════════════════════════════════

export * from "./presets";

// ═══════════════════════════════════════════════════════════════════════════
// Error Classes
// ═══════════════════════════════════════════════════════════════════════════

export {
  ThemeValidationError,
  BrandKitValidationError,
  TemplateValidationError,
} from "./errors";
