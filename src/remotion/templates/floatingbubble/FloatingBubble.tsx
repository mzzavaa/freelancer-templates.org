/**
 * Floating Bubble - Adapted from reactvideoeditor/remotion-templates
 *
 * Original: https://github.com/reactvideoeditor/remotion-templates/blob/main/templates/floating-bubble-text.tsx
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
import { SPACE, RADIUS } from "../_shared/DesignTokens";

export interface FloatingBubbleSpec {
  text: string;
  subtitle?: string;
}

export interface FloatingBubbleProps {
  spec: FloatingBubbleSpec;
  theme: Theme;
  fontScale?: number;
}

const SAMPLE_SPEC: FloatingBubbleSpec = {
  text: "Featured",
  subtitle: "Spotlight highlight",
};

export const FloatingBubble: React.FC<FloatingBubbleProps> = ({ spec, theme, fontScale }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = makeType(fontScale ?? 1.2);

  const float = Math.sin(frame / 30) * 20;
  const scale = spring({ frame, fps, from: 0, to: 1, config: { damping: 12, mass: 0.5 } });

  return (
    <AbsoluteFill style={{ background: theme.bg, fontFamily: theme.fontFamily, justifyContent: "center", alignItems: "center" }}>
      <div style={{ transform: `translateY(${float}px) scale(${scale})`, textAlign: "center" }}>
        <div style={{
          fontSize: T.hero, fontWeight: theme.headingWeight,
          color: theme.textPrimary, padding: `${SPACE.xl}px ${SPACE.xxl}px`,
          borderRadius: RADIUS.lg, background: theme.accentGradient,
          border: `3px solid ${theme.cardBorder}`, boxShadow: theme.cardShadow,
          position: "relative", overflow: "hidden",
        }}>
          {spec.text}
        </div>
        {spec.subtitle && (
          <div style={{
            fontSize: T.subtitle, color: theme.textSecondary,
            marginTop: SPACE.lg, opacity: spring({ frame: frame - 15, fps, from: 0, to: 1 }),
          }}>
            {spec.subtitle}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export { SAMPLE_SPEC as FLOATINGBUBBLE_SAMPLE };
