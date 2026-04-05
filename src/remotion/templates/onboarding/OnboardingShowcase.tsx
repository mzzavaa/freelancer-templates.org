/**
 * Onboarding Showcase - Pre-configured compositions for each theme × layout combo.
 *
 * REGISTERED COMPOSITIONS:
 *   OnboardingDarkProfessional    - Dark theme, professional layout
 *   OnboardingCleanProfessional   - Clean theme, professional layout
 *   OnboardingBoldCreative        - Bold theme, creative layout
 *   OnboardingWarmFriendly        - Warm theme, friendly layout
 *   OnboardingMinimalProfessional - Minimal theme, professional layout
 *   OnboardingNeonCreative        - Neon theme, creative layout
 */

import React from "react";
import { Onboarding } from "./Onboarding";
import type { OnboardingSpec } from "./Onboarding";
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

// ── Sample Data: Web Dev Project ────────────────────────────────

const SAMPLE_WEBDEV_SPEC: OnboardingSpec = {
  client_name: "Mrs Lee G",
  freelancer_name: "Linda Mohamed",
  project_name: "StyleHouse E-Commerce Rebuild",
  welcome_message: "I'm thrilled to kick off this project with you. Over the next 8 weeks, we'll transform your e-commerce platform into a fast, modern shopping experience. Here's what to expect.",
  next_steps: [
    { step: 1, title: "Discovery Call", description: "30-min deep dive into your goals, brand guidelines, and technical requirements" },
    { step: 2, title: "Design Review", description: "I'll share wireframes and a clickable prototype for your feedback within 5 days" },
    { step: 3, title: "Sprint Kickoff", description: "Weekly builds with live demos every Friday - you'll see progress in real time" },
  ],
  tools_used: [
    { name: "Figma", icon: "palette" },
    { name: "Slack", icon: "chat" },
    { name: "Notion", icon: "pencil" },
    { name: "GitHub", icon: "layers" },
    { name: "Vercel", icon: "▲" },
  ],
  timeline_overview: "8 weeks - Launch by April 15",
};

// ── Sample Data: AI Consulting ──────────────────────────────────

const SAMPLE_AI_SPEC: OnboardingSpec = {
  client_name: "Linda Mohamed",
  freelancer_name: "Linda Mohamed",
  project_name: "DataPipe AI Automation",
  welcome_message: "Welcome aboard! We're going to automate your team's most repetitive workflows using custom AI agents. I've mapped out a clear path to get you from manual chaos to automated bliss.",
  next_steps: [
    { step: 1, title: "Workflow Audit", description: "I'll shadow your team for 2 days to map every manual process and identify quick wins" },
    { step: 2, title: "Agent Prototype", description: "First working AI agent delivered within 10 days - you'll test it with real data" },
    { step: 3, title: "Deploy & Train", description: "Production rollout with monitoring dashboards and team training sessions" },
  ],
  tools_used: [
    { name: "AWS", icon: "cloud" },
    { name: "Slack", icon: "chat" },
    { name: "Jira", icon: "document" },
    { name: "Python", icon: "code" },
  ],
  timeline_overview: "6 weeks - Go-live by March 30",
};

// ── Composition: Dark + Professional ────────────────────────────
export const OnboardingDarkProfessional: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Onboarding spec={SAMPLE_AI_SPEC} theme={applyBrandKit(THEME_DARK, brandKit)} layout="professional" bgPattern="grid" />
);

// ── Composition: Clean + Professional ───────────────────────────
export const OnboardingCleanProfessional: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Onboarding spec={SAMPLE_WEBDEV_SPEC} theme={applyBrandKit(THEME_CLEAN, brandKit)} layout="professional" bgPattern="dots" />
);

// ── Composition: Bold + Creative ────────────────────────────────
export const OnboardingBoldCreative: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Onboarding spec={SAMPLE_WEBDEV_SPEC} theme={applyBrandKit(THEME_BOLD, brandKit)} layout="creative" bgPattern="none" />
);

// ── Composition: Warm + Friendly ────────────────────────────────
export const OnboardingWarmFriendly: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Onboarding spec={SAMPLE_AI_SPEC} theme={applyBrandKit(THEME_WARM, brandKit)} layout="friendly" bgPattern="hex" />
);

// ── Composition: Minimal + Professional ─────────────────────────
export const OnboardingMinimalProfessional: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Onboarding spec={SAMPLE_WEBDEV_SPEC} theme={applyBrandKit(THEME_MINIMAL, brandKit)} layout="professional" bgPattern="none" />
);

// ── Composition: Neon + Creative ────────────────────────────────
export const OnboardingNeonCreative: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Onboarding spec={SAMPLE_AI_SPEC} theme={applyBrandKit(THEME_NEON, brandKit)} layout="creative" bgPattern="hex" />
);

// ── Extended Themes ──────────────────────────────────────────────

export const OnboardingOceanProfessional: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Onboarding spec={SAMPLE_AI_SPEC} theme={applyBrandKit(THEME_OCEAN, brandKit)} layout="professional" bgPattern="grid" />
);

export const OnboardingSunsetCreative: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Onboarding spec={SAMPLE_WEBDEV_SPEC} theme={applyBrandKit(THEME_SUNSET, brandKit)} layout="creative" bgPattern="none" />
);

export const OnboardingForestProfessional: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Onboarding spec={SAMPLE_AI_SPEC} theme={applyBrandKit(THEME_FOREST, brandKit)} layout="professional" bgPattern="hex" />
);

export const OnboardingRoseCreative: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Onboarding spec={SAMPLE_WEBDEV_SPEC} theme={applyBrandKit(THEME_ROSE, brandKit)} layout="creative" bgPattern="none" />
);

export const OnboardingGoldProfessional: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Onboarding spec={SAMPLE_AI_SPEC} theme={applyBrandKit(THEME_GOLD, brandKit)} layout="professional" bgPattern="hex" />
);

export const OnboardingMidnightProfessional: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Onboarding spec={SAMPLE_AI_SPEC} theme={applyBrandKit(THEME_MIDNIGHT, brandKit)} layout="professional" bgPattern="grid" />
);

export const OnboardingCrimsonCreative: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Onboarding spec={SAMPLE_WEBDEV_SPEC} theme={applyBrandKit(THEME_CRIMSON, brandKit)} layout="creative" bgPattern="none" />
);

export const OnboardingLavenderFriendly: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Onboarding spec={SAMPLE_AI_SPEC} theme={applyBrandKit(THEME_LAVENDER, brandKit)} layout="friendly" bgPattern="hex" />
);

export const OnboardingArcticProfessional: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Onboarding spec={SAMPLE_WEBDEV_SPEC} theme={applyBrandKit(THEME_ARCTIC, brandKit)} layout="professional" bgPattern="dots" />
);

export const OnboardingEspressoFriendly: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Onboarding spec={SAMPLE_AI_SPEC} theme={applyBrandKit(THEME_ESPRESSO, brandKit)} layout="friendly" bgPattern="hex" />
);
