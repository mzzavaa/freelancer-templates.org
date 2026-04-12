/**
 * ZoomEffect Component for Video Tutorial Screencasts
 *
 * Wraps content and applies a zoom transformation to focus on a specific region.
 * Supports configurable zoom levels (1.5x to 4x) and accepts target regions
 * defined by center coordinates or bounding box.
 *
 * The zoom transformation uses CSS scale and translate to center the target
 * region in the viewport while magnifying it.
 *
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
 */

import { AbsoluteFill, useVideoConfig } from 'remotion';
import type { ZoomEffectProps, ZoomConfig, EasingType } from '../types';
import { interpolate, getEasingFunction } from '../utils/easing';

// =============================================================================
// Constants
// =============================================================================

/** Minimum allowed zoom level */
const MIN_ZOOM_LEVEL = 1.5;

/** Maximum allowed zoom level */
const MAX_ZOOM_LEVEL = 4.0;

/** Default zoom-in duration in frames (15 frames @ 30fps = 500ms) */
const DEFAULT_ZOOM_IN_DURATION = 15;

/** Default zoom-out duration in frames (15 frames @ 30fps = 500ms) */
const DEFAULT_ZOOM_OUT_DURATION = 15;

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Clamp a value between a minimum and maximum
 *
 * @param value - The value to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns The clamped value
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Validate and clamp the zoom level to the allowed range
 *
 * @param zoomLevel - The requested zoom level
 * @returns The validated zoom level (clamped to 1.5-4.0)
 */
function validateZoomLevel(zoomLevel: number): number {
  return clamp(zoomLevel, MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL);
}

/**
 * Calculate the center point of a target region
 *
 * If width and height are provided, calculates the center of the bounding box.
 * Otherwise, uses the x, y coordinates directly as the center point.
 *
 * @param targetRegion - The target region configuration
 * @returns The center point { x, y }
 */
function calculateTargetCenter(targetRegion: ZoomConfig['targetRegion']): {
  x: number;
  y: number;
} {
  const { x, y, width, height } = targetRegion;

  // If width and height are provided, calculate center of bounding box
  if (width !== undefined && height !== undefined) {
    return {
      x: x + width / 2,
      y: y + height / 2,
    };
  }

  // Otherwise, x and y are already the center coordinates
  return { x, y };
}

/**
 * Calculate the CSS transform values for the zoom effect
 *
 * The zoom transformation consists of:
 * 1. Scale: Magnify the content by the zoom level
 * 2. Translate: Move the content so the target region is centered in the viewport
 *
 * The translation is calculated to center the target point in the viewport
 * after scaling. The formula accounts for the fact that scaling happens
 * around the transform origin (center of the container).
 *
 * @param targetCenter - The center point to zoom into
 * @param zoomLevel - The zoom magnification level
 * @param viewportWidth - Width of the viewport
 * @param viewportHeight - Height of the viewport
 * @returns Object with scale and translate values
 */
function calculateZoomTransform(
  targetCenter: { x: number; y: number },
  zoomLevel: number,
  viewportWidth: number,
  viewportHeight: number
): {
  scale: number;
  translateX: number;
  translateY: number;
} {
  // Calculate the viewport center
  const viewportCenterX = viewportWidth / 2;
  const viewportCenterY = viewportHeight / 2;

  // Calculate how far the target is from the viewport center
  const offsetX = targetCenter.x - viewportCenterX;
  const offsetY = targetCenter.y - viewportCenterY;

  // The translation needed to center the target point
  // We need to move the content in the opposite direction of the offset
  // and account for the scaling factor
  const translateX = -offsetX;
  const translateY = -offsetY;

  return {
    scale: zoomLevel,
    translateX,
    translateY,
  };
}

/**
 * Determine the current zoom phase based on the current frame
 *
 * The zoom effect has three phases:
 * 1. zoom-in: Transitioning from no zoom to full zoom
 * 2. hold: Maintaining the zoomed view
 * 3. zoom-out: Transitioning from full zoom back to no zoom
 *
 * @param currentFrame - The current frame number
 * @param zoomConfig - The zoom configuration
 * @returns The current phase and progress within that phase
 */
export function getZoomPhase(
  currentFrame: number,
  zoomConfig: ZoomConfig
): {
  phase: 'before' | 'zoom-in' | 'hold' | 'zoom-out' | 'after';
  progress: number;
} {
  const {
    startFrame,
    endFrame,
    zoomInDuration = DEFAULT_ZOOM_IN_DURATION,
    zoomOutDuration = DEFAULT_ZOOM_OUT_DURATION,
  } = zoomConfig;

  // Before the zoom effect starts
  if (currentFrame < startFrame) {
    return { phase: 'before', progress: 0 };
  }

  // After the zoom effect ends
  if (currentFrame >= endFrame) {
    return { phase: 'after', progress: 1 };
  }

  // Calculate phase boundaries
  const zoomInEndFrame = startFrame + zoomInDuration;
  const zoomOutStartFrame = endFrame - zoomOutDuration;

  // Zoom-in phase
  if (currentFrame < zoomInEndFrame) {
    const progress = (currentFrame - startFrame) / zoomInDuration;
    return { phase: 'zoom-in', progress: clamp(progress, 0, 1) };
  }

  // Zoom-out phase
  if (currentFrame >= zoomOutStartFrame) {
    const progress = (currentFrame - zoomOutStartFrame) / zoomOutDuration;
    return { phase: 'zoom-out', progress: clamp(progress, 0, 1) };
  }

  // Hold phase (between zoom-in and zoom-out)
  return { phase: 'hold', progress: 1 };
}

/**
 * Calculate the current zoom level based on the phase and progress
 *
 * Implements smooth animated transitions between zoom phases using easing functions:
 * - zoom-in: Interpolates from scale 1 to zoomLevel using the configured easing
 * - hold: Maintains the full zoom level
 * - zoom-out: Interpolates from zoomLevel back to scale 1 using the configured easing
 *
 * The transitions are smooth with no discontinuities between phases.
 *
 * @param phase - The current zoom phase
 * @param progress - Progress within the current phase (0-1)
 * @param targetZoomLevel - The target zoom level from config
 * @param easingType - The easing function type to use (default: 'easeInOut')
 * @returns The current zoom level to apply
 *
 * Requirements: 3.4, 3.5, 3.6, 3.7
 */
export function calculateCurrentZoomLevel(
  phase: 'before' | 'zoom-in' | 'hold' | 'zoom-out' | 'after',
  progress: number,
  targetZoomLevel: number,
  easingType: EasingType = 'easeInOut'
): number {
  const validatedZoom = validateZoomLevel(targetZoomLevel);

  // Get the appropriate easing function
  const easingFn = getEasingFunction(easingType);

  switch (phase) {
    case 'before':
    case 'after':
      // No zoom applied outside the zoom period
      return 1;

    case 'zoom-in':
      // Smooth zoom-in: interpolate from scale 1 to target zoom level
      // Uses the configured easing function for smooth transitions
      // Requirements: 3.4, 3.5
      return interpolate(1, validatedZoom, progress, easingFn);

    case 'hold':
      // Full zoom during hold phase - maintain the zoomed view
      // Requirement: 3.6
      return validatedZoom;

    case 'zoom-out':
      // Smooth zoom-out: interpolate from target zoom level back to scale 1
      // Uses the configured easing function for smooth transitions
      // Requirement: 3.7
      return interpolate(validatedZoom, 1, progress, easingFn);

    default:
      return 1;
  }
}

// =============================================================================
// Main ZoomEffect Component
// =============================================================================

/**
 * ZoomEffect Component
 *
 * Wraps content and applies a zoom transformation to focus on a specific region.
 * The component calculates the appropriate CSS transform to scale and translate
 * the content so that the target region is centered and magnified.
 *
 * The zoom effect is active between startFrame and endFrame, with configurable
 * zoom-in and zoom-out durations. During the hold phase, the content remains
 * at the full zoom level.
 *
 * @param children - The content to apply the zoom transformation to
 * @param zoomConfig - Configuration for the zoom effect
 * @param currentFrame - The current frame number for animation timing
 */
export const ZoomEffect: React.FC<ZoomEffectProps> = ({
  children,
  zoomConfig,
  currentFrame,
}) => {
  const { width, height } = useVideoConfig();

  // Determine the current zoom phase and progress
  const { phase, progress } = getZoomPhase(currentFrame, zoomConfig);

  // Calculate the current zoom level based on phase with smooth easing transitions
  const currentZoomLevel = calculateCurrentZoomLevel(
    phase,
    progress,
    zoomConfig.zoomLevel,
    zoomConfig.easing
  );

  // If no zoom is applied, render children without transformation
  if (currentZoomLevel === 1) {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  // Calculate the target center point
  const targetCenter = calculateTargetCenter(zoomConfig.targetRegion);

  // Calculate the zoom transformation
  const { scale, translateX, translateY } = calculateZoomTransform(
    targetCenter,
    currentZoomLevel,
    width,
    height
  );

  // Build the CSS transform string
  // Order matters: translate first, then scale
  // This ensures the translation is applied in the original coordinate space
  const transform = `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`;

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transform,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

export default ZoomEffect;
