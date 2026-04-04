import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { GlassCard } from "../components";

export interface GlassCardAtomProps extends AtomProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const GlassCardAtom: React.FC<GlassCardAtomProps> = ({
  theme,
  children,
  style,
}) => <GlassCard theme={theme} style={style}>{children}</GlassCard>;

export const GlassCardAtomMeta: AtomMeta = registerAtom({
  name: "GlassCard",
  category: "decoration",
  compatibleShells: [
    "HeroStatShell",
    "CardGridShell",
    "TimelineShell",
    "PipelineShell",
    "SplitPanelShell",
    "CategoryGroupShell",
    "StatusBoardShell",
    "ListDetailShell",
    "ComparisonShell",
    "ContributorShell",
  ],
  requiredProps: ["children"],
  defaultProps: {},
});
