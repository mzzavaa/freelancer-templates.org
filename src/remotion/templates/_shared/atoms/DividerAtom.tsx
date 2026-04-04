import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { fadeIn } from "../animations";

export interface DividerAtomProps extends AtomProps {
  direction?: "horizontal" | "vertical";
  thickness?: number;
  length?: string;
}

export const DividerAtom: React.FC<DividerAtomProps> = ({
  theme,
  frame,
  delay = 0,
  direction = "horizontal",
  thickness = 1,
  length = "100%",
}) => {
  const opacity = fadeIn(frame, delay, 15);
  const isH = direction === "horizontal";
  return (
    <div
      style={{
        width: isH ? length : thickness,
        height: isH ? thickness : length,
        background: theme.cardBorder,
        opacity,
        flexShrink: 0,
      }}
    />
  );
};

export const DividerAtomMeta: AtomMeta = registerAtom({
  name: "Divider",
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
  defaultProps: { direction: "horizontal", thickness: 1 },
});
