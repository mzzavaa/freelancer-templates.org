/**
 * MeetingRecap Template - Crisp post-meeting summary video.
 *
 * Layout:
 *   - Header: meeting title + date + attendee chips
 *   - Decisions list (staggered, checkmark-style)
 *   - Action items table: owner, task, due date
 *   - Next meeting line at the bottom
 *
 * DATA CONTRACT (MeetingRecapSpec):
 *   {
 *     meeting_title: "Q2 Planning Sync",
 *     date: "April 9, 2025",
 *     attendees: ["Linda M.", "Sarah K.", "Dev Team"],
 *     decisions: ["Approved new homepage design", "Budget extended by $3k"],
 *     action_items: [
 *       { owner: "Linda", task: "Send revised mockups", due: "Apr 12" },
 *       { owner: "Sarah", task: "Schedule QA review", due: "Apr 15" },
 *     ],
 *     next_meeting?: "April 16, 2025 · 10 AM",
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

export interface ActionItem {
  owner: string;
  task: string;
  due: string;
}

export interface MeetingRecapSpec {
  meeting_title: string;
  date: string;
  attendees: string[];
  decisions: string[];
  action_items: ActionItem[];
  next_meeting?: string;
}

export interface MeetingRecapProps {
  spec: MeetingRecapSpec;
  theme?: Theme;
  bgPattern?: "grid" | "dots" | "hex" | "none";
  fontScale?: number;
}

// ── Timing ──────────────────────────────────────────────────────
const TIMING = {
  headerStart: 0,
  metaStart: 14,
  decisionBase: 35,
  decisionStagger: 18,
  actionBase: 130,
  actionStagger: 20,
  footerStart: 230,
};

// ── Main Component ──────────────────────────────────────────────
export const MeetingRecap: React.FC<MeetingRecapProps> = ({
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
  const footerFade   = fadeIn(frame, TIMING.footerStart, 20);

  const decisions    = spec.decisions.slice(0, 3);
  const actions      = spec.action_items.slice(0, 4);

  return (
    <AbsoluteFill style={{ ...bgStyle, fontFamily: theme.fontFamily, color: theme.textPrimary }}>
      {bgPattern !== "none" && <BackgroundGrid pattern={bgPattern as "grid" | "dots" | "hex"} />}

      <div style={{
        position: "absolute",
        inset: 0,
        padding: `${TOP_SAFE}px ${PADDING}px 40px`,
        display: "flex",
        flexDirection: "column",
        gap: 18,
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
            Meeting Recap
          </div>
          <div style={{ fontSize: T.hero, fontWeight: theme.headingWeight, lineHeight: 1.1 }}>
            {spec.meeting_title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8, opacity: metaFade }}>
            <span style={{ fontSize: T.caption, color: theme.textMuted }}>{spec.date}</span>
            {spec.attendees.map((a, i) => (
              <span key={i} style={{
                fontSize: T.caption,
                fontWeight: 600,
                color: theme.textSecondary,
                background: theme.bgGlass,
                border: `1px solid ${theme.cardBorder}`,
                padding: "2px 10px",
                borderRadius: 999,
              }}>
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* ── Decisions ────────────────────────────────────────── */}
        <div>
          <div style={{
            fontSize: T.label,
            fontWeight: 700,
            color: theme.accent,
            letterSpacing: 1,
            textTransform: "uppercase" as const,
            marginBottom: 10,
            opacity: fadeIn(frame, TIMING.decisionBase - 5, 15),
          }}>
            Key Decisions
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {decisions.map((d, i) => {
              const delay = staggerDelay(i, TIMING.decisionBase, TIMING.decisionStagger);
              const s = springEntrance(frame, fps, delay, SPRING.default);
              return (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  opacity: s,
                  transform: `translateX(${slideIn(s, "left", 24)}px)`,
                }}>
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    background: theme.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                    fontSize: 12,
                    fontWeight: 800,
                    color: "#fff",
                  }}>
                    ✓
                  </div>
                  <div style={{ fontSize: T.body, color: theme.textPrimary, lineHeight: 1.4 }}>
                    {d}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Action Items ──────────────────────────────────────── */}
        <div>
          <div style={{
            fontSize: T.label,
            fontWeight: 700,
            color: theme.accent,
            letterSpacing: 1,
            textTransform: "uppercase" as const,
            marginBottom: 10,
            opacity: fadeIn(frame, TIMING.actionBase - 5, 15),
          }}>
            Action Items
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {actions.map((action, i) => {
              const delay = staggerDelay(i, TIMING.actionBase, TIMING.actionStagger);
              const s = springEntrance(frame, fps, delay, SPRING.default);
              const op = fadeIn(frame, delay, 18);
              return (
                <GlassCard key={i} theme={theme} style={{
                  opacity: op,
                  transform: `translateX(${slideIn(s, "right", 24)}px)`,
                  padding: "10px 18px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{
                      fontSize: T.caption,
                      fontWeight: 700,
                      color: theme.accent,
                      minWidth: 80,
                      flexShrink: 0,
                    }}>
                      {action.owner}
                    </div>
                    <div style={{ fontSize: T.body, color: theme.textPrimary, flex: 1 }}>
                      {action.task}
                    </div>
                    <div style={{
                      fontSize: T.caption,
                      color: theme.textMuted,
                      background: `${theme.accent}1a`,
                      padding: "2px 10px",
                      borderRadius: 999,
                      whiteSpace: "nowrap" as const,
                    }}>
                      Due: {action.due}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* ── Next meeting ─────────────────────────────────────── */}
        {spec.next_meeting && (
          <div style={{
            opacity: footerFade,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: T.body,
            color: theme.textSecondary,
          }}>
            <span style={{ color: theme.accent, fontWeight: 700 }}>Next Meeting:</span>
            <span>{spec.next_meeting}</span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
