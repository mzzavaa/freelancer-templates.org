import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { interpolate } from "remotion";

export interface DonutChartAtomProps extends AtomProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export const DonutChartAtom: React.FC<DonutChartAtomProps> = ({
  theme,
  frame,
  delay = 0,
  percentage,
  size = 80,
  strokeWidth = 8,
  label,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = interpolate(frame, [delay, delay + 40], [0, percentage / 100], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const dashOffset = circumference * (1 - progress);

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={theme.bgSecondary} strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={theme.accent}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: size * 0.22, fontWeight: 700, fontFamily: theme.fontFamily, color: theme.textPrimary }}>
          {Math.round(progress * 100)}%
        </span>
        {label && (
          <span style={{ fontSize: size * 0.12, fontFamily: theme.fontFamily, color: theme.textMuted }}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export const DonutChartAtomMeta: AtomMeta = registerAtom({
  name: "DonutChart",
  category: "data-display",
  compatibleShells: [
    "HeroStatShell",
    "CardGridShell",
    "SplitPanelShell",
    "StatusBoardShell",
    "ListDetailShell",
    "ComparisonShell",
  ],
  requiredProps: ["percentage"],
  defaultProps: { percentage: 75, size: 80, strokeWidth: 8 },
});
