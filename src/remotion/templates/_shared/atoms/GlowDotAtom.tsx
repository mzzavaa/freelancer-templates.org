import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";

export interface GlowDotAtomProps extends AtomProps {
  size?: number;
  color?: string;
  pulse?: boolean;
}

export const GlowDotAtom: React.FC<GlowDotAtomProps> = ({
  theme,
  size = 8,
  color,
  pulse = false,
}) => {
  const c = color || theme.accent;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: c,
        boxShadow: `0 0 ${size}px ${c}`,
        flexShrink: 0,
        opacity: pulse ? 0.8 : 1,
      }}
    />
  );
};

export const GlowDotAtomMeta: AtomMeta = registerAtom({
  name: "GlowDot",
  category: "decoration",
  compatibleShells: [
    "HeroStatShell",
    "CardGridShell",
    "TimelineShell",
    "PipelineShell",
    "StatusBoardShell",
    "ListDetailShell",
  ],
  requiredProps: [],
  defaultProps: { size: 8, pulse: false },
});
