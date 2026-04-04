import React from "react";
import { DeploymentStatus, DeploymentStatusSpec } from "./DeploymentStatus";

const BASE_SPEC: DeploymentStatusSpec = {
  project_name: "Freelance Automation",
  environments: [
    { env_name: "Production", version: "v3.2.1", status: "on-track", last_deploy: "Feb 25, 2026 14:30", deployer: "Linda Mohamed" },
    { env_name: "Staging", version: "v3.3.0-rc1", status: "in-progress", last_deploy: "Feb 26, 2026 09:15", deployer: "Linda Mohamed" },
    { env_name: "Development", version: "v3.3.0-dev", status: "in-progress", last_deploy: "Feb 27, 2026 08:00", deployer: "Mrs Lee G" },
  ],
  total_deployments: 142,
  uptime_percent: 99,
};

export const DeploymentStatusEnvironmentCardsDark: React.FC = () => <DeploymentStatus spec={{ ...BASE_SPEC, layout: "environment-cards", theme: "dark" }} />;
export const DeploymentStatusEnvironmentCardsNeon: React.FC = () => <DeploymentStatus spec={{ ...BASE_SPEC, layout: "environment-cards", theme: "neon" }} />;
export const DeploymentStatusPipelineViewDark: React.FC = () => <DeploymentStatus spec={{ ...BASE_SPEC, layout: "pipeline-view", theme: "dark" }} />;
export const DeploymentStatusPipelineViewNeon: React.FC = () => <DeploymentStatus spec={{ ...BASE_SPEC, layout: "pipeline-view", theme: "neon" }} />;
export const DeploymentStatusHealthDashboardDark: React.FC = () => <DeploymentStatus spec={{ ...BASE_SPEC, layout: "health-dashboard", theme: "dark" }} />;
export const DeploymentStatusHealthDashboardNeon: React.FC = () => <DeploymentStatus spec={{ ...BASE_SPEC, layout: "health-dashboard", theme: "neon" }} />;
