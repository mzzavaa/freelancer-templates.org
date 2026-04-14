/**
 * Aesthetic Quote — 1080×1920 portrait
 *
 * Slow-panning background image with a DM Serif / serif quote centred
 * on screen. One emphasis word gets WavyText treatment. Attribution sits
 * below the quote in a smaller serif style.
 *
 * Pan: Ken Burns-style horizontal drift across the image.
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
import type { PlatformId } from "../_shared/PlatformSafeZones";
import { getStockImage } from "../_shared/StockImages";
import { WavyText, AnimatedSparkles } from "../_shared/PlayfulElements";
import { SPRING } from "../_shared/animations";
import type { Theme } from "../_shared/themes";

// ── Constants ──────────────────────────────────────────────────

export const AQ_TOTAL_FRAMES = 240;

// ── Props ──────────────────────────────────────────────────────

export interface AestheticQuoteProps {
  platform: PlatformId;
  theme: Theme;
  /** Full quote text */
  quote?: string;
  /** Word within the quote to animate as WavyText (exact match) */
  emphasisWord?: string;
  attribution?: string;
  backgroundImageUrl?: string;
  /** "cream" = light, warm, editorial; "moody" = dark, atmospheric */
  style?: "cream" | "moody";
}

// ── Helpers ────────────────────────────────────────────────────

/** Splits the quote into parts around the emphasis word. */
function splitQuote(
  quote: string,
  emphasis: string
): { before: string; word: string; after: string } {
  const lower = quote.toLowerCase();
  const emphLower = emphasis.toLowerCase();
  const idx = lower.indexOf(emphLower);
  if (idx === -1) return { before: quote, word: "", after: "" };
  return {
    before: quote.slice(0, idx),
    word: quote.slice(idx, idx + emphasis.length),
    after: quote.slice(idx + emphasis.length),
  };
}

// ── Main composition ───────────────────────────────────────────

export const AestheticQuote: React.FC<AestheticQuoteProps> = ({
  theme,
  quote = "Create the life you can't stop thinking about",
  emphasisWord = "life",
  attribution = "— unknown",
  backgroundImageUrl,
  style = "cream",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const imageUrl =
    backgroundImageUrl ?? getStockImage("minimalist", 1080, 1920, 2);

  // Slow pan: 0→-3% horizontal, 0→-2% vertical across 240 frames
  const panX = interpolate(frame, [0, AQ_TOTAL_FRAMES], [0, -width * 0.03]);
  const panY = interpolate(frame, [0, AQ_TOTAL_FRAMES], [0, -height * 0.02]);

  // Overlay opacity — cream is lighter (shows more image), moody is darker
  const overlayOpacity = style === "cream" ? 0.55 : 0.72;

  // Text entrances
  const quoteEnter = spring({ frame: Math.max(0, frame - 20), fps, config: SPRING.gentle });
  const attrEnter  = spring({ frame: Math.max(0, frame - 50), fps, config: SPRING.gentle });

  const { before, word, after } = splitQuote(quote, emphasisWord ?? "");

  // Serif font: use theme fontFamily but override for cream (Merriweather)
  const serifFont =
    style === "cream"
      ? "'Merriweather', 'Georgia', serif"
      : theme.fontFamily;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      {/* Slow-panning background */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={imageUrl}
          style={{
            width: "110%",
            height: "110%",
            objectFit: "cover",
            transform: `translate(${panX}px, ${panY}px)`,
          }}
        />
        {/* Colour tone overlay */}
        <AbsoluteFill
          style={{
            backgroundColor:
              style === "cream"
                ? `rgba(254,252,243,${overlayOpacity})`
                : `rgba(2,8,23,${overlayOpacity})`,
          }}
        />
        {/* Vignette */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)",
          }}
        />
      </AbsoluteFill>

      {/* Subtle sparkles for moody variant */}
      {style === "moody" && (
        <AnimatedSparkles count={6} color={theme.accent} startAt={30} seed="aq-moody" />
      )}

      {/* Decorative top rule */}
      <div
        style={{
          position: "absolute",
          top: 280,
          left: PORTRAIT_PADDING + 40,
          right: PORTRAIT_PADDING + 40,
          height: 1,
          backgroundColor: style === "cream" ? theme.accent : "rgba(255,255,255,0.2)",
          opacity: quoteEnter,
        }}
      />

      {/* Quote block */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: PORTRAIT_PADDING,
          right: PORTRAIT_PADDING,
          transform: `translateY(calc(-50% + ${(1 - quoteEnter) * 60}px))`,
          opacity: quoteEnter,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: serifFont,
            fontWeight: style === "cream" ? 700 : theme.headingWeight,
            fontSize: PORTRAIT_TYPE.subtitle,
            color: theme.textPrimary,
            lineHeight: 1.35,
            letterSpacing: style === "cream" ? "0.01em" : "0.02em",
          }}
        >
          {/* Inline WavyText for emphasis word */}
          {word ? (
            <span>
              {before}
              <WavyText
                text={word}
                color={theme.accent}
                fontSize={PORTRAIT_TYPE.subtitle}
                amplitude={style === "cream" ? 6 : 14}
                speed={0.8}
              />
              {after}
            </span>
          ) : (
            <span>{quote}</span>
          )}
        </div>

        {/* Attribution */}
        <div
          style={{
            marginTop: 48,
            fontFamily: serifFont,
            fontWeight: 400,
            fontSize: PORTRAIT_TYPE.body,
            color: theme.textMuted,
            fontStyle: "italic",
            opacity: attrEnter,
            transform: `translateY(${(1 - attrEnter) * 20}px)`,
          }}
        >
          {attribution}
        </div>
      </div>

      {/* Decorative bottom rule */}
      <div
        style={{
          position: "absolute",
          bottom: 280,
          left: PORTRAIT_PADDING + 40,
          right: PORTRAIT_PADDING + 40,
          height: 1,
          backgroundColor: style === "cream" ? theme.accent : "rgba(255,255,255,0.2)",
          opacity: attrEnter,
        }}
      />
    </AbsoluteFill>
  );
};
