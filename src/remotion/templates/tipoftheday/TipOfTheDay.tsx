/**
 * Tip of the Day Template - Daily Tips for Social Media
 * 
 * A template for sharing daily tips, hacks, and quick advice.
 * Perfect for Instagram, TikTok, LinkedIn posts.
 * 
 * FORMATS:
 *   - Square 1:1 (1080x1080) - Instagram Feed, LinkedIn
 *   - Vertical 9:16 (1080x1920) - Stories, Reels
 * 
 * LAYOUT VARIANTS:
 *   "card"     - Tip in a floating card with icon
 *   "fullscreen" - Bold fullscreen tip with number
 *   "minimal"  - Clean typography-focused
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
const LightbulbIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </svg>
);

const SparklesIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="M19 13l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" opacity="0.6" />
    <path d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5L5 17z" opacity="0.4" />
  </svg>
);

const HashIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" />
    <line x1="16" y1="3" x2="14" y2="21" />
  </svg>
);

// ── Data Contract ───────────────────────────────────────────────
export interface TipOfTheDaySpec {
  tip_number?: number;
  category?: string;
  tip_title: string;
  tip_text: string;
  bonus_tip?: string;
  author_name?: string;
  author_handle?: string;
  hashtags?: string[];
  background_image?: string;
}

export interface TipOfTheDayProps {
  spec: TipOfTheDaySpec;
  theme?: Theme;
  layout?: "card" | "fullscreen" | "minimal";
  format?: "square" | "vertical";
}

// ── Timing Configuration ────────────────────────────────────────
const TIMING = {
  categoryStart: 0,
  titleStart: 15,
  tipStart: 35,
  bonusStart: 80,
  hashtagsStart: 110,
};

// ── Scaling Configuration ───────────────────────────────────────
// Centralized scaling for easy adjustment across all formats
const SCALE = {
  vertical: {
    padding: 50,
    // Card layout
    categoryIconSize: 36,
    categoryFontSize: 22,
    tipNumberSize: 84,
    cardPadding: "56px 48px",
    cardTitleSize: 48,
    cardTipTextSize: 32,
    bonusPadding: "20px 24px",
    bonusTitleSize: 18,
    bonusTipSize: 24,
    hashtagSize: 18,
    // Fullscreen layout
    bgNumberSize: 360,
    categoryBarHeight: 40,
    categoryTextSize: 24,
    fullTitleSize: 72,
    fullTipTextSize: 36,
    authorAvatarSize: 56,
    authorNameSize: 22,
    authorHandleSize: 18,
    // Minimal layout
    minimalIconSize: 44,
    minimalTipNumSize: 28,
    minimalTitleSize: 56,
    minimalDividerWidth: 80,
    minimalTipTextSize: 34,
  },
  square: {
    padding: 60,
    // Card layout
    categoryIconSize: 32,
    categoryFontSize: 20,
    tipNumberSize: 72,
    cardPadding: "48px 56px",
    cardTitleSize: 40,
    cardTipTextSize: 28,
    bonusPadding: "18px 22px",
    bonusTitleSize: 16,
    bonusTipSize: 22,
    hashtagSize: 16,
    // Fullscreen layout
    bgNumberSize: 280,
    categoryBarHeight: 36,
    categoryTextSize: 22,
    fullTitleSize: 56,
    fullTipTextSize: 32,
    authorAvatarSize: 52,
    authorNameSize: 20,
    authorHandleSize: 16,
    // Minimal layout
    minimalIconSize: 40,
    minimalTipNumSize: 26,
    minimalTitleSize: 48,
    minimalDividerWidth: 70,
    minimalTipTextSize: 30,
  },
};

// ── Main Component ──────────────────────────────────────────────
export const TipOfTheDay: React.FC<TipOfTheDayProps> = ({
  spec,
  theme = THEME_DARK,
  layout = "card",
  format = "square",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgStyle = theme.bg.startsWith("linear-gradient")
    ? { background: theme.bg }
    : { backgroundColor: theme.bg };

  if (layout === "fullscreen") {
    return <FullscreenLayout spec={spec} theme={theme} frame={frame} fps={fps} bgStyle={bgStyle} format={format} />;
  }
  if (layout === "minimal") {
    return <MinimalLayout spec={spec} theme={theme} frame={frame} fps={fps} bgStyle={bgStyle} format={format} />;
  }
  return <CardLayout spec={spec} theme={theme} frame={frame} fps={fps} bgStyle={bgStyle} format={format} />;
};

// ── Layout: Card ────────────────────────────────────────────────
const CardLayout: React.FC<{
  spec: TipOfTheDaySpec;
  theme: Theme;
  frame: number;
  fps: number;
  bgStyle: React.CSSProperties;
  format: string;
}> = ({ spec, theme, frame, fps, bgStyle, format }) => {
  const categorySpring = springEntrance(frame, fps, TIMING.categoryStart, SPRING.bouncy);
  const titleSpring = springEntrance(frame, fps, TIMING.titleStart, SPRING.default);
  const tipSpring = springEntrance(frame, fps, TIMING.tipStart, SPRING.gentle);
  const bonusOpacity = fadeIn(frame, TIMING.bonusStart);
  const hashtagsOpacity = fadeIn(frame, TIMING.hashtagsStart);

  const s = format === "vertical" ? SCALE.vertical : SCALE.square;

  return (
    <AbsoluteFill style={{ ...bgStyle, fontFamily: theme.fontFamily, color: theme.textPrimary }}>
      {spec.background_image && (
        <>
          <Img src={spec.background_image} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)" }} />
        </>
      )}

      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: `${s.padding}px`,
      }}>
        {/* Category badge */}
        {spec.category && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 28,
            opacity: categorySpring,
            transform: `scale(${0.8 + categorySpring * 0.2})`,
          }}>
            <LightbulbIcon color={theme.accent} size={s.categoryIconSize} />
            <span style={{
              fontSize: s.categoryFontSize,
              fontWeight: 600,
              color: theme.accent,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}>
              {spec.category}
            </span>
          </div>
        )}

        {/* Tip number */}
        {spec.tip_number && (
          <div style={{
            fontSize: s.tipNumberSize,
            fontWeight: 900,
            color: theme.accent,
            opacity: categorySpring * 0.3,
            marginBottom: 12,
          }}>
            #{spec.tip_number}
          </div>
        )}

        {/* Main card */}
        <div style={{
          background: theme.bgSecondary,
          border: `2px solid ${theme.cardBorder}`,
          borderRadius: 28,
          padding: s.cardPadding,
          maxWidth: format === "vertical" ? 950 : 900,
          textAlign: "center",
          opacity: tipSpring,
          transform: `translateY(${(1 - tipSpring) * 30}px)`,
          boxShadow: theme.cardShadow,
        }}>
          {/* Title */}
          <div style={{
            fontSize: s.cardTitleSize,
            fontWeight: theme.headingWeight,
            marginBottom: 24,
            opacity: titleSpring,
          }}>
            {spec.tip_title}
          </div>

          {/* Tip text */}
          <div style={{
            fontSize: s.cardTipTextSize,
            lineHeight: 1.45,
            color: theme.textSecondary,
          }}>
            {spec.tip_text}
          </div>

          {/* Bonus tip */}
          {spec.bonus_tip && (
            <div style={{
              marginTop: 28,
              padding: s.bonusPadding,
              background: `${theme.accent}15`,
              borderRadius: 14,
              opacity: bonusOpacity,
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                justifyContent: "center",
              }}>
                <SparklesIcon color={theme.accent} size={s.bonusTitleSize + 4} />
                <span style={{
                  fontSize: s.bonusTitleSize,
                  fontWeight: 600,
                  color: theme.accent,
                  textTransform: "uppercase",
                }}>
                  Bonus Tip
                </span>
              </div>
              <div style={{
                fontSize: s.bonusTipSize,
                color: theme.textPrimary,
                marginTop: 10,
              }}>
                {spec.bonus_tip}
              </div>
            </div>
          )}
        </div>

        {/* Hashtags */}
        {spec.hashtags && spec.hashtags.length > 0 && (
          <div style={{
            position: "absolute",
            bottom: s.padding,
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            justifyContent: "center",
            opacity: hashtagsOpacity,
          }}>
            {spec.hashtags.map((tag, i) => (
              <span key={i} style={{
                fontSize: s.hashtagSize,
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

// ── Layout: Fullscreen ──────────────────────────────────────────
const FullscreenLayout: React.FC<{
  spec: TipOfTheDaySpec;
  theme: Theme;
  frame: number;
  fps: number;
  bgStyle: React.CSSProperties;
  format: string;
}> = ({ spec, theme, frame, fps, bgStyle, format }) => {
  const numberSpring = springEntrance(frame, fps, TIMING.categoryStart, SPRING.bouncy);
  const titleSpring = springEntrance(frame, fps, TIMING.titleStart, SPRING.default);
  const tipSpring = springEntrance(frame, fps, TIMING.tipStart, SPRING.gentle);

  const s = format === "vertical" ? SCALE.vertical : SCALE.square;

  return (
    <AbsoluteFill style={{ ...bgStyle, fontFamily: theme.fontFamily, color: theme.textPrimary }}>
      {spec.background_image && (
        <>
          <Img src={spec.background_image} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)" }} />
        </>
      )}

      {/* Large number background */}
      {spec.tip_number && (
        <div style={{
          position: "absolute",
          top: format === "vertical" ? "8%" : "5%",
          right: format === "vertical" ? "5%" : "8%",
          fontSize: s.bgNumberSize,
          fontWeight: 900,
          color: theme.accent,
          opacity: numberSpring * 0.1,
          lineHeight: 1,
        }}>
          {spec.tip_number}
        </div>
      )}

      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: `${s.padding}px`,
      }}>
        {/* Category */}
        {spec.category && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 24,
            opacity: numberSpring,
          }}>
            <div style={{
              width: 5,
              height: s.categoryBarHeight,
              background: theme.accent,
              borderRadius: 3,
            }} />
            <span style={{
              fontSize: s.categoryTextSize,
              fontWeight: 600,
              color: theme.accent,
              textTransform: "uppercase",
              letterSpacing: 3,
            }}>
              {spec.category}
            </span>
          </div>
        )}

        {/* Title */}
        <div style={{
          fontSize: s.fullTitleSize,
          fontWeight: theme.headingWeight,
          lineHeight: 1.15,
          marginBottom: 36,
          opacity: titleSpring,
          transform: `translateX(${(1 - titleSpring) * -30}px)`,
        }}>
          {spec.tip_title}
        </div>

        {/* Tip text */}
        <div style={{
          fontSize: s.fullTipTextSize,
          lineHeight: 1.5,
          color: theme.textSecondary,
          maxWidth: format === "vertical" ? "100%" : "85%",
          opacity: tipSpring,
        }}>
          {spec.tip_text}
        </div>

        {/* Author */}
        {spec.author_name && (
          <div style={{
            marginTop: 52,
            opacity: tipSpring,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}>
            <div style={{
              width: s.authorAvatarSize,
              height: s.authorAvatarSize,
              borderRadius: "50%",
              background: theme.accentGradient.includes("gradient") ? theme.accentGradient : theme.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: s.authorAvatarSize * 0.4,
              fontWeight: 700,
              color: "#fff",
            }}>
              {spec.author_name.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: s.authorNameSize, fontWeight: 600 }}>{spec.author_name}</div>
              {spec.author_handle && (
                <div style={{ fontSize: s.authorHandleSize, color: theme.textMuted }}>{spec.author_handle}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ── Layout: Minimal ─────────────────────────────────────────────
const MinimalLayout: React.FC<{
  spec: TipOfTheDaySpec;
  theme: Theme;
  frame: number;
  fps: number;
  bgStyle: React.CSSProperties;
  format: string;
}> = ({ spec, theme, frame, fps, bgStyle, format }) => {
  const titleSpring = springEntrance(frame, fps, TIMING.titleStart, SPRING.gentle);
  const tipSpring = springEntrance(frame, fps, TIMING.tipStart, SPRING.gentle);

  const s = format === "vertical" ? SCALE.vertical : SCALE.square;

  return (
    <AbsoluteFill style={{ ...bgStyle, fontFamily: theme.fontFamily, color: theme.textPrimary }}>
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: `${s.padding}px`,
      }}>
        {/* Tip number with icon */}
        {spec.tip_number && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
            opacity: titleSpring,
          }}>
            <LightbulbIcon color={theme.accent} size={s.minimalIconSize} />
            <span style={{
              fontSize: s.minimalTipNumSize,
              fontWeight: 600,
              color: theme.textMuted,
            }}>
              Tip #{spec.tip_number}
            </span>
          </div>
        )}

        {/* Title */}
        <div style={{
          fontSize: s.minimalTitleSize,
          fontWeight: theme.headingWeight,
          lineHeight: 1.3,
          marginBottom: 24,
          opacity: titleSpring,
        }}>
          {spec.tip_title}
        </div>

        {/* Divider */}
        <div style={{
          width: s.minimalDividerWidth,
          height: 3,
          background: theme.accent,
          marginBottom: 24,
          opacity: tipSpring,
          transform: `scaleX(${tipSpring})`,
          transformOrigin: "left",
        }} />

        {/* Tip text */}
        <div style={{
          fontSize: s.minimalTipTextSize,
          lineHeight: 1.6,
          color: theme.textSecondary,
          opacity: tipSpring,
        }}>
          {spec.tip_text}
        </div>
      </div>
    </AbsoluteFill>
  );
};
