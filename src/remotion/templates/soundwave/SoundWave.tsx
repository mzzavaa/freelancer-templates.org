/**
 * Sound Wave - Adapted from reactvideoeditor/remotion-templates
 *
 * Original: https://github.com/reactvideoeditor/remotion-templates/blob/main/templates/sound-wave.tsx
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
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../_shared/themes";
import { makeType, TOP_SAFE } from "../_shared/layouts";
import { SPACE, RADIUS } from "../_shared/DesignTokens";

export interface SoundWaveSpec {
  barCount?: number;
  overlayText?: string;
}

export interface SoundWaveProps {
  spec: SoundWaveSpec;
  theme: Theme;
  fontScale?: number;
}

const SAMPLE_SPEC: SoundWaveSpec = {
  barCount: 40,
  overlayText: "Now Playing",
};

export const SoundWave: React.FC<SoundWaveProps> = ({ spec, theme, fontScale }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const T = makeType(fontScale ?? 1.2);
  const barCount = spec.barCount ?? 40;

  const bars = Array.from({ length: barCount }).map((_, i) => {
    const seed = ((i * 1000 * 7919) % 1000) / 1000;
    const h = Math.abs(Math.sin(frame / 10 + i / 2)) * 100 + seed * 50;
    return { height: h };
  });

  return (
    <AbsoluteFill style={{ background: theme.bg, fontFamily: theme.fontFamily }}>
      {spec.overlayText && (
        <div style={{
          position: "absolute", top: TOP_SAFE + SPACE.xl, width: "100%",
          textAlign: "center", fontSize: T.title, fontWeight: theme.headingWeight,
          color: theme.textPrimary, zIndex: 2,
        }}>
          {spec.overlayText}
        </div>
      )}
      <div style={{
        width, height, display: "flex", alignItems: "center",
        justifyContent: "center", gap: 4,
      }}>
        {bars.map((bar, i) => (
          <div key={i} style={{
            width: 12, height: bar.height,
            background: theme.accent, borderRadius: RADIUS.sm,
            boxShadow: `0 0 10px ${theme.accentSecondary}`,
          }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export { SAMPLE_SPEC as SOUNDWAVE_SAMPLE };
