/**
 * ResultsShowcase Template - Dramatic "before → after" results reveal.
 *
 * Layout:
 *   - Hero headline: "The Results" / custom title
 *   - 3 large metric cards with CountUp numbers + context label + delta badge
 *   - Quote / testimonial pull-quote from the client
 *   - Freelancer credit line
 *
 * DATA CONTRACT (ResultsShowcaseSpec):
 *   {
 *     title: "The Results",
 *     subtitle: "What we achieved in 90 days",
 *     metrics: [
 *       { label: "Revenue Increase", value: 41, suffix: "%", delta: "+41%", context: "vs prior quarter" },
 *       { label: "Time to Resolve",  value: 2,  suffix: "hr",delta: "−6hr", context: "avg support ticket" },
 *       { label: "Churn Reduced",    value: 28, suffix: "%", delta: "−28%", context: "monthly churn rate" },
 *     ],
 *     quote?: "Linda turned our roadmap chaos into a revenue engine.",
 *     quote_author?: "Sarah K., CEO at Acme Corp",
 *     freelancer_name?: "Linda Mohamed",
 *     freelancer_title?: "Product Consultant",
 *   }
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { springEntrance, fadeIn, slideIn, staggerDelay, SPRING } from "../_shared/animations";
import type { Theme } from "../_shared/themes";
import { THEME_DARK } from "../_shared/themes";
import { PADDING, TOP_SAFE, TYPE, makeType } from "../_shared/layouts";
import { GlassCard, CountUp, BackgroundGrid } from "../_shared/components";

// ── Data Contract ───────────────────────────────────────────────

export interface MetricResult {
  label: string;
  value: number;
  suffix?: string;
  delta: string;
  context: string;
}

export interface ResultsShowcaseSpec {
  title: string;
  subtitle: string;
  metrics: MetricResult[];
  quote?: string;
  quote_author?: string;
  freelancer_name?: string;
  freelancer_title?: string;
}

export interface ResultsShowcaseProps {
  spec: ResultsShowcaseSpec;
  theme?: Theme;
  bgPattern?: "grid" | "dots" | "hex" | "none";
  fontScale?: number;
}

// ── Timing ──────────────────────────────────────────────────────
const TIMING = {
  titleStart: 0,
  subtitleStart: 14,
  metricBase: 35,
  metricStagger: 22,
  countupStart: 70,
  quoteStart: 160,
  creditStart: 220,
};

// ── Main Component ──────────────────────────────────────────────
export const ResultsShowcase: React.FC<ResultsShowcaseProps> = ({
  spec,
  theme = THEME_DARK,
  bgPattern = "grid",
  fontScale = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = makeType(fontScale);

  const bgStyle = theme.bg.startsWith("linear-gradient")
    ? { background: theme.bg }
    : { backgroundColor: theme.bg };

  const titleSpring   = springEntrance(frame, fps, TIMING.titleStart, SPRING.default);
  const subtitleFade  = fadeIn(frame, TIMING.subtitleStart, 20);
  const quoteFade     = fadeIn(frame, TIMING.quoteStart, 25);
  const creditFade    = fadeIn(frame, TIMING.creditStart, 18);

  const metrics = spec.metrics.slice(0, 3);

  return (
    <AbsoluteFill style={{ ...bgStyle, fontFamily: theme.fontFamily, color: theme.textPrimary }}>
      {bgPattern !== "none" && <BackgroundGrid pattern={bgPattern as "grid" | "dots" | "hex"} />}

      <div style={{
        position: "absolute",
        inset: 0,
        padding: `${TOP_SAFE}px ${PADDING}px 48px`,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        justifyContent: "center",
      }}>

        {/* ── Header ───────────────────────────────────────────── */}
        <div style={{
          opacity: titleSpring,
          transform: `translateY(${slideIn(titleSpring, "up", 24)}px)`,
        }}>
          <div style={{
            fontSize: T.label,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase" as const,
            color: theme.accent,
            marginBottom: 4,
          }}>
            Case Study
          </div>
          <div style={{ fontSize: T.hero, fontWeight: theme.headingWeight, lineHeight: 1.1 }}>
            {spec.title}
          </div>
          <div style={{
            fontSize: T.subtitle,
            color: theme.textSecondary,
            marginTop: 6,
            opacity: subtitleFade,
          }}>
            {spec.subtitle}
          </div>
        </div>

        {/* ── Metric cards ─────────────────────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16,
          alignContent: "start",
        }}>
          {metrics.map((m, i) => {
            const delay = staggerDelay(i, TIMING.metricBase, TIMING.metricStagger);
            const s = springEntrance(frame, fps, delay, SPRING.default);
            return (
              <GlassCard key={i} theme={theme} style={{
                opacity: s,
                transform: `translateY(${slideIn(s, "up", 30)}px) scale(${0.94 + s * 0.06})`,
                padding: "20px 24px",
                textAlign: "center" as const,
              }}>
                {/* Label */}
                <div style={{
                  fontSize: T.caption,
                  color: theme.textSecondary,
                  fontWeight: 600,
                  textTransform: "uppercase" as const,
                  letterSpacing: 1,
                  marginBottom: 8,
                }}>
                  {m.label}
                </div>

                {/* Big number */}
                <div style={{
                  fontSize: T.stat + 6,
                  fontWeight: theme.headingWeight,
                  color: theme.textPrimary,
                  lineHeight: 1,
                  marginBottom: 6,
                }}>
                  <CountUp
                    target={m.value}
                    frame={frame}
                    startFrame={TIMING.countupStart + i * 6}
                    suffix={m.suffix ?? ""}
                    duration={55}
                  />
                </div>

                {/* Delta badge */}
                <div style={{
                  display: "inline-block",
                  fontSize: T.caption,
                  fontWeight: 700,
                  color: theme.accent,
                  background: `${theme.accent}1a`,
                  padding: "3px 12px",
                  borderRadius: 999,
                  marginBottom: 4,
                }}>
                  {m.delta}
                </div>

                {/* Context */}
                <div style={{ fontSize: T.caption - 2, color: theme.textMuted }}>
                  {m.context}
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* ── Quote ────────────────────────────────────────────── */}
        {spec.quote && (
          <GlassCard theme={theme} style={{
            opacity: quoteFade,
            padding: "16px 24px",
            borderLeft: `3px solid ${theme.accent}`,
          }}>
            <div style={{
              fontSize: T.body,
              color: theme.textPrimary,
              fontStyle: "italic" as const,
              lineHeight: 1.5,
              marginBottom: spec.quote_author ? 8 : 0,
            }}>
              "{spec.quote}"
            </div>
            {spec.quote_author && (
              <div style={{ fontSize: T.caption, color: theme.textMuted }}>
                — {spec.quote_author}
              </div>
            )}
          </GlassCard>
        )}

        {/* ── Freelancer credit ─────────────────────────────────── */}
        {spec.freelancer_name && (
          <div style={{
            opacity: creditFade,
            fontSize: T.caption,
            color: theme.textMuted,
          }}>
            Delivered by <span style={{ color: theme.textPrimary, fontWeight: 600 }}>{spec.freelancer_name}</span>
            {spec.freelancer_title ? ` · ${spec.freelancer_title}` : ""}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
