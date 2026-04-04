import React from "react";
import type { Theme } from "../themes";
import type { MoleculeMeta } from "./registry-core";
import { registerMolecule } from "./registry-core";
import { HeadingAtom } from "../atoms/HeadingAtom";
import { LabelAtom } from "../atoms/LabelAtom";
import { CheckmarkAtom } from "../atoms/CheckmarkAtom";
import { GradientBadgeAtom } from "../atoms/GradientBadgeAtom";
import { springEntrance, slideIn, SPRING } from "../animations";
import { interpolate } from "remotion";

export interface PricingTierMoleculeProps {
  theme: Theme;
  frame: number;
  fps: number;
  delay?: number;
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

export const PricingTierMolecule: React.FC<PricingTierMoleculeProps> = ({
  theme,
  frame,
  fps,
  delay = 0,
  name,
  price,
  features,
  highlighted = false,
}) => {
  const s = springEntrance(frame, fps, delay, SPRING.default);
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        background: theme.bgGlass,
        border: `1px solid ${highlighted ? theme.accent : theme.cardBorder}`,
        borderRadius: 12,
        padding: 24,
        opacity,
        transform: `translateY(${slideIn(s, "up", 30)}px)`,
        minWidth: 200,
      }}
    >
      <HeadingAtom theme={theme} frame={frame} fps={fps} delay={delay} text={name} fontSize={20} />
      <div style={{ fontSize: 36, fontWeight: theme.headingWeight, color: theme.accent, fontFamily: theme.fontFamily, margin: "8px 0 16px" }}>
        {price}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {features.map((feat, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CheckmarkAtom theme={theme} frame={frame} fps={fps} delay={delay + i * 5} size={14} />
            <LabelAtom theme={theme} frame={frame} fps={fps} text={feat} fontSize={13} color="secondary" />
          </div>
        ))}
      </div>
      {highlighted && (
        <div style={{ marginTop: 16 }}>
          <GradientBadgeAtom theme={theme} frame={frame} fps={fps} delay={delay} text="Popular" />
        </div>
      )}
    </div>
  );
};

export const PricingTierMoleculeMeta: MoleculeMeta = registerMolecule({
  name: "PricingTier",
  atoms: ["Heading", "Label", "Checkmark", "GradientBadge"],
  category: "pricing",
  compatibleShells: ["CardGridShell", "ComparisonShell", "SplitPanelShell"],
});
