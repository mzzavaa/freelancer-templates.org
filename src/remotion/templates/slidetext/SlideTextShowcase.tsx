/**
 * Slide Text Showcase - 16 themed compositions for the template library.
 *
 * Original inspiration: https://github.com/reactvideoeditor/remotion-templates
 * Adapted with full theme system + BrandKit support.
 */

import React from "react";
import { SlideText } from "./SlideText";
import type { SlideTextSpec } from "./SlideText";
import { SLIDETEXT_SAMPLE } from "./SlideText";
import {
  THEME_DARK,\n  THEME_CLEAN,\n  THEME_BOLD,\n  THEME_WARM,\n  THEME_MINIMAL,\n  THEME_NEON,\n  THEME_OCEAN,\n  THEME_SUNSET,\n  THEME_FOREST,\n  THEME_ROSE,\n  THEME_GOLD,\n  THEME_MIDNIGHT,\n  THEME_CRIMSON,\n  THEME_LAVENDER,\n  THEME_ARCTIC,\n  THEME_ESPRESSO,
  BrandKit,
  applyBrandKit,
} from "../_shared/themes";

const SPEC = SLIDETEXT_SAMPLE;

export const SlideTextDark: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SlideText spec={SPEC} theme={applyBrandKit(THEME_DARK, brandKit)} />
);

export const SlideTextClean: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SlideText spec={SPEC} theme={applyBrandKit(THEME_CLEAN, brandKit)} />
);

export const SlideTextBold: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SlideText spec={SPEC} theme={applyBrandKit(THEME_BOLD, brandKit)} />
);

export const SlideTextWarm: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SlideText spec={SPEC} theme={applyBrandKit(THEME_WARM, brandKit)} />
);

export const SlideTextMinimal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SlideText spec={SPEC} theme={applyBrandKit(THEME_MINIMAL, brandKit)} />
);

export const SlideTextNeon: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SlideText spec={SPEC} theme={applyBrandKit(THEME_NEON, brandKit)} />
);

export const SlideTextOcean: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SlideText spec={SPEC} theme={applyBrandKit(THEME_OCEAN, brandKit)} />
);

export const SlideTextSunset: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SlideText spec={SPEC} theme={applyBrandKit(THEME_SUNSET, brandKit)} />
);

export const SlideTextForest: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SlideText spec={SPEC} theme={applyBrandKit(THEME_FOREST, brandKit)} />
);

export const SlideTextRose: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SlideText spec={SPEC} theme={applyBrandKit(THEME_ROSE, brandKit)} />
);

export const SlideTextGold: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SlideText spec={SPEC} theme={applyBrandKit(THEME_GOLD, brandKit)} />
);

export const SlideTextMidnight: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SlideText spec={SPEC} theme={applyBrandKit(THEME_MIDNIGHT, brandKit)} />
);

export const SlideTextCrimson: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SlideText spec={SPEC} theme={applyBrandKit(THEME_CRIMSON, brandKit)} />
);

export const SlideTextLavender: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SlideText spec={SPEC} theme={applyBrandKit(THEME_LAVENDER, brandKit)} />
);

export const SlideTextArctic: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SlideText spec={SPEC} theme={applyBrandKit(THEME_ARCTIC, brandKit)} />
);

export const SlideTextEspresso: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SlideText spec={SPEC} theme={applyBrandKit(THEME_ESPRESSO, brandKit)} />
);
