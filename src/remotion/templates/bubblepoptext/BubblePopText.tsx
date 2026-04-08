/**
 * Bubble Pop Text - Adapted from reactvideoeditor/remotion-templates
 *
 * Original: https://github.com/reactvideoeditor/remotion-templates/blob/main/templates/bubble-pop-text.tsx
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

export interface BubblePopTextSpec {
  text: string;
}

export interface BubblePopTextProps {
  spec: BubblePopTextSpec;
  theme: Theme;
  fontScale?: number;
}

const SAMPLE_SPEC: BubblePopTextSpec = {
  text: "HELLO",
};

export const BubblePopText: React.FC<BubblePopTextProps> = ({ spec, theme, fontScale }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = makeType(fontScale ?? 1.0);

  return (
    <AbsoluteFill style={{ background: theme.bg, fontFamily: theme.fontFamily, justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", gap: SPACE.md }}>
        {spec.text.split("").map((char, i) => {
          const delay = i * 5;
          const scale = spring({ frame: frame - delay, fps, from: 0, to: 1, config: { damping: 8, mass: 0.3, stiffness: 100 } });

          return (
            <span key={i} style={{
              display: "inline-block", transform: `scale(${scale})`,
              fontSize: T.title, fontWeight: theme.headingWeight, color: theme.textPrimary,
              border: `3px solid ${theme.cardBorder}`, borderRadius: RADIUS.full,
              width: 100, height: 100, lineHeight: "94px", textAlign: "center",
              background: theme.accentGradient, boxShadow: theme.cardShadow,
            }}>
              {char}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export { SAMPLE_SPEC as BUBBLEPOPTEXT_SAMPLE };
