import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { springEntrance, SPRING } from "../animations";
import { interpolate } from "remotion";

export interface HighlightBoxAtomProps extends AtomProps {
  children: React.ReactNode;
  variant?: "accent" | "subtle" | "gradient";
}

export const HighlightBoxAtom: React.FC<HighlightBoxAtomProps> = ({
  theme,
  frame,
  fps,
  delay = 0,
  children,
  variant = "accent",
}) => {
  const s = springEntrance(frame, fps, delay, SPRING.default);
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const bgMap = {
    accent: `${theme.accent}15`,
    subtle: theme.bgGlass,
    gradient: theme.accentGradient,
  };
  return (
    <div
      style={{
        background: bgMap[variant],
        border: variant === "gradient" ? "none" : `1px solid ${theme.cardBorder}`,
        borderRadius: 12,
        padding: "16px 20px",
        opacity,
        color: variant === "gradient" ? "#ffffff" : theme.textPrimary,
        fontFamily: theme.fontFamily,
      }}
    >
      {children}
    </div>
  );
};

export const HighlightBoxAtomMeta: AtomMeta = registerAtom({
  name: "HighlightBox",
  category: "decoration",
  compatibleShells: [
    "HeroStatShell",
    "CardGridShell",
    "SplitPanelShell",
    "CategoryGroupShell",
    "ListDetailShell",
    "ComparisonShell",
  ],
  requiredProps: ["children"],
  defaultProps: { variant: "accent" },
});
