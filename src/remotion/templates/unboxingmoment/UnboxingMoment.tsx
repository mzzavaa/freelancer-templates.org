/**
 * Unboxing Moment — 1080×1920 portrait
 *
 * Single 8-second composition packed with layered energy:
 *   • BlobShape backgrounds morph throughout
 *   • ConfettiBurst at frames 30, 90, 150
 *   • Sticker badges fly in with product callouts at 20f, 60f, 120f
 *   • AnimatedSparkles throughout
 *   • Product name hero text with spring entrance
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
  BlobShape,
  ConfettiBurst,
  StickerBadge,
  WavyText,
} from "../_shared/PlayfulElements";
import { SPRING } from "../_shared/animations";
import type { Theme } from "../_shared/themes";

// ── Constants ──────────────────────────────────────────────────

export const UB_TOTAL_FRAMES = 240;

// ── Props ──────────────────────────────────────────────────────

export interface UnboxingMomentProps {
  platform: PlatformId;
  theme: Theme;
  productName?: string;
  callouts?: [string, string, string];
  productImageUrl?: string;
  /** "hype" = maximum energy; "editorial" = refined with controlled confetti */
  style?: "hype" | "editorial";
}

// ── Badge data ─────────────────────────────────────────────────

interface BadgeConfig {
  enterAt: number;
  text: string;
  x: number;   // px from left
  y: number;   // px from top
  rotation: number;
  size: "sm" | "md" | "lg";
}

// ── Main composition ───────────────────────────────────────────

export const UnboxingMoment: React.FC<UnboxingMomentProps> = ({
  platform,
  theme,
  productName = "The Drop",
  callouts = ["New Formula", "Lasts 24h", "Limited Ed"],
  productImageUrl,
  style = "hype",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const safe = getSafeZone(platform);

  const imageUrl = productImageUrl ?? getStockImage("fashion", 1080, 1920, 4);

  // Hero text spring
  const heroEnter = spring({ frame: Math.max(0, frame - 10), fps, config: SPRING.bouncy });

  // Subtle image scale as energy builds
  const imgScale = interpolate(frame, [0, 60, 150, 240], [1.0, 1.02, 1.04, 1.06]);

  // Blob morphing scale (three blobs at different positions)
  const blob1Scale = spring({ frame, fps, config: SPRING.gentle });
  const blob2Scale = spring({ frame: Math.max(0, frame - 15), fps, config: SPRING.gentle });
  const blob3Scale = spring({ frame: Math.max(0, frame - 30), fps, config: SPRING.gentle });

  const badges: BadgeConfig[] = [
    { enterAt: 20,  text: callouts[0], x: 80,  y: safe.top + 80, rotation: -8, size: "sm" },
    { enterAt: 60,  text: callouts[1], x: width - 380, y: safe.top + 200, rotation: 6,  size: "sm" },
    { enterAt: 120, text: callouts[2], x: 60,  y: height - safe.bottom - 300, rotation: -5, size: "md" },
  ];

  const confettiColors = style === "hype"
    ? [theme.accent, theme.accentSecondary, "#ffd700", "#ff6b9d", "#00ff88"]
    : [theme.accent, theme.accentSecondary, "#ffffff"];

  const confettiCount = style === "hype" ? 50 : 25;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>

      {/* Morphing blob backgrounds */}
      <div
        style={{
          position: "absolute",
          top: -100,
          left: -100,
          transform: `scale(${blob1Scale})`,
          transformOrigin: "top left",
        }}
      >
        <BlobShape color={theme.accent} size={500} opacity={0.18} morph={40} startAt={0} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: -100,
          right: -100,
          transform: `scale(${blob2Scale})`,
          transformOrigin: "bottom right",
        }}
      >
        <BlobShape color={theme.accentSecondary} size={450} opacity={0.15} morph={35} startAt={15} />
      </div>
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${blob3Scale})`,
        }}
      >
        <BlobShape color={theme.accent} size={600} opacity={0.08} morph={25} startAt={30} />
      </div>

      {/* Product image */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={imageUrl}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${imgScale})`,
            opacity: 0.7,
          }}
        />
        <AbsoluteFill
          style={{
            background:
              style === "hype"
                ? "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.7) 100%)"
                : "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 40%, rgba(0,0,0,0.6) 100%)",
          }}
        />
      </AbsoluteFill>

      {/* Sparkles */}
      <AnimatedSparkles
        count={style === "hype" ? 18 : 8}
        color={theme.accent}
        startAt={0}
        seed="ub-main"
      />
      {style === "hype" && (
        <AnimatedSparkles count={10} color={theme.accentSecondary} startAt={20} seed="ub-secondary" />
      )}

      {/* Confetti bursts */}
      <ConfettiBurst triggerFrame={30}  count={confettiCount} colors={confettiColors} cx={0.5}  cy={0.35} />
      <ConfettiBurst triggerFrame={90}  count={confettiCount} colors={confettiColors} cx={0.25} cy={0.5}  />
      <ConfettiBurst triggerFrame={150} count={confettiCount} colors={confettiColors} cx={0.75} cy={0.45} />

      {/* Sticker badges */}
      {badges.map((badge, i) => {
        const enter = spring({
          frame: Math.max(0, frame - badge.enterAt),
          fps,
          config: SPRING.bouncy,
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: badge.x,
              top: badge.y,
              transform: `scale(${enter}) rotate(${badge.rotation}deg)`,
              transformOrigin: "center center",
            }}
          >
            <StickerBadge
              text={badge.text}
              color={i % 2 === 0 ? theme.accent : theme.accentSecondary}
              textColor="#ffffff"
              rotation={0}
              enterAt={badge.enterAt}
              size={badge.size}
            />
          </div>
        );
      })}

      {/* Hero product name */}
      <div
        style={{
          position: "absolute",
          bottom: safe.bottom + 80,
          left: PORTRAIT_PADDING,
          right: PORTRAIT_PADDING,
          transform: `translateY(${(1 - heroEnter) * 80}px)`,
          opacity: heroEnter,
        }}
      >
        <WavyText
          text={productName}
          color={theme.textPrimary}
          fontSize={PORTRAIT_TYPE.hero}
          amplitude={style === "hype" ? 20 : 10}
          speed={style === "hype" ? 1.2 : 0.6}
        />
        <div
          style={{
            marginTop: 16,
            fontFamily: theme.fontFamily,
            fontWeight: theme.bodyWeight,
            fontSize: PORTRAIT_TYPE.body,
            color: theme.textSecondary,
            textShadow: "0 2px 12px rgba(0,0,0,0.8)",
          }}
        >
          {style === "hype" ? "🔥 Available now — don't sleep" : "Now available in select stores"}
        </div>
      </div>
    </AbsoluteFill>
  );
};
