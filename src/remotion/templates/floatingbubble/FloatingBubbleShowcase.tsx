/**
 * Floating Bubble Showcase - 16 themed compositions for the template library.
 *
 * Original inspiration: https://github.com/reactvideoeditor/remotion-templates
 * Adapted with full theme system + BrandKit support.
 */

import React from "react";
import { FloatingBubble } from "./FloatingBubble";
import type { FloatingBubbleSpec } from "./FloatingBubble";
import { FLOATINGBUBBLE_SAMPLE } from "./FloatingBubble";
import {
  THEME_DARK,\n  THEME_CLEAN,\n  THEME_BOLD,\n  THEME_WARM,\n  THEME_MINIMAL,\n  THEME_NEON,\n  THEME_OCEAN,\n  THEME_SUNSET,\n  THEME_FOREST,\n  THEME_ROSE,\n  THEME_GOLD,\n  THEME_MIDNIGHT,\n  THEME_CRIMSON,\n  THEME_LAVENDER,\n  THEME_ARCTIC,\n  THEME_ESPRESSO,
  BrandKit,
  applyBrandKit,
} from "../_shared/themes";

const SPEC = FLOATINGBUBBLE_SAMPLE;

export const FloatingBubbleDark: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <FloatingBubble spec={SPEC} theme={applyBrandKit(THEME_DARK, brandKit)} />
);

export const FloatingBubbleClean: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <FloatingBubble spec={SPEC} theme={applyBrandKit(THEME_CLEAN, brandKit)} />
);

export const FloatingBubbleBold: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <FloatingBubble spec={SPEC} theme={applyBrandKit(THEME_BOLD, brandKit)} />
);

export const FloatingBubbleWarm: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <FloatingBubble spec={SPEC} theme={applyBrandKit(THEME_WARM, brandKit)} />
);

export const FloatingBubbleMinimal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <FloatingBubble spec={SPEC} theme={applyBrandKit(THEME_MINIMAL, brandKit)} />
);

export const FloatingBubbleNeon: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <FloatingBubble spec={SPEC} theme={applyBrandKit(THEME_NEON, brandKit)} />
);

export const FloatingBubbleOcean: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <FloatingBubble spec={SPEC} theme={applyBrandKit(THEME_OCEAN, brandKit)} />
);

export const FloatingBubbleSunset: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <FloatingBubble spec={SPEC} theme={applyBrandKit(THEME_SUNSET, brandKit)} />
);

export const FloatingBubbleForest: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <FloatingBubble spec={SPEC} theme={applyBrandKit(THEME_FOREST, brandKit)} />
);

export const FloatingBubbleRose: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <FloatingBubble spec={SPEC} theme={applyBrandKit(THEME_ROSE, brandKit)} />
);

export const FloatingBubbleGold: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <FloatingBubble spec={SPEC} theme={applyBrandKit(THEME_GOLD, brandKit)} />
);

export const FloatingBubbleMidnight: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <FloatingBubble spec={SPEC} theme={applyBrandKit(THEME_MIDNIGHT, brandKit)} />
);

export const FloatingBubbleCrimson: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <FloatingBubble spec={SPEC} theme={applyBrandKit(THEME_CRIMSON, brandKit)} />
);

export const FloatingBubbleLavender: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <FloatingBubble spec={SPEC} theme={applyBrandKit(THEME_LAVENDER, brandKit)} />
);

export const FloatingBubbleArctic: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <FloatingBubble spec={SPEC} theme={applyBrandKit(THEME_ARCTIC, brandKit)} />
);

export const FloatingBubbleEspresso: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <FloatingBubble spec={SPEC} theme={applyBrandKit(THEME_ESPRESSO, brandKit)} />
);
