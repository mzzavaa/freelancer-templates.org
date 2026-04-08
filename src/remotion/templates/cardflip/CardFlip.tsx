/**
 * Card Flip - Adapted from reactvideoeditor/remotion-templates
 *
 * Original: https://github.com/reactvideoeditor/remotion-templates/blob/main/templates/card-flip.tsx
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

export interface CardFlipSpec {
  frontText: string;
  backText: string;
}

export interface CardFlipProps {
  spec: CardFlipSpec;
  theme: Theme;
  fontScale?: number;
}

const SAMPLE_SPEC: CardFlipSpec = {
  frontText: "The Question",
  backText: "The Answer",
};

export const CardFlip: React.FC<CardFlipProps> = ({ spec, theme, fontScale }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = makeType(fontScale ?? 1.2);

  const rotation = spring({ frame, fps, from: 0, to: 360, config: { damping: 15, mass: 0.5 } });

  return (
    <AbsoluteFill style={{ background: theme.bg, fontFamily: theme.fontFamily, justifyContent: "center", alignItems: "center" }}>
      <div style={{ perspective: 1000 }}>
        <div style={{
          width: 400, height: 500,
          transform: `rotateY(${rotation}deg)`, transformStyle: "preserve-3d",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", width: "100%", height: "100%",
            backfaceVisibility: "hidden", background: theme.accentGradient,
            borderRadius: RADIUS.lg, display: "flex", justifyContent: "center",
            alignItems: "center", fontSize: T.title, fontWeight: theme.headingWeight,
            color: theme.textPrimary, padding: SPACE.xl,
            textAlign: "center",
          }}>
            {spec.frontText}
          </div>
          <div style={{
            position: "absolute", width: "100%", height: "100%",
            backfaceVisibility: "hidden", background: theme.accentGradient,
            borderRadius: RADIUS.lg, display: "flex", justifyContent: "center",
            alignItems: "center", fontSize: T.title, fontWeight: theme.headingWeight,
            color: theme.textPrimary, transform: "rotateY(180deg)",
            padding: SPACE.xl, textAlign: "center",
          }}>
            {spec.backText}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export { SAMPLE_SPEC as CARDFLIP_SAMPLE };
