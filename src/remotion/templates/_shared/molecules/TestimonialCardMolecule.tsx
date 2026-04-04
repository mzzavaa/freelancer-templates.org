import React from "react";
import type { Theme } from "../themes";
import type { MoleculeMeta } from "./registry-core";
import { registerMolecule } from "./registry-core";
import { QuoteMarksAtom } from "../atoms/QuoteMarksAtom";
import { LabelAtom } from "../atoms/LabelAtom";
import { AvatarAtom } from "../atoms/AvatarAtom";
import { springEntrance, slideIn, SPRING } from "../animations";
import { interpolate } from "remotion";

export interface TestimonialCardMoleculeProps {
  theme: Theme;
  frame: number;
  fps: number;
  delay?: number;
  quote: string;
  author: string;
  role?: string;
}

export const TestimonialCardMolecule: React.FC<TestimonialCardMoleculeProps> = ({
  theme,
  frame,
  fps,
  delay = 0,
  quote,
  author,
  role,
}) => {
  const s = springEntrance(frame, fps, delay, SPRING.default);
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        background: theme.bgGlass,
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: 12,
        padding: 24,
        opacity,
        transform: `translateX(${slideIn(s, "left", 30)}px)`,
      }}
    >
      <QuoteMarksAtom theme={theme} frame={frame} fps={fps} delay={delay} />
      <p style={{ fontSize: 15, color: theme.textPrimary, fontFamily: theme.fontFamily, fontWeight: theme.bodyWeight, margin: "12px 0 16px" }}>
        {quote}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <AvatarAtom theme={theme} frame={frame} fps={fps} delay={delay} name={author} size={32} />
        <div>
          <LabelAtom theme={theme} frame={frame} fps={fps} text={author} fontSize={13} color="primary" />
          {role && (
            <div><LabelAtom theme={theme} frame={frame} fps={fps} text={role} fontSize={11} color="muted" /></div>
          )}
        </div>
      </div>
    </div>
  );
};

export const TestimonialCardMoleculeMeta: MoleculeMeta = registerMolecule({
  name: "TestimonialCard",
  atoms: ["QuoteMarks", "Label", "Avatar"],
  category: "content",
  compatibleShells: ["CardGridShell", "SplitPanelShell", "ListDetailShell", "ContributorShell"],
});
