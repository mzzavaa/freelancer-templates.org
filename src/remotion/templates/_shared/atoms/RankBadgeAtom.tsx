import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";

export interface RankBadgeAtomProps extends AtomProps {
  rank: number;
  size?: number;
}

export const RankBadgeAtom: React.FC<RankBadgeAtomProps> = ({
  theme,
  rank,
  size = 28,
}) => {
  const colors: Record<number, string> = { 1: "#fbbf24", 2: "#94a3b8", 3: "#cd7f32" };
  const bg = colors[rank] || theme.textMuted;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.5,
        fontWeight: 800,
        fontFamily: theme.fontFamily,
        color: "#ffffff",
        flexShrink: 0,
      }}
    >
      {rank}
    </div>
  );
};

export const RankBadgeAtomMeta: AtomMeta = registerAtom({
  name: "RankBadge",
  category: "decoration",
  compatibleShells: [
    "HeroStatShell",
    "CardGridShell",
    "ListDetailShell",
    "ContributorShell",
    "StatusBoardShell",
  ],
  requiredProps: ["rank"],
  defaultProps: { rank: 1, size: 28 },
});
