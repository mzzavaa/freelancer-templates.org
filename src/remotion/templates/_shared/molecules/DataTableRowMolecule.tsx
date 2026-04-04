import React from "react";
import type { Theme } from "../themes";
import type { MoleculeMeta } from "./registry-core";
import { registerMolecule } from "./registry-core";
import { LabelAtom } from "../atoms/LabelAtom";
import { StatusBadgeAtom } from "../atoms/StatusBadgeAtom";
import { springEntrance, slideIn, SPRING } from "../animations";
import { interpolate } from "remotion";

export interface DataTableRowMoleculeProps {
  theme: Theme;
  frame: number;
  fps: number;
  delay?: number;
  cells: Array<{ text: string; width?: number }>;
  status?: string;
}

export const DataTableRowMolecule: React.FC<DataTableRowMoleculeProps> = ({
  theme,
  frame,
  fps,
  delay = 0,
  cells,
  status,
}) => {
  const s = springEntrance(frame, fps, delay, SPRING.default);
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: `1px solid ${theme.cardBorder}`,
        opacity,
        transform: `translateX(${slideIn(s, "right", 15)}px)`,
      }}
    >
      {cells.map((cell, i) => (
        <div key={i} style={{ flex: cell.width ?? 1 }}>
          <LabelAtom theme={theme} frame={frame} fps={fps} text={cell.text} fontSize={13} color={i === 0 ? "primary" : "secondary"} />
        </div>
      ))}
      {status && (
        <div style={{ flexShrink: 0 }}>
          <StatusBadgeAtom theme={theme} frame={frame} fps={fps} delay={delay} text={status} />
        </div>
      )}
    </div>
  );
};

export const DataTableRowMoleculeMeta: MoleculeMeta = registerMolecule({
  name: "DataTableRow",
  atoms: ["Label", "StatusBadge"],
  category: "stats",
  compatibleShells: ["StatusBoardShell", "ListDetailShell", "ComparisonShell", "CardGridShell"],
});
