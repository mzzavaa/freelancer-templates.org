/**
 * Property-Based Tests for CursorOverlay Component
 *
 * Uses fast-check to verify invariants for cursor rendering, animation smoothness,
 * and click indicator visibility in the CursorOverlay component.
 *
 * Properties tested in this file:
 *   1. Cursor Position Accuracy - cursor renders at recorded position ±1 pixel
 *   2. Cursor Animation Smoothness - no discontinuities between frames
 *   3. Click Indicator Visibility - indicator visible for correct duration
 *
 * Feature: video-tutorial-screencasts
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  interpolatePosition,
  easeOut,
  easeInOut,
  calculateProgress,
} from '../../utils/easing';
import type { CaptureMetadata, FrameData, ClickEvent } from '../../types';

// =============================================================================
// Constants
// =============================================================================

/** Default viewport dimensions */
const VIEWPORT_WIDTH = 1280;
const VIEWPORT_HEIGHT = 720;

/** Default FPS for testing */
const DEFAULT_FPS = 30;

/** Default click indicator duration in milliseconds */
const DEFAULT_CLICK_INDICATOR_DURATION = 400;

/** Position tolerance in pixels */
const POSITION_TOLERANCE = 1;

// =============================================================================
// Test Utilities - Extracted Logic from CursorOverlay
// =============================================================================

/**
 * Find the frame data entries surrounding the current frame for interpolation
 * (Extracted from CursorOverlay for testability)
 */
function findSurroundingFrames(
  frames: FrameData[],
  currentFrame: number
): { prev: FrameData; next: FrameData } | null {
  if (!frames || frames.length === 0) {
    return null;
  }

  const sortedFrames = [...frames].sort((a, b) => a.frameNumber - b.frameNumber);

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

    if (prevFrame && nextFrame && nextFrame.frameNumber > currentFrame) {
      break;
    }
  }

  if (!prevFrame) {
    prevFrame = sortedFrames[0];
  }
  if (!nextFrame) {
    nextFrame = sortedFrames[sortedFrames.length - 1];
  }

  return { prev: prevFrame, next: nextFrame };
}

/**
 * Calculate cursor position for a given frame
 * (Extracted from CursorOverlay for testability)
 */
function getCursorPosition(
  metadata: CaptureMetadata,
  currentFrame: number,
  smoothing: number = 0.3
): { x: number; y: number } | null {
  const surrounding = findSurroundingFrames(metadata.frames, currentFrame);

  if (!surrounding) {
    return null;
  }

  const { prev, next } = surrounding;

  if (prev.frameNumber === next.frameNumber) {
    return { x: prev.mouseX, y: prev.mouseY };
  }

  const frameDiff = next.frameNumber - prev.frameNumber;
  const frameProgress = (currentFrame - prev.frameNumber) / frameDiff;
  const clampedProgress = Math.max(0, Math.min(1, frameProgress));
  const adjustedProgress = clampedProgress * (1 - smoothing * 0.5);

  return interpolatePosition(
    prev.mouseX,
    prev.mouseY,
    next.mouseX,
    next.mouseY,
    adjustedProgress,
    easeOut
  );
}

/**
 * Get active click events that should display indicators at the current frame
 * (Extracted from CursorOverlay for testability)
 */
function getActiveClicks(
  clicks: ClickEvent[],
  currentFrame: number,
  durationFrames: number
): Array<{ click: ClickEvent; progress: number }> {
  const activeClicks: Array<{ click: ClickEvent; progress: number }> = [];

  for (const click of clicks) {
    const framesSinceClick = currentFrame - click.frameNumber;

    if (framesSinceClick >= 0 && framesSinceClick < durationFrames) {
      const progress = framesSinceClick / durationFrames;
      activeClicks.push({ click, progress });
    }
  }

  return activeClicks;
}

/**
 * Calculate click indicator opacity based on progress
 * The indicator fades out as it expands
 */
function getClickIndicatorOpacity(progress: number): number {
  const easedProgress = easeOut(progress);
  return 1 - easedProgress;
}

// =============================================================================
// Arbitraries (Generators)
// =============================================================================

/**
 * Generate a valid mouse position within viewport bounds
 */
const mousePositionArb = fc.record({
  x: fc.integer({ min: 0, max: VIEWPORT_WIDTH }),
  y: fc.integer({ min: 0, max: VIEWPORT_HEIGHT }),
});

/**
 * Generate a valid frame number
 */
const frameNumberArb = (maxFrame: number = 300) =>
  fc.integer({ min: 0, max: maxFrame });

/**
 * Generate a single FrameData entry
 */
const frameDataArb = (frameNumber: number): fc.Arbitrary<FrameData> =>
  fc.record({
    frameNumber: fc.constant(frameNumber),
    timestamp: fc.constant(frameNumber * (1000 / DEFAULT_FPS)),
    mouseX: fc.integer({ min: 0, max: VIEWPORT_WIDTH }),
    mouseY: fc.integer({ min: 0, max: VIEWPORT_HEIGHT }),
  });

/**
 * Generate a sequence of FrameData entries with increasing frame numbers
 */
const frameSequenceArb = (minFrames: number = 2, maxFrames: number = 50): fc.Arbitrary<FrameData[]> =>
  fc.integer({ min: minFrames, max: maxFrames }).chain((count) =>
    fc.array(
      fc.record({
        mouseX: fc.integer({ min: 0, max: VIEWPORT_WIDTH }),
        mouseY: fc.integer({ min: 0, max: VIEWPORT_HEIGHT }),
      }),
      { minLength: count, maxLength: count }
    ).map((positions) =>
      positions.map((pos, index) => ({
        frameNumber: index * 3, // Frames at intervals of 3
        timestamp: index * 3 * (1000 / DEFAULT_FPS),
        mouseX: pos.mouseX,
        mouseY: pos.mouseY,
      }))
    )
  );

/**
 * Generate a ClickEvent
 */
const clickEventArb = (maxFrame: number = 300): fc.Arbitrary<ClickEvent> =>
  fc.record({
    frameNumber: fc.integer({ min: 0, max: maxFrame }),
    timestamp: fc.integer({ min: 0, max: Math.floor(maxFrame * (1000 / DEFAULT_FPS)) }),
    x: fc.integer({ min: 0, max: VIEWPORT_WIDTH }),
    y: fc.integer({ min: 0, max: VIEWPORT_HEIGHT }),
    button: fc.constantFrom('left' as const, 'right' as const),
  });

/**
 * Generate CaptureMetadata with frames and clicks
 */
const captureMetadataArb = (
  minFrames: number = 2,
  maxFrames: number = 50,
  maxClicks: number = 5
): fc.Arbitrary<CaptureMetadata> =>
  frameSequenceArb(minFrames, maxFrames).chain((frames) => {
    const maxFrame = frames.length > 0 ? frames[frames.length - 1].frameNumber : 0;
    return fc.record({
      frames: fc.constant(frames),
      clicks: fc.array(clickEventArb(maxFrame), { minLength: 0, maxLength: maxClicks }),
      duration: fc.constant(maxFrame * (1000 / DEFAULT_FPS)),
      fps: fc.constant(DEFAULT_FPS),
    });
  });

// =============================================================================
// Property 1: Cursor Position Accuracy
// Feature: video-tutorial-screencasts, Property 1: Cursor Position Accuracy
// **Validates: Requirements 2.1**
// =============================================================================

describe('Property 1: Cursor Position Accuracy', () => {
  it('cursor renders at exact recorded position when frame matches exactly for 100+ inputs', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: VIEWPORT_WIDTH }),
        fc.integer({ min: 0, max: VIEWPORT_HEIGHT }),
        fc.integer({ min: 0, max: 100 }),
        (mouseX, mouseY, frameNumber) => {
          // Create metadata with a single frame at the exact position
          const metadata: CaptureMetadata = {
            frames: [
              {
                frameNumber,
                timestamp: frameNumber * (1000 / DEFAULT_FPS),
                mouseX,
                mouseY,
              },
            ],
            clicks: [],
            duration: frameNumber * (1000 / DEFAULT_FPS),
            fps: DEFAULT_FPS,
          };

          // Get cursor position at the exact frame
          const position = getCursorPosition(metadata, frameNumber, 0);

          expect(position).not.toBeNull();
          if (position) {
            // Position should match exactly when querying the exact frame
            expect(Math.abs(position.x - mouseX)).toBeLessThanOrEqual(POSITION_TOLERANCE);
            expect(Math.abs(position.y - mouseY)).toBeLessThanOrEqual(POSITION_TOLERANCE);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('cursor position stays within ±1 pixel of recorded positions for interpolated frames for 100+ inputs', () => {
    fc.assert(
      fc.property(
        captureMetadataArb(2, 20),
        (metadata) => {
          if (metadata.frames.length < 2) return true;

          // Test multiple frames within the recorded range
          const firstFrame = metadata.frames[0].frameNumber;
          const lastFrame = metadata.frames[metadata.frames.length - 1].frameNumber;

          for (let testFrame = firstFrame; testFrame <= lastFrame; testFrame++) {
            const position = getCursorPosition(metadata, testFrame, 0);

            if (position) {
              // Find surrounding recorded frames
              const surrounding = findSurroundingFrames(metadata.frames, testFrame);
              if (surrounding) {
                const { prev, next } = surrounding;

                // Position should be between prev and next (within tolerance)
                const minX = Math.min(prev.mouseX, next.mouseX) - POSITION_TOLERANCE;
                const maxX = Math.max(prev.mouseX, next.mouseX) + POSITION_TOLERANCE;
                const minY = Math.min(prev.mouseY, next.mouseY) - POSITION_TOLERANCE;
                const maxY = Math.max(prev.mouseY, next.mouseY) + POSITION_TOLERANCE;

                expect(position.x).toBeGreaterThanOrEqual(minX);
                expect(position.x).toBeLessThanOrEqual(maxX);
                expect(position.y).toBeGreaterThanOrEqual(minY);
                expect(position.y).toBeLessThanOrEqual(maxY);
              }
            }
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('cursor position at recorded frame matches recorded position within ±1 pixel for 100+ inputs', () => {
    fc.assert(
      fc.property(
        captureMetadataArb(5, 30),
        fc.integer({ min: 0, max: 4 }), // Index into frames array
        (metadata, frameIndex) => {
          if (metadata.frames.length === 0) return true;

          const safeIndex = frameIndex % metadata.frames.length;
          const targetFrame = metadata.frames[safeIndex];

          const position = getCursorPosition(metadata, targetFrame.frameNumber, 0);

          expect(position).not.toBeNull();
          if (position) {
            expect(Math.abs(position.x - targetFrame.mouseX)).toBeLessThanOrEqual(POSITION_TOLERANCE);
            expect(Math.abs(position.y - targetFrame.mouseY)).toBeLessThanOrEqual(POSITION_TOLERANCE);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// =============================================================================
// Property 2: Cursor Animation Smoothness
// Feature: video-tutorial-screencasts, Property 2: Cursor Animation Smoothness
// **Validates: Requirements 2.2**
// =============================================================================

describe('Property 2: Cursor Animation Smoothness', () => {
  it('interpolated positions have no discontinuities greater than linear distance for 100+ inputs', () => {
    fc.assert(
      fc.property(
        captureMetadataArb(2, 20),
        (metadata) => {
          if (metadata.frames.length < 2) return true;

          const firstFrame = metadata.frames[0].frameNumber;
          const lastFrame = metadata.frames[metadata.frames.length - 1].frameNumber;

          let prevPosition: { x: number; y: number } | null = null;
          let prevSurrounding: { prev: FrameData; next: FrameData } | null = null;

          // Check consecutive frames for discontinuities
          for (let frame = firstFrame; frame <= lastFrame; frame++) {
            const position = getCursorPosition(metadata, frame, 0);
            const surrounding = findSurroundingFrames(metadata.frames, frame);

            if (position && prevPosition && surrounding && prevSurrounding) {
              // Check if we're in the same segment (between same two recorded frames)
              const sameSegment = 
                prevSurrounding.prev.frameNumber === surrounding.prev.frameNumber &&
                prevSurrounding.next.frameNumber === surrounding.next.frameNumber;

              if (sameSegment) {
                // Within the same segment, the distance between consecutive frames
                // should be bounded by the total segment distance
                const segmentDistance = Math.sqrt(
                  Math.pow(surrounding.next.mouseX - surrounding.prev.mouseX, 2) +
                  Math.pow(surrounding.next.mouseY - surrounding.prev.mouseY, 2)
                );

                const frameDistance = Math.sqrt(
                  Math.pow(position.x - prevPosition.x, 2) +
                  Math.pow(position.y - prevPosition.y, 2)
                );

                // Each frame step should be a fraction of the total segment distance
                // With tolerance for floating point and easing variations
                const frameFraction = 1 / (surrounding.next.frameNumber - surrounding.prev.frameNumber);
                const maxExpectedDistance = segmentDistance * frameFraction * 3; // Allow 3x for easing acceleration

                expect(frameDistance).toBeLessThanOrEqual(maxExpectedDistance + POSITION_TOLERANCE);
              }
            }

            prevPosition = position;
            prevSurrounding = surrounding;
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('cursor position changes monotonically along interpolation path for 100+ inputs', () => {
    fc.assert(
      fc.property(
        // Generate two distinct positions
        fc.integer({ min: 0, max: VIEWPORT_WIDTH }),
        fc.integer({ min: 0, max: VIEWPORT_HEIGHT }),
        fc.integer({ min: 0, max: VIEWPORT_WIDTH }),
        fc.integer({ min: 0, max: VIEWPORT_HEIGHT }),
        fc.integer({ min: 10, max: 30 }), // Frame gap
        (x1, y1, x2, y2, frameGap) => {
          const metadata: CaptureMetadata = {
            frames: [
              { frameNumber: 0, timestamp: 0, mouseX: x1, mouseY: y1 },
              { frameNumber: frameGap, timestamp: frameGap * (1000 / DEFAULT_FPS), mouseX: x2, mouseY: y2 },
            ],
            clicks: [],
            duration: frameGap * (1000 / DEFAULT_FPS),
            fps: DEFAULT_FPS,
          };

          // Sample positions along the path
          const positions: Array<{ x: number; y: number }> = [];
          for (let frame = 0; frame <= frameGap; frame++) {
            const pos = getCursorPosition(metadata, frame, 0);
            if (pos) positions.push(pos);
          }

          // Check that positions progress smoothly (distance from start increases or stays same)
          let prevDistFromStart = 0;
          for (let i = 1; i < positions.length; i++) {
            const distFromStart = Math.sqrt(
              Math.pow(positions[i].x - x1, 2) +
              Math.pow(positions[i].y - y1, 2)
            );

            // Distance from start should generally increase (with tolerance for easing)
            // Allow small decreases due to easing function characteristics
            expect(distFromStart).toBeGreaterThanOrEqual(prevDistFromStart - POSITION_TOLERANCE);
            prevDistFromStart = distFromStart;
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('easing function produces smooth output without jumps for 100+ inputs', () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(0), max: Math.fround(1), noNaN: true }),
        fc.float({ min: Math.fround(0.001), max: Math.fround(0.1), noNaN: true }), // Small delta
        (t, delta) => {
          const t1 = Math.min(t, 1);
          const t2 = Math.min(t + delta, 1);

          const eased1 = easeOut(t1);
          const eased2 = easeOut(t2);

          // Eased values should change smoothly (no large jumps)
          // The change in eased value should be proportional to input change
          const easedDelta = Math.abs(eased2 - eased1);

          // For easeOut, the derivative is bounded, so change should be reasonable
          // Maximum derivative of cubic easeOut is 3 at t=0
          expect(easedDelta).toBeLessThanOrEqual(delta * 4);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// =============================================================================
// Property 3: Click Indicator Visibility
// Feature: video-tutorial-screencasts, Property 3: Click Indicator Visibility
// **Validates: Requirements 2.3**
// =============================================================================

describe('Property 3: Click Indicator Visibility', () => {
  it('click indicator is active from click frame through duration for 100+ inputs', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 200 }), // Click frame
        fc.integer({ min: 300, max: 500 }), // Duration in ms
        fc.integer({ min: 24, max: 60 }), // FPS
        (clickFrame, durationMs, fps) => {
          const click: ClickEvent = {
            frameNumber: clickFrame,
            timestamp: clickFrame * (1000 / fps),
            x: 100,
            y: 100,
            button: 'left',
          };

          const durationFrames = Math.ceil((durationMs / 1000) * fps);

          // Test frames within the indicator duration
          for (let frame = clickFrame; frame < clickFrame + durationFrames; frame++) {
            const activeClicks = getActiveClicks([click], frame, durationFrames);

            expect(activeClicks.length).toBe(1);
            expect(activeClicks[0].click).toBe(click);

            // Progress should be between 0 and 1
            expect(activeClicks[0].progress).toBeGreaterThanOrEqual(0);
            expect(activeClicks[0].progress).toBeLessThan(1);

            // Opacity should be > 0 (visible)
            const opacity = getClickIndicatorOpacity(activeClicks[0].progress);
            expect(opacity).toBeGreaterThan(0);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('click indicator is not active before click frame for 100+ inputs', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 10, max: 200 }), // Click frame (min 10 to have frames before)
        fc.integer({ min: 300, max: 500 }), // Duration in ms
        fc.integer({ min: 24, max: 60 }), // FPS
        (clickFrame, durationMs, fps) => {
          const click: ClickEvent = {
            frameNumber: clickFrame,
            timestamp: clickFrame * (1000 / fps),
            x: 100,
            y: 100,
            button: 'left',
          };

          const durationFrames = Math.ceil((durationMs / 1000) * fps);

          // Test frames before the click
          for (let frame = 0; frame < clickFrame; frame++) {
            const activeClicks = getActiveClicks([click], frame, durationFrames);
            expect(activeClicks.length).toBe(0);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('click indicator is not active after duration expires for 100+ inputs', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }), // Click frame
        fc.integer({ min: 300, max: 500 }), // Duration in ms
        fc.integer({ min: 24, max: 60 }), // FPS
        (clickFrame, durationMs, fps) => {
          const click: ClickEvent = {
            frameNumber: clickFrame,
            timestamp: clickFrame * (1000 / fps),
            x: 100,
            y: 100,
            button: 'left',
          };

          const durationFrames = Math.ceil((durationMs / 1000) * fps);
          const endFrame = clickFrame + durationFrames;

          // Test frames after the indicator duration
          for (let frame = endFrame; frame < endFrame + 20; frame++) {
            const activeClicks = getActiveClicks([click], frame, durationFrames);
            expect(activeClicks.length).toBe(0);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('click indicator duration matches configured duration in frames for 100+ inputs', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }), // Click frame
        fc.integer({ min: 200, max: 600 }), // Duration in ms
        fc.integer({ min: 24, max: 60 }), // FPS
        (clickFrame, durationMs, fps) => {
          const click: ClickEvent = {
            frameNumber: clickFrame,
            timestamp: clickFrame * (1000 / fps),
            x: 100,
            y: 100,
            button: 'left',
          };

          const durationFrames = Math.ceil((durationMs / 1000) * fps);

          // Count frames where indicator is active
          let activeFrameCount = 0;
          for (let frame = 0; frame < clickFrame + durationFrames + 10; frame++) {
            const activeClicks = getActiveClicks([click], frame, durationFrames);
            if (activeClicks.length > 0) {
              activeFrameCount++;
            }
          }

          // Active frame count should equal duration in frames
          expect(activeFrameCount).toBe(durationFrames);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('multiple clicks can have overlapping indicators for 100+ inputs', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 50 }), // First click frame
        fc.integer({ min: 1, max: 10 }), // Gap between clicks
        fc.integer({ min: 300, max: 500 }), // Duration in ms
        (firstClickFrame, gap, durationMs) => {
          const fps = DEFAULT_FPS;
          const durationFrames = Math.ceil((durationMs / 1000) * fps);

          // Create two clicks close together
          const click1: ClickEvent = {
            frameNumber: firstClickFrame,
            timestamp: firstClickFrame * (1000 / fps),
            x: 100,
            y: 100,
            button: 'left',
          };

          const secondClickFrame = firstClickFrame + gap;
          const click2: ClickEvent = {
            frameNumber: secondClickFrame,
            timestamp: secondClickFrame * (1000 / fps),
            x: 200,
            y: 200,
            button: 'left',
          };

          // If gap is less than duration, there should be frames with both active
          if (gap < durationFrames) {
            // Find a frame where both should be active
            const overlapFrame = secondClickFrame + Math.floor(gap / 2);
            const activeClicks = getActiveClicks([click1, click2], overlapFrame, durationFrames);

            // Both clicks should be active if we're within both durations
            const click1Active = overlapFrame >= firstClickFrame && overlapFrame < firstClickFrame + durationFrames;
            const click2Active = overlapFrame >= secondClickFrame && overlapFrame < secondClickFrame + durationFrames;

            if (click1Active && click2Active) {
              expect(activeClicks.length).toBe(2);
            }
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
