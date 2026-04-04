import React from "react";
import type { AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { BackgroundGrid } from "../components";
import type { Theme } from "../themes";

export interface BackgroundGridAtomProps {
  theme: Theme;
  opacity?: number;
  pattern?: "grid" | "dots" | "hex";
}

export const BackgroundGridAtom: React.FC<BackgroundGridAtomProps> = ({
  opacity,
  pattern,
}) => <BackgroundGrid opacity={opacity} pattern={pattern} />;

export const BackgroundGridAtomMeta: AtomMeta = registerAtom({
  name: "BackgroundGrid",
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
  requiredProps: [],
  defaultProps: { opacity: 0.04, pattern: "grid" },
});
