/**
 * ThemeRegistry - Central registry for theme definitions
 *
 * Provides storage, retrieval, and management of theme definitions.
 * Themes are stored immutably and can be retrieved by name, filtered
 * by category, or queried for template compatibility.
 *
 * @module themes/registry/ThemeRegistry
 * @see Requirements: 1.1-1.7, 3.1-3.4, 17.1-17.2
 */

import type { Theme, ThemeCategory, ThemePreset, ThemeValidationError as ThemeValidationErrorDetail } from "../types";
import { ThemeValidationError } from "../errors";

/**
 * Template compatibility configuration.
 *
 * This interface represents the subset of TemplateConfig properties
 * needed for theme compatibility filtering. It allows the ThemeRegistry
 * to work with template compatibility rules without depending on the
 * full TemplateRegistry.
 *
 * @see Requirements: 3.2-3.4
 */
export interface TemplateCompatibilityConfig {
  /**
   * List of theme names this template is compatible with.
   * If undefined, the template is compatible with all themes (unless excludedThemes is set).
   * Takes precedence over `excludedThemes`.
   */
  compatibleThemes?: string[];

  /**
   * List of theme names to exclude from compatibility.
   * Only used when `compatibleThemes` is undefined.
   */
  excludedThemes?: string[];
}

/**
 * Required fields that must be present in a valid Theme object.
 */
const REQUIRED_THEME_FIELDS: (keyof Theme)[] = [
  "name",
  "category",
  "bg",
  "bgSecondary",
  "bgGlass",
  "textPrimary",
  "textSecondary",
  "textMuted",
  "accent",
  "accentSecondary",
  "accentGradient",
  "cardBorder",
  "cardShadow",
  "borderRadius",
  "fontFamily",
  "headingWeight",
  "bodyWeight",
];

/**
 * Valid theme categories.
 */
const VALID_CATEGORIES: ThemeCategory[] = [
  "original",
  "extended",
  "european",
  "flat",
  "canva",
  "custom",
];

/**
 * Regular expression patterns for CSS color validation.
 */
const COLOR_PATTERNS = {
  /**
   * Hex color patterns:
   * - #RGB (3 digits)
   * - #RRGGBB (6 digits)
   * - #RRGGBBAA (8 digits)
   */
  hex: /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,

  /**
   * RGB color pattern: rgb(r, g, b)
   * Values can be 0-255 integers or percentages
   */
  rgb: /^rgb\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*\)$/i,

  /**
   * RGBA color pattern: rgba(r, g, b, a)
   * RGB values can be 0-255 integers or percentages
   * Alpha can be 0-1 decimal or percentage
   */
  rgba: /^rgba\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(0|1|0?\.\d+|1\.0*|\d{1,3}%)\s*\)$/i,

  /**
   * HSL color pattern: hsl(h, s%, l%)
   * Hue: 0-360 degrees
   * Saturation and Lightness: 0-100%
   */
  hsl: /^hsl\(\s*(\d{1,3}(?:\.\d+)?)\s*,\s*(\d{1,3}(?:\.\d+)?)%\s*,\s*(\d{1,3}(?:\.\d+)?)%\s*\)$/i,

  /**
   * HSLA color pattern: hsla(h, s%, l%, a)
   * Hue: 0-360 degrees
   * Saturation and Lightness: 0-100%
   * Alpha: 0-1 decimal or percentage
   */
  hsla: /^hsla\(\s*(\d{1,3}(?:\.\d+)?)\s*,\s*(\d{1,3}(?:\.\d+)?)%\s*,\s*(\d{1,3}(?:\.\d+)?)%\s*,\s*(0|1|0?\.\d+|1\.0*|\d{1,3}%)\s*\)$/i,
};

/**
 * Regular expression patterns for CSS gradient validation.
 */
const GRADIENT_PATTERNS = {
  /**
   * Linear gradient pattern: linear-gradient(...)
   */
  linearGradient: /^linear-gradient\s*\(/i,

  /**
   * Radial gradient pattern: radial-gradient(...)
   */
  radialGradient: /^radial-gradient\s*\(/i,

  /**
   * Conic gradient pattern: conic-gradient(...)
   */
  conicGradient: /^conic-gradient\s*\(/i,

  /**
   * Repeating linear gradient pattern: repeating-linear-gradient(...)
   */
  repeatingLinearGradient: /^repeating-linear-gradient\s*\(/i,

  /**
   * Repeating radial gradient pattern: repeating-radial-gradient(...)
   */
  repeatingRadialGradient: /^repeating-radial-gradient\s*\(/i,

  /**
   * Repeating conic gradient pattern: repeating-conic-gradient(...)
   */
  repeatingConicGradient: /^repeating-conic-gradient\s*\(/i,
};

/**
 * Validates if a string is a valid CSS color.
 *
 * Supports:
 * - Hex colors: #RGB, #RRGGBB, #RRGGBBAA
 * - RGB: rgb(r, g, b)
 * - RGBA: rgba(r, g, b, a)
 * - HSL: hsl(h, s%, l%)
 * - HSLA: hsla(h, s%, l%, a)
 *
 * @param value - The string to validate
 * @returns true if the value is a valid CSS color
 *
 * @see Requirements: 2.3
 */
function isValidCssColor(value: string): boolean {
  if (typeof value !== "string" || value.trim() === "") {
    return false;
  }

  const trimmed = value.trim();

  // Check hex color
  if (COLOR_PATTERNS.hex.test(trimmed)) {
    return true;
  }

  // Check rgb color
  if (COLOR_PATTERNS.rgb.test(trimmed)) {
    const match = trimmed.match(COLOR_PATTERNS.rgb);
    if (match) {
      // Validate RGB values are in valid range
      for (let i = 1; i <= 3; i++) {
        const val = match[i];
        if (val.endsWith("%")) {
          const num = parseFloat(val);
          if (num < 0 || num > 100) return false;
        } else {
          const num = parseInt(val, 10);
          if (num < 0 || num > 255) return false;
        }
      }
      return true;
    }
  }

  // Check rgba color
  if (COLOR_PATTERNS.rgba.test(trimmed)) {
    const match = trimmed.match(COLOR_PATTERNS.rgba);
    if (match) {
      // Validate RGB values are in valid range
      for (let i = 1; i <= 3; i++) {
        const val = match[i];
        if (val.endsWith("%")) {
          const num = parseFloat(val);
          if (num < 0 || num > 100) return false;
        } else {
          const num = parseInt(val, 10);
          if (num < 0 || num > 255) return false;
        }
      }
      // Validate alpha value
      const alpha = match[4];
      if (alpha.endsWith("%")) {
        const num = parseFloat(alpha);
        if (num < 0 || num > 100) return false;
      } else {
        const num = parseFloat(alpha);
        if (num < 0 || num > 1) return false;
      }
      return true;
    }
  }

  // Check hsl color
  if (COLOR_PATTERNS.hsl.test(trimmed)) {
    const match = trimmed.match(COLOR_PATTERNS.hsl);
    if (match) {
      const hue = parseFloat(match[1]);
      const saturation = parseFloat(match[2]);
      const lightness = parseFloat(match[3]);
      if (hue < 0 || hue > 360) return false;
      if (saturation < 0 || saturation > 100) return false;
      if (lightness < 0 || lightness > 100) return false;
      return true;
    }
  }

  // Check hsla color
  if (COLOR_PATTERNS.hsla.test(trimmed)) {
    const match = trimmed.match(COLOR_PATTERNS.hsla);
    if (match) {
      const hue = parseFloat(match[1]);
      const saturation = parseFloat(match[2]);
      const lightness = parseFloat(match[3]);
      if (hue < 0 || hue > 360) return false;
      if (saturation < 0 || saturation > 100) return false;
      if (lightness < 0 || lightness > 100) return false;
      // Validate alpha value
      const alpha = match[4];
      if (alpha.endsWith("%")) {
        const num = parseFloat(alpha);
        if (num < 0 || num > 100) return false;
      } else {
        const num = parseFloat(alpha);
        if (num < 0 || num > 1) return false;
      }
      return true;
    }
  }

  return false;
}

/**
 * Validates if a string is a valid CSS gradient.
 *
 * Supports:
 * - linear-gradient(...)
 * - radial-gradient(...)
 * - conic-gradient(...)
 * - repeating-linear-gradient(...)
 * - repeating-radial-gradient(...)
 * - repeating-conic-gradient(...)
 *
 * @param value - The string to validate
 * @returns true if the value is a valid CSS gradient
 *
 * @see Requirements: 2.4
 */
function isValidCssGradient(value: string): boolean {
  if (typeof value !== "string" || value.trim() === "") {
    return false;
  }

  const trimmed = value.trim();

  // Check if it starts with a gradient function
  const isGradient =
    GRADIENT_PATTERNS.linearGradient.test(trimmed) ||
    GRADIENT_PATTERNS.radialGradient.test(trimmed) ||
    GRADIENT_PATTERNS.conicGradient.test(trimmed) ||
    GRADIENT_PATTERNS.repeatingLinearGradient.test(trimmed) ||
    GRADIENT_PATTERNS.repeatingRadialGradient.test(trimmed) ||
    GRADIENT_PATTERNS.repeatingConicGradient.test(trimmed);

  if (!isGradient) {
    return false;
  }

  // Check for balanced parentheses
  let depth = 0;
  for (const char of trimmed) {
    if (char === "(") depth++;
    if (char === ")") depth--;
    if (depth < 0) return false;
  }

  return depth === 0;
}

/**
 * Validates if a string is a valid CSS color or gradient.
 *
 * @param value - The string to validate
 * @returns true if the value is a valid CSS color or gradient
 *
 * @see Requirements: 2.3, 2.4
 */
function isValidColorOrGradient(value: string): boolean {
  return isValidCssColor(value) || isValidCssGradient(value);
}

/**
 * Central registry for all theme definitions.
 *
 * The ThemeRegistry provides:
 * - Storage and retrieval of themes by name
 * - Iteration over all registered themes
 * - Theme name listing
 * - Validation of theme objects on registration
 * - Immutability of registered themes
 *
 * Themes are stored as frozen objects to ensure immutability after registration.
 *
 * @example
 * ```typescript
 * const registry = new ThemeRegistry();
 * registry.registerTheme("dark", darkTheme);
 *
 * const theme = registry.getTheme("dark");
 * const allThemes = registry.getAllThemes();
 * const names = registry.getThemeNames();
 * ```
 *
 * @see Requirements: 1.1-1.7, 17.1-17.2
 */
export class ThemeRegistry {
  /**
   * Internal storage for themes.
   * Uses Map for O(1) lookup by name.
   * Theme names are stored in lowercase for case-insensitive lookup.
   */
  private readonly themes: Map<string, Theme> = new Map();

  /**
   * Retrieves a theme by name.
   *
   * Performs case-insensitive lookup by converting the name to lowercase.
   * Returns the exact theme object that was registered (frozen/immutable).
   *
   * @param name - The theme name to look up (case-insensitive)
   * @returns The Theme object if found, undefined otherwise
   *
   * @precondition name is a non-empty string
   * @postcondition Returns Theme object if theme with matching name exists
   * @postcondition Returns undefined if no matching theme found
   * @postcondition Returned Theme is a frozen object (immutable)
   *
   * @example
   * ```typescript
   * const theme = registry.getTheme("ocean");
   * if (theme) {
   *   console.log(theme.accent); // Use theme properties
   * }
   * ```
   *
   * @see Requirements: 1.2, 1.3
   */
  getTheme(name: string): Theme | undefined {
    if (!name || typeof name !== "string") {
      return undefined;
    }
    return this.themes.get(name.toLowerCase());
  }

  /**
   * Retrieves all registered themes as an array.
   *
   * Returns a new array containing all theme objects.
   * The themes themselves are frozen (immutable), but the array is a new copy.
   *
   * @returns Array of all registered Theme objects
   *
   * @postcondition Returns array of all registered themes
   * @postcondition Array is a new copy (modifying it doesn't affect registry)
   * @postcondition Each theme in array is frozen (immutable)
   *
   * @example
   * ```typescript
   * const themes = registry.getAllThemes();
   * themes.forEach(theme => console.log(theme.name));
   * ```
   *
   * @see Requirements: 1.4
   */
  getAllThemes(): Theme[] {
    return Array.from(this.themes.values());
  }

  /**
   * Retrieves all registered theme names as an array.
   *
   * Returns a new array containing all theme names (lowercase).
   * Useful for displaying available themes or validation.
   *
   * @returns Array of all registered theme names
   *
   * @postcondition Returns array of all registered theme names
   * @postcondition Array is a new copy (modifying it doesn't affect registry)
   *
   * @example
   * ```typescript
   * const names = registry.getThemeNames();
   * console.log(`Available themes: ${names.join(", ")}`);
   * ```
   *
   * @see Requirements: 1.5
   */
  getThemeNames(): string[] {
    return Array.from(this.themes.keys());
  }

  /**
   * Retrieves all themes matching a specific category.
   *
   * Filters the registered themes and returns only those that belong
   * to the specified category.
   *
   * @param category - The ThemeCategory to filter by
   * @returns Array of Theme objects matching the category
   *
   * @postcondition Returns array of themes where theme.category === category
   * @postcondition Array is a new copy (modifying it doesn't affect registry)
   * @postcondition Each theme in array is frozen (immutable)
   *
   * @example
   * ```typescript
   * const extendedThemes = registry.getThemesByCategory("extended");
   * console.log(`Found ${extendedThemes.length} extended themes`);
   * ```
   *
   * @see Requirements: 3.1
   */
  getThemesByCategory(category: ThemeCategory): Theme[] {
    return this.getAllThemes().filter((theme) => theme.category === category);
  }

  /**
   * Retrieves themes compatible with a template based on its compatibility rules.
   *
   * This method determines which themes are compatible with a template by
   * examining the template's compatibility configuration:
   *
   * 1. If `compatibleThemes` is specified and non-empty, returns only themes
   *    whose names are in that list (whitelist approach)
   * 2. If `excludedThemes` is specified and non-empty (and compatibleThemes is not),
   *    returns all themes except those in the excluded list (blacklist approach)
   * 3. If neither is specified, returns all registered themes
   *
   * Theme name matching is case-insensitive.
   *
   * @param templateConfig - The template's compatibility configuration
   * @returns Array of Theme objects compatible with the template
   *
   * @precondition templateConfig is a valid TemplateCompatibilityConfig object
   * @postcondition Returns themes matching the compatibility rules
   * @postcondition Array is a new copy (modifying it doesn't affect registry)
   * @postcondition Each theme in array is frozen (immutable)
   *
   * @example
   * ```typescript
   * // Template with whitelist
   * const themes1 = registry.getCompatibleThemes({
   *   compatibleThemes: ["dark", "ocean", "sunset"]
   * });
   *
   * // Template with blacklist
   * const themes2 = registry.getCompatibleThemes({
   *   excludedThemes: ["neon", "bold"]
   * });
   *
   * // Template compatible with all themes
   * const themes3 = registry.getCompatibleThemes({});
   * ```
   *
   * @see Requirements: 3.2-3.4
   */
  getCompatibleThemes(templateConfig: TemplateCompatibilityConfig): Theme[] {
    const allThemes = this.getAllThemes();

    // If template specifies compatible themes (whitelist), use only those
    if (templateConfig.compatibleThemes && templateConfig.compatibleThemes.length > 0) {
      const compatibleSet = new Set(
        templateConfig.compatibleThemes.map((name) => name.toLowerCase())
      );
      return allThemes.filter((theme) => compatibleSet.has(theme.name.toLowerCase()));
    }

    // If template specifies excluded themes (blacklist), exclude those
    if (templateConfig.excludedThemes && templateConfig.excludedThemes.length > 0) {
      const excludedSet = new Set(
        templateConfig.excludedThemes.map((name) => name.toLowerCase())
      );
      return allThemes.filter((theme) => !excludedSet.has(theme.name.toLowerCase()));
    }

    // If neither is specified, return all themes
    return allThemes;
  }

  /**
   * Validates a theme object and returns validation errors.
   *
   * Performs basic structural validation:
   * - Checks all required fields are present
   * - Validates category is a valid ThemeCategory
   * - Validates borderRadius is non-negative
   * - Validates headingWeight and bodyWeight are valid font weights (100-900)
   *
   * Note: Full color validation (CSS color format checking) will be
   * implemented in task 3.3 with isValidTheme().
   *
   * @param theme - The theme object to validate
   * @param themeName - Optional theme name for error messages
   * @returns Array of validation errors (empty if valid)
   *
   * @see Requirements: 2.1-2.8
   */
  private validateTheme(theme: unknown, themeName?: string): ThemeValidationErrorDetail[] {
    const errors: ThemeValidationErrorDetail[] = [];

    // Check if theme is an object
    if (!theme || typeof theme !== "object") {
      errors.push({
        field: "theme",
        message: "Theme must be a non-null object",
        value: theme,
      });
      return errors;
    }

    const themeObj = theme as Record<string, unknown>;

    // Check for required fields
    for (const field of REQUIRED_THEME_FIELDS) {
      if (!(field in themeObj) || themeObj[field] === undefined || themeObj[field] === null) {
        errors.push({
          field,
          message: `Missing required field: ${field}`,
          value: themeObj[field],
        });
      }
    }

    // Validate category if present
    if ("category" in themeObj && themeObj.category !== undefined) {
      if (!VALID_CATEGORIES.includes(themeObj.category as ThemeCategory)) {
        errors.push({
          field: "category",
          message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`,
          value: themeObj.category,
        });
      }
    }

    // Validate borderRadius is non-negative
    if ("borderRadius" in themeObj && themeObj.borderRadius !== undefined) {
      if (typeof themeObj.borderRadius !== "number" || themeObj.borderRadius < 0) {
        errors.push({
          field: "borderRadius",
          message: "borderRadius must be a non-negative number",
          value: themeObj.borderRadius,
        });
      }
    }

    // Validate headingWeight is valid font weight (100-900)
    if ("headingWeight" in themeObj && themeObj.headingWeight !== undefined) {
      const weight = themeObj.headingWeight;
      if (
        typeof weight !== "number" ||
        weight < 100 ||
        weight > 900 ||
        weight % 100 !== 0
      ) {
        errors.push({
          field: "headingWeight",
          message: "headingWeight must be a valid font weight (100-900, in increments of 100)",
          value: weight,
        });
      }
    }

    // Validate bodyWeight is valid font weight (100-900)
    if ("bodyWeight" in themeObj && themeObj.bodyWeight !== undefined) {
      const weight = themeObj.bodyWeight;
      if (
        typeof weight !== "number" ||
        weight < 100 ||
        weight > 900 ||
        weight % 100 !== 0
      ) {
        errors.push({
          field: "bodyWeight",
          message: "bodyWeight must be a valid font weight (100-900, in increments of 100)",
          value: weight,
        });
      }
    }

    // Validate fontFamily is a non-empty string
    if ("fontFamily" in themeObj && themeObj.fontFamily !== undefined) {
      if (typeof themeObj.fontFamily !== "string" || themeObj.fontFamily.trim() === "") {
        errors.push({
          field: "fontFamily",
          message: "fontFamily must be a non-empty string",
          value: themeObj.fontFamily,
        });
      }
    }

    // Validate string fields are actually strings
    const stringFields: (keyof Theme)[] = [
      "name",
      "bg",
      "bgSecondary",
      "bgGlass",
      "textPrimary",
      "textSecondary",
      "textMuted",
      "accent",
      "accentSecondary",
      "accentGradient",
      "cardBorder",
      "cardShadow",
    ];

    for (const field of stringFields) {
      if (field in themeObj && themeObj[field] !== undefined) {
        if (typeof themeObj[field] !== "string") {
          errors.push({
            field,
            message: `${field} must be a string`,
            value: themeObj[field],
          });
        }
      }
    }

    return errors;
  }

  /**
   * Validates color fields in a theme object.
   *
   * Checks that all color fields contain valid CSS colors (hex, rgb, rgba, hsl).
   * The `bg` field is special and can also accept CSS gradient strings.
   *
   * @param themeObj - The theme object to validate
   * @returns Array of validation errors for invalid color fields
   *
   * @see Requirements: 2.3, 2.4
   */
  private validateColorFields(themeObj: Record<string, unknown>): ThemeValidationErrorDetail[] {
    const errors: ThemeValidationErrorDetail[] = [];

    // Color fields that must be valid CSS colors (not gradients)
    const colorOnlyFields: (keyof Theme)[] = [
      "bgSecondary",
      "bgGlass",
      "textPrimary",
      "textSecondary",
      "textMuted",
      "accent",
      "accentSecondary",
      "cardBorder",
    ];

    // Fields that can be colors or gradients
    const colorOrGradientFields: (keyof Theme)[] = [
      "bg",
      "accentGradient",
    ];

    // Fields that can be any string (shadow, etc.)
    const freeformStringFields: (keyof Theme)[] = [
      "cardShadow", // Can be "none" or complex shadow syntax
    ];

    // Validate color-only fields
    for (const field of colorOnlyFields) {
      if (field in themeObj && themeObj[field] !== undefined) {
        const value = themeObj[field];
        if (typeof value === "string" && !isValidCssColor(value)) {
          errors.push({
            field,
            message: `${field} must be a valid CSS color (hex, rgb, rgba, hsl, hsla)`,
            value,
          });
        }
      }
    }

    // Validate color-or-gradient fields
    for (const field of colorOrGradientFields) {
      if (field in themeObj && themeObj[field] !== undefined) {
        const value = themeObj[field];
        if (typeof value === "string" && !isValidColorOrGradient(value)) {
          errors.push({
            field,
            message: `${field} must be a valid CSS color or gradient`,
            value,
          });
        }
      }
    }

    return errors;
  }

  /**
   * Validates if an unknown value is a valid Theme object.
   *
   * This method performs comprehensive validation including:
   * - Structural validation (required fields, types)
   * - Color validation (hex, rgb, rgba, hsl formats)
   * - Gradient validation for bg field
   * - Font weight validation (100-900)
   * - Border radius validation (non-negative)
   *
   * Unlike registerTheme, this method returns a boolean without throwing.
   *
   * @param theme - The unknown value to validate
   * @returns true if the value is a valid Theme object, false otherwise
   *
   * @example
   * ```typescript
   * const maybeTheme: unknown = JSON.parse(userInput);
   * if (registry.isValidTheme(maybeTheme)) {
   *   // TypeScript now knows maybeTheme is Theme
   *   console.log(maybeTheme.accent);
   * }
   * ```
   *
   * @see Requirements: 2.1-2.8
   */
  isValidTheme(theme: unknown): theme is Theme {
    // Check if theme is an object
    if (!theme || typeof theme !== "object") {
      return false;
    }

    const themeObj = theme as Record<string, unknown>;

    // Check for required fields
    for (const field of REQUIRED_THEME_FIELDS) {
      if (!(field in themeObj) || themeObj[field] === undefined || themeObj[field] === null) {
        return false;
      }
    }

    // Validate category
    if (!VALID_CATEGORIES.includes(themeObj.category as ThemeCategory)) {
      return false;
    }

    // Validate borderRadius is non-negative
    if (typeof themeObj.borderRadius !== "number" || themeObj.borderRadius < 0) {
      return false;
    }

    // Validate headingWeight is valid font weight (100-900)
    const headingWeight = themeObj.headingWeight;
    if (
      typeof headingWeight !== "number" ||
      headingWeight < 100 ||
      headingWeight > 900 ||
      headingWeight % 100 !== 0
    ) {
      return false;
    }

    // Validate bodyWeight is valid font weight (100-900)
    const bodyWeight = themeObj.bodyWeight;
    if (
      typeof bodyWeight !== "number" ||
      bodyWeight < 100 ||
      bodyWeight > 900 ||
      bodyWeight % 100 !== 0
    ) {
      return false;
    }

    // Validate fontFamily is a non-empty string
    if (typeof themeObj.fontFamily !== "string" || themeObj.fontFamily.trim() === "") {
      return false;
    }

    // Validate string fields are actually strings
    const stringFields: (keyof Theme)[] = [
      "name",
      "bg",
      "bgSecondary",
      "bgGlass",
      "textPrimary",
      "textSecondary",
      "textMuted",
      "accent",
      "accentSecondary",
      "accentGradient",
      "cardBorder",
      "cardShadow",
    ];

    for (const field of stringFields) {
      if (typeof themeObj[field] !== "string") {
        return false;
      }
    }

    // Validate color fields
    const colorErrors = this.validateColorFields(themeObj);
    if (colorErrors.length > 0) {
      return false;
    }

    return true;
  }

  /**
   * Deeply freezes an object and all nested objects.
   *
   * @param obj - The object to freeze
   * @returns The frozen object
   */
  private deepFreeze<T extends object>(obj: T): T {
    // Get all property names
    const propNames = Object.getOwnPropertyNames(obj) as (keyof T)[];

    // Freeze nested objects before freezing the parent
    for (const name of propNames) {
      const value = obj[name];
      if (value && typeof value === "object" && !Object.isFrozen(value)) {
        this.deepFreeze(value as object);
      }
    }

    return Object.freeze(obj);
  }

  /**
   * Registers a theme with the given name.
   *
   * The theme is validated and frozen to ensure immutability after registration.
   * The name is converted to lowercase for case-insensitive lookup.
   *
   * @param name - The name to register the theme under
   * @param theme - The theme object to register
   * @throws {ThemeValidationError} If the theme fails validation
   *
   * @precondition name is a non-empty string
   * @precondition theme is a valid Theme object
   * @postcondition Theme is stored in registry with lowercase name
   * @postcondition Stored theme is frozen (immutable)
   *
   * @example
   * ```typescript
   * registry.registerTheme("ocean", {
   *   name: "ocean",
   *   category: "extended",
   *   bg: "#0a1628",
   *   // ... other required fields
   * });
   * ```
   *
   * @see Requirements: 1.1, 1.6, 17.1, 17.2
   */
  registerTheme(name: string, theme: Theme): void {
    // Validate name
    if (!name || typeof name !== "string" || name.trim() === "") {
      throw new ThemeValidationError(
        "Theme name must be a non-empty string",
        [{ field: "name", message: "Theme name must be a non-empty string", value: name }],
        name
      );
    }

    const normalizedName = name.toLowerCase();

    // Validate theme
    const errors = this.validateTheme(theme, normalizedName);
    if (errors.length > 0) {
      throw new ThemeValidationError(
        `Invalid theme "${normalizedName}": ${errors.length} validation error(s)`,
        errors,
        normalizedName
      );
    }

    // Create a copy with the normalized name and freeze it
    const frozenTheme = this.deepFreeze({ ...theme, name: normalizedName });
    this.themes.set(normalizedName, frozenTheme);
  }

  /**
   * Registers all themes from a preset.
   *
   * Extracts and stores all themes from the preset, applying the preset's
   * category to each theme if not already specified. Each theme is validated
   * and frozen before storage.
   *
   * @param preset - The theme preset containing multiple themes
   * @throws {ThemeValidationError} If any theme in the preset fails validation
   *
   * @precondition preset is a valid ThemePreset object
   * @postcondition All themes from preset are stored in registry
   * @postcondition Each stored theme has the preset's category if not specified
   * @postcondition All stored themes are frozen (immutable)
   *
   * @example
   * ```typescript
   * registry.registerPreset({
   *   name: "extended",
   *   category: "extended",
   *   themes: {
   *     ocean: oceanTheme,
   *     sunset: sunsetTheme,
   *   }
   * });
   * ```
   *
   * @see Requirements: 1.7
   */
  registerPreset(preset: ThemePreset): void {
    // Validate preset structure
    if (!preset || typeof preset !== "object") {
      throw new ThemeValidationError(
        "Preset must be a non-null object",
        [{ field: "preset", message: "Preset must be a non-null object", value: preset }]
      );
    }

    if (!preset.themes || typeof preset.themes !== "object") {
      throw new ThemeValidationError(
        "Preset must have a themes object",
        [{ field: "themes", message: "Preset must have a themes object", value: preset.themes }]
      );
    }

    if (!preset.category || !VALID_CATEGORIES.includes(preset.category)) {
      throw new ThemeValidationError(
        `Preset must have a valid category. Got: ${preset.category}`,
        [{ field: "category", message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`, value: preset.category }]
      );
    }

    // Register each theme in the preset
    for (const [themeName, theme] of Object.entries(preset.themes)) {
      // Apply preset category if theme doesn't have one
      const themeWithCategory: Theme = {
        ...theme,
        category: theme.category || preset.category,
      };
      this.registerTheme(themeName, themeWithCategory);
    }
  }

  /**
   * Returns the number of registered themes.
   *
   * Useful for testing and debugging.
   *
   * @returns The count of registered themes
   */
  get size(): number {
    return this.themes.size;
  }

  /**
   * Checks if a theme with the given name is registered.
   *
   * @param name - The theme name to check (case-insensitive)
   * @returns true if the theme exists, false otherwise
   */
  hasTheme(name: string): boolean {
    if (!name || typeof name !== "string") {
      return false;
    }
    return this.themes.has(name.toLowerCase());
  }

  /**
   * Clears all registered themes.
   *
   * Primarily useful for testing.
   */
  clear(): void {
    this.themes.clear();
  }
}
