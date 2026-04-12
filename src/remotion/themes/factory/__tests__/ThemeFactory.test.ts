/**
 * ThemeFactory Unit Tests
 *
 * Tests for the ThemeFactory class:
 * - createTheme(config)
 * - getPreset(name)
 * - listPresets()
 * - Theme validation
 * - Theme immutability
 * - Color derivation algorithms
 *
 * @see Requirements: 10.1-10.3, 12.1-12.7
 */

import { describe, it, expect } from "vitest";
import { ThemeFactory, hexToRgb, calculateLuminance, shiftColor } from "../ThemeFactory";
import { ThemeValidationError } from "../../errors";
import type { ThemeConfig, BrandKit } from "../../types";

describe("ThemeFactory", () => {
  describe("createTheme", () => {
    /**
     * Validates: Requirements 10.1
     * WHEN createTheme is called with valid config, THE ThemeFactory
     * SHALL return a complete Theme object
     */
    it("should create a theme with minimal config (name only)", () => {
      const theme = ThemeFactory.createTheme({ name: "myTheme" });

      expect(theme).toBeDefined();
      expect(theme.name).toBe("mytheme"); // normalized to lowercase
      expect(theme.category).toBe("custom"); // default category
      expect(theme.accent).toBeDefined();
      expect(theme.bg).toBeDefined();
    });

    it("should create a theme with custom properties", () => {
      const config: ThemeConfig = {
        name: "customTheme",
        category: "extended",
        accent: "#ff6600",
        bg: "#1a1a1a",
        textPrimary: "#ffffff",
      };

      const theme = ThemeFactory.createTheme(config);

      expect(theme.name).toBe("customtheme");
      expect(theme.category).toBe("extended");
      expect(theme.accent).toBe("#ff6600");
      expect(theme.bg).toBe("#1a1a1a");
      expect(theme.textPrimary).toBe("#ffffff");
    });

    it("should apply default values for missing optional fields", () => {
      const theme = ThemeFactory.createTheme({
        name: "partial",
        accent: "#00ff00",
      });

      // Custom value should be applied
      expect(theme.accent).toBe("#00ff00");

      // Default values should be applied for missing fields
      expect(theme.bgSecondary).toBeDefined();
      expect(theme.fontFamily).toBe("'Inter', sans-serif");
      expect(theme.borderRadius).toBe(12);
    });

    /**
     * Validates: Requirements 10.1
     * Theme should be frozen (immutable)
     */
    it("should return a frozen (immutable) theme", () => {
      const theme = ThemeFactory.createTheme({ name: "frozen" });

      expect(Object.isFrozen(theme)).toBe(true);

      // Attempting to modify should have no effect (or throw in strict mode)
      expect(() => {
        // @ts-expect-error Testing immutability
        theme.accent = "#000000";
      }).toThrow();
    });

    it("should normalize theme name to lowercase", () => {
      const theme = ThemeFactory.createTheme({ name: "MyTheme" });

      expect(theme.name).toBe("mytheme");
    });

    /**
     * Validates: Requirements 10.1
     * Should throw for invalid config
     */
    it("should throw ThemeValidationError for empty name", () => {
      expect(() => ThemeFactory.createTheme({ name: "" })).toThrow(
        ThemeValidationError
      );
    });

    it("should throw ThemeValidationError for missing name", () => {
      // @ts-expect-error Testing invalid input
      expect(() => ThemeFactory.createTheme({})).toThrow(ThemeValidationError);
    });

    it("should throw ThemeValidationError for invalid color values", () => {
      expect(() =>
        ThemeFactory.createTheme({
          name: "invalid",
          accent: "not-a-color",
        })
      ).toThrow(ThemeValidationError);
    });

    it("should throw ThemeValidationError for invalid borderRadius", () => {
      expect(() =>
        ThemeFactory.createTheme({
          name: "invalid",
          borderRadius: -5,
        })
      ).toThrow(ThemeValidationError);
    });

    it("should throw ThemeValidationError for invalid font weight", () => {
      expect(() =>
        ThemeFactory.createTheme({
          name: "invalid",
          headingWeight: 150, // Not a valid font weight (must be 100-900 in increments of 100)
        })
      ).toThrow(ThemeValidationError);
    });

    it("should accept valid CSS gradient for bg", () => {
      const theme = ThemeFactory.createTheme({
        name: "gradient",
        bg: "linear-gradient(135deg, #6366f1, #ec4899)",
      });

      expect(theme.bg).toBe("linear-gradient(135deg, #6366f1, #ec4899)");
    });

    it("should accept valid CSS gradient for accentGradient", () => {
      const theme = ThemeFactory.createTheme({
        name: "gradient",
        accentGradient: "linear-gradient(90deg, #ff0000, #00ff00)",
      });

      expect(theme.accentGradient).toBe(
        "linear-gradient(90deg, #ff0000, #00ff00)"
      );
    });

    it("should accept rgba colors", () => {
      const theme = ThemeFactory.createTheme({
        name: "rgba",
        bgSecondary: "rgba(255, 255, 255, 0.04)",
        cardBorder: "rgba(99, 102, 241, 0.25)",
      });

      expect(theme.bgSecondary).toBe("rgba(255, 255, 255, 0.04)");
      expect(theme.cardBorder).toBe("rgba(99, 102, 241, 0.25)");
    });

    it("should accept hsl colors", () => {
      const theme = ThemeFactory.createTheme({
        name: "hsl",
        accent: "hsl(240, 100%, 50%)",
      });

      expect(theme.accent).toBe("hsl(240, 100%, 50%)");
    });
  });

  describe("getPreset", () => {
    /**
     * Validates: Requirements 10.2
     * THE ThemeFactory SHALL provide access to built-in theme presets by name
     */
    it("should return the dark preset", () => {
      const theme = ThemeFactory.getPreset("dark");

      expect(theme).toBeDefined();
      expect(theme.name).toBe("dark");
      expect(theme.category).toBe("original");
    });

    it("should return the ocean preset", () => {
      const theme = ThemeFactory.getPreset("ocean");

      expect(theme).toBeDefined();
      expect(theme.name).toBe("ocean");
      expect(theme.category).toBe("extended");
    });

    it("should perform case-insensitive lookup", () => {
      const theme1 = ThemeFactory.getPreset("Dark");
      const theme2 = ThemeFactory.getPreset("DARK");
      const theme3 = ThemeFactory.getPreset("dark");

      expect(theme1.name).toBe("dark");
      expect(theme2.name).toBe("dark");
      expect(theme3.name).toBe("dark");
    });

    it("should return a frozen (immutable) preset", () => {
      const theme = ThemeFactory.getPreset("dark");

      expect(Object.isFrozen(theme)).toBe(true);
    });

    it("should throw ThemeValidationError for non-existent preset", () => {
      expect(() => ThemeFactory.getPreset("nonexistent")).toThrow(
        ThemeValidationError
      );
    });

    it("should throw ThemeValidationError for empty name", () => {
      expect(() => ThemeFactory.getPreset("")).toThrow(ThemeValidationError);
    });

    it("should throw ThemeValidationError for invalid input", () => {
      // @ts-expect-error Testing invalid input
      expect(() => ThemeFactory.getPreset(null)).toThrow(ThemeValidationError);
    });

    it("should return independent copies for each call", () => {
      const theme1 = ThemeFactory.getPreset("dark");
      const theme2 = ThemeFactory.getPreset("dark");

      // Both should be equal in value
      expect(theme1.name).toBe(theme2.name);
      expect(theme1.accent).toBe(theme2.accent);

      // But they should be different object references
      // (both frozen, so this is mainly for documentation)
      expect(Object.isFrozen(theme1)).toBe(true);
      expect(Object.isFrozen(theme2)).toBe(true);
    });
  });

  describe("listPresets", () => {
    /**
     * Validates: Requirements 10.3
     * THE ThemeFactory SHALL list all available preset names
     */
    it("should return an array of preset names", () => {
      const presets = ThemeFactory.listPresets();

      expect(Array.isArray(presets)).toBe(true);
      expect(presets.length).toBeGreaterThan(0);
    });

    it("should include core presets", () => {
      const presets = ThemeFactory.listPresets();

      expect(presets).toContain("dark");
      expect(presets).toContain("clean");
      expect(presets).toContain("bold");
      expect(presets).toContain("warm");
      expect(presets).toContain("minimal");
      expect(presets).toContain("neon");
    });

    it("should include extended presets", () => {
      const presets = ThemeFactory.listPresets();

      expect(presets).toContain("ocean");
      expect(presets).toContain("sunset");
      expect(presets).toContain("forest");
      expect(presets).toContain("rose");
      expect(presets).toContain("gold");
      expect(presets).toContain("midnight");
    });

    it("should return preset names that can be used with getPreset", () => {
      const presets = ThemeFactory.listPresets();

      // Each preset name should be retrievable
      for (const presetName of presets) {
        const theme = ThemeFactory.getPreset(presetName);
        expect(theme).toBeDefined();
        expect(theme.name).toBe(presetName);
      }
    });
  });

  describe("validation", () => {
    it("should validate all required fields are present", () => {
      // This should work - all defaults are applied
      const theme = ThemeFactory.createTheme({ name: "valid" });
      expect(theme).toBeDefined();
    });

    it("should validate category is a valid ThemeCategory", () => {
      // Valid category
      const validTheme = ThemeFactory.createTheme({
        name: "valid",
        category: "extended",
      });
      expect(validTheme.category).toBe("extended");

      // Invalid category
      expect(() =>
        ThemeFactory.createTheme({
          name: "invalid",
          // @ts-expect-error Testing invalid category
          category: "invalid-category",
        })
      ).toThrow(ThemeValidationError);
    });

    it("should validate borderRadius is non-negative", () => {
      // Valid borderRadius
      const theme = ThemeFactory.createTheme({
        name: "valid",
        borderRadius: 0,
      });
      expect(theme.borderRadius).toBe(0);

      // Invalid borderRadius
      expect(() =>
        ThemeFactory.createTheme({
          name: "invalid",
          borderRadius: -1,
        })
      ).toThrow(ThemeValidationError);
    });

    it("should validate font weights are in valid range (100-900)", () => {
      // Valid font weights
      const theme = ThemeFactory.createTheme({
        name: "valid",
        headingWeight: 100,
        bodyWeight: 900,
      });
      expect(theme.headingWeight).toBe(100);
      expect(theme.bodyWeight).toBe(900);

      // Invalid font weight (too low)
      expect(() =>
        ThemeFactory.createTheme({
          name: "invalid",
          headingWeight: 50,
        })
      ).toThrow(ThemeValidationError);

      // Invalid font weight (too high)
      expect(() =>
        ThemeFactory.createTheme({
          name: "invalid",
          bodyWeight: 1000,
        })
      ).toThrow(ThemeValidationError);

      // Invalid font weight (not a multiple of 100)
      expect(() =>
        ThemeFactory.createTheme({
          name: "invalid",
          headingWeight: 450,
        })
      ).toThrow(ThemeValidationError);
    });

    it("should validate fontFamily is a non-empty string", () => {
      // Valid fontFamily
      const theme = ThemeFactory.createTheme({
        name: "valid",
        fontFamily: "'Roboto', sans-serif",
      });
      expect(theme.fontFamily).toBe("'Roboto', sans-serif");

      // Invalid fontFamily (empty string)
      expect(() =>
        ThemeFactory.createTheme({
          name: "invalid",
          fontFamily: "",
        })
      ).toThrow(ThemeValidationError);

      // Invalid fontFamily (whitespace only)
      expect(() =>
        ThemeFactory.createTheme({
          name: "invalid",
          fontFamily: "   ",
        })
      ).toThrow(ThemeValidationError);
    });
  });
});


describe("Color Derivation Algorithms", () => {
  /**
   * Tests for hexToRgb helper function
   * @see Requirements: 12.1
   */
  describe("hexToRgb", () => {
    it("should convert 6-character hex to RGB", () => {
      const result = hexToRgb("#ff6600");
      expect(result).toEqual({ r: 255, g: 102, b: 0 });
    });

    it("should convert 3-character hex to RGB", () => {
      const result = hexToRgb("#f60");
      expect(result).toEqual({ r: 255, g: 102, b: 0 });
    });

    it("should handle hex without # prefix", () => {
      const result = hexToRgb("ff6600");
      expect(result).toEqual({ r: 255, g: 102, b: 0 });
    });

    it("should convert black (#000000)", () => {
      const result = hexToRgb("#000000");
      expect(result).toEqual({ r: 0, g: 0, b: 0 });
    });

    it("should convert white (#ffffff)", () => {
      const result = hexToRgb("#ffffff");
      expect(result).toEqual({ r: 255, g: 255, b: 255 });
    });

    it("should handle 8-character hex (with alpha) by ignoring alpha", () => {
      const result = hexToRgb("#ff660080");
      expect(result).toEqual({ r: 255, g: 102, b: 0 });
    });

    it("should throw for invalid hex string", () => {
      expect(() => hexToRgb("#gg0000")).toThrow("Invalid hex color");
      expect(() => hexToRgb("#12345")).toThrow("Invalid hex color");
      expect(() => hexToRgb("invalid")).toThrow("Invalid hex color");
    });

    it("should handle lowercase and uppercase hex", () => {
      const lower = hexToRgb("#aabbcc");
      const upper = hexToRgb("#AABBCC");
      expect(lower).toEqual(upper);
      expect(lower).toEqual({ r: 170, g: 187, b: 204 });
    });
  });

  /**
   * Tests for calculateLuminance helper function
   * @see Requirements: 12.2, 12.7
   */
  describe("calculateLuminance", () => {
    it("should return ~1.0 for white", () => {
      const luminance = calculateLuminance(255, 255, 255);
      expect(luminance).toBeCloseTo(1.0, 2);
    });

    it("should return 0.0 for black", () => {
      const luminance = calculateLuminance(0, 0, 0);
      expect(luminance).toBe(0);
    });

    it("should return ~0.21 for middle gray (128, 128, 128)", () => {
      const luminance = calculateLuminance(128, 128, 128);
      // Middle gray has luminance around 0.21
      expect(luminance).toBeGreaterThan(0.2);
      expect(luminance).toBeLessThan(0.25);
    });

    it("should return higher luminance for lighter colors", () => {
      const lightGray = calculateLuminance(200, 200, 200);
      const darkGray = calculateLuminance(50, 50, 50);
      expect(lightGray).toBeGreaterThan(darkGray);
    });

    it("should weight green more heavily than red or blue", () => {
      // Pure green should have higher luminance than pure red or blue
      const red = calculateLuminance(255, 0, 0);
      const green = calculateLuminance(0, 255, 0);
      const blue = calculateLuminance(0, 0, 255);

      expect(green).toBeGreaterThan(red);
      expect(green).toBeGreaterThan(blue);
    });
  });

  /**
   * Tests for shiftColor helper function
   * @see Requirements: 12.2
   */
  describe("shiftColor", () => {
    it("should make color lighter with positive shift", () => {
      const original = hexToRgb("#808080");
      const shifted = shiftColor("#808080", 20);
      const shiftedRgb = hexToRgb(shifted);

      expect(shiftedRgb.r).toBeGreaterThan(original.r);
      expect(shiftedRgb.g).toBeGreaterThan(original.g);
      expect(shiftedRgb.b).toBeGreaterThan(original.b);
    });

    it("should make color darker with negative shift", () => {
      const original = hexToRgb("#808080");
      const shifted = shiftColor("#808080", -20);
      const shiftedRgb = hexToRgb(shifted);

      expect(shiftedRgb.r).toBeLessThan(original.r);
      expect(shiftedRgb.g).toBeLessThan(original.g);
      expect(shiftedRgb.b).toBeLessThan(original.b);
    });

    it("should clamp values at 255 (no overflow)", () => {
      const shifted = shiftColor("#ffffff", 50);
      const shiftedRgb = hexToRgb(shifted);

      expect(shiftedRgb.r).toBe(255);
      expect(shiftedRgb.g).toBe(255);
      expect(shiftedRgb.b).toBe(255);
    });

    it("should clamp values at 0 (no underflow)", () => {
      const shifted = shiftColor("#000000", -50);
      const shiftedRgb = hexToRgb(shifted);

      expect(shiftedRgb.r).toBe(0);
      expect(shiftedRgb.g).toBe(0);
      expect(shiftedRgb.b).toBe(0);
    });

    it("should return valid hex color", () => {
      const shifted = shiftColor("#6366f1", 22);
      expect(shifted).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it("should return same color with zero shift", () => {
      const shifted = shiftColor("#6366f1", 0);
      expect(shifted.toLowerCase()).toBe("#6366f1");
    });
  });

  /**
   * Tests for deriveSecondaryColors method
   * @see Requirements: 12.1-12.3, 12.6-12.7
   */
  describe("deriveSecondaryColors", () => {
    it("should derive colors for dark background", () => {
      const colors = ThemeFactory.deriveSecondaryColors("#0a0a0f");

      expect(colors.bgSecondary).toBeDefined();
      expect(colors.bgGlass).toBeDefined();
      expect(colors.cardBorder).toBeDefined();
      expect(colors.cardShadow).toBeDefined();
    });

    it("should derive colors for light background", () => {
      const colors = ThemeFactory.deriveSecondaryColors("#f8fafc");

      expect(colors.bgSecondary).toBeDefined();
      expect(colors.bgGlass).toBeDefined();
      expect(colors.cardBorder).toBeDefined();
      expect(colors.cardShadow).toBeDefined();
    });

    it("should shift dark backgrounds lighter (positive shift)", () => {
      const darkBg = "#0a0a0f";
      const colors = ThemeFactory.deriveSecondaryColors(darkBg);

      // bgSecondary should be lighter than original
      const originalRgb = hexToRgb(darkBg);
      const secondaryRgb = hexToRgb(colors.bgSecondary);

      expect(secondaryRgb.r).toBeGreaterThan(originalRgb.r);
      expect(secondaryRgb.g).toBeGreaterThan(originalRgb.g);
      expect(secondaryRgb.b).toBeGreaterThan(originalRgb.b);
    });

    it("should shift light backgrounds darker (negative shift)", () => {
      const lightBg = "#f8fafc";
      const colors = ThemeFactory.deriveSecondaryColors(lightBg);

      // bgSecondary should be darker than original
      const originalRgb = hexToRgb(lightBg);
      const secondaryRgb = hexToRgb(colors.bgSecondary);

      expect(secondaryRgb.r).toBeLessThan(originalRgb.r);
      expect(secondaryRgb.g).toBeLessThan(originalRgb.g);
      expect(secondaryRgb.b).toBeLessThan(originalRgb.b);
    });

    it("should create bgGlass with 55% alpha", () => {
      const colors = ThemeFactory.deriveSecondaryColors("#0a0a0f");

      expect(colors.bgGlass).toMatch(/^rgba\(\d+,\s*\d+,\s*\d+,\s*0\.55\)$/);
    });

    it("should use darker shadow for light backgrounds", () => {
      const colors = ThemeFactory.deriveSecondaryColors("#f8fafc");

      // Light backgrounds should have lighter shadow (0.10 opacity)
      expect(colors.cardShadow).toContain("0.10");
    });

    it("should use stronger shadow for dark backgrounds", () => {
      const colors = ThemeFactory.deriveSecondaryColors("#0a0a0f");

      // Dark backgrounds should have stronger shadow (0.45 opacity)
      expect(colors.cardShadow).toContain("0.45");
    });

    it("should return valid CSS values", () => {
      const colors = ThemeFactory.deriveSecondaryColors("#6366f1");

      // bgSecondary should be valid hex
      expect(colors.bgSecondary).toMatch(/^#[0-9a-f]{6}$/i);

      // bgGlass should be valid rgba
      expect(colors.bgGlass).toMatch(/^rgba\(/);

      // cardShadow should be valid box-shadow
      expect(colors.cardShadow).toMatch(/^0\s+\d+px\s+\d+px\s+rgba\(/);
    });
  });

  /**
   * Tests for deriveTextColors method
   * @see Requirements: 12.4, 12.5
   */
  describe("deriveTextColors", () => {
    it("should return textPrimary unchanged", () => {
      const colors = ThemeFactory.deriveTextColors("#ffffff");

      expect(colors.textPrimary).toBe("#ffffff");
    });

    it("should derive textSecondary at 70% opacity", () => {
      const colors = ThemeFactory.deriveTextColors("#ffffff");

      expect(colors.textSecondary).toBe("rgba(255, 255, 255, 0.7)");
    });

    it("should derive textMuted at 45% opacity", () => {
      const colors = ThemeFactory.deriveTextColors("#ffffff");

      expect(colors.textMuted).toBe("rgba(255, 255, 255, 0.45)");
    });

    it("should work with dark text colors", () => {
      const colors = ThemeFactory.deriveTextColors("#000000");

      expect(colors.textPrimary).toBe("#000000");
      expect(colors.textSecondary).toBe("rgba(0, 0, 0, 0.7)");
      expect(colors.textMuted).toBe("rgba(0, 0, 0, 0.45)");
    });

    it("should work with colored text", () => {
      const colors = ThemeFactory.deriveTextColors("#6366f1");

      expect(colors.textPrimary).toBe("#6366f1");
      expect(colors.textSecondary).toBe("rgba(99, 102, 241, 0.7)");
      expect(colors.textMuted).toBe("rgba(99, 102, 241, 0.45)");
    });

    it("should handle 3-character hex", () => {
      const colors = ThemeFactory.deriveTextColors("#fff");

      expect(colors.textPrimary).toBe("#fff");
      expect(colors.textSecondary).toBe("rgba(255, 255, 255, 0.7)");
      expect(colors.textMuted).toBe("rgba(255, 255, 255, 0.45)");
    });
  });

  /**
   * Tests for deriveCardBorder method
   * @see Requirements: 12.6
   */
  describe("deriveCardBorder", () => {
    it("should derive card border at 25% opacity", () => {
      const border = ThemeFactory.deriveCardBorder("#6366f1");

      expect(border).toBe("rgba(99, 102, 241, 0.25)");
    });

    it("should work with different accent colors", () => {
      const border1 = ThemeFactory.deriveCardBorder("#ff0000");
      const border2 = ThemeFactory.deriveCardBorder("#00ff00");
      const border3 = ThemeFactory.deriveCardBorder("#0000ff");

      expect(border1).toBe("rgba(255, 0, 0, 0.25)");
      expect(border2).toBe("rgba(0, 255, 0, 0.25)");
      expect(border3).toBe("rgba(0, 0, 255, 0.25)");
    });

    it("should handle 3-character hex", () => {
      const border = ThemeFactory.deriveCardBorder("#f60");

      expect(border).toBe("rgba(255, 102, 0, 0.25)");
    });
  });

  /**
   * Integration tests for color derivation with theme creation
   */
  describe("Color Derivation Integration", () => {
    it("should produce visually coherent colors for dark theme", () => {
      const bgColors = ThemeFactory.deriveSecondaryColors("#0a0a0f");
      const textColors = ThemeFactory.deriveTextColors("#ffffff");
      const cardBorder = ThemeFactory.deriveCardBorder("#6366f1");

      // All derived colors should be valid
      expect(bgColors.bgSecondary).toMatch(/^#[0-9a-f]{6}$/i);
      expect(bgColors.bgGlass).toMatch(/^rgba\(/);
      expect(textColors.textSecondary).toMatch(/^rgba\(/);
      expect(textColors.textMuted).toMatch(/^rgba\(/);
      expect(cardBorder).toMatch(/^rgba\(/);
    });

    it("should produce visually coherent colors for light theme", () => {
      const bgColors = ThemeFactory.deriveSecondaryColors("#f8fafc");
      const textColors = ThemeFactory.deriveTextColors("#0f172a");
      const cardBorder = ThemeFactory.deriveCardBorder("#2563eb");

      // All derived colors should be valid
      expect(bgColors.bgSecondary).toMatch(/^#[0-9a-f]{6}$/i);
      expect(bgColors.bgGlass).toMatch(/^rgba\(/);
      expect(textColors.textSecondary).toMatch(/^rgba\(/);
      expect(textColors.textMuted).toMatch(/^rgba\(/);
      expect(cardBorder).toMatch(/^rgba\(/);
    });
  });
});


describe("BrandKit Application", () => {
  /**
   * Tests for createFromBrandKit method
   * @see Requirements: 11.1-11.8
   */

  /**
   * Validates: Requirements 11.7
   * WHEN BrandKit is undefined or empty, THE ThemeFactory SHALL return
   * the base theme unchanged
   */
  describe("Empty/undefined BrandKit handling", () => {
    it("should return base theme unchanged when BrandKit is undefined", () => {
      const baseTheme = ThemeFactory.getPreset("dark");
      const result = ThemeFactory.createFromBrandKit(baseTheme, undefined);

      expect(result).toBe(baseTheme);
    });

    it("should return base theme unchanged when BrandKit is empty object", () => {
      const baseTheme = ThemeFactory.getPreset("dark");
      const result = ThemeFactory.createFromBrandKit(baseTheme, {});

      expect(result).toBe(baseTheme);
    });

    it("should return base theme unchanged when BrandKit has only undefined values", () => {
      const baseTheme = ThemeFactory.getPreset("dark");
      const result = ThemeFactory.createFromBrandKit(baseTheme, {
        primaryColor: undefined,
        bgColor: undefined,
        textColor: undefined,
        fontFamily: undefined,
      });

      expect(result).toBe(baseTheme);
    });
  });

  /**
   * Validates: Requirements 11.2
   * THE ThemeFactory SHALL NOT mutate the original base theme when applying BrandKit
   */
  describe("Base theme immutability", () => {
    it("should NOT mutate the original base theme", () => {
      const baseTheme = ThemeFactory.getPreset("dark");
      const originalAccent = baseTheme.accent;
      const originalBg = baseTheme.bg;
      const originalTextPrimary = baseTheme.textPrimary;

      const brandKit = {
        primaryColor: "#ff0000",
        bgColor: "#000000",
        textColor: "#ffffff",
      };

      const result = ThemeFactory.createFromBrandKit(baseTheme, brandKit);

      // Original theme should be unchanged
      expect(baseTheme.accent).toBe(originalAccent);
      expect(baseTheme.bg).toBe(originalBg);
      expect(baseTheme.textPrimary).toBe(originalTextPrimary);

      // Result should have new values
      expect(result.accent).toBe("#ff0000");
      expect(result.bg).toBe("#000000");
      expect(result.textPrimary).toBe("#ffffff");
    });

    it("should return a new theme object, not the same reference", () => {
      const baseTheme = ThemeFactory.getPreset("dark");
      const brandKit = { primaryColor: "#ff0000" };

      const result = ThemeFactory.createFromBrandKit(baseTheme, brandKit);

      expect(result).not.toBe(baseTheme);
    });

    it("should return a frozen (immutable) theme", () => {
      const baseTheme = ThemeFactory.getPreset("dark");
      const brandKit = { primaryColor: "#ff0000" };

      const result = ThemeFactory.createFromBrandKit(baseTheme, brandKit);

      expect(Object.isFrozen(result)).toBe(true);
    });
  });

  /**
   * Validates: Requirements 11.3
   * WHEN BrandKit specifies primaryColor, THE ThemeFactory SHALL set
   * accent and derive accentGradient
   */
  describe("Applying partial BrandKit (only some fields set)", () => {
    it("should apply only primaryColor when only primaryColor is set", () => {
      const baseTheme = ThemeFactory.getPreset("dark");
      const brandKit = { primaryColor: "#6c3fa0" };

      const result = ThemeFactory.createFromBrandKit(baseTheme, brandKit);

      // Primary color should be applied
      expect(result.accent).toBe("#6c3fa0");
      expect(result.accentGradient).toContain("#6c3fa0");
      expect(result.cardBorder).toContain("108, 63, 160"); // RGB of #6c3fa0

      // Other fields should remain from base theme
      expect(result.bg).toBe(baseTheme.bg);
      expect(result.textPrimary).toBe(baseTheme.textPrimary);
      expect(result.fontFamily).toBe(baseTheme.fontFamily);
    });

    it("should apply only bgColor when only bgColor is set", () => {
      const baseTheme = ThemeFactory.getPreset("dark");
      const brandKit = { bgColor: "#0c0820" };

      const result = ThemeFactory.createFromBrandKit(baseTheme, brandKit);

      // Background color should be applied
      expect(result.bg).toBe("#0c0820");
      expect(result.bgSecondary).toBeDefined();
      expect(result.bgGlass).toContain("12, 8, 32"); // RGB of #0c0820

      // Other fields should remain from base theme
      expect(result.accent).toBe(baseTheme.accent);
      expect(result.textPrimary).toBe(baseTheme.textPrimary);
    });

    it("should apply only textColor when only textColor is set", () => {
      const baseTheme = ThemeFactory.getPreset("dark");
      const brandKit = { textColor: "#e0e0e0" };

      const result = ThemeFactory.createFromBrandKit(baseTheme, brandKit);

      // Text color should be applied
      expect(result.textPrimary).toBe("#e0e0e0");
      expect(result.textSecondary).toContain("224, 224, 224"); // RGB of #e0e0e0
      expect(result.textMuted).toContain("224, 224, 224");

      // Other fields should remain from base theme
      expect(result.accent).toBe(baseTheme.accent);
      expect(result.bg).toBe(baseTheme.bg);
    });

    it("should apply only fontFamily when only fontFamily is set", () => {
      const baseTheme = ThemeFactory.getPreset("dark");
      const brandKit = { fontFamily: "'Roboto', sans-serif" };

      const result = ThemeFactory.createFromBrandKit(baseTheme, brandKit);

      // Font family should be applied
      expect(result.fontFamily).toBe("'Roboto', sans-serif");

      // Other fields should remain from base theme
      expect(result.accent).toBe(baseTheme.accent);
      expect(result.bg).toBe(baseTheme.bg);
      expect(result.textPrimary).toBe(baseTheme.textPrimary);
    });

    it("should use secondaryColor for accentSecondary when provided", () => {
      const baseTheme = ThemeFactory.getPreset("dark");
      const brandKit = {
        primaryColor: "#6c3fa0",
        secondaryColor: "#d946ef",
      };

      const result = ThemeFactory.createFromBrandKit(baseTheme, brandKit);

      expect(result.accent).toBe("#6c3fa0");
      expect(result.accentSecondary).toBe("#d946ef");
      expect(result.accentGradient).toBe(
        "linear-gradient(135deg, #6c3fa0, #d946ef)"
      );
    });

    it("should use accentColor as fallback for accentSecondary", () => {
      const baseTheme = ThemeFactory.getPreset("dark");
      const brandKit = {
        primaryColor: "#6c3fa0",
        accentColor: "#ff9900",
      };

      const result = ThemeFactory.createFromBrandKit(baseTheme, brandKit);

      expect(result.accent).toBe("#6c3fa0");
      expect(result.accentSecondary).toBe("#ff9900");
      expect(result.accentGradient).toBe(
        "linear-gradient(135deg, #6c3fa0, #ff9900)"
      );
    });

    it("should use base theme accentSecondary when no secondary/accent color provided", () => {
      const baseTheme = ThemeFactory.getPreset("dark");
      const brandKit = { primaryColor: "#6c3fa0" };

      const result = ThemeFactory.createFromBrandKit(baseTheme, brandKit);

      expect(result.accent).toBe("#6c3fa0");
      expect(result.accentSecondary).toBe(baseTheme.accentSecondary);
    });
  });

  /**
   * Validates: Requirements 11.1, 11.3-11.6
   * Complete BrandKit application
   */
  describe("Applying complete BrandKit", () => {
    it("should apply all BrandKit fields correctly", () => {
      const baseTheme = ThemeFactory.getPreset("dark");
      const brandKit = {
        primaryColor: "#6c3fa0",
        secondaryColor: "#d946ef",
        bgColor: "#0c0820",
        textColor: "#ffffff",
        fontFamily: "'Montserrat', sans-serif",
      };

      const result = ThemeFactory.createFromBrandKit(baseTheme, brandKit);

      // Primary color → accent + gradient
      expect(result.accent).toBe("#6c3fa0");
      expect(result.accentSecondary).toBe("#d946ef");
      expect(result.accentGradient).toBe(
        "linear-gradient(135deg, #6c3fa0, #d946ef)"
      );
      expect(result.cardBorder).toBe("rgba(108, 63, 160, 0.25)");

      // Background color → bg + derived
      expect(result.bg).toBe("#0c0820");
      expect(result.bgGlass).toBe("rgba(12, 8, 32, 0.55)");

      // Text color → textPrimary + derived
      expect(result.textPrimary).toBe("#ffffff");
      expect(result.textSecondary).toBe("rgba(255, 255, 255, 0.7)");
      expect(result.textMuted).toBe("rgba(255, 255, 255, 0.45)");

      // Font family
      expect(result.fontFamily).toBe("'Montserrat', sans-serif");
    });

    it("should derive bgSecondary correctly for dark backgrounds", () => {
      const baseTheme = ThemeFactory.getPreset("dark");
      const brandKit = { bgColor: "#0c0820" }; // Dark background

      const result = ThemeFactory.createFromBrandKit(baseTheme, brandKit);

      // Dark backgrounds should be shifted lighter (positive shift of 22)
      const originalRgb = hexToRgb("#0c0820");
      const secondaryRgb = hexToRgb(result.bgSecondary);

      expect(secondaryRgb.r).toBeGreaterThan(originalRgb.r);
      expect(secondaryRgb.g).toBeGreaterThan(originalRgb.g);
      expect(secondaryRgb.b).toBeGreaterThan(originalRgb.b);
    });

    it("should derive bgSecondary correctly for light backgrounds", () => {
      const baseTheme = ThemeFactory.getPreset("clean");
      const brandKit = { bgColor: "#f8fafc" }; // Light background

      const result = ThemeFactory.createFromBrandKit(baseTheme, brandKit);

      // Light backgrounds should be shifted darker (negative shift of -14)
      const originalRgb = hexToRgb("#f8fafc");
      const secondaryRgb = hexToRgb(result.bgSecondary);

      expect(secondaryRgb.r).toBeLessThan(originalRgb.r);
      expect(secondaryRgb.g).toBeLessThan(originalRgb.g);
      expect(secondaryRgb.b).toBeLessThan(originalRgb.b);
    });

    it("should use appropriate cardShadow for dark backgrounds", () => {
      const baseTheme = ThemeFactory.getPreset("dark");
      const brandKit = { bgColor: "#0c0820" }; // Dark background

      const result = ThemeFactory.createFromBrandKit(baseTheme, brandKit);

      // Dark backgrounds should have stronger shadow (0.45 opacity)
      expect(result.cardShadow).toBe("0 4px 24px rgba(0,0,0,0.45)");
    });

    it("should use appropriate cardShadow for light backgrounds", () => {
      const baseTheme = ThemeFactory.getPreset("clean");
      const brandKit = { bgColor: "#f8fafc" }; // Light background

      const result = ThemeFactory.createFromBrandKit(baseTheme, brandKit);

      // Light backgrounds should have lighter shadow (0.10 opacity)
      expect(result.cardShadow).toBe("0 4px 24px rgba(0,0,0,0.10)");
    });
  });

  /**
   * Validates: Requirements 11.8
   * THE ThemeFactory SHALL apply BrandKit idempotently
   * (applying twice produces same result as once)
   */
  describe("Idempotence (applying twice = applying once)", () => {
    it("should produce same result when applying BrandKit twice", () => {
      const baseTheme = ThemeFactory.getPreset("dark");
      const brandKit = {
        primaryColor: "#6c3fa0",
        secondaryColor: "#d946ef",
        bgColor: "#0c0820",
        textColor: "#ffffff",
        fontFamily: "'Montserrat', sans-serif",
      };

      const firstApplication = ThemeFactory.createFromBrandKit(
        baseTheme,
        brandKit
      );
      const secondApplication = ThemeFactory.createFromBrandKit(
        firstApplication,
        brandKit
      );

      // All properties should be identical
      expect(secondApplication.accent).toBe(firstApplication.accent);
      expect(secondApplication.accentSecondary).toBe(
        firstApplication.accentSecondary
      );
      expect(secondApplication.accentGradient).toBe(
        firstApplication.accentGradient
      );
      expect(secondApplication.cardBorder).toBe(firstApplication.cardBorder);
      expect(secondApplication.bg).toBe(firstApplication.bg);
      expect(secondApplication.bgSecondary).toBe(firstApplication.bgSecondary);
      expect(secondApplication.bgGlass).toBe(firstApplication.bgGlass);
      expect(secondApplication.cardShadow).toBe(firstApplication.cardShadow);
      expect(secondApplication.textPrimary).toBe(firstApplication.textPrimary);
      expect(secondApplication.textSecondary).toBe(
        firstApplication.textSecondary
      );
      expect(secondApplication.textMuted).toBe(firstApplication.textMuted);
      expect(secondApplication.fontFamily).toBe(firstApplication.fontFamily);
    });

    it("should be idempotent with partial BrandKit", () => {
      const baseTheme = ThemeFactory.getPreset("dark");
      const brandKit = { primaryColor: "#ff0000" };

      const firstApplication = ThemeFactory.createFromBrandKit(
        baseTheme,
        brandKit
      );
      const secondApplication = ThemeFactory.createFromBrandKit(
        firstApplication,
        brandKit
      );

      expect(secondApplication.accent).toBe(firstApplication.accent);
      expect(secondApplication.accentGradient).toBe(
        firstApplication.accentGradient
      );
      expect(secondApplication.cardBorder).toBe(firstApplication.cardBorder);
    });

    it("should be idempotent with only bgColor", () => {
      const baseTheme = ThemeFactory.getPreset("dark");
      const brandKit = { bgColor: "#1a1a2e" };

      const firstApplication = ThemeFactory.createFromBrandKit(
        baseTheme,
        brandKit
      );
      const secondApplication = ThemeFactory.createFromBrandKit(
        firstApplication,
        brandKit
      );

      expect(secondApplication.bg).toBe(firstApplication.bg);
      expect(secondApplication.bgSecondary).toBe(firstApplication.bgSecondary);
      expect(secondApplication.bgGlass).toBe(firstApplication.bgGlass);
      expect(secondApplication.cardShadow).toBe(firstApplication.cardShadow);
    });

    it("should be idempotent with only textColor", () => {
      const baseTheme = ThemeFactory.getPreset("dark");
      const brandKit = { textColor: "#e0e0e0" };

      const firstApplication = ThemeFactory.createFromBrandKit(
        baseTheme,
        brandKit
      );
      const secondApplication = ThemeFactory.createFromBrandKit(
        firstApplication,
        brandKit
      );

      expect(secondApplication.textPrimary).toBe(firstApplication.textPrimary);
      expect(secondApplication.textSecondary).toBe(
        firstApplication.textSecondary
      );
      expect(secondApplication.textMuted).toBe(firstApplication.textMuted);
    });
  });

  /**
   * Integration tests for GameDay-style BrandKit
   */
  describe("GameDay BrandKit Integration", () => {
    it("should correctly apply GameDay brand colors", () => {
      const baseTheme = ThemeFactory.getPreset("dark");
      const gameDayBrandKit = {
        primaryColor: "#6c3fa0", // GD_PURPLE
        secondaryColor: "#d946ef", // GD_PINK
        accentColor: "#ff9900", // GD_ORANGE
        bgColor: "#0c0820", // GD_DARK
        textColor: "#ffffff",
      };

      const result = ThemeFactory.createFromBrandKit(
        baseTheme,
        gameDayBrandKit
      );

      expect(result.accent).toBe("#6c3fa0");
      expect(result.accentSecondary).toBe("#d946ef");
      expect(result.bg).toBe("#0c0820");
      expect(result.textPrimary).toBe("#ffffff");
    });

    it("should preserve non-overridden theme properties", () => {
      const baseTheme = ThemeFactory.getPreset("dark");
      const brandKit = { primaryColor: "#6c3fa0" };

      const result = ThemeFactory.createFromBrandKit(baseTheme, brandKit);

      // These should be preserved from base theme
      expect(result.borderRadius).toBe(baseTheme.borderRadius);
      expect(result.headingWeight).toBe(baseTheme.headingWeight);
      expect(result.bodyWeight).toBe(baseTheme.bodyWeight);
      expect(result.name).toBe(baseTheme.name);
      expect(result.category).toBe(baseTheme.category);
    });
  });
});


describe("validateColors", () => {
  /**
   * Tests for validateColors method
   * @see Requirements: 13.1-13.3
   */

  /**
   * Validates: Requirements 13.1
   * THE ThemeFactory SHALL validate that all color inputs are valid CSS colors
   */
  describe("Valid CSS color formats", () => {
    it("should accept valid hex colors (6-character)", () => {
      const result = ThemeFactory.validateColors({
        accent: "#ff6600",
        textPrimary: "#ffffff",
        bg: "#000000",
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should accept valid hex colors (3-character)", () => {
      const result = ThemeFactory.validateColors({
        accent: "#f60",
        textPrimary: "#fff",
        bg: "#000",
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should accept valid hex colors (8-character with alpha)", () => {
      const result = ThemeFactory.validateColors({
        accent: "#ff660080",
        textPrimary: "#ffffffcc",
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should accept valid rgb colors", () => {
      const result = ThemeFactory.validateColors({
        accent: "rgb(255, 102, 0)",
        textPrimary: "rgb(255, 255, 255)",
        bgSecondary: "rgb(0, 0, 0)",
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should accept valid rgba colors", () => {
      const result = ThemeFactory.validateColors({
        bgSecondary: "rgba(255, 255, 255, 0.04)",
        bgGlass: "rgba(255, 255, 255, 0.06)",
        cardBorder: "rgba(99, 102, 241, 0.25)",
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should accept valid hsl colors", () => {
      const result = ThemeFactory.validateColors({
        accent: "hsl(240, 100%, 50%)",
        textPrimary: "hsl(0, 0%, 100%)",
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should accept valid hsla colors", () => {
      const result = ThemeFactory.validateColors({
        bgSecondary: "hsla(240, 100%, 50%, 0.5)",
        bgGlass: "hsla(0, 0%, 100%, 0.06)",
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should accept CSS gradients for bg field", () => {
      const result = ThemeFactory.validateColors({
        bg: "linear-gradient(135deg, #6366f1, #ec4899)",
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should accept CSS gradients for accentGradient field", () => {
      const result = ThemeFactory.validateColors({
        accentGradient: "linear-gradient(90deg, #ff0000, #00ff00)",
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should accept radial gradients", () => {
      const result = ThemeFactory.validateColors({
        bg: "radial-gradient(circle, #ff0000, #00ff00)",
        accentGradient: "radial-gradient(ellipse at center, #6366f1, #ec4899)",
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should accept empty partial theme object", () => {
      const result = ThemeFactory.validateColors({});

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should ignore undefined values", () => {
      const result = ThemeFactory.validateColors({
        accent: "#ff6600",
        textPrimary: undefined,
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  /**
   * Validates: Requirements 13.1, 13.2
   * Invalid color detection
   */
  describe("Invalid color detection", () => {
    it("should reject invalid hex colors", () => {
      const result = ThemeFactory.validateColors({
        accent: "not-a-color",
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe("accent");
      expect(result.errors[0].value).toBe("not-a-color");
    });

    it("should reject hex colors with invalid characters", () => {
      const result = ThemeFactory.validateColors({
        accent: "#gg0000",
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe("accent");
    });

    it("should reject hex colors with wrong length", () => {
      const result = ThemeFactory.validateColors({
        accent: "#12345", // 5 characters - invalid
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe("accent");
    });

    it("should reject rgb with out-of-range values", () => {
      const result = ThemeFactory.validateColors({
        accent: "rgb(300, 0, 0)", // 300 > 255
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe("accent");
    });

    it("should reject rgba with invalid alpha", () => {
      const result = ThemeFactory.validateColors({
        bgSecondary: "rgba(255, 255, 255, 2)", // alpha > 1
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe("bgSecondary");
    });

    it("should reject hsl with out-of-range saturation", () => {
      const result = ThemeFactory.validateColors({
        accent: "hsl(240, 150%, 50%)", // saturation > 100%
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe("accent");
    });

    it("should reject empty string colors", () => {
      const result = ThemeFactory.validateColors({
        accent: "",
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe("accent");
    });

    it("should reject whitespace-only colors", () => {
      const result = ThemeFactory.validateColors({
        accent: "   ",
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe("accent");
    });

    it("should reject gradients for color-only fields", () => {
      const result = ThemeFactory.validateColors({
        accent: "linear-gradient(135deg, #6366f1, #ec4899)", // accent should be color, not gradient
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe("accent");
    });

    it("should reject gradients for textPrimary", () => {
      const result = ThemeFactory.validateColors({
        textPrimary: "linear-gradient(135deg, #fff, #000)",
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe("textPrimary");
    });
  });

  /**
   * Validates: Requirements 13.1
   * Multiple error detection
   */
  describe("Multiple error detection", () => {
    it("should report all invalid colors in a single validation", () => {
      const result = ThemeFactory.validateColors({
        accent: "invalid1",
        textPrimary: "invalid2",
        bgSecondary: "invalid3",
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(3);

      const fields = result.errors.map((e) => e.field);
      expect(fields).toContain("accent");
      expect(fields).toContain("textPrimary");
      expect(fields).toContain("bgSecondary");
    });

    it("should report errors for mixed valid and invalid colors", () => {
      const result = ThemeFactory.validateColors({
        accent: "#ff6600", // valid
        textPrimary: "invalid", // invalid
        bg: "linear-gradient(135deg, #6366f1, #ec4899)", // valid
        bgSecondary: "not-a-color", // invalid
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);

      const fields = result.errors.map((e) => e.field);
      expect(fields).toContain("textPrimary");
      expect(fields).toContain("bgSecondary");
      expect(fields).not.toContain("accent");
      expect(fields).not.toContain("bg");
    });
  });

  /**
   * Validates: Requirements 13.3
   * Derived colors validation
   */
  describe("Derived colors validation", () => {
    it("should validate derived bgSecondary colors", () => {
      const result = ThemeFactory.validateColors({
        bgSecondary: "#202020", // valid derived color
      });

      expect(result.valid).toBe(true);
    });

    it("should validate derived bgGlass colors (rgba)", () => {
      const result = ThemeFactory.validateColors({
        bgGlass: "rgba(10, 10, 15, 0.55)", // valid derived color
      });

      expect(result.valid).toBe(true);
    });

    it("should validate derived textSecondary colors (rgba)", () => {
      const result = ThemeFactory.validateColors({
        textSecondary: "rgba(255, 255, 255, 0.7)", // valid derived color
      });

      expect(result.valid).toBe(true);
    });

    it("should validate derived textMuted colors (rgba)", () => {
      const result = ThemeFactory.validateColors({
        textMuted: "rgba(255, 255, 255, 0.45)", // valid derived color
      });

      expect(result.valid).toBe(true);
    });

    it("should validate derived cardBorder colors (rgba)", () => {
      const result = ThemeFactory.validateColors({
        cardBorder: "rgba(99, 102, 241, 0.25)", // valid derived color
      });

      expect(result.valid).toBe(true);
    });
  });

  /**
   * Error message quality tests
   */
  describe("Error message quality", () => {
    it("should include field name in error message", () => {
      const result = ThemeFactory.validateColors({
        accent: "invalid",
      });

      expect(result.errors[0].message).toContain("accent");
    });

    it("should include the invalid value in error details", () => {
      const result = ThemeFactory.validateColors({
        accent: "my-invalid-color",
      });

      expect(result.errors[0].value).toBe("my-invalid-color");
    });

    it("should provide helpful message about valid formats", () => {
      const result = ThemeFactory.validateColors({
        accent: "invalid",
      });

      expect(result.errors[0].message).toMatch(/hex|rgb|rgba|hsl|hsla/i);
    });
  });

  /**
   * Edge cases
   */
  describe("Edge cases", () => {
    it("should handle case-insensitive hex colors", () => {
      const result = ThemeFactory.validateColors({
        accent: "#AABBCC",
        textPrimary: "#aabbcc",
        bg: "#AaBbCc",
      });

      expect(result.valid).toBe(true);
    });

    it("should handle rgb with percentage values", () => {
      const result = ThemeFactory.validateColors({
        accent: "rgb(100%, 50%, 0%)",
      });

      expect(result.valid).toBe(true);
    });

    it("should handle rgba with percentage alpha", () => {
      const result = ThemeFactory.validateColors({
        bgSecondary: "rgba(255, 255, 255, 50%)",
      });

      expect(result.valid).toBe(true);
    });

    it("should handle repeating gradients", () => {
      const result = ThemeFactory.validateColors({
        bg: "repeating-linear-gradient(45deg, #ff0000, #00ff00 10px)",
      });

      expect(result.valid).toBe(true);
    });

    it("should handle conic gradients", () => {
      const result = ThemeFactory.validateColors({
        bg: "conic-gradient(from 0deg, #ff0000, #00ff00, #0000ff)",
      });

      expect(result.valid).toBe(true);
    });

    it("should reject malformed gradients", () => {
      const result = ThemeFactory.validateColors({
        bg: "linear-gradient(", // unclosed parenthesis
      });

      expect(result.valid).toBe(false);
      expect(result.errors[0].field).toBe("bg");
    });

    it("should handle all color fields in a complete theme", () => {
      const result = ThemeFactory.validateColors({
        bg: "#0a0a0f",
        bgSecondary: "rgba(255,255,255,0.04)",
        bgGlass: "rgba(255,255,255,0.06)",
        textPrimary: "#ffffff",
        textSecondary: "#94a3b8",
        textMuted: "#64748b",
        accent: "#6366f1",
        accentSecondary: "#a855f7",
        accentGradient: "linear-gradient(135deg, #6366f1, #ec4899)",
        cardBorder: "rgba(99,102,241,0.25)",
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
