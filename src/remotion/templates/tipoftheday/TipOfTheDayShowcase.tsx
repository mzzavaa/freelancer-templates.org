/**
 * Tip of the Day Showcase - Pre-configured compositions
 */

import React from "react";
import { TipOfTheDay } from "./TipOfTheDay";
import type { TipOfTheDaySpec } from "./TipOfTheDay";
import {
  THEME_DARK,
  THEME_NEON,
  THEME_CANDY,
  THEME_MINT,
  THEME_CORAL,
  THEME_SKY,
  THEME_GRAPE,
  THEME_CHARCOAL,
  THEME_CREAM,
  THEME_OCEAN_DARK,
  THEME_PEACH,
  THEME_ELECTRIC,
  BrandKit,
  applyBrandKit,
} from "../_shared/themes";

// ── Sample Data ─────────────────────────────────────────────────
const SAMPLE_SPEC: TipOfTheDaySpec = {
  tip_number: 47,
  category: "Productivity",
  tip_title: "The 2-Minute Rule",
  tip_text: "If a task takes less than 2 minutes to complete, do it immediately. This prevents small tasks from piling up and overwhelming you.",
  bonus_tip: "Apply this to emails, messages, and quick fixes.",
  author_name: "Linda Mohamed",
  author_handle: "@lindamohamed",
  hashtags: ["productivity", "tips", "gtd"],
};

const SAMPLE_SPEC_SHORT: TipOfTheDaySpec = {
  tip_number: 12,
  category: "Design",
  tip_title: "Use Consistent Spacing",
  tip_text: "Stick to a spacing scale (4, 8, 16, 24, 32px) for visual harmony in your designs.",
};

// ── Square Format (1:1) ──────────────────────────────────────────

export const TipOfTheDayDarkCard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TipOfTheDay spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_DARK, brandKit)} layout="card" format="square" />
);

export const TipOfTheDayNeonFullscreen: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TipOfTheDay spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_NEON, brandKit)} layout="fullscreen" format="square" />
);

export const TipOfTheDayCandyCard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TipOfTheDay spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CANDY, brandKit)} layout="card" format="square" />
);

export const TipOfTheDayMintMinimal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TipOfTheDay spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_MINT, brandKit)} layout="minimal" format="square" />
);

export const TipOfTheDayCoralCard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TipOfTheDay spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CORAL, brandKit)} layout="card" format="square" />
);

export const TipOfTheDaySkyFullscreen: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TipOfTheDay spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SKY, brandKit)} layout="fullscreen" format="square" />
);

export const TipOfTheDayGrapeCard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TipOfTheDay spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_GRAPE, brandKit)} layout="card" format="square" />
);

export const TipOfTheDayCharcoalMinimal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TipOfTheDay spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_CHARCOAL, brandKit)} layout="minimal" format="square" />
);

export const TipOfTheDayCreamCard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TipOfTheDay spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CREAM, brandKit)} layout="card" format="square" />
);

export const TipOfTheDayOceanDarkFullscreen: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TipOfTheDay spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_OCEAN_DARK, brandKit)} layout="fullscreen" format="square" />
);

// ── Vertical Format (9:16) - Stories ─────────────────────────────

export const TipOfTheDayDarkCardVertical: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TipOfTheDay spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_DARK, brandKit)} layout="card" format="vertical" />
);

export const TipOfTheDayNeonFullscreenVertical: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TipOfTheDay spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_NEON, brandKit)} layout="fullscreen" format="vertical" />
);

export const TipOfTheDayCandyCardVertical: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TipOfTheDay spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CANDY, brandKit)} layout="card" format="vertical" />
);

export const TipOfTheDayPeachMinimalVertical: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TipOfTheDay spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_PEACH, brandKit)} layout="minimal" format="vertical" />
);

export const TipOfTheDayElectricFullscreenVertical: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TipOfTheDay spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ELECTRIC, brandKit)} layout="fullscreen" format="vertical" />
);
