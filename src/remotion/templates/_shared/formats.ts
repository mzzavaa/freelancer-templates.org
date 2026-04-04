/**
 * Multi-Format Rendering Support
 *
 * Defines format configurations for landscape, vertical, and square video outputs.
 * Landscape is the default and remains unchanged from existing behavior.
 *
 * Usage:
 *   import { getFormatConfig, VideoFormat } from '../_shared/formats';
 *   const fmt = getFormatConfig(spec.format ?? "landscape");
 *   // Use fmt.width, fmt.height, fmt.padding, fmt.typographyScale
 */

// ── Types ───────────────────────────────────────────────────────

export type VideoFormat = "landscape" | "vertical" | "square";

export interface FormatConfig {
  width: number;
  height: number;
  padding: number;
  typographyScale: number;
}

// ── Format Configs ──────────────────────────────────────────────

const FORMAT_CONFIGS: Record<VideoFormat, FormatConfig> = {
  landscape: { width: 1280, height: 720, padding: 80, typographyScale: 1.0 },
  vertical:  { width: 1080, height: 1920, padding: 60, typographyScale: 0.9 },
  square:    { width: 1080, height: 1080, padding: 64, typographyScale: 0.85 },
};

/**
 * Returns the format configuration for the given video format.
 * Defaults to landscape if format is undefined.
 */
export function getFormatConfig(format?: VideoFormat): FormatConfig {
  return FORMAT_CONFIGS[format ?? "landscape"];
}

/**
 * Scales a typography size value by the format's typography scale factor.
 * Use this to adapt font sizes for vertical/square formats.
 */
export function scaleType(basePx: number, format?: VideoFormat): number {
  const { typographyScale } = getFormatConfig(format);
  return Math.round(basePx * typographyScale);
}
