import React from "react";
import type { Theme } from "../../../themes";

// Default GlassCard styling (matches original GameDay design)
const DEFAULT_BG_GLASS = "rgba(255,255,255,0.06)";
const DEFAULT_CARD_BORDER = "rgba(255,255,255,0.1)";
const DEFAULT_CARD_SHADOW =
  "0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)";

export interface GlassCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  /** Optional theme for custom styling. Falls back to GameDay defaults when not provided. */
  theme?: Theme;
}

/**
 * GlassCard component with glassmorphism effect.
 *
 * Supports optional Theme prop for custom styling while maintaining
 * backward compatibility with existing GameDay design.
 *
 * @see Requirements: 11.3-11.6
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  theme,
}) => {
  // Use theme if provided, otherwise fall back to GameDay defaults
  const bgGlass = theme?.bgGlass ?? DEFAULT_BG_GLASS;
  const cardBorder = theme?.cardBorder ?? DEFAULT_CARD_BORDER;
  const cardShadow = theme?.cardShadow ?? DEFAULT_CARD_SHADOW;
  const borderRadius = theme?.borderRadius ?? 20;

  return (
    <div
      style={{
        background: bgGlass,
        backdropFilter: "blur(16px)",
        border: `1px solid ${cardBorder}`,
        borderRadius,
        padding: 28,
        boxShadow: cardShadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
