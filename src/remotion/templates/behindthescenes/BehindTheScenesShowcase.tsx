/**
 * Behind The Scenes Showcase - Pre-configured compositions for each layout × theme combo.
 *
 * 6 showcases: 3 layouts × 2 featured themes (dark, warm)
 * Duration: 270 frames (9s at 30fps)
 *
 * REGISTERED COMPOSITIONS:
 *   BehindTheScenesDarkSceneCards     - Dark theme, scene-cards layout
 *   BehindTheScenesWarmSceneCards     - Warm theme, scene-cards layout
 *   BehindTheScenesDarkTimeline       - Dark theme, timeline layout
 *   BehindTheScenesWarmTimeline       - Warm theme, timeline layout
 *   BehindTheScenesDarkProcessFlow    - Dark theme, process-flow layout
 *   BehindTheScenesWarmProcessFlow    - Warm theme, process-flow layout
 */

import React from "react";
import { BehindTheScenes } from "./BehindTheScenes";
import type { BehindTheScenesSpec } from "./BehindTheScenes";
import {
  THEME_DARK,
  THEME_WARM,
  BrandKit,
  applyBrandKit,
} from "../_shared/themes";

// ── Sample Data: Brand Film ─────────────────────────────────────
const SAMPLE_SPEC_FILM: BehindTheScenesSpec = {
  title: "Making of Our Brand Film",
  scenes: [
    { title: "Pre-Production", description: "Storyboarding, location scouting, and casting the perfect team", caption: "Week 1" },
    { title: "Set Design", description: "Building the miniature city set with 200+ handcrafted buildings", caption: "Week 2-3" },
    { title: "Principal Photography", description: "Three days of shooting with a crew of 15 across two locations", caption: "Week 4" },
    { title: "Post-Production", description: "Color grading, VFX compositing, and sound design", caption: "Week 5-6" },
  ],
  closing_message: "See the final result →",
};

// ── Sample Data: Product Launch ─────────────────────────────────
const SAMPLE_SPEC_PRODUCT: BehindTheScenesSpec = {
  title: "How We Built v2.0",
  scenes: [
    { title: "Research", description: "500+ user interviews to identify the top pain points", caption: "Q1" },
    { title: "Design Sprint", description: "5-day design sprint with cross-functional team of 8", caption: "Q2" },
    { title: "Engineering", description: "12 weeks of focused development with weekly demos", caption: "Q2-Q3" },
    { title: "Beta Testing", description: "200 beta users, 1,400 feedback items, 47 iterations", caption: "Q3" },
    { title: "Launch Day", description: "Coordinated release across all channels with live stream", caption: "Q4" },
  ],
  closing_message: "Try v2.0 Today",
};

// ── Composition: Dark + Scene Cards ─────────────────────────────
export const BehindTheScenesDarkSceneCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <BehindTheScenes spec={SAMPLE_SPEC_FILM} theme={applyBrandKit(THEME_DARK, brandKit)} layout="scene-cards" />
);

// ── Composition: Warm + Scene Cards ─────────────────────────────
export const BehindTheScenesWarmSceneCards: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <BehindTheScenes spec={SAMPLE_SPEC_FILM} theme={applyBrandKit(THEME_WARM, brandKit)} layout="scene-cards" />
);

// ── Composition: Dark + Timeline ────────────────────────────────
export const BehindTheScenesDarkTimeline: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <BehindTheScenes spec={SAMPLE_SPEC_PRODUCT} theme={applyBrandKit(THEME_DARK, brandKit)} layout="timeline" />
);

// ── Composition: Warm + Timeline ────────────────────────────────
export const BehindTheScenesWarmTimeline: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <BehindTheScenes spec={SAMPLE_SPEC_PRODUCT} theme={applyBrandKit(THEME_WARM, brandKit)} layout="timeline" />
);

// ── Composition: Dark + Process Flow ────────────────────────────
export const BehindTheScenesDarkProcessFlow: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <BehindTheScenes spec={SAMPLE_SPEC_FILM} theme={applyBrandKit(THEME_DARK, brandKit)} layout="process-flow" />
);

// ── Composition: Warm + Process Flow ────────────────────────────
export const BehindTheScenesWarmProcessFlow: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <BehindTheScenes spec={SAMPLE_SPEC_PRODUCT} theme={applyBrandKit(THEME_WARM, brandKit)} layout="process-flow" />
);
