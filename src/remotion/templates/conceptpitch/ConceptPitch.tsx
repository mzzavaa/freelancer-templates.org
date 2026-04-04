/**
 * ConceptPitch Template
 *
 * A journal-content video template for idea brainstorms, concept proposals,
 * internal pitches, and automation concepts. Supports three layout variants:
 *   - arc: linear problem→solution→tasks→result narrative flow
 *   - board: kanban-style task grouping by done/to-do status
 *   - brief: compact side-by-side summary with pie chart
 *
 * All layouts feature custom SVG illustrations and animated background decorations.
 */

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { evolvePath, getPointAtLength, getLength } from "@remotion/paths";
import { Pie } from "@remotion/shapes";
import type { Theme } from "../_shared/themes";
import { THEME_DARK } from "../_shared/themes";
import { springEntrance, fadeIn, slideIn, scaleIn, SPRING } from "../_shared/animations";
import {
  BackgroundGrid,
  GlassCard,
  GradientBadge,
} from "../_shared/components";
import {
  RocketIllustration,
  LightbulbIllustration,
  GearMechanismIllustration,
  ChecklistBoardIllustration,
  TrophyIllustration,
  KanbanBoardIllustration,
  PieChartIllustration,
} from "../_shared/illustrations";
import { FloatingOrbs, ParticleField } from "../_shared/decorations";

// ── Data Contracts ──────────────────────────────────────────────

export interface ConceptPitchTask {
  title: string;
  done: boolean;
}

export interface ConceptPitchSpec {
  title: string;
  problemStatement: string;
  proposedSolution: string;
  tasks: ConceptPitchTask[];
  notes?: string[];
  status?: string;
  finalResult?: string;
  tags?: string[];
}

export interface ConceptPitchProps {
  spec: ConceptPitchSpec;
  theme: Theme;
  layout?: "arc" | "board" | "brief";
}

// ── Layout constants ────────────────────────────────────────────
const PADDING = 80;
const TOP_SAFE = 48;

// ── PillTag atom ────────────────────────────────────────────────
const PillTag: React.FC<{ text: string; theme: Theme; opacity: number }> = ({ text, theme, opacity }) => (
  <span
    style={{
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 600,
      fontFamily: theme.fontFamily,
      background: `${theme.accent}20`,
      color: theme.accent,
      opacity,
      marginRight: 8,
    }}
  >
    {text}
  </span>
);

// ── Animated checkmark SVG path ─────────────────────────────────
const CHECKMARK_PATH = "M 4 12 L 9 17 L 20 6";

const AnimatedCheckmark: React.FC<{ frame: number; startFrame: number; color: string; size?: number }> = ({
  frame, startFrame, color, size = 24,
}) => {
  const progress = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const evolved = evolvePath(progress, CHECKMARK_PATH);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d={CHECKMARK_PATH}
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray={evolved.strokeDasharray}
        strokeDashoffset={evolved.strokeDashoffset}
      />
    </svg>
  );
};

// ── Dashed circle for incomplete tasks ──────────────────────────
const DashedCircle: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" fill="none" />
  </svg>
);

// ── Task Card ───────────────────────────────────────────────────
const TaskCard: React.FC<{
  task: ConceptPitchTask;
  theme: Theme;
  frame: number;
  startFrame: number;
  fps: number;
}> = ({ task, theme, frame, startFrame, fps }) => {
  const s = springEntrance(frame, fps, startFrame, SPRING.default);
  return (
    <div
      data-testid="task-card"
      style={{
        opacity: s,
        transform: `translateY(${slideIn(s, "up", 15)}px)`,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        background: theme.bgGlass,
        border: `1px solid ${task.done ? theme.accent : theme.textMuted}`,
        borderRadius: 10,
        marginBottom: 8,
      }}
    >
      {task.done ? (
        <AnimatedCheckmark frame={frame} startFrame={startFrame + 5} color={theme.accent} size={20} />
      ) : (
        <DashedCircle color={theme.textMuted} size={20} />
      )}
      <span
        style={{
          fontSize: 13,
          fontFamily: theme.fontFamily,
          color: task.done ? theme.textPrimary : theme.textSecondary,
          fontWeight: task.done ? 600 : 400,
        }}
      >
        {task.title}
      </span>
    </div>
  );
};


// ── Inline Status Pill (free-form text, not the typed StatusBadge) ──
const StatusPill: React.FC<{ text: string; theme: Theme }> = ({ text, theme }) => (
  <span style={{
    display: "inline-block", padding: "3px 10px", borderRadius: 999,
    fontSize: 11, fontWeight: 600, fontFamily: theme.fontFamily,
    background: `${theme.accent}20`, color: theme.accent, letterSpacing: 0.5,
  }}>
    {text}
  </span>
);

// ── Arc Layout ──────────────────────────────────────────────────
// Linear problem→solution→tasks→result flow with connecting arrows
const ArcLayout: React.FC<{
  spec: ConceptPitchSpec;
  theme: Theme;
  frame: number;
  fps: number;
}> = ({ spec, theme, frame, fps }) => {
  const stagger = 30;
  const titleS = springEntrance(frame, fps, 5, SPRING.default);
  const problemStart = 40;
  const solutionStart = problemStart + stagger;
  const tasksStart = solutionStart + stagger;
  const notesStart = tasksStart + Math.max(spec.tasks.length, 1) * 20 + 20;
  const resultStart = notesStart + ((spec.notes?.length ?? 0) * 15) + 20;

  // Section data for arrows
  const sections = [
    { label: "Problem", start: problemStart },
    { label: "Solution", start: solutionStart },
    { label: "Tasks", start: tasksStart },
  ];
  if (spec.finalResult) {
    sections.push({ label: "Result", start: resultStart });
  }

  return (
    <div style={{ padding: PADDING, paddingTop: TOP_SAFE, height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header: Title + Rocket + Status */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: titleS, transform: `translateY(${slideIn(titleS, "up", 20)}px)` }}>
        <RocketIllustration size={48} color={theme.accent} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 42, fontWeight: theme.headingWeight, color: theme.textPrimary, fontFamily: theme.fontFamily, lineHeight: 1.1 }}>
            {spec.title}
          </div>
        </div>
        {spec.status && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%", background: theme.accent,
              boxShadow: `0 0 6px ${theme.accent}`,
              transform: `scale(${1 + Math.sin(frame * 0.15) * 0.15})`,
            }} />
            <StatusPill text={spec.status} theme={theme} />
          </div>
        )}
      </div>

      {/* Tags */}
      {spec.tags && spec.tags.length > 0 && (
        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" as const }}>
          {spec.tags.map((tag, i) => (
            <PillTag key={tag} text={tag} theme={theme} opacity={fadeIn(frame, 15 + i * 5)} />
          ))}
        </div>
      )}

      {/* Content flow */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, marginTop: 24, overflow: "hidden" }}>
        {/* Problem */}
        <ArcSection
          frame={frame} fps={fps} startFrame={problemStart} theme={theme}
          icon={<LightbulbIllustration size={36} color={theme.accent} />}
          label="Problem" text={spec.problemStatement}
        />

        {/* Arrow: Problem → Solution */}
        <ConnectingArrow frame={frame} fps={fps} startFrame={solutionStart - 10} color={theme.accent} />

        {/* Solution */}
        <ArcSection
          frame={frame} fps={fps} startFrame={solutionStart} theme={theme}
          icon={<GearMechanismIllustration size={36} color={theme.accent} />}
          label="Solution" text={spec.proposedSolution}
        />

        {/* Arrow: Solution → Tasks */}
        <ConnectingArrow frame={frame} fps={fps} startFrame={tasksStart - 10} color={theme.accent} />

        {/* Tasks */}
        <div style={{ opacity: fadeIn(frame, tasksStart) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <ChecklistBoardIllustration size={28} color={theme.accent} />
            <span style={{ fontSize: 14, fontWeight: 700, color: theme.accent, fontFamily: theme.fontFamily }}>Tasks</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
            {spec.tasks.map((task, i) => (
              <div key={i} style={{ width: "calc(50% - 3px)" }}>
                <TaskCard task={task} theme={theme} frame={frame} startFrame={tasksStart + i * 20} fps={fps} />
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {spec.notes && spec.notes.length > 0 && (
          <div style={{ marginTop: 4 }}>
            {spec.notes.map((note, i) => {
              const noteOpacity = fadeIn(frame, notesStart + i * 15);
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, opacity: noteOpacity, marginBottom: 4 }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" style={{ marginTop: 2, flexShrink: 0 }}>
                    <path d="M 3 2 L 9 6 L 3 10 Z" fill={theme.textSecondary} />
                  </svg>
                  <span style={{ fontSize: 12, color: theme.textSecondary, fontFamily: theme.fontFamily, lineHeight: 1.4 }}>
                    {note}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Final Result */}
        {spec.finalResult && (
          <div style={{ marginTop: "auto" }}>
            <ConnectingArrow frame={frame} fps={fps} startFrame={resultStart - 10} color={theme.accent} />
            <div style={{ opacity: fadeIn(frame, resultStart), transform: `scale(${scaleIn(frame, resultStart, 15, 0.95)})` }}>
              <GlassCard theme={theme}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <TrophyIllustration size={32} color={theme.accent} />
                  <div style={{ flex: 1 }}>
                    <GradientBadge text="Result" theme={theme} />
                    <div style={{ fontSize: 14, color: theme.textPrimary, fontFamily: theme.fontFamily, marginTop: 6, fontWeight: 600 }}>
                      {spec.finalResult}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Arc Section helper ──────────────────────────────────────────
const ArcSection: React.FC<{
  frame: number; fps: number; startFrame: number; theme: Theme;
  icon: React.ReactNode; label: string; text: string;
}> = ({ frame, fps, startFrame, theme, icon, label, text }) => {
  const s = springEntrance(frame, fps, startFrame, SPRING.default);
  return (
    <div style={{ opacity: s, transform: `translateY(${slideIn(s, "up", 15)}px)`, display: "flex", alignItems: "flex-start", gap: 10 }}>
      {icon}
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: theme.accent, fontFamily: theme.fontFamily }}>{label}</div>
        <div style={{ fontSize: 13, color: theme.textSecondary, fontFamily: theme.fontFamily, lineHeight: 1.5, marginTop: 2 }}>{text}</div>
      </div>
    </div>
  );
};

// ── Connecting Arrow with evolvePath + glow ─────────────────────
const ConnectingArrow: React.FC<{
  frame: number; fps: number; startFrame: number; color: string;
}> = ({ frame, fps, startFrame, color }) => {
  const progress = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
    extrapolateRight: "clamp", extrapolateLeft: "clamp",
  });
  const arrowPath = "M 20 0 L 20 28";
  const evolved = evolvePath(progress, arrowPath);
  const pathLen = getLength(arrowPath);
  const dotPos = getPointAtLength(arrowPath, progress * pathLen);
  const pulse = spring({ frame: frame - startFrame - 10, fps, config: { damping: 5, stiffness: 150 } });
  const dotScale = 1 + pulse * 0.3;

  return (
    <div style={{ display: "flex", justifyContent: "flex-start", paddingLeft: 8, height: 32 }}>
      <svg width="40" height="32" viewBox="0 0 40 32" fill="none">
        <defs>
          <filter id="arrowGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        {/* Glow layer */}
        <path d={arrowPath} stroke={color} strokeWidth="3" fill="none" opacity={0.3}
          strokeDasharray={evolved.strokeDasharray} strokeDashoffset={evolved.strokeDashoffset}
          filter="url(#arrowGlow)" />
        {/* Main line */}
        <path d={arrowPath} stroke={color} strokeWidth="1.5" fill="none"
          strokeDasharray={evolved.strokeDasharray} strokeDashoffset={evolved.strokeDashoffset} />
        {/* Arrowhead */}
        {progress > 0.5 && (
          <g transform={`translate(${dotPos.x}, ${dotPos.y})`} opacity={interpolate(progress, [0.5, 0.8], [0, 1], { extrapolateRight: "clamp" })}>
            <polygon points="-3,-3 0,3 3,-3" fill={color} />
          </g>
        )}
        {/* Pulsing dot */}
        {progress > 0.3 && (
          <circle cx={dotPos.x} cy={dotPos.y} r={2.5 * dotScale} fill={color}
            opacity={interpolate(progress, [0.3, 0.6], [0, 0.8], { extrapolateRight: "clamp" })}
            filter="url(#arrowGlow)" />
        )}
      </svg>
    </div>
  );
};


// ── Board Layout ────────────────────────────────────────────────
// Kanban-style task grouping by done/to-do status
const BoardLayout: React.FC<{
  spec: ConceptPitchSpec;
  theme: Theme;
  frame: number;
  fps: number;
}> = ({ spec, theme, frame, fps }) => {
  const titleS = springEntrance(frame, fps, 5, SPRING.default);
  const headerStart = 30;
  const boardStart = 60;

  const doneTasks = spec.tasks.filter((t) => t.done);
  const todoTasks = spec.tasks.filter((t) => !t.done);
  const doneRatio = spec.tasks.length > 0 ? doneTasks.length / spec.tasks.length : 0;
  const todoRatio = spec.tasks.length > 0 ? todoTasks.length / spec.tasks.length : 0;

  return (
    <div style={{ padding: PADDING, paddingTop: TOP_SAFE, height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header: Title + Kanban illustration */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: titleS, transform: `translateY(${slideIn(titleS, "up", 20)}px)` }}>
        <KanbanBoardIllustration size={48} color={theme.accent} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 38, fontWeight: theme.headingWeight, color: theme.textPrimary, fontFamily: theme.fontFamily, lineHeight: 1.1 }}>
            {spec.title}
          </div>
        </div>
        {spec.status && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%", background: theme.accent,
              boxShadow: `0 0 6px ${theme.accent}`,
              transform: `scale(${1 + Math.sin(frame * 0.15) * 0.15})`,
            }} />
            <StatusPill text={spec.status} theme={theme} />
          </div>
        )}
      </div>

      {/* Problem / Solution header */}
      <div style={{ display: "flex", gap: 16, marginTop: 16, opacity: fadeIn(frame, headerStart) }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: theme.accent, fontFamily: theme.fontFamily, textTransform: "uppercase" as const, letterSpacing: 1 }}>Problem</div>
          <div style={{ fontSize: 12, color: theme.textSecondary, fontFamily: theme.fontFamily, lineHeight: 1.4, marginTop: 4 }}>{spec.problemStatement}</div>
        </div>
        <div style={{ width: 1, background: `${theme.accent}30` }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: theme.accentSecondary, fontFamily: theme.fontFamily, textTransform: "uppercase" as const, letterSpacing: 1 }}>Solution</div>
          <div style={{ fontSize: 12, color: theme.textSecondary, fontFamily: theme.fontFamily, lineHeight: 1.4, marginTop: 4 }}>{spec.proposedSolution}</div>
        </div>
      </div>

      {/* Board columns */}
      <div style={{ flex: 1, display: "flex", gap: 16, marginTop: 20, overflow: "hidden" }}>
        {/* Done column */}
        <BoardColumn
          label="Done" tasks={doneTasks} ratio={doneRatio} theme={theme}
          frame={frame} fps={fps} startFrame={boardStart}
          headerIcon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke={theme.accent} strokeWidth="1.5" fill={`${theme.accent}15`} />
              <path d="M 5 8 L 7 10 L 11 6" stroke={theme.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          }
          glowColor={theme.accent}
          isDone
        />
        {/* To Do column */}
        <BoardColumn
          label="To Do" tasks={todoTasks} ratio={todoRatio} theme={theme}
          frame={frame} fps={fps} startFrame={boardStart + 15}
          headerIcon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke={theme.textMuted} strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
            </svg>
          }
          glowColor={theme.textMuted}
          isDone={false}
        />
      </div>

      {/* Tags */}
      {spec.tags && spec.tags.length > 0 && (
        <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" as const }}>
          {spec.tags.map((tag, i) => (
            <PillTag key={tag} text={tag} theme={theme} opacity={fadeIn(frame, boardStart + 40 + i * 5)} />
          ))}
        </div>
      )}
    </div>
  );
};

// ── Board Column helper ─────────────────────────────────────────
const BoardColumn: React.FC<{
  label: string;
  tasks: ConceptPitchTask[];
  ratio: number;
  theme: Theme;
  frame: number;
  fps: number;
  startFrame: number;
  headerIcon: React.ReactNode;
  glowColor: string;
  isDone: boolean;
}> = ({ label, tasks, ratio, theme, frame, fps, startFrame, headerIcon, glowColor, isDone }) => {
  const colS = springEntrance(frame, fps, startFrame, SPRING.default);
  // Animated pie progress
  const pieProgress = interpolate(frame, [startFrame + 10, startFrame + 40], [0, ratio], {
    extrapolateRight: "clamp", extrapolateLeft: "clamp",
  });

  return (
    <div
      data-testid={isDone ? "board-column-done" : "board-column-todo"}
      style={{
        flex: 1, opacity: colS, transform: `translateY(${slideIn(colS, "up", 15)}px)`,
        background: theme.bgGlass, borderRadius: 12, padding: 14,
        border: `1px solid ${theme.cardBorder}`,
      }}
    >
      {/* Column header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        {headerIcon}
        <span style={{ fontSize: 13, fontWeight: 700, color: theme.textPrimary, fontFamily: theme.fontFamily }}>{label}</span>
        <span style={{ fontSize: 11, color: theme.textMuted, fontFamily: theme.fontFamily }}>({tasks.length})</span>
        {/* Pie indicator */}
        <div style={{ marginLeft: "auto", position: "relative" as const }}>
          <Pie progress={pieProgress} fill={isDone ? theme.accent : theme.textMuted} radius={10} rotation={-0.25}
            closePath={false} strokeWidth={0} />
          {/* Ring outline */}
          <svg width="22" height="22" viewBox="-1 -1 22 22" style={{ position: "absolute", top: 0, left: 0 }}>
            <circle cx="10" cy="10" r="10" stroke={`${glowColor}30`} strokeWidth="1" fill="none" />
          </svg>
        </div>
      </div>

      {/* Task cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {tasks.map((task, i) => (
          <div key={i} style={isDone ? { boxShadow: `0 0 12px ${theme.accent}15` } : {}}>
            <TaskCard task={task} theme={theme} frame={frame} startFrame={startFrame + 15 + i * 20} fps={fps} />
          </div>
        ))}
        {tasks.length === 0 && (
          <div style={{ fontSize: 11, color: theme.textMuted, fontFamily: theme.fontFamily, textAlign: "center" as const, padding: 16 }}>
            No tasks
          </div>
        )}
      </div>
    </div>
  );
};


// ── Brief Layout ────────────────────────────────────────────────
// Compact side-by-side summary with pie chart. Max 270 frames.
const BriefLayout: React.FC<{
  spec: ConceptPitchSpec;
  theme: Theme;
  frame: number;
  fps: number;
}> = ({ spec, theme, frame, fps }) => {
  const titleS = springEntrance(frame, fps, 5, SPRING.default);
  const cardsStart = 30;
  const pieStart = 50;
  const tasksStart = 70;

  const doneCount = spec.tasks.filter((t) => t.done).length;
  const totalCount = spec.tasks.length;
  const completionRatio = totalCount > 0 ? doneCount / totalCount : 0;
  const pieProgress = interpolate(frame, [pieStart, pieStart + 30], [0, completionRatio], {
    extrapolateRight: "clamp", extrapolateLeft: "clamp",
  });
  const pctLabel = Math.round(pieProgress * 100);

  return (
    <div style={{ padding: PADDING, paddingTop: TOP_SAFE, height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: titleS, transform: `translateY(${slideIn(titleS, "up", 15)}px)` }}>
        <div style={{ fontSize: 36, fontWeight: theme.headingWeight, color: theme.textPrimary, fontFamily: theme.fontFamily, lineHeight: 1.1 }}>
          {spec.title}
        </div>
        {spec.status && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%", background: theme.accent,
              boxShadow: `0 0 5px ${theme.accent}`,
              transform: `scale(${1 + Math.sin(frame * 0.15) * 0.12})`,
            }} />
            <StatusPill text={spec.status} theme={theme} />
          </div>
        )}
      </div>

      {/* Tags */}
      {spec.tags && spec.tags.length > 0 && (
        <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" as const }}>
          {spec.tags.map((tag, i) => (
            <PillTag key={tag} text={tag} theme={theme} opacity={fadeIn(frame, 12 + i * 4)} />
          ))}
        </div>
      )}

      {/* Side-by-side cards: Problem | Solution */}
      <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
        {/* Problem card */}
        <div style={{
          flex: 1, opacity: fadeIn(frame, cardsStart),
          transform: `scale(${scaleIn(frame, cardsStart, 15, 0.96)})`,
        }}>
          <GlassCard theme={theme}>
            <div style={{ borderLeft: `3px solid ${theme.accent}`, paddingLeft: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: theme.accent, fontFamily: theme.fontFamily, textTransform: "uppercase" as const, letterSpacing: 1 }}>Problem</div>
              <div style={{ fontSize: 12, color: theme.textSecondary, fontFamily: theme.fontFamily, lineHeight: 1.5, marginTop: 6 }}>{spec.problemStatement}</div>
            </div>
          </GlassCard>
        </div>
        {/* Solution card */}
        <div style={{
          flex: 1, opacity: fadeIn(frame, cardsStart + 10),
          transform: `scale(${scaleIn(frame, cardsStart + 10, 15, 0.96)})`,
        }}>
          <GlassCard theme={theme}>
            <div style={{ borderLeft: `3px solid ${theme.accentSecondary}`, paddingLeft: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: theme.accentSecondary, fontFamily: theme.fontFamily, textTransform: "uppercase" as const, letterSpacing: 1 }}>Solution</div>
              <div style={{ fontSize: 12, color: theme.textSecondary, fontFamily: theme.fontFamily, lineHeight: 1.5, marginTop: 6 }}>{spec.proposedSolution}</div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Task completion summary with pie */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 20, opacity: fadeIn(frame, pieStart) }}>
        <div style={{ position: "relative" as const, width: 56, height: 56 }}>
          <Pie progress={pieProgress} fill={theme.accent} radius={28} rotation={-0.25}
            closePath={false} strokeWidth={0} />
          {/* Ring outline */}
          <svg width="58" height="58" viewBox="-1 -1 58 58" style={{ position: "absolute", top: 0, left: 0 }}>
            <circle cx="28" cy="28" r="28" stroke={`${theme.accent}25`} strokeWidth="1.5" fill="none" />
          </svg>
          {/* Center label */}
          <div style={{
            position: "absolute", top: 0, left: 0, width: 56, height: 56,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, color: theme.textPrimary, fontFamily: theme.fontFamily,
          }}>
            {pctLabel}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: theme.textPrimary, fontFamily: theme.fontFamily }}>
            {doneCount}/{totalCount} tasks done
          </div>
          <div style={{ fontSize: 11, color: theme.textMuted, fontFamily: theme.fontFamily, marginTop: 2 }}>
            Task completion
          </div>
        </div>
        <PieChartIllustration size={32} color={theme.accent} progress={completionRatio} />
      </div>

      {/* Compact task list */}
      <div style={{ flex: 1, display: "flex", flexWrap: "wrap" as const, gap: 6, marginTop: 14, overflow: "hidden" }}>
        {spec.tasks.map((task, i) => (
          <div key={i} style={{ width: "calc(50% - 3px)" }}>
            <TaskCard task={task} theme={theme} frame={frame} startFrame={tasksStart + i * 20} fps={fps} />
          </div>
        ))}
      </div>

      {/* Final result */}
      {spec.finalResult && (
        <div style={{ marginTop: 10, opacity: fadeIn(frame, tasksStart + spec.tasks.length * 20 + 10) }}>
          <GlassCard theme={theme}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <GradientBadge text="Result" theme={theme} />
              <span style={{ fontSize: 13, color: theme.textPrimary, fontFamily: theme.fontFamily, fontWeight: 600 }}>
                {spec.finalResult}
              </span>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

// ── Main ConceptPitch Component ─────────────────────────────────
export const ConceptPitch: React.FC<ConceptPitchProps> = ({
  spec,
  theme: inputTheme,
  layout = "arc",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = inputTheme || THEME_DARK;

  return (
    <AbsoluteFill style={{ background: theme.bg, fontFamily: theme.fontFamily }}>
      <BackgroundGrid opacity={0.04} />

      {/* Animated background decorations */}
      {layout === "board" ? (
        <ParticleField frame={frame} count={10} color={theme.accent} />
      ) : layout === "brief" ? (
        <FloatingOrbs frame={frame} count={3} color={theme.accent} />
      ) : (
        <FloatingOrbs frame={frame} count={4} color={theme.accent} />
      )}

      {/* Layout switch */}
      {layout === "arc" && (
        <ArcLayout spec={spec} theme={theme} frame={frame} fps={fps} />
      )}
      {layout === "board" && (
        <BoardLayout spec={spec} theme={theme} frame={frame} fps={fps} />
      )}
      {layout === "brief" && (
        <BriefLayout spec={spec} theme={theme} frame={frame} fps={fps} />
      )}
    </AbsoluteFill>
  );
};
