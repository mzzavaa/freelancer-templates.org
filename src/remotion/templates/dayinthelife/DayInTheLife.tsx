/**
 * Day In The Life — 1080×1920 portrait
 *
 * 6-scene vlog-style auto-cut: morning coffee → work → lunch → gym →
 * dinner → sunset. Each scene is 60 frames (2s) at 30fps.
 *
 * Each scene shows a lifestyle stock photo with:
 *   • StickerBadge timestamp ("7AM", "12PM", etc.) flying in on cut
 *   • AnimatedSparkles for visual richness
 *   • Platform-aware caption in safe zone
 *
 * Total: 6 × 60 = 360 frames (12s @ 30fps)
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
  getCaptionAnchor,
  getSafeZone,
  type PlatformId,
} from "../_shared/PlatformSafeZones";
import { getStockImage } from "../_shared/StockImages";
import {
  AnimatedSparkles,
  StickerBadge,
} from "../_shared/PlayfulElements";
import { SPRING } from "../_shared/animations";
import type { Theme } from "../_shared/themes";

// ── Constants ──────────────────────────────────────────────────

export const DITL_SCENE_F = 60;
export const DITL_SCENES = 6;
export const DITL_TOTAL_FRAMES = DITL_SCENE_F * DITL_SCENES; // 360

// ── Scene data ─────────────────────────────────────────────────

export interface DITLScene {
  time: string;
  label: string;
  sublabel?: string;
  imageUrl?: string;
}

export interface DayInTheLifeProps {
  platform: PlatformId;
  theme: Theme;
  scenes?: DITLScene[];
  creatorHandle?: string;
  style?: "energetic" | "cinematic";
}

const CATEGORIES = [
  "coffee",
  "work",
  "food",
  "fitness",
  "food",
  "sunset",
] as const;

const DEFAULT_SCENES: DITLScene[] = [
  { time: "7AM",  label: "Morning Routine", sublabel: "coffee & skincare ☀️" },
  { time: "10AM", label: "Work Mode",       sublabel: "deep focus era 💻" },
  { time: "1PM",  label: "Lunch Break",     sublabel: "trying this spot 🍜" },
  { time: "5PM",  label: "Gym Time",        sublabel: "not skipping today 💪" },
  { time: "7PM",  label: "Dinner",          sublabel: "earned this one 🍽️" },
  { time: "9PM",  label: "Golden Hour",     sublabel: "chill mode activated 🌅" },
];

// ── Scene component ────────────────────────────────────────────

const DITLSceneCard: React.FC<{
  scene: DITLScene;
  index: number;
  platform: PlatformId;
  theme: Theme;
  style: "energetic" | "cinematic";
}> = ({ scene, index, platform, theme, style }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const safe = getSafeZone(platform);
  const anchor = getCaptionAnchor(platform);

  // photo pan: subtle Ken Burns — cinematic is slower
  const panSpeed = style === "cinematic" ? 0.15 : 0.3;
  const panY = interpolate(frame, [0, DITL_SCENE_F], [0, -height * 0.04 * panSpeed]);

  // caption entrance
  const captionEnter = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: SPRING.snappy,
  });

  const imageUrl =
    scene.imageUrl ??
    getStockImage(CATEGORIES[index % CATEGORIES.length], 1080, 1920, index + 1);

  // cinematic letterbox bars (top+bottom 60px for reels feel)
  const cinematic = style === "cinematic";

  // Use captionAnchor.top directly — getCaptionAnchor returns {top, height}
  const captionY = anchor.top;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      {/* Background photo with pan */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={imageUrl}
          style={{
            width: "100%",
            height: "110%",
            objectFit: "cover",
            transform: `translateY(${panY}px)`,
          }}
        />
        {/* Overlay gradient */}
        <AbsoluteFill
          style={{
            background: cinematic
              ? "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.7) 100%)"
              : "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.5) 100%)",
          }}
        />
        {/* Cinematic bars */}
        {cinematic && (
          <>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 60, backgroundColor: "#000" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, backgroundColor: "#000" }} />
          </>
        )}
      </AbsoluteFill>

      {/* Sparkles — energetic only */}
      {style === "energetic" && (
        <AnimatedSparkles
          count={8}
          color={theme.accent}
          startAt={10}
          seed={`ditl-${index}`}
        />
      )}

      {/* Timestamp sticker */}
      <div
        style={{
          position: "absolute",
          top: safe.top + 40,
          left: PORTRAIT_PADDING,
          transform: `scale(${spring({ frame: Math.max(0, frame - 5), fps, config: SPRING.bouncy })})`,
          transformOrigin: "top left",
        }}
      >
        <StickerBadge
          text={scene.time}
          color={theme.accent}
          textColor="#ffffff"
          rotation={style === "energetic" ? -6 : -2}
          enterAt={0}
          size="md"
        />
      </div>

      {/* Caption block */}
      <div
        style={{
          position: "absolute",
          left: PORTRAIT_PADDING,
          right: PORTRAIT_PADDING,
          top: captionY,
          transform: `translateY(${(1 - captionEnter) * 40}px)`,
          opacity: captionEnter,
        }}
      >
        <div
          style={{
            fontFamily: theme.fontFamily,
            fontWeight: theme.headingWeight,
            fontSize: PORTRAIT_TYPE.title,
            color: theme.textPrimary,
            lineHeight: 1.1,
            textShadow: "0 4px 20px rgba(0,0,0,0.8)",
          }}
        >
          {scene.label}
        </div>
        {scene.sublabel && (
          <div
            style={{
              marginTop: 12,
              fontFamily: theme.fontFamily,
              fontWeight: theme.bodyWeight,
              fontSize: PORTRAIT_TYPE.body,
              color: theme.textSecondary,
              textShadow: "0 2px 12px rgba(0,0,0,0.9)",
            }}
          >
            {scene.sublabel}
          </div>
        )}
      </div>

      {/* Scene counter dot row */}
      <div
        style={{
          position: "absolute",
          bottom: safe.bottom + 40,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {Array.from({ length: DITL_SCENES }, (_, i) => (
          <div
            key={i}
            style={{
              width: i === index ? 28 : 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: i === index ? theme.accent : "rgba(255,255,255,0.4)",
              transition: "width 0.3s",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── Main composition ───────────────────────────────────────────

export const DayInTheLife: React.FC<DayInTheLifeProps> = ({
  platform,
  theme,
  scenes = DEFAULT_SCENES,
  style = "energetic",
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {scenes.map((scene, i) => (
        <Sequence
          key={i}
          from={i * DITL_SCENE_F}
          durationInFrames={DITL_SCENE_F}
        >
          <DITLSceneCard
            scene={scene}
            index={i}
            platform={platform}
            theme={theme}
            style={style}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
