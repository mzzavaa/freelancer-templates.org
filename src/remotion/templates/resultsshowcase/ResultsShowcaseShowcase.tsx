import React from "react";
import { ResultsShowcase } from "./ResultsShowcase";
import type { ResultsShowcaseSpec } from "./ResultsShowcase";
import {
  THEME_DARK, THEME_CLEAN, THEME_BOLD, THEME_WARM, THEME_MINIMAL, THEME_NEON,
  THEME_OCEAN, THEME_SUNSET, THEME_FOREST, THEME_ROSE, THEME_GOLD, THEME_MIDNIGHT,
  THEME_CRIMSON, THEME_LAVENDER, THEME_ARCTIC, THEME_ESPRESSO,
  THEME_CORPORATE, THEME_INDUSTRIAL, THEME_VIENNA, THEME_ALPINE, THEME_FINANCE,
  BrandKit, applyBrandKit,
} from "../_shared/themes";

const SAMPLE_SPEC: ResultsShowcaseSpec = {
  title: "The Results",
  subtitle: "What we achieved together in 90 days",
  metrics: [
    { label: "Revenue Increase",  value: 41, suffix: "%",  delta: "+41%",   context: "vs prior quarter" },
    { label: "Avg Resolve Time",  value: 2,  suffix: "hr", delta: "−6 hrs", context: "per support ticket" },
    { label: "Churn Reduced",     value: 28, suffix: "%",  delta: "−28%",   context: "monthly churn rate" },
  ],
  quote: "Linda turned our roadmap chaos into a revenue engine in just three months.",
  quote_author: "Sarah K., CEO at Acme Corp",
  freelancer_name: "Linda Mohamed",
  freelancer_title: "Product & Growth Consultant",
};

export const ResultsShowcaseDarkDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ResultsShowcase spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_DARK,     brandKit)} bgPattern="grid" />;
export const ResultsShowcaseBoldDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ResultsShowcase spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BOLD,     brandKit)} bgPattern="dots" />;
export const ResultsShowcaseCleanDashboard:    React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ResultsShowcase spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CLEAN,    brandKit)} bgPattern="dots" />;
export const ResultsShowcaseWarmDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ResultsShowcase spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_WARM,     brandKit)} bgPattern="hex" />;
export const ResultsShowcaseMinimalDashboard:  React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ResultsShowcase spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MINIMAL,  brandKit)} bgPattern="none" />;
export const ResultsShowcaseNeonDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ResultsShowcase spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_NEON,     brandKit)} bgPattern="grid" />;
export const ResultsShowcaseOceanDashboard:    React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ResultsShowcase spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_OCEAN,    brandKit)} bgPattern="dots" />;
export const ResultsShowcaseSunsetDashboard:   React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ResultsShowcase spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SUNSET,   brandKit)} bgPattern="hex" />;
export const ResultsShowcaseForestDashboard:   React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ResultsShowcase spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FOREST,   brandKit)} bgPattern="dots" />;
export const ResultsShowcaseRoseDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ResultsShowcase spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ROSE,     brandKit)} bgPattern="none" />;
export const ResultsShowcaseGoldDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ResultsShowcase spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_GOLD,     brandKit)} bgPattern="hex" />;
export const ResultsShowcaseMidnightDashboard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ResultsShowcase spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MIDNIGHT, brandKit)} bgPattern="grid" />;
export const ResultsShowcaseCrimsonDashboard:  React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ResultsShowcase spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CRIMSON,  brandKit)} bgPattern="dots" />;
export const ResultsShowcaseLavenderDashboard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ResultsShowcase spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_LAVENDER, brandKit)} bgPattern="hex" />;
export const ResultsShowcaseArcticDashboard:   React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ResultsShowcase spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ARCTIC,   brandKit)} bgPattern="dots" />;
export const ResultsShowcaseEspressoDashboard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ResultsShowcase spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ESPRESSO, brandKit)} bgPattern="none" />;

// ── European Themes ───────────────────────────────────────────────
export const ResultsShowcaseCorporateDashboard:  React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ResultsShowcase spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CORPORATE,  brandKit)} bgPattern="grid" />;
export const ResultsShowcaseIndustrialDashboard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ResultsShowcase spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_INDUSTRIAL, brandKit)} bgPattern="dots" />;
export const ResultsShowcaseViennaDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ResultsShowcase spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_VIENNA,     brandKit)} bgPattern="hex" />;
export const ResultsShowcaseAlpineDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ResultsShowcase spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ALPINE,     brandKit)} bgPattern="dots" />;
export const ResultsShowcaseFinanceDashboard:    React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ResultsShowcase spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FINANCE,    brandKit)} bgPattern="hex" />;
