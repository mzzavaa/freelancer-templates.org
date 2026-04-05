/**
 * MusicVisualizer Showcase Compositions - 6 variants (3 layouts × 2 themes)
 */
import React from "react";
import { MusicVisualizer } from "./MusicVisualizer";
import {
  THEME_DARK,
  THEME_NEON,
  BrandKit,
  applyBrandKit,
} from "../_shared/themes";

const SAMPLE_SPEC = {
  track_title: "Neon Horizons",
  artist: "Synthwave Collective",
  album: "Digital Dreams",
  lyrics: [
    { text: "Racing through the neon night", startFrame: 40 },
    { text: "Chrome reflections burning bright", startFrame: 80 },
    { text: "Synthesizers fill the air", startFrame: 120 },
    { text: "Electric dreams everywhere", startFrame: 160 },
    { text: "We are the future now", startFrame: 200 },
  ],
  release_date: "2026",
};

export const MusicVisualizerDarkBars: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <MusicVisualizer spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_DARK, brandKit)} layout="bars" />
);
export const MusicVisualizerNeonBars: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <MusicVisualizer spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_NEON, brandKit)} layout="bars" />
);
export const MusicVisualizerDarkRadial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <MusicVisualizer spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_DARK, brandKit)} layout="radial" />
);
export const MusicVisualizerNeonRadial: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <MusicVisualizer spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_NEON, brandKit)} layout="radial" />
);
export const MusicVisualizerDarkLyrics: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <MusicVisualizer spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_DARK, brandKit)} layout="lyrics" />
);
export const MusicVisualizerNeonLyrics: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <MusicVisualizer spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_NEON, brandKit)} layout="lyrics" />
);
