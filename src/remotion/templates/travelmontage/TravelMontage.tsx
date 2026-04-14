/**
 * Travel Montage — 1080×1920 portrait
 *
 * 8 location flashes (30 frames / 1s each) + 90-frame end card.
 * Each flash shows a travel stock photo with a country sticker badge
 * flying in. End card tallies "8 CITIES · 14 DAYS" over a final photo.
 *
 * Total: 8 × 30 + 90 = 330 frames (11s @ 30fps)
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
import { PORTRAIT_TYPE, PORTRAIT_PADDING, PORTRAIT_TOP_SAFE } from "../_shared/PortraitTypes";
import { getSafeZone, type PlatformId } from "../_shared/PlatformSafeZones";
import { getStockImage } from "../_shared/StockImages";
import {
  AnimatedSparkles,
  StickerBadge,
} from "../_shared/PlayfulElements";
import { SPRING } from "../_shared/animations";
import type { Theme } from "../_shared/themes";

// ── Constants ──────────────────────────────────────────────────

export const TM_FLASH_FRAMES = 30;
export const TM_LOCATION_COUNT = 8;
export const TM_END_CARD_FRAMES = 90;
export const TM_TOTAL_FRAMES = TM_FLASH_FRAMES * TM_LOCATION_COUNT + TM_END_CARD_FRAMES; // 330

// ── Default locations ──────────────────────────────────────────

export interface TravelLocation {
  city: string;
  country: string;
  imageUrl?: string;
}

export interface TravelMontageProps {
  platform: PlatformId;
  theme: Theme;
  locations?: TravelLocation[];
  tripSummary?: string;
  /** "filmgrain" = desaturated teal-orange; "sunset" = warm saturated */
  style?: "filmgrain" | "sunset";
}

const DEFAULT_LOCATIONS: TravelLocation[] = [
  { city: "Tokyo",    country: "🇯🇵" },
  { city: "Paris",    country: "🇫🇷" },
  { city: "New York", country: "🇺🇸" },
  { city: "Bali",     country: "🇮🇩" },
  { city: "London",   country: "🇬🇧" },
  { city: "Dubai",    country: "🇦🇪" },
  { city: "Rome",     country: "🇮🇹" },
  { city: "Sydney",   country: "🇦🇺" },
];

// ── Colour grade overlays ──────────────────────────────────────
// Achieved with a CSS mix-blend-mode overlay on top of the photo.

function gradeOverlay(style: "filmgrain" | "sunset"): React.CSSProperties {
  if (style === "filmgrain") {
    // Teal shadows + orange highlights (split-tone film look)
    return {
      background:
        "linear-gradient(180deg, rgba(0,60,80,0.25) 0%, rgba(0,0,0,0) 50%, rgba(80,40,0,0.2) 100%)",
      mixBlendMode: "multiply" as const,
    };
  }
  // Sunset: warm lift
  return {
    background:
      "linear-gradient(180deg, rgba(100,20,0,0.15) 0%, transparent 40%, rgba(255,120,0,0.2) 100%)",
    mixBlendMode: "screen" as const,
  };
}

// ── Flash card ─────────────────────────────────────────────────

const LocationFlash: React.FC<{
  location: TravelLocation;
  index: number;
  style: "filmgrain" | "sunset";
  theme: Theme;
}> = ({ location, index, style, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imageUrl =
    location.imageUrl ?? getStockImage("travel", 1080, 1920, index + 1);

  // Flash: quick zoom in at cut start, settle
  const zoomIn = spring({ frame, fps, config: { damping: 20, stiffness: 80 } });
  const scale = interpolate(zoomIn, [0, 1], [1.08, 1.0]);

  // Sticker enters with bounce
  const stickerEnter = spring({ frame: Math.max(0, frame - 3), fps, config: SPRING.bouncy });

  // Fade out at end of flash
  const opacity = interpolate(
    frame,
    [0, 4, TM_FLASH_FRAMES - 5, TM_FLASH_FRAMES],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={imageUrl}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }}
        />
        {/* Grade overlay */}
        <AbsoluteFill style={gradeOverlay(style)} />
        <AbsoluteFill style={{ background: "rgba(0,0,0,0.15)" }} />
      </AbsoluteFill>

      {/* Location sticker — alternates top-left / top-right */}
      <div
        style={{
          position: "absolute",
          top: PORTRAIT_TOP_SAFE + 20,
          ...(index % 2 === 0
            ? { left: PORTRAIT_PADDING }
            : { right: PORTRAIT_PADDING }),
          transform: `scale(${stickerEnter}) rotate(${index % 2 === 0 ? -5 : 5}deg)`,
          transformOrigin: index % 2 === 0 ? "top left" : "top right",
        }}
      >
        <StickerBadge
          text={`${location.country} ${location.city}`}
          color={theme.accent}
          textColor="#fff"
          rotation={0}
          enterAt={0}
          size="sm"
        />
      </div>

      {/* Flash number */}
      <div
        style={{
          position: "absolute",
          bottom: 320,
          right: PORTRAIT_PADDING,
          fontFamily: theme.fontFamily,
          fontWeight: 900,
          fontSize: PORTRAIT_TYPE.caption,
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.1em",
        }}
      >
        {String(index + 1).padStart(2, "0")} / {TM_LOCATION_COUNT}
      </div>
    </AbsoluteFill>
  );
};

// ── End card ───────────────────────────────────────────────────

const EndCard: React.FC<{
  tripSummary: string;
  locations: TravelLocation[];
  theme: Theme;
  style: "filmgrain" | "sunset";
  safe: ReturnType<typeof getSafeZone>;
}> = ({ tripSummary, locations, theme, style, safe }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imageUrl = getStockImage("sunset", 1080, 1920, 3);
  const titleEnter = spring({ frame: Math.max(0, frame - 10), fps, config: SPRING.gentle });
  const summaryEnter = spring({ frame: Math.max(0, frame - 25), fps, config: SPRING.snappy });
  const sparkleStart = 20;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={imageUrl}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <AbsoluteFill style={gradeOverlay(style)} />
        <AbsoluteFill style={{ background: "rgba(0,0,0,0.55)" }} />
      </AbsoluteFill>

      <AnimatedSparkles count={10} color={theme.accentSecondary} startAt={sparkleStart} seed="tm-end" />

      {/* Tally */}
      <div
        style={{
          position: "absolute",
          top: safe.top + 80,
          left: PORTRAIT_PADDING,
          right: PORTRAIT_PADDING,
          opacity: titleEnter,
          transform: `translateY(${(1 - titleEnter) * 50}px)`,
        }}
      >
        <div
          style={{
            fontFamily: theme.fontFamily,
            fontWeight: theme.bodyWeight,
            fontSize: PORTRAIT_TYPE.body,
            color: theme.textSecondary,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          wrapped up
        </div>
        <div
          style={{
            marginTop: 16,
            fontFamily: theme.fontFamily,
            fontWeight: 900,
            fontSize: PORTRAIT_TYPE.hero,
            color: theme.textPrimary,
            lineHeight: 1.0,
          }}
        >
          {tripSummary}
        </div>
      </div>

      {/* City list */}
      <div
        style={{
          position: "absolute",
          bottom: safe.bottom + 80,
          left: PORTRAIT_PADDING,
          right: PORTRAIT_PADDING,
          opacity: summaryEnter,
          transform: `translateY(${(1 - summaryEnter) * 30}px)`,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        {locations.map((loc, i) => (
          <div
            key={i}
            style={{
              fontFamily: theme.fontFamily,
              fontWeight: 700,
              fontSize: PORTRAIT_TYPE.label,
              color: theme.accent,
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: "6px 16px",
              borderRadius: 8,
              border: `2px solid ${theme.cardBorder}`,
            }}
          >
            {loc.country} {loc.city}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── Main composition ───────────────────────────────────────────

export const TravelMontage: React.FC<TravelMontageProps> = ({
  platform,
  theme,
  locations = DEFAULT_LOCATIONS,
  tripSummary = "8 CITIES · 14 DAYS",
  style = "filmgrain",
}) => {
  const safe = getSafeZone(platform);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {locations.map((loc, i) => (
        <Sequence key={i} from={i * TM_FLASH_FRAMES} durationInFrames={TM_FLASH_FRAMES}>
          <LocationFlash location={loc} index={i} style={style} theme={theme} />
        </Sequence>
      ))}
      <Sequence from={TM_LOCATION_COUNT * TM_FLASH_FRAMES} durationInFrames={TM_END_CARD_FRAMES}>
        <EndCard
          tripSummary={tripSummary}
          locations={locations}
          theme={theme}
          style={style}
          safe={safe}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
