/**
 * CursorOverlay Component for Video Tutorial Screencasts
 *
 * Renders an animated cursor that follows recorded mouse positions from
 * capture metadata. Supports configurable cursor styles (pointer, hand, text)
 * and displays click indicators when click events occur.
 *
 * The cursor position is smoothly interpolated between recorded positions
 * using easing functions for natural-looking cursor movement.
 *
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { CursorOverlayProps, FrameData, ClickEvent } from '../types';
import { interpolatePosition, easeOut } from '../utils/easing';

// =============================================================================
// Constants
// =============================================================================

/** Default cursor style */
const DEFAULT_CURSOR_STYLE = 'pointer';

/** Default click indicator duration in milliseconds */
const DEFAULT_CLICK_INDICATOR_DURATION = 400;

/** Default smoothing factor for cursor movement */
const DEFAULT_SMOOTHING = 0.3;

/** Cursor icon size in pixels */
const CURSOR_SIZE = 24;

/** Maximum radius of the click indicator ripple in pixels */
const CLICK_INDICATOR_MAX_RADIUS = 30;

/** Number of ripple rings to display */
const CLICK_INDICATOR_RINGS = 2;

// =============================================================================
// Cursor SVG Icons
// =============================================================================

/**
 * Pointer cursor SVG (default arrow cursor)
 */
const PointerCursor: React.FC<{ color?: string }> = ({ color = '#000000' }) => (
  <svg
    width={CURSOR_SIZE}
    height={CURSOR_SIZE}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))' }}
  >
    {/* White outline for visibility */}
    <path
      d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.48 0 .72-.58.38-.92L6.35 2.85a.5.5 0 0 0-.85.36Z"
      fill="#FFFFFF"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Main cursor shape */}
    <path
      d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.48 0 .72-.58.38-.92L6.35 2.85a.5.5 0 0 0-.85.36Z"
      fill={color}
      stroke={color}
      strokeWidth="1"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Hand cursor SVG (for clickable elements)
 */
const HandCursor: React.FC<{ color?: string }> = ({ color = '#000000' }) => (
  <svg
    width={CURSOR_SIZE}
    height={CURSOR_SIZE}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))' }}
  >
    {/* White outline for visibility */}
    <path
      d="M18 8.5V17a5 5 0 0 1-5 5h-2.5a5 5 0 0 1-3.54-1.46l-4.24-4.24a1.5 1.5 0 0 1 2.12-2.12L7 16.34V5.5a1.5 1.5 0 0 1 3 0v5a1.5 1.5 0 0 1 3 0v-1a1.5 1.5 0 0 1 3 0v1a1.5 1.5 0 0 1 2 1.42V8.5a1.5 1.5 0 0 1 0 0Z"
      fill="#FFFFFF"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Main hand shape */}
    <path
      d="M18 8.5V17a5 5 0 0 1-5 5h-2.5a5 5 0 0 1-3.54-1.46l-4.24-4.24a1.5 1.5 0 0 1 2.12-2.12L7 16.34V5.5a1.5 1.5 0 0 1 3 0v5a1.5 1.5 0 0 1 3 0v-1a1.5 1.5 0 0 1 3 0v1a1.5 1.5 0 0 1 2 1.42V8.5a1.5 1.5 0 0 1 0 0Z"
      fill={color}
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Text cursor SVG (I-beam for input fields)
 */
const TextCursor: React.FC<{ color?: string }> = ({ color = '#000000' }) => (
  <svg
    width={CURSOR_SIZE}
    height={CURSOR_SIZE}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))' }}
  >
    {/* White outline for visibility */}
    <path
      d="M12 4v16M8 4h8M8 20h8"
      stroke="#FFFFFF"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Main I-beam shape */}
    <path
      d="M12 4v16M8 4h8M8 20h8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// =============================================================================
// Cursor Icon Component
// =============================================================================

/**
 * Renders the appropriate cursor icon based on style
 */
const CursorIcon: React.FC<{
  style: 'pointer' | 'hand' | 'text';
  color?: string;
}> = ({ style, color = '#000000' }) => {
  switch (style) {
    case 'hand':
      return <HandCursor color={color} />;
    case 'text':
      return <TextCursor color={color} />;
    case 'pointer':
    default:
      return <PointerCursor color={color} />;
  }
};

// =============================================================================
// Click Indicator Component
// =============================================================================

/**
 * Props for the ClickIndicator component
 */
interface ClickIndicatorProps {
  /** X coordinate of the click */
  x: number;
  /** Y coordinate of the click */
  y: number;
  /** Progress of the animation (0-1) */
  progress: number;
}

/**
 * ClickIndicator Component
 *
 * Renders a ripple effect animation at the click position.
 * The ripple expands outward and fades out over the duration.
 * Uses contrasting colors (white fill with dark outline) for visibility
 * against any background.
 *
 * Requirements: 2.3, 2.6
 */
const ClickIndicator: React.FC<ClickIndicatorProps> = ({ x, y, progress }) => {
  // Apply easing to the progress for smooth animation
  const easedProgress = easeOut(progress);

  // Calculate ripple properties based on progress
  // Ripple expands from 0 to max radius
  const radius = easedProgress * CLICK_INDICATOR_MAX_RADIUS;

  // Opacity fades out as the ripple expands
  // Start at full opacity and fade to 0
  const opacity = 1 - easedProgress;

  // Scale for the inner ring (slightly delayed)
  const innerProgress = Math.max(0, (progress - 0.1) / 0.9);
  const innerEasedProgress = easeOut(innerProgress);
  const innerRadius = innerEasedProgress * CLICK_INDICATOR_MAX_RADIUS * 0.6;
  const innerOpacity = 1 - innerEasedProgress;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Outer ripple ring */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: radius * 2,
          height: radius * 2,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          // White fill with semi-transparency for visibility on dark backgrounds
          backgroundColor: `rgba(255, 255, 255, ${opacity * 0.3})`,
          // Dark border for visibility on light backgrounds
          border: `2px solid rgba(0, 0, 0, ${opacity * 0.6})`,
          // Additional white outer glow for contrast
          boxShadow: `
            0 0 0 1px rgba(255, 255, 255, ${opacity * 0.8}),
            0 0 8px rgba(0, 0, 0, ${opacity * 0.3})
          `,
        }}
      />

      {/* Inner ripple ring (slightly delayed for layered effect) */}
      {innerProgress > 0 && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: innerRadius * 2,
            height: innerRadius * 2,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: `rgba(255, 255, 255, ${innerOpacity * 0.5})`,
            border: `1.5px solid rgba(0, 0, 0, ${innerOpacity * 0.4})`,
          }}
        />
      )}

      {/* Center dot that persists briefly */}
      {progress < 0.5 && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 8,
            height: 8,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1.5px solid rgba(0, 0, 0, 0.7)',
            boxShadow: '0 0 4px rgba(0, 0, 0, 0.3)',
            opacity: 1 - progress * 2,
          }}
        />
      )}
    </div>
  );
};

// =============================================================================
// Click Detection Utilities
// =============================================================================

/**
 * Get active click events that should display indicators at the current frame
 *
 * A click indicator is active from the frame it occurs until the duration expires.
 *
 * @param clicks - Array of click events from metadata
 * @param currentFrame - The current frame number
 * @param durationFrames - Duration of the click indicator in frames
 * @returns Array of active clicks with their animation progress
 */
function getActiveClicks(
  clicks: ClickEvent[],
  currentFrame: number,
  durationFrames: number
): Array<{ click: ClickEvent; progress: number }> {
  const activeClicks: Array<{ click: ClickEvent; progress: number }> = [];

  for (const click of clicks) {
    const framesSinceClick = currentFrame - click.frameNumber;

    // Check if this click is within the indicator duration
    if (framesSinceClick >= 0 && framesSinceClick < durationFrames) {
      const progress = framesSinceClick / durationFrames;
      activeClicks.push({ click, progress });
    }
  }

  return activeClicks;
}

// =============================================================================
// Cursor Position Smoothing Utilities
// =============================================================================

/**
 * Find the frame data entries surrounding the current frame for interpolation
 *
 * @param frames - Array of frame data from capture metadata
 * @param currentFrame - The current frame number
 * @returns Object containing previous and next frame data, or null if not found
 */
function findSurroundingFrames(
  frames: FrameData[],
  currentFrame: number
): { prev: FrameData; next: FrameData } | null {
  if (!frames || frames.length === 0) {
    return null;
  }

  // Sort frames by frame number to ensure correct order
  const sortedFrames = [...frames].sort((a, b) => a.frameNumber - b.frameNumber);

  // Find the frames that surround the current frame
  let prevFrame: FrameData | null = null;
  let nextFrame: FrameData | null = null;

  for (let i = 0; i < sortedFrames.length; i++) {
    const frame = sortedFrames[i];

    if (frame.frameNumber <= currentFrame) {
      prevFrame = frame;
    }

    if (frame.frameNumber >= currentFrame && !nextFrame) {
      nextFrame = frame;
    }

    // If we've found both, we can stop
    if (prevFrame && nextFrame && nextFrame.frameNumber > currentFrame) {
      break;
    }
  }

  // Handle edge cases
  if (!prevFrame) {
    prevFrame = sortedFrames[0];
  }
  if (!nextFrame) {
    nextFrame = sortedFrames[sortedFrames.length - 1];
  }

  return { prev: prevFrame, next: nextFrame };
}

/**
 * Calculate smoothed cursor position using interpolation between recorded positions
 *
 * This function finds the two recorded positions surrounding the current frame
 * and interpolates between them using an easing function for smooth movement.
 *
 * @param metadata - Capture metadata containing frame data
 * @param currentFrame - The current frame number
 * @param smoothing - Smoothing factor (0-1, higher = more smoothing/slower response)
 * @returns Smoothed cursor position { x, y } or null if no data available
 */
function getSmoothedPosition(
  metadata: CursorOverlayProps['metadata'],
  currentFrame: number,
  smoothing: number
): { x: number; y: number } | null {
  const surrounding = findSurroundingFrames(metadata.frames, currentFrame);

  if (!surrounding) {
    return null;
  }

  const { prev, next } = surrounding;

  // If prev and next are the same frame, return that position directly
  if (prev.frameNumber === next.frameNumber) {
    return { x: prev.mouseX, y: prev.mouseY };
  }

  // Calculate progress between the two frames
  const frameDiff = next.frameNumber - prev.frameNumber;
  const frameProgress = (currentFrame - prev.frameNumber) / frameDiff;

  // Clamp progress to [0, 1]
  const clampedProgress = Math.max(0, Math.min(1, frameProgress));

  // Apply smoothing factor to adjust the interpolation curve
  // Higher smoothing = slower response (more lag behind target)
  // We use the smoothing factor to adjust how quickly we approach the target
  // A smoothing of 0 means instant (no smoothing), 1 means maximum smoothing
  const adjustedProgress = clampedProgress * (1 - smoothing * 0.5);

  // Interpolate between previous and next positions using easeOut for natural deceleration
  const interpolated = interpolatePosition(
    prev.mouseX,
    prev.mouseY,
    next.mouseX,
    next.mouseY,
    adjustedProgress,
    easeOut
  );

  return interpolated;
}

// =============================================================================
// Main CursorOverlay Component
// =============================================================================

/**
 * CursorOverlay Component
 *
 * Renders an animated cursor overlay that follows recorded mouse positions
 * from capture metadata. The cursor position is smoothly interpolated between
 * recorded positions using easing functions for natural-looking movement.
 *
 * Also renders click indicator animations (ripple effects) when click events
 * occur in the capture metadata.
 *
 * @param metadata - Capture metadata containing mouse positions and click events
 * @param cursorStyle - Style of cursor to display (pointer, hand, text)
 * @param clickIndicatorDuration - Duration of click indicator animation in ms
 * @param smoothing - Easing factor for smooth cursor movement (0-1, default: 0.3)
 *                    Higher values = more smoothing/slower response to position changes
 */
export const CursorOverlay: React.FC<CursorOverlayProps> = ({
  metadata,
  cursorStyle = DEFAULT_CURSOR_STYLE,
  clickIndicatorDuration = DEFAULT_CLICK_INDICATOR_DURATION,
  smoothing = DEFAULT_SMOOTHING,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Convert click indicator duration from milliseconds to frames
  const clickDurationFrames = Math.ceil((clickIndicatorDuration / 1000) * fps);

  // Get smoothed mouse position for the current frame
  // This interpolates between recorded positions for smooth cursor movement
  const position = getSmoothedPosition(metadata, currentFrame, smoothing);

  // Get active click indicators (clicks that are currently animating)
  const activeClicks = getActiveClicks(metadata.clicks, currentFrame, clickDurationFrames);

  // If no position data available, don't render anything
  if (!position) {
    return null;
  }

  // Calculate cursor offset based on style
  // Pointer cursor: hotspot at top-left
  // Hand cursor: hotspot at index finger tip (offset slightly)
  // Text cursor: hotspot at center
  const getOffset = (): { x: number; y: number } => {
    switch (cursorStyle) {
      case 'hand':
        return { x: -4, y: -2 };
      case 'text':
        return { x: -CURSOR_SIZE / 2, y: -CURSOR_SIZE / 2 };
      case 'pointer':
      default:
        return { x: 0, y: 0 };
    }
  };

  const offset = getOffset();

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      {/* Click indicators - rendered behind cursor */}
      {activeClicks.map(({ click, progress }, index) => (
        <ClickIndicator
          key={`click-${click.frameNumber}-${index}`}
          x={click.x}
          y={click.y}
          progress={progress}
        />
      ))}

      {/* Cursor icon positioned at mouse coordinates */}
      <div
        style={{
          position: 'absolute',
          left: position.x + offset.x,
          top: position.y + offset.y,
          width: CURSOR_SIZE,
          height: CURSOR_SIZE,
          transform: 'translate(0, 0)',
          willChange: 'left, top',
        }}
      >
        <CursorIcon style={cursorStyle} />
      </div>
    </AbsoluteFill>
  );
};

export default CursorOverlay;
