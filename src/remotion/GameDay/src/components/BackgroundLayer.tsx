import { Img, staticFile } from "remotion";
import React from "react";
import type { Theme } from "../../../themes";
import { GD_DARK } from "../design/colors";

const BG_IMAGE = staticFile("assets/background-landscape.png");

// Default overlay color (GD_DARK = #0c0820 = rgb(12, 8, 32))
const DEFAULT_OVERLAY_RGB = "12,8,32";

export interface BackgroundLayerProps {
  /** Opacity for the darkening overlay (0-1). Default: 0.65 */
  darken?: number;
  /** Optional theme for custom styling. Falls back to GameDay defaults when not provided. */
  theme?: Theme;
}

/**
 * Extracts RGB values from a hex color string.
 * Returns default GameDay dark color if parsing fails.
 */
function hexToRgbString(hex: string): string {
  // Remove # if present
  const cleanHex = hex.replace("#", "");

  // Handle 3-character hex
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split("")
          .map((c) => c + c)
          .join("")
      : cleanHex;

  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  // Return default if parsing failed
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return DEFAULT_OVERLAY_RGB;
  }

  return `${r},${g},${b}`;
}

/**
 * BackgroundLayer component with image and darkening overlay.
 *
 * Supports optional Theme prop for custom background color while maintaining
 * backward compatibility with existing GameDay design.
 *
 * @see Requirements: 11.3-11.6
 */
export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  darken = 0.65,
  theme,
}) => {
  // Use theme.bg if provided, otherwise fall back to GD_DARK
  const bgColor = theme?.bg ?? GD_DARK;

  // Extract RGB for the overlay (handles both hex colors and gradients)
  // For gradients, we fall back to the default dark color
  const overlayRgb = bgColor.startsWith("#")
    ? hexToRgbString(bgColor)
    : DEFAULT_OVERLAY_RGB;

  return (
    <>
      <Img
        src={BG_IMAGE}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `rgba(${overlayRgb},${darken})`,
        }}
      />
    </>
  );
};
