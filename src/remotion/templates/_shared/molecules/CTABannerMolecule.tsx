import React from "react";
import type { Theme } from "../themes";
import type { MoleculeMeta } from "./registry-core";
import { registerMolecule } from "./registry-core";
import { HeadingAtom } from "../atoms/HeadingAtom";
import { GradientBadgeAtom } from "../atoms/GradientBadgeAtom";
import { LabelAtom } from "../atoms/LabelAtom";
import { springEntrance, slideIn, SPRING } from "../animations";
import { interpolate } from "remotion";

export interface CTABannerMoleculeProps {
  theme: Theme;
  frame: number;
  fps: number;
  delay?: number;
  headline: string;
  buttonText: string;
  subtitle?: string;
}

export const CTABannerMolecule: React.FC<CTABannerMoleculeProps> = ({
  theme,
  frame,
  fps,
  delay = 0,
  headline,
  buttonText,
  subtitle,
}) => {
  const s = springEntrance(frame, fps, delay, SPRING.snappy);
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        background: theme.bgGlass,
        border: `1px solid ${theme.accent}`,
        borderRadius: 16,
        padding: "24px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        opacity,
        transform: `translateY(${slideIn(s, "up", 20)}px)`,
      }}
    >
      <div>
        <HeadingAtom theme={theme} frame={frame} fps={fps} delay={delay} text={headline} fontSize={20} />
        {subtitle && (
          <div style={{ marginTop: 4 }}>
            <LabelAtom theme={theme} frame={frame} fps={fps} text={subtitle} fontSize={13} color="secondary" />
          </div>
        )}
      </div>
      <GradientBadgeAtom theme={theme} frame={frame} fps={fps} delay={delay + 10} text={buttonText} />
    </div>
  );
};

export const CTABannerMoleculeMeta: MoleculeMeta = registerMolecule({
  name: "CTABanner",
  atoms: ["Heading", "GradientBadge", "Label"],
  category: "content",
  compatibleShells: ["HeroStatShell", "SplitPanelShell", "CardGridShell"],
});
