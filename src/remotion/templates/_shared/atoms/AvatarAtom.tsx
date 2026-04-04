import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";

export interface AvatarAtomProps extends AtomProps {
  initials: string;
  size?: number;
  imageUrl?: string;
}

export const AvatarAtom: React.FC<AvatarAtomProps> = ({
  theme,
  initials,
  size = 40,
  imageUrl,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: imageUrl ? `url(${imageUrl}) center/cover` : theme.accentGradient,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.4,
      fontWeight: 700,
      fontFamily: theme.fontFamily,
      color: "#ffffff",
      flexShrink: 0,
      border: `2px solid ${theme.cardBorder}`,
    }}
  >
    {!imageUrl && initials}
  </div>
);

export const AvatarAtomMeta: AtomMeta = registerAtom({
  name: "Avatar",
  category: "media",
  compatibleShells: [
    "CardGridShell",
    "ListDetailShell",
    "ContributorShell",
    "StatusBoardShell",
  ],
  requiredProps: ["initials"],
  defaultProps: { initials: "AB", size: 40 },
});
