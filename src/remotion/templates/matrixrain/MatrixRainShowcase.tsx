/**
 * Matrix Rain Showcase - 16 themed compositions for the template library.
 *
 * Original inspiration: https://github.com/reactvideoeditor/remotion-templates
 * Adapted with full theme system + BrandKit support.
 */

import React from "react";
import { MatrixRain } from "./MatrixRain";
import type { MatrixRainSpec } from "./MatrixRain";
import { MATRIXRAIN_SAMPLE } from "./MatrixRain";
import {
  THEME_DARK,\n  THEME_CLEAN,\n  THEME_BOLD,\n  THEME_WARM,\n  THEME_MINIMAL,\n  THEME_NEON,\n  THEME_OCEAN,\n  THEME_SUNSET,\n  THEME_FOREST,\n  THEME_ROSE,\n  THEME_GOLD,\n  THEME_MIDNIGHT,\n  THEME_CRIMSON,\n  THEME_LAVENDER,\n  THEME_ARCTIC,\n  THEME_ESPRESSO,
  BrandKit,
  applyBrandKit,
} from "../_shared/themes";

const SPEC = MATRIXRAIN_SAMPLE;

export const MatrixRainDark: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <MatrixRain spec={SPEC} theme={applyBrandKit(THEME_DARK, brandKit)} />
);

export const MatrixRainClean: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <MatrixRain spec={SPEC} theme={applyBrandKit(THEME_CLEAN, brandKit)} />
);

export const MatrixRainBold: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <MatrixRain spec={SPEC} theme={applyBrandKit(THEME_BOLD, brandKit)} />
);

export const MatrixRainWarm: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <MatrixRain spec={SPEC} theme={applyBrandKit(THEME_WARM, brandKit)} />
);

export const MatrixRainMinimal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <MatrixRain spec={SPEC} theme={applyBrandKit(THEME_MINIMAL, brandKit)} />
);

export const MatrixRainNeon: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <MatrixRain spec={SPEC} theme={applyBrandKit(THEME_NEON, brandKit)} />
);

export const MatrixRainOcean: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <MatrixRain spec={SPEC} theme={applyBrandKit(THEME_OCEAN, brandKit)} />
);

export const MatrixRainSunset: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <MatrixRain spec={SPEC} theme={applyBrandKit(THEME_SUNSET, brandKit)} />
);

export const MatrixRainForest: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <MatrixRain spec={SPEC} theme={applyBrandKit(THEME_FOREST, brandKit)} />
);

export const MatrixRainRose: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <MatrixRain spec={SPEC} theme={applyBrandKit(THEME_ROSE, brandKit)} />
);

export const MatrixRainGold: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <MatrixRain spec={SPEC} theme={applyBrandKit(THEME_GOLD, brandKit)} />
);

export const MatrixRainMidnight: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <MatrixRain spec={SPEC} theme={applyBrandKit(THEME_MIDNIGHT, brandKit)} />
);

export const MatrixRainCrimson: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <MatrixRain spec={SPEC} theme={applyBrandKit(THEME_CRIMSON, brandKit)} />
);

export const MatrixRainLavender: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <MatrixRain spec={SPEC} theme={applyBrandKit(THEME_LAVENDER, brandKit)} />
);

export const MatrixRainArctic: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <MatrixRain spec={SPEC} theme={applyBrandKit(THEME_ARCTIC, brandKit)} />
);

export const MatrixRainEspresso: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <MatrixRain spec={SPEC} theme={applyBrandKit(THEME_ESPRESSO, brandKit)} />
);
