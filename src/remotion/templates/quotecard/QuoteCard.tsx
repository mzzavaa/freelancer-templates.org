/**
 * Quote Card Template - Social Media Quote Graphics
 * 
 * A template for inspirational quotes, tips, and text-based content.
 * Perfect for Instagram, LinkedIn, Twitter/X posts.
 * 
 * FORMATS:
 *   - Square 1:1 (1080x1080) - Instagram Feed, LinkedIn
 *   - Vertical 9:16 (1080x1920) - Stories, Reels
 *   - Landscape 16:9 (1920x1080) - Twitter, YouTube thumbnails
 * 
 * LAYOUT VARIANTS:
 *   "centered"  - Quote centered with decorative elements
 *   "minimal"   - Clean, typography-focused
 *   "bold"      - Large text with accent background
 */

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from "remotion";
import {
  springEntrance,
  fadeIn,
  SPRING,
} from "../_shared/animations";
import type { Theme } from "../_shared/themes";
import { THEME_DARK } from "../_shared/themes";

// ── SVG Icons ───────────────────────────────────────────────────
const QuoteIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} opacity={0.3}>
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
);

const SparkleIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5L12 0z" />
  </svg>
);

// ── Data Contract ───────────────────────────────────────────────
export interface QuoteCardSpec {
  quote: string;
  author?: string;
  author_title?: string;
  source?: string;
  hashtags?: string[];
  background_image?: string;
}

export interface QuoteCardProps {
  spec: QuoteCardSpec;
  theme?: Theme;
  layout?: "centered" | "minimal" | "bold";
  format?: "square" | "vertical" | "landscape";
}

// ── Timing Configuration ────────────────────────────────────────
const TIMING = {
  quoteStart: 10,
  authorStart: 50,
  hashtagsStart: 80,
};

// ── Main Component ──────────────────────────────────────────────
export const QuoteCard: React.FC<QuoteCardProps> = ({
  spec,
  theme = THEME_DARK,
  layout = "centered",
  format = "square",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgStyle = theme.bg.startsWith("linear-gradient")
    ? { background: theme.bg }
    : { backgroundColor: theme.bg };

  if (layout === "minimal") {
    return <MinimalLayout spec={spec} theme={theme} frame={frame} fps={fps} bgStyle={bgStyle} format={format} />;
  }
  if (layout === "bold") {
    return <BoldLayout spec={spec} theme={theme} frame={frame} fps={fps} bgStyle={bgStyle} format={format} />;
  }
  return <CenteredLayout spec={spec} theme={theme} frame={frame} fps={fps} bgStyle={bgStyle} format={format} />;
};

// ── Layout: Centered ────────────────────────────────────────────
const CenteredLayout: React.FC<{
  spec: QuoteCardSpec;
  theme: Theme;
  frame: number;
  fps: number;
  bgStyle: React.CSSProperties;
  format: string;
}> = ({ spec, theme, frame, fps, bgStyle, format }) => {
  const quoteSpring = springEntrance(frame, fps, TIMING.quoteStart, SPRING.gentle);
  const authorOpacity = fadeIn(frame, TIMING.authorStart);
  const hashtagsOpacity = fadeIn(frame, TIMING.hashtagsStart);

  const isVertical = format === "vertical";
  const isLandscape = format === "landscape";
  const padding = isVertical ? 60 : isLandscape ? 100 : 80;
  const quoteSize = isVertical ? 42 : isLandscape ? 48 : 38;

  return (
    <AbsoluteFill style={{ ...bgStyle, fontFamily: theme.fontFamily, color: theme.textPrimary }}>
      {spec.background_image && (
        <>
          <Img src={spec.background_image} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)" }} />
        </>
      )}

      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: `${padding}px`,
        textAlign: "center",
      }}>
        {/* Quote icon */}
        <div style={{
          opacity: quoteSpring * 0.5,
          marginBottom: 20,
        }}>
          <QuoteIcon color={theme.accent} size={isVertical ? 64 : 48} />
        </div>

        {/* Quote text */}
        <div style={{
          fontSize: quoteSize,
          fontWeight: theme.headingWeight,
          lineHeight: 1.4,
          opacity: quoteSpring,
          transform: `scale(${0.95 + quoteSpring * 0.05})`,
          maxWidth: isLandscape ? 1200 : 900,
        }}>
          {spec.quote}
        </div>

        {/* Decorative line */}
        <div style={{
          width: 60,
          height: 3,
          background: theme.accent,
          marginTop: 32,
          marginBottom: 24,
          opacity: authorOpacity,
          transform: `scaleX(${authorOpacity})`,
        }} />

        {/* Author */}
        {spec.author && (
          <div style={{
            opacity: authorOpacity,
          }}>
            <div style={{
              fontSize: isVertical ? 24 : 20,
              fontWeight: 600,
              color: theme.textPrimary,
            }}>
              {spec.author}
            </div>
            {spec.author_title && (
              <div style={{
                fontSize: isVertical ? 18 : 16,
                color: theme.textSecondary,
                marginTop: 4,
              }}>
                {spec.author_title}
              </div>
            )}
          </div>
        )}

        {/* Hashtags */}
        {spec.hashtags && spec.hashtags.length > 0 && (
          <div style={{
            position: "absolute",
            bottom: padding,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
            opacity: hashtagsOpacity,
          }}>
            {spec.hashtags.map((tag, i) => (
              <span key={i} style={{
                fontSize: 14,
                color: theme.accent,
                fontWeight: 500,
              }}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ── Layout: Minimal ─────────────────────────────────────────────
const MinimalLayout: React.FC<{
  spec: QuoteCardSpec;
  theme: Theme;
  frame: number;
  fps: number;
  bgStyle: React.CSSProperties;
  format: string;
}> = ({ spec, theme, frame, fps, bgStyle, format }) => {
  const quoteSpring = springEntrance(frame, fps, TIMING.quoteStart, SPRING.gentle);
  const authorOpacity = fadeIn(frame, TIMING.authorStart);

  const isVertical = format === "vertical";
  const isLandscape = format === "landscape";
  const padding = isVertical ? 80 : isLandscape ? 120 : 100;
  const quoteSize = isVertical ? 36 : isLandscape ? 42 : 32;

  return (
    <AbsoluteFill style={{ ...bgStyle, fontFamily: theme.fontFamily, color: theme.textPrimary }}>
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: `${padding}px`,
      }}>
        {/* Quote text - left aligned */}
        <div style={{
          fontSize: quoteSize,
          fontWeight: theme.headingWeight,
          lineHeight: 1.5,
          opacity: quoteSpring,
          fontStyle: "italic",
        }}>
          &ldquo;{spec.quote}&rdquo;
        </div>

        {/* Author - simple */}
        {spec.author && (
          <div style={{
            marginTop: 40,
            opacity: authorOpacity,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            <div style={{
              width: 40,
              height: 2,
              background: theme.accent,
            }} />
            <span style={{
              fontSize: isVertical ? 20 : 18,
              fontWeight: 500,
              color: theme.textSecondary,
            }}>
              {spec.author}
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ── Layout: Bold ────────────────────────────────────────────────
const BoldLayout: React.FC<{
  spec: QuoteCardSpec;
  theme: Theme;
  frame: number;
  fps: number;
  bgStyle: React.CSSProperties;
  format: string;
}> = ({ spec, theme, frame, fps, bgStyle, format }) => {
  const quoteSpring = springEntrance(frame, fps, TIMING.quoteStart, SPRING.bouncy);
  const authorOpacity = fadeIn(frame, TIMING.authorStart);

  const isVertical = format === "vertical";
  const isLandscape = format === "landscape";
  const quoteSize = isVertical ? 52 : isLandscape ? 56 : 44;

  return (
    <AbsoluteFill style={{ ...bgStyle, fontFamily: theme.fontFamily }}>
      {/* Accent background block */}
      <div style={{
        position: "absolute",
        top: isVertical ? "15%" : "20%",
        left: "5%",
        right: "5%",
        bottom: isVertical ? "25%" : "20%",
        background: theme.accentGradient.includes("gradient") ? theme.accentGradient : theme.accent,
        borderRadius: 24,
        opacity: quoteSpring,
        transform: `scale(${0.9 + quoteSpring * 0.1})`,
      }} />

      {/* Sparkle decorations */}
      <div style={{
        position: "absolute",
        top: isVertical ? "12%" : "15%",
        right: "10%",
        opacity: quoteSpring * 0.6,
      }}>
        <SparkleIcon color="#fff" size={32} />
      </div>
      <div style={{
        position: "absolute",
        bottom: isVertical ? "22%" : "15%",
        left: "8%",
        opacity: quoteSpring * 0.4,
      }}>
        <SparkleIcon color="#fff" size={24} />
      </div>

      {/* Content */}
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: isVertical ? 80 : 100,
        textAlign: "center",
      }}>
        {/* Quote */}
        <div style={{
          fontSize: quoteSize,
          fontWeight: 900,
          lineHeight: 1.3,
          color: "#fff",
          opacity: quoteSpring,
          textShadow: "0 2px 20px rgba(0,0,0,0.3)",
        }}>
          {spec.quote}
        </div>

        {/* Author */}
        {spec.author && (
          <div style={{
            marginTop: 40,
            opacity: authorOpacity,
            color: "rgba(255,255,255,0.9)",
            fontSize: isVertical ? 22 : 20,
            fontWeight: 600,
          }}>
            - {spec.author}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
