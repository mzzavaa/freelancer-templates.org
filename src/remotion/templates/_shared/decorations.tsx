/**
 * Animated Background Decorations for Journal Content Templates
 *
 * Ambient visual elements layered behind template content:
 *   - FloatingOrbs: drifting semi-transparent gradient circles
 *   - ParticleField: scattered tiny dots with fade cycles
 *   - AccentLine: animated gradient line with glow
 *
 * All decorations use `extrapolateRight: "clamp"` on interpolations.
 */

import React from "react";
import { interpolate, spring } from "remotion";
import { SPRING } from "./animations";

// ── FloatingOrbs ────────────────────────────────────────────────
// 3–5 semi-transparent gradient circles drifting ±20px independently.
export const FloatingOrbs: React.FC<{
  frame: number;
  count?: number;
  color?: string;
}> = ({ frame, count = 4, color = "#6366f1" }) => {
  const orbs = Array.from({ length: count }, (_, i) => {
    const phase = (i * 1.7) + 0.5;
    const speed = 0.02 + i * 0.005;
    const xOffset = Math.sin(frame * speed + phase) * 20;
    const yOffset = Math.cos(frame * speed * 0.8 + phase * 1.3) * 15;
    const baseX = 15 + (i * 70 / count);
    const baseY = 20 + ((i % 3) * 25);
    const size = 80 + i * 40;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${baseX}%`,
          top: `${baseY}%`,
          width: size,
          height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}18 0%, ${color}05 60%, transparent 100%)`,
          transform: `translate(${xOffset}px, ${yOffset}px)`,
          pointerEvents: "none" as const,
        }}
      />
    );
  });
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" as const }}>
      {orbs}
    </div>
  );
};


// ── ParticleField ───────────────────────────────────────────────
// 8–12 tiny dots scattered at fixed positions with fade-in/fade-out cycles.
export const ParticleField: React.FC<{
  frame: number;
  count?: number;
  color?: string;
}> = ({ frame, count = 10, color = "#6366f1" }) => {
  const particles = Array.from({ length: count }, (_, i) => {
    // Deterministic pseudo-random positions based on index
    const x = ((i * 37 + 13) % 90) + 5;
    const y = ((i * 53 + 7) % 85) + 5;
    const cycleLength = 60 + (i % 4) * 15;
    const offset = i * 12;
    const cyclePos = ((frame + offset) % cycleLength) / cycleLength;
    // Smooth fade in/out: 0→1→0 over cycle
    const opacity = interpolate(
      cyclePos,
      [0, 0.3, 0.7, 1],
      [0, 0.25, 0.25, 0],
      { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
    );
    const dotSize = 2 + (i % 2);
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${x}%`,
          top: `${y}%`,
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          background: color,
          opacity,
          pointerEvents: "none" as const,
        }}
      />
    );
  });
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" as const }}>
      {particles}
    </div>
  );
};

// ── AccentLine ──────────────────────────────────────────────────
// Thin gradient line with animated length growth and glow.
export const AccentLine: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  color?: string;
  colorSecondary?: string;
  direction?: "horizontal" | "vertical";
}> = ({
  frame,
  fps,
  startFrame,
  color = "#6366f1",
  colorSecondary = "#a855f7",
  direction = "horizontal",
}) => {
  const s = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING.gentle,
  });
  const progress = interpolate(s, [0, 1], [0, 100], { extrapolateRight: "clamp" });

  const isHorizontal = direction === "horizontal";
  return (
    <div
      style={{
        width: isHorizontal ? `${progress}%` : 2,
        height: isHorizontal ? 2 : `${progress}%`,
        background: `linear-gradient(${isHorizontal ? "90deg" : "180deg"}, ${color}, ${colorSecondary})`,
        boxShadow: `0 0 8px ${color}40, 0 0 16px ${color}20`,
        borderRadius: 1,
        transition: "none",
      }}
    />
  );
};
