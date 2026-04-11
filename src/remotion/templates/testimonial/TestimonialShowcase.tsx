/**
 * Testimonial Showcase - All 42 themes x 3 layouts = 126 compositions
 * 
 * THEMES (42 total):
 *   Original (7): dark, clean, bold, warm, minimal, neon, lindamohamed
 *   Extended (10): ocean, sunset, forest, rose, gold, midnight, crimson, lavender, arctic, espresso
 *   European (5): corporate, industrial, vienna, alpine, finance
 *   Flat (10): materialBlue, materialDark, flatRed, flatNavy, swiss, bauhaus, mono, paper, slate, blueprint
 *   Canva (10): candy, mint, coral, sky, grape, charcoal, peach, oceanDark, cream, electric
 * 
 * LAYOUTS (3): centered, split, editorial
 */

import React from "react";
import { Testimonial } from "./Testimonial";
import type { TestimonialSpec } from "./Testimonial";
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
const SAMPLE_SPEC: TestimonialSpec = {
  client_name: "Mrs Lee G",
  client_title: "Head of Product",
  client_company: "TechFlow Inc.",
  quote: "Working with this team transformed our entire product pipeline. We shipped 3x faster and our users noticed the difference immediately.",
  rating: 5,
  project_type: "Product Strategy",
  freelancer_name: "Linda Mohamed",
  freelancer_title: "Product Consultant",
  cta_text: "Book a free consultation",
};

const SAMPLE_SPEC_SHORT: TestimonialSpec = {
  client_name: "Linda Mohamed",
  client_title: "CTO",
  client_company: "DataBridge",
  quote: "The best investment we made this year. Period.",
  rating: 5,
  project_type: "Cloud Architecture",
};

// ══════════════════════════════════════════════════════════════════
// ORIGINAL THEMES (7 themes x 3 layouts = 21 compositions)
// ══════════════════════════════════════════════════════════════════

// Dark
export const TestimonialDarkCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_DARK, brandKit)} layout="centered" bgPattern="grid" />
);
export const TestimonialDarkSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_DARK, brandKit)} layout="split" bgPattern="grid" />
);
export const TestimonialDarkEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_DARK, brandKit)} layout="editorial" bgPattern="none" />
);

// Clean
export const TestimonialCleanCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CLEAN, brandKit)} layout="centered" bgPattern="dots" />
);
export const TestimonialCleanSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CLEAN, brandKit)} layout="split" bgPattern="dots" />
);
export const TestimonialCleanEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_CLEAN, brandKit)} layout="editorial" bgPattern="none" />
);

// Bold
export const TestimonialBoldCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BOLD, brandKit)} layout="centered" bgPattern="hex" />
);
export const TestimonialBoldSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BOLD, brandKit)} layout="split" bgPattern="hex" />
);
export const TestimonialBoldEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_BOLD, brandKit)} layout="editorial" bgPattern="none" />
);

// Warm
export const TestimonialWarmCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_WARM, brandKit)} layout="centered" bgPattern="hex" />
);
export const TestimonialWarmSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_WARM, brandKit)} layout="split" bgPattern="hex" />
);
export const TestimonialWarmEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_WARM, brandKit)} layout="editorial" bgPattern="none" />
);

// Minimal
export const TestimonialMinimalCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MINIMAL, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialMinimalSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MINIMAL, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialMinimalEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_MINIMAL, brandKit)} layout="editorial" bgPattern="none" />
);

// Neon
export const TestimonialNeonCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_NEON, brandKit)} layout="centered" bgPattern="hex" />
);
export const TestimonialNeonSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_NEON, brandKit)} layout="split" bgPattern="hex" />
);
export const TestimonialNeonEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_NEON, brandKit)} layout="editorial" bgPattern="none" />
);

// Lindamohamed
export const TestimonialLindamohamedCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_LINDAMOHAMED, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialLindamohamedSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_LINDAMOHAMED, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialLindamohamedEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_LINDAMOHAMED, brandKit)} layout="editorial" bgPattern="none" />
);

// ══════════════════════════════════════════════════════════════════
// EXTENDED THEMES (10 themes x 3 layouts = 30 compositions)
// ══════════════════════════════════════════════════════════════════

// Ocean
export const TestimonialOceanCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_OCEAN, brandKit)} layout="centered" bgPattern="grid" />
);
export const TestimonialOceanSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_OCEAN, brandKit)} layout="split" bgPattern="grid" />
);
export const TestimonialOceanEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_OCEAN, brandKit)} layout="editorial" bgPattern="none" />
);

// Sunset
export const TestimonialSunsetCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SUNSET, brandKit)} layout="centered" bgPattern="hex" />
);
export const TestimonialSunsetSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SUNSET, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialSunsetEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_SUNSET, brandKit)} layout="editorial" bgPattern="none" />
);

// Forest
export const TestimonialForestCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FOREST, brandKit)} layout="centered" bgPattern="hex" />
);
export const TestimonialForestSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FOREST, brandKit)} layout="split" bgPattern="hex" />
);
export const TestimonialForestEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_FOREST, brandKit)} layout="editorial" bgPattern="none" />
);

// Rose
export const TestimonialRoseCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ROSE, brandKit)} layout="centered" bgPattern="hex" />
);
export const TestimonialRoseSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ROSE, brandKit)} layout="split" bgPattern="hex" />
);
export const TestimonialRoseEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_ROSE, brandKit)} layout="editorial" bgPattern="none" />
);

// Gold
export const TestimonialGoldCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_GOLD, brandKit)} layout="centered" bgPattern="hex" />
);
export const TestimonialGoldSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_GOLD, brandKit)} layout="split" bgPattern="hex" />
);
export const TestimonialGoldEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_GOLD, brandKit)} layout="editorial" bgPattern="none" />
);

// Midnight
export const TestimonialMidnightCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MIDNIGHT, brandKit)} layout="centered" bgPattern="grid" />
);
export const TestimonialMidnightSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MIDNIGHT, brandKit)} layout="split" bgPattern="grid" />
);
export const TestimonialMidnightEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_MIDNIGHT, brandKit)} layout="editorial" bgPattern="none" />
);

// Crimson
export const TestimonialCrimsonCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CRIMSON, brandKit)} layout="centered" bgPattern="hex" />
);
export const TestimonialCrimsonSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CRIMSON, brandKit)} layout="split" bgPattern="hex" />
);
export const TestimonialCrimsonEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_CRIMSON, brandKit)} layout="editorial" bgPattern="none" />
);

// Lavender
export const TestimonialLavenderCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_LAVENDER, brandKit)} layout="centered" bgPattern="hex" />
);
export const TestimonialLavenderSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_LAVENDER, brandKit)} layout="split" bgPattern="hex" />
);
export const TestimonialLavenderEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_LAVENDER, brandKit)} layout="editorial" bgPattern="none" />
);

// Arctic
export const TestimonialArcticCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ARCTIC, brandKit)} layout="centered" bgPattern="dots" />
);
export const TestimonialArcticSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ARCTIC, brandKit)} layout="split" bgPattern="dots" />
);
export const TestimonialArcticEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_ARCTIC, brandKit)} layout="editorial" bgPattern="none" />
);

// Espresso
export const TestimonialEspressoCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ESPRESSO, brandKit)} layout="centered" bgPattern="hex" />
);
export const TestimonialEspressoSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ESPRESSO, brandKit)} layout="split" bgPattern="hex" />
);
export const TestimonialEspressoEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_ESPRESSO, brandKit)} layout="editorial" bgPattern="none" />
);


// ══════════════════════════════════════════════════════════════════
// EUROPEAN THEMES (5 themes x 3 layouts = 15 compositions)
// ══════════════════════════════════════════════════════════════════

// Corporate
export const TestimonialCorporateCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CORPORATE, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialCorporateSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CORPORATE, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialCorporateEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_CORPORATE, brandKit)} layout="editorial" bgPattern="none" />
);

// Industrial
export const TestimonialIndustrialCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_INDUSTRIAL, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialIndustrialSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_INDUSTRIAL, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialIndustrialEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_INDUSTRIAL, brandKit)} layout="editorial" bgPattern="none" />
);

// Vienna
export const TestimonialViennaCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_VIENNA, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialViennaSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_VIENNA, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialViennaEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_VIENNA, brandKit)} layout="editorial" bgPattern="none" />
);

// Alpine
export const TestimonialAlpineCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ALPINE, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialAlpineSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ALPINE, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialAlpineEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_ALPINE, brandKit)} layout="editorial" bgPattern="none" />
);

// Finance
export const TestimonialFinanceCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FINANCE, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialFinanceSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FINANCE, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialFinanceEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_FINANCE, brandKit)} layout="editorial" bgPattern="none" />
);

// ══════════════════════════════════════════════════════════════════
// FLAT THEMES (10 themes x 3 layouts = 30 compositions)
// ══════════════════════════════════════════════════════════════════

// MaterialBlue
export const TestimonialMaterialBlueCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MATERIAL_BLUE, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialMaterialBlueSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MATERIAL_BLUE, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialMaterialBlueEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_MATERIAL_BLUE, brandKit)} layout="editorial" bgPattern="none" />
);

// MaterialDark
export const TestimonialMaterialDarkCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MATERIAL_DARK, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialMaterialDarkSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MATERIAL_DARK, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialMaterialDarkEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_MATERIAL_DARK, brandKit)} layout="editorial" bgPattern="none" />
);

// FlatRed
export const TestimonialFlatRedCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FLAT_RED, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialFlatRedSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FLAT_RED, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialFlatRedEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_FLAT_RED, brandKit)} layout="editorial" bgPattern="none" />
);

// FlatNavy
export const TestimonialFlatNavyCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FLAT_NAVY, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialFlatNavySplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FLAT_NAVY, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialFlatNavyEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_FLAT_NAVY, brandKit)} layout="editorial" bgPattern="none" />
);

// Swiss
export const TestimonialSwissCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SWISS, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialSwissSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SWISS, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialSwissEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_SWISS, brandKit)} layout="editorial" bgPattern="none" />
);

// Bauhaus
export const TestimonialBauhausCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BAUHAUS, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialBauhausSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BAUHAUS, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialBauhausEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_BAUHAUS, brandKit)} layout="editorial" bgPattern="none" />
);

// Mono
export const TestimonialMonoCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MONO, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialMonoSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MONO, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialMonoEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_MONO, brandKit)} layout="editorial" bgPattern="none" />
);

// Paper
export const TestimonialPaperCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_PAPER, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialPaperSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_PAPER, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialPaperEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_PAPER, brandKit)} layout="editorial" bgPattern="none" />
);

// Slate
export const TestimonialSlateCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SLATE, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialSlateSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SLATE, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialSlateEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_SLATE, brandKit)} layout="editorial" bgPattern="none" />
);

// Blueprint
export const TestimonialBlueprintCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BLUEPRINT, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialBlueprintSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BLUEPRINT, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialBlueprintEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_BLUEPRINT, brandKit)} layout="editorial" bgPattern="none" />
);


// ══════════════════════════════════════════════════════════════════
// CANVA THEMES (10 themes x 3 layouts = 30 compositions)
// ══════════════════════════════════════════════════════════════════

// Candy
export const TestimonialCandyCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CANDY, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialCandySplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CANDY, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialCandyEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_CANDY, brandKit)} layout="editorial" bgPattern="none" />
);

// Mint
export const TestimonialMintCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MINT, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialMintSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MINT, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialMintEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_MINT, brandKit)} layout="editorial" bgPattern="none" />
);

// Coral
export const TestimonialCoralCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CORAL, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialCoralSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CORAL, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialCoralEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_CORAL, brandKit)} layout="editorial" bgPattern="none" />
);

// Sky
export const TestimonialSkyCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SKY, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialSkySplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SKY, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialSkyEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_SKY, brandKit)} layout="editorial" bgPattern="none" />
);

// Grape
export const TestimonialGrapeCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_GRAPE, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialGrapeSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_GRAPE, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialGrapeEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_GRAPE, brandKit)} layout="editorial" bgPattern="none" />
);

// Charcoal
export const TestimonialCharcoalCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CHARCOAL, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialCharcoalSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CHARCOAL, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialCharcoalEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_CHARCOAL, brandKit)} layout="editorial" bgPattern="none" />
);

// Peach
export const TestimonialPeachCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_PEACH, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialPeachSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_PEACH, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialPeachEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_PEACH, brandKit)} layout="editorial" bgPattern="none" />
);

// OceanDark
export const TestimonialOceanDarkCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_OCEAN_DARK, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialOceanDarkSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_OCEAN_DARK, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialOceanDarkEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_OCEAN_DARK, brandKit)} layout="editorial" bgPattern="none" />
);

// Cream
export const TestimonialCreamCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CREAM, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialCreamSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CREAM, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialCreamEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_CREAM, brandKit)} layout="editorial" bgPattern="none" />
);

// Electric
export const TestimonialElectricCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ELECTRIC, brandKit)} layout="centered" bgPattern="none" />
);
export const TestimonialElectricSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ELECTRIC, brandKit)} layout="split" bgPattern="none" />
);
export const TestimonialElectricEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_ELECTRIC, brandKit)} layout="editorial" bgPattern="none" />
);
