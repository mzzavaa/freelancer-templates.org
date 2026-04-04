import React from "react";
import type { Theme } from "../themes";
import type { MoleculeMeta } from "./registry-core";
import { registerMolecule } from "./registry-core";
import { NumberStatAtom } from "../atoms/NumberStatAtom";
import { LabelAtom } from "../atoms/LabelAtom";
import { PercentChangeAtom } from "../atoms/PercentChangeAtom";
import { springEntrance, slideIn, SPRING } from "../animations";
import { interpolate } from "remotion";

export interface MetricRowMoleculeProps {
  theme: Theme;
  frame: number;
  fps: number;
  delay?: number;
  label: string;
  value: number;
  suffix?: string;
  change?: number;
}

export const MetricRowMolecule: React.FC<MetricRowMoleculeProps> = ({
  theme,
  frame,
  fps,
  delay = 0,
  label,
  value,
  suffix,
  change,
}) => {
  const s = springEntrance(frame, fps, delay, SPRING.default);
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: `1px solid ${theme.cardBorder}`,
        opacity,
        transform: `translateX(${slideIn(s, "right", 20)}px)`,
      }}
    >
      <LabelAtom theme={theme} frame={frame} fps={fps} text={label} fontSize={14} color="secondary" />
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <NumberStatAtom theme={theme} frame={frame} fps={fps} delay={delay} value={value} suffix={suffix} fontSize={20} />
        {change !== undefined && (
          <PercentChangeAtom theme={theme} frame={frame} fps={fps} delay={delay} value={change} />
        )}
      </div>
    </div>
  );
};

export const MetricRowMoleculeMeta: MoleculeMeta = registerMolecule({
  name: "MetricRow",
  atoms: ["NumberStat", "Label", "PercentChange"],
  category: "stats",
  compatibleShells: ["HeroStatShell", "StatusBoardShell", "ListDetailShell", "ComparisonShell", "SplitPanelShell"],
});
