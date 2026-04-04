import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { springEntrance, SPRING } from "../animations";
import { interpolate } from "remotion";

export interface NumberStatAtomProps extends AtomProps {
  value: string;
  label: string;
  fontSize?: number;
}

export const NumberStatAtom: React.FC<NumberStatAtomProps> = ({
  theme,
  frame,
  fps,
  delay = 0,
  value,
  label,
  fontSize = 42,
}) => {
  const s = springEntrance(frame, fps, delay, SPRING.default);
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ textAlign: "center", opacity }}>
      <div style={{ fontSize, fontWeight: theme.headingWeight, fontFamily: theme.fontFamily, color: theme.accent }}>
        {value}
      </div>
      <div style={{ fontSize: 12, fontFamily: theme.fontFamily, color: theme.textMuted, marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
};

export const NumberStatAtomMeta: AtomMeta = registerAtom({
  name: "NumberStat",
  category: "data-display",
  compatibleShells: [
    "HeroStatShell",
    "CardGridShell",
    "SplitPanelShell",
    "StatusBoardShell",
    "ComparisonShell",
    "ListDetailShell",
  ],
  requiredProps: ["value", "label"],
  defaultProps: { value: "0", label: "Stat", fontSize: 42 },
});
