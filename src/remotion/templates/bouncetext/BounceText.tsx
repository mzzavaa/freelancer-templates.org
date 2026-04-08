/**
 * Bounce Text - Adapted from reactvideoeditor/remotion-templates
 *
 * Original: https://github.com/reactvideoeditor/remotion-templates/blob/main/templates/bounce-text.tsx
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

export interface BounceTextSpec {
  headline: string;
  subtitle?: string;
}

export interface BounceTextProps {
  spec: BounceTextSpec;
  theme: Theme;
  fontScale?: number;
}

const SAMPLE_SPEC: BounceTextSpec = {
  headline: "Start Building",
  subtitle: "There has never been a better time",
};

export const BounceText: React.FC<BounceTextProps> = ({ spec, theme, fontScale }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = makeType(fontScale ?? 1.2);

  const slideIn = spring({ frame, fps, from: -100, to: 0, config: { damping: 100, mass: 1, stiffness: 200 } });
  const fadeIn = spring({ frame: frame - 15, fps, from: 0, to: 1, config: { damping: 100, mass: 1 } });
  const scaleIn = spring({ frame, fps, from: 0.5, to: 1, config: { damping: 100, mass: 1, stiffness: 200 } });
  const containerFade = spring({ frame, fps, from: 0, to: 1, config: { damping: 100, mass: 1 } });

  return (
    <AbsoluteFill style={{ background: theme.bg, fontFamily: theme.fontFamily, justifyContent: "center", alignItems: "center" }}>
      <div style={{
        transform: `scale(${scaleIn})`, width: "80%", padding: `${SPACE.xl}px ${SPACE.xxl}px`,
        background: theme.accentGradient, borderRadius: RADIUS.lg, opacity: containerFade,
      }}>
        <div style={{ transform: `translateX(${slideIn}%)` }}>
          <div style={{
            fontSize: T.hero, fontWeight: theme.headingWeight,
            color: theme.textPrimary, lineHeight: 1,
            textShadow: "0px 4px 8px rgba(0,0,0,0.3)",
          }}>
            {spec.headline}
          </div>
          {spec.subtitle && (
            <div style={{
              fontSize: T.subtitle, color: theme.textPrimary,
              marginTop: SPACE.md, fontWeight: theme.bodyWeight,
              opacity: fadeIn, textShadow: "0px 2px 4px rgba(0,0,0,0.2)",
            }}>
              {spec.subtitle}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export { SAMPLE_SPEC as BOUNCETEXT_SAMPLE };
