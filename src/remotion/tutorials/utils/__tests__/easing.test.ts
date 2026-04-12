/**
 * Unit tests for easing utility functions
 *
 * Tests verify that easing functions:
 * - Return correct boundary values (0 at t=0, 1 at t=1)
 * - Handle edge cases (values outside 0-1 range)
 * - Produce smooth, monotonic output for standard easings
 */

import { describe, it, expect } from 'vitest';
import {
  easeInOut,
  easeOut,
  spring,
  getEasingFunction,
  interpolate,
  interpolatePosition,
  calculateProgress,
  interpolateFrames,
  interpolateOpacity,
  smoothPosition,
} from '../easing';

describe('Core Easing Functions', () => {
  describe('easeInOut', () => {
    it('returns 0 at t=0', () => {
      expect(easeInOut(0)).toBe(0);
    });

    it('returns 1 at t=1', () => {
      expect(easeInOut(1)).toBe(1);
    });

    it('returns 0.5 at t=0.5', () => {
      expect(easeInOut(0.5)).toBe(0.5);
    });

    it('clamps values below 0', () => {
      expect(easeInOut(-0.5)).toBe(0);
    });

    it('clamps values above 1', () => {
      expect(easeInOut(1.5)).toBe(1);
    });

    it('produces values between 0 and 1 for valid input', () => {
      for (let t = 0; t <= 1; t += 0.1) {
        const result = easeInOut(t);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('easeOut', () => {
    it('returns 0 at t=0', () => {
      expect(easeOut(0)).toBe(0);
    });

    it('returns 1 at t=1', () => {
      expect(easeOut(1)).toBe(1);
    });

    it('clamps values below 0', () => {
      expect(easeOut(-0.5)).toBe(0);
    });

    it('clamps values above 1', () => {
      expect(easeOut(1.5)).toBe(1);
    });

    it('starts fast (higher value at t=0.25 than linear)', () => {
      expect(easeOut(0.25)).toBeGreaterThan(0.25);
    });

    it('produces values between 0 and 1 for valid input', () => {
      for (let t = 0; t <= 1; t += 0.1) {
        const result = easeOut(t);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('spring', () => {
    it('returns 0 at t=0', () => {
      expect(spring(0)).toBe(0);
    });

    it('returns 1 at t=1', () => {
      expect(spring(1)).toBe(1);
    });

    it('clamps values below 0', () => {
      expect(spring(-0.5)).toBe(0);
    });

    it('clamps values above 1', () => {
      expect(spring(1.5)).toBe(1);
    });

    it('may overshoot 1 during animation (spring behavior)', () => {
      // Spring easing can overshoot, so we check it reaches values > 1 at some point
      let hasOvershoot = false;
      for (let t = 0; t < 1; t += 0.01) {
        if (spring(t) > 1) {
          hasOvershoot = true;
          break;
        }
      }
      expect(hasOvershoot).toBe(true);
    });
  });
});

describe('getEasingFunction', () => {
  it('returns easeInOut for "easeInOut"', () => {
    expect(getEasingFunction('easeInOut')).toBe(easeInOut);
  });

  it('returns easeOut for "easeOut"', () => {
    expect(getEasingFunction('easeOut')).toBe(easeOut);
  });

  it('returns spring for "spring"', () => {
    expect(getEasingFunction('spring')).toBe(spring);
  });
});

describe('Interpolation Helpers', () => {
  describe('interpolate', () => {
    it('returns start value at progress=0', () => {
      expect(interpolate(10, 20, 0)).toBe(10);
    });

    it('returns end value at progress=1', () => {
      expect(interpolate(10, 20, 1)).toBe(20);
    });

    it('returns midpoint at progress=0.5 with easeInOut', () => {
      expect(interpolate(0, 100, 0.5)).toBe(50);
    });

    it('uses custom easing function', () => {
      const linear = (t: number) => t;
      expect(interpolate(0, 100, 0.25, linear)).toBe(25);
    });
  });

  describe('interpolatePosition', () => {
    it('returns start position at progress=0', () => {
      const result = interpolatePosition(0, 0, 100, 100, 0);
      expect(result).toEqual({ x: 0, y: 0 });
    });

    it('returns end position at progress=1', () => {
      const result = interpolatePosition(0, 0, 100, 100, 1);
      expect(result).toEqual({ x: 100, y: 100 });
    });

    it('returns midpoint at progress=0.5 with easeInOut', () => {
      const result = interpolatePosition(0, 0, 100, 100, 0.5);
      expect(result).toEqual({ x: 50, y: 50 });
    });
  });

  describe('calculateProgress', () => {
    it('returns 0 when currentFrame <= startFrame', () => {
      expect(calculateProgress(0, 10, 20)).toBe(0);
      expect(calculateProgress(10, 10, 20)).toBe(0);
    });

    it('returns 1 when currentFrame >= endFrame', () => {
      expect(calculateProgress(20, 10, 20)).toBe(1);
      expect(calculateProgress(25, 10, 20)).toBe(1);
    });

    it('returns 0.5 at midpoint', () => {
      expect(calculateProgress(15, 10, 20)).toBe(0.5);
    });

    it('returns correct progress for arbitrary frame', () => {
      expect(calculateProgress(12, 10, 20)).toBe(0.2);
    });
  });

  describe('interpolateFrames', () => {
    it('returns start value before animation', () => {
      expect(interpolateFrames(5, 10, 20, 0, 100)).toBe(0);
    });

    it('returns end value after animation', () => {
      expect(interpolateFrames(25, 10, 20, 0, 100)).toBe(100);
    });

    it('returns interpolated value during animation', () => {
      // At frame 15 (midpoint), with easeInOut, should be 50
      expect(interpolateFrames(15, 10, 20, 0, 100)).toBe(50);
    });
  });

  describe('interpolateOpacity', () => {
    it('returns 0 before startFrame', () => {
      expect(interpolateOpacity(5, 10, 50, 5, 5)).toBe(0);
    });

    it('returns 0 after endFrame', () => {
      expect(interpolateOpacity(55, 10, 50, 5, 5)).toBe(0);
    });

    it('returns 1 during fully visible period', () => {
      expect(interpolateOpacity(30, 10, 50, 5, 5)).toBe(1);
    });

    it('returns value between 0 and 1 during fade-in', () => {
      const opacity = interpolateOpacity(12, 10, 50, 5, 5);
      expect(opacity).toBeGreaterThan(0);
      expect(opacity).toBeLessThan(1);
    });

    it('returns value between 0 and 1 during fade-out', () => {
      const opacity = interpolateOpacity(48, 10, 50, 5, 5);
      expect(opacity).toBeGreaterThan(0);
      expect(opacity).toBeLessThan(1);
    });
  });

  describe('smoothPosition', () => {
    it('returns target position when smoothing is 0', () => {
      const result = smoothPosition(0, 0, 100, 100, 0);
      expect(result).toEqual({ x: 100, y: 100 });
    });

    it('returns current position when smoothing is 1', () => {
      const result = smoothPosition(0, 0, 100, 100, 1);
      expect(result).toEqual({ x: 0, y: 0 });
    });

    it('returns intermediate position with default smoothing', () => {
      const result = smoothPosition(0, 0, 100, 100, 0.3);
      expect(result.x).toBeGreaterThan(0);
      expect(result.x).toBeLessThan(100);
      expect(result.y).toBeGreaterThan(0);
      expect(result.y).toBeLessThan(100);
    });

    it('clamps smoothing to valid range', () => {
      const result1 = smoothPosition(0, 0, 100, 100, -0.5);
      expect(result1).toEqual({ x: 100, y: 100 });

      const result2 = smoothPosition(0, 0, 100, 100, 1.5);
      expect(result2).toEqual({ x: 0, y: 0 });
    });
  });
});
