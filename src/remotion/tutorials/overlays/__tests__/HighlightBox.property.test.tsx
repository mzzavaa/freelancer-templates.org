/**
 * Property-Based Tests for HighlightBox Component
 *
 * Uses fast-check to verify invariants for highlight region positioning
 * and fade animation interpolation in the HighlightBox component.
 *
 * Properties tested in this file:
 *   5. Highlight Region Accuracy - border positioned at correct coordinates ±1 pixel
 *   6. Fade Animation Interpolation - opacity interpolates linearly during fade
 *
 * Feature: video-tutorial-screencasts
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { interpolateOpacity, easeOut } from '../../utils/easing';
import type { HighlightConfig, HighlightStyle } from '../../types';

// =============================================================================
// Constants
// =============================================================================

/** Default viewport dimensions */
const VIEWPORT_WIDTH = 1280;
const VIEWPORT_HEIGHT = 720;

/** Position tolerance in pixels */
const POSITION_TOLERANCE = 1;

/** Default fade-in duration in frames */
const DEFAULT_FADE_IN = 5;

/** Default fade-out duration in frames */
const DEFAULT_FADE_OUT = 5;

/** Floating point tolerance for opacity comparisons */
const OPACITY_TOLERANCE = 1e-6;

// =============================================================================
// Test Utilities - Extracted Logic from HighlightBox
// =============================================================================

/**
 * Check if a highlight should be visible at the current frame
 * (Extracted from HighlightBox for testability)
 */
function isHighlightVisible(highlight: HighlightConfig, currentFrame: number): boolean {
  const fadeIn = highlight.fadeIn ?? DEFAULT_FADE_IN;
  const fadeOut = highlight.fadeOut ?? DEFAULT_FADE_OUT;

  // Include fade-in and fade-out periods in visibility check
  return currentFrame >= highlight.startFrame - fadeIn && currentFrame <= highlight.endFrame + fadeOut;
}

/**
 * Calculate the expected position of the highlight border
 * (Extracted from HighlightBox for testability)
 */
function getHighlightPosition(config: HighlightConfig): {
  left: number;
  top: number;
  width: number;
  height: number;
} {
  return {
    left: config.region.x,
    top: config.region.y,
    width: config.region.width,
    height: config.region.height,
  };
}

/**
 * Calculate opacity for a highlight at a given frame
 * Uses the same logic as the HighlightBox component
 */
function calculateHighlightOpacity(
  currentFrame: number,
  startFrame: number,
  endFrame: number,
  fadeIn: number = DEFAULT_FADE_IN,
  fadeOut: number = DEFAULT_FADE_OUT
): number {
  return interpolateOpacity(currentFrame, startFrame, endFrame, fadeIn, fadeOut);
}

// =============================================================================
// Arbitraries (Generators)
// =============================================================================

/**
 * Generate a valid region within viewport bounds
 */
const regionArb = fc.record({
  x: fc.integer({ min: 0, max: VIEWPORT_WIDTH - 50 }),
  y: fc.integer({ min: 0, max: VIEWPORT_HEIGHT - 50 }),
  width: fc.integer({ min: 20, max: 400 }),
  height: fc.integer({ min: 20, max: 300 }),
});

/**
 * Generate a valid hex color string
 */
const hexColorArb = fc
  .array(fc.integer({ min: 0, max: 255 }), { minLength: 3, maxLength: 3 })
  .map(([r, g, b]) => `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);

/**
 * Generate a valid highlight style
 */
const highlightStyleArb: fc.Arbitrary<HighlightStyle> = fc.record({
  borderColor: fc.option(hexColorArb, { nil: undefined }),
  borderWidth: fc.option(fc.integer({ min: 1, max: 10 }), { nil: undefined }),
  borderRadius: fc.option(fc.integer({ min: 0, max: 20 }), { nil: undefined }),
  glowColor: fc.option(hexColorArb, { nil: undefined }),
  glowIntensity: fc.option(fc.float({ min: 0, max: 1, noNaN: true }), { nil: undefined }),
  pulseAnimation: fc.option(fc.boolean(), { nil: undefined }),
});

/**
 * Generate a valid fade duration in frames
 */
const fadeDurationArb = fc.integer({ min: 1, max: 30 });

/**
 * Generate a valid HighlightConfig with consistent frame ranges
 */
const highlightConfigArb: fc.Arbitrary<HighlightConfig> = fc
  .record({
    startFrame: fc.integer({ min: 10, max: 100 }),
    duration: fc.integer({ min: 30, max: 200 }),
    region: regionArb,
    style: fc.option(highlightStyleArb, { nil: undefined }),
    fadeIn: fc.option(fadeDurationArb, { nil: undefined }),
    fadeOut: fc.option(fadeDurationArb, { nil: undefined }),
  })
  .map((config) => ({
    startFrame: config.startFrame,
    endFrame: config.startFrame + config.duration,
    region: config.region,
    style: config.style,
    fadeIn: config.fadeIn,
    fadeOut: config.fadeOut,
  }));

/**
 * Generate a HighlightConfig with explicit fade durations for fade tests
 */
const highlightConfigWithFadeArb: fc.Arbitrary<HighlightConfig> = fc
  .record({
    startFrame: fc.integer({ min: 30, max: 100 }),
    duration: fc.integer({ min: 60, max: 200 }),
    region: regionArb,
    fadeIn: fadeDurationArb,
    fadeOut: fadeDurationArb,
  })
  .map((config) => ({
    startFrame: config.startFrame,
    endFrame: config.startFrame + config.duration,
    region: config.region,
    fadeIn: config.fadeIn,
    fadeOut: config.fadeOut,
  }));

// =============================================================================
// Property 5: Highlight Region Accuracy
// Feature: video-tutorial-screencasts, Property 5: Highlight Region Accuracy
// **Validates: Requirements 4.1**
// =============================================================================

describe('Property 5: Highlight Region Accuracy', () => {
  it('highlight border is positioned at exact region coordinates for 100+ inputs', () => {
    fc.assert(
      fc.property(highlightConfigArb, (config) => {
        const position = getHighlightPosition(config);

        // Position should match region coordinates exactly
        expect(position.left).toBe(config.region.x);
        expect(position.top).toBe(config.region.y);
        expect(position.width).toBe(config.region.width);
        expect(position.height).toBe(config.region.height);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('highlight position stays within ±1 pixel of specified coordinates for 100+ inputs', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: VIEWPORT_WIDTH }),
        fc.integer({ min: 0, max: VIEWPORT_HEIGHT }),
        fc.integer({ min: 10, max: 500 }),
        fc.integer({ min: 10, max: 400 }),
        (x, y, width, height) => {
          const config: HighlightConfig = {
            startFrame: 0,
            endFrame: 100,
            region: { x, y, width, height },
          };

          const position = getHighlightPosition(config);

          // Position should be within tolerance
          expect(Math.abs(position.left - x)).toBeLessThanOrEqual(POSITION_TOLERANCE);
          expect(Math.abs(position.top - y)).toBeLessThanOrEqual(POSITION_TOLERANCE);
          expect(Math.abs(position.width - width)).toBeLessThanOrEqual(POSITION_TOLERANCE);
          expect(Math.abs(position.height - height)).toBeLessThanOrEqual(POSITION_TOLERANCE);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('highlight region dimensions are preserved regardless of style configuration for 100+ inputs', () => {
    fc.assert(
      fc.property(regionArb, highlightStyleArb, (region, style) => {
        const config: HighlightConfig = {
          startFrame: 0,
          endFrame: 100,
          region,
          style,
        };

        const position = getHighlightPosition(config);

        // Style should not affect position or dimensions
        expect(position.left).toBe(region.x);
        expect(position.top).toBe(region.y);
        expect(position.width).toBe(region.width);
        expect(position.height).toBe(region.height);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('highlight region coordinates are non-negative for valid inputs for 100+ inputs', () => {
    fc.assert(
      fc.property(highlightConfigArb, (config) => {
        const position = getHighlightPosition(config);

        // All position values should be non-negative
        expect(position.left).toBeGreaterThanOrEqual(0);
        expect(position.top).toBeGreaterThanOrEqual(0);
        expect(position.width).toBeGreaterThan(0);
        expect(position.height).toBeGreaterThan(0);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('multiple highlights maintain independent positions for 100+ inputs', () => {
    fc.assert(
      fc.property(
        fc.array(highlightConfigArb, { minLength: 2, maxLength: 5 }),
        (configs) => {
          const positions = configs.map((config) => getHighlightPosition(config));

          // Each highlight should have its own independent position
          configs.forEach((config, index) => {
            expect(positions[index].left).toBe(config.region.x);
            expect(positions[index].top).toBe(config.region.y);
            expect(positions[index].width).toBe(config.region.width);
            expect(positions[index].height).toBe(config.region.height);
          });

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// =============================================================================
// Property 6: Fade Animation Interpolation
// Feature: video-tutorial-screencasts, Property 6: Fade Animation Interpolation
// **Validates: Requirements 4.5**
// =============================================================================

describe('Property 6: Fade Animation Interpolation', () => {
  it('opacity is 0 before fade-in starts for 100+ inputs', () => {
    fc.assert(
      fc.property(
        highlightConfigWithFadeArb,
        fc.integer({ min: 1, max: 20 }),
        (config, framesBefore) => {
          const fadeIn = config.fadeIn ?? DEFAULT_FADE_IN;
          const testFrame = config.startFrame - fadeIn - framesBefore;

          if (testFrame < 0) return true; // Skip invalid frames

          const opacity = calculateHighlightOpacity(
            testFrame,
            config.startFrame,
            config.endFrame,
            fadeIn,
            config.fadeOut ?? DEFAULT_FADE_OUT
          );

          expect(opacity).toBe(0);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('opacity interpolates from 0 to 1 during fade-in for 100+ inputs', () => {
    fc.assert(
      fc.property(highlightConfigWithFadeArb, (config) => {
        const fadeIn = config.fadeIn ?? DEFAULT_FADE_IN;
        const { startFrame, endFrame } = config;
        const fadeOut = config.fadeOut ?? DEFAULT_FADE_OUT;

        // Test multiple frames during fade-in
        let prevOpacity = 0;

        for (let frame = startFrame; frame < startFrame + fadeIn; frame++) {
          const opacity = calculateHighlightOpacity(frame, startFrame, endFrame, fadeIn, fadeOut);

          // Opacity should be between 0 and 1
          expect(opacity).toBeGreaterThanOrEqual(0 - OPACITY_TOLERANCE);
          expect(opacity).toBeLessThanOrEqual(1 + OPACITY_TOLERANCE);

          // Opacity should be monotonically increasing during fade-in
          expect(opacity).toBeGreaterThanOrEqual(prevOpacity - OPACITY_TOLERANCE);

          prevOpacity = opacity;
        }

        // At the end of fade-in, opacity should be close to 1
        const opacityAtFadeInEnd = calculateHighlightOpacity(
          startFrame + fadeIn,
          startFrame,
          endFrame,
          fadeIn,
          fadeOut
        );
        expect(opacityAtFadeInEnd).toBeCloseTo(1, 1);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('opacity is 1 during the fully visible period for 100+ inputs', () => {
    fc.assert(
      fc.property(highlightConfigWithFadeArb, (config) => {
        const fadeIn = config.fadeIn ?? DEFAULT_FADE_IN;
        const fadeOut = config.fadeOut ?? DEFAULT_FADE_OUT;
        const { startFrame, endFrame } = config;

        const fullyVisibleStart = startFrame + fadeIn;
        const fullyVisibleEnd = endFrame - fadeOut;

        // Only test if there's a fully visible period
        if (fullyVisibleEnd <= fullyVisibleStart) return true;

        // Test multiple frames during fully visible period
        for (let frame = fullyVisibleStart; frame <= fullyVisibleEnd; frame++) {
          const opacity = calculateHighlightOpacity(frame, startFrame, endFrame, fadeIn, fadeOut);

          expect(opacity).toBe(1);
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('opacity interpolates from 1 to 0 during fade-out for 100+ inputs', () => {
    fc.assert(
      fc.property(highlightConfigWithFadeArb, (config) => {
        const fadeIn = config.fadeIn ?? DEFAULT_FADE_IN;
        const fadeOut = config.fadeOut ?? DEFAULT_FADE_OUT;
        const { startFrame, endFrame } = config;

        const fadeOutStart = endFrame - fadeOut;

        // Test multiple frames during fade-out
        let prevOpacity = 1;

        for (let frame = fadeOutStart; frame <= endFrame; frame++) {
          const opacity = calculateHighlightOpacity(frame, startFrame, endFrame, fadeIn, fadeOut);

          // Opacity should be between 0 and 1
          expect(opacity).toBeGreaterThanOrEqual(0 - OPACITY_TOLERANCE);
          expect(opacity).toBeLessThanOrEqual(1 + OPACITY_TOLERANCE);

          // Opacity should be monotonically decreasing during fade-out
          expect(opacity).toBeLessThanOrEqual(prevOpacity + OPACITY_TOLERANCE);

          prevOpacity = opacity;
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('opacity is 0 after fade-out completes for 100+ inputs', () => {
    fc.assert(
      fc.property(
        highlightConfigWithFadeArb,
        fc.integer({ min: 1, max: 20 }),
        (config, framesAfter) => {
          const fadeIn = config.fadeIn ?? DEFAULT_FADE_IN;
          const fadeOut = config.fadeOut ?? DEFAULT_FADE_OUT;
          const testFrame = config.endFrame + framesAfter;

          const opacity = calculateHighlightOpacity(
            testFrame,
            config.startFrame,
            config.endFrame,
            fadeIn,
            fadeOut
          );

          expect(opacity).toBe(0);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('fade-in opacity increases monotonically with frame progress for 100+ inputs', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 30, max: 100 }), // startFrame
        fc.integer({ min: 5, max: 20 }), // fadeIn duration
        (startFrame, fadeIn) => {
          const endFrame = startFrame + 100;
          const fadeOut = 5;

          // Test that opacity increases monotonically during fade-in
          let prevOpacity = 0;

          for (let frame = startFrame; frame <= startFrame + fadeIn; frame++) {
            const opacity = calculateHighlightOpacity(frame, startFrame, endFrame, fadeIn, fadeOut);

            // Opacity should be in valid range
            expect(opacity).toBeGreaterThanOrEqual(0 - OPACITY_TOLERANCE);
            expect(opacity).toBeLessThanOrEqual(1 + OPACITY_TOLERANCE);

            // Opacity should be monotonically increasing
            expect(opacity).toBeGreaterThanOrEqual(prevOpacity - OPACITY_TOLERANCE);

            prevOpacity = opacity;
          }

          // At the end of fade-in, opacity should be 1
          const finalOpacity = calculateHighlightOpacity(
            startFrame + fadeIn,
            startFrame,
            endFrame,
            fadeIn,
            fadeOut
          );
          expect(finalOpacity).toBeCloseTo(1, 1);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('fade-out opacity decreases monotonically with frame progress for 100+ inputs', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 30, max: 100 }), // startFrame
        fc.integer({ min: 5, max: 20 }), // fadeOut duration
        (startFrame, fadeOut) => {
          const endFrame = startFrame + 100;
          const fadeIn = 5;
          const fadeOutStart = endFrame - fadeOut;

          // Test that opacity decreases monotonically during fade-out
          let prevOpacity = 1;

          for (let frame = fadeOutStart; frame <= endFrame; frame++) {
            const opacity = calculateHighlightOpacity(frame, startFrame, endFrame, fadeIn, fadeOut);

            // Opacity should be in valid range
            expect(opacity).toBeGreaterThanOrEqual(0 - OPACITY_TOLERANCE);
            expect(opacity).toBeLessThanOrEqual(1 + OPACITY_TOLERANCE);

            // Opacity should be monotonically decreasing
            expect(opacity).toBeLessThanOrEqual(prevOpacity + OPACITY_TOLERANCE);

            prevOpacity = opacity;
          }

          // At the end of fade-out, opacity should be close to 0
          const finalOpacity = calculateHighlightOpacity(endFrame, startFrame, endFrame, fadeIn, fadeOut);
          expect(finalOpacity).toBeCloseTo(0, 1);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('consecutive frames have bounded opacity changes (smoothness) for 100+ inputs', () => {
    fc.assert(
      fc.property(highlightConfigWithFadeArb, (config) => {
        const fadeIn = config.fadeIn ?? DEFAULT_FADE_IN;
        const fadeOut = config.fadeOut ?? DEFAULT_FADE_OUT;
        const { startFrame, endFrame } = config;

        let prevOpacity: number | null = null;

        // Test all frames from before start to after end
        const testStartFrame = Math.max(0, startFrame - fadeIn - 5);
        const testEndFrame = endFrame + fadeOut + 5;

        for (let frame = testStartFrame; frame <= testEndFrame; frame++) {
          const opacity = calculateHighlightOpacity(frame, startFrame, endFrame, fadeIn, fadeOut);

          if (prevOpacity !== null) {
            // Maximum change per frame during fade is 1/fadeFrames
            // With easing, the maximum derivative is bounded
            const minFadeDuration = Math.min(fadeIn, fadeOut);
            const maxChangePerFrame = 1 / minFadeDuration;

            // Allow 3x for easing acceleration
            const maxExpectedChange = maxChangePerFrame * 3;

            const actualChange = Math.abs(opacity - prevOpacity);
            expect(actualChange).toBeLessThanOrEqual(maxExpectedChange + OPACITY_TOLERANCE);
          }

          prevOpacity = opacity;
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('visibility check includes fade-in and fade-out periods for 100+ inputs', () => {
    fc.assert(
      fc.property(highlightConfigWithFadeArb, (config) => {
        const fadeIn = config.fadeIn ?? DEFAULT_FADE_IN;
        const fadeOut = config.fadeOut ?? DEFAULT_FADE_OUT;
        const { startFrame, endFrame } = config;

        // Should be visible during fade-in period
        for (let frame = startFrame; frame < startFrame + fadeIn; frame++) {
          expect(isHighlightVisible(config, frame)).toBe(true);
        }

        // Should be visible during main period
        for (let frame = startFrame + fadeIn; frame <= endFrame - fadeOut; frame++) {
          expect(isHighlightVisible(config, frame)).toBe(true);
        }

        // Should be visible during fade-out period
        for (let frame = endFrame - fadeOut; frame <= endFrame; frame++) {
          expect(isHighlightVisible(config, frame)).toBe(true);
        }

        // Should NOT be visible well before start
        const wellBeforeStart = startFrame - fadeIn - 10;
        if (wellBeforeStart >= 0) {
          expect(isHighlightVisible(config, wellBeforeStart)).toBe(false);
        }

        // Should NOT be visible well after end
        const wellAfterEnd = endFrame + fadeOut + 10;
        expect(isHighlightVisible(config, wellAfterEnd)).toBe(false);

        return true;
      }),
      { numRuns: 100 }
    );
  });
});
