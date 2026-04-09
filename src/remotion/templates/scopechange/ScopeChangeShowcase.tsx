import React from "react";
import { ScopeChange } from "./ScopeChange";
import type { ScopeChangeSpec } from "./ScopeChange";
import {
  THEME_DARK, THEME_CLEAN, THEME_BOLD, THEME_WARM, THEME_MINIMAL, THEME_NEON,
  THEME_OCEAN, THEME_SUNSET, THEME_FOREST, THEME_ROSE, THEME_GOLD, THEME_MIDNIGHT,
  THEME_CRIMSON, THEME_LAVENDER, THEME_ARCTIC, THEME_ESPRESSO,
  BrandKit, applyBrandKit,
} from "../_shared/themes";

const SAMPLE_SPEC: ScopeChangeSpec = {
  ref_number: "SCO-2025-004",
  date: "April 9, 2025",
  client_name: "Acme Corp",
  project_title: "Website Redesign",
  original_scope: "5 core pages, static layout, 4-week delivery",
  new_scope: "8 pages + blog CMS integration, responsive animations, 6-week delivery",
  reason: "Client requested a blog module and additional landing pages after the kickoff. The CMS integration introduces backend scope not in the original contract, requiring additional sprint planning.",
  impacts: [
    { label: "Timeline",      original: "4 weeks",  new: "6 weeks",          delta: "+2 weeks" },
    { label: "Budget",        original: "$8,000",   new: "$11,500",          delta: "+$3,500" },
    { label: "Deliverables",  original: "5 pages",  new: "8 pages + CMS",   delta: "+3 + CMS" },
  ],
  freelancer_name: "Linda Mohamed",
  freelancer_title: "Full-Stack Developer",
};

export const ScopeChangeDarkDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ScopeChange spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_DARK,     brandKit)} bgPattern="grid" />;
export const ScopeChangeBoldDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ScopeChange spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BOLD,     brandKit)} bgPattern="dots" />;
export const ScopeChangeCleanDashboard:    React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ScopeChange spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CLEAN,    brandKit)} bgPattern="dots" />;
export const ScopeChangeWarmDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ScopeChange spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_WARM,     brandKit)} bgPattern="hex" />;
export const ScopeChangeMinimalDashboard:  React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ScopeChange spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MINIMAL,  brandKit)} bgPattern="none" />;
export const ScopeChangeNeonDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ScopeChange spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_NEON,     brandKit)} bgPattern="grid" />;
export const ScopeChangeOceanDashboard:    React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ScopeChange spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_OCEAN,    brandKit)} bgPattern="dots" />;
export const ScopeChangeSunsetDashboard:   React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ScopeChange spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SUNSET,   brandKit)} bgPattern="hex" />;
export const ScopeChangeForestDashboard:   React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ScopeChange spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FOREST,   brandKit)} bgPattern="dots" />;
export const ScopeChangeRoseDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ScopeChange spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ROSE,     brandKit)} bgPattern="none" />;
export const ScopeChangeGoldDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ScopeChange spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_GOLD,     brandKit)} bgPattern="hex" />;
export const ScopeChangeMidnightDashboard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ScopeChange spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MIDNIGHT, brandKit)} bgPattern="grid" />;
export const ScopeChangeCrimsonDashboard:  React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ScopeChange spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CRIMSON,  brandKit)} bgPattern="dots" />;
export const ScopeChangeLavenderDashboard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ScopeChange spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_LAVENDER, brandKit)} bgPattern="hex" />;
export const ScopeChangeArcticDashboard:   React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ScopeChange spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ARCTIC,   brandKit)} bgPattern="dots" />;
export const ScopeChangeEspressoDashboard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ScopeChange spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ESPRESSO, brandKit)} bgPattern="none" />;
