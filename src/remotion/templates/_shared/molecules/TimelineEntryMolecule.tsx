import React from "react";
import type { Theme } from "../themes";
import type { MoleculeMeta } from "./registry-core";
import { registerMolecule } from "./registry-core";
import { TimelineDotAtom } from "../atoms/TimelineDotAtom";
import { HeadingAtom } from "../atoms/HeadingAtom";
import { LabelAtom } from "../atoms/LabelAtom";
import { springEntrance, slideIn, SPRING } from "../animations";
import { interpolate } from "remotion";

export interface TimelineEntryMoleculeProps {
  theme: Theme;
  frame: number;
  fps: number;
  delay?: number;
  title: string;
  description: string;
  date?: string;
}

export const TimelineEntryMolecule: React.FC<TimelineEntryMoleculeProps> = ({
  theme,
  frame,
  fps,
  delay = 0,
  title,
  description,
  date,
}) => {
  const s = springEntrance(frame, fps, delay, SPRING.default);
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        opacity,
        transform: `translateX(${slideIn(s, "left", 25)}px)`,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <TimelineDotAtom theme={theme} frame={frame} fps={fps} delay={delay} />
        <div style={{ width: 2, flex: 1, background: theme.cardBorder, marginTop: 4 }} />
      </div>
      <div style={{ flex: 1, paddingBottom: 20 }}>
        {date && <LabelAtom theme={theme} frame={frame} fps={fps} text={date} fontSize={11} color="muted" />}
        <HeadingAtom theme={theme} frame={frame} fps={fps} delay={delay} text={title} fontSize={16} />
        <div style={{ marginTop: 4 }}>
          <LabelAtom theme={theme} frame={frame} fps={fps} text={description} fontSize={13} color="secondary" />
        </div>
      </div>
    </div>
  );
};

export const TimelineEntryMoleculeMeta: MoleculeMeta = registerMolecule({
  name: "TimelineEntry",
  atoms: ["TimelineDot", "Heading", "Label"],
  category: "navigation",
  compatibleShells: ["TimelineShell", "PipelineShell", "ListDetailShell"],
});
