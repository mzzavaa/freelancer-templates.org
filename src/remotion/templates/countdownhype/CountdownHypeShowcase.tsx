/**
 * Countdown/Hype Showcase - Pre-configured compositions for each layout × theme combo.
 *
 * 6 showcases: 3 layouts × 2 featured themes (dark, neon)
 * Duration: 270 frames (9s at 30fps)
 *
 * REGISTERED COMPOSITIONS:
 *   CountdownHypeDarkTimer     - Dark theme, timer layout
 *   CountdownHypeNeonTimer     - Neon theme, timer layout
 *   CountdownHypeDarkTeaser    - Dark theme, teaser layout
 *   CountdownHypeNeonTeaser    - Neon theme, teaser layout
 *   CountdownHypeDarkUrgency   - Dark theme, urgency layout
 *   CountdownHypeNeonUrgency   - Neon theme, urgency layout
 */

import React from "react";
import { CountdownHype } from "./CountdownHype";
import type { CountdownHypeSpec } from "./CountdownHype";
import {
  THEME_DARK,
  THEME_NEON,
  BrandKit,
  applyBrandKit,
} from "../_shared/themes";

// ── Sample Data: Product Launch Countdown ───────────────────────
const SAMPLE_SPEC_LAUNCH: CountdownHypeSpec = {
  event_title: "Nova Pro Launch",
  countdown_value: 14,
  tagline: "The next generation of creative tools is almost here",
  urgency_message: "Early bird pricing ends soon",
  availability_percent: 30,
};

// ── Sample Data: Limited-Time Event ─────────────────────────────
const SAMPLE_SPEC_EVENT: CountdownHypeSpec = {
  event_title: "Creator Summit 2025",
  countdown_value: 7,
  tagline: "Join 5,000+ creators for the biggest event of the year",
  urgency_message: "Only 15% of tickets remaining!",
  availability_percent: 15,
};

// ── Composition: Dark + Timer ───────────────────────────────────
export const CountdownHypeDarkTimer: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <CountdownHype spec={SAMPLE_SPEC_LAUNCH} theme={applyBrandKit(THEME_DARK, brandKit)} layout="timer" />
);

// ── Composition: Neon + Timer ───────────────────────────────────
export const CountdownHypeNeonTimer: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <CountdownHype spec={SAMPLE_SPEC_LAUNCH} theme={applyBrandKit(THEME_NEON, brandKit)} layout="timer" />
);

// ── Composition: Dark + Teaser ──────────────────────────────────
export const CountdownHypeDarkTeaser: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <CountdownHype spec={SAMPLE_SPEC_EVENT} theme={applyBrandKit(THEME_DARK, brandKit)} layout="teaser" />
);

// ── Composition: Neon + Teaser ──────────────────────────────────
export const CountdownHypeNeonTeaser: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <CountdownHype spec={SAMPLE_SPEC_EVENT} theme={applyBrandKit(THEME_NEON, brandKit)} layout="teaser" />
);

// ── Composition: Dark + Urgency ─────────────────────────────────
export const CountdownHypeDarkUrgency: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <CountdownHype spec={SAMPLE_SPEC_EVENT} theme={applyBrandKit(THEME_DARK, brandKit)} layout="urgency" />
);

// ── Composition: Neon + Urgency ─────────────────────────────────
export const CountdownHypeNeonUrgency: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <CountdownHype spec={SAMPLE_SPEC_EVENT} theme={applyBrandKit(THEME_NEON, brandKit)} layout="urgency" />
);
