/**
 * Slide Text - Adapted from reactvideoeditor/remotion-templates
 *
 * Original: https://github.com/reactvideoeditor/remotion-templates/blob/main/templates/slide-text.tsx
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

export interface SlideTextSpec {
  text: string;
  subtitle?: string;
}

export interface SlideTextProps {
  spec: SlideTextSpec;
  theme: Theme;
  fontScale?: number;
}

const SAMPLE_SPEC: SlideTextSpec = {
  text: "Sliding In",
  subtitle: "Smooth spring-animated entrance",
};

export const SlideText: React.FC<SlideTextProps> = ({ spec, theme, fontScale }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = makeType(fontScale ?? 1.2);

  const opacity = spring({ frame, fps, from: 0, to: 1, durationInFrames: 30 });
  const slideX = spring({ frame, fps, from: 200, to: 0, durationInFrames: 30, config: { damping: 12, mass: 0.5 } });

  return (
    <AbsoluteFill style={{ background: theme.bg, fontFamily: theme.fontFamily, justifyContent: "center", alignItems: "center" }}>
      <div style={{ transform: `translateX(${slideX}px)`, textAlign: "center", padding: PADDING }}>
        <div style={{
          opacity, fontSize: T.hero, fontWeight: theme.headingWeight, color: theme.textPrimary,
        }}>
          {spec.text}
        </div>
        {spec.subtitle && (
          <div style={{
            opacity: spring({ frame: frame - 10, fps, from: 0, to: 1 }),
            fontSize: T.subtitle, color: theme.textSecondary, marginTop: SPACE.lg,
          }}>
            {spec.subtitle}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export { SAMPLE_SPEC as SLIDETEXT_SAMPLE };
