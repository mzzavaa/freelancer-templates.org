/**
 * Easing utility functions for smooth animations
 *
 * Provides standard easing functions and interpolation helpers used by
 * overlay components (CursorOverlay, ZoomEffect) for smooth transitions.
 *
 * All easing functions take a normalized time value (0-1) and return
 * a normalized output value (0-1).
 *
 * Requirements: 2.2, 3.4
 */

import type { EasingFunction, EasingType } from '../types';

// =============================================================================
// Core Easing Functions
// =============================================================================

/**
 * Ease-in-out cubic function
 * Slow start, fast middle, slow end - good for general transitions
 *
 * @param t - Normalized time value (0-1)
 * @returns Normalized output value (0-1)
 */
export const easeInOut: EasingFunction = (t: number): number => {
  // Clamp input to valid range
  const clamped = Math.max(0, Math.min(1, t));

  // Cubic ease-in-out: slower at start and end, faster in middle
  return clamped < 0.5
    ? 4 * clamped * clamped * clamped
    : 1 - Math.pow(-2 * clamped + 2, 3) / 2;
};

/**
 * Ease-out cubic function
 * Fast start, slow end - good for elements coming to rest
 *
 * @param t - Normalized time value (0-1)
 * @returns Normalized output value (0-1)
 */
export const easeOut: EasingFunction = (t: number): number => {
  // Clamp input to valid range
  const clamped = Math.max(0, Math.min(1, t));

  // Cubic ease-out: fast start, decelerating to stop
  return 1 - Math.pow(1 - clamped, 3);
};

/**
 * Spring easing function
 * Overshoots target slightly then settles - good for natural, bouncy motion
 *
 * Uses a critically damped spring approximation for smooth, natural feel
 * without excessive oscillation.
 *
 * @param t - Normalized time value (0-1)
 * @returns Normalized output value (0-1), may slightly overshoot 1
 */
export const spring: EasingFunction = (t: number): number => {
  // Clamp input to valid range
  const clamped = Math.max(0, Math.min(1, t));

  // Spring parameters for natural motion
  // These values produce a slight overshoot (~1.05) then settle
  const c4 = (2 * Math.PI) / 3;

  if (clamped === 0) return 0;
  if (clamped === 1) return 1;

  // Elastic ease-out with damping for spring-like behavior
  return Math.pow(2, -10 * clamped) * Math.sin((clamped * 10 - 0.75) * c4) + 1;
};

// =============================================================================
// Easing Function Lookup
// =============================================================================

/**
 * Map of easing type names to their functions
 */
const easingFunctions: Record<EasingType, EasingFunction> = {
  easeInOut,
  easeOut,
  spring,
};

/**
 * Get an easing function by type name
 *
 * @param type - The easing type name
 * @returns The corresponding easing function
 */
export function getEasingFunction(type: EasingType): EasingFunction {
  return easingFunctions[type];
}

// =============================================================================
// Interpolation Helpers
// =============================================================================

/**
 * Interpolate between two values using an easing function
 *
 * @param start - Starting value
 * @param end - Ending value
 * @param progress - Progress value (0-1)
 * @param easing - Easing function to apply (default: easeInOut)
 * @returns Interpolated value between start and end
 */
export function interpolate(
  start: number,
  end: number,
  progress: number,
  easing: EasingFunction = easeInOut
): number {
  const easedProgress = easing(progress);
  return start + (end - start) * easedProgress;
}

/**
 * Interpolate between two 2D positions using an easing function
 *
 * @param startX - Starting X coordinate
 * @param startY - Starting Y coordinate
 * @param endX - Ending X coordinate
 * @param endY - Ending Y coordinate
 * @param progress - Progress value (0-1)
 * @param easing - Easing function to apply (default: easeInOut)
 * @returns Object with interpolated x and y coordinates
 */
export function interpolatePosition(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  progress: number,
  easing: EasingFunction = easeInOut
): { x: number; y: number } {
  const easedProgress = easing(progress);
  return {
    x: startX + (endX - startX) * easedProgress,
    y: startY + (endY - startY) * easedProgress,
  };
}

/**
 * Calculate progress within a frame range
 *
 * @param currentFrame - Current frame number
 * @param startFrame - Start frame of the animation
 * @param endFrame - End frame of the animation
 * @returns Progress value (0-1), clamped to valid range
 */
export function calculateProgress(
  currentFrame: number,
  startFrame: number,
  endFrame: number
): number {
  if (currentFrame <= startFrame) return 0;
  if (currentFrame >= endFrame) return 1;

  return (currentFrame - startFrame) / (endFrame - startFrame);
}

/**
 * Interpolate a value over a frame range with easing
 *
 * Convenience function that combines calculateProgress and interpolate
 *
 * @param currentFrame - Current frame number
 * @param startFrame - Start frame of the animation
 * @param endFrame - End frame of the animation
 * @param startValue - Value at start frame
 * @param endValue - Value at end frame
 * @param easing - Easing function to apply (default: easeInOut)
 * @returns Interpolated value for the current frame
 */
export function interpolateFrames(
  currentFrame: number,
  startFrame: number,
  endFrame: number,
  startValue: number,
  endValue: number,
  easing: EasingFunction = easeInOut
): number {
  const progress = calculateProgress(currentFrame, startFrame, endFrame);
  return interpolate(startValue, endValue, progress, easing);
}

/**
 * Interpolate opacity for fade-in/fade-out effects
 *
 * @param currentFrame - Current frame number
 * @param startFrame - Frame when element appears
 * @param endFrame - Frame when element disappears
 * @param fadeInFrames - Number of frames for fade-in (default: 5)
 * @param fadeOutFrames - Number of frames for fade-out (default: 5)
 * @returns Opacity value (0-1)
 */
export function interpolateOpacity(
  currentFrame: number,
  startFrame: number,
  endFrame: number,
  fadeInFrames: number = 5,
  fadeOutFrames: number = 5
): number {
  // Before start - invisible
  if (currentFrame < startFrame) return 0;

  // After end - invisible
  if (currentFrame > endFrame) return 0;

  // During fade-in
  const fadeInEnd = startFrame + fadeInFrames;
  if (currentFrame < fadeInEnd) {
    const progress = (currentFrame - startFrame) / fadeInFrames;
    return easeOut(progress);
  }

  // During fade-out
  const fadeOutStart = endFrame - fadeOutFrames;
  if (currentFrame > fadeOutStart) {
    const progress = (endFrame - currentFrame) / fadeOutFrames;
    return easeOut(progress);
  }

  // Fully visible
  return 1;
}

/**
 * Smooth cursor position using exponential smoothing
 *
 * Used by CursorOverlay for smooth cursor movement between recorded positions
 *
 * @param currentX - Current cursor X position
 * @param currentY - Current cursor Y position
 * @param targetX - Target cursor X position
 * @param targetY - Target cursor Y position
 * @param smoothing - Smoothing factor (0-1, higher = more smoothing, default: 0.3)
 * @returns Smoothed position
 */
export function smoothPosition(
  currentX: number,
  currentY: number,
  targetX: number,
  targetY: number,
  smoothing: number = 0.3
): { x: number; y: number } {
  // Clamp smoothing to valid range
  const factor = Math.max(0, Math.min(1, smoothing));

  // Exponential smoothing: new = current + factor * (target - current)
  return {
    x: currentX + (1 - factor) * (targetX - currentX),
    y: currentY + (1 - factor) * (targetY - currentY),
  };
}
