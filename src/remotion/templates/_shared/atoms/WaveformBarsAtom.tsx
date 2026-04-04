import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { WaveformBars } from "../components";

export interface WaveformBarsAtomProps extends AtomProps {
  barCount?: number;
  height?: number;
}

export const WaveformBarsAtom: React.FC<WaveformBarsAtomProps> = ({
  theme,
  frame,
  fps,
  delay = 0,
  barCount = 16,
  height,
}) => (
  <WaveformBars
    barCount={barCount}
    frame={frame}
    startFrame={delay}
    fps={fps}
    theme={theme}
    height={height}
  />
);

export const WaveformBarsAtomMeta: AtomMeta = registerAtom({
  name: "WaveformBars",
  category: "media",
  compatibleShells: [
    "HeroStatShell",
    "CardGridShell",
    "SplitPanelShell",
    "ListDetailShell",
  ],
  requiredProps: [],
  defaultProps: { barCount: 16, height: 80 },
});
