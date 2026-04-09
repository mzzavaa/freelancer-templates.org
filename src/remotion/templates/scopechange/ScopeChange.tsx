/**
 * ScopeChange Template - Professional scope change / change order notification.
 *
 * Layout:
 *   - "Scope Change Notice" header with reference number + date
 *   - Original vs. new scope comparison (2-column cards with accent diff indicator)
 *   - Impact rows: time, cost, deliverables (with animated delta badges)
 *   - Reason / justification paragraph
 *   - Freelancer sign-off line
 *
 * DATA CONTRACT (ScopeChangeSpec):
 *   {
 *     ref_number: "SCO-2025-004",
 *     date: "April 9, 2025",
 *     client_name: "Acme Corp",
 *     project_title: "Website Redesign",
 *     original_scope: "5 pages, 4-week timeline",
 *     new_scope: "8 pages + blog CMS, 6-week timeline",
 *     reason: "Client requested blog module after kickoff...",
 *     impacts: [
 *       { label: "Timeline", original: "4 weeks", new: "6 weeks", delta: "+2 weeks" },
 *       { label: "Budget",   original: "$8,000",  new: "$11,500", delta: "+$3,500" },
 *       { label: "Deliverables", original: "5 pages", new: "8 pages + CMS", delta: "+3 + CMS" },
 *     ],
 *     freelancer_name: "Linda Mohamed",
 *     freelancer_title: "Full-Stack Developer",
 *   }
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { springEntrance, fadeIn, slideIn, staggerDelay, SPRING } from "../_shared/animations";
import type { Theme } from "../_shared/themes";
import { THEME_DARK } from "../_shared/themes";
import { PADDING, TOP_SAFE, TYPE, makeType } from "../_shared/layouts";
import { GlassCard, BackgroundGrid } from "../_shared/components";

// ── Data Contract ───────────────────────────────────────────────

export interface ScopeImpactItem {
  label: string;
  original: string;
  new: string;
  delta: string;
}

export interface ScopeChangeSpec {
  ref_number: string;
  date: string;
  client_name: string;
  project_title: string;
  original_scope: string;
  new_scope: string;
  reason: string;
  impacts: ScopeImpactItem[];
  freelancer_name: string;
  freelancer_title?: string;
}

export interface ScopeChangeProps {
  spec: ScopeChangeSpec;
  theme?: Theme;
  bgPattern?: "grid" | "dots" | "hex" | "none";
  fontScale?: number;
}

// ── Timing ──────────────────────────────────────────────────────
const TIMING = {
  headerStart: 0,
  metaStart: 14,
  comparisonStart: 30,
  impactBase: 90,
  impactStagger: 20,
  reasonStart: 180,
  signoffStart: 220,
};

// ── Main Component ──────────────────────────────────────────────
export const ScopeChange: React.FC<ScopeChangeProps> = ({
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

  const headerSpring = springEntrance(frame, fps, TIMING.headerStart, SPRING.default);
  const metaFade     = fadeIn(frame, TIMING.metaStart, 18);
  const compSpring   = springEntrance(frame, fps, TIMING.comparisonStart, SPRING.default);
  const compFade     = fadeIn(frame, TIMING.comparisonStart, 20);
  const reasonFade   = fadeIn(frame, TIMING.reasonStart, 20);
  const signoffFade  = fadeIn(frame, TIMING.signoffStart, 18);

  const impacts = spec.impacts.slice(0, 3);

  return (
    <AbsoluteFill style={{ ...bgStyle, fontFamily: theme.fontFamily, color: theme.textPrimary }}>
      {bgPattern !== "none" && <BackgroundGrid pattern={bgPattern as "grid" | "dots" | "hex"} />}

      <div style={{
        position: "absolute",
        inset: 0,
        padding: `${TOP_SAFE}px ${PADDING}px 40px`,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}>

        {/* ── Header ───────────────────────────────────────────── */}
        <div style={{
          opacity: headerSpring,
          transform: `translateY(${slideIn(headerSpring, "up", 20)}px)`,
        }}>
          <div style={{
            fontSize: T.label,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase" as const,
            color: theme.accent,
            marginBottom: 4,
          }}>
            Scope Change Notice
          </div>
          <div style={{ fontSize: T.hero, fontWeight: theme.headingWeight, lineHeight: 1.1 }}>
            {spec.project_title}
          </div>
          <div style={{
            fontSize: T.caption,
            color: theme.textMuted,
            marginTop: 6,
            opacity: metaFade,
          }}>
            {spec.ref_number} · {spec.date} · {spec.client_name}
          </div>
        </div>

        {/* ── Scope comparison: Original → New ─────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          gap: 12,
          alignItems: "center",
          opacity: compFade,
          transform: `translateY(${slideIn(compSpring, "up", 20)}px)`,
        }}>
          {/* Original */}
          <GlassCard theme={theme} style={{ padding: "16px 20px" }}>
            <div style={{
              fontSize: T.caption,
              color: theme.textMuted,
              fontWeight: 600,
              textTransform: "uppercase" as const,
              letterSpacing: 1,
              marginBottom: 8,
            }}>
              Original Scope
            </div>
            <div style={{ fontSize: T.body, color: theme.textSecondary, lineHeight: 1.4 }}>
              {spec.original_scope}
            </div>
          </GlassCard>

          {/* Arrow */}
          <div style={{
            fontSize: 28,
            color: theme.accent,
            fontWeight: 700,
            opacity: compFade,
          }}>→</div>

          {/* New scope */}
          <GlassCard theme={theme} style={{
            padding: "16px 20px",
            border: `2px solid ${theme.accent}`,
          }}>
            <div style={{
              fontSize: T.caption,
              color: theme.accent,
              fontWeight: 600,
              textTransform: "uppercase" as const,
              letterSpacing: 1,
              marginBottom: 8,
            }}>
              Updated Scope
            </div>
            <div style={{ fontSize: T.body, color: theme.textPrimary, lineHeight: 1.4, fontWeight: 500 }}>
              {spec.new_scope}
            </div>
          </GlassCard>
        </div>

        {/* ── Impact table ─────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {impacts.map((impact, i) => {
            const delay = staggerDelay(i, TIMING.impactBase, TIMING.impactStagger);
            const s = springEntrance(frame, fps, delay, SPRING.default);
            const op = fadeIn(frame, delay, 18);
            return (
              <GlassCard key={i} theme={theme} style={{
                opacity: op,
                transform: `translateX(${slideIn(s, "right", 28)}px)`,
                padding: "12px 20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{
                    fontSize: T.caption,
                    fontWeight: 700,
                    color: theme.textSecondary,
                    width: 140,
                    flexShrink: 0,
                  }}>
                    {impact.label}
                  </div>
                  <div style={{ fontSize: T.body, color: theme.textMuted, flex: 1 }}>
                    {impact.original}
                  </div>
                  <div style={{ fontSize: T.caption, color: theme.textMuted }}>→</div>
                  <div style={{ fontSize: T.body, color: theme.textPrimary, fontWeight: 600, flex: 1 }}>
                    {impact.new}
                  </div>
                  {/* Delta badge */}
                  <div style={{
                    fontSize: T.caption,
                    fontWeight: 700,
                    color: theme.accent,
                    background: `${theme.accent}1a`,
                    padding: "3px 12px",
                    borderRadius: 999,
                    whiteSpace: "nowrap" as const,
                  }}>
                    {impact.delta}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* ── Reason ───────────────────────────────────────────── */}
        <div style={{
          opacity: reasonFade,
          borderLeft: `3px solid ${theme.accent}`,
          paddingLeft: 16,
          fontSize: T.body,
          color: theme.textSecondary,
          lineHeight: 1.5,
        }}>
          {spec.reason}
        </div>

        {/* ── Sign-off ──────────────────────────────────────────── */}
        <div style={{
          opacity: signoffFade,
          fontSize: T.caption,
          color: theme.textMuted,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <span>Prepared by</span>
          <span style={{ color: theme.textPrimary, fontWeight: 600 }}>{spec.freelancer_name}</span>
          {spec.freelancer_title && (
            <span>· {spec.freelancer_title}</span>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
