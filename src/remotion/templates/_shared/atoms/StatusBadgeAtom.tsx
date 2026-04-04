import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { StatusBadge } from "../components";

export interface StatusBadgeAtomProps extends AtomProps {
  status: "completed" | "in-progress" | "upcoming" | "on-track" | "ahead" | "needs-attention";
  style?: React.CSSProperties;
}

export const StatusBadgeAtom: React.FC<StatusBadgeAtomProps> = ({
  theme,
  status,
  style,
}) => <StatusBadge status={status} theme={theme} style={style} />;

export const StatusBadgeAtomMeta: AtomMeta = registerAtom({
  name: "StatusBadge",
  category: "data-display",
  compatibleShells: [
    "HeroStatShell",
    "CardGridShell",
    "TimelineShell",
    "PipelineShell",
    "StatusBoardShell",
    "ListDetailShell",
  ],
  requiredProps: ["status"],
  defaultProps: { status: "completed" },
});
