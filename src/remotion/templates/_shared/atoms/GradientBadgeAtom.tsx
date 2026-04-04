import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { GradientBadge } from "../components";

export interface GradientBadgeAtomProps extends AtomProps {
  text: string;
  fontSize?: number;
  style?: React.CSSProperties;
}

export const GradientBadgeAtom: React.FC<GradientBadgeAtomProps> = ({
  theme,
  text,
  fontSize,
  style,
}) => <GradientBadge text={text} theme={theme} fontSize={fontSize} style={style} />;

export const GradientBadgeAtomMeta: AtomMeta = registerAtom({
  name: "GradientBadge",
  category: "decoration",
  compatibleShells: [
    "HeroStatShell",
    "CardGridShell",
    "PipelineShell",
    "SplitPanelShell",
    "StatusBoardShell",
    "ListDetailShell",
  ],
  requiredProps: ["text"],
  defaultProps: { text: "Badge", fontSize: 13 },
});
