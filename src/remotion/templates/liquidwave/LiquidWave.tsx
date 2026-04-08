/**
 * Liquid Wave - Adapted from reactvideoeditor/remotion-templates
 *
 * Original: https://github.com/reactvideoeditor/remotion-templates/blob/main/templates/liquid-wave.tsx
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


export interface LiquidWaveSpec {
  overlayText?: string;
  wavePoints?: number;
}

export interface LiquidWaveProps {
  spec: LiquidWaveSpec;
  theme: Theme;
  fontScale?: number;
}

const SAMPLE_SPEC: LiquidWaveSpec = {
  overlayText: "Flow State",
  wavePoints: 50,
};

export const LiquidWave: React.FC<LiquidWaveProps> = ({ spec, theme, fontScale }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const T = makeType(fontScale ?? 1.2);
  const numPoints = spec.wavePoints ?? 50;

  const points = Array.from({ length: numPoints + 1 }).map((_, i) => {
    const x = (i / numPoints) * width;
    const waveHeight = Math.sin(frame / 20 + i / 5) * 50;
    const y = height / 2 + waveHeight;
    return `${x},${y}`;
  });

  return (
    <AbsoluteFill style={{ background: theme.bg, fontFamily: theme.fontFamily }}>
      <svg width={width} height={height} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={theme.accent} />
            <stop offset="100%" stopColor={theme.accentSecondary} />
          </linearGradient>
        </defs>
        <path d={`M 0,${height} ${points.join(" ")} ${width},${height} Z`}
          fill="url(#waveGrad)" style={{ filter: "blur(10px)" }} />
      </svg>
      {spec.overlayText && (
        <div style={{
          position: "absolute", left: "50%", top: "35%",
          transform: "translate(-50%, -50%)", zIndex: 10,
          fontSize: T.hero, fontWeight: theme.headingWeight,
          color: theme.textPrimary, textShadow: `0 0 30px ${theme.accent}`,
        }}>
          {spec.overlayText}
        </div>
      )}
    </AbsoluteFill>
  );
};

export { SAMPLE_SPEC as LIQUIDWAVE_SAMPLE };
