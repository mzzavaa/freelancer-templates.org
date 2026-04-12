/**
 * ThemeFactory - Theme creation and preset management
 *
 * Provides methods for creating themes from configuration objects,
 * accessing preset themes by name, and listing available presets.
 * Themes created by the factory are validated and frozen to ensure
 * immutability.
 *
 * @module themes/factory/ThemeFactory
 * @see Requirements: 10.1-10.3, 12.1-12.7
 */

import type {
  Theme,
  ThemeCategory,
  ThemeConfig,
  ThemeValidationResult,
  ThemeValidationError as ThemeValidationErrorDetail,
  DerivedColors,
  TextColors,
  BrandKit,
} from "../types";
import { ThemeValidationError } from "../errors";

/**
 * Default values for optional theme properties.
 *
 * These defaults are applied when creating a theme from a partial config.
 */
const DEFAULT_THEME_VALUES: Omit<Theme, "name" | "category"> = {
  bg: "#0a0a0f",
  bgSecondary: "rgba(255,255,255,0.04)",
  bgGlass: "rgba(255,255,255,0.06)",
  textPrimary: "#ffffff",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  accent: "#6366f1",
  accentSecondary: "#a855f7",
  accentGradient: "linear-gradient(135deg, #6366f1, #ec4899)",
  cardBorder: "rgba(99,102,241,0.25)",
  cardShadow: "0 4px 24px rgba(0,0,0,0.3)",
  borderRadius: 12,
  fontFamily: "'Inter', sans-serif",
  headingWeight: 800,
  bodyWeight: 400,
};

/**
 * Built-in preset themes.
 *
 * These themes are available via getPreset() and listPresets().
 * Each preset is a complete, validated Theme object.
 */
const PRESET_THEMES: Record<string, Theme> = {
  dark: {
    name: "dark",
    category: "original",
    bg: "#0a0a0f",
    bgSecondary: "rgba(255,255,255,0.04)",
    bgGlass: "rgba(255,255,255,0.06)",
    textPrimary: "#ffffff",
    textSecondary: "#94a3b8",
    textMuted: "#64748b",
    accent: "#6366f1",
    accentSecondary: "#a855f7",
    accentGradient: "linear-gradient(135deg, #6366f1, #ec4899)",
    cardBorder: "rgba(99,102,241,0.25)",
    cardShadow: "0 4px 24px rgba(0,0,0,0.3)",
    borderRadius: 12,
    fontFamily: "'Inter', sans-serif",
    headingWeight: 800,
    bodyWeight: 400,
  },
  clean: {
    name: "clean",
    category: "original",
    bg: "#f8fafc",
    bgSecondary: "#ffffff",
    bgGlass: "rgba(255,255,255,0.9)",
    textPrimary: "#0f172a",
    textSecondary: "#475569",
    textMuted: "#94a3b8",
    accent: "#2563eb",
    accentSecondary: "#3b82f6",
    accentGradient: "linear-gradient(135deg, #2563eb, #7c3aed)",
    cardBorder: "rgba(37,99,235,0.15)",
    cardShadow: "0 4px 24px rgba(0,0,0,0.06)",
    borderRadius: 12,
    fontFamily: "'Inter', sans-serif",
    headingWeight: 700,
    bodyWeight: 400,
  },
  bold: {
    name: "bold",
    category: "original",
    bg: "#0f0f1a",
    bgSecondary: "rgba(255,255,255,0.05)",
    bgGlass: "rgba(255,255,255,0.08)",
    textPrimary: "#ffffff",
    textSecondary: "#c4b5fd",
    textMuted: "#7c3aed",
    accent: "#8b5cf6",
    accentSecondary: "#ec4899",
    accentGradient: "linear-gradient(135deg, #8b5cf6, #ec4899)",
    cardBorder: "rgba(139,92,246,0.3)",
    cardShadow: "0 8px 32px rgba(139,92,246,0.2)",
    borderRadius: 12,
    fontFamily: "'Inter', sans-serif",
    headingWeight: 900,
    bodyWeight: 500,
  },
  warm: {
    name: "warm",
    category: "original",
    bg: "linear-gradient(180deg, #1a1520 0%, #1e1215 100%)",
    bgSecondary: "rgba(251,146,60,0.06)",
    bgGlass: "rgba(251,146,60,0.08)",
    textPrimary: "#fef3c7",
    textSecondary: "#fdba74",
    textMuted: "#9a7b4f",
    accent: "#f97316",
    accentSecondary: "#ef4444",
    accentGradient: "linear-gradient(135deg, #f97316, #ef4444)",
    cardBorder: "rgba(249,115,22,0.25)",
    cardShadow: "0 4px 24px rgba(249,115,22,0.15)",
    borderRadius: 12,
    fontFamily: "'Inter', sans-serif",
    headingWeight: 700,
    bodyWeight: 400,
  },
  minimal: {
    name: "minimal",
    category: "original",
    bg: "#fafafa",
    bgSecondary: "#f1f5f9",
    bgGlass: "rgba(241,245,249,0.8)",
    textPrimary: "#1e293b",
    textSecondary: "#64748b",
    textMuted: "#cbd5e1",
    accent: "#334155",
    accentSecondary: "#64748b",
    accentGradient: "linear-gradient(135deg, #334155, #64748b)",
    cardBorder: "rgba(51,65,85,0.1)",
    cardShadow: "0 1px 4px rgba(0,0,0,0.04)",
    borderRadius: 12,
    fontFamily: "'Inter', sans-serif",
    headingWeight: 600,
    bodyWeight: 400,
  },
  neon: {
    name: "neon",
    category: "original",
    bg: "#050510",
    bgSecondary: "rgba(0,255,136,0.04)",
    bgGlass: "rgba(0,255,136,0.06)",
    textPrimary: "#e0ffe0",
    textSecondary: "#00ff88",
    textMuted: "#0a6640",
    accent: "#00ff88",
    accentSecondary: "#00ccff",
    accentGradient: "linear-gradient(135deg, #00ff88, #00ccff)",
    cardBorder: "rgba(0,255,136,0.2)",
    cardShadow: "0 0 24px rgba(0,255,136,0.15)",
    borderRadius: 12,
    fontFamily: "'Inter', sans-serif",
    headingWeight: 800,
    bodyWeight: 400,
  },
  ocean: {
    name: "ocean",
    category: "extended",
    bg: "#050f1a",
    bgSecondary: "rgba(8,145,178,0.06)",
    bgGlass: "rgba(8,145,178,0.08)",
    textPrimary: "#e0f7fa",
    textSecondary: "#67e8f9",
    textMuted: "#164e63",
    accent: "#0891b2",
    accentSecondary: "#06b6d4",
    accentGradient: "linear-gradient(135deg, #0891b2, #06b6d4)",
    cardBorder: "rgba(8,145,178,0.25)",
    cardShadow: "0 4px 24px rgba(8,145,178,0.15)",
    borderRadius: 12,
    fontFamily: "'Inter', sans-serif",
    headingWeight: 700,
    bodyWeight: 400,
  },
  sunset: {
    name: "sunset",
    category: "extended",
    bg: "#1a0a0f",
    bgSecondary: "rgba(244,114,182,0.06)",
    bgGlass: "rgba(244,114,182,0.08)",
    textPrimary: "#fff1f5",
    textSecondary: "#fda4af",
    textMuted: "#9f1239",
    accent: "#f472b6",
    accentSecondary: "#fb923c",
    accentGradient: "linear-gradient(135deg, #f472b6, #fb923c)",
    cardBorder: "rgba(244,114,182,0.25)",
    cardShadow: "0 4px 24px rgba(244,114,182,0.15)",
    borderRadius: 12,
    fontFamily: "'Inter', sans-serif",
    headingWeight: 800,
    bodyWeight: 400,
  },
  forest: {
    name: "forest",
    category: "extended",
    bg: "#031a06",
    bgSecondary: "rgba(22,163,74,0.06)",
    bgGlass: "rgba(22,163,74,0.08)",
    textPrimary: "#f0fdf4",
    textSecondary: "#86efac",
    textMuted: "#166534",
    accent: "#16a34a",
    accentSecondary: "#4ade80",
    accentGradient: "linear-gradient(135deg, #16a34a, #4ade80)",
    cardBorder: "rgba(22,163,74,0.25)",
    cardShadow: "0 4px 24px rgba(22,163,74,0.15)",
    borderRadius: 12,
    fontFamily: "'Inter', sans-serif",
    headingWeight: 700,
    bodyWeight: 400,
  },
  rose: {
    name: "rose",
    category: "extended",
    bg: "#1a050a",
    bgSecondary: "rgba(225,29,72,0.06)",
    bgGlass: "rgba(225,29,72,0.08)",
    textPrimary: "#fff1f2",
    textSecondary: "#fda4af",
    textMuted: "#9f1239",
    accent: "#e11d48",
    accentSecondary: "#fb7185",
    accentGradient: "linear-gradient(135deg, #e11d48, #fb7185)",
    cardBorder: "rgba(225,29,72,0.25)",
    cardShadow: "0 4px 24px rgba(225,29,72,0.15)",
    borderRadius: 12,
    fontFamily: "'Inter', sans-serif",
    headingWeight: 800,
    bodyWeight: 400,
  },
  gold: {
    name: "gold",
    category: "extended",
    bg: "#0a0700",
    bgSecondary: "rgba(217,119,6,0.07)",
    bgGlass: "rgba(217,119,6,0.09)",
    textPrimary: "#fffbeb",
    textSecondary: "#fcd34d",
    textMuted: "#92400e",
    accent: "#d97706",
    accentSecondary: "#fbbf24",
    accentGradient: "linear-gradient(135deg, #d97706, #fbbf24)",
    cardBorder: "rgba(217,119,6,0.3)",
    cardShadow: "0 4px 24px rgba(217,119,6,0.2)",
    borderRadius: 12,
    fontFamily: "'Inter', sans-serif",
    headingWeight: 700,
    bodyWeight: 400,
  },
  midnight: {
    name: "midnight",
    category: "extended",
    bg: "#020817",
    bgSecondary: "rgba(30,64,175,0.08)",
    bgGlass: "rgba(30,64,175,0.1)",
    textPrimary: "#f8fafc",
    textSecondary: "#93c5fd",
    textMuted: "#1e3a5f",
    accent: "#3b82f6",
    accentSecondary: "#60a5fa",
    accentGradient: "linear-gradient(135deg, #1e40af, #3b82f6)",
    cardBorder: "rgba(59,130,246,0.2)",
    cardShadow: "0 4px 24px rgba(30,64,175,0.25)",
    borderRadius: 12,
    fontFamily: "'Inter', sans-serif",
    headingWeight: 700,
    bodyWeight: 400,
  },
};

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
  hex: /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,
  rgb: /^rgb\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*\)$/i,
  rgba: /^rgba\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(0|1|0?\.\d+|1\.0*|\d{1,3}%)\s*\)$/i,
  hsl: /^hsl\(\s*(\d{1,3}(?:\.\d+)?)\s*,\s*(\d{1,3}(?:\.\d+)?)%\s*,\s*(\d{1,3}(?:\.\d+)?)%\s*\)$/i,
  hsla: /^hsla\(\s*(\d{1,3}(?:\.\d+)?)\s*,\s*(\d{1,3}(?:\.\d+)?)%\s*,\s*(\d{1,3}(?:\.\d+)?)%\s*,\s*(0|1|0?\.\d+|1\.0*|\d{1,3}%)\s*\)$/i,
};

/**
 * Regular expression patterns for CSS gradient validation.
 */
const GRADIENT_PATTERNS = {
  linearGradient: /^linear-gradient\s*\(/i,
  radialGradient: /^radial-gradient\s*\(/i,
  conicGradient: /^conic-gradient\s*\(/i,
  repeatingLinearGradient: /^repeating-linear-gradient\s*\(/i,
  repeatingRadialGradient: /^repeating-radial-gradient\s*\(/i,
  repeatingConicGradient: /^repeating-conic-gradient\s*\(/i,
};

/**
 * Validates if a string is a valid CSS color.
 */
function isValidCssColor(value: string): boolean {
  if (typeof value !== "string" || value.trim() === "") {
    return false;
  }

  const trimmed = value.trim();

  if (COLOR_PATTERNS.hex.test(trimmed)) {
    return true;
  }

  if (COLOR_PATTERNS.rgb.test(trimmed)) {
    const match = trimmed.match(COLOR_PATTERNS.rgb);
    if (match) {
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

  if (COLOR_PATTERNS.rgba.test(trimmed)) {
    const match = trimmed.match(COLOR_PATTERNS.rgba);
    if (match) {
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

  if (COLOR_PATTERNS.hsla.test(trimmed)) {
    const match = trimmed.match(COLOR_PATTERNS.hsla);
    if (match) {
      const hue = parseFloat(match[1]);
      const saturation = parseFloat(match[2]);
      const lightness = parseFloat(match[3]);
      if (hue < 0 || hue > 360) return false;
      if (saturation < 0 || saturation > 100) return false;
      if (lightness < 0 || lightness > 100) return false;
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
 */
function isValidCssGradient(value: string): boolean {
  if (typeof value !== "string" || value.trim() === "") {
    return false;
  }

  const trimmed = value.trim();

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
 */
function isValidColorOrGradient(value: string): boolean {
  return isValidCssColor(value) || isValidCssGradient(value);
}

// ── Color Derivation Helper Functions ───────────────────────────────────────

/**
 * RGB color representation.
 */
interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Converts a hex color string to RGB values.
 *
 * Supports both 3-character (#RGB) and 6-character (#RRGGBB) hex formats.
 *
 * @param hex - Hex color string (e.g., "#ff6600" or "#f60")
 * @returns RGB object with r, g, b values (0-255)
 * @throws Error if the hex string is invalid
 *
 * @example
 * ```typescript
 * hexToRgb("#ff6600"); // { r: 255, g: 102, b: 0 }
 * hexToRgb("#f60");    // { r: 255, g: 102, b: 0 }
 * ```
 *
 * @see Requirements: 12.1
 */
export function hexToRgb(hex: string): RGB {
  // Remove # prefix if present
  const cleanHex = hex.replace(/^#/, "");

  let r: number, g: number, b: number;

  if (cleanHex.length === 3) {
    // Short format: #RGB -> #RRGGBB
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6) {
    // Full format: #RRGGBB
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  } else if (cleanHex.length === 8) {
    // Format with alpha: #RRGGBBAA - ignore alpha
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  } else {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  return { r, g, b };
}

/**
 * Converts RGB values to a hex color string.
 *
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns Hex color string (e.g., "#ff6600")
 *
 * @example
 * ```typescript
 * rgbToHex(255, 102, 0); // "#ff6600"
 * ```
 */
function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Calculates the relative luminance of a color.
 *
 * Uses the WCAG 2.0 formula for relative luminance:
 * L = 0.2126 * R + 0.7152 * G + 0.0722 * B
 *
 * Where R, G, B are linearized sRGB values.
 *
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns Relative luminance value (0-1)
 *
 * @example
 * ```typescript
 * calculateLuminance(255, 255, 255); // ~1.0 (white)
 * calculateLuminance(0, 0, 0);       // 0.0 (black)
 * calculateLuminance(128, 128, 128); // ~0.22 (gray)
 * ```
 *
 * @see Requirements: 12.2, 12.7
 */
export function calculateLuminance(r: number, g: number, b: number): number {
  // Convert sRGB to linear RGB
  const linearize = (channel: number): number => {
    const srgb = channel / 255;
    return srgb <= 0.03928
      ? srgb / 12.92
      : Math.pow((srgb + 0.055) / 1.055, 2.4);
  };

  const rLinear = linearize(r);
  const gLinear = linearize(g);
  const bLinear = linearize(b);

  // Calculate luminance using WCAG coefficients
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Shifts a color lighter or darker by a specified amount.
 *
 * Positive shift values make the color lighter, negative values make it darker.
 * The shift is applied uniformly to all RGB channels.
 *
 * @param hexColor - Hex color string to shift
 * @param shift - Amount to shift (-255 to 255). Positive = lighter, negative = darker.
 * @returns Shifted hex color string
 *
 * @example
 * ```typescript
 * shiftColor("#808080", 20);  // Lighter gray
 * shiftColor("#808080", -20); // Darker gray
 * ```
 *
 * @see Requirements: 12.2
 */
export function shiftColor(hexColor: string, shift: number): string {
  const { r, g, b } = hexToRgb(hexColor);

  const newR = Math.max(0, Math.min(255, r + shift));
  const newG = Math.max(0, Math.min(255, g + shift));
  const newB = Math.max(0, Math.min(255, b + shift));

  return rgbToHex(newR, newG, newB);
}

/**
 * Determines if a color is considered "light" based on luminance.
 *
 * Uses a threshold of 0.18 (slightly below middle gray) to determine
 * if a color is light or dark. This threshold works well for
 * determining appropriate text colors and shadows.
 *
 * @param hexColor - Hex color string to check
 * @returns true if the color is light, false if dark
 *
 * @see Requirements: 12.2, 12.7
 */
function isLightColor(hexColor: string): boolean {
  const { r, g, b } = hexToRgb(hexColor);
  return calculateLuminance(r, g, b) > 0.18;
}

/**
 * Adds alpha transparency to a hex color, returning an rgba string.
 *
 * @param hexColor - Hex color string
 * @param alpha - Alpha value (0-1)
 * @returns rgba color string
 *
 * @example
 * ```typescript
 * addAlpha("#ff6600", 0.5); // "rgba(255, 102, 0, 0.5)"
 * ```
 */
function addAlpha(hexColor: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hexColor);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * ThemeFactory class for creating and managing themes.
 *
 * Provides static methods for:
 * - Creating themes from configuration objects
 * - Accessing preset themes by name
 * - Listing available preset names
 *
 * All themes created by the factory are validated and frozen
 * to ensure immutability.
 *
 * @example
 * ```typescript
 * // Create a custom theme
 * const myTheme = ThemeFactory.createTheme({
 *   name: "custom",
 *   accent: "#ff0000",
 *   bg: "#000000",
 * });
 *
 * // Get a preset theme
 * const darkTheme = ThemeFactory.getPreset("dark");
 *
 * // List all presets
 * const presets = ThemeFactory.listPresets();
 * ```
 *
 * @see Requirements: 10.1-10.3
 */
export class ThemeFactory {
  /**
   * Creates a theme from a configuration object.
   *
   * The config must include a `name` field. All other fields are optional
   * and will be filled with default values if not provided. The resulting
   * theme is validated and frozen to ensure immutability.
   *
   * @param config - The theme configuration object
   * @returns A complete, frozen Theme object
   * @throws {ThemeValidationError} If the configuration is invalid
   *
   * @precondition config.name is a non-empty string
   * @postcondition Returns a complete Theme object with all required fields
   * @postcondition Returned theme is frozen (immutable)
   *
   * @example
   * ```typescript
   * const theme = ThemeFactory.createTheme({
   *   name: "myTheme",
   *   category: "custom",
   *   accent: "#ff6600",
   *   bg: "#1a1a1a",
   * });
   * ```
   *
   * @see Requirements: 10.1
   */
  static createTheme(config: ThemeConfig): Theme {
    // Validate name is provided
    if (!config.name || typeof config.name !== "string" || config.name.trim() === "") {
      throw new ThemeValidationError(
        "Theme name must be a non-empty string",
        [{ field: "name", message: "Theme name must be a non-empty string", value: config.name }],
        config.name
      );
    }

    const normalizedName = config.name.toLowerCase();

    // Build the complete theme by merging defaults with config
    const theme: Theme = {
      ...DEFAULT_THEME_VALUES,
      ...config,
      name: normalizedName,
      category: config.category || "custom",
    };

    // Validate the complete theme
    const validationResult = ThemeFactory.validateTheme(theme);
    if (!validationResult.valid) {
      throw new ThemeValidationError(
        `Invalid theme "${normalizedName}": ${validationResult.errors.length} validation error(s)`,
        validationResult.errors,
        normalizedName
      );
    }

    // Freeze and return the theme
    return ThemeFactory.deepFreeze(theme);
  }

  /**
   * Gets a preset theme by name.
   *
   * Returns a frozen copy of the preset theme. The name lookup is
   * case-insensitive.
   *
   * @param name - The preset name to look up (case-insensitive)
   * @returns The preset Theme object
   * @throws {ThemeValidationError} If the preset name is not found
   *
   * @precondition name is a non-empty string
   * @postcondition Returns a frozen Theme object
   *
   * @example
   * ```typescript
   * const darkTheme = ThemeFactory.getPreset("dark");
   * const oceanTheme = ThemeFactory.getPreset("Ocean"); // case-insensitive
   * ```
   *
   * @see Requirements: 10.2
   */
  static getPreset(name: string): Theme {
    if (!name || typeof name !== "string" || name.trim() === "") {
      throw new ThemeValidationError(
        "Preset name must be a non-empty string",
        [{ field: "name", message: "Preset name must be a non-empty string", value: name }]
      );
    }

    const normalizedName = name.toLowerCase();
    const preset = PRESET_THEMES[normalizedName];

    if (!preset) {
      const availablePresets = Object.keys(PRESET_THEMES).join(", ");
      throw new ThemeValidationError(
        `Preset "${name}" not found. Available presets: ${availablePresets}`,
        [{ field: "name", message: `Preset "${name}" not found`, value: name }]
      );
    }

    // Return a frozen copy
    return ThemeFactory.deepFreeze({ ...preset });
  }

  /**
   * Lists all available preset theme names.
   *
   * Returns an array of preset names that can be used with getPreset().
   *
   * @returns Array of preset theme names
   *
   * @example
   * ```typescript
   * const presets = ThemeFactory.listPresets();
   * // ["dark", "clean", "bold", "warm", "minimal", "neon", "ocean", ...]
   * ```
   *
   * @see Requirements: 10.3
   */
  static listPresets(): string[] {
    return Object.keys(PRESET_THEMES);
  }

  /**
   * Derives secondary colors from a primary background color.
   *
   * Automatically generates complementary colors based on whether
   * the background is light or dark:
   * - `bgSecondary`: Shifted version of the background
   * - `bgGlass`: Background with 55% alpha for glassmorphism
   * - `cardBorder`: Placeholder (requires accent color, use with deriveCardBorder)
   * - `cardShadow`: Appropriate shadow for light/dark backgrounds
   *
   * @param backgroundColor - Hex color string for the background
   * @returns DerivedColors object with bgSecondary, bgGlass, cardBorder, cardShadow
   *
   * @precondition backgroundColor is a valid hex color (#RGB, #RRGGBB, or #RRGGBBAA)
   * @postcondition Returns DerivedColors with all fields populated
   * @postcondition All returned colors are valid CSS color values
   *
   * @example
   * ```typescript
   * // Dark background
   * const darkColors = ThemeFactory.deriveSecondaryColors("#0a0a0f");
   * // { bgSecondary: "#202020", bgGlass: "rgba(10, 10, 15, 0.55)", ... }
   *
   * // Light background
   * const lightColors = ThemeFactory.deriveSecondaryColors("#f8fafc");
   * // { bgSecondary: "#eaecee", bgGlass: "rgba(248, 250, 252, 0.55)", ... }
   * ```
   *
   * @see Requirements: 12.1-12.3, 12.6-12.7
   */
  static deriveSecondaryColors(backgroundColor: string): DerivedColors {
    const { r, g, b } = hexToRgb(backgroundColor);
    const isLight = calculateLuminance(r, g, b) > 0.18;

    // Shift direction: light backgrounds get darker, dark backgrounds get lighter
    const shift = isLight ? -14 : 22;

    const bgSecondary = shiftColor(backgroundColor, shift);
    const bgGlass = `rgba(${r}, ${g}, ${b}, 0.55)`;

    // Card shadow: lighter for dark backgrounds, darker for light backgrounds
    const cardShadow = isLight
      ? "0 4px 24px rgba(0,0,0,0.10)"
      : "0 4px 24px rgba(0,0,0,0.45)";

    // cardBorder is typically derived from accent color, not background
    // Return a neutral placeholder that can be overridden
    const cardBorder = isLight
      ? "rgba(0, 0, 0, 0.1)"
      : "rgba(255, 255, 255, 0.1)";

    return {
      bgSecondary,
      bgGlass,
      cardBorder,
      cardShadow,
    };
  }

  /**
   * Derives text colors from a primary text color.
   *
   * Generates secondary and muted text colors by applying
   * opacity variations to the primary text color:
   * - `textSecondary`: 70% opacity of primary
   * - `textMuted`: 45% opacity of primary
   *
   * @param textColor - Hex color string for the primary text
   * @returns TextColors object with textPrimary, textSecondary, textMuted
   *
   * @precondition textColor is a valid hex color (#RGB, #RRGGBB, or #RRGGBBAA)
   * @postcondition Returns TextColors with all fields populated
   * @postcondition textSecondary is at 70% opacity of textPrimary
   * @postcondition textMuted is at 45% opacity of textPrimary
   *
   * @example
   * ```typescript
   * const textColors = ThemeFactory.deriveTextColors("#ffffff");
   * // {
   * //   textPrimary: "#ffffff",
   * //   textSecondary: "rgba(255, 255, 255, 0.7)",
   * //   textMuted: "rgba(255, 255, 255, 0.45)"
   * // }
   * ```
   *
   * @see Requirements: 12.4, 12.5
   */
  static deriveTextColors(textColor: string): TextColors {
    const { r, g, b } = hexToRgb(textColor);

    return {
      textPrimary: textColor,
      textSecondary: `rgba(${r}, ${g}, ${b}, 0.7)`,
      textMuted: `rgba(${r}, ${g}, ${b}, 0.45)`,
    };
  }

  /**
   * Derives a card border color from an accent color.
   *
   * Creates a border color at 25% opacity of the accent color,
   * suitable for subtle card borders that complement the theme.
   *
   * @param accentColor - Hex color string for the accent
   * @returns Card border color as rgba string
   *
   * @example
   * ```typescript
   * const border = ThemeFactory.deriveCardBorder("#6366f1");
   * // "rgba(99, 102, 241, 0.25)"
   * ```
   *
   * @see Requirements: 12.6
   */
  static deriveCardBorder(accentColor: string): string {
    const { r, g, b } = hexToRgb(accentColor);
    return `rgba(${r}, ${g}, ${b}, 0.25)`;
  }

  /**
   * Validates a theme object.
   *
   * Performs comprehensive validation including:
   * - Required field presence
   * - Category validity
   * - Color format validation
   * - Font weight validation
   * - Border radius validation
   *
   * @param theme - The theme object to validate
   * @returns Validation result with errors array
   */
  private static validateTheme(theme: Theme): ThemeValidationResult {
    const errors: ThemeValidationErrorDetail[] = [];

    // Check for required fields
    for (const field of REQUIRED_THEME_FIELDS) {
      if (!(field in theme) || theme[field] === undefined || theme[field] === null) {
        errors.push({
          field,
          message: `Missing required field: ${field}`,
          value: theme[field as keyof Theme],
        });
      }
    }

    // Validate category
    if (!VALID_CATEGORIES.includes(theme.category)) {
      errors.push({
        field: "category",
        message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`,
        value: theme.category,
      });
    }

    // Validate borderRadius is non-negative
    if (typeof theme.borderRadius !== "number" || theme.borderRadius < 0) {
      errors.push({
        field: "borderRadius",
        message: "borderRadius must be a non-negative number",
        value: theme.borderRadius,
      });
    }

    // Validate headingWeight is valid font weight (100-900)
    if (
      typeof theme.headingWeight !== "number" ||
      theme.headingWeight < 100 ||
      theme.headingWeight > 900 ||
      theme.headingWeight % 100 !== 0
    ) {
      errors.push({
        field: "headingWeight",
        message: "headingWeight must be a valid font weight (100-900, in increments of 100)",
        value: theme.headingWeight,
      });
    }

    // Validate bodyWeight is valid font weight (100-900)
    if (
      typeof theme.bodyWeight !== "number" ||
      theme.bodyWeight < 100 ||
      theme.bodyWeight > 900 ||
      theme.bodyWeight % 100 !== 0
    ) {
      errors.push({
        field: "bodyWeight",
        message: "bodyWeight must be a valid font weight (100-900, in increments of 100)",
        value: theme.bodyWeight,
      });
    }

    // Validate fontFamily is a non-empty string
    if (typeof theme.fontFamily !== "string" || theme.fontFamily.trim() === "") {
      errors.push({
        field: "fontFamily",
        message: "fontFamily must be a non-empty string",
        value: theme.fontFamily,
      });
    }

    // Validate color fields
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

    for (const field of colorOnlyFields) {
      const value = theme[field];
      if (typeof value === "string" && !isValidCssColor(value)) {
        errors.push({
          field,
          message: `${field} must be a valid CSS color (hex, rgb, rgba, hsl, hsla)`,
          value,
        });
      }
    }

    // Validate bg and accentGradient (can be color or gradient)
    const colorOrGradientFields: (keyof Theme)[] = ["bg", "accentGradient"];
    for (const field of colorOrGradientFields) {
      const value = theme[field];
      if (typeof value === "string" && !isValidColorOrGradient(value)) {
        errors.push({
          field,
          message: `${field} must be a valid CSS color or gradient`,
          value,
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Creates a new theme by applying BrandKit overrides to a base theme.
   *
   * Applies custom brand colors and typography from a BrandKit to a base theme,
   * deriving secondary colors automatically. The original base theme is NOT mutated.
   *
   * Color derivation rules:
   * - `primaryColor` → `accent`, `accentSecondary`, `accentGradient`, `cardBorder`
   * - `bgColor` → `bg`, `bgSecondary`, `bgGlass`, `cardShadow`
   * - `textColor` → `textPrimary`, `textSecondary`, `textMuted`
   * - `fontFamily` → `fontFamily`
   *
   * @param baseTheme - The base theme to apply overrides to
   * @param brandKit - Optional BrandKit with color and typography overrides
   * @returns A new Theme with BrandKit colors applied
   *
   * @precondition baseTheme is a valid Theme object
   * @precondition brandKit contains valid color values (if provided)
   * @postcondition Returns new Theme with brandKit colors applied
   * @postcondition Original baseTheme is NOT mutated
   * @postcondition Applying twice produces same result as once (idempotent)
   *
   * @example
   * ```typescript
   * const gameDayBrandKit: BrandKit = {
   *   primaryColor: "#6c3fa0",
   *   secondaryColor: "#d946ef",
   *   bgColor: "#0c0820",
   *   textColor: "#ffffff",
   * };
   *
   * const customTheme = ThemeFactory.createFromBrandKit(darkTheme, gameDayBrandKit);
   * ```
   *
   * @see Requirements: 11.1-11.8
   */
  static createFromBrandKit(baseTheme: Theme, brandKit?: BrandKit): Theme {
    // Return base theme unchanged when BrandKit is undefined or empty
    if (!brandKit) {
      return baseTheme;
    }

    // Check if BrandKit has any meaningful values
    const hasValues =
      brandKit.primaryColor ||
      brandKit.secondaryColor ||
      brandKit.accentColor ||
      brandKit.bgColor ||
      brandKit.textColor ||
      brandKit.fontFamily;

    if (!hasValues) {
      return baseTheme;
    }

    // Create a shallow copy of the base theme to avoid mutation
    const result: Theme = { ...baseTheme };

    // Apply primary color → accent + gradient
    if (brandKit.primaryColor) {
      const secondary =
        brandKit.secondaryColor ??
        brandKit.accentColor ??
        baseTheme.accentSecondary;

      result.accent = brandKit.primaryColor;
      result.accentSecondary = secondary;
      result.accentGradient = `linear-gradient(135deg, ${brandKit.primaryColor}, ${secondary})`;

      // Derive cardBorder at 25% opacity of primary color
      const { r, g, b } = hexToRgb(brandKit.primaryColor);
      result.cardBorder = `rgba(${r}, ${g}, ${b}, 0.25)`;
    }

    // Apply background color → bg + derived colors
    if (brandKit.bgColor) {
      const { r, g, b } = hexToRgb(brandKit.bgColor);
      const isLight = calculateLuminance(r, g, b) > 0.18;
      const shift = isLight ? -14 : 22;

      result.bg = brandKit.bgColor;
      result.bgSecondary = shiftColor(brandKit.bgColor, shift);
      result.bgGlass = `rgba(${r}, ${g}, ${b}, 0.55)`;
      result.cardShadow = isLight
        ? "0 4px 24px rgba(0,0,0,0.10)"
        : "0 4px 24px rgba(0,0,0,0.45)";
    }

    // Apply text color → textPrimary + derived
    if (brandKit.textColor) {
      const { r, g, b } = hexToRgb(brandKit.textColor);
      result.textPrimary = brandKit.textColor;
      result.textSecondary = `rgba(${r}, ${g}, ${b}, 0.7)`;
      result.textMuted = `rgba(${r}, ${g}, ${b}, 0.45)`;
    }

    // Apply font family
    if (brandKit.fontFamily) {
      result.fontFamily = brandKit.fontFamily;
    }

    // Freeze and return the new theme
    return ThemeFactory.deepFreeze(result);
  }

  /**
   * Validates color values in a partial theme object.
   *
   * Performs comprehensive validation of color fields including:
   * - Hex colors (#RGB, #RRGGBB, #RRGGBBAA)
   * - RGB colors (rgb(r, g, b))
   * - RGBA colors (rgba(r, g, b, a))
   * - HSL colors (hsl(h, s%, l%))
   * - HSLA colors (hsla(h, s%, l%, a))
   * - CSS gradients for bg and accentGradient fields
   *
   * @param colors - Partial theme object with color values to validate
   * @returns ValidationResult with valid boolean and errors array
   *
   * @precondition colors is an object (may be empty)
   * @postcondition Returns ValidationResult with all validation errors
   * @postcondition Does not throw - returns errors in result object
   *
   * @example
   * ```typescript
   * const result = ThemeFactory.validateColors({
   *   accent: "#ff6600",
   *   bg: "linear-gradient(135deg, #6366f1, #ec4899)",
   *   textPrimary: "invalid-color",
   * });
   *
   * if (!result.valid) {
   *   console.log(result.errors);
   *   // [{ field: "textPrimary", message: "...", value: "invalid-color" }]
   * }
   * ```
   *
   * @see Requirements: 13.1-13.3
   */
  static validateColors(colors: Partial<Theme>): ThemeValidationResult {
    const errors: ThemeValidationErrorDetail[] = [];

    // Color-only fields (must be valid CSS colors, not gradients)
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

    // Fields that can be either colors or gradients
    const colorOrGradientFields: (keyof Theme)[] = ["bg", "accentGradient"];

    // Validate color-only fields
    for (const field of colorOnlyFields) {
      const value = colors[field];
      if (value !== undefined && value !== null) {
        if (typeof value !== "string") {
          errors.push({
            field,
            message: `${field} must be a string`,
            value,
          });
        } else if (!isValidCssColor(value)) {
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
      const value = colors[field];
      if (value !== undefined && value !== null) {
        if (typeof value !== "string") {
          errors.push({
            field,
            message: `${field} must be a string`,
            value,
          });
        } else if (!isValidColorOrGradient(value)) {
          errors.push({
            field,
            message: `${field} must be a valid CSS color or gradient`,
            value,
          });
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Deeply freezes an object and all nested objects.
   *
   * @param obj - The object to freeze
   * @returns The frozen object
   */
  private static deepFreeze<T extends object>(obj: T): T {
    const propNames = Object.getOwnPropertyNames(obj) as (keyof T)[];

    for (const name of propNames) {
      const value = obj[name];
      if (value && typeof value === "object" && !Object.isFrozen(value)) {
        ThemeFactory.deepFreeze(value as object);
      }
    }

    return Object.freeze(obj);
  }
}
