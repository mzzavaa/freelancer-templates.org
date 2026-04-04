import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { fadeIn } from "../animations";

export interface SubtitleAtomProps extends AtomProps {
  text: string;
  fontSize?: number;
  maxWidth?: number;
}

export const SubtitleAtom: React.FC<SubtitleAtomProps> = ({
  theme,
  frame,
  delay = 0,
  text,
  fontSize = 20,
  maxWidth,
}) => {
  const opacity = fadeIn(frame, delay, 20);
  return (
    <div
      style={{
        fontSize,
        fontWeight: theme.bodyWeight,
        fontFamily: theme.fontFamily,
        color: theme.textSecondary,
        lineHeight: 1.5,
        opacity,
        maxWidth,
      }}
    >
      {text}
    </div>
  );
};

export const SubtitleAtomMeta: AtomMeta = registerAtom({
  name: "Subtitle",
  category: "typography",
  compatibleShells: [
    "HeroStatShell",
    "CardGridShell",
    "SplitPanelShell",
    "CategoryGroupShell",
    "ListDetailShell",
    "ComparisonShell",
    "ContributorShell",
  ],
  requiredProps: ["text"],
  defaultProps: { text: "Subtitle text", fontSize: 20 },
});
