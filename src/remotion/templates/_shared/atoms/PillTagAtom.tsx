import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";

export interface PillTagAtomProps extends AtomProps {
  text: string;
  variant?: "filled" | "outline";
}

export const PillTagAtom: React.FC<PillTagAtomProps> = ({
  theme,
  text,
  variant = "filled",
}) => {
  const isFilled = variant === "filled";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: theme.fontFamily,
        background: isFilled ? `${theme.accent}22` : "transparent",
        color: theme.accent,
        border: isFilled ? "none" : `1px solid ${theme.accent}44`,
        letterSpacing: 0.3,
      }}
    >
      {text}
    </span>
  );
};

export const PillTagAtomMeta: AtomMeta = registerAtom({
  name: "PillTag",
  category: "decoration",
  compatibleShells: [
    "HeroStatShell",
    "CardGridShell",
    "CategoryGroupShell",
    "StatusBoardShell",
    "ListDetailShell",
    "ContributorShell",
  ],
  requiredProps: ["text"],
  defaultProps: { text: "Tag", variant: "filled" },
});
