import React from "react";
import type { Theme } from "../themes";
import type { MoleculeMeta } from "./registry-core";
import { registerMolecule } from "./registry-core";
import { IconBadgeAtom } from "../atoms/IconBadgeAtom";
import { LabelAtom } from "../atoms/LabelAtom";
import { ArrowIndicatorAtom } from "../atoms/ArrowIndicatorAtom";
import { springEntrance, slideIn, SPRING } from "../animations";
import { interpolate } from "remotion";

export interface NavItemMoleculeProps {
  theme: Theme;
  frame: number;
  fps: number;
  delay?: number;
  icon?: string;
  label: string;
  active?: boolean;
}

export const NavItemMolecule: React.FC<NavItemMoleculeProps> = ({
  theme,
  frame,
  fps,
  delay = 0,
  icon = "→",
  label,
  active = false,
}) => {
  const s = springEntrance(frame, fps, delay, SPRING.snappy);
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 12px",
        borderRadius: 8,
        background: active ? theme.bgGlass : "transparent",
        borderLeft: active ? `2px solid ${theme.accent}` : "2px solid transparent",
        opacity,
        transform: `translateX(${slideIn(s, "left", 15)}px)`,
      }}
    >
      <IconBadgeAtom theme={theme} frame={frame} fps={fps} delay={delay} icon={icon} size={16} />
      <LabelAtom theme={theme} frame={frame} fps={fps} text={label} fontSize={13} color={active ? "accent" : "secondary"} />
      <div style={{ marginLeft: "auto" }}>
        <ArrowIndicatorAtom theme={theme} frame={frame} fps={fps} delay={delay} direction="right" size={10} />
      </div>
    </div>
  );
};

export const NavItemMoleculeMeta: MoleculeMeta = registerMolecule({
  name: "NavItem",
  atoms: ["IconBadge", "Label", "ArrowIndicator"],
  category: "navigation",
  compatibleShells: ["PipelineShell", "CategoryGroupShell", "ListDetailShell", "SplitPanelShell"],
});
