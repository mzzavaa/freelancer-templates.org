/**
 * RateCard Template - Clean service pricing card for freelancers.
 *
 * Layout:
 *   - Header: freelancer name + specialty tagline
 *   - Service rows with animated price CountUp + unit label (per hour / per project)
 *   - Optional featured "package" card with gradient border
 *   - Footer: valid-until date + CTA
 *
 * DATA CONTRACT (RateCardSpec):
 *   {
 *     freelancer_name: "Linda Mohamed",
 *     specialty: "AI & Product Consultant",
 *     services: [
 *       { name: "Strategy Consultation", rate: 250, unit: "/hr", featured: false },
 *       { name: "Full Project Delivery", rate: 8000, unit: "/project", featured: true },
 *       { name: "Code Review Sprint",    rate: 600,  unit: "/day", featured: false },
 *     ],
 *     valid_until: "June 30, 2025",
 *     cta: "Book a call to discuss →",
 *     currency?: "$",
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

export interface ServiceItem {
  name: string;
  rate: number;
  unit: string;       // "/hr", "/day", "/project", etc.
  featured?: boolean; // Draws accent border around this row
}

export interface RateCardSpec {
  freelancer_name: string;
  specialty: string;
  services: ServiceItem[];
  valid_until: string;
  cta: string;
  currency?: string;  // default "$"
}

export interface RateCardProps {
  spec: RateCardSpec;
  theme?: Theme;
  bgPattern?: "grid" | "dots" | "hex" | "none";
  fontScale?: number;
}

// ── Timing ──────────────────────────────────────────────────────
const TIMING = {
  headerStart: 0,
  specialtyStart: 14,
  serviceBase: 35,
  serviceStagger: 22,
  countupStart: 55,
  footerStart: 215,
};

// ── Main Component ──────────────────────────────────────────────
export const RateCard: React.FC<RateCardProps> = ({
  spec,
  theme = THEME_DARK,
  bgPattern = "dots",
  fontScale = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = makeType(fontScale);

  const currency = spec.currency ?? "$";
  const bgStyle = theme.bg.startsWith("linear-gradient")
    ? { background: theme.bg }
    : { backgroundColor: theme.bg };

  const headerSpring  = springEntrance(frame, fps, TIMING.headerStart, SPRING.default);
  const specialtyFade = fadeIn(frame, TIMING.specialtyStart, 20);
  const footerFade    = fadeIn(frame, TIMING.footerStart, 20);

  const services = spec.services.slice(0, 5);

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
          opacity: headerSpring,
          transform: `translateY(${slideIn(headerSpring, "up", 22)}px)`,
        }}>
          <div style={{
            fontSize: T.label,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase" as const,
            color: theme.accent,
            marginBottom: 6,
          }}>
            Rate Card
          </div>
          <div style={{ fontSize: T.hero, fontWeight: theme.headingWeight, lineHeight: 1.1 }}>
            {spec.freelancer_name}
          </div>
          <div style={{
            fontSize: T.subtitle,
            color: theme.textSecondary,
            marginTop: 6,
            opacity: specialtyFade,
          }}>
            {spec.specialty}
          </div>
        </div>

        {/* ── Service rows ─────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {services.map((svc, i) => {
            const delay = staggerDelay(i, TIMING.serviceBase, TIMING.serviceStagger);
            const s = springEntrance(frame, fps, delay, SPRING.default);
            const op = fadeIn(frame, delay, 18);
            const countStart = TIMING.countupStart + i * 8;

            return (
              <GlassCard
                key={i}
                theme={theme}
                style={{
                  opacity: op,
                  transform: `translateX(${slideIn(s, "right", 30)}px)`,
                  padding: "16px 24px",
                  border: svc.featured
                    ? `2px solid ${theme.accent}`
                    : `1px solid ${theme.cardBorder}`,
                  position: "relative" as const,
                }}
              >
                {svc.featured && (
                  <div style={{
                    position: "absolute" as const,
                    top: -10,
                    left: 20,
                    background: theme.accentGradient,
                    color: "#fff",
                    fontSize: T.caption - 4,
                    fontWeight: 700,
                    letterSpacing: 1,
                    padding: "2px 12px",
                    borderRadius: 999,
                    textTransform: "uppercase" as const,
                  }}>
                    Most Popular
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: T.body, fontWeight: svc.featured ? 700 : 500, color: theme.textPrimary }}>
                    {svc.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{
                      fontSize: T.stat,
                      fontWeight: theme.headingWeight,
                      color: svc.featured ? theme.accent : theme.textPrimary,
                      lineHeight: 1,
                    }}>
                      {currency}<CountUp
                        target={svc.rate}
                        frame={frame}
                        startFrame={countStart}
                        suffix=""
                        duration={55}
                      />
                    </span>
                    <span style={{
                      fontSize: T.caption,
                      color: theme.textMuted,
                    }}>
                      {svc.unit}
                    </span>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* ── Footer ───────────────────────────────────────────── */}
        <div style={{
          opacity: footerFade,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ fontSize: T.caption, color: theme.textMuted }}>
            Rates valid until {spec.valid_until}
          </div>
          <div style={{
            fontSize: T.body,
            color: theme.accent,
            fontWeight: 600,
          }}>
            {spec.cta}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
