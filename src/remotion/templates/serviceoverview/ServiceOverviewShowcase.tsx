import React from "react";
import { ServiceOverview } from "./ServiceOverview";
import type { ServiceOverviewSpec } from "./ServiceOverview";
import {
  THEME_DARK, THEME_CLEAN, THEME_BOLD, THEME_WARM, THEME_MINIMAL, THEME_NEON,
  THEME_OCEAN, THEME_SUNSET, THEME_FOREST, THEME_ROSE, THEME_GOLD, THEME_MIDNIGHT,
  THEME_CRIMSON, THEME_LAVENDER, THEME_ARCTIC, THEME_ESPRESSO,
  THEME_CORPORATE, THEME_INDUSTRIAL, THEME_VIENNA, THEME_ALPINE, THEME_FINANCE,
  BrandKit, applyBrandKit,
} from "../_shared/themes";

const SAMPLE_SPEC: ServiceOverviewSpec = {
  headline: "What I Do",
  freelancer_name: "Linda Mohamed",
  freelancer_title: "AI & Product Consultant",
  services: [
    {
      icon: "🧠",
      title: "Strategy & Discovery",
      description: "Align your team on a clear AI roadmap — from opportunity mapping to prioritised backlog. No fluff, just decisions.",
      tags: ["AI Strategy", "Roadmap", "Workshops"],
    },
    {
      icon: "🛠️",
      title: "Build & Deliver",
      description: "Full-stack development of AI-powered features: API integrations, LLM pipelines, and production-ready dashboards.",
      tags: ["Python", "React", "LLMs", "APIs"],
    },
    {
      icon: "📈",
      title: "Growth & Optimisation",
      description: "Data-driven iteration on what ships. A/B testing, funnel analysis, and retention engineering.",
      tags: ["Analytics", "A/B Testing", "Growth"],
    },
  ],
  ideal_client: "Best for: SaaS founders & teams scaling their AI capabilities",
  cta: "Book a free 30-min intro call →",
};

export const ServiceOverviewDarkDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ServiceOverview spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_DARK,     brandKit)} bgPattern="hex" />;
export const ServiceOverviewBoldDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ServiceOverview spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BOLD,     brandKit)} bgPattern="grid" />;
export const ServiceOverviewCleanDashboard:    React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ServiceOverview spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CLEAN,    brandKit)} bgPattern="dots" />;
export const ServiceOverviewWarmDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ServiceOverview spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_WARM,     brandKit)} bgPattern="hex" />;
export const ServiceOverviewMinimalDashboard:  React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ServiceOverview spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MINIMAL,  brandKit)} bgPattern="none" />;
export const ServiceOverviewNeonDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ServiceOverview spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_NEON,     brandKit)} bgPattern="grid" />;
export const ServiceOverviewOceanDashboard:    React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ServiceOverview spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_OCEAN,    brandKit)} bgPattern="dots" />;
export const ServiceOverviewSunsetDashboard:   React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ServiceOverview spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SUNSET,   brandKit)} bgPattern="hex" />;
export const ServiceOverviewForestDashboard:   React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ServiceOverview spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FOREST,   brandKit)} bgPattern="dots" />;
export const ServiceOverviewRoseDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ServiceOverview spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ROSE,     brandKit)} bgPattern="none" />;
export const ServiceOverviewGoldDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ServiceOverview spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_GOLD,     brandKit)} bgPattern="hex" />;
export const ServiceOverviewMidnightDashboard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ServiceOverview spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MIDNIGHT, brandKit)} bgPattern="grid" />;
export const ServiceOverviewCrimsonDashboard:  React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ServiceOverview spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CRIMSON,  brandKit)} bgPattern="dots" />;
export const ServiceOverviewLavenderDashboard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ServiceOverview spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_LAVENDER, brandKit)} bgPattern="hex" />;
export const ServiceOverviewArcticDashboard:   React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ServiceOverview spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ARCTIC,   brandKit)} bgPattern="dots" />;
export const ServiceOverviewEspressoDashboard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ServiceOverview spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ESPRESSO, brandKit)} bgPattern="none" />;

// ── European Themes ───────────────────────────────────────────────
export const ServiceOverviewCorporateDashboard:  React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ServiceOverview spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CORPORATE,  brandKit)} bgPattern="grid" />;
export const ServiceOverviewIndustrialDashboard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ServiceOverview spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_INDUSTRIAL, brandKit)} bgPattern="dots" />;
export const ServiceOverviewViennaDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ServiceOverview spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_VIENNA,     brandKit)} bgPattern="hex" />;
export const ServiceOverviewAlpineDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ServiceOverview spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ALPINE,     brandKit)} bgPattern="dots" />;
export const ServiceOverviewFinanceDashboard:    React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <ServiceOverview spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FINANCE,    brandKit)} bgPattern="hex" />;
