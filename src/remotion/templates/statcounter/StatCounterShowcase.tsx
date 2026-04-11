/**
 * StatCounter Showcase - Pre-configured compositions
 * 
 * Vertical format (9:16) for Stories, Reels, YouTube Shorts
 * Square format (1:1) for Instagram Feed, LinkedIn
 */

import React from "react";
import { StatCounter } from "./StatCounter";
import type { StatCounterSpec } from "./StatCounter";
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
const SAMPLE_SINGLE: StatCounterSpec = {
  title: "Monthly Active Users",
  stats: [{
    value: 50000,
    suffix: "+",
    label: "Active Users",
    sublabel: "and growing every day",
    trend: "up",
    trend_value: "+23% this month",
  }],
  footer_text: "Updated April 2026",
};

const SAMPLE_GRID: StatCounterSpec = {
  title: "2025 Year in Review",
  subtitle: "Our biggest year yet",
  stats: [
    { value: 1200, suffix: "+", label: "Projects Completed", icon_type: "chart" },
    { value: 50, suffix: "K", label: "Happy Clients", icon_type: "users" },
    { value: 98, suffix: "%", label: "Satisfaction Rate", icon_type: "trend" },
  ],
  footer_text: "Thank you for being part of our journey",
};

const SAMPLE_PROGRESS: StatCounterSpec = {
  title: "Q1 Goals Progress",
  stats: [
    { value: 85, suffix: "%", label: "Revenue Target", icon_type: "chart" },
    { value: 72, suffix: "%", label: "New Customers", icon_type: "users" },
    { value: 94, suffix: "%", label: "Customer Retention", icon_type: "trend" },
  ],
  footer_text: "On track to exceed annual targets",
};

// ── Square Format (1:1) ──────────────────────────────────────────

export const StatCounterDarkSingle: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <StatCounter spec={SAMPLE_SINGLE} theme={applyBrandKit(THEME_DARK, brandKit)} layout="single" format="square" />
);

export const StatCounterNeonGrid: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <StatCounter spec={SAMPLE_GRID} theme={applyBrandKit(THEME_NEON, brandKit)} layout="grid" format="square" />
);

export const StatCounterCandySingle: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <StatCounter spec={SAMPLE_SINGLE} theme={applyBrandKit(THEME_CANDY, brandKit)} layout="single" format="square" />
);

export const StatCounterMintProgress: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <StatCounter spec={SAMPLE_PROGRESS} theme={applyBrandKit(THEME_MINT, brandKit)} layout="progress" format="square" />
);

export const StatCounterCoralGrid: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <StatCounter spec={SAMPLE_GRID} theme={applyBrandKit(THEME_CORAL, brandKit)} layout="grid" format="square" />
);

export const StatCounterSkyProgress: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <StatCounter spec={SAMPLE_PROGRESS} theme={applyBrandKit(THEME_SKY, brandKit)} layout="progress" format="square" />
);

export const StatCounterGrapeSingle: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <StatCounter spec={SAMPLE_SINGLE} theme={applyBrandKit(THEME_GRAPE, brandKit)} layout="single" format="square" />
);

export const StatCounterCharcoalGrid: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <StatCounter spec={SAMPLE_GRID} theme={applyBrandKit(THEME_CHARCOAL, brandKit)} layout="grid" format="square" />
);

export const StatCounterCreamProgress: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <StatCounter spec={SAMPLE_PROGRESS} theme={applyBrandKit(THEME_CREAM, brandKit)} layout="progress" format="square" />
);

export const StatCounterOceanDarkSingle: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <StatCounter spec={SAMPLE_SINGLE} theme={applyBrandKit(THEME_OCEAN_DARK, brandKit)} layout="single" format="square" />
);

// ── Vertical Format (9:16) - Stories ─────────────────────────────

export const StatCounterDarkSingleVertical: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <StatCounter spec={SAMPLE_SINGLE} theme={applyBrandKit(THEME_DARK, brandKit)} layout="single" format="vertical" />
);

export const StatCounterNeonGridVertical: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <StatCounter spec={SAMPLE_GRID} theme={applyBrandKit(THEME_NEON, brandKit)} layout="grid" format="vertical" />
);

export const StatCounterCandyProgressVertical: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <StatCounter spec={SAMPLE_PROGRESS} theme={applyBrandKit(THEME_CANDY, brandKit)} layout="progress" format="vertical" />
);

export const StatCounterPeachSingleVertical: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <StatCounter spec={SAMPLE_SINGLE} theme={applyBrandKit(THEME_PEACH, brandKit)} layout="single" format="vertical" />
);

export const StatCounterElectricGridVertical: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <StatCounter spec={SAMPLE_GRID} theme={applyBrandKit(THEME_ELECTRIC, brandKit)} layout="grid" format="vertical" />
);
