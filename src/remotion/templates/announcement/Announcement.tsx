/**
 * Announcement Template - Big News & Updates
 * 
 * A template for announcements, launches, and important updates.
 * Perfect for Instagram, LinkedIn, Twitter/X posts.
 * 
 * FORMATS:
 *   - Square 1:1 (1080x1080) - Instagram Feed, LinkedIn
 *   - Vertical 9:16 (1080x1920) - Stories, Reels
 * 
 * LAYOUT VARIANTS:
 *   "banner"   - Bold banner with large text
 *   "card"     - Announcement in a styled card
 *   "minimal"  - Clean, professional look
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
const MegaphoneIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 11 18-5v12L3 13v-2z" />
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </svg>
);

const SparkleIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5L12 0z" />
  </svg>
);

const RocketIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const PartyIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5.8 11.3 2 22l10.7-3.79" />
    <path d="M4 3h.01" />
    <path d="M22 8h.01" />
    <path d="M15 2h.01" />
    <path d="M22 20h.01" />
    <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" />
    <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17" />
    <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7" />
    <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z" />
  </svg>
);

// ── Data Contract ───────────────────────────────────────────────
export interface AnnouncementSpec {
  badge_text?: string;
  headline: string;
  subheadline?: string;
  details?: string;
  cta_text?: string;
  cta_url?: string;
  date?: string;
  icon_type?: "megaphone" | "rocket" | "party" | "sparkle";
  background_image?: string;
}

export interface AnnouncementProps {
  spec: AnnouncementSpec;
  theme?: Theme;
  layout?: "banner" | "card" | "minimal";
  format?: "square" | "vertical";
}

// ── Timing Configuration ────────────────────────────────────────
const TIMING = {
  badgeStart: 0,
  headlineStart: 15,
  subheadlineStart: 40,
  detailsStart: 60,
  ctaStart: 90,
};

// ── Scaling Configuration ───────────────────────────────────────
// Centralized scaling for easy adjustment across all formats
const SCALE = {
  vertical: {
    padding: 50,
    // Banner layout
    sparkleSize1: 36,
    sparkleSize2: 28,
    sparkleSize3: 24,
    badgePadding: "14px 28px",
    badgeIconSize: 28,
    badgeFontSize: 20,
    headlineSize: 72,
    subheadlineSize: 32,
    dateSize: 20,
    ctaPadding: "20px 44px",
    ctaFontSize: 24,
    // Card layout
    cardPadding: "60px 52px",
    cardIconContainerSize: 88,
    cardIconSize: 44,
    cardBadgePadding: "10px 22px",
    cardBadgeFontSize: 16,
    cardHeadlineSize: 48,
    cardSubheadlineSize: 26,
    cardDetailsSize: 18,
    cardCtaPadding: "16px 36px",
    cardCtaFontSize: 20,
    // Minimal layout
    badgeBarHeight: 44,
    minimalBadgeFontSize: 20,
    minimalHeadlineSize: 58,
    minimalSubheadlineSize: 30,
    minimalDateSize: 18,
    minimalCtaSize: 18,
  },
  square: {
    padding: 60,
    // Banner layout
    sparkleSize1: 32,
    sparkleSize2: 24,
    sparkleSize3: 20,
    badgePadding: "12px 24px",
    badgeIconSize: 24,
    badgeFontSize: 18,
    headlineSize: 56,
    subheadlineSize: 26,
    dateSize: 18,
    ctaPadding: "18px 40px",
    ctaFontSize: 22,
    // Card layout
    cardPadding: "52px 60px",
    cardIconContainerSize: 80,
    cardIconSize: 40,
    cardBadgePadding: "8px 20px",
    cardBadgeFontSize: 14,
    cardHeadlineSize: 40,
    cardSubheadlineSize: 22,
    cardDetailsSize: 16,
    cardCtaPadding: "14px 32px",
    cardCtaFontSize: 18,
    // Minimal layout
    badgeBarHeight: 40,
    minimalBadgeFontSize: 18,
    minimalHeadlineSize: 50,
    minimalSubheadlineSize: 26,
    minimalDateSize: 16,
    minimalCtaSize: 16,
  },
};

// ── Icon Renderer ───────────────────────────────────────────────
const renderIcon = (type: AnnouncementSpec["icon_type"], color: string, size: number) => {
  switch (type) {
    case "rocket": return <RocketIcon color={color} size={size} />;
    case "party": return <PartyIcon color={color} size={size} />;
    case "sparkle": return <SparkleIcon color={color} size={size} />;
    case "megaphone":
    default: return <MegaphoneIcon color={color} size={size} />;
  }
};

// ── Main Component ──────────────────────────────────────────────
export const Announcement: React.FC<AnnouncementProps> = ({
  spec,
  theme = THEME_DARK,
  layout = "banner",
  format = "square",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgStyle = theme.bg.startsWith("linear-gradient")
    ? { background: theme.bg }
    : { backgroundColor: theme.bg };

  if (layout === "card") {
    return <CardLayout spec={spec} theme={theme} frame={frame} fps={fps} bgStyle={bgStyle} format={format} />;
  }
  if (layout === "minimal") {
    return <MinimalLayout spec={spec} theme={theme} frame={frame} fps={fps} bgStyle={bgStyle} format={format} />;
  }
  return <BannerLayout spec={spec} theme={theme} frame={frame} fps={fps} bgStyle={bgStyle} format={format} />;
};

// ── Layout: Banner ──────────────────────────────────────────────
const BannerLayout: React.FC<{
  spec: AnnouncementSpec;
  theme: Theme;
  frame: number;
  fps: number;
  bgStyle: React.CSSProperties;
  format: string;
}> = ({ spec, theme, frame, fps, bgStyle, format }) => {
  const badgeSpring = springEntrance(frame, fps, TIMING.badgeStart, SPRING.bouncy);
  const headlineSpring = springEntrance(frame, fps, TIMING.headlineStart, SPRING.default);
  const subheadlineOpacity = fadeIn(frame, TIMING.subheadlineStart);
  const ctaSpring = springEntrance(frame, fps, TIMING.ctaStart, SPRING.bouncy);

  const s = format === "vertical" ? SCALE.vertical : SCALE.square;

  return (
    <AbsoluteFill style={{ ...bgStyle, fontFamily: theme.fontFamily, color: theme.textPrimary }}>
      {spec.background_image && (
        <>
          <Img src={spec.background_image} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)" }} />
        </>
      )}

      {/* Decorative sparkles */}
      <div style={{
        position: "absolute",
        top: "15%",
        left: "10%",
        opacity: badgeSpring * 0.5,
        transform: `rotate(${frame * 2}deg)`,
      }}>
        <SparkleIcon color={theme.accent} size={s.sparkleSize1} />
      </div>
      <div style={{
        position: "absolute",
        top: "25%",
        right: "15%",
        opacity: badgeSpring * 0.3,
        transform: `rotate(${-frame * 1.5}deg)`,
      }}>
        <SparkleIcon color={theme.accentSecondary} size={s.sparkleSize2} />
      </div>
      <div style={{
        position: "absolute",
        bottom: "30%",
        left: "20%",
        opacity: badgeSpring * 0.4,
        transform: `rotate(${frame}deg)`,
      }}>
        <SparkleIcon color={theme.accent} size={s.sparkleSize3} />
      </div>

      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: `${s.padding}px`,
        textAlign: "center",
      }}>
        {/* Badge */}
        {spec.badge_text && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: s.badgePadding,
            background: theme.accentGradient.includes("gradient") ? theme.accentGradient : theme.accent,
            borderRadius: 100,
            marginBottom: 32,
            opacity: badgeSpring,
            transform: `scale(${0.8 + badgeSpring * 0.2})`,
          }}>
            {renderIcon(spec.icon_type, "#fff", s.badgeIconSize)}
            <span style={{
              fontSize: s.badgeFontSize,
              fontWeight: 700,
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: 2,
            }}>
              {spec.badge_text}
            </span>
          </div>
        )}

        {/* Headline */}
        <div style={{
          fontSize: s.headlineSize,
          fontWeight: 900,
          lineHeight: 1.1,
          marginBottom: 24,
          opacity: headlineSpring,
          transform: `scale(${0.9 + headlineSpring * 0.1})`,
        }}>
          {spec.headline}
        </div>

        {/* Subheadline */}
        {spec.subheadline && (
          <div style={{
            fontSize: s.subheadlineSize,
            color: theme.textSecondary,
            marginBottom: 16,
            opacity: subheadlineOpacity,
            maxWidth: 900,
          }}>
            {spec.subheadline}
          </div>
        )}

        {/* Date */}
        {spec.date && (
          <div style={{
            fontSize: s.dateSize,
            color: theme.accent,
            fontWeight: 600,
            marginBottom: 32,
            opacity: subheadlineOpacity,
          }}>
            {spec.date}
          </div>
        )}

        {/* CTA */}
        {spec.cta_text && (
          <div style={{
            padding: s.ctaPadding,
            background: theme.bgSecondary,
            border: `2px solid ${theme.accent}`,
            borderRadius: 12,
            fontSize: s.ctaFontSize,
            fontWeight: 700,
            color: theme.accent,
            opacity: ctaSpring,
            transform: `translateY(${(1 - ctaSpring) * 20}px)`,
          }}>
            {spec.cta_text}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ── Layout: Card ────────────────────────────────────────────────
const CardLayout: React.FC<{
  spec: AnnouncementSpec;
  theme: Theme;
  frame: number;
  fps: number;
  bgStyle: React.CSSProperties;
  format: string;
}> = ({ spec, theme, frame, fps, bgStyle, format }) => {
  const cardSpring = springEntrance(frame, fps, TIMING.badgeStart, SPRING.default);
  const headlineSpring = springEntrance(frame, fps, TIMING.headlineStart, SPRING.default);
  const detailsOpacity = fadeIn(frame, TIMING.detailsStart);
  const ctaOpacity = fadeIn(frame, TIMING.ctaStart);

  const s = format === "vertical" ? SCALE.vertical : SCALE.square;

  return (
    <AbsoluteFill style={{ ...bgStyle, fontFamily: theme.fontFamily, color: theme.textPrimary }}>
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
        alignItems: "center",
        justifyContent: "center",
        padding: `${s.padding}px`,
      }}>
        {/* Main card */}
        <div style={{
          background: theme.bgSecondary,
          border: `2px solid ${theme.cardBorder}`,
          borderRadius: 24,
          padding: s.cardPadding,
          maxWidth: format === "vertical" ? 950 : 900,
          textAlign: "center",
          opacity: cardSpring,
          transform: `translateY(${(1 - cardSpring) * 40}px)`,
          boxShadow: theme.cardShadow,
        }}>
          {/* Icon */}
          <div style={{
            width: s.cardIconContainerSize,
            height: s.cardIconContainerSize,
            borderRadius: "50%",
            background: `${theme.accent}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}>
            {renderIcon(spec.icon_type, theme.accent, s.cardIconSize)}
          </div>

          {/* Badge */}
          {spec.badge_text && (
            <div style={{
              display: "inline-block",
              padding: s.cardBadgePadding,
              background: theme.accent,
              borderRadius: 100,
              marginBottom: 20,
              fontSize: s.cardBadgeFontSize,
              fontWeight: 700,
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}>
              {spec.badge_text}
            </div>
          )}

          {/* Headline */}
          <div style={{
            fontSize: s.cardHeadlineSize,
            fontWeight: theme.headingWeight,
            lineHeight: 1.2,
            marginBottom: 16,
            opacity: headlineSpring,
          }}>
            {spec.headline}
          </div>

          {/* Subheadline */}
          {spec.subheadline && (
            <div style={{
              fontSize: s.cardSubheadlineSize,
              color: theme.textSecondary,
              marginBottom: 24,
              opacity: detailsOpacity,
            }}>
              {spec.subheadline}
            </div>
          )}

          {/* Details */}
          {spec.details && (
            <div style={{
              fontSize: s.cardDetailsSize,
              color: theme.textMuted,
              marginBottom: 24,
              opacity: detailsOpacity,
            }}>
              {spec.details}
            </div>
          )}

          {/* CTA */}
          {spec.cta_text && (
            <div style={{
              display: "inline-block",
              padding: s.cardCtaPadding,
              background: theme.accentGradient.includes("gradient") ? theme.accentGradient : theme.accent,
              borderRadius: 10,
              fontSize: s.cardCtaFontSize,
              fontWeight: 700,
              color: "#fff",
              opacity: ctaOpacity,
            }}>
              {spec.cta_text}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Layout: Minimal ─────────────────────────────────────────────
const MinimalLayout: React.FC<{
  spec: AnnouncementSpec;
  theme: Theme;
  frame: number;
  fps: number;
  bgStyle: React.CSSProperties;
  format: string;
}> = ({ spec, theme, frame, fps, bgStyle, format }) => {
  const headlineSpring = springEntrance(frame, fps, TIMING.headlineStart, SPRING.gentle);
  const subheadlineOpacity = fadeIn(frame, TIMING.subheadlineStart);
  const ctaOpacity = fadeIn(frame, TIMING.ctaStart);

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
        {/* Badge line */}
        {spec.badge_text && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
            opacity: headlineSpring,
          }}>
            <div style={{
              width: 4,
              height: s.badgeBarHeight,
              background: theme.accent,
              borderRadius: 2,
            }} />
            <span style={{
              fontSize: s.minimalBadgeFontSize,
              fontWeight: 600,
              color: theme.accent,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}>
              {spec.badge_text}
            </span>
          </div>
        )}

        {/* Headline */}
        <div style={{
          fontSize: s.minimalHeadlineSize,
          fontWeight: theme.headingWeight,
          lineHeight: 1.2,
          marginBottom: 24,
          opacity: headlineSpring,
        }}>
          {spec.headline}
        </div>

        {/* Subheadline */}
        {spec.subheadline && (
          <div style={{
            fontSize: s.minimalSubheadlineSize,
            color: theme.textSecondary,
            lineHeight: 1.5,
            marginBottom: 32,
            opacity: subheadlineOpacity,
            maxWidth: "90%",
          }}>
            {spec.subheadline}
          </div>
        )}

        {/* Date and CTA row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          opacity: ctaOpacity,
        }}>
          {spec.date && (
            <span style={{
              fontSize: s.minimalDateSize,
              color: theme.textMuted,
            }}>
              {spec.date}
            </span>
          )}
          {spec.cta_text && (
            <span style={{
              fontSize: s.minimalCtaSize,
              fontWeight: 600,
              color: theme.accent,
            }}>
              {spec.cta_text} &rarr;
            </span>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
