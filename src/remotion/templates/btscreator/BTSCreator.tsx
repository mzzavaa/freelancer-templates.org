/**
 * BTS Creator — 1080×1920 portrait
 *
 * Split-screen before/after (or setup → final). Two stock images side
 * by side separated by an animated centre line. A "BTS" sticker badge
 * rotates in with a bounce. Caption block explains each side.
 *
 * Timeline:
 *   0–30f   — setup photo slides in from left
 *   15–45f  — final photo slides in from right
 *   30f     — BTS sticker bounces in
 *   45–240f — hold + sparkles / ambient motion
 *
 * Total: 240 frames (8s @ 30fps)
 */

import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PORTRAIT_TYPE, PORTRAIT_PADDING } from "../_shared/PortraitTypes";
import { getSafeZone, type PlatformId } from "../_shared/PlatformSafeZones";
import { getStockImage } from "../_shared/StockImages";
import {
  AnimatedSparkles,
  StickerBadge,
  BlobShape,
} from "../_shared/PlayfulElements";
import { SPRING } from "../_shared/animations";
import type { Theme } from "../_shared/themes";

// ── Constants ──────────────────────────────────────────────────

export const BTS_TOTAL_FRAMES = 240;

// ── Props ──────────────────────────────────────────────────────

export interface BTSCreatorProps {
  platform: PlatformId;
  theme: Theme;
  beforeLabel?: string;
  afterLabel?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  /** "chaotic" = colourful, sparkles everywhere; "clean" = minimal white */
  style?: "chaotic" | "clean";
}

// ── Main composition ───────────────────────────────────────────

export const BTSCreator: React.FC<BTSCreatorProps> = ({
  platform,
  theme,
  beforeLabel = "Setup",
  afterLabel = "Final",
  beforeImageUrl,
  afterImageUrl,
  style = "chaotic",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const safe = getSafeZone(platform);

  const beforeImg = beforeImageUrl ?? getStockImage("work",    1080, 1920, 1);
  const afterImg  = afterImageUrl  ?? getStockImage("fashion", 1080, 1920, 3);

  // LEFT panel slides in from left
  const leftSlide = spring({ frame: Math.max(0, frame), fps, config: SPRING.snappy });
  const leftX = interpolate(leftSlide, [0, 1], [-width * 0.5, 0]);

  // RIGHT panel slides in from right (delayed 15f)
  const rightSlide = spring({ frame: Math.max(0, frame - 15), fps, config: SPRING.snappy });
  const rightX = interpolate(rightSlide, [0, 1], [width * 0.5, 0]);

  // Centre divider scale
  const dividerScale = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 10, stiffness: 100 } });

  // BTS sticker
  const stickerEnter = spring({ frame: Math.max(0, frame - 30), fps, config: SPRING.bouncy });

  const halfW = width / 2;

  // Blob behind sticker (chaotic only)
  const blobScale = spring({ frame: Math.max(0, frame - 28), fps, config: SPRING.bouncy });

  return (
    <AbsoluteFill style={{ backgroundColor: style === "clean" ? "#ffffff" : theme.bg }}>

      {/* LEFT — setup photo */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: halfW,
          height,
          overflow: "hidden",
          transform: `translateX(${leftX}px)`,
        }}
      >
        <Img
          src={beforeImg}
          style={{ width: halfW, height, objectFit: "cover" }}
        />
        {/* Tint overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor:
              style === "chaotic"
                ? "rgba(0,0,0,0.25)"
                : "rgba(255,255,255,0.15)",
          }}
        />
        {/* Before label */}
        <div
          style={{
            position: "absolute",
            bottom: safe.bottom + 60,
            left: 16,
            right: 8,
            fontFamily: theme.fontFamily,
            fontWeight: theme.headingWeight,
            fontSize: PORTRAIT_TYPE.label,
            color: "#ffffff",
            textShadow: "0 2px 12px rgba(0,0,0,0.9)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {beforeLabel}
        </div>
      </div>

      {/* RIGHT — final photo */}
      <div
        style={{
          position: "absolute",
          left: halfW,
          top: 0,
          width: halfW,
          height,
          overflow: "hidden",
          transform: `translateX(${rightX}px)`,
        }}
      >
        <Img
          src={afterImg}
          style={{ width: halfW, height, objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor:
              style === "chaotic"
                ? "rgba(0,0,0,0.2)"
                : "rgba(255,255,255,0.1)",
          }}
        />
        {/* After label */}
        <div
          style={{
            position: "absolute",
            bottom: safe.bottom + 60,
            left: 8,
            right: 16,
            fontFamily: theme.fontFamily,
            fontWeight: theme.headingWeight,
            fontSize: PORTRAIT_TYPE.label,
            color: "#ffffff",
            textShadow: "0 2px 12px rgba(0,0,0,0.9)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            textAlign: "right",
          }}
        >
          {afterLabel}
        </div>
      </div>

      {/* Centre divider */}
      <div
        style={{
          position: "absolute",
          left: halfW - 3,
          top: 0,
          width: 6,
          height,
          backgroundColor: style === "chaotic" ? theme.accent : "#000000",
          transform: `scaleY(${dividerScale})`,
          transformOrigin: "top",
          boxShadow:
            style === "chaotic"
              ? `0 0 20px ${theme.accent}`
              : "none",
        }}
      />

      {/* Blob behind sticker — chaotic only */}
      {style === "chaotic" && (
        <div
          style={{
            position: "absolute",
            top: safe.top + 30,
            left: halfW - 200,
            transform: `scale(${blobScale})`,
          }}
        >
          <BlobShape
            color={theme.accentSecondary}
            size={400}
            opacity={0.25}
            morph={20}
            startAt={28}
          />
        </div>
      )}

      {/* BTS Sticker — centred on divider */}
      <div
        style={{
          position: "absolute",
          top: safe.top + 60,
          left: halfW,
          transform: `translate(-50%, 0) scale(${stickerEnter}) rotate(-12deg)`,
          transformOrigin: "center top",
        }}
      >
        <StickerBadge
          text="BTS"
          color={style === "chaotic" ? theme.accent : "#000000"}
          textColor="#ffffff"
          rotation={0}
          enterAt={30}
          size="lg"
        />
      </div>

      {/* Sparkles — chaotic only */}
      {style === "chaotic" && (
        <AnimatedSparkles count={12} color={theme.accent} startAt={35} seed="bts-chaos" />
      )}
    </AbsoluteFill>
  );
};
