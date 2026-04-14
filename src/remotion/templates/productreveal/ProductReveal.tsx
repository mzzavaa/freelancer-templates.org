/**
 * Product Reveal — 1080×1920 portrait
 *
 * 3-beat beauty/fashion product launch sequence:
 *   Beat 1 (0–90f):   Teaser — blurred product image + "coming soon" whisper
 *   Beat 2 (90–150f):  Reveal — sticker badge "NEW DROP" + WavyText
 *   Beat 3 (150–240f): Hero — unblurred product image + ConfettiBurst
 *
 * Total: 240 frames (8s @ 30fps)
 */

import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PORTRAIT_TYPE, PORTRAIT_PADDING } from "../_shared/PortraitTypes";
import {
  getSafeZone,
  getCaptionAnchor,
  type PlatformId,
} from "../_shared/PlatformSafeZones";
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

export const PR_BEAT1_FRAMES = 90;
export const PR_BEAT2_FRAMES = 60;
export const PR_BEAT3_FRAMES = 90;
export const PR_TOTAL_FRAMES = PR_BEAT1_FRAMES + PR_BEAT2_FRAMES + PR_BEAT3_FRAMES; // 240

// ── Props ──────────────────────────────────────────────────────

export interface ProductRevealProps {
  platform: PlatformId;
  theme: Theme;
  productName?: string;
  tagline?: string;
  dropLabel?: string;
  productImageUrl?: string;
  /** "luxury" = restrained + slow; "playful" = energetic + sparkles */
  style?: "luxury" | "playful";
}

// ── Beat 1 — Teaser ────────────────────────────────────────────

const TeaserBeat: React.FC<{
  imageUrl: string;
  theme: Theme;
  safe: ReturnType<typeof getSafeZone>;
  style: "luxury" | "playful";
}> = ({ imageUrl, theme, safe, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const blurFade = interpolate(frame, [0, 30, PR_BEAT1_FRAMES - 10, PR_BEAT1_FRAMES], [0, 1, 1, 0]);
  const blurPx = interpolate(frame, [0, 30], [20, 12], { extrapolateRight: "clamp" });

  const textEnter = spring({ frame: Math.max(0, frame - 20), fps, config: SPRING.gentle });

  return (
    <AbsoluteFill>
      {/* Blurred product image */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={imageUrl}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: `blur(${blurPx}px)`,
            transform: "scale(1.05)",
            opacity: blurFade,
          }}
        />
        <AbsoluteFill style={{ background: "rgba(0,0,0,0.5)" }} />
      </AbsoluteFill>

      {/* "Something new is coming" */}
      <div
        style={{
          position: "absolute",
          top: safe.top + 120,
          left: PORTRAIT_PADDING,
          right: PORTRAIT_PADDING,
          opacity: textEnter,
          transform: `translateY(${(1 - textEnter) * 30}px)`,
        }}
      >
        <div
          style={{
            fontFamily: theme.fontFamily,
            fontWeight: theme.bodyWeight,
            fontSize: PORTRAIT_TYPE.body,
            color: theme.textMuted,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}
        >
          something new
        </div>
        <div
          style={{
            marginTop: 16,
            fontFamily: theme.fontFamily,
            fontWeight: theme.headingWeight,
            fontSize: PORTRAIT_TYPE.hero,
            color: theme.textPrimary,
            lineHeight: 1.0,
          }}
        >
          is coming
        </div>
      </div>

      {style === "playful" && (
        <AnimatedSparkles count={6} color={theme.accentSecondary} startAt={15} seed="pr-teaser" />
      )}
    </AbsoluteFill>
  );
};

// ── Beat 2 — NEW DROP sticker ─────────────────────────────────

const DropBeat: React.FC<{
  dropLabel: string;
  theme: Theme;
  safe: ReturnType<typeof getSafeZone>;
  style: "luxury" | "playful";
}> = ({ dropLabel, theme, safe, style }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Blob morphing behind
  const blobScale = spring({ frame, fps, config: SPRING.bouncy });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      {/* Blob bg */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${blobScale})`,
        }}
      >
        <BlobShape color={theme.accent} size={700} opacity={0.15} morph={30} startAt={0} />
      </div>

      {/* Main sticker */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
      >
        <StickerBadge
          text={dropLabel}
          color={theme.accent}
          textColor="#ffffff"
          rotation={style === "luxury" ? -3 : -8}
          enterAt={0}
          size="lg"
        />
        <WavyText
          text="LAUNCH"
          color={theme.textPrimary}
          fontSize={PORTRAIT_TYPE.subtitle}
          amplitude={style === "playful" ? 18 : 8}
          speed={style === "playful" ? 1.5 : 0.8}
        />
      </div>

      {style === "playful" && (
        <AnimatedSparkles count={14} color={theme.accent} startAt={5} seed="pr-drop" />
      )}
    </AbsoluteFill>
  );
};

// ── Beat 3 — Product hero ──────────────────────────────────────

const HeroBeat: React.FC<{
  imageUrl: string;
  productName: string;
  tagline: string;
  theme: Theme;
  safe: ReturnType<typeof getSafeZone>;
  platform: PlatformId;
  style: "luxury" | "playful";
}> = ({ imageUrl, productName, tagline, theme, safe, platform, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const anchor = getCaptionAnchor(platform);
  const imageEnter = spring({ frame, fps, config: SPRING.gentle });
  const textEnter = spring({ frame: Math.max(0, frame - 15), fps, config: SPRING.snappy });

  // Determine if this is an upper-third platform (TikTok) or lower-third (Reels)
  const isUpperThird = platform === "tiktok_vertical";
  const captionY = anchor.top;

  return (
    <AbsoluteFill>
      {/* Full hero image */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={imageUrl}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: imageEnter,
            transform: `scale(${1.05 - 0.05 * imageEnter})`,
          }}
        />
        <AbsoluteFill
          style={{
            background:
              isUpperThird
                ? "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 45%)"
                : "linear-gradient(0deg, rgba(0,0,0,0.75) 0%, transparent 50%)",
          }}
        />
      </AbsoluteFill>

      {/* Confetti bursts */}
      <ConfettiBurst triggerFrame={0} count={style === "playful" ? 50 : 25} cx={0.5} cy={0.4} />
      <ConfettiBurst triggerFrame={20} count={style === "playful" ? 30 : 15} cx={0.2} cy={0.6} />

      {/* Product name + tagline */}
      <div
        style={{
          position: "absolute",
          left: PORTRAIT_PADDING,
          right: PORTRAIT_PADDING,
          top: captionY,
          opacity: textEnter,
          transform: `translateY(${(1 - textEnter) * 40}px)`,
        }}
      >
        <div
          style={{
            fontFamily: theme.fontFamily,
            fontWeight: theme.headingWeight,
            fontSize: PORTRAIT_TYPE.title,
            color: theme.textPrimary,
            lineHeight: 1.1,
            textShadow: "0 4px 24px rgba(0,0,0,0.9)",
          }}
        >
          {productName}
        </div>
        <div
          style={{
            marginTop: 16,
            fontFamily: theme.fontFamily,
            fontWeight: theme.bodyWeight,
            fontSize: PORTRAIT_TYPE.body,
            color: theme.textSecondary,
            textShadow: "0 2px 12px rgba(0,0,0,0.9)",
          }}
        >
          {tagline}
        </div>
      </div>

      {style === "playful" && (
        <AnimatedSparkles count={10} color={theme.accentSecondary} startAt={5} seed="pr-hero" />
      )}
    </AbsoluteFill>
  );
};

// ── Main composition ───────────────────────────────────────────

export const ProductReveal: React.FC<ProductRevealProps> = ({
  platform,
  theme,
  productName = "New Drop",
  tagline = "Available now — limited edition",
  dropLabel = "NEW DROP",
  productImageUrl,
  style = "luxury",
}) => {
  const imageUrl =
    productImageUrl ?? getStockImage("fashion", 1080, 1920, 2);
  const safe = getSafeZone(platform);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence from={0} durationInFrames={PR_BEAT1_FRAMES}>
        <TeaserBeat imageUrl={imageUrl} theme={theme} safe={safe} style={style} />
      </Sequence>

      <Sequence from={PR_BEAT1_FRAMES} durationInFrames={PR_BEAT2_FRAMES}>
        <DropBeat dropLabel={dropLabel} theme={theme} safe={safe} style={style} />
      </Sequence>

      <Sequence from={PR_BEAT1_FRAMES + PR_BEAT2_FRAMES} durationInFrames={PR_BEAT3_FRAMES}>
        <HeroBeat
          imageUrl={imageUrl}
          productName={productName}
          tagline={tagline}
          theme={theme}
          safe={safe}
          platform={platform}
          style={style}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
