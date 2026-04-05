/**
 * Collaboration Showcase Compositions - 6 variants (3 layouts × 2 themes)
 */
import React from "react";
import { Collaboration } from "./Collaboration";
import {
  THEME_DARK,
  THEME_BOLD,
  BrandKit,
  applyBrandKit,
} from "../_shared/themes";

const SAMPLE_SPEC = {
  collab_title: "Creative Fusion Project",
  creators: [
    { name: "Linda Mohamed", audience: 450000 },
    { name: "Linda Mohamed", audience: 320000 },
  ],
  description: "Two top creators unite for a groundbreaking content series",
  combined_audience: 770000,
};

export const CollaborationDarkSplitScreen: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Collaboration spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_DARK, brandKit)} layout="split-screen" />
);
export const CollaborationBoldSplitScreen: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Collaboration spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BOLD, brandKit)} layout="split-screen" />
);
export const CollaborationDarkAnnouncement: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Collaboration spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_DARK, brandKit)} layout="announcement" />
);
export const CollaborationBoldAnnouncement: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Collaboration spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BOLD, brandKit)} layout="announcement" />
);
export const CollaborationDarkStatsMerge: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Collaboration spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_DARK, brandKit)} layout="stats-merge" />
);
export const CollaborationBoldStatsMerge: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Collaboration spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BOLD, brandKit)} layout="stats-merge" />
);
