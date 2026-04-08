/**
 * Typewriter Subtitle Showcase - 16 themed compositions for the template library.
 *
 * Original inspiration: https://github.com/reactvideoeditor/remotion-templates
 * Adapted with full theme system + BrandKit support.
 */

import React from "react";
import { TypewriterSubtitle } from "./TypewriterSubtitle";
import type { TypewriterSubtitleSpec } from "./TypewriterSubtitle";
import { TYPEWRITERSUBTITLE_SAMPLE } from "./TypewriterSubtitle";
import {
  THEME_DARK,\n  THEME_CLEAN,\n  THEME_BOLD,\n  THEME_WARM,\n  THEME_MINIMAL,\n  THEME_NEON,\n  THEME_OCEAN,\n  THEME_SUNSET,\n  THEME_FOREST,\n  THEME_ROSE,\n  THEME_GOLD,\n  THEME_MIDNIGHT,\n  THEME_CRIMSON,\n  THEME_LAVENDER,\n  THEME_ARCTIC,\n  THEME_ESPRESSO,
  BrandKit,
  applyBrandKit,
} from "../_shared/themes";

const SPEC = TYPEWRITERSUBTITLE_SAMPLE;

export const TypewriterSubtitleDark: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TypewriterSubtitle spec={SPEC} theme={applyBrandKit(THEME_DARK, brandKit)} />
);

export const TypewriterSubtitleClean: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TypewriterSubtitle spec={SPEC} theme={applyBrandKit(THEME_CLEAN, brandKit)} />
);

export const TypewriterSubtitleBold: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TypewriterSubtitle spec={SPEC} theme={applyBrandKit(THEME_BOLD, brandKit)} />
);

export const TypewriterSubtitleWarm: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TypewriterSubtitle spec={SPEC} theme={applyBrandKit(THEME_WARM, brandKit)} />
);

export const TypewriterSubtitleMinimal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TypewriterSubtitle spec={SPEC} theme={applyBrandKit(THEME_MINIMAL, brandKit)} />
);

export const TypewriterSubtitleNeon: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TypewriterSubtitle spec={SPEC} theme={applyBrandKit(THEME_NEON, brandKit)} />
);

export const TypewriterSubtitleOcean: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TypewriterSubtitle spec={SPEC} theme={applyBrandKit(THEME_OCEAN, brandKit)} />
);

export const TypewriterSubtitleSunset: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TypewriterSubtitle spec={SPEC} theme={applyBrandKit(THEME_SUNSET, brandKit)} />
);

export const TypewriterSubtitleForest: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TypewriterSubtitle spec={SPEC} theme={applyBrandKit(THEME_FOREST, brandKit)} />
);

export const TypewriterSubtitleRose: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TypewriterSubtitle spec={SPEC} theme={applyBrandKit(THEME_ROSE, brandKit)} />
);

export const TypewriterSubtitleGold: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TypewriterSubtitle spec={SPEC} theme={applyBrandKit(THEME_GOLD, brandKit)} />
);

export const TypewriterSubtitleMidnight: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TypewriterSubtitle spec={SPEC} theme={applyBrandKit(THEME_MIDNIGHT, brandKit)} />
);

export const TypewriterSubtitleCrimson: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TypewriterSubtitle spec={SPEC} theme={applyBrandKit(THEME_CRIMSON, brandKit)} />
);

export const TypewriterSubtitleLavender: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TypewriterSubtitle spec={SPEC} theme={applyBrandKit(THEME_LAVENDER, brandKit)} />
);

export const TypewriterSubtitleArctic: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TypewriterSubtitle spec={SPEC} theme={applyBrandKit(THEME_ARCTIC, brandKit)} />
);

export const TypewriterSubtitleEspresso: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <TypewriterSubtitle spec={SPEC} theme={applyBrandKit(THEME_ESPRESSO, brandKit)} />
);
