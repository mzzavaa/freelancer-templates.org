/**
 * Theme Presets
 *
 * Pre-defined theme configurations for the configuration-based theme framework.
 * These themes are migrated from the PRESET_THEMES constant in ThemeFactory
 * and conform to the Theme interface.
 *
 * Themes are organized by category:
 * - Original: Core themes shipped with the framework (dark, clean, bold, warm, minimal, neon)
 * - Extended: Additional themes extending the original set (ocean, sunset, forest, rose, gold, midnight)
 *
 * @module themes/presets
 * @see Requirements: 1.1, 1.7, 10.2, 10.3
 */

import type { Theme, ThemePreset } from "../types";

// Import GameDay theme for inclusion in presets
import { THEME_GAMEDAY } from "./gameday";

// Re-export GameDay theme and related exports
export {
  THEME_GAMEDAY,
  GAMEDAY_STATUS_COLORS,
  GAMEDAY_COLORS,
} from "./gameday";

// ══════════════════════════════════════════════════════════════════════════════
// ORIGINAL THEMES
// Core themes shipped with the framework
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Dark theme - Deep dark background with purple/pink accents.
 *
 * A sophisticated dark theme with indigo and purple accent colors,
 * suitable for modern, professional applications.
 *
 * @see Requirements: 1.1, 10.2
 */
export const THEME_DARK: Theme = {
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
};

/**
 * Bold theme - High contrast dark theme with vibrant purple/pink accents.
 *
 * A bold, impactful theme with strong purple accents and high contrast,
 * designed for attention-grabbing content.
 *
 * @see Requirements: 1.1, 10.2
 */
export const THEME_BOLD: Theme = {
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
};

/**
 * Clean theme - Light, professional theme with blue accents.
 *
 * A clean, minimalist light theme with blue accents,
 * ideal for professional and corporate content.
 *
 * @see Requirements: 1.1, 10.2
 */
export const THEME_CLEAN: Theme = {
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
};

/**
 * Warm theme - Dark theme with warm orange/red gradient background.
 *
 * A warm, inviting theme with orange and red accents,
 * creating a cozy, energetic atmosphere.
 *
 * @see Requirements: 1.1, 10.2
 */
export const THEME_WARM: Theme = {
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
};

/**
 * Minimal theme - Ultra-clean light theme with subtle gray accents.
 *
 * A minimalist theme with muted colors and subtle shadows,
 * perfect for content-focused designs.
 *
 * @see Requirements: 1.1, 10.2
 */
export const THEME_MINIMAL: Theme = {
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
};

/**
 * Neon theme - Dark theme with vibrant green/cyan neon accents.
 *
 * A high-energy theme with glowing neon green and cyan accents,
 * inspired by cyberpunk and retro-futuristic aesthetics.
 *
 * @see Requirements: 1.1, 10.2
 */
export const THEME_NEON: Theme = {
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
};

// ══════════════════════════════════════════════════════════════════════════════
// EXTENDED THEMES
// Additional themes extending the original set
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Ocean theme - Deep blue/cyan theme inspired by the sea.
 *
 * A calming theme with cyan and teal accents,
 * evoking the depths of the ocean.
 *
 * @see Requirements: 1.1, 10.2
 */
export const THEME_OCEAN: Theme = {
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
};

/**
 * Sunset theme - Warm pink/orange theme inspired by sunset colors.
 *
 * A romantic theme with pink and orange accents,
 * capturing the warmth of a sunset.
 *
 * @see Requirements: 1.1, 10.2
 */
export const THEME_SUNSET: Theme = {
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
};

/**
 * Forest theme - Deep green theme inspired by nature.
 *
 * A natural theme with green accents,
 * evoking the tranquility of a forest.
 *
 * @see Requirements: 1.1, 10.2
 */
export const THEME_FOREST: Theme = {
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
};

/**
 * Rose theme - Deep red/pink theme with romantic vibes.
 *
 * A passionate theme with rose and pink accents,
 * perfect for romantic or bold content.
 *
 * @see Requirements: 1.1, 10.2
 */
export const THEME_ROSE: Theme = {
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
};

/**
 * Gold theme - Luxurious dark theme with gold/amber accents.
 *
 * A premium theme with gold and amber accents,
 * conveying luxury and elegance.
 *
 * @see Requirements: 1.1, 10.2
 */
export const THEME_GOLD: Theme = {
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
};

/**
 * Midnight theme - Deep blue theme with subtle blue accents.
 *
 * A sophisticated dark blue theme,
 * evoking the calm of a midnight sky.
 *
 * @see Requirements: 1.1, 10.2
 */
export const THEME_MIDNIGHT: Theme = {
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
};

// ══════════════════════════════════════════════════════════════════════════════
// THEME PRESETS COLLECTION
// Bulk registration object for all themes
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Original themes preset collection.
 *
 * Contains all core themes shipped with the framework.
 *
 * @see Requirements: 1.7
 */
export const ORIGINAL_THEMES_PRESET: ThemePreset = {
  name: "original",
  category: "original",
  themes: {
    dark: THEME_DARK,
    bold: THEME_BOLD,
    clean: THEME_CLEAN,
    warm: THEME_WARM,
    minimal: THEME_MINIMAL,
    neon: THEME_NEON,
  },
};

/**
 * Extended themes preset collection.
 *
 * Contains additional themes extending the original set.
 *
 * @see Requirements: 1.7
 */
export const EXTENDED_THEMES_PRESET: ThemePreset = {
  name: "extended",
  category: "extended",
  themes: {
    ocean: THEME_OCEAN,
    sunset: THEME_SUNSET,
    forest: THEME_FOREST,
    rose: THEME_ROSE,
    gold: THEME_GOLD,
    midnight: THEME_MIDNIGHT,
  },
};

/**
 * Custom themes preset collection.
 *
 * Contains custom themes for specific use cases like GameDay.
 *
 * @see Requirements: 1.7, 11.1-11.8
 */
export const CUSTOM_THEMES_PRESET: ThemePreset = {
  name: "custom",
  category: "custom",
  themes: {
    gameday: THEME_GAMEDAY,
  },
};

/**
 * All theme presets combined for bulk registration.
 *
 * This object contains all themes organized by their lowercase name,
 * suitable for registering with ThemeRegistry.registerPreset() or
 * for direct lookup by theme name.
 *
 * @example
 * ```typescript
 * // Register all themes at once
 * Object.values(THEME_PRESETS).forEach(theme => {
 *   themeRegistry.registerTheme(theme.name, theme);
 * });
 *
 * // Or access a specific theme
 * const oceanTheme = THEME_PRESETS.ocean;
 * ```
 *
 * @see Requirements: 1.7, 10.2, 10.3
 */
export const THEME_PRESETS: Record<string, Theme> = {
  // Original themes
  dark: THEME_DARK,
  bold: THEME_BOLD,
  clean: THEME_CLEAN,
  warm: THEME_WARM,
  minimal: THEME_MINIMAL,
  neon: THEME_NEON,
  // Extended themes
  ocean: THEME_OCEAN,
  sunset: THEME_SUNSET,
  forest: THEME_FOREST,
  rose: THEME_ROSE,
  gold: THEME_GOLD,
  midnight: THEME_MIDNIGHT,
  // Custom themes
  gameday: THEME_GAMEDAY,
};

/**
 * Array of all theme presets for iteration.
 *
 * @example
 * ```typescript
 * // Iterate over all themes
 * ALL_THEME_PRESETS.forEach(theme => {
 *   console.log(`Theme: ${theme.name}, Category: ${theme.category}`);
 * });
 * ```
 *
 * @see Requirements: 1.7
 */
export const ALL_THEME_PRESETS: Theme[] = Object.values(THEME_PRESETS);

/**
 * Array of all theme preset names.
 *
 * @example
 * ```typescript
 * // Get all available theme names
 * console.log(THEME_PRESET_NAMES);
 * // ["dark", "bold", "clean", "warm", "minimal", "neon", "ocean", ...]
 * ```
 *
 * @see Requirements: 10.3
 */
export const THEME_PRESET_NAMES: string[] = Object.keys(THEME_PRESETS);
