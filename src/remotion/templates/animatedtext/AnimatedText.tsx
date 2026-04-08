/**
 * Animated Text - Adapted from reactvideoeditor/remotion-templates
 *
 * Original: https://github.com/reactvideoeditor/remotion-templates/blob/main/templates/animated-text.tsx
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
import { makeType, PADDING } from "../_shared/layouts";
import { SPACE } from "../_shared/DesignTokens";

export interface AnimatedTextSpec {
  text: string;
  subtitle?: string;
}

export interface AnimatedTextProps {
  spec: AnimatedTextSpec;
  theme: Theme;
  fontScale?: number;
}

const SAMPLE_SPEC: AnimatedTextSpec = {
  text: "Hello World",
  subtitle: "Spring-animated character reveal",
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({ spec, theme, fontScale }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = makeType(fontScale ?? 1.0);
  const chars = spec.text.split("");

  return (
    <AbsoluteFill style={{ background: theme.bg, fontFamily: theme.fontFamily, justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", padding: PADDING }}>
        <div>
          {chars.map((char, i) => {
            const delay = i * 4;
            const opacity = spring({ frame: frame - delay, fps, from: 0, to: 1, config: { mass: 0.5, damping: 10 } });
            const y = spring({ frame: frame - delay, fps, from: -50, to: 0, config: { mass: 0.5, damping: 10 } });
            const rotate = spring({ frame: frame - delay, fps, from: -180, to: 0, config: { mass: 0.5, damping: 12 } });

            return (
              <span key={i} style={{
                display: "inline-block", opacity,
                fontSize: T.hero, fontWeight: theme.headingWeight,
                color: theme.textPrimary,
                transform: `translateY(${y}px) rotate(${rotate}deg)`,
              }}>
                {char === " " ? "\u00A0" : char}
              </span>
            );
          })}
        </div>
        {spec.subtitle && (
          <div style={{
            fontSize: T.subtitle, color: theme.textSecondary,
            marginTop: SPACE.lg, fontWeight: theme.bodyWeight,
            opacity: spring({ frame: frame - chars.length * 4, fps, from: 0, to: 1 }),
          }}>
            {spec.subtitle}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export { SAMPLE_SPEC as ANIMATEDTEXT_SAMPLE };
