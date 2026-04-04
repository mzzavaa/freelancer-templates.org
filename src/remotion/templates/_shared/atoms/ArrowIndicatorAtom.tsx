import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";

export interface ArrowIndicatorAtomProps extends AtomProps {
  direction?: "up" | "down" | "left" | "right";
  size?: number;
  color?: string;
}

export const ArrowIndicatorAtom: React.FC<ArrowIndicatorAtomProps> = ({
  theme,
  direction = "right",
  size = 16,
  color,
}) => {
  const rotations = { up: -90, down: 90, left: 180, right: 0 };
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: size,
        color: color || theme.accent,
        transform: `rotate(${rotations[direction]}deg)`,
        lineHeight: 1,
      }}
    >
      →
    </span>
  );
};

export const ArrowIndicatorAtomMeta: AtomMeta = registerAtom({
  name: "ArrowIndicator",
  category: "decoration",
  compatibleShells: [
    "HeroStatShell",
    "CardGridShell",
    "TimelineShell",
    "PipelineShell",
    "SplitPanelShell",
    "ListDetailShell",
    "ComparisonShell",
  ],
  requiredProps: [],
  defaultProps: { direction: "right", size: 16 },
});
