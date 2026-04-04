import React from "react";
import type { Theme } from "../themes";
import type { MoleculeMeta } from "./registry-core";
import { registerMolecule } from "./registry-core";
import { StarRatingAtom } from "../atoms/StarRatingAtom";
import { LabelAtom } from "../atoms/LabelAtom";
import { AvatarAtom } from "../atoms/AvatarAtom";
import { springEntrance, slideIn, SPRING } from "../animations";
import { interpolate } from "remotion";

export interface ReviewCardMoleculeProps {
  theme: Theme;
  frame: number;
  fps: number;
  delay?: number;
  reviewer: string;
  rating: number;
  text: string;
}

export const ReviewCardMolecule: React.FC<ReviewCardMoleculeProps> = ({
  theme,
  frame,
  fps,
  delay = 0,
  reviewer,
  rating,
  text,
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
        opacity,
        transform: `translateY(${slideIn(s, "up", 25)}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <AvatarAtom theme={theme} frame={frame} fps={fps} delay={delay} name={reviewer} size={28} />
        <LabelAtom theme={theme} frame={frame} fps={fps} text={reviewer} fontSize={13} color="primary" />
      </div>
      <StarRatingAtom theme={theme} frame={frame} fps={fps} delay={delay} rating={rating} size={14} />
      <p style={{ fontSize: 13, color: theme.textSecondary, fontFamily: theme.fontFamily, fontWeight: theme.bodyWeight, marginTop: 8 }}>
        {text}
      </p>
    </div>
  );
};

export const ReviewCardMoleculeMeta: MoleculeMeta = registerMolecule({
  name: "ReviewCard",
  atoms: ["StarRating", "Label", "Avatar"],
  category: "social",
  compatibleShells: ["CardGridShell", "ListDetailShell", "ContributorShell", "SplitPanelShell"],
});
