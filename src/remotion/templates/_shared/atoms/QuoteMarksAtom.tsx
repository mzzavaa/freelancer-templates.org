import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { QuoteMarks } from "../components";

export const QuoteMarksAtom: React.FC<AtomProps> = ({
  theme,
  frame,
  fps,
  delay = 0,
}) => <QuoteMarks theme={theme} frame={frame} fps={fps} startFrame={delay} />;

export const QuoteMarksAtomMeta: AtomMeta = registerAtom({
  name: "QuoteMarks",
  category: "typography",
  compatibleShells: [
    "HeroStatShell",
    "CardGridShell",
    "SplitPanelShell",
    "ListDetailShell",
    "ContributorShell",
  ],
  requiredProps: [],
  defaultProps: {},
});
