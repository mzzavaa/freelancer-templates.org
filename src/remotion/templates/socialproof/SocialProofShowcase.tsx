/**
 * SocialProof Showcase - 6 pre-configured compositions with sample data
 * Each pairs a theme with the layout that suits it best.
 */

import React from "react";
import { SocialProof, SocialProofSpec } from "./SocialProof";
import {
  THEME_DARK,
  THEME_CLEAN,
  THEME_BOLD,
  THEME_WARM,
  THEME_MINIMAL,
  THEME_NEON,
  THEME_OCEAN,
  THEME_SUNSET,
  THEME_FOREST,
  THEME_ROSE,
  THEME_GOLD,
  THEME_MIDNIGHT,
  THEME_CRIMSON,
  THEME_LAVENDER,
  THEME_ARCTIC,
  THEME_ESPRESSO,
  BrandKit,
  applyBrandKit,
} from "../_shared/themes";

const SAMPLE_SPEC: SocialProofSpec = {
  headline: "A Milestone Worth Celebrating",
  subheadline: "What started as a side project is now a full-time mission.",
  mainStat: { label: "Happy Clients", value: 100, suffix: "+" },
  supportingStats: [
    { label: "Projects Delivered", value: 247 },
    { label: "Countries", value: 18 },
    { label: "5-Star Reviews", value: 94, suffix: "%" },
  ],
  context: "From my first Upwork gig to building a global practice - thank you to every client who trusted the process.",
  hashtags: ["Milestone", "Freelancing", "100Clients"],
  freelancerName: "Linda Mohamed",
  freelancerTitle: "Full-Stack Developer & Consultant",
};

// Dark + Milestone - the classic celebratory look
export const SocialProofDarkMilestone: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SocialProof spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_DARK, brandKit)} layout="milestone" />
);

// Clean + Achievement - professional badge-centered
export const SocialProofCleanAchievement: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SocialProof spec={{
    ...SAMPLE_SPEC,
    headline: "AWS Certified Solutions Architect",
    subheadline: "Professional certification achieved",
    mainStat: { label: "Exam Score", value: 892, suffix: "/1000" },
    supportingStats: [
      { label: "Study Hours", value: 120 },
      { label: "Practice Tests", value: 8 },
    ],
  }} theme={applyBrandKit(THEME_CLEAN, brandKit)} layout="achievement" />
);

// Bold + Announcement - high-impact news
export const SocialProofBoldAnnouncement: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SocialProof spec={{
    ...SAMPLE_SPEC,
    headline: "Launching My New AI Automation Service",
    subheadline: "Helping businesses automate their workflows with custom AI agents.",
    mainStat: { label: "Early Signups", value: 50, suffix: "+" },
    supportingStats: [
      { label: "Avg. Time Saved", value: 40, suffix: "%" },
      { label: "ROI", value: 3, suffix: "x" },
    ],
    hashtags: ["Launch", "AIAutomation", "NewService"],
  }} theme={applyBrandKit(THEME_BOLD, brandKit)} layout="announcement" />
);

// Warm + Milestone - friendly celebration
export const SocialProofWarmMilestone: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SocialProof spec={{
    ...SAMPLE_SPEC,
    headline: "One Year of Freelancing",
    mainStat: { label: "Months", value: 12, prefix: "" },
    supportingStats: [
      { label: "Revenue", value: 85, suffix: "k", prefix: "$" },
      { label: "Repeat Clients", value: 67, suffix: "%" },
    ],
    context: "365 days of learning, building, and growing. Here's to year two.",
    hashtags: ["Anniversary", "FreelanceLife"],
  }} theme={applyBrandKit(THEME_WARM, brandKit)} layout="milestone" />
);

// Minimal + Achievement - understated elegance
export const SocialProofMinimalAchievement: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SocialProof spec={{
    ...SAMPLE_SPEC,
    headline: "Top Rated Plus on Upwork",
    subheadline: "Recognized for consistent quality and client satisfaction",
    mainStat: { label: "Job Success Score", value: 100, suffix: "%" },
    supportingStats: [
      { label: "Completed Jobs", value: 89 },
      { label: "Earnings", value: 150, suffix: "k+", prefix: "$" },
    ],
  }} theme={applyBrandKit(THEME_MINIMAL, brandKit)} layout="achievement" />
);

// Neon + Announcement - energetic tech launch
export const SocialProofNeonAnnouncement: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SocialProof spec={{
    ...SAMPLE_SPEC,
    headline: "Open-Sourcing My Video Engine",
    subheadline: "The same tool that powers 200+ client videos - now free for everyone.",
    mainStat: { label: "GitHub Stars", value: 2400 },
    supportingStats: [
      { label: "Contributors", value: 34 },
      { label: "Downloads", value: 12, suffix: "k" },
    ],
    hashtags: ["OpenSource", "DevTools", "Remotion"],
  }} theme={applyBrandKit(THEME_NEON, brandKit)} layout="announcement" />
);

// ── Extended Themes ──────────────────────────────────────────────

export const SocialProofOceanAchievement: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SocialProof spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_OCEAN, brandKit)} layout="achievement" />
);

export const SocialProofSunsetAnnouncement: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SocialProof spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SUNSET, brandKit)} layout="announcement" />
);

export const SocialProofForestMilestone: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SocialProof spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FOREST, brandKit)} layout="milestone" />
);

export const SocialProofRoseAnnouncement: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SocialProof spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ROSE, brandKit)} layout="announcement" />
);

export const SocialProofGoldAchievement: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SocialProof spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_GOLD, brandKit)} layout="achievement" />
);

export const SocialProofMidnightAchievement: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SocialProof spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MIDNIGHT, brandKit)} layout="achievement" />
);

export const SocialProofCrimsonAnnouncement: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SocialProof spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CRIMSON, brandKit)} layout="announcement" />
);

export const SocialProofLavenderMilestone: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SocialProof spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_LAVENDER, brandKit)} layout="milestone" />
);

export const SocialProofArcticAchievement: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SocialProof spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ARCTIC, brandKit)} layout="achievement" />
);

export const SocialProofEspressoMilestone: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <SocialProof spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ESPRESSO, brandKit)} layout="milestone" />
);
