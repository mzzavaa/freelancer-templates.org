/**
 * CallToAction Template - CTA Cards for Engagement
 * 
 * A template for driving engagement with clear calls to action.
 * Perfect for Instagram, LinkedIn, Twitter/X posts.
 * 
 * FORMATS:
 *   - Square 1:1 (1080x1080) - Instagram Feed, LinkedIn
 *   - Vertical 9:16 (1080x1920) - Stories, Reels
 * 
 * LAYOUT VARIANTS:
 *   "centered"  - Centered CTA with emphasis
 *   "split"     - Image/content split layout
 *   "minimal"   - Clean, simple CTA
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
const ArrowRightIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const DownloadIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const PlayIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const MailIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LinkIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

// ── Data Contract ───────────────────────────────────────────────
export interface CallToActionSpec {
  headline: string;
  subheadline?: string;
  description?: string;
  cta_text: string;
  cta_secondary_text?: string;
  icon_type?: "arrow" | "download" | "play" | "mail" | "link";
  background_image?: string;
  urgency_text?: string;
  author_name?: string;
  author_handle?: string;
}

export interface CallToActionProps {
  spec: CallToActionSpec;
  theme?: Theme;
  layout?: "centered" | "split" | "minimal";
  format?: "square" | "vertical";
}

// ── Timing Configuration ────────────────────────────────────────
const TIMING = {
  headlineStart: 0,
  subheadlineStart: 20,
  descriptionStart: 40,
  ctaStart: 60,
  urgencyStart: 90,
};

// ── Scaling Configuration ───────────────────────────────────────
// Centralized scaling for easy adjustment across all formats
const SCALE = {
  vertical: {
    padding: 50,
    // Centered layout
    headlineSize: 64,
    subheadlineSize: 30,
    descriptionSize: 22,
    ctaPadding: "20px 40px",
    ctaFontSize: 26,
    ctaIconSize: 26,
    secondaryCtaSize: 18,
    urgencyPadding: "12px 24px",
    urgencyFontSize: 16,
    // Split layout
    splitPadding: 52,
    splitIconContainerSize: 140,
    splitIconSize: 70,
    splitHeadlineSize: 48,
    splitSubheadlineSize: 24,
    splitCtaPadding: "16px 32px",
    splitCtaFontSize: 22,
    splitCtaIconSize: 24,
    // Minimal layout
    accentLineWidth: 70,
    accentLineHeight: 5,
    minimalHeadlineSize: 56,
    minimalSubheadlineSize: 26,
    minimalCtaSize: 22,
    minimalCtaIconSize: 24,
  },
  square: {
    padding: 60,
    // Centered layout
    headlineSize: 52,
    subheadlineSize: 26,
    descriptionSize: 18,
    ctaPadding: "18px 36px",
    ctaFontSize: 22,
    ctaIconSize: 22,
    secondaryCtaSize: 16,
    urgencyPadding: "10px 20px",
    urgencyFontSize: 14,
    // Split layout
    splitPadding: 60,
    splitIconContainerSize: 120,
    splitIconSize: 60,
    splitHeadlineSize: 40,
    splitSubheadlineSize: 20,
    splitCtaPadding: "14px 28px",
    splitCtaFontSize: 18,
    splitCtaIconSize: 20,
    // Minimal layout
    accentLineWidth: 60,
    accentLineHeight: 4,
    minimalHeadlineSize: 46,
    minimalSubheadlineSize: 22,
    minimalCtaSize: 20,
    minimalCtaIconSize: 22,
  },
};

// ── Icon Renderer ───────────────────────────────────────────────
const renderIcon = (type: CallToActionSpec["icon_type"], color: string, size: number) => {
  switch (type) {
    case "download": return <DownloadIcon color={color} size={size} />;
    case "play": return <PlayIcon color={color} size={size} />;
    case "mail": return <MailIcon color={color} size={size} />;
    case "link": return <LinkIcon color={color} size={size} />;
    case "arrow":
    default: return <ArrowRightIcon color={color} size={size} />;
  }
};

// ── Main Component ──────────────────────────────────────────────
export const CallToAction: React.FC<CallToActionProps> = ({
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

  if (layout === "split") {
    return <SplitLayout spec={spec} theme={theme} frame={frame} fps={fps} bgStyle={bgStyle} format={format} />;
  }
  if (layout === "minimal") {
    return <MinimalLayout spec={spec} theme={theme} frame={frame} fps={fps} bgStyle={bgStyle} format={format} />;
  }
  return <CenteredLayout spec={spec} theme={theme} frame={frame} fps={fps} bgStyle={bgStyle} format={format} />;
};

// ── Layout: Centered ────────────────────────────────────────────
const CenteredLayout: React.FC<{
  spec: CallToActionSpec;
  theme: Theme;
  frame: number;
  fps: number;
  bgStyle: React.CSSProperties;
  format: string;
}> = ({ spec, theme, frame, fps, bgStyle, format }) => {
  const headlineSpring = springEntrance(frame, fps, TIMING.headlineStart, SPRING.default);
  const subheadlineOpacity = fadeIn(frame, TIMING.subheadlineStart);
  const descriptionOpacity = fadeIn(frame, TIMING.descriptionStart);
  const ctaSpring = springEntrance(frame, fps, TIMING.ctaStart, SPRING.bouncy);
  const urgencyOpacity = fadeIn(frame, TIMING.urgencyStart);

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
        textAlign: "center",
      }}>
        {/* Headline */}
        <div style={{
          fontSize: s.headlineSize,
          fontWeight: 900,
          lineHeight: 1.1,
          marginBottom: 20,
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

        {/* Description */}
        {spec.description && (
          <div style={{
            fontSize: s.descriptionSize,
            color: theme.textMuted,
            marginBottom: 32,
            opacity: descriptionOpacity,
            maxWidth: 700,
            lineHeight: 1.6,
          }}>
            {spec.description}
          </div>
        )}

        {/* CTA Button */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: s.ctaPadding,
          background: theme.accentGradient.includes("gradient") ? theme.accentGradient : theme.accent,
          borderRadius: 12,
          fontSize: s.ctaFontSize,
          fontWeight: 700,
          color: "#fff",
          opacity: ctaSpring,
          transform: `translateY(${(1 - ctaSpring) * 20}px)`,
          boxShadow: `0 8px 24px ${theme.accent}40`,
        }}>
          {spec.cta_text}
          {renderIcon(spec.icon_type, "#fff", s.ctaIconSize)}
        </div>

        {/* Secondary CTA */}
        {spec.cta_secondary_text && (
          <div style={{
            marginTop: 16,
            fontSize: s.secondaryCtaSize,
            color: theme.textSecondary,
            opacity: ctaSpring,
          }}>
            {spec.cta_secondary_text}
          </div>
        )}

        {/* Urgency */}
        {spec.urgency_text && (
          <div style={{
            marginTop: 32,
            padding: s.urgencyPadding,
            background: `${theme.accentSecondary}20`,
            borderRadius: 100,
            fontSize: s.urgencyFontSize,
            fontWeight: 600,
            color: theme.accentSecondary,
            opacity: urgencyOpacity,
          }}>
            {spec.urgency_text}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ── Layout: Split ───────────────────────────────────────────────
const SplitLayout: React.FC<{
  spec: CallToActionSpec;
  theme: Theme;
  frame: number;
  fps: number;
  bgStyle: React.CSSProperties;
  format: string;
}> = ({ spec, theme, frame, fps, bgStyle, format }) => {
  const contentSpring = springEntrance(frame, fps, TIMING.headlineStart, SPRING.default);
  const ctaSpring = springEntrance(frame, fps, TIMING.ctaStart, SPRING.bouncy);

  const s = format === "vertical" ? SCALE.vertical : SCALE.square;
  const isVertical = format === "vertical";

  return (
    <AbsoluteFill style={{ ...bgStyle, fontFamily: theme.fontFamily, color: theme.textPrimary }}>
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: isVertical ? "column" : "row",
      }}>
        {/* Image Side */}
        <div style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
        }}>
          {spec.background_image ? (
            <Img src={spec.background_image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{
              width: "100%",
              height: "100%",
              background: theme.accentGradient.includes("gradient") ? theme.accentGradient : theme.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <div style={{
                width: s.splitIconContainerSize,
                height: s.splitIconContainerSize,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {renderIcon(spec.icon_type, "#fff", s.splitIconSize)}
              </div>
            </div>
          )}
        </div>

        {/* Content Side */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: `${s.splitPadding}px`,
          background: theme.bgSecondary,
        }}>
          <div style={{
            fontSize: s.splitHeadlineSize,
            fontWeight: theme.headingWeight,
            lineHeight: 1.2,
            marginBottom: 16,
            opacity: contentSpring,
          }}>
            {spec.headline}
          </div>

          {spec.subheadline && (
            <div style={{
              fontSize: s.splitSubheadlineSize,
              color: theme.textSecondary,
              marginBottom: 24,
              opacity: contentSpring,
            }}>
              {spec.subheadline}
            </div>
          )}

          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: s.splitCtaPadding,
            background: theme.accent,
            borderRadius: 10,
            fontSize: s.splitCtaFontSize,
            fontWeight: 700,
            color: "#fff",
            opacity: ctaSpring,
            alignSelf: "flex-start",
          }}>
            {spec.cta_text}
            {renderIcon(spec.icon_type, "#fff", s.splitCtaIconSize)}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Layout: Minimal ─────────────────────────────────────────────
const MinimalLayout: React.FC<{
  spec: CallToActionSpec;
  theme: Theme;
  frame: number;
  fps: number;
  bgStyle: React.CSSProperties;
  format: string;
}> = ({ spec, theme, frame, fps, bgStyle, format }) => {
  const headlineSpring = springEntrance(frame, fps, TIMING.headlineStart, SPRING.gentle);
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
        {/* Accent line */}
        <div style={{
          width: s.accentLineWidth,
          height: s.accentLineHeight,
          background: theme.accent,
          borderRadius: s.accentLineHeight / 2,
          marginBottom: 32,
          opacity: headlineSpring,
        }} />

        {/* Headline */}
        <div style={{
          fontSize: s.minimalHeadlineSize,
          fontWeight: theme.headingWeight,
          lineHeight: 1.2,
          marginBottom: 20,
          opacity: headlineSpring,
        }}>
          {spec.headline}
        </div>

        {/* Subheadline */}
        {spec.subheadline && (
          <div style={{
            fontSize: s.minimalSubheadlineSize,
            color: theme.textSecondary,
            marginBottom: 40,
            opacity: headlineSpring,
            maxWidth: "90%",
          }}>
            {spec.subheadline}
          </div>
        )}

        {/* CTA Link Style */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: s.minimalCtaSize,
          fontWeight: 600,
          color: theme.accent,
          opacity: ctaOpacity,
        }}>
          {spec.cta_text}
          {renderIcon(spec.icon_type, theme.accent, s.minimalCtaIconSize)}
        </div>
      </div>
    </AbsoluteFill>
  );
};
