import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { springEntrance, SPRING } from "../animations";
import { interpolate } from "remotion";

export interface MetricCardAtomProps extends AtomProps {
  label: string;
  value: string;
  subtitle?: string;
}

export const MetricCardAtom: React.FC<MetricCardAtomProps> = ({
  theme,
  frame,
  fps,
  delay = 0,
  label,
  value,
  subtitle,
}) => {
  const s = springEntrance(frame, fps, delay, SPRING.default);
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        background: theme.bgGlass,
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: 12,
        padding: "16px 20px",
        opacity,
        transform: `scale(${interpolate(s, [0, 1], [0.95, 1])})`,
      }}
    >
      <div style={{ fontSize: 11, fontFamily: theme.fontFamily, color: theme.textMuted, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: theme.headingWeight, fontFamily: theme.fontFamily, color: theme.textPrimary }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: 12, fontFamily: theme.fontFamily, color: theme.textSecondary, marginTop: 4 }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};

export const MetricCardAtomMeta: AtomMeta = registerAtom({
  name: "MetricCard",
  category: "data-display",
  compatibleShells: [
    "HeroStatShell",
    "CardGridShell",
    "StatusBoardShell",
    "SplitPanelShell",
    "ComparisonShell",
    "ListDetailShell",
  ],
  requiredProps: ["label", "value"],
  defaultProps: { label: "Metric", value: "0" },
});
