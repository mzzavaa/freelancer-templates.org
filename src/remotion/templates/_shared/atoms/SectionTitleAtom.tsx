import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { springEntrance, slideIn, SPRING } from "../animations";
import { interpolate } from "remotion";

export interface SectionTitleAtomProps extends AtomProps {
  text: string;
  fontSize?: number;
}

export const SectionTitleAtom: React.FC<SectionTitleAtomProps> = ({
  theme,
  frame,
  fps,
  delay = 0,
  text,
  fontSize = 20,
}) => {
  const s = springEntrance(frame, fps, delay, SPRING.default);
  return (
    <div
      style={{
        fontSize,
        fontWeight: 600,
        fontFamily: theme.fontFamily,
        color: theme.textSecondary,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        opacity: interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateX(${slideIn(s, "left", 20)}px)`,
      }}
    >
      {text}
    </div>
  );
};

export const SectionTitleAtomMeta: AtomMeta = registerAtom({
  name: "SectionTitle",
  category: "typography",
  compatibleShells: [
    "HeroStatShell",
    "CardGridShell",
    "TimelineShell",
    "PipelineShell",
    "SplitPanelShell",
    "CategoryGroupShell",
    "StatusBoardShell",
    "ListDetailShell",
    "ComparisonShell",
    "ContributorShell",
  ],
  requiredProps: ["text"],
  defaultProps: { text: "Section", fontSize: 20 },
});
