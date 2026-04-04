import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { springEntrance, slideIn, SPRING } from "../animations";
import { interpolate } from "remotion";

export interface HeadingAtomProps extends AtomProps {
  text: string;
  fontSize?: number;
  align?: "left" | "center" | "right";
}

export const HeadingAtom: React.FC<HeadingAtomProps> = ({
  theme,
  frame,
  fps,
  delay = 0,
  text,
  fontSize = 52,
  align = "left",
}) => {
  const s = springEntrance(frame, fps, delay, SPRING.default);
  return (
    <div
      style={{
        fontSize,
        fontWeight: theme.headingWeight,
        fontFamily: theme.fontFamily,
        color: theme.textPrimary,
        textAlign: align,
        opacity: interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${slideIn(s, "up", 20)}px)`,
      }}
    >
      {text}
    </div>
  );
};

export const HeadingAtomMeta: AtomMeta = registerAtom({
  name: "Heading",
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
  defaultProps: { text: "Heading", fontSize: 52, align: "left" },
});
