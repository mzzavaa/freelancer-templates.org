/**
 * Particle Explosion - Adapted from reactvideoeditor/remotion-templates
 *
 * Original: https://github.com/reactvideoeditor/remotion-templates/blob/main/templates/particle-explosion.tsx
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
import { RADIUS } from "../_shared/DesignTokens";

export interface ParticleExplosionSpec {
  text: string;
  particleCount?: number;
}

export interface ParticleExplosionProps {
  spec: ParticleExplosionSpec;
  theme: Theme;
  fontScale?: number;
}

const SAMPLE_SPEC: ParticleExplosionSpec = {
  text: "BOOM!",
  particleCount: 100,
};

export const ParticleExplosion: React.FC<ParticleExplosionProps> = ({ spec, theme, fontScale }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const T = makeType(fontScale ?? 1.2);
  const count = spec.particleCount ?? 100;

  const particles = Array.from({ length: count }).map((_, i) => {
    const baseAngle = (i / count) * Math.PI * 2;
    const rotatingAngle = baseAngle + frame * 0.02;
    const seed = ((i * 7919) % 1000) / 1000;
    const scale = spring({ frame, fps, from: 0, to: seed * 1.2 + 0.3, config: { mass: 0.3, damping: 12 } });
    const distance = spring({ frame, fps, from: 0, to: 180 + seed * 40, config: { mass: 0.4, damping: 10 } });
    const x = Math.cos(rotatingAngle) * distance;
    const y = Math.sin(rotatingAngle) * distance;
    const opacity = Math.max(0, 1 - frame / 90);
    return { x, y, opacity, scale };
  });

  return (
    <AbsoluteFill style={{ background: theme.bg, fontFamily: theme.fontFamily }}>
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: `translate(-50%, -50%) scale(${Math.min(1, frame / 10)})`,
        fontSize: T.hero, fontWeight: theme.headingWeight,
        color: theme.textPrimary, textShadow: `0 0 10px ${theme.accent}`, zIndex: 2,
      }}>
        {spec.text}
      </div>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: "50%", top: "50%",
          transform: `translate(-50%, -50%) translate(${p.x}px, ${p.y}px) scale(${p.scale})`,
          width: 12, height: 12, backgroundColor: theme.accent,
          borderRadius: RADIUS.full, opacity: p.opacity, boxShadow: `0 0 5px ${theme.accentSecondary}`,
        }} />
      ))}
    </AbsoluteFill>
  );
};

export { SAMPLE_SPEC as PARTICLEEXPLOSION_SAMPLE };
