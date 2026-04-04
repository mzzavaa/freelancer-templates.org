import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { interpolate } from "remotion";

export interface SparklineAtomProps extends AtomProps {
  data: number[];
  width?: number;
  height?: number;
}

export const SparklineAtom: React.FC<SparklineAtomProps> = ({
  theme,
  frame,
  delay = 0,
  data,
  width = 120,
  height = 32,
}) => {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const progress = interpolate(frame, [delay, delay + 40], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const visibleCount = Math.ceil(data.length * progress);
  const step = width / (data.length - 1);
  const points = data
    .slice(0, visibleCount)
    .map((v, i) => `${i * step},${height - ((v - min) / range) * height}`)
    .join(" ");

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <polyline
        points={points}
        fill="none"
        stroke={theme.accent}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SparklineAtomMeta: AtomMeta = registerAtom({
  name: "Sparkline",
  category: "data-display",
  compatibleShells: [
    "HeroStatShell",
    "CardGridShell",
    "StatusBoardShell",
    "ListDetailShell",
    "ComparisonShell",
  ],
  requiredProps: ["data"],
  defaultProps: { data: [10, 30, 20, 50, 40], width: 120, height: 32 },
});
