import React from "react";
import type { Theme } from "../themes";
import type { MoleculeMeta } from "./registry-core";
import { registerMolecule } from "./registry-core";
import { StepIndicatorAtom } from "../atoms/StepIndicatorAtom";
import { HeadingAtom } from "../atoms/HeadingAtom";
import { LabelAtom } from "../atoms/LabelAtom";
import { springEntrance, slideIn, SPRING } from "../animations";
import { interpolate } from "remotion";

export interface StepCardMoleculeProps {
  theme: Theme;
  frame: number;
  fps: number;
  delay?: number;
  stepNumber: number;
  title: string;
  description: string;
}

export const StepCardMolecule: React.FC<StepCardMoleculeProps> = ({
  theme,
  frame,
  fps,
  delay = 0,
  stepNumber,
  title,
  description,
}) => {
  const s = springEntrance(frame, fps, delay, SPRING.default);
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
        opacity,
        transform: `translateX(${slideIn(s, "left", 25)}px)`,
      }}
    >
      <StepIndicatorAtom theme={theme} frame={frame} fps={fps} delay={delay} step={stepNumber} />
      <div style={{ flex: 1 }}>
        <HeadingAtom theme={theme} frame={frame} fps={fps} delay={delay} text={title} fontSize={16} />
        <div style={{ marginTop: 4 }}>
          <LabelAtom theme={theme} frame={frame} fps={fps} text={description} fontSize={13} color="secondary" />
        </div>
      </div>
    </div>
  );
};

export const StepCardMoleculeMeta: MoleculeMeta = registerMolecule({
  name: "StepCard",
  atoms: ["StepIndicator", "Heading", "Label"],
  category: "navigation",
  compatibleShells: ["PipelineShell", "TimelineShell", "ListDetailShell", "CardGridShell"],
});
