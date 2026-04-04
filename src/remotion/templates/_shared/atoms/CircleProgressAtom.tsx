import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { interpolate } from "remotion";

export interface CircleProgressAtomProps extends AtomProps {
  progress: number;
  size?: number;
  color?: string;
}

export const CircleProgressAtom: React.FC<CircleProgressAtomProps> = ({
  theme,
  frame,
  delay = 0,
  progress,
  size = 24,
  color,
}) => {
  const fill = interpolate(frame, [delay, delay + 30], [0, progress / 100], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const r = (size - 4) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={theme.bgSecondary} strokeWidth={3} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color || theme.accent}
        strokeWidth={3}
        strokeDasharray={c}
        strokeDashoffset={c * (1 - fill)}
        strokeLinecap="round"
      />
    </svg>
  );
};

export const CircleProgressAtomMeta: AtomMeta = registerAtom({
  name: "CircleProgress",
  category: "data-display",
  compatibleShells: [
    "HeroStatShell",
    "CardGridShell",
    "StatusBoardShell",
    "ListDetailShell",
    "PipelineShell",
  ],
  requiredProps: ["progress"],
  defaultProps: { progress: 50, size: 24 },
});
