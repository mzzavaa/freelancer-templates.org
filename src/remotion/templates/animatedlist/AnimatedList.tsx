/**
 * Animated List - Adapted from reactvideoeditor/remotion-templates
 *
 * Original: https://github.com/reactvideoeditor/remotion-templates/blob/main/templates/animated-list.tsx
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
import { makeType, PADDING, TOP_SAFE } from "../_shared/layouts";
import { SPACE, RADIUS } from "../_shared/DesignTokens";

export interface AnimatedListSpec {
  items: Array<{ label: string }>;
  title?: string;
}

export interface AnimatedListProps {
  spec: AnimatedListSpec;
  theme: Theme;
  fontScale?: number;
}

const SAMPLE_SPEC: AnimatedListSpec = {
  items: [
    { label: "Discovery & Strategy" },
    { label: "Design & Prototyping" },
    { label: "Development & Testing" },
  ],
  title: "Our Process",
};

export const AnimatedList: React.FC<AnimatedListProps> = ({ spec, theme, fontScale }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = makeType(fontScale ?? 1.0);

  return (
    <AbsoluteFill style={{ background: theme.bg, fontFamily: theme.fontFamily, padding: PADDING }}>
      {spec.title && (
        <div style={{
          fontSize: T.title, fontWeight: theme.headingWeight,
          color: theme.textPrimary, marginTop: TOP_SAFE, marginBottom: SPACE.xl,
        }}>
          {spec.title}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: SPACE.md, marginTop: spec.title ? 0 : TOP_SAFE + 80 }}>
        {spec.items.map((item, i) => {
          const delay = i * 8;
          const slideX = spring({ frame: frame - delay, fps, from: -120, to: 0, config: { damping: 12, mass: 0.5 } });
          const opacity = spring({ frame: frame - delay, fps, from: 0, to: 1, config: { damping: 12, mass: 0.5 } });
          const scale = spring({ frame: frame - delay, fps, from: 0.3, to: 1, config: { damping: 12, mass: 0.5 } });

          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: SPACE.lg,
              transform: `translateX(${slideX}px) scale(${scale})`, opacity,
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: RADIUS.full,
                background: theme.accentGradient,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: theme.cardShadow,
                fontSize: T.body, fontWeight: theme.headingWeight, color: theme.textPrimary,
              }}>
                {i + 1}
              </div>
              <span style={{ color: theme.textPrimary, fontSize: T.subtitle, fontWeight: theme.bodyWeight }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export { SAMPLE_SPEC as ANIMATEDLIST_SAMPLE };
