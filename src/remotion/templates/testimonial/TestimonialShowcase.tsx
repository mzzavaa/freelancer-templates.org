/**
 * Testimonial Showcase - Pre-configured compositions for each theme × layout combo.
 * 
 * These are ready-to-register compositions with sample data.
 * In production, the AgentCore crew would generate these dynamically
 * by passing a TestimonialSpec + theme name.
 * 
 * REGISTERED COMPOSITIONS:
 *   TestimonialDarkCentered     - Dark theme, centered layout
 *   TestimonialCleanSplit       - Clean/light theme, split layout
 *   TestimonialBoldEditorial    - Bold theme, editorial layout
 *   TestimonialWarmCentered     - Warm theme, centered layout
 *   TestimonialMinimalEditorial - Minimal theme, editorial layout
 *   TestimonialNeonSplit        - Neon theme, split layout
 */

import React from "react";
import { Testimonial } from "./Testimonial";
import type { TestimonialSpec } from "./Testimonial";
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

// ── Sample Data ─────────────────────────────────────────────────
// Replace with real client data in production.
const SAMPLE_SPEC: TestimonialSpec = {
  client_name: "Mrs Lee G",
  client_title: "Head of Product",
  client_company: "TechFlow Inc.",
  quote: "Working with this team transformed our entire product pipeline. We shipped 3x faster and our users noticed the difference immediately.",
  rating: 5,
  project_type: "Product Strategy",
  freelancer_name: "Linda Mohamed",
  freelancer_title: "Product Consultant",
  cta_text: "Book a free consultation",
};

const SAMPLE_SPEC_SHORT: TestimonialSpec = {
  client_name: "Linda Mohamed",
  client_title: "CTO",
  client_company: "DataBridge",
  quote: "The best investment we made this year. Period.",
  rating: 5,
  project_type: "Cloud Architecture",
};

// ── Composition: Dark + Centered ────────────────────────────────
export const TestimonialDarkCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_DARK, brandKit)} layout="centered" bgPattern="grid" />
);

// ── Composition: Clean + Split ──────────────────────────────────
export const TestimonialCleanSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CLEAN, brandKit)} layout="split" bgPattern="dots" />
);

// ── Composition: Bold + Editorial ───────────────────────────────
export const TestimonialBoldEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_BOLD, brandKit)} layout="editorial" bgPattern="none" />
);

// ── Composition: Warm + Centered ────────────────────────────────
export const TestimonialWarmCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_WARM, brandKit)} layout="centered" bgPattern="hex" />
);

// ── Composition: Minimal + Editorial ────────────────────────────
export const TestimonialMinimalEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_MINIMAL, brandKit)} layout="editorial" bgPattern="none" />
);

// ── Composition: Neon + Split ───────────────────────────────────
export const TestimonialNeonSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_NEON, brandKit)} layout="split" bgPattern="hex" />
);

// ── Extended Themes ──────────────────────────────────────────────

export const TestimonialOceanCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_OCEAN, brandKit)} layout="centered" bgPattern="grid" />
);

export const TestimonialSunsetSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SUNSET, brandKit)} layout="split" bgPattern="none" />
);

export const TestimonialForestCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FOREST, brandKit)} layout="centered" bgPattern="hex" />
);

export const TestimonialRoseEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_ROSE, brandKit)} layout="editorial" bgPattern="none" />
);

export const TestimonialGoldCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_GOLD, brandKit)} layout="centered" bgPattern="hex" />
);

export const TestimonialMidnightCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MIDNIGHT, brandKit)} layout="centered" bgPattern="grid" />
);

export const TestimonialCrimsonEditorial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_CRIMSON, brandKit)} layout="editorial" bgPattern="none" />
);

export const TestimonialLavenderSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_LAVENDER, brandKit)} layout="split" bgPattern="hex" />
);

export const TestimonialArcticSplit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ARCTIC, brandKit)} layout="split" bgPattern="dots" />
);

export const TestimonialEspressoCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Testimonial spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ESPRESSO, brandKit)} layout="centered" bgPattern="hex" />
);
