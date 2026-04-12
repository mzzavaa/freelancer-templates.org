/**
 * GameDay Theme Preset
 *
 * Custom theme for GameDay templates using the official GameDay color palette.
 * This theme is designed for AWS GameDay events and includes status colors
 * for fixed/broken indicators.
 *
 * @module themes/presets/gameday
 * @see Requirements: 11.1-11.8
 */

import type { Theme } from "../types";

// ══════════════════════════════════════════════════════════════════════════════
// GAMEDAY COLOR PALETTE
// Reference colors from src/remotion/GameDay/src/design/colors.ts
// ══════════════════════════════════════════════════════════════════════════════

/**
 * GameDay color constants for reference.
 * These match the values in src/remotion/GameDay/src/design/colors.ts
 */
const GD_DARK = "#0c0820"; // Background
const GD_PURPLE = "#6c3fa0"; // Primary accent
const GD_VIOLET = "#8b5cf6"; // Secondary accent
const GD_PINK = "#d946ef"; // Accent gradient end
const GD_ACCENT = "#c084fc"; // Accent secondary
const GD_ORANGE = "#ff9900"; // AWS orange, highlights
const GD_GOLD = "#fbbf24"; // Gold accents
const GD_GREEN = "#22c55e"; // Success/fixed status
const GD_RED = "#ef4444"; // Error/broken status

// ══════════════════════════════════════════════════════════════════════════════
// GAMEDAY THEME
// ══════════════════════════════════════════════════════════════════════════════

/**
 * GameDay theme - Deep purple theme with AWS GameDay branding.
 *
 * A custom theme designed for AWS GameDay events featuring the official
 * GameDay color palette with purple/pink gradients and AWS orange highlights.
 * Includes status colors for fixed/broken indicators commonly used in
 * GameDay dashboards and status displays.
 *
 * Color Mapping:
 * - Background: GD_DARK (#0c0820)
 * - Primary Accent: GD_PURPLE (#6c3fa0)
 * - Secondary Accent: GD_VIOLET (#8b5cf6)
 * - Gradient: GD_PURPLE → GD_PINK
 * - Highlights: GD_ORANGE (#ff9900) - AWS orange
 * - Success: GD_GREEN (#22c55e)
 * - Error: GD_RED (#ef4444)
 *
 * @see Requirements: 11.1-11.8
 */
export const THEME_GAMEDAY: Theme = {
  // ── Identity ──────────────────────────────────────────────────────
  name: "gameday",
  category: "custom",

  // ── Backgrounds ───────────────────────────────────────────────────
  /** Deep dark purple background */
  bg: GD_DARK,
  /** Slightly lighter purple for cards and panels */
  bgSecondary: "rgba(108, 63, 160, 0.08)",
  /** Glassmorphism background with purple tint */
  bgGlass: "rgba(108, 63, 160, 0.12)",

  // ── Text Colors ───────────────────────────────────────────────────
  /** Bright white for maximum contrast on dark background */
  textPrimary: "#ffffff",
  /** Light purple-tinted secondary text */
  textSecondary: GD_ACCENT,
  /** Muted violet for captions and metadata */
  textMuted: GD_VIOLET,

  // ── Accent Colors ─────────────────────────────────────────────────
  /** Primary purple accent */
  accent: GD_PURPLE,
  /** Violet secondary accent */
  accentSecondary: GD_VIOLET,
  /** Purple to pink gradient for badges and CTAs */
  accentGradient: `linear-gradient(135deg, ${GD_PURPLE}, ${GD_PINK})`,

  // ── Card Styles ───────────────────────────────────────────────────
  /** Purple border with reduced opacity */
  cardBorder: "rgba(108, 63, 160, 0.35)",
  /** Deep shadow with purple tint */
  cardShadow: "0 4px 24px rgba(108, 63, 160, 0.25)",
  /** Rounded corners for modern look */
  borderRadius: 12,

  // ── Typography ────────────────────────────────────────────────────
  /** Inter font family for clean, modern text */
  fontFamily: "'Inter', sans-serif",
  /** Bold headings for impact */
  headingWeight: 800,
  /** Normal body weight for readability */
  bodyWeight: 400,
};

/**
 * GameDay status colors for use in templates.
 *
 * These colors are used for status indicators in GameDay dashboards
 * and should be used consistently across all GameDay templates.
 *
 * @example
 * ```typescript
 * // Use for success/fixed status
 * const successStyle = { color: GAMEDAY_STATUS_COLORS.success };
 *
 * // Use for error/broken status
 * const errorStyle = { color: GAMEDAY_STATUS_COLORS.error };
 * ```
 */
export const GAMEDAY_STATUS_COLORS = {
  /** Green for success, fixed, working states */
  success: GD_GREEN,
  /** Red for error, broken, problem states */
  error: GD_RED,
  /** Orange for warnings, highlights, AWS branding */
  warning: GD_ORANGE,
  /** Gold for achievements, special highlights */
  gold: GD_GOLD,
} as const;

/**
 * GameDay color palette export for direct access.
 *
 * Provides access to all GameDay colors for use in custom components
 * or when building GameDay-specific UI elements.
 */
export const GAMEDAY_COLORS = {
  dark: GD_DARK,
  purple: GD_PURPLE,
  violet: GD_VIOLET,
  pink: GD_PINK,
  accent: GD_ACCENT,
  orange: GD_ORANGE,
  gold: GD_GOLD,
  green: GD_GREEN,
  red: GD_RED,
} as const;
