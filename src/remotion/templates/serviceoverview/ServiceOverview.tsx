/**
 * ServiceOverview Template - Visual what-I-do summary for freelancers.
 *
 * Layout:
 *   - Header: "What I Do" + freelancer name
 *   - 2 or 3 service cards (icon, title, description, tag list)
 *   - Bottom row: ideal client statement + CTA
 *
 * DATA CONTRACT (ServiceOverviewSpec):
 *   {
 *     headline: "What I Do",
 *     freelancer_name: "Linda Mohamed",
 *     freelancer_title: "AI & Product Consultant",
 *     services: [
 *       { icon: "🧠", title: "Strategy & Discovery", description: "...", tags: ["AI", "Roadmap"] },
 *       { icon: "🛠️", title: "Build & Deliver",      description: "...", tags: ["React", "Python"] },
 *     ],
 *     ideal_client?: "Best for: SaaS startups scaling their AI capabilities",
 *     cta?: "Let's talk →",
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

export interface ServiceEntry {
  icon: string;           // emoji
  title: string;
  description: string;
  tags: string[];         // tech / skill badges
}

export interface ServiceOverviewSpec {
  headline: string;
  freelancer_name: string;
  freelancer_title: string;
  services: ServiceEntry[];
  ideal_client?: string;
  cta?: string;
}

export interface ServiceOverviewProps {
  spec: ServiceOverviewSpec;
  theme?: Theme;
  bgPattern?: "grid" | "dots" | "hex" | "none";
  fontScale?: number;
}

// ── Timing ──────────────────────────────────────────────────────
const TIMING = {
  headerStart: 0,
  nameStart: 14,
  cardBase: 40,
  cardStagger: 25,
  footerStart: 190,
};

// ── Main Component ──────────────────────────────────────────────
export const ServiceOverview: React.FC<ServiceOverviewProps> = ({
  spec,
  theme = THEME_DARK,
  bgPattern = "hex",
  fontScale = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = makeType(fontScale);

  const bgStyle = theme.bg.startsWith("linear-gradient")
    ? { background: theme.bg }
    : { backgroundColor: theme.bg };

  const headerSpring = springEntrance(frame, fps, TIMING.headerStart, SPRING.default);
  const nameFade     = fadeIn(frame, TIMING.nameStart, 20);
  const footerFade   = fadeIn(frame, TIMING.footerStart, 20);

  const services = spec.services.slice(0, 3);
  const cols = services.length === 2 ? "1fr 1fr" : "1fr 1fr 1fr";

  return (
    <AbsoluteFill style={{ ...bgStyle, fontFamily: theme.fontFamily, color: theme.textPrimary }}>
      {bgPattern !== "none" && <BackgroundGrid pattern={bgPattern as "grid" | "dots" | "hex"} />}

      <div style={{
        position: "absolute",
        inset: 0,
        padding: `${TOP_SAFE}px ${PADDING}px 48px`,
        display: "flex",
        flexDirection: "column",
        gap: 22,
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
            marginBottom: 4,
          }}>
            Services
          </div>
          <div style={{ fontSize: T.hero, fontWeight: theme.headingWeight, lineHeight: 1.1 }}>
            {spec.headline}
          </div>
          <div style={{
            fontSize: T.subtitle,
            color: theme.textSecondary,
            marginTop: 6,
            opacity: nameFade,
          }}>
            {spec.freelancer_name} · {spec.freelancer_title}
          </div>
        </div>

        {/* ── Service cards ─────────────────────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: cols,
          gap: 18,
          alignContent: "start",
        }}>
          {services.map((svc, i) => {
            const delay = staggerDelay(i, TIMING.cardBase, TIMING.cardStagger);
            const s = springEntrance(frame, fps, delay, SPRING.default);
            return (
              <GlassCard key={i} theme={theme} style={{
                opacity: s,
                transform: `translateY(${slideIn(s, "up", 30)}px) scale(${0.94 + s * 0.06})`,
                padding: "22px 22px",
              }}>
                {/* Icon */}
                <div style={{ fontSize: 36, marginBottom: 10 }}>{svc.icon}</div>

                {/* Title */}
                <div style={{ fontSize: T.body, fontWeight: 700, color: theme.textPrimary, marginBottom: 8 }}>
                  {svc.title}
                </div>

                {/* Description */}
                <div style={{
                  fontSize: T.caption,
                  color: theme.textSecondary,
                  lineHeight: 1.5,
                  marginBottom: 14,
                }}>
                  {svc.description}
                </div>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                  {svc.tags.map((tag, ti) => (
                    <span key={ti} style={{
                      fontSize: T.caption - 2,
                      fontWeight: 600,
                      color: theme.accent,
                      background: `${theme.accent}15`,
                      border: `1px solid ${theme.accent}33`,
                      padding: "2px 8px",
                      borderRadius: 6,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* ── Footer: ideal client + CTA ───────────────────────── */}
        <div style={{
          opacity: footerFade,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          {spec.ideal_client && (
            <div style={{ fontSize: T.body, color: theme.textSecondary }}>
              {spec.ideal_client}
            </div>
          )}
          {spec.cta && (
            <div style={{
              fontSize: T.body,
              fontWeight: 700,
              color: theme.accent,
            }}>
              {spec.cta}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
