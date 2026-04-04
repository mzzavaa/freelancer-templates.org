import React from "react";
import type { Theme } from "../themes";
import type { MoleculeMeta } from "./registry-core";
import { registerMolecule } from "./registry-core";
import { HeadingAtom } from "../atoms/HeadingAtom";
import { LabelAtom } from "../atoms/LabelAtom";
import { ArrowIndicatorAtom } from "../atoms/ArrowIndicatorAtom";
import { springEntrance, slideIn, SPRING } from "../animations";
import { interpolate } from "remotion";

export interface FAQItemMoleculeProps {
  theme: Theme;
  frame: number;
  fps: number;
  delay?: number;
  question: string;
  answer: string;
}

export const FAQItemMolecule: React.FC<FAQItemMoleculeProps> = ({
  theme,
  frame,
  fps,
  delay = 0,
  question,
  answer,
}) => {
  const s = springEntrance(frame, fps, delay, SPRING.default);
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        background: theme.bgGlass,
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: 12,
        padding: 20,
        opacity,
        transform: `translateX(${slideIn(s, "right", 20)}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <ArrowIndicatorAtom theme={theme} frame={frame} fps={fps} delay={delay} direction="down" size={14} />
        <HeadingAtom theme={theme} frame={frame} fps={fps} delay={delay} text={question} fontSize={16} />
      </div>
      <LabelAtom theme={theme} frame={frame} fps={fps} text={answer} fontSize={13} color="secondary" />
    </div>
  );
};

export const FAQItemMoleculeMeta: MoleculeMeta = registerMolecule({
  name: "FAQItem",
  atoms: ["Heading", "Label", "ArrowIndicator"],
  category: "content",
  compatibleShells: ["CardGridShell", "ListDetailShell", "CategoryGroupShell"],
});
