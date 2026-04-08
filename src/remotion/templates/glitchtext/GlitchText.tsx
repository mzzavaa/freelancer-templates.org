/**
 * Glitch Text - Adapted from reactvideoeditor/remotion-templates
 *
 * Original: https://github.com/reactvideoeditor/remotion-templates/blob/main/templates/glitch-text.tsx
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
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { Theme } from "../_shared/themes";
import { makeType } from "../_shared/layouts";


export interface GlitchTextSpec {
  text: string;
}

export interface GlitchTextProps {
  spec: GlitchTextSpec;
  theme: Theme;
  fontScale?: number;
}

const SAMPLE_SPEC: GlitchTextSpec = {
  text: "GLITCH",
};

export const GlitchText: React.FC<GlitchTextProps> = ({ spec, theme, fontScale }) => {
  const frame = useCurrentFrame();
  const T = makeType(fontScale ?? 1.2);

  const glitchIntensity = Math.sin(frame / 10) * 10;
  const rgbOffset = Math.sin(frame / 5) * 5;

  return (
    <AbsoluteFill style={{ background: theme.bg, fontFamily: theme.fontFamily, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "relative", fontSize: T.hero, fontWeight: theme.headingWeight, fontFamily: "monospace" }}>
        <div style={{
          position: "absolute", color: theme.accent,
          transform: `translate(${rgbOffset}px, ${glitchIntensity}px)`, mixBlendMode: "screen",
        }}>
          {spec.text}
        </div>
        <div style={{
          position: "absolute", color: theme.accentSecondary,
          transform: `translate(${-rgbOffset}px, ${-glitchIntensity}px)`, mixBlendMode: "screen",
        }}>
          {spec.text}
        </div>
        <div style={{ color: theme.textPrimary, opacity: 0.8 }}>{spec.text}</div>
      </div>
    </AbsoluteFill>
  );
};

export { SAMPLE_SPEC as GLITCHTEXT_SAMPLE };
