import React from "react";
import { RateCard } from "./RateCard";
import type { RateCardSpec } from "./RateCard";
import {
  THEME_DARK, THEME_CLEAN, THEME_BOLD, THEME_WARM, THEME_MINIMAL, THEME_NEON,
  THEME_OCEAN, THEME_SUNSET, THEME_FOREST, THEME_ROSE, THEME_GOLD, THEME_MIDNIGHT,
  THEME_CRIMSON, THEME_LAVENDER, THEME_ARCTIC, THEME_ESPRESSO,
  BrandKit, applyBrandKit,
} from "../_shared/themes";

const SAMPLE_SPEC: RateCardSpec = {
  freelancer_name: "Linda Mohamed",
  specialty: "AI & Product Consultant · Full-Stack Developer",
  services: [
    { name: "Strategy & Discovery Session",  rate: 250,  unit: "/hr",      featured: false },
    { name: "Full Project Delivery Package", rate: 8500, unit: "/project", featured: true  },
    { name: "Code Review & Audit Sprint",    rate: 600,  unit: "/day",     featured: false },
    { name: "Monthly Retainer",              rate: 3500, unit: "/month",   featured: false },
  ],
  valid_until: "June 30, 2025",
  cta: "Book a free intro call →",
  currency: "$",
};

export const RateCardDarkDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <RateCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_DARK,     brandKit)} bgPattern="dots" />;
export const RateCardBoldDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <RateCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BOLD,     brandKit)} bgPattern="grid" />;
export const RateCardCleanDashboard:    React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <RateCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CLEAN,    brandKit)} bgPattern="dots" />;
export const RateCardWarmDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <RateCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_WARM,     brandKit)} bgPattern="hex" />;
export const RateCardMinimalDashboard:  React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <RateCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MINIMAL,  brandKit)} bgPattern="none" />;
export const RateCardNeonDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <RateCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_NEON,     brandKit)} bgPattern="grid" />;
export const RateCardOceanDashboard:    React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <RateCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_OCEAN,    brandKit)} bgPattern="dots" />;
export const RateCardSunsetDashboard:   React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <RateCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SUNSET,   brandKit)} bgPattern="hex" />;
export const RateCardForestDashboard:   React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <RateCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FOREST,   brandKit)} bgPattern="dots" />;
export const RateCardRoseDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <RateCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ROSE,     brandKit)} bgPattern="none" />;
export const RateCardGoldDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <RateCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_GOLD,     brandKit)} bgPattern="hex" />;
export const RateCardMidnightDashboard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <RateCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MIDNIGHT, brandKit)} bgPattern="grid" />;
export const RateCardCrimsonDashboard:  React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <RateCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CRIMSON,  brandKit)} bgPattern="dots" />;
export const RateCardLavenderDashboard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <RateCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_LAVENDER, brandKit)} bgPattern="hex" />;
export const RateCardArcticDashboard:   React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <RateCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ARCTIC,   brandKit)} bgPattern="dots" />;
export const RateCardEspressoDashboard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <RateCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ESPRESSO, brandKit)} bgPattern="none" />;
