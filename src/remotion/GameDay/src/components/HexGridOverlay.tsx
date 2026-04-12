import { AbsoluteFill } from "remotion";
import React from "react";
import type { Theme } from "../../../themes";
import { GD_PURPLE } from "../design/colors";

export interface HexGridOverlayProps {
  /** Optional theme for custom styling. Falls back to GameDay defaults when not provided. */
  theme?: Theme;
  /** Opacity for the hex grid overlay (0-1). Default: 0.04 */
  opacity?: number;
}

/**
 * HexGridOverlay component with hexagonal pattern.
 *
 * Supports optional Theme prop for custom accent color while maintaining
 * backward compatibility with existing GameDay design.
 *
 * @see Requirements: 11.3-11.6
 */
export const HexGridOverlay: React.FC<HexGridOverlayProps> = ({
  theme,
  opacity = 0.04,
}) => {
  // Use theme accent if provided, otherwise fall back to GD_PURPLE
  const strokeColor = theme?.accent ?? theme?.accentSecondary ?? GD_PURPLE;

  return (
    <AbsoluteFill style={{ opacity }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="hexGrid"
            width="60"
            height="52"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M30 0 L60 15 L60 37 L30 52 L0 37 L0 15 Z"
              fill="none"
              stroke={strokeColor}
              strokeWidth={0.5}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexGrid)" />
      </svg>
    </AbsoluteFill>
  );
};
