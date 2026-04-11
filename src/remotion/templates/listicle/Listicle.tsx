/**
 * Listicle Template - Content Creator Video Format
 * 
 * A vertical (9:16) template for "5 Things to Know" style content.
 * Perfect for Instagram Reels, TikTok, YouTube Shorts.
 * 
 * USAGE:
 *   <Listicle {...props} />
 * 
 * FORMATS:
 *   - Vertical 9:16 (1080x1920) - Stories, Reels, Shorts
 *   - Square 1:1 (1080x1080) - Instagram Feed
 * 
 * LAYOUT VARIANTS:
 *   "stack"    - Items stack vertically with numbers (default)
 *   "cards"    - Items appear as animated cards
 *   "reveal"   - Items reveal one by one with transitions
 */

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";
import {
  springEntrance,
  fadeIn,
  slideIn,
  SPRING,
} from "../_shared/animations";
import type { Theme } from "../_shared/themes";
import { THEME_DARK } from "../_shared/themes";

// ── SVG Icons ───────────────────────────────────────────────────
const CheckIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const StarIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ArrowIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const LightbulbIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </svg>
);

// ── Data Contract ───────────────────────────────────────────────
export interface ListicleItem {
  text: string;
  subtext?: string;
  icon?: "check" | "star" | "arrow" | "lightbulb" | "number";
}

export interface ListicleSpec {
  title: string;
  subtitle?: string;
  items: ListicleItem[];
  cta_text?: string;
  author_name?: string;
  author_handle?: string;
  background_image?: string;
}

export interface ListicleProps {
  spec: ListicleSpec;
  theme?: Theme;
  layout?: "stack" | "cards" | "reveal";
  format?: "vertical" | "square";
}

// ── Timing Configuration ────────────────────────────────────────
const TIMING = {
  titleStart: 0,
  subtitleStart: 15,
  itemBaseStart: 40,
  itemStagger: 35,
  ctaStart: 200,
};

// ── Scaling Configuration ───────────────────────────────────────
// Centralized scaling for easy adjustment across all formats
// Portrait (9:16) needs larger elements for mobile readability
// Square (1:1) needs balanced scaling for feed posts
const SCALE = {
  vertical: {
    // Padding & Layout
    padding: 50,
    paddingTop: 80,
    // Title
    titleSize: 72,
    subtitleSize: 32,
    // Items
    itemTextSize: 42,
    itemSubtextSize: 26,
    itemGap: 32,
    itemIconSize: 44,
    // Cards layout
    cardPadding: "28px 32px",
    cardTextSize: 34,
    cardIconSize: 38,
    // Reveal layout
    revealTitleSize: 48,
    revealNumberSize: 120,
    revealTextSize: 56,
    revealSubtextSize: 32,
    // CTA
    ctaPadding: "20px 40px",
    ctaFontSize: 28,
    // Author
    authorFontSize: 22,
  },
  square: {
    // Padding & Layout
    padding: 50,
    paddingTop: 50,
    // Title
    titleSize: 56,
    subtitleSize: 26,
    // Items
    itemTextSize: 34,
    itemSubtextSize: 22,
    itemGap: 24,
    itemIconSize: 36,
    // Cards layout
    cardPadding: "22px 26px",
    cardTextSize: 28,
    cardIconSize: 32,
    // Reveal layout
    revealTitleSize: 36,
    revealNumberSize: 100,
    revealTextSize: 44,
    revealSubtextSize: 26,
    // CTA
    ctaPadding: "16px 32px",
    ctaFontSize: 24,
    // Author
    authorFontSize: 18,
  },
};

// ── Main Component ──────────────────────────────────────────────
export const Listicle: React.FC<ListicleProps> = ({
  spec,
  theme = THEME_DARK,
  layout = "stack",
  format = "vertical",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgStyle = theme.bg.startsWith("linear-gradient")
    ? { background: theme.bg }
    : { backgroundColor: theme.bg };

  const dimensions = format === "vertical" 
    ? { width: 1080, height: 1920 }
    : { width: 1080, height: 1080 };

  if (layout === "cards") {
    return <CardsLayout spec={spec} theme={theme} frame={frame} fps={fps} bgStyle={bgStyle} format={format} />;
  }
  if (layout === "reveal") {
    return <RevealLayout spec={spec} theme={theme} frame={frame} fps={fps} bgStyle={bgStyle} format={format} />;
  }
  return <StackLayout spec={spec} theme={theme} frame={frame} fps={fps} bgStyle={bgStyle} format={format} />;
};

// ── Icon Renderer ───────────────────────────────────────────────
const renderIcon = (icon: ListicleItem["icon"], index: number, color: string, size: number = 28) => {
  switch (icon) {
    case "check": return <CheckIcon color={color} size={size} />;
    case "star": return <StarIcon color={color} size={size} />;
    case "arrow": return <ArrowIcon color={color} size={size} />;
    case "lightbulb": return <LightbulbIcon color={color} size={size} />;
    case "number":
    default:
      return (
        <div style={{
          width: size + 8,
          height: size + 8,
          borderRadius: "50%",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.6,
          fontWeight: 800,
          color: "#fff",
        }}>
          {index + 1}
        </div>
      );
  }
};

// ── Layout: Stack ───────────────────────────────────────────────
const StackLayout: React.FC<{
  spec: ListicleSpec;
  theme: Theme;
  frame: number;
  fps: number;
  bgStyle: React.CSSProperties;
  format: string;
}> = ({ spec, theme, frame, fps, bgStyle, format }) => {
  const titleSpring = springEntrance(frame, fps, TIMING.titleStart, SPRING.default);
  const subtitleOpacity = fadeIn(frame, TIMING.subtitleStart);
  const ctaOpacity = fadeIn(frame, TIMING.ctaStart);

  const s = format === "vertical" ? SCALE.vertical : SCALE.square;

  return (
    <AbsoluteFill style={{ ...bgStyle, fontFamily: theme.fontFamily, color: theme.textPrimary }}>
      {/* Background overlay for image */}
      {spec.background_image && (
        <>
          <Img src={spec.background_image} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />
        </>
      )}

      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        padding: `${s.padding}px`,
        paddingTop: s.paddingTop,
      }}>
        {/* Title */}
        <div style={{
          fontSize: s.titleSize,
          fontWeight: theme.headingWeight,
          lineHeight: 1.15,
          opacity: titleSpring,
          transform: `translateY(${slideIn(titleSpring, "up", 30)}px)`,
          marginBottom: 16,
        }}>
          {spec.title}
        </div>

        {/* Subtitle */}
        {spec.subtitle && (
          <div style={{
            fontSize: s.subtitleSize,
            color: theme.textSecondary,
            opacity: subtitleOpacity,
            marginBottom: 36,
          }}>
            {spec.subtitle}
          </div>
        )}

        {/* Items */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: s.itemGap, justifyContent: "center" }}>
          {spec.items.map((item, index) => {
            const itemStart = TIMING.itemBaseStart + (index * TIMING.itemStagger);
            const itemSpring = springEntrance(frame, fps, itemStart, SPRING.default);
            
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 24,
                  opacity: itemSpring,
                  transform: `translateX(${slideIn(itemSpring, "left", 40)}px)`,
                }}
              >
                {renderIcon(item.icon || "number", index, theme.accent, s.itemIconSize)}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: s.itemTextSize,
                    fontWeight: 600,
                    lineHeight: 1.25,
                  }}>
                    {item.text}
                  </div>
                  {item.subtext && (
                    <div style={{
                      fontSize: s.itemSubtextSize,
                      color: theme.textSecondary,
                      marginTop: 8,
                    }}>
                      {item.subtext}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        {spec.cta_text && (
          <div style={{
            marginTop: 36,
            opacity: ctaOpacity,
            display: "flex",
            justifyContent: "center",
          }}>
            <div style={{
              padding: s.ctaPadding,
              background: theme.accentGradient.includes("gradient") ? theme.accentGradient : theme.accent,
              borderRadius: 14,
              fontSize: s.ctaFontSize,
              fontWeight: 700,
              color: "#fff",
            }}>
              {spec.cta_text}
            </div>
          </div>
        )}

        {/* Author */}
        {spec.author_name && (
          <div style={{
            marginTop: 20,
            opacity: ctaOpacity,
            textAlign: "center",
            fontSize: s.authorFontSize,
            color: theme.textMuted,
          }}>
            {spec.author_name}
            {spec.author_handle && ` ${spec.author_handle}`}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ── Layout: Cards ───────────────────────────────────────────────
const CardsLayout: React.FC<{
  spec: ListicleSpec;
  theme: Theme;
  frame: number;
  fps: number;
  bgStyle: React.CSSProperties;
  format: string;
}> = ({ spec, theme, frame, fps, bgStyle, format }) => {
  const titleSpring = springEntrance(frame, fps, TIMING.titleStart, SPRING.default);
  const ctaOpacity = fadeIn(frame, TIMING.ctaStart);

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
        padding: `${s.padding}px`,
        paddingTop: s.paddingTop,
      }}>
        {/* Title */}
        <div style={{
          fontSize: s.titleSize,
          fontWeight: theme.headingWeight,
          textAlign: "center",
          opacity: titleSpring,
          transform: `scale(${0.8 + titleSpring * 0.2})`,
          marginBottom: 36,
        }}>
          {spec.title}
        </div>

        {/* Cards Grid */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: s.itemGap,
          justifyContent: "center",
        }}>
          {spec.items.map((item, index) => {
            const itemStart = TIMING.itemBaseStart + (index * TIMING.itemStagger);
            const itemSpring = springEntrance(frame, fps, itemStart, SPRING.bouncy);
            
            return (
              <div
                key={index}
                style={{
                  background: theme.bgSecondary,
                  border: `2px solid ${theme.cardBorder}`,
                  borderRadius: 18,
                  padding: s.cardPadding,
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                  opacity: itemSpring,
                  transform: `translateY(${(1 - itemSpring) * 50}px) scale(${0.9 + itemSpring * 0.1})`,
                }}
              >
                {renderIcon(item.icon || "number", index, theme.accent, s.cardIconSize)}
                <div style={{
                  fontSize: s.cardTextSize,
                  fontWeight: 600,
                  flex: 1,
                }}>
                  {item.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        {spec.cta_text && (
          <div style={{
            marginTop: 32,
            opacity: ctaOpacity,
            textAlign: "center",
          }}>
            <div style={{
              display: "inline-block",
              padding: s.ctaPadding,
              background: theme.accent,
              borderRadius: 12,
              fontSize: s.ctaFontSize,
              fontWeight: 700,
              color: "#fff",
            }}>
              {spec.cta_text}
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ── Layout: Reveal ──────────────────────────────────────────────
const RevealLayout: React.FC<{
  spec: ListicleSpec;
  theme: Theme;
  frame: number;
  fps: number;
  bgStyle: React.CSSProperties;
  format: string;
}> = ({ spec, theme, frame, fps, bgStyle, format }) => {
  const s = format === "vertical" ? SCALE.vertical : SCALE.square;
  const itemDuration = 50;
  
  // Calculate which item is currently showing
  const currentItemIndex = Math.floor((frame - TIMING.itemBaseStart) / itemDuration);
  const itemProgress = ((frame - TIMING.itemBaseStart) % itemDuration) / itemDuration;

  const titleSpring = springEntrance(frame, fps, TIMING.titleStart, SPRING.default);

  return (
    <AbsoluteFill style={{ ...bgStyle, fontFamily: theme.fontFamily, color: theme.textPrimary }}>
      {spec.background_image && (
        <>
          <Img src={spec.background_image} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)" }} />
        </>
      )}

      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: s.padding,
        textAlign: "center",
      }}>
        {/* Title - always visible */}
        <div style={{
          fontSize: s.revealTitleSize,
          fontWeight: 600,
          color: theme.textSecondary,
          opacity: titleSpring,
          marginBottom: 28,
        }}>
          {spec.title}
        </div>

        {/* Current Item */}
        {currentItemIndex >= 0 && currentItemIndex < spec.items.length && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
          }}>
            {/* Number indicator */}
            <div style={{
              width: s.revealNumberSize,
              height: s.revealNumberSize,
              borderRadius: "50%",
              background: theme.accentGradient.includes("gradient") ? theme.accentGradient : theme.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: s.revealNumberSize * 0.5,
              fontWeight: 900,
              color: "#fff",
              transform: `scale(${0.5 + Math.min(itemProgress * 2, 1) * 0.5})`,
              opacity: Math.min(itemProgress * 3, 1),
            }}>
              {currentItemIndex + 1}
            </div>

            {/* Item text */}
            <div style={{
              fontSize: s.revealTextSize,
              fontWeight: theme.headingWeight,
              lineHeight: 1.25,
              maxWidth: format === "vertical" ? 950 : 900,
              opacity: Math.min((itemProgress - 0.2) * 2, 1),
              transform: `translateY(${Math.max(0, (1 - itemProgress * 2)) * 30}px)`,
            }}>
              {spec.items[currentItemIndex].text}
            </div>

            {/* Subtext */}
            {spec.items[currentItemIndex].subtext && (
              <div style={{
                fontSize: s.revealSubtextSize,
                color: theme.textSecondary,
                opacity: Math.min((itemProgress - 0.4) * 2, 1),
              }}>
                {spec.items[currentItemIndex].subtext}
              </div>
            )}
          </div>
        )}

        {/* Progress dots */}
        <div style={{
          position: "absolute",
          bottom: format === "vertical" ? 100 : 70,
          display: "flex",
          gap: 14,
        }}>
          {spec.items.map((_, index) => (
            <div
              key={index}
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: index <= currentItemIndex ? theme.accent : theme.cardBorder,
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
