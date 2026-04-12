/**
 * BrandKit Type Definitions
 *
 * Type definitions for custom brand color and typography overrides.
 * BrandKit allows applying custom branding to base themes, particularly
 * useful for GameDay templates with event-specific colors.
 *
 * @module themes/types/brandkit
 * @see Requirements: 11.1-11.8, 13.1-13.3
 */

/**
 * BrandKit interface for custom brand overrides.
 *
 * A BrandKit represents custom brand colors and typography that can
 * be applied to a base theme. All fields are optional - only provided
 * fields will override the base theme values.
 *
 * Validation Rules:
 * - All color fields must be valid hex colors (#RRGGBB or #RGB)
 * - `logoUrl` must be a valid URL or relative path
 * - `fontFamily` must be a valid CSS font-family string
 *
 * @see Requirements: 11.1-11.8
 */
export interface BrandKit {
  // ── Logo ──────────────────────────────────────────────────────────
  /**
   * URL or path to the brand logo.
   * Can be an absolute URL or relative path.
   * @example "https://example.com/logo.png"
   * @example "/images/brand-logo.svg"
   */
  logoUrl?: string;

  // ── Colors ────────────────────────────────────────────────────────
  /**
   * Primary brand color.
   * Applied to: theme.accent, gradient start
   * @example "#6c3fa0"
   */
  primaryColor?: string;

  /**
   * Secondary brand color.
   * Applied to: theme.accentSecondary, gradient end
   * @example "#d946ef"
   */
  secondaryColor?: string;

  /**
   * Accent color (fallback for secondaryColor).
   * Used when secondaryColor is not provided.
   * @example "#ff9900"
   */
  accentColor?: string;

  /**
   * Background color.
   * Applied to: theme.bg, derives bgSecondary and bgGlass
   * @example "#0c0820"
   */
  bgColor?: string;

  /**
   * Text color.
   * Applied to: theme.textPrimary, derives textSecondary and textMuted
   * @example "#ffffff"
   */
  textColor?: string;

  // ── Typography ────────────────────────────────────────────────────
  /**
   * Font family override.
   * Applied to: theme.fontFamily
   * @example "'Montserrat', sans-serif"
   */
  fontFamily?: string;

  // ── Status Colors (GameDay specific) ──────────────────────────────
  /**
   * Success/positive status color.
   * Equivalent to GD_GREEN in GameDay templates.
   * @example "#22c55e"
   */
  successColor?: string;

  /**
   * Error/negative status color.
   * Equivalent to GD_RED in GameDay templates.
   * @example "#ef4444"
   */
  errorColor?: string;
}

/**
 * BrandKit validation result.
 *
 * Returned by validation functions to indicate success or
 * provide detailed error information.
 */
export interface BrandKitValidationResult {
  /**
   * Whether the BrandKit is valid.
   */
  valid: boolean;

  /**
   * Array of validation errors, empty if valid.
   */
  errors: BrandKitValidationError[];
}

/**
 * Individual BrandKit validation error.
 */
export interface BrandKitValidationError {
  /**
   * The field that failed validation.
   */
  field: keyof BrandKit;

  /**
   * Human-readable error message.
   */
  message: string;

  /**
   * The invalid value that was provided.
   */
  value?: unknown;
}
