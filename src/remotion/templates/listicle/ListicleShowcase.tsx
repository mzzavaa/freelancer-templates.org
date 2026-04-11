/**
 * Listicle Showcase - All 42 themes x 3 layouts = 126 compositions
 * 
 * THEMES (42 total):
 *   Original (7): dark, clean, bold, warm, minimal, neon, lindamohamed
 *   Extended (10): ocean, sunset, forest, rose, gold, midnight, crimson, lavender, arctic, espresso
 *   European (5): corporate, industrial, vienna, alpine, finance
 *   Flat (10): materialBlue, materialDark, flatRed, flatNavy, swiss, bauhaus, mono, paper, slate, blueprint
 *   Canva (10): candy, mint, coral, sky, grape, charcoal, peach, oceanDark, cream, electric
 * 
 * LAYOUTS (3): stack, cards, reveal
 * 
 * Vertical format (9:16) for Stories, Reels, YouTube Shorts
 */

import React from "react";
import { Listicle } from "./Listicle";
import type { ListicleSpec } from "./Listicle";
import {
  // Original themes
  THEME_DARK, THEME_CLEAN, THEME_BOLD, THEME_WARM, THEME_MINIMAL, THEME_NEON, THEME_LINDAMOHAMED,
  // Extended themes
  THEME_OCEAN, THEME_SUNSET, THEME_FOREST, THEME_ROSE, THEME_GOLD, THEME_MIDNIGHT, THEME_CRIMSON, THEME_LAVENDER, THEME_ARCTIC, THEME_ESPRESSO,
  // European themes
  THEME_CORPORATE, THEME_INDUSTRIAL, THEME_VIENNA, THEME_ALPINE, THEME_FINANCE,
  // Flat themes
  THEME_MATERIAL_BLUE, THEME_MATERIAL_DARK, THEME_FLAT_RED, THEME_FLAT_NAVY, THEME_SWISS, THEME_BAUHAUS, THEME_MONO, THEME_PAPER, THEME_SLATE, THEME_BLUEPRINT,
  // Canva themes
  THEME_CANDY, THEME_MINT, THEME_CORAL, THEME_SKY, THEME_GRAPE, THEME_CHARCOAL, THEME_PEACH, THEME_OCEAN_DARK, THEME_CREAM, THEME_ELECTRIC,
  BrandKit,
  applyBrandKit,
} from "../_shared/themes";

// ── Sample Data ─────────────────────────────────────────────────
const SAMPLE_SPEC: ListicleSpec = {
  title: "5 Things to Know About Remote Work",
  subtitle: "Tips for productivity",
  items: [
    { text: "Set up a dedicated workspace", subtext: "Separate work from life", icon: "check" },
    { text: "Establish a morning routine", subtext: "Start your day right", icon: "check" },
    { text: "Take regular breaks", subtext: "Use the Pomodoro technique", icon: "check" },
    { text: "Over-communicate with your team", subtext: "Async is your friend", icon: "check" },
    { text: "Set boundaries for work hours", subtext: "Protect your personal time", icon: "check" },
  ],
  cta_text: "Follow for more tips",
  author_name: "Linda Mohamed",
  author_handle: "@lindamohamed",
};

// ══════════════════════════════════════════════════════════════════
// ORIGINAL THEMES (7 themes x 3 layouts = 21 compositions)
// ══════════════════════════════════════════════════════════════════

// Dark
export const ListicleDarkStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_DARK, brandKit)} layout="stack" format="vertical" />
);
export const ListicleDarkCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_DARK, brandKit)} layout="cards" format="vertical" />
);
export const ListicleDarkReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_DARK, brandKit)} layout="reveal" format="vertical" />
);

// Clean
export const ListicleCleanStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CLEAN, brandKit)} layout="stack" format="vertical" />
);
export const ListicleCleanCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CLEAN, brandKit)} layout="cards" format="vertical" />
);
export const ListicleCleanReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CLEAN, brandKit)} layout="reveal" format="vertical" />
);

// Bold
export const ListicleBoldStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BOLD, brandKit)} layout="stack" format="vertical" />
);
export const ListicleBoldCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BOLD, brandKit)} layout="cards" format="vertical" />
);
export const ListicleBoldReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BOLD, brandKit)} layout="reveal" format="vertical" />
);

// Warm
export const ListicleWarmStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_WARM, brandKit)} layout="stack" format="vertical" />
);
export const ListicleWarmCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_WARM, brandKit)} layout="cards" format="vertical" />
);
export const ListicleWarmReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_WARM, brandKit)} layout="reveal" format="vertical" />
);

// Minimal
export const ListicleMinimalStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MINIMAL, brandKit)} layout="stack" format="vertical" />
);
export const ListicleMinimalCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MINIMAL, brandKit)} layout="cards" format="vertical" />
);
export const ListicleMinimalReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MINIMAL, brandKit)} layout="reveal" format="vertical" />
);

// Neon
export const ListicleNeonStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_NEON, brandKit)} layout="stack" format="vertical" />
);
export const ListicleNeonCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_NEON, brandKit)} layout="cards" format="vertical" />
);
export const ListicleNeonReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_NEON, brandKit)} layout="reveal" format="vertical" />
);

// Lindamohamed
export const ListicleLindamohamedStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_LINDAMOHAMED, brandKit)} layout="stack" format="vertical" />
);
export const ListicleLindamohamedCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_LINDAMOHAMED, brandKit)} layout="cards" format="vertical" />
);
export const ListicleLindamohamedReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_LINDAMOHAMED, brandKit)} layout="reveal" format="vertical" />
);

// ══════════════════════════════════════════════════════════════════
// EXTENDED THEMES (10 themes x 3 layouts = 30 compositions)
// ══════════════════════════════════════════════════════════════════

// Ocean
export const ListicleOceanStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_OCEAN, brandKit)} layout="stack" format="vertical" />
);
export const ListicleOceanCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_OCEAN, brandKit)} layout="cards" format="vertical" />
);
export const ListicleOceanReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_OCEAN, brandKit)} layout="reveal" format="vertical" />
);

// Sunset
export const ListicleSunsetStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SUNSET, brandKit)} layout="stack" format="vertical" />
);
export const ListicleSunsetCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SUNSET, brandKit)} layout="cards" format="vertical" />
);
export const ListicleSunsetReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SUNSET, brandKit)} layout="reveal" format="vertical" />
);

// Forest
export const ListicleForestStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FOREST, brandKit)} layout="stack" format="vertical" />
);
export const ListicleForestCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FOREST, brandKit)} layout="cards" format="vertical" />
);
export const ListicleForestReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FOREST, brandKit)} layout="reveal" format="vertical" />
);

// Rose
export const ListicleRoseStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ROSE, brandKit)} layout="stack" format="vertical" />
);
export const ListicleRoseCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ROSE, brandKit)} layout="cards" format="vertical" />
);
export const ListicleRoseReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ROSE, brandKit)} layout="reveal" format="vertical" />
);

// Gold
export const ListicleGoldStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_GOLD, brandKit)} layout="stack" format="vertical" />
);
export const ListicleGoldCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_GOLD, brandKit)} layout="cards" format="vertical" />
);
export const ListicleGoldReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_GOLD, brandKit)} layout="reveal" format="vertical" />
);

// Midnight
export const ListicleMidnightStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MIDNIGHT, brandKit)} layout="stack" format="vertical" />
);
export const ListicleMidnightCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MIDNIGHT, brandKit)} layout="cards" format="vertical" />
);
export const ListicleMidnightReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MIDNIGHT, brandKit)} layout="reveal" format="vertical" />
);

// Crimson
export const ListicleCrimsonStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CRIMSON, brandKit)} layout="stack" format="vertical" />
);
export const ListicleCrimsonCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CRIMSON, brandKit)} layout="cards" format="vertical" />
);
export const ListicleCrimsonReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CRIMSON, brandKit)} layout="reveal" format="vertical" />
);

// Lavender
export const ListicleLavenderStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_LAVENDER, brandKit)} layout="stack" format="vertical" />
);
export const ListicleLavenderCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_LAVENDER, brandKit)} layout="cards" format="vertical" />
);
export const ListicleLavenderReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_LAVENDER, brandKit)} layout="reveal" format="vertical" />
);

// Arctic
export const ListicleArcticStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ARCTIC, brandKit)} layout="stack" format="vertical" />
);
export const ListicleArcticCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ARCTIC, brandKit)} layout="cards" format="vertical" />
);
export const ListicleArcticReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ARCTIC, brandKit)} layout="reveal" format="vertical" />
);

// Espresso
export const ListicleEspressoStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ESPRESSO, brandKit)} layout="stack" format="vertical" />
);
export const ListicleEspressoCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ESPRESSO, brandKit)} layout="cards" format="vertical" />
);
export const ListicleEspressoReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ESPRESSO, brandKit)} layout="reveal" format="vertical" />
);


// ══════════════════════════════════════════════════════════════════
// EUROPEAN THEMES (5 themes x 3 layouts = 15 compositions)
// ══════════════════════════════════════════════════════════════════

// Corporate
export const ListicleCorporateStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CORPORATE, brandKit)} layout="stack" format="vertical" />
);
export const ListicleCorporateCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CORPORATE, brandKit)} layout="cards" format="vertical" />
);
export const ListicleCorporateReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CORPORATE, brandKit)} layout="reveal" format="vertical" />
);

// Industrial
export const ListicleIndustrialStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_INDUSTRIAL, brandKit)} layout="stack" format="vertical" />
);
export const ListicleIndustrialCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_INDUSTRIAL, brandKit)} layout="cards" format="vertical" />
);
export const ListicleIndustrialReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_INDUSTRIAL, brandKit)} layout="reveal" format="vertical" />
);

// Vienna
export const ListicleViennaStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_VIENNA, brandKit)} layout="stack" format="vertical" />
);
export const ListicleViennaCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_VIENNA, brandKit)} layout="cards" format="vertical" />
);
export const ListicleViennaReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_VIENNA, brandKit)} layout="reveal" format="vertical" />
);

// Alpine
export const ListicleAlpineStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ALPINE, brandKit)} layout="stack" format="vertical" />
);
export const ListicleAlpineCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ALPINE, brandKit)} layout="cards" format="vertical" />
);
export const ListicleAlpineReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ALPINE, brandKit)} layout="reveal" format="vertical" />
);

// Finance
export const ListicleFinanceStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FINANCE, brandKit)} layout="stack" format="vertical" />
);
export const ListicleFinanceCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FINANCE, brandKit)} layout="cards" format="vertical" />
);
export const ListicleFinanceReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FINANCE, brandKit)} layout="reveal" format="vertical" />
);

// ══════════════════════════════════════════════════════════════════
// FLAT THEMES (10 themes x 3 layouts = 30 compositions)
// ══════════════════════════════════════════════════════════════════

// MaterialBlue
export const ListicleMaterialBlueStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MATERIAL_BLUE, brandKit)} layout="stack" format="vertical" />
);
export const ListicleMaterialBlueCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MATERIAL_BLUE, brandKit)} layout="cards" format="vertical" />
);
export const ListicleMaterialBlueReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MATERIAL_BLUE, brandKit)} layout="reveal" format="vertical" />
);

// MaterialDark
export const ListicleMaterialDarkStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MATERIAL_DARK, brandKit)} layout="stack" format="vertical" />
);
export const ListicleMaterialDarkCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MATERIAL_DARK, brandKit)} layout="cards" format="vertical" />
);
export const ListicleMaterialDarkReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MATERIAL_DARK, brandKit)} layout="reveal" format="vertical" />
);

// FlatRed
export const ListicleFlatRedStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FLAT_RED, brandKit)} layout="stack" format="vertical" />
);
export const ListicleFlatRedCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FLAT_RED, brandKit)} layout="cards" format="vertical" />
);
export const ListicleFlatRedReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FLAT_RED, brandKit)} layout="reveal" format="vertical" />
);

// FlatNavy
export const ListicleFlatNavyStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FLAT_NAVY, brandKit)} layout="stack" format="vertical" />
);
export const ListicleFlatNavyCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FLAT_NAVY, brandKit)} layout="cards" format="vertical" />
);
export const ListicleFlatNavyReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FLAT_NAVY, brandKit)} layout="reveal" format="vertical" />
);

// Swiss
export const ListicleSwissStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SWISS, brandKit)} layout="stack" format="vertical" />
);
export const ListicleSwissCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SWISS, brandKit)} layout="cards" format="vertical" />
);
export const ListicleSwissReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SWISS, brandKit)} layout="reveal" format="vertical" />
);

// Bauhaus
export const ListicleBauhausStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BAUHAUS, brandKit)} layout="stack" format="vertical" />
);
export const ListicleBauhausCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BAUHAUS, brandKit)} layout="cards" format="vertical" />
);
export const ListicleBauhausReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BAUHAUS, brandKit)} layout="reveal" format="vertical" />
);

// Mono
export const ListicleMonoStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MONO, brandKit)} layout="stack" format="vertical" />
);
export const ListicleMonoCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MONO, brandKit)} layout="cards" format="vertical" />
);
export const ListicleMonoReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MONO, brandKit)} layout="reveal" format="vertical" />
);

// Paper
export const ListiclePaperStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_PAPER, brandKit)} layout="stack" format="vertical" />
);
export const ListiclePaperCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_PAPER, brandKit)} layout="cards" format="vertical" />
);
export const ListiclePaperReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_PAPER, brandKit)} layout="reveal" format="vertical" />
);

// Slate
export const ListicleSlateStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SLATE, brandKit)} layout="stack" format="vertical" />
);
export const ListicleSlateCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SLATE, brandKit)} layout="cards" format="vertical" />
);
export const ListicleSlateReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SLATE, brandKit)} layout="reveal" format="vertical" />
);

// Blueprint
export const ListicleBlueprintStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BLUEPRINT, brandKit)} layout="stack" format="vertical" />
);
export const ListicleBlueprintCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BLUEPRINT, brandKit)} layout="cards" format="vertical" />
);
export const ListicleBlueprintReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BLUEPRINT, brandKit)} layout="reveal" format="vertical" />
);

// ══════════════════════════════════════════════════════════════════
// CANVA THEMES (10 themes x 3 layouts = 30 compositions)
// ══════════════════════════════════════════════════════════════════

// Candy
export const ListicleCandyStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CANDY, brandKit)} layout="stack" format="vertical" />
);
export const ListicleCandyCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CANDY, brandKit)} layout="cards" format="vertical" />
);
export const ListicleCandyReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CANDY, brandKit)} layout="reveal" format="vertical" />
);

// Mint
export const ListicleMintStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MINT, brandKit)} layout="stack" format="vertical" />
);
export const ListicleMintCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MINT, brandKit)} layout="cards" format="vertical" />
);
export const ListicleMintReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MINT, brandKit)} layout="reveal" format="vertical" />
);

// Coral
export const ListicleCoralStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CORAL, brandKit)} layout="stack" format="vertical" />
);
export const ListicleCoralCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CORAL, brandKit)} layout="cards" format="vertical" />
);
export const ListicleCoralReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CORAL, brandKit)} layout="reveal" format="vertical" />
);

// Sky
export const ListicleSkyStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SKY, brandKit)} layout="stack" format="vertical" />
);
export const ListicleSkyCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SKY, brandKit)} layout="cards" format="vertical" />
);
export const ListicleSkyReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SKY, brandKit)} layout="reveal" format="vertical" />
);

// Grape
export const ListicleGrapeStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_GRAPE, brandKit)} layout="stack" format="vertical" />
);
export const ListicleGrapeCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_GRAPE, brandKit)} layout="cards" format="vertical" />
);
export const ListicleGrapeReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_GRAPE, brandKit)} layout="reveal" format="vertical" />
);

// Charcoal
export const ListicleCharcoalStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CHARCOAL, brandKit)} layout="stack" format="vertical" />
);
export const ListicleCharcoalCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CHARCOAL, brandKit)} layout="cards" format="vertical" />
);
export const ListicleCharcoalReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CHARCOAL, brandKit)} layout="reveal" format="vertical" />
);

// Peach
export const ListiclePeachStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_PEACH, brandKit)} layout="stack" format="vertical" />
);
export const ListiclePeachCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_PEACH, brandKit)} layout="cards" format="vertical" />
);
export const ListiclePeachReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_PEACH, brandKit)} layout="reveal" format="vertical" />
);

// OceanDark
export const ListicleOceanDarkStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_OCEAN_DARK, brandKit)} layout="stack" format="vertical" />
);
export const ListicleOceanDarkCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_OCEAN_DARK, brandKit)} layout="cards" format="vertical" />
);
export const ListicleOceanDarkReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_OCEAN_DARK, brandKit)} layout="reveal" format="vertical" />
);

// Cream
export const ListicleCreamStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CREAM, brandKit)} layout="stack" format="vertical" />
);
export const ListicleCreamCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CREAM, brandKit)} layout="cards" format="vertical" />
);
export const ListicleCreamReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CREAM, brandKit)} layout="reveal" format="vertical" />
);

// Electric
export const ListicleElectricStack: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ELECTRIC, brandKit)} layout="stack" format="vertical" />
);
export const ListicleElectricCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ELECTRIC, brandKit)} layout="cards" format="vertical" />
);
export const ListicleElectricReveal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listicle spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ELECTRIC, brandKit)} layout="reveal" format="vertical" />
);
