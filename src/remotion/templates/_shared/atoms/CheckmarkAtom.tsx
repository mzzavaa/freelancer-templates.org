import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { springEntrance, SPRING } from "../animations";
import { interpolate } from "remotion";

export interface CheckmarkAtomProps extends AtomProps {
  checked?: boolean;
  size?: number;
}

export const CheckmarkAtom: React.FC<CheckmarkAtomProps> = ({
  theme,
  frame,
  fps,
  delay = 0,
  checked = true,
  size = 20,
}) => {
  const s = springEntrance(frame, fps, delay, SPRING.snappy);
  const scale = interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 4,
        background: checked ? theme.accent : "transparent",
        border: `2px solid ${checked ? theme.accent : theme.textMuted}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scale})`,
        flexShrink: 0,
      }}
    >
      {checked && (
        <span style={{ color: "#fff", fontSize: size * 0.6, lineHeight: 1 }}>✓</span>
      )}
    </div>
  );
};

export const CheckmarkAtomMeta: AtomMeta = registerAtom({
  name: "Checkmark",
  category: "data-display",
  compatibleShells: [
    "CardGridShell",
    "TimelineShell",
    "PipelineShell",
    "StatusBoardShell",
    "ListDetailShell",
    "ComparisonShell",
  ],
  requiredProps: [],
  defaultProps: { checked: true, size: 20 },
});
