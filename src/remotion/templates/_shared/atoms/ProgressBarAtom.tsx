import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { ProgressBar } from "../components";

export interface ProgressBarAtomProps extends AtomProps {
  progress: number;
  height?: number;
  duration?: number;
  label?: string;
  showPercent?: boolean;
}

export const ProgressBarAtom: React.FC<ProgressBarAtomProps> = ({
  theme,
  frame,
  delay = 0,
  progress,
  height,
  duration,
  label,
  showPercent,
}) => (
  <ProgressBar
    progress={progress}
    frame={frame}
    startFrame={delay}
    theme={theme}
    height={height}
    duration={duration}
    label={label}
    showPercent={showPercent}
  />
);

export const ProgressBarAtomMeta: AtomMeta = registerAtom({
  name: "ProgressBar",
  category: "data-display",
  compatibleShells: [
    "HeroStatShell",
    "CardGridShell",
    "StatusBoardShell",
    "PipelineShell",
    "ListDetailShell",
    "ComparisonShell",
  ],
  requiredProps: ["progress"],
  defaultProps: { progress: 50, height: 8, duration: 40 },
});
