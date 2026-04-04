import React from "react";
import { EffortTracking, EffortTrackingSpec } from "./EffortTracking";

const BASE_SPEC: EffortTrackingSpec = {
  project_name: "Sisy",
  time_period: "Sprint 14 · Feb 10–21, 2026",
  story_points_planned: 42,
  story_points_completed: 37,
  hours_logged: 156,
  team_members: [
    { name: "Linda Mohamed", hours_logged: 52, story_points_completed: 14, allocation_percent: 85 },
    { name: "Linda Mohamed", hours_logged: 48, story_points_completed: 12, allocation_percent: 78 },
    { name: "Mrs Lee G", hours_logged: 56, story_points_completed: 11, allocation_percent: 92 },
  ],
  capacity_utilization: 88,
};

export const EffortTrackingTeamAllocationDark: React.FC = () => <EffortTracking spec={{ ...BASE_SPEC, layout: "team-allocation", theme: "dark" }} />;
export const EffortTrackingTeamAllocationWarm: React.FC = () => <EffortTracking spec={{ ...BASE_SPEC, layout: "team-allocation", theme: "warm" }} />;
export const EffortTrackingCapacityDark: React.FC = () => <EffortTracking spec={{ ...BASE_SPEC, layout: "capacity", theme: "dark" }} />;
export const EffortTrackingCapacityWarm: React.FC = () => <EffortTracking spec={{ ...BASE_SPEC, layout: "capacity", theme: "warm" }} />;
export const EffortTrackingBreakdownDark: React.FC = () => <EffortTracking spec={{ ...BASE_SPEC, layout: "breakdown", theme: "dark" }} />;
export const EffortTrackingBreakdownWarm: React.FC = () => <EffortTracking spec={{ ...BASE_SPEC, layout: "breakdown", theme: "warm" }} />;
