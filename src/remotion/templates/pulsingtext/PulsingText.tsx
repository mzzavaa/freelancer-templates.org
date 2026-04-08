/**
 * Pulsing Text - Adapted from reactvideoeditor/remotion-templates
 *
 * Original: https://github.com/reactvideoeditor/remotion-templates/blob/main/templates/pulsing-text.tsx
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
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { Theme } from "../_shared/themes";
import { makeType } from "../_shared/layouts";
import { SPACE, RADIUS } from "../_shared/DesignTokens";

export interface PulsingTextSpec {
  text: string;
}

export interface PulsingTextProps {
  spec: PulsingTextSpec;
  theme: Theme;
  fontScale?: number;
}

const SAMPLE_SPEC: PulsingTextSpec = {
  text: "Pulse",
};

export const PulsingText: React.FC<PulsingTextProps> = ({ spec, theme, fontScale }) => {
  const frame = useCurrentFrame();
  const T = makeType(fontScale ?? 1.2);

  return (
    <AbsoluteFill style={{ background: theme.bg, fontFamily: theme.fontFamily, justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", gap: SPACE.lg }}>
        {spec.text.split("").map((char, i) => {
          const delay = i * 6;
          const pulse = interpolate(((frame - delay) % 30) / 30, [0, 0.5, 1], [1, 1.2, 1], { extrapolateRight: "clamp" });
          const glowOpacity = interpolate(((frame - delay) % 30) / 30, [0, 0.5, 1], [0.5, 1, 0.5], { extrapolateRight: "clamp" });

          return (
            <div key={i} style={{ position: "relative", transform: `scale(${pulse})` }}>
              <span style={{
                fontSize: T.hero, fontWeight: theme.headingWeight,
                color: theme.textPrimary, position: "relative", zIndex: 2,
              }}>
                {char}
              </span>
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)", width: 80, height: 80,
                background: theme.accent, borderRadius: RADIUS.full,
                filter: "blur(20px)", opacity: glowOpacity, zIndex: 1,
              }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export { SAMPLE_SPEC as PULSINGTEXT_SAMPLE };
