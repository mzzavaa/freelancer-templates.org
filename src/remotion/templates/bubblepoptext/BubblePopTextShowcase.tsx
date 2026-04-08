/**
 * Bubble Pop Text Showcase - 16 themed compositions for the template library.
 *
 * Original inspiration: https://github.com/reactvideoeditor/remotion-templates
 * Adapted with full theme system + BrandKit support.
 */

import React from "react";
import { BubblePopText } from "./BubblePopText";
import type { BubblePopTextSpec } from "./BubblePopText";
import { BUBBLEPOPTEXT_SAMPLE } from "./BubblePopText";
import {
  THEME_DARK,\n  THEME_CLEAN,\n  THEME_BOLD,\n  THEME_WARM,\n  THEME_MINIMAL,\n  THEME_NEON,\n  THEME_OCEAN,\n  THEME_SUNSET,\n  THEME_FOREST,\n  THEME_ROSE,\n  THEME_GOLD,\n  THEME_MIDNIGHT,\n  THEME_CRIMSON,\n  THEME_LAVENDER,\n  THEME_ARCTIC,\n  THEME_ESPRESSO,
  BrandKit,
  applyBrandKit,
} from "../_shared/themes";

const SPEC = BUBBLEPOPTEXT_SAMPLE;

export const BubblePopTextDark: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <BubblePopText spec={SPEC} theme={applyBrandKit(THEME_DARK, brandKit)} />
);

export const BubblePopTextClean: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <BubblePopText spec={SPEC} theme={applyBrandKit(THEME_CLEAN, brandKit)} />
);

export const BubblePopTextBold: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <BubblePopText spec={SPEC} theme={applyBrandKit(THEME_BOLD, brandKit)} />
);

export const BubblePopTextWarm: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <BubblePopText spec={SPEC} theme={applyBrandKit(THEME_WARM, brandKit)} />
);

export const BubblePopTextMinimal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <BubblePopText spec={SPEC} theme={applyBrandKit(THEME_MINIMAL, brandKit)} />
);

export const BubblePopTextNeon: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <BubblePopText spec={SPEC} theme={applyBrandKit(THEME_NEON, brandKit)} />
);

export const BubblePopTextOcean: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <BubblePopText spec={SPEC} theme={applyBrandKit(THEME_OCEAN, brandKit)} />
);

export const BubblePopTextSunset: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <BubblePopText spec={SPEC} theme={applyBrandKit(THEME_SUNSET, brandKit)} />
);

export const BubblePopTextForest: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <BubblePopText spec={SPEC} theme={applyBrandKit(THEME_FOREST, brandKit)} />
);

export const BubblePopTextRose: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <BubblePopText spec={SPEC} theme={applyBrandKit(THEME_ROSE, brandKit)} />
);

export const BubblePopTextGold: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <BubblePopText spec={SPEC} theme={applyBrandKit(THEME_GOLD, brandKit)} />
);

export const BubblePopTextMidnight: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <BubblePopText spec={SPEC} theme={applyBrandKit(THEME_MIDNIGHT, brandKit)} />
);

export const BubblePopTextCrimson: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <BubblePopText spec={SPEC} theme={applyBrandKit(THEME_CRIMSON, brandKit)} />
);

export const BubblePopTextLavender: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <BubblePopText spec={SPEC} theme={applyBrandKit(THEME_LAVENDER, brandKit)} />
);

export const BubblePopTextArctic: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <BubblePopText spec={SPEC} theme={applyBrandKit(THEME_ARCTIC, brandKit)} />
);

export const BubblePopTextEspresso: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <BubblePopText spec={SPEC} theme={applyBrandKit(THEME_ESPRESSO, brandKit)} />
);
