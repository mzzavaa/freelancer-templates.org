import React from "react";
import { FeatureFlags, FeatureFlagsSpec } from "./FeatureFlags";

const BASE_SPEC: FeatureFlagsSpec = {
  project_name: "Sisy",
  flags: [
    { flag_name: "new-onboarding-flow", status: "in-progress", rollout_percent: 45, description: "Redesigned onboarding with guided tour", variant_count: 3 },
    { flag_name: "dark-mode-v2", status: "completed", rollout_percent: 100, description: "Updated dark theme with OLED support", variant_count: 2, winner: "Variant B" },
    { flag_name: "ai-task-suggestions", status: "in-progress", rollout_percent: 20, description: "AI-powered task prioritization hints", variant_count: 2 },
    { flag_name: "redesigned-dashboard", status: "upcoming", rollout_percent: 0, description: "New dashboard layout with widget system", variant_count: 4 },
  ],
  active_experiments: 2,
  total_flags: 4,
};

export const FeatureFlagsExperimentBoardDark: React.FC = () => <FeatureFlags spec={{ ...BASE_SPEC, layout: "experiment-board", theme: "dark" }} />;
export const FeatureFlagsExperimentBoardNeon: React.FC = () => <FeatureFlags spec={{ ...BASE_SPEC, layout: "experiment-board", theme: "neon" }} />;
export const FeatureFlagsResultsViewDark: React.FC = () => <FeatureFlags spec={{ ...BASE_SPEC, layout: "results-view", theme: "dark" }} />;
export const FeatureFlagsResultsViewNeon: React.FC = () => <FeatureFlags spec={{ ...BASE_SPEC, layout: "results-view", theme: "neon" }} />;
export const FeatureFlagsRolloutTrackerDark: React.FC = () => <FeatureFlags spec={{ ...BASE_SPEC, layout: "rollout-tracker", theme: "dark" }} />;
export const FeatureFlagsRolloutTrackerNeon: React.FC = () => <FeatureFlags spec={{ ...BASE_SPEC, layout: "rollout-tracker", theme: "neon" }} />;
