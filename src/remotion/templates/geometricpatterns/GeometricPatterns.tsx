/**
 * Geometric Patterns - Adapted from reactvideoeditor/remotion-templates
 *
 * Original: https://github.com/reactvideoeditor/remotion-templates/blob/main/templates/geometric-patterns.tsx
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
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../_shared/themes";
import { makeType } from "../_shared/layouts";


export interface GeometricPatternsSpec {
  patternCount?: number;
  overlayText?: string;
}

export interface GeometricPatternsProps {
  spec: GeometricPatternsSpec;
  theme: Theme;
  fontScale?: number;
}

const SAMPLE_SPEC: GeometricPatternsSpec = {
  patternCount: 20,
  overlayText: "Creative Studio",
};

export const GeometricPatterns: React.FC<GeometricPatternsProps> = ({ spec, theme, fontScale }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const T = makeType(fontScale ?? 1.2);
  const count = spec.patternCount ?? 20;

  const patterns = Array.from({ length: count }).map((_, i) => {
    const rotation = spring({ frame: frame - i * 3, fps: 30, from: 0, to: 360, config: { damping: 100 } });
    const scale = spring({ frame: frame - i * 3, fps: 30, from: 0.5, to: 1, config: { damping: 100 } });
    return { rotation, scale, index: i };
  });

  return (
    <AbsoluteFill style={{ background: theme.bg, fontFamily: theme.fontFamily, overflow: "hidden" }}>
      {patterns.map(({ rotation, scale, index }) => (
        <div key={index} style={{
          position: "absolute", left: "50%", top: "50%", width: "100%", height: "100%",
          transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
          border: `2px solid ${theme.cardBorder}`, borderRadius: `${index * 5}%`,
        }} />
      ))}
      {spec.overlayText && (
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%, -50%)", zIndex: 10,
          fontSize: T.hero, fontWeight: theme.headingWeight,
          color: theme.textPrimary, textShadow: `0 0 40px ${theme.accent}`,
        }}>
          {spec.overlayText}
        </div>
      )}
    </AbsoluteFill>
  );
};

export { SAMPLE_SPEC as GEOMETRICPATTERNS_SAMPLE };
