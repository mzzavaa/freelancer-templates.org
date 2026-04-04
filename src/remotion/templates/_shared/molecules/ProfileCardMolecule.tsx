import React from "react";
import type { Theme } from "../themes";
import type { MoleculeMeta } from "./registry-core";
import { registerMolecule } from "./registry-core";
import { AvatarAtom } from "../atoms/AvatarAtom";
import { HeadingAtom } from "../atoms/HeadingAtom";
import { LabelAtom } from "../atoms/LabelAtom";
import { PillTagAtom } from "../atoms/PillTagAtom";
import { springEntrance, slideIn, SPRING } from "../animations";
import { interpolate } from "remotion";

export interface ProfileCardMoleculeProps {
  theme: Theme;
  frame: number;
  fps: number;
  delay?: number;
  name: string;
  role: string;
  tags?: string[];
}

export const ProfileCardMolecule: React.FC<ProfileCardMoleculeProps> = ({
  theme,
  frame,
  fps,
  delay = 0,
  name,
  role,
  tags = [],
}) => {
  const s = springEntrance(frame, fps, delay, SPRING.default);
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        background: theme.bgGlass,
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: 12,
        padding: 20,
        display: "flex",
        alignItems: "center",
        gap: 16,
        opacity,
        transform: `translateX(${slideIn(s, "left", 25)}px)`,
      }}
    >
      <AvatarAtom theme={theme} frame={frame} fps={fps} delay={delay} name={name} size={48} />
      <div style={{ flex: 1 }}>
        <HeadingAtom theme={theme} frame={frame} fps={fps} delay={delay} text={name} fontSize={16} />
        <div style={{ marginTop: 2 }}>
          <LabelAtom theme={theme} frame={frame} fps={fps} text={role} fontSize={12} color="muted" />
        </div>
        {tags.length > 0 && (
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            {tags.map((tag, i) => (
              <PillTagAtom key={i} theme={theme} frame={frame} fps={fps} delay={delay + i * 5} text={tag} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const ProfileCardMoleculeMeta: MoleculeMeta = registerMolecule({
  name: "ProfileCard",
  atoms: ["Avatar", "Heading", "Label", "PillTag"],
  category: "social",
  compatibleShells: ["ContributorShell", "CardGridShell", "ListDetailShell", "SplitPanelShell"],
});
