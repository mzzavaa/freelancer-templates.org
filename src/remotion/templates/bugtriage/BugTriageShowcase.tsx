import React from "react";
import { BugTriage, BugTriageSpec } from "./BugTriage";

const BASE_SPEC: BugTriageSpec = {
  session_title: "Sisy Sprint 14 Triage",
  session_date: "Feb 21, 2026",
  total_triaged: 12,
  bugs: [
    { title: "Login timeout on SSO redirect", priority: "P0", assignee: "Linda Mohamed", effort_estimate: "3 SP", resolution_target: "Sprint 15" },
    { title: "Dashboard widget crash on resize", priority: "P1", assignee: "Linda Mohamed", effort_estimate: "2 SP", resolution_target: "Sprint 15" },
    { title: "API 500 on bulk export", priority: "P1", assignee: "Mrs Lee G", effort_estimate: "5 SP", resolution_target: "Sprint 15" },
    { title: "Search results pagination off-by-one", priority: "P2", assignee: "Linda Mohamed", effort_estimate: "1 SP", resolution_target: "Sprint 16" },
    { title: "Dark mode contrast on settings page", priority: "P3", assignee: "Linda Mohamed", effort_estimate: "1 SP", resolution_target: "Sprint 16" },
  ],
  priority_counts: { p0: 1, p1: 2, p2: 5, p3: 4 },
  session_summary: "12 bugs triaged, 3 critical items assigned for Sprint 15",
};

export const BugTriagePriorityColumnsDark: React.FC = () => <BugTriage spec={{ ...BASE_SPEC, layout: "priority-columns", theme: "dark" }} />;
export const BugTriagePriorityColumnsBold: React.FC = () => <BugTriage spec={{ ...BASE_SPEC, layout: "priority-columns", theme: "bold" }} />;
export const BugTriageTriageListDark: React.FC = () => <BugTriage spec={{ ...BASE_SPEC, layout: "triage-list", theme: "dark" }} />;
export const BugTriageTriageListBold: React.FC = () => <BugTriage spec={{ ...BASE_SPEC, layout: "triage-list", theme: "bold" }} />;
export const BugTriageSummaryDashboardDark: React.FC = () => <BugTriage spec={{ ...BASE_SPEC, layout: "summary-dashboard", theme: "dark" }} />;
export const BugTriageSummaryDashboardBold: React.FC = () => <BugTriage spec={{ ...BASE_SPEC, layout: "summary-dashboard", theme: "bold" }} />;
