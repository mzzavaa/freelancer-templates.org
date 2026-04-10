import React from "react";
import { MeetingRecap } from "./MeetingRecap";
import type { MeetingRecapSpec } from "./MeetingRecap";
import {
  THEME_DARK, THEME_CLEAN, THEME_BOLD, THEME_WARM, THEME_MINIMAL, THEME_NEON,
  THEME_OCEAN, THEME_SUNSET, THEME_FOREST, THEME_ROSE, THEME_GOLD, THEME_MIDNIGHT,
  THEME_CRIMSON, THEME_LAVENDER, THEME_ARCTIC, THEME_ESPRESSO,
  BrandKit, applyBrandKit,
} from "../_shared/themes";

const SAMPLE_SPEC: MeetingRecapSpec = {
  meeting_title: "Q2 Planning Sync",
  date: "April 9, 2025",
  attendees: ["Linda M.", "Sarah K.", "Dev Team"],
  decisions: [
    "Approved the new homepage design — launch date confirmed for May 15",
    "Budget extended by $3,500 to cover CMS integration scope",
    "Weekly check-ins moved to Thursdays at 9 AM",
  ],
  action_items: [
    { owner: "Linda",    task: "Send revised wireframes with CMS pages", due: "Apr 12" },
    { owner: "Sarah",    task: "Schedule QA review session",             due: "Apr 15" },
    { owner: "Dev Team", task: "Set up staging environment",             due: "Apr 11" },
    { owner: "Linda",    task: "Update contract for scope change",       due: "Apr 10" },
  ],
  next_meeting: "April 16, 2025 · 9 AM · Product Review",
};

export const MeetingRecapDarkDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <MeetingRecap spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_DARK,     brandKit)} bgPattern="grid" />;
export const MeetingRecapBoldDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <MeetingRecap spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BOLD,     brandKit)} bgPattern="dots" />;
export const MeetingRecapCleanDashboard:    React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <MeetingRecap spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CLEAN,    brandKit)} bgPattern="dots" />;
export const MeetingRecapWarmDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <MeetingRecap spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_WARM,     brandKit)} bgPattern="hex" />;
export const MeetingRecapMinimalDashboard:  React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <MeetingRecap spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MINIMAL,  brandKit)} bgPattern="none" />;
export const MeetingRecapNeonDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <MeetingRecap spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_NEON,     brandKit)} bgPattern="grid" />;
export const MeetingRecapOceanDashboard:    React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <MeetingRecap spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_OCEAN,    brandKit)} bgPattern="dots" />;
export const MeetingRecapSunsetDashboard:   React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <MeetingRecap spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SUNSET,   brandKit)} bgPattern="hex" />;
export const MeetingRecapForestDashboard:   React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <MeetingRecap spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_FOREST,   brandKit)} bgPattern="dots" />;
export const MeetingRecapRoseDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <MeetingRecap spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ROSE,     brandKit)} bgPattern="none" />;
export const MeetingRecapGoldDashboard:     React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <MeetingRecap spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_GOLD,     brandKit)} bgPattern="hex" />;
export const MeetingRecapMidnightDashboard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <MeetingRecap spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MIDNIGHT, brandKit)} bgPattern="grid" />;
export const MeetingRecapCrimsonDashboard:  React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <MeetingRecap spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CRIMSON,  brandKit)} bgPattern="dots" />;
export const MeetingRecapLavenderDashboard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <MeetingRecap spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_LAVENDER, brandKit)} bgPattern="hex" />;
export const MeetingRecapArcticDashboard:   React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <MeetingRecap spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ARCTIC,   brandKit)} bgPattern="dots" />;
export const MeetingRecapEspressoDashboard: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => <MeetingRecap spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_ESPRESSO, brandKit)} bgPattern="none" />;
