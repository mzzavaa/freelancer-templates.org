/**
 * CallToAction Showcase - Pre-configured compositions
 * 
 * Vertical format (9:16) for Stories, Reels, YouTube Shorts
 * Square format (1:1) for Instagram Feed, LinkedIn
 */

import React from "react";
import { CallToAction } from "./CallToAction";
import type { CallToActionSpec } from "./CallToAction";
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
const SAMPLE_CENTERED: CallToActionSpec = {
  headline: "Ready to Level Up?",
  subheadline: "Join thousands of creators who are already using our tools.",
  description: "Get started for free. No credit card required.",
  cta_text: "Start Free Trial",
  cta_secondary_text: "or view pricing",
  icon_type: "arrow",
  urgency_text: "Limited time: 50% off first month",
};

const SAMPLE_SPLIT: CallToActionSpec = {
  headline: "Download Our Free Guide",
  subheadline: "Learn the secrets to growing your audience in 2026.",
  cta_text: "Get the Guide",
  icon_type: "download",
  background_image: "https://picsum.photos/1080/1080",
};

const SAMPLE_MINIMAL: CallToActionSpec = {
  headline: "Let's Work Together",
  subheadline: "I help brands tell their story through compelling video content.",
  cta_text: "Get in Touch",
  icon_type: "mail",
};

const SAMPLE_PLAY: CallToActionSpec = {
  headline: "Watch the Demo",
  subheadline: "See how easy it is to create stunning videos in minutes.",
  cta_text: "Play Video",
  icon_type: "play",
};

// ── Square Format (1:1) ──────────────────────────────────────────

export const CallToActionDarkCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <CallToAction spec={SAMPLE_CENTERED} theme={applyBrandKit(THEME_DARK, brandKit)} layout="centered" format="square" />
);

export const CallToActionNeonSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <CallToAction spec={SAMPLE_SPLIT} theme={applyBrandKit(THEME_NEON, brandKit)} layout="split" format="square" />
);

export const CallToActionCandyCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <CallToAction spec={SAMPLE_CENTERED} theme={applyBrandKit(THEME_CANDY, brandKit)} layout="centered" format="square" />
);

export const CallToActionMintMinimal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <CallToAction spec={SAMPLE_MINIMAL} theme={applyBrandKit(THEME_MINT, brandKit)} layout="minimal" format="square" />
);

export const CallToActionCoralSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <CallToAction spec={SAMPLE_SPLIT} theme={applyBrandKit(THEME_CORAL, brandKit)} layout="split" format="square" />
);

export const CallToActionSkyCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <CallToAction spec={SAMPLE_PLAY} theme={applyBrandKit(THEME_SKY, brandKit)} layout="centered" format="square" />
);

export const CallToActionGrapeMinimal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <CallToAction spec={SAMPLE_MINIMAL} theme={applyBrandKit(THEME_GRAPE, brandKit)} layout="minimal" format="square" />
);

export const CallToActionCharcoalCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <CallToAction spec={SAMPLE_CENTERED} theme={applyBrandKit(THEME_CHARCOAL, brandKit)} layout="centered" format="square" />
);

export const CallToActionCreamSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <CallToAction spec={SAMPLE_SPLIT} theme={applyBrandKit(THEME_CREAM, brandKit)} layout="split" format="square" />
);

export const CallToActionOceanDarkMinimal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <CallToAction spec={SAMPLE_MINIMAL} theme={applyBrandKit(THEME_OCEAN_DARK, brandKit)} layout="minimal" format="square" />
);

// ── Vertical Format (9:16) - Stories ─────────────────────────────

export const CallToActionDarkCenteredVertical: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <CallToAction spec={SAMPLE_CENTERED} theme={applyBrandKit(THEME_DARK, brandKit)} layout="centered" format="vertical" />
);

export const CallToActionNeonSplitVertical: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <CallToAction spec={SAMPLE_SPLIT} theme={applyBrandKit(THEME_NEON, brandKit)} layout="split" format="vertical" />
);

export const CallToActionCandyMinimalVertical: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <CallToAction spec={SAMPLE_MINIMAL} theme={applyBrandKit(THEME_CANDY, brandKit)} layout="minimal" format="vertical" />
);

export const CallToActionPeachCenteredVertical: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <CallToAction spec={SAMPLE_PLAY} theme={applyBrandKit(THEME_PEACH, brandKit)} layout="centered" format="vertical" />
);

export const CallToActionElectricSplitVertical: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <CallToAction spec={SAMPLE_SPLIT} theme={applyBrandKit(THEME_ELECTRIC, brandKit)} layout="split" format="vertical" />
);
