import React from "react";
import { SprintRecap, SprintRecapSpec } from "./SprintRecap";

const BASE_SPEC: SprintRecapSpec = {
  sprint_name: "Sisy Sprint 14 Recap",
  sprint_number: 14,
  date_range: "Feb 10–21, 2026",
  shipped_items: [
    { title: "SSO Auth Flow", description: "SAML + OIDC provider integration", category: "feature", contributor: "Linda Mohamed" },
    { title: "Dashboard Widgets", description: "Composable drag-and-drop widget system", category: "feature", contributor: "Linda Mohamed" },
    { title: "API Rate Limiting", description: "Per-tenant throttling with Redis backend", category: "improvement", contributor: "Mrs Lee G" },
    { title: "Session Timeout Fix", description: "Resolved premature token expiry", category: "fix", contributor: "Linda Mohamed" },
    { title: "Search Performance", description: "3x faster full-text search indexing", category: "improvement", contributor: "Linda Mohamed" },
  ],
  total_shipped: 5,
  highlights: "SSO support and composable dashboard widgets",
  next_sprint_preview: "Mobile responsive dashboard and notification system",
};

export const SprintRecapShippedListDark: React.FC = () => <SprintRecap spec={{ ...BASE_SPEC, layout: "shipped-list", theme: "dark" }} />;
export const SprintRecapShippedListBold: React.FC = () => <SprintRecap spec={{ ...BASE_SPEC, layout: "shipped-list", theme: "bold" }} />;
export const SprintRecapHighlightCardsDark: React.FC = () => <SprintRecap spec={{ ...BASE_SPEC, layout: "highlight-cards", theme: "dark" }} />;
export const SprintRecapHighlightCardsBold: React.FC = () => <SprintRecap spec={{ ...BASE_SPEC, layout: "highlight-cards", theme: "bold" }} />;
export const SprintRecapTeamContributionsDark: React.FC = () => <SprintRecap spec={{ ...BASE_SPEC, layout: "team-contributions", theme: "dark" }} />;
export const SprintRecapTeamContributionsBold: React.FC = () => <SprintRecap spec={{ ...BASE_SPEC, layout: "team-contributions", theme: "bold" }} />;
