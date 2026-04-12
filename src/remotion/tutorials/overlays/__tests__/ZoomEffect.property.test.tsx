/**
 * Property-Based Tests for ZoomEffect Component
 *
 * Uses fast-check to verify invariants for zoom transition smoothness,
 * ensuring scale interpolates smoothly with no discontinuities between frames.
 *
 * Properties tested in this file:
 *   4. Zoom Transition Smoothness - scale interpolates smoothly with no discontinuities
 *
 * Feature: video-tutorial-screencasts
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  getZoomPhase,
  calculateCurrentZoomLevel,
} from '../ZoomEffect';
import {
  easeInOut,
  easeOut,
  spring,
  interpolate,
  getEasingFunction,
} from '../../utils/easing';
import type { ZoomConfig, EasingType } from '../../types';

// =============================================================================
// Constants
// =============================================================================

/** Minimum allowed zoom level */
const MIN_ZOOM_LEVEL = 1.5;

/** Maximum allowed zoom level */
const MAX_ZOOM_LEVEL = 4.0;

/** Default zoom-in duration in frames */
const DEFAULT_ZOOM_IN_DURATION = 15;

/** Default zoom-out duration in frames */
const DEFAULT_ZOOM_OUT_DURATION = 15;

/** Floating point tolerance for comparisons */
const FLOAT_TOLERANCE = 1e-6;

/** Default FPS for testing */
const DEFAULT_FPS = 30;

// =============================================================================
// Arbitraries (Generators)
// =============================================================================

/**
 * Generate a valid zoom level within the allowed range (1.5 to 4.0)
 */
const zoomLevelArb = fc.float({
  min: MIN_ZOOM_LEVEL,
  max: MAX_ZOOM_LEVEL,
  noNaN: true,
});

/**
 * Generate a valid easing type
 */
const easingTypeArb: fc.Arbitrary<EasingType> = fc.constantFrom(
  'easeInOut' as const,
  'easeOut' as const,
  'spring' as const
);

/**
 * Generate non-spring easing types for tests that require monotonic behavior
 */
const nonSpringEasingArb: fc.Arbitrary<EasingType> = fc.constantFrom(
  'easeInOut' as const,
  'easeOut' as const
);

/**
 * Generate a valid frame number
 */
const frameNumberArb = (maxFrame: number = 300) =>
  fc.integer({ min: 0, max: maxFrame });

/**
 * Generate a valid zoom duration in frames (reasonable range for animations)
 */
const zoomDurationArb = fc.integer({ min: 5, max: 60 });

/**
 * Generate a valid hold duration in frames
 */
const holdDurationArb = fc.integer({ min: 0, max: 120 });

/**
 * Generate a valid target region
 */
const targetRegionArb = fc.record({
  x: fc.integer({ min: 0, max: 1280 }),
  y: fc.integer({ min: 0, max: 720 }),
  width: fc.option(fc.integer({ min: 50, max: 500 }), { nil: undefined }),
  height: fc.option(fc.integer({ min: 50, max: 400 }), { nil: undefined }),
});

/**
 * Generate a valid ZoomConfig with consistent frame ranges
 */
const zoomConfigArb: fc.Arbitrary<ZoomConfig> = fc
  .record({
    startFrame: fc.integer({ min: 0, max: 100 }),
    zoomInDuration: zoomDurationArb,
    holdDuration: holdDurationArb,
    zoomOutDuration: zoomDurationArb,
    zoomLevel: zoomLevelArb,
    targetRegion: targetRegionArb,
    easing: fc.option(easingTypeArb, { nil: undefined }),
  })
  .map((config) => {
    // Calculate endFrame based on durations to ensure valid config
    const zoomInDuration = config.zoomInDuration ?? DEFAULT_ZOOM_IN_DURATION;
    const holdDuration = config.holdDuration ?? 0;
    const zoomOutDuration = config.zoomOutDuration ?? DEFAULT_ZOOM_OUT_DURATION;
    const endFrame = config.startFrame + zoomInDuration + holdDuration + zoomOutDuration;

    return {
      startFrame: config.startFrame,
      endFrame,
      zoomLevel: config.zoomLevel,
      targetRegion: config.targetRegion,
      zoomInDuration,
      holdDuration,
      zoomOutDuration,
      easing: config.easing,
    };
  });

/**
 * Generate a ZoomConfig with non-spring easing for monotonic tests
 */
const zoomConfigNonSpringArb: fc.Arbitrary<ZoomConfig> = fc
  .record({
    startFrame: fc.integer({ min: 0, max: 100 }),
    zoomInDuration: zoomDurationArb,
    holdDuration: holdDurationArb,
    zoomOutDuration: zoomDurationArb,
    zoomLevel: zoomLevelArb,
    targetRegion: targetRegionArb,
    easing: fc.option(nonSpringEasingArb, { nil: undefined }),
  })
  .map((config) => {
    const zoomInDuration = config.zoomInDuration ?? DEFAULT_ZOOM_IN_DURATION;
    const holdDuration = config.holdDuration ?? 0;
    const zoomOutDuration = config.zoomOutDuration ?? DEFAULT_ZOOM_OUT_DURATION;
    const endFrame = config.startFrame + zoomInDuration + holdDuration + zoomOutDuration;

    return {
      startFrame: config.startFrame,
      endFrame,
      zoomLevel: config.zoomLevel,
      targetRegion: config.targetRegion,
      zoomInDuration,
      holdDuration,
      zoomOutDuration,
      easing: config.easing,
    };
  });

// =============================================================================
// Property 4: Zoom Transition Smoothness
// Feature: video-tutorial-screencasts, Property 4: Zoom Transition Smoothness
// **Validates: Requirements 3.1, 3.4, 3.6, 3.7**
// =============================================================================

describe('Property 4: Zoom Transition Smoothness', () => {
  it('scale monotonically increases during zoom-in phase (non-spring easing) for 100+ inputs', () => {
    fc.assert(
      fc.property(zoomConfigNonSpringArb, (config) => {
        const { startFrame, zoomLevel, zoomInDuration = DEFAULT_ZOOM_IN_DURATION, easing } = config;
        const zoomInEndFrame = startFrame + zoomInDuration;

        // Test multiple frames during zoom-in phase
        let prevScale: number | null = null;

        for (let frame = startFrame; frame < zoomInEndFrame; frame++) {
          const { phase, progress } = getZoomPhase(frame, config);
          const currentScale = calculateCurrentZoomLevel(phase, progress, zoomLevel, easing);

          // Scale should be monotonically increasing during zoom-in (for non-spring easing)
          if (prevScale !== null) {
            expect(currentScale).toBeGreaterThanOrEqual(prevScale - FLOAT_TOLERANCE);
          }

          // Scale should start at 1.0 and approach zoomLevel
          expect(currentScale).toBeGreaterThanOrEqual(1.0 - FLOAT_TOLERANCE);
          expect(currentScale).toBeLessThanOrEqual(zoomLevel + FLOAT_TOLERANCE);

          prevScale = currentScale;
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('scale remains constant at zoomLevel during hold phase for 100+ inputs', () => {
    fc.assert(
      fc.property(
        zoomConfigArb.filter((config) => (config.holdDuration ?? 0) > 0),
        (config) => {
          const {
            startFrame,
            zoomLevel,
            zoomInDuration = DEFAULT_ZOOM_IN_DURATION,
            zoomOutDuration = DEFAULT_ZOOM_OUT_DURATION,
            easing,
          } = config;

          const holdStartFrame = startFrame + zoomInDuration;
          const holdEndFrame = config.endFrame - zoomOutDuration;

          // Test multiple frames during hold phase
          for (let frame = holdStartFrame; frame < holdEndFrame; frame++) {
            const { phase, progress } = getZoomPhase(frame, config);
            const currentScale = calculateCurrentZoomLevel(phase, progress, zoomLevel, easing);

            // During hold phase, scale should be constant at zoomLevel
            expect(phase).toBe('hold');
            expect(currentScale).toBeCloseTo(zoomLevel, 5);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('scale monotonically decreases during zoom-out phase (non-spring easing) for 100+ inputs', () => {
    fc.assert(
      fc.property(zoomConfigNonSpringArb, (config) => {
        const {
          endFrame,
          zoomLevel,
          zoomOutDuration = DEFAULT_ZOOM_OUT_DURATION,
          easing,
        } = config;

        const zoomOutStartFrame = endFrame - zoomOutDuration;

        // Test multiple frames during zoom-out phase
        let prevScale: number | null = null;

        for (let frame = zoomOutStartFrame; frame < endFrame; frame++) {
          const { phase, progress } = getZoomPhase(frame, config);
          const currentScale = calculateCurrentZoomLevel(phase, progress, zoomLevel, easing);

          // Scale should be monotonically decreasing during zoom-out (for non-spring easing)
          if (prevScale !== null) {
            expect(currentScale).toBeLessThanOrEqual(prevScale + FLOAT_TOLERANCE);
          }

          // Scale should be between 1.0 and zoomLevel
          expect(currentScale).toBeGreaterThanOrEqual(1.0 - FLOAT_TOLERANCE);
          expect(currentScale).toBeLessThanOrEqual(zoomLevel + FLOAT_TOLERANCE);

          prevScale = currentScale;
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('consecutive frames have bounded scale changes (smoothness property) for 100+ inputs', () => {
    fc.assert(
      fc.property(zoomConfigArb, (config) => {
        const { startFrame, endFrame, zoomLevel, easing } = config;

        let prevScale: number | null = null;

        // Test all frames from before start to after end
        const testStartFrame = Math.max(0, startFrame - 5);
        const testEndFrame = endFrame + 5;

        for (let frame = testStartFrame; frame <= testEndFrame; frame++) {
          const { phase, progress } = getZoomPhase(frame, config);
          const currentScale = calculateCurrentZoomLevel(phase, progress, zoomLevel, easing);

          if (prevScale !== null) {
            // The key smoothness property: consecutive frames should not have
            // arbitrarily large jumps. The maximum change depends on the zoom range
            // and the animation duration.
            const zoomRange = zoomLevel - 1.0;
            
            // Calculate minimum duration (shortest phase)
            const minDuration = Math.min(
              config.zoomInDuration ?? DEFAULT_ZOOM_IN_DURATION,
              config.zoomOutDuration ?? DEFAULT_ZOOM_OUT_DURATION
            );
            
            // Maximum theoretical change per frame is zoomRange / minDuration
            // We allow 3x this for easing acceleration and 15x for spring oscillation
            // Plus a small absolute tolerance for floating point precision
            const baseMaxChange = zoomRange / minDuration;
            const maxExpectedChange = easing === 'spring' 
              ? baseMaxChange * 15 + 1.0  // Spring can oscillate significantly
              : baseMaxChange * 3 + 0.1;   // Non-spring has bounded acceleration

            const actualChange = Math.abs(currentScale - prevScale);

            // The change between consecutive frames should be bounded
            expect(actualChange).toBeLessThanOrEqual(maxExpectedChange);
          }

          prevScale = currentScale;
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('scale is exactly 1.0 before startFrame and after endFrame for 100+ inputs', () => {
    fc.assert(
      fc.property(
        zoomConfigArb,
        fc.integer({ min: 1, max: 20 }), // frames before start
        fc.integer({ min: 1, max: 20 }), // frames after end
        (config, framesBefore, framesAfter) => {
          const { startFrame, endFrame, zoomLevel, easing } = config;

          // Test frames before the zoom effect
          for (let frame = Math.max(0, startFrame - framesBefore); frame < startFrame; frame++) {
            const { phase, progress } = getZoomPhase(frame, config);
            const currentScale = calculateCurrentZoomLevel(phase, progress, zoomLevel, easing);

            expect(phase).toBe('before');
            expect(currentScale).toBe(1.0);
          }

          // Test frames after the zoom effect
          for (let frame = endFrame; frame < endFrame + framesAfter; frame++) {
            const { phase, progress } = getZoomPhase(frame, config);
            const currentScale = calculateCurrentZoomLevel(phase, progress, zoomLevel, easing);

            expect(phase).toBe('after');
            expect(currentScale).toBe(1.0);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('zoom level is clamped to valid range (1.5 to 4.0) for 100+ inputs', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0.5, max: 10.0, noNaN: true }), // Test with out-of-range values
        fc.constantFrom('zoom-in' as const, 'hold' as const, 'zoom-out' as const),
        fc.float({ min: 0, max: 1, noNaN: true }),
        nonSpringEasingArb, // Use non-spring for predictable bounds
        (requestedZoomLevel, phase, progress, easing) => {
          const currentScale = calculateCurrentZoomLevel(phase, progress, requestedZoomLevel, easing);

          // The resulting scale should always be within valid bounds
          const clampedZoomLevel = Math.max(MIN_ZOOM_LEVEL, Math.min(MAX_ZOOM_LEVEL, requestedZoomLevel));

          if (phase === 'hold') {
            // During hold, scale should be at the clamped zoom level
            expect(currentScale).toBeCloseTo(clampedZoomLevel, 5);
          } else {
            // During transitions, scale should be between 1.0 and clamped zoom level
            expect(currentScale).toBeGreaterThanOrEqual(1.0 - FLOAT_TOLERANCE);
            expect(currentScale).toBeLessThanOrEqual(clampedZoomLevel + FLOAT_TOLERANCE);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('easing functions produce smooth output without jumps for 100+ inputs', () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(0), max: Math.fround(0.99), noNaN: true }),
        fc.float({ min: Math.fround(0.001), max: Math.fround(0.05), noNaN: true }), // Small delta
        nonSpringEasingArb, // Non-spring for predictable behavior
        (t, delta, easingType) => {
          const t1 = Math.min(t, 1);
          const t2 = Math.min(t + delta, 1);

          const easingFn = getEasingFunction(easingType);
          const eased1 = easingFn(t1);
          const eased2 = easingFn(t2);

          // Eased values should change smoothly (no large jumps)
          const easedDelta = Math.abs(eased2 - eased1);

          // For cubic easing functions, the derivative is bounded by ~3
          // So the change should be at most ~3x the input change
          expect(easedDelta).toBeLessThanOrEqual(delta * 4);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('phase transitions are continuous at boundaries for 100+ inputs', () => {
    fc.assert(
      fc.property(zoomConfigNonSpringArb, (config) => {
        const {
          startFrame,
          endFrame,
          zoomLevel,
          zoomInDuration = DEFAULT_ZOOM_IN_DURATION,
          zoomOutDuration = DEFAULT_ZOOM_OUT_DURATION,
          easing,
        } = config;

        // Test transition from before to zoom-in
        if (startFrame > 0) {
          const scaleBefore = calculateCurrentZoomLevel('before', 0, zoomLevel, easing);
          const { phase: phaseAtStart, progress: progressAtStart } = getZoomPhase(startFrame, config);
          const scaleAtStart = calculateCurrentZoomLevel(phaseAtStart, progressAtStart, zoomLevel, easing);

          // Both should be at or near 1.0 (no jump)
          expect(scaleBefore).toBe(1.0);
          expect(scaleAtStart).toBeCloseTo(1.0, 1); // At start of zoom-in, should be near 1.0
        }

        // Test transition from hold to zoom-out (if hold exists)
        const holdDuration = config.holdDuration ?? 0;
        if (holdDuration > 0) {
          const zoomOutStartFrame = endFrame - zoomOutDuration;
          
          // Last frame of hold
          const { phase: phaseBeforeZoomOut, progress: progressBeforeZoomOut } = getZoomPhase(
            zoomOutStartFrame - 1,
            config
          );
          const scaleBeforeZoomOut = calculateCurrentZoomLevel(
            phaseBeforeZoomOut,
            progressBeforeZoomOut,
            zoomLevel,
            easing
          );

          // First frame of zoom-out
          const { phase: phaseAtZoomOut, progress: progressAtZoomOut } = getZoomPhase(
            zoomOutStartFrame,
            config
          );
          const scaleAtZoomOut = calculateCurrentZoomLevel(
            phaseAtZoomOut,
            progressAtZoomOut,
            zoomLevel,
            easing
          );

          // Both should be at or near zoomLevel (no jump)
          expect(scaleBeforeZoomOut).toBeCloseTo(zoomLevel, 1);
          expect(scaleAtZoomOut).toBeCloseTo(zoomLevel, 1);
        }

        // Test transition from zoom-out to after
        const scaleAfterEnd = calculateCurrentZoomLevel('after', 1, zoomLevel, easing);
        expect(scaleAfterEnd).toBe(1.0);

        return true;
      }),
      { numRuns: 100 }
    );
  });
});
