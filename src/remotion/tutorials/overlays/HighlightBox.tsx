/**
 * HighlightBox Component for Video Tutorial Screencasts
 *
 * Renders visible borders around specified regions to draw attention to
 * UI elements. Supports configurable styles (color, width, radius, glow)
 * and optional pulsing animation for enhanced visibility.
 *
 * The component accepts region coordinates from overlay configuration and
 * supports fade-in/fade-out animations for smooth appearance/disappearance.
 *
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 */

import { AbsoluteFill } from 'remotion';
import type { HighlightBoxProps, HighlightConfig, HighlightStyle } from '../types';
import { interpolateOpacity, easeInOut } from '../utils/easing';

// =============================================================================
// Constants
// =============================================================================

/** Default border color (brand accent) */
const DEFAULT_BORDER_COLOR = '#3B82F6';

/** Default border width in pixels */
const DEFAULT_BORDER_WIDTH = 3;

/** Default border radius in pixels */
const DEFAULT_BORDER_RADIUS = 8;

/** Default glow color (derived from border color) */
const DEFAULT_GLOW_COLOR = 'rgba(59, 130, 246, 0.5)';

/** Default glow intensity (0-1) */
const DEFAULT_GLOW_INTENSITY = 0.6;

/** Default fade-in duration in frames */
const DEFAULT_FADE_IN = 5;

/** Default fade-out duration in frames */
const DEFAULT_FADE_OUT = 5;

/** Pulse animation duration in frames (for one complete cycle) */
const PULSE_CYCLE_FRAMES = 30;

/** Minimum pulse scale */
const PULSE_MIN_SCALE = 0.97;

/** Maximum pulse scale */
const PULSE_MAX_SCALE = 1.03;

/** Minimum pulse opacity multiplier */
const PULSE_MIN_OPACITY = 0.7;

/** Maximum pulse opacity multiplier */
const PULSE_MAX_OPACITY = 1.0;

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Calculate the pulse animation value based on current frame
 *
 * Creates a smooth oscillating value between 0 and 1 for pulsing effects.
 * Uses a sine wave for natural-looking pulsation.
 *
 * @param currentFrame - The current frame number
 * @returns A value between 0 and 1 representing the pulse phase
 */
function calculatePulsePhase(currentFrame: number): number {
  // Use sine wave for smooth oscillation
  // Normalize to 0-1 range (sin returns -1 to 1)
  const phase = (currentFrame % PULSE_CYCLE_FRAMES) / PULSE_CYCLE_FRAMES;
  return (Math.sin(phase * Math.PI * 2) + 1) / 2;
}

/**
 * Interpolate between two values based on pulse phase
 *
 * @param min - Minimum value
 * @param max - Maximum value
 * @param phase - Pulse phase (0-1)
 * @returns Interpolated value
 */
function interpolatePulse(min: number, max: number, phase: number): number {
  return min + (max - min) * phase;
}

/**
 * Generate box shadow CSS for glow effect
 *
 * Creates a multi-layered glow effect that is visible against both
 * light and dark backgrounds. Uses a combination of:
 * - Dark outline for visibility on light backgrounds
 * - Light outline for visibility on dark backgrounds
 * - Colored glow for attention-drawing effect
 *
 * Requirements: 4.6 (visibility against light and dark backgrounds)
 *
 * @param glowColor - The glow color
 * @param intensity - Glow intensity (0-1)
 * @param pulsePhase - Current pulse phase for animated glow
 * @returns CSS box-shadow string
 */
function generateGlowShadow(
  glowColor: string,
  intensity: number,
  pulsePhase: number
): string {
  // Adjust intensity based on pulse phase for animated glow
  const adjustedIntensity = intensity * interpolatePulse(PULSE_MIN_OPACITY, PULSE_MAX_OPACITY, pulsePhase);

  // Contrasting outlines for visibility on any background
  // Dark outline (visible on light backgrounds)
  const darkOutline = `0 0 0 1px rgba(0, 0, 0, 0.3)`;
  // Light outline (visible on dark backgrounds)
  const lightOutline = `0 0 0 2px rgba(255, 255, 255, 0.4)`;

  // Multi-layered colored glow for attention
  const innerGlow = `0 0 ${4 * adjustedIntensity}px ${glowColor}`;
  const middleGlow = `0 0 ${12 * adjustedIntensity}px ${glowColor}`;
  const outerGlow = `0 0 ${24 * adjustedIntensity}px ${glowColor}`;

  // Combine all layers: outlines first (closest to border), then glows
  return `${darkOutline}, ${lightOutline}, ${innerGlow}, ${middleGlow}, ${outerGlow}`;
}

/**
 * Check if a highlight should be visible at the current frame
 *
 * @param highlight - The highlight configuration
 * @param currentFrame - The current frame number
 * @returns True if the highlight should be rendered
 */
function isHighlightVisible(highlight: HighlightConfig, currentFrame: number): boolean {
  const fadeIn = highlight.fadeIn ?? DEFAULT_FADE_IN;
  const fadeOut = highlight.fadeOut ?? DEFAULT_FADE_OUT;

  // Include fade-in and fade-out periods in visibility check
  return currentFrame >= highlight.startFrame - fadeIn && currentFrame <= highlight.endFrame + fadeOut;
}

// =============================================================================
// Single Highlight Component
// =============================================================================

/**
 * Props for the SingleHighlight component
 */
interface SingleHighlightProps {
  /** Highlight configuration */
  config: HighlightConfig;
  /** Current frame number */
  currentFrame: number;
}

/**
 * SingleHighlight Component
 *
 * Renders a single highlight box with configurable styles and animations.
 * Supports pulsing animation, glow effects, and fade transitions.
 *
 * Uses a dual-layer approach for visibility against any background:
 * - Outer layer: Main border with glow effect
 * - Inner layer: Subtle contrasting border for edge definition
 *
 * Requirements: 4.1, 4.2, 4.3, 4.5, 4.6
 */
const SingleHighlight: React.FC<SingleHighlightProps> = ({ config, currentFrame }) => {
  const { region, style = {}, startFrame, endFrame, fadeIn = DEFAULT_FADE_IN, fadeOut = DEFAULT_FADE_OUT } = config;

  // Extract style properties with defaults
  const borderColor = style.borderColor ?? DEFAULT_BORDER_COLOR;
  const borderWidth = style.borderWidth ?? DEFAULT_BORDER_WIDTH;
  const borderRadius = style.borderRadius ?? DEFAULT_BORDER_RADIUS;
  const glowColor = style.glowColor ?? DEFAULT_GLOW_COLOR;
  const glowIntensity = style.glowIntensity ?? DEFAULT_GLOW_INTENSITY;
  const pulseAnimation = style.pulseAnimation ?? true;

  // Calculate opacity with fade-in/fade-out (Requirement 4.5)
  const opacity = interpolateOpacity(currentFrame, startFrame, endFrame, fadeIn, fadeOut);

  // Calculate pulse phase for animations (Requirement 4.2)
  const pulsePhase = pulseAnimation ? calculatePulsePhase(currentFrame) : 0.5;

  // Calculate pulse scale (only if animation is enabled)
  const pulseScale = pulseAnimation
    ? interpolatePulse(PULSE_MIN_SCALE, PULSE_MAX_SCALE, pulsePhase)
    : 1;

  // Generate glow shadow with contrasting outlines (Requirement 4.6)
  const boxShadow = generateGlowShadow(glowColor, glowIntensity, pulseAnimation ? pulsePhase : 1);

  // Calculate pulsing border width for additional attention effect
  const pulseBorderWidth = pulseAnimation
    ? borderWidth + interpolatePulse(-0.5, 0.5, pulsePhase)
    : borderWidth;

  return (
    <div
      style={{
        position: 'absolute',
        left: region.x,
        top: region.y,
        width: region.width,
        height: region.height,
        // Main border with pulsing width
        border: `${pulseBorderWidth}px solid ${borderColor}`,
        borderRadius: borderRadius,
        // Multi-layer shadow for visibility on any background
        boxShadow: boxShadow,
        opacity: opacity,
        transform: `scale(${pulseScale})`,
        transformOrigin: 'center center',
        pointerEvents: 'none',
        willChange: 'opacity, transform, box-shadow',
        // Transparent background to not obscure content
        backgroundColor: 'transparent',
        // Ensure crisp rendering
        backfaceVisibility: 'hidden',
      }}
    />
  );
};

// =============================================================================
// Main HighlightBox Component
// =============================================================================

/**
 * HighlightBox Component
 *
 * Renders multiple highlight boxes based on configuration. Each highlight
 * can have its own timing, region, and style settings.
 *
 * The component filters highlights based on the current frame and renders
 * only those that should be visible (including fade-in/fade-out periods).
 *
 * @param highlights - Array of highlight configurations
 * @param currentFrame - Current frame number for animation timing
 *
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 */
export const HighlightBox: React.FC<HighlightBoxProps> = ({ highlights, currentFrame }) => {
  // Filter to only visible highlights
  const visibleHighlights = highlights.filter((highlight) => isHighlightVisible(highlight, currentFrame));

  // If no highlights are visible, don't render anything
  if (visibleHighlights.length === 0) {
    return null;
  }

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        zIndex: 500, // Below cursor (1000) but above zoom effect
      }}
    >
      {visibleHighlights.map((highlight, index) => (
        <SingleHighlight
          key={`highlight-${highlight.startFrame}-${highlight.region.x}-${highlight.region.y}-${index}`}
          config={highlight}
          currentFrame={currentFrame}
        />
      ))}
    </AbsoluteFill>
  );
};

export default HighlightBox;
