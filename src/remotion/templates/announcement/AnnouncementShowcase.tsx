/**
 * Announcement Showcase - Pre-configured compositions
 * 
 * Vertical format (9:16) for Stories, Reels, YouTube Shorts
 * Square format (1:1) for Instagram Feed, LinkedIn
 */

import React from "react";
import { Announcement } from "./Announcement";
import type { AnnouncementSpec } from "./Announcement";
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
const SAMPLE_SPEC: AnnouncementSpec = {
  badge_text: "New Release",
  headline: "Version 2.0 is Here",
  subheadline: "Faster, smarter, and more powerful than ever before.",
  details: "Available now on all platforms",
  cta_text: "Learn More",
  date: "April 2026",
  icon_type: "rocket",
};

const SAMPLE_SPEC_LAUNCH: AnnouncementSpec = {
  badge_text: "Coming Soon",
  headline: "Something Big is Coming",
  subheadline: "Get ready for the next evolution in creative tools.",
  cta_text: "Join the Waitlist",
  icon_type: "sparkle",
};

const SAMPLE_SPEC_EVENT: AnnouncementSpec = {
  badge_text: "Live Event",
  headline: "Join Us This Friday",
  subheadline: "An exclusive workshop for creators and entrepreneurs.",
  date: "Friday, April 17 at 2PM EST",
  cta_text: "Register Now",
  icon_type: "party",
};

// ── Square Format (1:1) ──────────────────────────────────────────

export const AnnouncementDarkBanner: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Announcement spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_DARK, brandKit)} layout="banner" format="square" />
);

export const AnnouncementNeonCard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Announcement spec={SAMPLE_SPEC_LAUNCH} theme={applyBrandKit(THEME_NEON, brandKit)} layout="card" format="square" />
);

export const AnnouncementCandyBanner: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Announcement spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CANDY, brandKit)} layout="banner" format="square" />
);

export const AnnouncementMintCard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Announcement spec={SAMPLE_SPEC_EVENT} theme={applyBrandKit(THEME_MINT, brandKit)} layout="card" format="square" />
);

export const AnnouncementCoralMinimal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Announcement spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CORAL, brandKit)} layout="minimal" format="square" />
);

export const AnnouncementSkyBanner: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Announcement spec={SAMPLE_SPEC_LAUNCH} theme={applyBrandKit(THEME_SKY, brandKit)} layout="banner" format="square" />
);

export const AnnouncementGrapeCard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Announcement spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_GRAPE, brandKit)} layout="card" format="square" />
);

export const AnnouncementCharcoalMinimal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Announcement spec={SAMPLE_SPEC_EVENT} theme={applyBrandKit(THEME_CHARCOAL, brandKit)} layout="minimal" format="square" />
);

export const AnnouncementCreamCard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Announcement spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CREAM, brandKit)} layout="card" format="square" />
);

export const AnnouncementOceanDarkBanner: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Announcement spec={SAMPLE_SPEC_LAUNCH} theme={applyBrandKit(THEME_OCEAN_DARK, brandKit)} layout="banner" format="square" />
);

// ── Vertical Format (9:16) - Stories ─────────────────────────────

export const AnnouncementDarkBannerVertical: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Announcement spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_DARK, brandKit)} layout="banner" format="vertical" />
);

export const AnnouncementNeonCardVertical: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Announcement spec={SAMPLE_SPEC_LAUNCH} theme={applyBrandKit(THEME_NEON, brandKit)} layout="card" format="vertical" />
);

export const AnnouncementCandyBannerVertical: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Announcement spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CANDY, brandKit)} layout="banner" format="vertical" />
);

export const AnnouncementPeachMinimalVertical: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Announcement spec={SAMPLE_SPEC_EVENT} theme={applyBrandKit(THEME_PEACH, brandKit)} layout="minimal" format="vertical" />
);

export const AnnouncementElectricBannerVertical: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Announcement spec={SAMPLE_SPEC_LAUNCH} theme={applyBrandKit(THEME_ELECTRIC, brandKit)} layout="banner" format="vertical" />
);
