import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { TimelineDot } from "../components";

export interface TimelineDotAtomProps extends AtomProps {
  completed: boolean;
  isLast?: boolean;
}

export const TimelineDotAtom: React.FC<TimelineDotAtomProps> = ({
  theme,
  completed,
  isLast,
}) => <TimelineDot completed={completed} theme={theme} isLast={isLast} />;

export const TimelineDotAtomMeta: AtomMeta = registerAtom({
  name: "TimelineDot",
  category: "decoration",
  compatibleShells: [
    "TimelineShell",
    "PipelineShell",
    "ListDetailShell",
  ],
  requiredProps: ["completed"],
  defaultProps: { completed: false, isLast: false },
});
