import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { CountUp } from "../components";

export interface CountUpAtomProps extends AtomProps {
  target: number;
  suffix?: string;
  duration?: number;
}

export const CountUpAtom: React.FC<CountUpAtomProps> = ({
  frame,
  delay = 0,
  target,
  suffix,
  duration,
}) => (
  <CountUp
    target={target}
    frame={frame}
    startFrame={delay}
    suffix={suffix}
    duration={duration}
  />
);

export const CountUpAtomMeta: AtomMeta = registerAtom({
  name: "CountUp",
  category: "data-display",
  compatibleShells: [
    "HeroStatShell",
    "CardGridShell",
    "StatusBoardShell",
    "ComparisonShell",
    "SplitPanelShell",
    "ListDetailShell",
  ],
  requiredProps: ["target"],
  defaultProps: { target: 0, suffix: "", duration: 60 },
});
