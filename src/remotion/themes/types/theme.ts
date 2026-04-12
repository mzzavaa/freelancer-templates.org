/**
 * Theme Type Definitions
 *
 * Core type definitions for the configuration-based theme framework.
 * These types define the structure of themes, theme categories, and
 * helper types for color derivation.
 *
 * @module themes/types/theme
 * @see Requirements: 1.1, 1.6, 2.1-2.7
 */

/**
 * Theme category classification.
 *
 * Categories help organize themes by their visual style and origin:
 * - "original": Core themes shipped with the framework (dark, clean, bold, etc.)
 * - "extended": Additional themes extending the original set (ocean, sunset, forest, etc.)
 * - "european": Corporate/professional themes with European design influence
 * - "flat": Material Design and flat design inspired themes
 * - "canva": Simple, Canva-style designs with clean aesthetics
 * - "custom": User-created themes via BrandKit or manual configuration
 *
 * @see Requirements: 1.1, 3.1
 */
export type ThemeCategory =
  | "original"
  | "extended"
  | "european"
  | "flat"
  | "canva"
  | "custom";

/**
 * Complete theme definition interface.
 *
 * A Theme represents a complete visual identity including backgrounds,
 * text colors, accent colors, card styles, and typography settings.
 * All templates that accept a Theme will automatically support any
 * theme conforming to this interface.
 *
 * Validation Rules:
 * - All color values must be valid CSS colors (hex, rgb, rgba, hsl)
 * - `bg` can be a color or CSS gradient string
 * - `borderRadius` must be non-negative
 * - `headingWeight` and `bodyWeight` must be valid font weights (100-900)
 * - `fontFamily` must be a valid CSS font-family string
 *
 * @see Requirements: 1.1, 1.2, 2.1-2.7
 */
export interface Theme {
  // ── Identity ──────────────────────────────────────────────────────
  /**
   * Unique theme name identifier.
   * Used for lookup in ThemeRegistry and composition ID generation.
   * Should be lowercase, e.g., "dark", "ocean", "corporate".
   */
  name: string;

  /**
   * Theme category for filtering and organization.
   */
  category: ThemeCategory;

  // ── Backgrounds ───────────────────────────────────────────────────
  /**
   * Main background color or gradient.
   * Can be a solid color (hex, rgb, hsl) or CSS gradient string.
   * @example "#0a0a0f"
   * @example "linear-gradient(180deg, #1a1520 0%, #1e1215 100%)"
   */
  bg: string;

  /**
   * Secondary background for cards and panels.
   * Typically a subtle variation of the main background.
   * @example "rgba(255,255,255,0.04)"
   */
  bgSecondary: string;

  /**
   * Glassmorphism background with alpha transparency.
   * Used for frosted glass effects on overlays and cards.
   * @example "rgba(255,255,255,0.06)"
   */
  bgGlass: string;

  // ── Text Colors ───────────────────────────────────────────────────
  /**
   * Primary text color for headings and important content.
   * Should have high contrast against the background.
   * @example "#ffffff"
   */
  textPrimary: string;

  /**
   * Secondary text color for body text and descriptions.
   * Slightly lower contrast than primary.
   * @example "#94a3b8"
   */
  textSecondary: string;

  /**
   * Muted text color for captions, timestamps, and metadata.
   * Lowest contrast text, used sparingly.
   * @example "#64748b"
   */
  textMuted: string;

  // ── Accent Colors ─────────────────────────────────────────────────
  /**
   * Primary accent color for buttons, highlights, and interactive elements.
   * The main brand color that draws attention.
   * @example "#6366f1"
   */
  accent: string;

  /**
   * Secondary accent for gradients, borders, and complementary highlights.
   * Often used as the end color in gradients.
   * @example "#a855f7"
   */
  accentSecondary: string;

  /**
   * CSS gradient string for badges, CTAs, and decorative elements.
   * Combines accent and accentSecondary for visual interest.
   * @example "linear-gradient(135deg, #6366f1, #ec4899)"
   */
  accentGradient: string;

  // ── Card Styles ───────────────────────────────────────────────────
  /**
   * Card border color, typically accent with reduced opacity.
   * @example "rgba(99,102,241,0.25)"
   */
  cardBorder: string;

  /**
   * Card shadow for depth and elevation.
   * Can be "none" for flat designs.
   * @example "0 4px 24px rgba(0,0,0,0.3)"
   */
  cardShadow: string;

  /**
   * Border radius for cards and elements.
   * Use 0 for flat/edge designs, 12+ for rounded modern look.
   * Must be non-negative.
   */
  borderRadius: number;

  // ── Typography ────────────────────────────────────────────────────
  /**
   * CSS font-family string for all text.
   * @example "'Inter', sans-serif"
   */
  fontFamily: string;

  /**
   * Font weight for headings (100-900).
   * Higher values create bolder, more impactful headings.
   */
  headingWeight: number;

  /**
   * Font weight for body text (100-900).
   * Typically 400 (normal) or 500 (medium).
   */
  bodyWeight: number;
}

/**
 * Theme preset for bulk registration.
 *
 * A ThemePreset is a collection of themes that can be registered
 * together with the ThemeRegistry. This enables organizing themes
 * by category or source.
 *
 * @see Requirements: 1.7
 */
export interface ThemePreset {
  /**
   * Preset name for identification.
   * @example "original", "extended", "european"
   */
  name: string;

  /**
   * Category applied to all themes in this preset.
   */
  category: ThemeCategory;

  /**
   * Collection of themes in this preset.
   * Keys are theme names, values are theme definitions.
   */
  themes: Record<string, Theme>;
}

/**
 * Derived colors from a primary color.
 *
 * Used by ThemeFactory to automatically generate complementary
 * colors from a single primary color input.
 *
 * @see Requirements: 12.1-12.7
 */
export interface DerivedColors {
  /**
   * Derived secondary background color.
   * Shifted from the primary background for visual hierarchy.
   */
  bgSecondary: string;

  /**
   * Derived glassmorphism background with alpha.
   */
  bgGlass: string;

  /**
   * Derived card border color.
   * Typically the accent color at reduced opacity.
   */
  cardBorder: string;

  /**
   * Derived card shadow appropriate for light/dark backgrounds.
   */
  cardShadow: string;
}

/**
 * Derived text colors from a primary text color.
 *
 * Used by ThemeFactory to automatically generate secondary
 * and muted text colors from a single primary text color.
 *
 * @see Requirements: 12.4, 12.5
 */
export interface TextColors {
  /**
   * Primary text color (passed through).
   */
  textPrimary: string;

  /**
   * Secondary text at 70% opacity of primary.
   */
  textSecondary: string;

  /**
   * Muted text at 45% opacity of primary.
   */
  textMuted: string;
}

/**
 * Partial theme configuration for theme creation.
 *
 * Used when creating themes with ThemeFactory, allowing
 * optional fields that will be derived automatically.
 */
export type ThemeConfig = Partial<Theme> & {
  name: string;
  category?: ThemeCategory;
};

/**
 * Theme validation result.
 *
 * Returned by validation functions to indicate success or
 * provide detailed error information.
 */
export interface ThemeValidationResult {
  /**
   * Whether the theme is valid.
   */
  valid: boolean;

  /**
   * Array of validation errors, empty if valid.
   */
  errors: ThemeValidationError[];
}

/**
 * Individual theme validation error.
 */
export interface ThemeValidationError {
  /**
   * The field that failed validation.
   */
  field: keyof Theme | string;

  /**
   * Human-readable error message.
   */
  message: string;

  /**
   * The invalid value that was provided.
   */
  value?: unknown;
}
