import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { interpolate } from "remotion";

export interface BarChartAtomProps extends AtomProps {
  bars: Array<{ label: string; value: number }>;
  maxValue?: number;
  barHeight?: number;
}

export const BarChartAtom: React.FC<BarChartAtomProps> = ({
  theme,
  frame,
  delay = 0,
  bars,
  maxValue,
  barHeight = 24,
}) => {
  const max = maxValue || Math.max(...bars.map((b) => b.value), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
      {bars.map((bar, i) => {
        const barDelay = delay + i * 8;
        const fill = interpolate(frame, [barDelay, barDelay + 30], [0, (bar.value / max) * 100], {
          extrapolateRight: "clamp",
          extrapolateLeft: "clamp",
        });
        return (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontFamily: theme.fontFamily, color: theme.textSecondary }}>
                {bar.label}
              </span>
              <span style={{ fontSize: 11, fontFamily: theme.fontFamily, color: theme.textMuted }}>
                {bar.value}
              </span>
            </div>
            <div style={{ width: "100%", height: barHeight, borderRadius: barHeight / 2, background: theme.bgSecondary, overflow: "hidden" }}>
              <div style={{ width: `${fill}%`, height: "100%", borderRadius: barHeight / 2, background: theme.accentGradient }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const BarChartAtomMeta: AtomMeta = registerAtom({
  name: "BarChart",
  category: "data-display",
  compatibleShells: [
    "HeroStatShell",
    "CardGridShell",
    "SplitPanelShell",
    "ComparisonShell",
    "ListDetailShell",
    "StatusBoardShell",
  ],
  requiredProps: ["bars"],
  defaultProps: { bars: [], barHeight: 24 },
});
