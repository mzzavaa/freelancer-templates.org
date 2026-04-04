import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { ComparisonTable } from "../components";

export interface ComparisonTableAtomProps extends AtomProps {
  rows: Array<{ label: string; left: string; right: string }>;
  leftHeader: string;
  rightHeader: string;
}

export const ComparisonTableAtom: React.FC<ComparisonTableAtomProps> = ({
  theme,
  frame,
  fps,
  delay = 0,
  rows,
  leftHeader,
  rightHeader,
}) => (
  <ComparisonTable
    rows={rows}
    leftHeader={leftHeader}
    rightHeader={rightHeader}
    frame={frame}
    startFrame={delay}
    fps={fps}
    theme={theme}
  />
);

export const ComparisonTableAtomMeta: AtomMeta = registerAtom({
  name: "ComparisonTable",
  category: "interactive",
  compatibleShells: [
    "ComparisonShell",
    "SplitPanelShell",
    "CardGridShell",
    "ListDetailShell",
  ],
  requiredProps: ["rows", "leftHeader", "rightHeader"],
  defaultProps: { rows: [], leftHeader: "Before", rightHeader: "After" },
});
