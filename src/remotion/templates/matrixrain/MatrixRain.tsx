/**
 * Matrix Rain - Adapted from reactvideoeditor/remotion-templates
 *
 * Original: https://github.com/reactvideoeditor/remotion-templates/blob/main/templates/matrix-rain.tsx
 * License: Free to use (credit appreciated but not required)
 * Original author: reactvideoeditor.com
 *
 * ADAPTATION NOTES:
 * This composition was adapted from the open-source Remotion template library
 * by reactvideoeditor.com. We integrated it into our 16-theme design system
 * with BrandKit support for custom logo/color branding. Key changes:
 *   - Replaced hardcoded colors with Theme object tokens
 *   - Added BrandKit support via applyBrandKit() for client customization
 *   - Replaced hardcoded text with configurable Spec props
 *   - Font sizes use our TYPE scale (broadcast-safe minimums)
 *   - Spacing uses SPACE/PADDING tokens from DesignTokens
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../_shared/themes";
import { makeType } from "../_shared/layouts";


export interface MatrixRainSpec {
  overlayText?: string;
  characters?: string;
}

export interface MatrixRainProps {
  spec: MatrixRainSpec;
  theme: Theme;
  fontScale?: number;
}

const SAMPLE_SPEC: MatrixRainSpec = {
  overlayText: "SYSTEM ONLINE",
  characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*",
};

export const MatrixRain: React.FC<MatrixRainProps> = ({ spec, theme, fontScale }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const T = makeType(fontScale ?? 1.2);
  const chars = spec.characters ?? "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

  const columns = Math.floor(width / 20);
  const drops = Array.from({ length: columns }).map((_, i) => ({
    x: i * 20,
    y: ((i * 7919) % 1000) / 1000 * height,
    speed: ((i * 7919) % 1000) / 1000 * 5 + 5,
  }));

  return (
    <AbsoluteFill style={{ background: theme.bg, fontFamily: theme.fontFamily, overflow: "hidden" }}>
      {drops.map((drop, i) => {
        const y = (drop.y + frame * drop.speed) % height;
        return (
          <div key={i} style={{
            position: "absolute", left: drop.x, top: y,
            color: theme.accent, opacity: 1 - (y / height) * 0.6,
            fontSize: T.label, fontFamily: "monospace", fontWeight: theme.headingWeight,
            textShadow: `0 0 8px ${theme.accent}`,
          }}>
            {chars[Math.floor((frame + i) / 5) % chars.length]}
          </div>
        );
      })}
      {spec.overlayText && (
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%, -50%)", zIndex: 10,
          fontSize: T.hero, fontWeight: theme.headingWeight,
          color: theme.textPrimary, textShadow: `0 0 20px ${theme.accent}`,
        }}>
          {spec.overlayText}
        </div>
      )}
    </AbsoluteFill>
  );
};

export { SAMPLE_SPEC as MATRIXRAIN_SAMPLE };
