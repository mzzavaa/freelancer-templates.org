import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";

export interface PercentChangeAtomProps extends AtomProps {
  value: number;
  fontSize?: number;
}

export const PercentChangeAtom: React.FC<PercentChangeAtomProps> = ({
  theme,
  value,
  fontSize = 13,
}) => {
  const isPositive = value >= 0;
  const color = isPositive ? "#22c55e" : "#ef4444";
  const arrow = isPositive ? "↑" : "↓";
  return (
    <span
      style={{
        fontSize,
        fontWeight: 600,
        fontFamily: theme.fontFamily,
        color,
      }}
    >
      {arrow} {Math.abs(value)}%
    </span>
  );
};

export const PercentChangeAtomMeta: AtomMeta = registerAtom({
  name: "PercentChange",
  category: "data-display",
  compatibleShells: [
    "HeroStatShell",
    "CardGridShell",
    "StatusBoardShell",
    "ComparisonShell",
    "ListDetailShell",
    "SplitPanelShell",
  ],
  requiredProps: ["value"],
  defaultProps: { value: 0, fontSize: 13 },
});
