import React from "react";
import type { Theme } from "../themes";
import type { MoleculeMeta } from "./registry-core";
import { registerMolecule } from "./registry-core";
import { CountUpAtom } from "../atoms/CountUpAtom";
import { LabelAtom } from "../atoms/LabelAtom";
import { springEntrance, slideIn, SPRING } from "../animations";
import { interpolate } from "remotion";

export interface StatRowMoleculeProps {
  theme: Theme;
  frame: number;
  fps: number;
  delay?: number;
  stats: Array<{ label: string; value: number; suffix?: string }>;
}

export const StatRowMolecule: React.FC<StatRowMoleculeProps> = ({
  theme,
  frame,
  fps,
  delay = 0,
  stats,
}) => {
  const s = springEntrance(frame, fps, delay, SPRING.default);
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display: "flex",
        gap: 32,
        opacity,
        transform: `translateY(${slideIn(s, "up", 20)}px)`,
      }}
    >
      {stats.map((stat, i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 42, fontWeight: theme.headingWeight, color: theme.textPrimary }}>
            <CountUpAtom theme={theme} frame={frame} fps={fps} delay={delay + i * 10} target={stat.value} suffix={stat.suffix} />
          </div>
          <LabelAtom theme={theme} frame={frame} fps={fps} text={stat.label} fontSize={13} color="secondary" />
        </div>
      ))}
    </div>
  );
};

export const StatRowMoleculeMeta: MoleculeMeta = registerMolecule({
  name: "StatRow",
  atoms: ["CountUp", "Label"],
  category: "stats",
  compatibleShells: ["HeroStatShell", "CardGridShell", "StatusBoardShell", "ComparisonShell", "SplitPanelShell"],
});
