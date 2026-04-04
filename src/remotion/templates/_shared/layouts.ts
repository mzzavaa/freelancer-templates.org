/**
 * Layout Constants & Helpers
 * 
 * Safe zones, typography scale, and layout utilities shared across all templates.
 * These match the project's steering rules (scene-patterns.md).
 */

// ── Safe Zones ──────────────────────────────────────────────────
export const PADDING = 80;       // left/right margin
export const PADDING_NARROW = 48; // tighter padding for cards
export const TOP_SAFE = 48;      // top margin

// ── Typography Scale ────────────────────────────────────────────
// Base scale calibrated for DATA-DENSE layouts (Recap, SprintDashboard,
// BugTracker, etc.) at 1280×720. For spacious/hero compositions, pass
// fontScale > 1.0 via the composition prop and use makeType(fontScale).
//
// The two smallest values were raised +10px per design review:
//   caption: 14 → 24   label: 16 → 26
// All other values are minimal changes to avoid overflow in dense layouts.
// Override per-theme via the Theme.headingWeight / bodyWeight.
export const TYPE = {
  hero: 68,          // main headline (hero scenes)
  title: 48,         // section titles
  subtitle: 28,      // secondary lines (+2 from original)
  stat: 56,          // large numbers (CountUp)
  cardTitle: 24,     // card headings (must stay small for 4-col grids)
  body: 24,          // body text / descriptions (+4 from original)
  label: 26,         // small labels, badges (+10 from original)
  caption: 24,       // fine print, timestamps (+10 from original, min)
} as const;

/**
 * Scale the TYPE system by a multiplier. Use this in every composition
 * that accepts a `fontScale` prop so users can adjust in Remotion Studio.
 *
 * Dense layouts (Recap dashboard, SprintDashboard): fontScale = 1.0 (default)
 * Spacious/hero layouts (TitleScreen, single-stat): fontScale = 1.2–1.4
 *
 * @example
 *   const T = makeType(props.fontScale ?? 1.0);
 *   <div style={{ fontSize: T.hero }}>...</div>
 */
export function makeType(fontScale: number): typeof TYPE {
  return {
    hero: Math.round(TYPE.hero * fontScale),
    title: Math.round(TYPE.title * fontScale),
    subtitle: Math.round(TYPE.subtitle * fontScale),
    stat: Math.round(TYPE.stat * fontScale),
    cardTitle: Math.round(TYPE.cardTitle * fontScale),
    body: Math.round(TYPE.body * fontScale),
    label: Math.round(TYPE.label * fontScale),
    caption: Math.round(TYPE.caption * fontScale),
  };
}

// ── Grid Helpers ────────────────────────────────────────────────
// Common grid configurations for card layouts.
export const GRID = {
  /** 2-column grid with 16px gap */
  twoCol: { display: "grid" as const, gridTemplateColumns: "1fr 1fr", gap: 16 },
  /** 3-column grid with 16px gap */
  threeCol: { display: "grid" as const, gridTemplateColumns: "1fr 1fr 1fr", gap: 16 },
  /** 2×2 grid with 16px gap */
  twoByTwo: { display: "grid" as const, gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 16 },
} as const;

// ── Dimensions ──────────────────────────────────────────────────
// Standard video dimensions. Don't change these.
export const VIDEO = {
  width: 1280,
  height: 720,
  fps: 30,
} as const;
