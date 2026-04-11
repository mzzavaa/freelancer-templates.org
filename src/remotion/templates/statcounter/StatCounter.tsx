/**
 * StatCounter Template - Animated Statistics & Numbers
 * 
 * A template for showcasing statistics, metrics, and achievements.
 * Perfect for Instagram, LinkedIn, Twitter/X posts.
 * 
 * FORMATS:
 *   - Square 1:1 (1080x1080) - Instagram Feed, LinkedIn
 *   - Vertical 9:16 (1080x1920) - Stories, Reels
 * 
 * LAYOUT VARIANTS:
 *   "single"   - One big stat with context
 *   "grid"     - Multiple stats in a grid
 *   "progress" - Stats with progress indicators
 */

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {
  springEntrance,
  fadeIn,
  SPRING,
} from "../_shared/animations";
import type { Theme } from "../_shared/themes";
import { THEME_DARK } from "../_shared/themes";

// ── SVG Icons ───────────────────────────────────────────────────
const TrendUpIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const TrendDownIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

const ChartIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const UsersIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

// ── Data Contract ───────────────────────────────────────────────
export interface StatItem {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  sublabel?: string;
  trend?: "up" | "down" | "neutral";
  trend_value?: string;
  icon_type?: "chart" | "users" | "trend";
}

export interface StatCounterSpec {
  title?: string;
  subtitle?: string;
  stats: StatItem[];
  footer_text?: string;
  author_name?: string;
  author_handle?: string;
}

export interface StatCounterProps {
  spec: StatCounterSpec;
  theme?: Theme;
  layout?: "single" | "grid" | "progress";
  format?: "square" | "vertical";
}

// ── Timing Configuration ────────────────────────────────────────
const TIMING = {
  titleStart: 0,
  statsStart: 20,
  statStagger: 15,
  footerStart: 90,
};

// ── Scaling Configuration ───────────────────────────────────────
// Centralized scaling for easy adjustment across all formats
const SCALE = {
  vertical: {
    padding: 50,
    // Single layout
    titleSize: 32,
    statValueSize: 140,
    statLabelSize: 36,
    statSublabelSize: 24,
    trendPadding: "12px 24px",
    trendIconSize: 24,
    trendTextSize: 18,
    footerSize: 18,
    // Grid layout
    gridTitleSize: 42,
    gridSubtitleSize: 24,
    gridGap: 36,
    gridCardPadding: "36px 28px",
    gridStatValueSize: 56,
    gridStatLabelSize: 22,
    gridStatSublabelSize: 16,
    // Progress layout
    progressTitleSize: 42,
    progressGap: 44,
    progressIconSize: 40,
    progressLabelSize: 24,
    progressValueSize: 32,
    progressBarHeight: 10,
  },
  square: {
    padding: 60,
    // Single layout
    titleSize: 28,
    statValueSize: 120,
    statLabelSize: 32,
    statSublabelSize: 20,
    trendPadding: "10px 20px",
    trendIconSize: 20,
    trendTextSize: 16,
    footerSize: 16,
    // Grid layout
    gridTitleSize: 36,
    gridSubtitleSize: 20,
    gridGap: 44,
    gridCardPadding: "32px 28px",
    gridStatValueSize: 48,
    gridStatLabelSize: 18,
    gridStatSublabelSize: 14,
    // Progress layout
    progressTitleSize: 36,
    progressGap: 36,
    progressIconSize: 36,
    progressLabelSize: 20,
    progressValueSize: 28,
    progressBarHeight: 8,
  },
};

// ── Animated Number Component ───────────────────────────────────
const AnimatedNumber: React.FC<{
  value: number;
  prefix?: string;
  suffix?: string;
  frame: number;
  fps: number;
  startFrame: number;
  color: string;
  fontSize: number;
}> = ({ value, prefix, suffix, frame, fps, startFrame, color, fontSize }) => {
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 30, stiffness: 100 },
  });
  
  const displayValue = Math.round(value * Math.min(progress, 1));
  
  return (
    <span style={{ color, fontSize, fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
};

// ── Icon Renderer ───────────────────────────────────────────────
const renderIcon = (type: StatItem["icon_type"], color: string, size: number) => {
  switch (type) {
    case "users": return <UsersIcon color={color} size={size} />;
    case "trend": return <TrendUpIcon color={color} size={size} />;
    case "chart":
    default: return <ChartIcon color={color} size={size} />;
  }
};

// ── Main Component ──────────────────────────────────────────────
export const StatCounter: React.FC<StatCounterProps> = ({
  spec,
  theme = THEME_DARK,
  layout = "single",
  format = "square",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgStyle = theme.bg.startsWith("linear-gradient")
    ? { background: theme.bg }
    : { backgroundColor: theme.bg };

  if (layout === "grid") {
    return <GridLayout spec={spec} theme={theme} frame={frame} fps={fps} bgStyle={bgStyle} format={format} />;
  }
  if (layout === "progress") {
    return <ProgressLayout spec={spec} theme={theme} frame={frame} fps={fps} bgStyle={bgStyle} format={format} />;
  }
  return <SingleLayout spec={spec} theme={theme} frame={frame} fps={fps} bgStyle={bgStyle} format={format} />;
};

// ── Layout: Single ──────────────────────────────────────────────
const SingleLayout: React.FC<{
  spec: StatCounterSpec;
  theme: Theme;
  frame: number;
  fps: number;
  bgStyle: React.CSSProperties;
  format: string;
}> = ({ spec, theme, frame, fps, bgStyle, format }) => {
  const titleSpring = springEntrance(frame, fps, TIMING.titleStart, SPRING.default);
  const statSpring = springEntrance(frame, fps, TIMING.statsStart, SPRING.bouncy);
  const footerOpacity = fadeIn(frame, TIMING.footerStart);

  const s = format === "vertical" ? SCALE.vertical : SCALE.square;
  const stat = spec.stats[0];

  return (
    <AbsoluteFill style={{ ...bgStyle, fontFamily: theme.fontFamily, color: theme.textPrimary }}>
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
        {/* Title */}
        {spec.title && (
          <div style={{
            fontSize: s.titleSize,
            fontWeight: 600,
            color: theme.textSecondary,
            marginBottom: 24,
            opacity: titleSpring,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}>
            {spec.title}
          </div>
        )}

        {/* Main Stat */}
        <div style={{
          opacity: statSpring,
          transform: `scale(${0.8 + statSpring * 0.2})`,
        }}>
          <AnimatedNumber
            value={stat.value}
            prefix={stat.prefix}
            suffix={stat.suffix}
            frame={frame}
            fps={fps}
            startFrame={TIMING.statsStart}
            color={theme.accent}
            fontSize={s.statValueSize}
          />
        </div>

        {/* Label */}
        <div style={{
          fontSize: s.statLabelSize,
          fontWeight: theme.headingWeight,
          marginTop: 16,
          opacity: statSpring,
        }}>
          {stat.label}
        </div>

        {/* Sublabel */}
        {stat.sublabel && (
          <div style={{
            fontSize: s.statSublabelSize,
            color: theme.textSecondary,
            marginTop: 8,
            opacity: statSpring,
          }}>
            {stat.sublabel}
          </div>
        )}

        {/* Trend */}
        {stat.trend && stat.trend_value && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 24,
            padding: s.trendPadding,
            background: stat.trend === "up" ? `${theme.accent}20` : `${theme.accentSecondary}20`,
            borderRadius: 100,
            opacity: footerOpacity,
          }}>
            {stat.trend === "up" ? (
              <TrendUpIcon color={theme.accent} size={s.trendIconSize} />
            ) : (
              <TrendDownIcon color={theme.accentSecondary} size={s.trendIconSize} />
            )}
            <span style={{
              fontSize: s.trendTextSize,
              fontWeight: 600,
              color: stat.trend === "up" ? theme.accent : theme.accentSecondary,
            }}>
              {stat.trend_value}
            </span>
          </div>
        )}

        {/* Footer */}
        {spec.footer_text && (
          <div style={{
            fontSize: s.footerSize,
            color: theme.textMuted,
            marginTop: 40,
            opacity: footerOpacity,
          }}>
            {spec.footer_text}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ── Layout: Grid ────────────────────────────────────────────────
const GridLayout: React.FC<{
  spec: StatCounterSpec;
  theme: Theme;
  frame: number;
  fps: number;
  bgStyle: React.CSSProperties;
  format: string;
}> = ({ spec, theme, frame, fps, bgStyle, format }) => {
  const titleSpring = springEntrance(frame, fps, TIMING.titleStart, SPRING.default);
  const footerOpacity = fadeIn(frame, TIMING.footerStart);

  const s = format === "vertical" ? SCALE.vertical : SCALE.square;
  const columns = format === "vertical" ? 1 : Math.min(spec.stats.length, 3);

  return (
    <AbsoluteFill style={{ ...bgStyle, fontFamily: theme.fontFamily, color: theme.textPrimary }}>
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        padding: `${s.padding}px`,
      }}>
        {/* Title */}
        {spec.title && (
          <div style={{
            fontSize: s.gridTitleSize,
            fontWeight: theme.headingWeight,
            marginBottom: 8,
            opacity: titleSpring,
            textAlign: "center",
          }}>
            {spec.title}
          </div>
        )}

        {spec.subtitle && (
          <div style={{
            fontSize: s.gridSubtitleSize,
            color: theme.textSecondary,
            marginBottom: 40,
            opacity: titleSpring,
            textAlign: "center",
          }}>
            {spec.subtitle}
          </div>
        )}

        {/* Stats Grid */}
        <div style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: s.gridGap,
          alignContent: "center",
        }}>
          {spec.stats.map((stat, index) => {
            const statStart = TIMING.statsStart + index * TIMING.statStagger;
            const statSpring = springEntrance(frame, fps, statStart, SPRING.bouncy);

            return (
              <div
                key={index}
                style={{
                  background: theme.bgSecondary,
                  border: `1px solid ${theme.cardBorder}`,
                  borderRadius: 16,
                  padding: s.gridCardPadding,
                  textAlign: "center",
                  opacity: statSpring,
                  transform: `translateY(${(1 - statSpring) * 20}px)`,
                }}
              >
                <AnimatedNumber
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  frame={frame}
                  fps={fps}
                  startFrame={statStart}
                  color={theme.accent}
                  fontSize={s.gridStatValueSize}
                />
                <div style={{
                  fontSize: s.gridStatLabelSize,
                  fontWeight: 600,
                  marginTop: 8,
                }}>
                  {stat.label}
                </div>
                {stat.sublabel && (
                  <div style={{
                    fontSize: s.gridStatSublabelSize,
                    color: theme.textMuted,
                    marginTop: 4,
                  }}>
                    {stat.sublabel}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {spec.footer_text && (
          <div style={{
            fontSize: s.footerSize,
            color: theme.textMuted,
            textAlign: "center",
            marginTop: 32,
            opacity: footerOpacity,
          }}>
            {spec.footer_text}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ── Layout: Progress ────────────────────────────────────────────
const ProgressLayout: React.FC<{
  spec: StatCounterSpec;
  theme: Theme;
  frame: number;
  fps: number;
  bgStyle: React.CSSProperties;
  format: string;
}> = ({ spec, theme, frame, fps, bgStyle, format }) => {
  const titleSpring = springEntrance(frame, fps, TIMING.titleStart, SPRING.default);
  const footerOpacity = fadeIn(frame, TIMING.footerStart);

  const s = format === "vertical" ? SCALE.vertical : SCALE.square;

  return (
    <AbsoluteFill style={{ ...bgStyle, fontFamily: theme.fontFamily, color: theme.textPrimary }}>
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        padding: `${s.padding}px`,
      }}>
        {/* Title */}
        {spec.title && (
          <div style={{
            fontSize: s.progressTitleSize,
            fontWeight: theme.headingWeight,
            marginBottom: 40,
            opacity: titleSpring,
          }}>
            {spec.title}
          </div>
        )}

        {/* Stats with Progress Bars */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: s.progressGap,
        }}>
          {spec.stats.map((stat, index) => {
            const statStart = TIMING.statsStart + index * TIMING.statStagger;
            const statSpring = springEntrance(frame, fps, statStart, SPRING.default);
            const progressWidth = interpolate(
              frame - statStart,
              [0, 30],
              [0, Math.min(stat.value, 100)],
              { extrapolateRight: "clamp" }
            );

            return (
              <div
                key={index}
                style={{
                  opacity: statSpring,
                  transform: `translateX(${(1 - statSpring) * -30}px)`,
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 12,
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}>
                    {stat.icon_type && (
                      <div style={{
                        width: s.progressIconSize,
                        height: s.progressIconSize,
                        borderRadius: 8,
                        background: `${theme.accent}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        {renderIcon(stat.icon_type, theme.accent, s.progressIconSize * 0.55)}
                      </div>
                    )}
                    <span style={{ fontSize: s.progressLabelSize, fontWeight: 600 }}>
                      {stat.label}
                    </span>
                  </div>
                  <AnimatedNumber
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    frame={frame}
                    fps={fps}
                    startFrame={statStart}
                    color={theme.accent}
                    fontSize={s.progressValueSize}
                  />
                </div>
                {/* Progress Bar */}
                <div style={{
                  height: s.progressBarHeight,
                  background: theme.bgSecondary,
                  borderRadius: s.progressBarHeight / 2,
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: `${progressWidth}%`,
                    background: theme.accentGradient.includes("gradient") ? theme.accentGradient : theme.accent,
                    borderRadius: s.progressBarHeight / 2,
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {spec.footer_text && (
          <div style={{
            fontSize: s.footerSize,
            color: theme.textMuted,
            marginTop: 32,
            opacity: footerOpacity,
          }}>
            {spec.footer_text}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
