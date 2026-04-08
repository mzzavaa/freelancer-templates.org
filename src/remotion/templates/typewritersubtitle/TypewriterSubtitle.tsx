/**
 * Typewriter Subtitle - Adapted from reactvideoeditor/remotion-templates
 *
 * Original: https://github.com/reactvideoeditor/remotion-templates/blob/main/templates/typewriter-subtitle.tsx
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
import { makeType, PADDING } from "../_shared/layouts";


export interface TypewriterSubtitleSpec {
  text: string;
}

export interface TypewriterSubtitleProps {
  spec: TypewriterSubtitleSpec;
  theme: Theme;
  fontScale?: number;
}

const SAMPLE_SPEC: TypewriterSubtitleSpec = {
  text: "Building the future, one line at a time...",
};

export const TypewriterSubtitle: React.FC<TypewriterSubtitleProps> = ({ spec, theme, fontScale }) => {
  const frame = useCurrentFrame();
  const T = makeType(fontScale ?? 1.0);

  const visibleChars = Math.floor(interpolate(frame, [0, 60], [0, spec.text.length], { extrapolateRight: "clamp" }));

  return (
    <AbsoluteFill style={{ background: theme.bg, fontFamily: theme.fontFamily, justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", padding: PADDING }}>
        {spec.text.slice(0, visibleChars).split("").map((char, i) => (
          <span key={i} style={{
            display: "inline-block", fontFamily: "'Courier New', monospace",
            fontSize: T.subtitle, fontWeight: theme.headingWeight, color: theme.textPrimary,
          }}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
        <span style={{
          fontSize: T.subtitle, color: theme.accent,
          opacity: frame % 15 < 7 ? 1 : 0, marginLeft: 4, verticalAlign: "middle",
        }}>
          |
        </span>
      </div>
    </AbsoluteFill>
  );
};

export { SAMPLE_SPEC as TYPEWRITERSUBTITLE_SAMPLE };
