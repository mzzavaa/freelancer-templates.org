import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";

export interface LabelAtomProps extends AtomProps {
  text: string;
  fontSize?: number;
  color?: "primary" | "secondary" | "muted" | "accent";
}

export const LabelAtom: React.FC<LabelAtomProps> = ({
  theme,
  text,
  fontSize = 13,
  color = "secondary",
}) => {
  const colorMap = {
    primary: theme.textPrimary,
    secondary: theme.textSecondary,
    muted: theme.textMuted,
    accent: theme.accent,
  };
  return (
    <span
      style={{
        fontSize,
        fontWeight: theme.bodyWeight,
        fontFamily: theme.fontFamily,
        color: colorMap[color],
      }}
    >
      {text}
    </span>
  );
};

export const LabelAtomMeta: AtomMeta = registerAtom({
  name: "Label",
  category: "typography",
  compatibleShells: [
    "HeroStatShell",
    "CardGridShell",
    "TimelineShell",
    "PipelineShell",
    "SplitPanelShell",
    "CategoryGroupShell",
    "StatusBoardShell",
    "ListDetailShell",
    "ComparisonShell",
    "ContributorShell",
  ],
  requiredProps: ["text"],
  defaultProps: { text: "Label", fontSize: 13, color: "secondary" },
});
