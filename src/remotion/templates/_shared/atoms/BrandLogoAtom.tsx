import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { BrandLogo } from "../components";

export interface BrandLogoAtomProps extends AtomProps {
  logoUrl?: string;
  position?: "header" | "footer";
}

export const BrandLogoAtom: React.FC<BrandLogoAtomProps> = ({
  theme,
  logoUrl,
  position,
}) => <BrandLogo logoUrl={logoUrl} position={position} theme={theme} />;

export const BrandLogoAtomMeta: AtomMeta = registerAtom({
  name: "BrandLogo",
  category: "media",
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
  requiredProps: [],
  defaultProps: { position: "header" },
});
