/**
 * Theme System - Color Palettes & Typography
 * 
 * Each theme defines a complete visual identity: background, text colors,
 * accent colors, card styles, and font weights.
 * 
 * To create a new theme variant for any template:
 *   1. Pick a base theme below (or create a new one)
 *   2. Pass it as the `theme` prop to the template component
 *   3. The template reads colors/fonts from the theme object
 * 
 * ADDING A NEW THEME:
 *   Copy an existing theme object, change the name and colors.
 *   All templates that accept a Theme will automatically support it.
 */

export interface Theme {
  name: string;
  // Backgrounds
  bg: string;                    // main background color or gradient
  bgSecondary: string;           // card/panel background
  bgGlass: string;               // glassmorphism card bg (with alpha)
  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  // Accents
  accent: string;                // primary accent (buttons, highlights)
  accentSecondary: string;       // secondary accent (gradients, borders)
  accentGradient: string;        // CSS gradient string for badges/CTAs
  // Cards
  cardBorder: string;
  cardShadow: string;
  borderRadius: number;          // card/element border radius (0 for flat/edge designs)
  // Typography
  fontFamily: string;
  headingWeight: number;
  bodyWeight: number;
}

// ── Dark Professional ───────────────────────────────────────────
// The default project theme. Dark bg, indigo→pink gradient accents.
export const THEME_DARK: Theme = {
  name: "dark",
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

// ── Clean / Light ───────────────────────────────────────────────
// White background, corporate feel. Good for proposals & reports.
export const THEME_CLEAN: Theme = {
  name: "clean",
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

// ── Bold / Confident ────────────────────────────────────────────
// Dark bg, large text, strong gradient accents. High impact.
export const THEME_BOLD: Theme = {
  name: "bold",
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

// ── Warm / Friendly ─────────────────────────────────────────────
// Soft gradient bg, coral/orange accents. Approachable feel.
export const THEME_WARM: Theme = {
  name: "warm",
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

// ── Minimal / Understated ───────────────────────────────────────
// Near-white bg, thin lines, lots of whitespace. Elegant.
export const THEME_MINIMAL: Theme = {
  name: "minimal",
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

// ── Neon / Energetic ────────────────────────────────────────────
// Dark bg, neon glow accents, cyberpunk feel. For creative/tech.
export const THEME_NEON: Theme = {
  name: "neon",
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

// ── Linda Mohamed / Corporate Green ─────────────────────────────
// White bg, dark green accents, black text. Clean corporate style
// matching the Packages & Workshops slide deck design language.
export const THEME_LINDAMOHAMED: Theme = {
  name: "lindamohamed",
  bg: "#ffffff",
  bgSecondary: "#f5f7f5",
  bgGlass: "rgba(46,125,50,0.06)",
  textPrimary: "#1a1a1a",
  textSecondary: "#4a4a4a",
  textMuted: "#8a8a8a",
  accent: "#2E7D32",
  accentSecondary: "#43A047",
  accentGradient: "linear-gradient(135deg, #2E7D32, #66BB6A)",
  cardBorder: "rgba(46,125,50,0.2)",
  cardShadow: "0 2px 12px rgba(0,0,0,0.08)",
  borderRadius: 12,
  fontFamily: "'Inter', sans-serif",
  headingWeight: 700,
  bodyWeight: 400,
};

// ── Ocean / Teal Professional ────────────────────────────────────
// Dark navy bg, teal/aqua accents. Tech-forward, trustworthy, calm.
// Popular with SaaS builders, cloud consultants, dev-tool freelancers.
export const THEME_OCEAN: Theme = {
  name: "ocean",
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

// ── Sunset / Vibrant Creative ────────────────────────────────────
// Warm dark bg, hot pink + orange gradient. Energetic, bold, trendy.
// Dominant preference for content creators, social media managers, marketers.
export const THEME_SUNSET: Theme = {
  name: "sunset",
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

// ── Forest / Nature & Growth ─────────────────────────────────────
// Very dark green base, emerald/lime accents. Grounded, sustainable.
// Top color for wellness coaches, eco-consultants, health/fitness brands.
export const THEME_FOREST: Theme = {
  name: "forest",
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

// ── Rose / Bold Design ───────────────────────────────────────────
// Deep rose bg, crimson/rose accents. Passionate, design-forward, editorial.
// #1 preference for graphic designers, fashion, and lifestyle freelancers.
export const THEME_ROSE: Theme = {
  name: "rose",
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

// ── Gold / Premium Consulting ────────────────────────────────────
// Near-black bg, rich amber/gold accents. Luxe positioning, authority.
// Preferred by executive coaches, strategy consultants, keynote speakers.
export const THEME_GOLD: Theme = {
  name: "gold",
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

// ── Midnight / Deep Corporate ────────────────────────────────────
// Navy base, electric blue accents. B2B, finance, legal, enterprise.
// Highest trust score in corporate & financial services branding studies.
export const THEME_MIDNIGHT: Theme = {
  name: "midnight",
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

// ── Crimson / High Impact ────────────────────────────────────────
// Very dark red bg, crimson + orange accents. Urgency, power, bold.
// Highest click-through rates on CTAs and sales-focused content.
export const THEME_CRIMSON: Theme = {
  name: "crimson",
  bg: "#1a0000",
  bgSecondary: "rgba(220,38,38,0.06)",
  bgGlass: "rgba(220,38,38,0.08)",
  textPrimary: "#fff1f2",
  textSecondary: "#fca5a5",
  textMuted: "#7f1d1d",
  accent: "#dc2626",
  accentSecondary: "#f97316",
  accentGradient: "linear-gradient(135deg, #dc2626, #f97316)",
  cardBorder: "rgba(220,38,38,0.25)",
  cardShadow: "0 8px 32px rgba(220,38,38,0.2)",
  borderRadius: 12,
  fontFamily: "'Inter', sans-serif",
  headingWeight: 900,
  bodyWeight: 500,
};

// ── Lavender / Soft Creative ─────────────────────────────────────
// Deep purple bg, soft violet/pink accents. Creative, calm, spiritual.
// Preferred by life coaches, wellness practitioners, creative consultants.
export const THEME_LAVENDER: Theme = {
  name: "lavender",
  bg: "#0d0414",
  bgSecondary: "rgba(167,139,250,0.06)",
  bgGlass: "rgba(167,139,250,0.08)",
  textPrimary: "#faf5ff",
  textSecondary: "#d8b4fe",
  textMuted: "#581c87",
  accent: "#a78bfa",
  accentSecondary: "#f0abfc",
  accentGradient: "linear-gradient(135deg, #7c3aed, #a78bfa)",
  cardBorder: "rgba(167,139,250,0.2)",
  cardShadow: "0 4px 24px rgba(124,58,237,0.2)",
  borderRadius: 12,
  fontFamily: "'Inter', sans-serif",
  headingWeight: 700,
  bodyWeight: 400,
};

// ── Arctic / Ice Clean ───────────────────────────────────────────
// Crisp light bg, sky blue accents. Precise, cool, minimal-professional.
// Top preference for SaaS founders, technical writers, minimalist brands.
export const THEME_ARCTIC: Theme = {
  name: "arctic",
  bg: "#f0f9ff",
  bgSecondary: "#e0f2fe",
  bgGlass: "rgba(14,165,233,0.08)",
  textPrimary: "#0c4a6e",
  textSecondary: "#0369a1",
  textMuted: "#7dd3fc",
  accent: "#0ea5e9",
  accentSecondary: "#38bdf8",
  accentGradient: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
  cardBorder: "rgba(14,165,233,0.2)",
  cardShadow: "0 4px 24px rgba(14,165,233,0.1)",
  borderRadius: 12,
  fontFamily: "'Inter', sans-serif",
  headingWeight: 700,
  bodyWeight: 400,
};

// ── Espresso / Warm Personal Brand ──────────────────────────────
// Warm dark brown bg, caramel/amber accents. Cozy, personal, approachable.
// Highest engagement for personal brand coaches, lifestyle & food content.
export const THEME_ESPRESSO: Theme = {
  name: "espresso",
  bg: "#0f0a05",
  bgSecondary: "rgba(146,64,14,0.08)",
  bgGlass: "rgba(146,64,14,0.1)",
  textPrimary: "#fef3c7",
  textSecondary: "#d97706",
  textMuted: "#78350f",
  accent: "#b45309",
  accentSecondary: "#d97706",
  accentGradient: "linear-gradient(135deg, #92400e, #d97706)",
  cardBorder: "rgba(180,83,9,0.3)",
  cardShadow: "0 4px 24px rgba(146,64,14,0.2)",
  borderRadius: 12,
  fontFamily: "'Inter', sans-serif",
  headingWeight: 700,
  bodyWeight: 400,
};

// ── Corporate Banking / Vienna Boardroom ─────────────────────────
// Deep navy bg, warm gold accents, IBM Plex Sans. Formal and authoritative.
// Modelled on central-European corporate banking visual identity systems.
export const THEME_CORPORATE: Theme = {
  name: "corporate",
  bg: "#0a1628",
  bgSecondary: "rgba(200,169,78,0.06)",
  bgGlass: "rgba(200,169,78,0.08)",
  textPrimary: "#f8f6ef",
  textSecondary: "#faf8f0",
  textMuted: "#5a6a7a",
  accent: "#c8a94e",
  accentSecondary: "#e8c97a",
  accentGradient: "linear-gradient(135deg, #c8a94e, #e8c97a)",
  cardBorder: "rgba(200,169,78,0.22)",
  cardShadow: "0 4px 24px rgba(0,0,0,0.45)",
  borderRadius: 12,
  fontFamily: "'IBM Plex Sans', sans-serif",
  headingWeight: 600,
  bodyWeight: 400,
};

// ── Industrial / Energy & Infrastructure ─────────────────────────
// Dark slate bg, muted steel teal accent, Space Grotesk. Geometric and precise.
// Draws from industrial design systems: flat, structured, no decorative flourishes.
export const THEME_INDUSTRIAL: Theme = {
  name: "industrial",
  bg: "#0d1b2a",
  bgSecondary: "rgba(46,139,139,0.06)",
  bgGlass: "rgba(46,139,139,0.08)",
  textPrimary: "#e4f0f0",
  textSecondary: "#8ab4b4",
  textMuted: "#3e5f5f",
  accent: "#2e8b8b",
  accentSecondary: "#4ab8b8",
  accentGradient: "linear-gradient(135deg, #2e8b8b, #4ab8b8)",
  cardBorder: "rgba(46,139,139,0.22)",
  cardShadow: "0 4px 24px rgba(0,0,0,0.38)",
  borderRadius: 12,
  fontFamily: "'Space Grotesk', sans-serif",
  headingWeight: 700,
  bodyWeight: 400,
};

// ── Vienna Modern / Cultural & Creative Institutions ─────────────
// Deep charcoal bg, lavender/violet accents, sharp Inter typography.
// Inspired by the graphic language of Viennese Secession — contrast and clarity.
export const THEME_VIENNA: Theme = {
  name: "vienna",
  bg: "#1a1a2e",
  bgSecondary: "rgba(167,139,250,0.06)",
  bgGlass: "rgba(167,139,250,0.08)",
  textPrimary: "#f0ecff",
  textSecondary: "#c4b5fd",
  textMuted: "#4c3a6e",
  accent: "#a78bfa",
  accentSecondary: "#7c3aed",
  accentGradient: "linear-gradient(135deg, #7c3aed, #a78bfa)",
  cardBorder: "rgba(167,139,250,0.2)",
  cardShadow: "0 4px 24px rgba(124,58,237,0.2)",
  borderRadius: 12,
  fontFamily: "'Inter', sans-serif",
  headingWeight: 700,
  bodyWeight: 400,
};

// ── Alpine / Clean Precision ──────────────────────────────────────
// Off-white bg, deep teal accent, DM Serif Display editorial typography.
// The visual register of high-end Alpine hospitality and consultancy brands.
export const THEME_ALPINE: Theme = {
  name: "alpine",
  bg: "#f8fafb",
  bgSecondary: "#ffffff",
  bgGlass: "rgba(13,107,110,0.06)",
  textPrimary: "#0d2b2c",
  textSecondary: "#1a4a4b",
  textMuted: "#6b9a9b",
  accent: "#0d6b6e",
  accentSecondary: "#1a9a9e",
  accentGradient: "linear-gradient(135deg, #0d6b6e, #1a9a9e)",
  cardBorder: "rgba(13,107,110,0.15)",
  cardShadow: "0 4px 24px rgba(0,0,0,0.06)",
  borderRadius: 12,
  fontFamily: "'DM Serif Display', 'Georgia', serif",
  headingWeight: 400,
  bodyWeight: 400,
};

// ── Finance / Warm Capital ────────────────────────────────────────
// Warm dark bg, amber gold accent, cream text, Urbanist typeface.
// Positions value and trust without the cold formality of classic finance blue.
export const THEME_FINANCE: Theme = {
  name: "finance",
  bg: "#1a1510",
  bgSecondary: "rgba(212,160,23,0.07)",
  bgGlass: "rgba(212,160,23,0.09)",
  textPrimary: "#fef9e7",
  textSecondary: "#fef3c7",
  textMuted: "#7a5c0a",
  accent: "#d4a017",
  accentSecondary: "#f0b429",
  accentGradient: "linear-gradient(135deg, #d4a017, #f0b429)",
  cardBorder: "rgba(212,160,23,0.25)",
  cardShadow: "0 4px 24px rgba(212,160,23,0.15)",
  borderRadius: 12,
  fontFamily: "'Urbanist', sans-serif",
  headingWeight: 700,
  bodyWeight: 400,
};

// ══════════════════════════════════════════════════════════════════
// FLAT & MATERIAL DESIGN THEMES - Hard edges, no glow, simple colors
// ══════════════════════════════════════════════════════════════════

// ── Material Blue / Google Material Design ───────────────────────
// Classic Material Design blue palette. Flat colors, sharp edges, Roboto.
// No shadows or glow - pure flat design with elevation via color only.
export const THEME_MATERIAL_BLUE: Theme = {
  name: "materialBlue",
  bg: "#ffffff",
  bgSecondary: "#f5f5f5",
  bgGlass: "#eeeeee",
  textPrimary: "#212121",
  textSecondary: "#757575",
  textMuted: "#9e9e9e",
  accent: "#2196f3",
  accentSecondary: "#1976d2",
  accentGradient: "#2196f3",
  cardBorder: "#e0e0e0",
  cardShadow: "none",
  borderRadius: 0,
  fontFamily: "'Roboto', sans-serif",
  headingWeight: 500,
  bodyWeight: 400,
};

// ── Material Dark / Dark Material Design ─────────────────────────
// Material Design dark theme. Flat surfaces, teal accent, no glow.
// Sharp geometric feel with Roboto Mono for technical precision.
export const THEME_MATERIAL_DARK: Theme = {
  name: "materialDark",
  bg: "#121212",
  bgSecondary: "#1e1e1e",
  bgGlass: "#2d2d2d",
  textPrimary: "#ffffff",
  textSecondary: "#b0b0b0",
  textMuted: "#6e6e6e",
  accent: "#03dac6",
  accentSecondary: "#018786",
  accentGradient: "#03dac6",
  cardBorder: "#333333",
  cardShadow: "none",
  borderRadius: 0,
  fontFamily: "'Roboto Mono', monospace",
  headingWeight: 500,
  bodyWeight: 400,
};

// ── Flat Red / Bold Flat Design ──────────────────────────────────
// High contrast flat design with bold red accent. No shadows, hard edges.
// Oswald condensed headings for impact, Source Sans for body.
export const THEME_FLAT_RED: Theme = {
  name: "flatRed",
  bg: "#fafafa",
  bgSecondary: "#ffffff",
  bgGlass: "#f0f0f0",
  textPrimary: "#1a1a1a",
  textSecondary: "#4a4a4a",
  textMuted: "#8a8a8a",
  accent: "#e53935",
  accentSecondary: "#c62828",
  accentGradient: "#e53935",
  cardBorder: "#dddddd",
  cardShadow: "none",
  borderRadius: 0,
  fontFamily: "'Oswald', sans-serif",
  headingWeight: 600,
  bodyWeight: 400,
};

// ── Flat Navy / Corporate Flat ───────────────────────────────────
// Navy and white flat design. Clean corporate look without gradients.
// Poppins for modern geometric letterforms.
export const THEME_FLAT_NAVY: Theme = {
  name: "flatNavy",
  bg: "#ffffff",
  bgSecondary: "#f8f9fa",
  bgGlass: "#eef1f4",
  textPrimary: "#1a365d",
  textSecondary: "#2d4a6f",
  textMuted: "#718096",
  accent: "#1a365d",
  accentSecondary: "#2c5282",
  accentGradient: "#1a365d",
  cardBorder: "#cbd5e0",
  cardShadow: "none",
  borderRadius: 0,
  fontFamily: "'Poppins', sans-serif",
  headingWeight: 600,
  bodyWeight: 400,
};

// ── Swiss / International Typographic Style ──────────────────────
// Inspired by Swiss design - grid-based, Helvetica, black and white.
// Maximum contrast, zero decoration, pure typography.
export const THEME_SWISS: Theme = {
  name: "swiss",
  bg: "#ffffff",
  bgSecondary: "#f2f2f2",
  bgGlass: "#e5e5e5",
  textPrimary: "#000000",
  textSecondary: "#333333",
  textMuted: "#666666",
  accent: "#000000",
  accentSecondary: "#333333",
  accentGradient: "#000000",
  cardBorder: "#000000",
  cardShadow: "none",
  borderRadius: 0,
  fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
  headingWeight: 700,
  bodyWeight: 400,
};

// ── Bauhaus / Geometric Primary Colors ───────────────────────────
// Bauhaus-inspired with primary colors. Geometric, functional, bold.
// Futura for that classic modernist typography.
export const THEME_BAUHAUS: Theme = {
  name: "bauhaus",
  bg: "#fffef5",
  bgSecondary: "#f5f4eb",
  bgGlass: "#eae9e0",
  textPrimary: "#1a1a1a",
  textSecondary: "#3d3d3d",
  textMuted: "#7a7a7a",
  accent: "#0047ab",
  accentSecondary: "#d32f2f",
  accentGradient: "#0047ab",
  cardBorder: "#1a1a1a",
  cardShadow: "none",
  borderRadius: 0,
  fontFamily: "'Futura', 'Century Gothic', sans-serif",
  headingWeight: 700,
  bodyWeight: 400,
};

// ── Mono / Developer Flat ────────────────────────────────────────
// Monochrome flat design for developers. JetBrains Mono throughout.
// Green accent on dark - terminal aesthetic without glow.
export const THEME_MONO: Theme = {
  name: "mono",
  bg: "#1a1a1a",
  bgSecondary: "#242424",
  bgGlass: "#2e2e2e",
  textPrimary: "#e0e0e0",
  textSecondary: "#a0a0a0",
  textMuted: "#606060",
  accent: "#4ec9b0",
  accentSecondary: "#3da88f",
  accentGradient: "#4ec9b0",
  cardBorder: "#404040",
  cardShadow: "none",
  borderRadius: 0,
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  headingWeight: 600,
  bodyWeight: 400,
};

// ── Paper / Warm Flat Light ──────────────────────────────────────
// Warm paper-like background, brown ink colors. Editorial flat design.
// Libre Baskerville for classic book typography.
export const THEME_PAPER: Theme = {
  name: "paper",
  bg: "#faf8f5",
  bgSecondary: "#f5f2ed",
  bgGlass: "#ebe7e0",
  textPrimary: "#2c2416",
  textSecondary: "#5c4d3a",
  textMuted: "#9a8b78",
  accent: "#8b4513",
  accentSecondary: "#a0522d",
  accentGradient: "#8b4513",
  cardBorder: "#d4c9b8",
  cardShadow: "none",
  borderRadius: 0,
  fontFamily: "'Libre Baskerville', 'Georgia', serif",
  headingWeight: 700,
  bodyWeight: 400,
};

// ── Slate / Neutral Flat Dark ────────────────────────────────────
// Neutral slate grays with orange accent. Work Sans for clarity.
// No decorative elements - pure functional flat design.
export const THEME_SLATE: Theme = {
  name: "slate",
  bg: "#1e2328",
  bgSecondary: "#282d33",
  bgGlass: "#32383f",
  textPrimary: "#e8eaed",
  textSecondary: "#9aa0a6",
  textMuted: "#5f6368",
  accent: "#f9ab00",
  accentSecondary: "#e69500",
  accentGradient: "#f9ab00",
  cardBorder: "#3c4248",
  cardShadow: "none",
  borderRadius: 0,
  fontFamily: "'Work Sans', sans-serif",
  headingWeight: 600,
  bodyWeight: 400,
};

// ── Blueprint / Technical Flat ───────────────────────────────────
// Blueprint-inspired with white lines on blue. Technical documentation feel.
// IBM Plex Mono for engineering precision.
export const THEME_BLUEPRINT: Theme = {
  name: "blueprint",
  bg: "#0d47a1",
  bgSecondary: "#1565c0",
  bgGlass: "#1976d2",
  textPrimary: "#ffffff",
  textSecondary: "#bbdefb",
  textMuted: "#64b5f6",
  accent: "#ffffff",
  accentSecondary: "#e3f2fd",
  accentGradient: "#ffffff",
  cardBorder: "#ffffff",
  cardShadow: "none",
  borderRadius: 0,
  fontFamily: "'IBM Plex Mono', monospace",
  headingWeight: 600,
  bodyWeight: 400,
};

// ══════════════════════════════════════════════════════════════════
// EXTENDED FLAT THEMES - More Canva-style simple designs
// ══════════════════════════════════════════════════════════════════

// ── Candy / Playful Pink ─────────────────────────────────────────
// Bright pink accent on white. Playful, youthful, social media friendly.
// Quicksand rounded font for approachable feel.
export const THEME_CANDY: Theme = {
  name: "candy",
  bg: "#ffffff",
  bgSecondary: "#fff5f7",
  bgGlass: "#ffe4ec",
  textPrimary: "#2d2d2d",
  textSecondary: "#666666",
  textMuted: "#999999",
  accent: "#ff6b9d",
  accentSecondary: "#ff8fab",
  accentGradient: "#ff6b9d",
  cardBorder: "#ffd6e0",
  cardShadow: "none",
  borderRadius: 0,
  fontFamily: "'Quicksand', sans-serif",
  headingWeight: 700,
  bodyWeight: 500,
};

// ── Mint / Fresh Green ───────────────────────────────────────────
// Mint green on white. Fresh, clean, health and wellness vibes.
// Nunito for friendly rounded letterforms.
export const THEME_MINT: Theme = {
  name: "mint",
  bg: "#ffffff",
  bgSecondary: "#f0fdf4",
  bgGlass: "#dcfce7",
  textPrimary: "#1a1a1a",
  textSecondary: "#4b5563",
  textMuted: "#9ca3af",
  accent: "#10b981",
  accentSecondary: "#34d399",
  accentGradient: "#10b981",
  cardBorder: "#a7f3d0",
  cardShadow: "none",
  borderRadius: 0,
  fontFamily: "'Nunito', sans-serif",
  headingWeight: 700,
  bodyWeight: 400,
};

// ── Coral / Warm Orange ──────────────────────────────────────────
// Coral orange on cream. Warm, inviting, lifestyle content.
// Lato for clean professional readability.
export const THEME_CORAL: Theme = {
  name: "coral",
  bg: "#fffbf5",
  bgSecondary: "#fff7ed",
  bgGlass: "#ffedd5",
  textPrimary: "#292524",
  textSecondary: "#57534e",
  textMuted: "#a8a29e",
  accent: "#f97316",
  accentSecondary: "#fb923c",
  accentGradient: "#f97316",
  cardBorder: "#fed7aa",
  cardShadow: "none",
  borderRadius: 0,
  fontFamily: "'Lato', sans-serif",
  headingWeight: 700,
  bodyWeight: 400,
};

// ── Sky / Light Blue ─────────────────────────────────────────────
// Sky blue on white. Calm, trustworthy, tech-friendly.
// Open Sans for maximum readability.
export const THEME_SKY: Theme = {
  name: "sky",
  bg: "#ffffff",
  bgSecondary: "#f0f9ff",
  bgGlass: "#e0f2fe",
  textPrimary: "#0f172a",
  textSecondary: "#475569",
  textMuted: "#94a3b8",
  accent: "#0ea5e9",
  accentSecondary: "#38bdf8",
  accentGradient: "#0ea5e9",
  cardBorder: "#bae6fd",
  cardShadow: "none",
  borderRadius: 0,
  fontFamily: "'Open Sans', sans-serif",
  headingWeight: 700,
  bodyWeight: 400,
};

// ── Grape / Purple Flat ──────────────────────────────────────────
// Rich purple on light lavender. Creative, premium, modern.
// Montserrat for geometric elegance.
export const THEME_GRAPE: Theme = {
  name: "grape",
  bg: "#faf5ff",
  bgSecondary: "#f3e8ff",
  bgGlass: "#e9d5ff",
  textPrimary: "#1e1b4b",
  textSecondary: "#4c1d95",
  textMuted: "#a78bfa",
  accent: "#8b5cf6",
  accentSecondary: "#a78bfa",
  accentGradient: "#8b5cf6",
  cardBorder: "#c4b5fd",
  cardShadow: "none",
  borderRadius: 0,
  fontFamily: "'Montserrat', sans-serif",
  headingWeight: 700,
  bodyWeight: 400,
};

// ── Charcoal / Dark Minimal ──────────────────────────────────────
// Pure charcoal with white text. Sophisticated dark flat design.
// Source Sans Pro for clean technical feel.
export const THEME_CHARCOAL: Theme = {
  name: "charcoal",
  bg: "#18181b",
  bgSecondary: "#27272a",
  bgGlass: "#3f3f46",
  textPrimary: "#fafafa",
  textSecondary: "#a1a1aa",
  textMuted: "#71717a",
  accent: "#fafafa",
  accentSecondary: "#e4e4e7",
  accentGradient: "#fafafa",
  cardBorder: "#52525b",
  cardShadow: "none",
  borderRadius: 0,
  fontFamily: "'Source Sans Pro', sans-serif",
  headingWeight: 600,
  bodyWeight: 400,
};

// ── Peach / Soft Warm ────────────────────────────────────────────
// Soft peach tones. Gentle, feminine, beauty and lifestyle.
// Playfair Display for editorial elegance.
export const THEME_PEACH: Theme = {
  name: "peach",
  bg: "#fffbf8",
  bgSecondary: "#fff5f0",
  bgGlass: "#ffe8db",
  textPrimary: "#3d2c29",
  textSecondary: "#6b5750",
  textMuted: "#a89890",
  accent: "#f59e0b",
  accentSecondary: "#fbbf24",
  accentGradient: "#f59e0b",
  cardBorder: "#fde68a",
  cardShadow: "none",
  borderRadius: 0,
  fontFamily: "'Playfair Display', serif",
  headingWeight: 700,
  bodyWeight: 400,
};

// ── Ocean Dark / Deep Sea ────────────────────────────────────────
// Deep ocean blue with cyan accents. Immersive, tech, gaming.
// Exo 2 for futuristic geometric feel.
export const THEME_OCEAN_DARK: Theme = {
  name: "oceanDark",
  bg: "#0a192f",
  bgSecondary: "#112240",
  bgGlass: "#1d3557",
  textPrimary: "#ccd6f6",
  textSecondary: "#8892b0",
  textMuted: "#495670",
  accent: "#64ffda",
  accentSecondary: "#4fd1c5",
  accentGradient: "#64ffda",
  cardBorder: "#233554",
  cardShadow: "none",
  borderRadius: 0,
  fontFamily: "'Exo 2', sans-serif",
  headingWeight: 700,
  bodyWeight: 400,
};

// ── Cream / Warm Neutral ─────────────────────────────────────────
// Warm cream with brown accents. Cozy, artisan, handcrafted feel.
// Merriweather for readable serif elegance.
export const THEME_CREAM: Theme = {
  name: "cream",
  bg: "#fefcf3",
  bgSecondary: "#faf6e9",
  bgGlass: "#f5edd6",
  textPrimary: "#3d3929",
  textSecondary: "#5c5647",
  textMuted: "#8a8475",
  accent: "#92400e",
  accentSecondary: "#b45309",
  accentGradient: "#92400e",
  cardBorder: "#d6ceb8",
  cardShadow: "none",
  borderRadius: 0,
  fontFamily: "'Merriweather', serif",
  headingWeight: 700,
  bodyWeight: 400,
};

// ── Electric / Vibrant Dark ──────────────────────────────────────
// Dark with electric blue accent. High energy, gaming, tech.
// Rajdhani for bold condensed impact.
export const THEME_ELECTRIC: Theme = {
  name: "electric",
  bg: "#0f0f0f",
  bgSecondary: "#1a1a1a",
  bgGlass: "#262626",
  textPrimary: "#ffffff",
  textSecondary: "#b3b3b3",
  textMuted: "#666666",
  accent: "#3b82f6",
  accentSecondary: "#60a5fa",
  accentGradient: "#3b82f6",
  cardBorder: "#333333",
  cardShadow: "none",
  borderRadius: 0,
  fontFamily: "'Rajdhani', sans-serif",
  headingWeight: 700,
  bodyWeight: 500,
};

// ── Theme Registry ──────────────────────────────────────────────
// Use this to look up themes by name string (useful for AgentCore integration)
export const THEMES: Record<string, Theme> = {
  // Original 7 hand-crafted themes
  dark: THEME_DARK,
  clean: THEME_CLEAN,
  bold: THEME_BOLD,
  warm: THEME_WARM,
  minimal: THEME_MINIMAL,
  neon: THEME_NEON,
  lindamohamed: THEME_LINDAMOHAMED,
  // 10 additional themes (target-group optimised)
  ocean:     THEME_OCEAN,
  sunset:    THEME_SUNSET,
  forest:    THEME_FOREST,
  rose:      THEME_ROSE,
  gold:      THEME_GOLD,
  midnight:  THEME_MIDNIGHT,
  crimson:   THEME_CRIMSON,
  lavender:  THEME_LAVENDER,
  arctic:    THEME_ARCTIC,
  espresso:  THEME_ESPRESSO,
  // 5 grounded European-inspired themes
  corporate:  THEME_CORPORATE,
  industrial: THEME_INDUSTRIAL,
  vienna:     THEME_VIENNA,
  alpine:     THEME_ALPINE,
  finance:    THEME_FINANCE,
  // 10 flat and material design themes - hard edges, no glow
  materialBlue: THEME_MATERIAL_BLUE,
  materialDark: THEME_MATERIAL_DARK,
  flatRed:      THEME_FLAT_RED,
  flatNavy:     THEME_FLAT_NAVY,
  swiss:        THEME_SWISS,
  bauhaus:      THEME_BAUHAUS,
  mono:         THEME_MONO,
  paper:        THEME_PAPER,
  slate:        THEME_SLATE,
  blueprint:    THEME_BLUEPRINT,
  // 10 extended flat themes - Canva-style simple designs
  candy:        THEME_CANDY,
  mint:         THEME_MINT,
  coral:        THEME_CORAL,
  sky:          THEME_SKY,
  grape:        THEME_GRAPE,
  charcoal:     THEME_CHARCOAL,
  peach:        THEME_PEACH,
  oceanDark:    THEME_OCEAN_DARK,
  cream:        THEME_CREAM,
  electric:     THEME_ELECTRIC,
};

// ── Brand Kit ───────────────────────────────────────────────────
// Optional brand customization layer. When provided, overrides theme colors/fonts.
// All fields are JSON-serializable. Templates render correctly without a BrandKit.
export interface BrandKit {
  logoUrl?: string;
  primaryColor?: string;   // main brand color -> theme.accent + gradient start
  secondaryColor?: string; // 2nd brand color  -> theme.accentSecondary + gradient end
  accentColor?: string;    // 3rd brand color  -> fallback accentSecondary
  bgColor?: string;        // background color -> bg + derived bgSecondary/bgGlass
  textColor?: string;      // body text color  -> textPrimary + derived secondary/muted
  fontFamily?: string;
}

// ── Private color helpers for BrandKit derivation ───────────────
function _hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return [0, 0, 0];
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}
function _luma(r: number, g: number, b: number): number {
  const lin = [r, g, b].map(c => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}
function _h(v: number): string { return Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'); }

/**
 * Apply BrandKit overrides to a theme. All derived fields (bgSecondary, bgGlass,
 * textSecondary, textMuted, cardShadow) are computed so the full theme stays coherent.
 *
 *   primaryColor   -> accent + accentGradient start + cardBorder
 *   secondaryColor -> accentSecondary + accentGradient end
 *   accentColor    -> fallback accentSecondary if secondaryColor absent
 *   bgColor        -> bg + bgSecondary (shifted) + bgGlass (55% alpha) + cardShadow
 *   textColor      -> textPrimary + textSecondary (70%) + textMuted (45%)
 */
export function applyBrandKit(theme: Theme, brandKit?: BrandKit): Theme {
  if (!brandKit) return theme;
  const result = { ...theme };

  if (brandKit.primaryColor) {
    const sec = brandKit.secondaryColor ?? brandKit.accentColor ?? theme.accentSecondary;
    result.accent = brandKit.primaryColor;
    result.accentSecondary = sec;
    result.accentGradient = `linear-gradient(135deg, ${brandKit.primaryColor}, ${sec})`;
    result.cardBorder = `${brandKit.primaryColor}40`;
  }
  if (brandKit.secondaryColor) {
    result.accentSecondary = brandKit.secondaryColor;
  } else if (brandKit.accentColor) {
    result.accentSecondary = brandKit.accentColor;
  }

  if (brandKit.bgColor) {
    const [r, g, b] = _hexToRgb(brandKit.bgColor);
    const isLight = _luma(r, g, b) > 0.18;
    const sh = isLight ? -14 : 22;
    result.bg = brandKit.bgColor;
    result.bgSecondary = `#${_h(r + sh)}${_h(g + sh)}${_h(b + sh)}`;
    result.bgGlass = `rgba(${r}, ${g}, ${b}, 0.55)`;
    result.cardShadow = isLight ? '0 4px 24px rgba(0,0,0,0.10)' : '0 4px 24px rgba(0,0,0,0.45)';
  }

  if (brandKit.textColor) {
    result.textPrimary = brandKit.textColor;
    result.textSecondary = `${brandKit.textColor}b3`;
    result.textMuted = `${brandKit.textColor}73`;
  }

  if (brandKit.fontFamily) {
    result.fontFamily = brandKit.fontFamily;
  }
  return result;
}

// ── Platform Hints ──────────────────────────────────────────────
// Optional metadata describing target social platforms.
// When targetPlatforms includes "tiktok" or "instagram-reels", default format to "vertical".
// When targetPlatforms includes "instagram-feed", default format to "square".
export interface PlatformHints {
  targetPlatforms?: string[];
  hashtags?: string[];
  description?: string;
}

// ── Collaboration Metadata ──────────────────────────────────────
// Pass-through metadata for collaboration workflows. Not rendered visually.
export interface CollabMetadata {
  author?: string;
  version?: string;
  status?: "draft" | "review" | "approved" | "published";
  createdAt?: string;
}

