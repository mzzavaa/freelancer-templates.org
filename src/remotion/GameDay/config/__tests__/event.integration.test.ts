/**
 * Integration Tests for GameDay BrandKit
 *
 * Tests that GameDay renders correctly with custom BrandKit and that
 * color derivation produces visually coherent results.
 *
 * **Validates: Requirements 11.1-11.8, 12.1-12.7**
 *
 * @module GameDay/config/__tests__/event.integration.test
 */

import { describe, it, expect } from "vitest";
import { GAMEDAY_BRANDKIT, GAMEDAY_THEME } from "../event";
import {
  ThemeFactory,
  ThemeRegistry,
  THEME_DARK,
  type BrandKit,
  type Theme,
} from "../../../themes";
import {
  GD_DARK,
  GD_PURPLE,
  GD_VIOLET,
  GD_PINK,
} from "../../src/design/colors";

describe("GameDay BrandKit Integration", () => {
  // ══════════════════════════════════════════════════════════════════════════
  // Test 1: GAMEDAY_BRANDKIT has all required color fields
  // ══════════════════════════════════════════════════════════════════════════

  describe("GAMEDAY_BRANDKIT structure", () => {
    /**
     * **Validates: Requirements 11.1-11.8**
     *
     * Verifies that GAMEDAY_BRANDKIT has all required color fields
     * for proper theme creation.
     */
    it("should have all required color fields", () => {
      // Required fields for BrandKit
      expect(GAMEDAY_BRANDKIT).toBeDefined();
      expect(GAMEDAY_BRANDKIT.primaryColor).toBeDefined();
      expect(GAMEDAY_BRANDKIT.secondaryColor).toBeDefined();
      expect(GAMEDAY_BRANDKIT.accentColor).toBeDefined();
      expect(GAMEDAY_BRANDKIT.bgColor).toBeDefined();
      expect(GAMEDAY_BRANDKIT.textColor).toBeDefined();
    });

    it("should have valid hex color values", () => {
      const hexColorPattern = /^#[0-9a-fA-F]{6}$/;

      expect(GAMEDAY_BRANDKIT.primaryColor).toMatch(hexColorPattern);
      expect(GAMEDAY_BRANDKIT.secondaryColor).toMatch(hexColorPattern);
      expect(GAMEDAY_BRANDKIT.accentColor).toMatch(hexColorPattern);
      expect(GAMEDAY_BRANDKIT.bgColor).toMatch(hexColorPattern);
      expect(GAMEDAY_BRANDKIT.textColor).toMatch(hexColorPattern);
    });

    it("should use GameDay design system colors", () => {
      // Verify BrandKit uses the correct GameDay colors
      expect(GAMEDAY_BRANDKIT.primaryColor).toBe(GD_PURPLE);
      expect(GAMEDAY_BRANDKIT.secondaryColor).toBe(GD_PINK);
      expect(GAMEDAY_BRANDKIT.accentColor).toBe(GD_VIOLET);
      expect(GAMEDAY_BRANDKIT.bgColor).toBe(GD_DARK);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // Test 2: GAMEDAY_THEME is created successfully from BrandKit
  // ══════════════════════════════════════════════════════════════════════════

  describe("GAMEDAY_THEME creation", () => {
    /**
     * **Validates: Requirements 11.1-11.8**
     *
     * Verifies that GAMEDAY_THEME is successfully created from
     * THEME_DARK + GAMEDAY_BRANDKIT.
     */
    it("should be created successfully from BrandKit", () => {
      expect(GAMEDAY_THEME).toBeDefined();
      expect(typeof GAMEDAY_THEME).toBe("object");
    });

    it("should have a valid theme name", () => {
      expect(GAMEDAY_THEME.name).toBeDefined();
      expect(typeof GAMEDAY_THEME.name).toBe("string");
    });

    it("should have a valid category", () => {
      expect(GAMEDAY_THEME.category).toBeDefined();
      expect(["original", "extended", "european", "flat", "canva", "custom"]).toContain(
        GAMEDAY_THEME.category
      );
    });

    it("should be a frozen (immutable) object", () => {
      expect(Object.isFrozen(GAMEDAY_THEME)).toBe(true);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // Test 3: GAMEDAY_THEME has derived colors
  // ══════════════════════════════════════════════════════════════════════════

  describe("GAMEDAY_THEME derived colors", () => {
    /**
     * **Validates: Requirements 12.1-12.7**
     *
     * Verifies that GAMEDAY_THEME has all derived colors:
     * bgSecondary, bgGlass, textSecondary, textMuted, cardBorder, accentGradient
     */
    it("should have bgSecondary derived from bgColor", () => {
      expect(GAMEDAY_THEME.bgSecondary).toBeDefined();
      expect(typeof GAMEDAY_THEME.bgSecondary).toBe("string");
      // bgSecondary should be a shifted version of bg (hex color)
      expect(GAMEDAY_THEME.bgSecondary).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    it("should have bgGlass derived from bgColor with alpha", () => {
      expect(GAMEDAY_THEME.bgGlass).toBeDefined();
      expect(typeof GAMEDAY_THEME.bgGlass).toBe("string");
      // bgGlass should be an rgba color with alpha
      expect(GAMEDAY_THEME.bgGlass).toMatch(/^rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)$/);
    });

    it("should have textSecondary derived from textColor", () => {
      expect(GAMEDAY_THEME.textSecondary).toBeDefined();
      expect(typeof GAMEDAY_THEME.textSecondary).toBe("string");
      // textSecondary should be an rgba color at 70% opacity
      expect(GAMEDAY_THEME.textSecondary).toMatch(/^rgba\(\d+,\s*\d+,\s*\d+,\s*0\.7\)$/);
    });

    it("should have textMuted derived from textColor", () => {
      expect(GAMEDAY_THEME.textMuted).toBeDefined();
      expect(typeof GAMEDAY_THEME.textMuted).toBe("string");
      // textMuted should be an rgba color at 45% opacity
      expect(GAMEDAY_THEME.textMuted).toMatch(/^rgba\(\d+,\s*\d+,\s*\d+,\s*0\.45\)$/);
    });

    it("should have cardBorder derived from primaryColor", () => {
      expect(GAMEDAY_THEME.cardBorder).toBeDefined();
      expect(typeof GAMEDAY_THEME.cardBorder).toBe("string");
      // cardBorder should be an rgba color at 25% opacity
      expect(GAMEDAY_THEME.cardBorder).toMatch(/^rgba\(\d+,\s*\d+,\s*\d+,\s*0\.25\)$/);
    });

    it("should have accentGradient derived from primaryColor and secondaryColor", () => {
      expect(GAMEDAY_THEME.accentGradient).toBeDefined();
      expect(typeof GAMEDAY_THEME.accentGradient).toBe("string");
      // accentGradient should be a linear-gradient
      expect(GAMEDAY_THEME.accentGradient).toMatch(/^linear-gradient\(/);
      // Should contain the primary and secondary colors
      expect(GAMEDAY_THEME.accentGradient).toContain(GAMEDAY_BRANDKIT.primaryColor);
      expect(GAMEDAY_THEME.accentGradient).toContain(GAMEDAY_BRANDKIT.secondaryColor);
    });

    it("should have cardShadow appropriate for dark background", () => {
      expect(GAMEDAY_THEME.cardShadow).toBeDefined();
      expect(typeof GAMEDAY_THEME.cardShadow).toBe("string");
      // Dark backgrounds should have darker shadows
      expect(GAMEDAY_THEME.cardShadow).toContain("rgba(0,0,0,");
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // Test 4: GAMEDAY_THEME colors match expected GameDay palette
  // ══════════════════════════════════════════════════════════════════════════

  describe("GAMEDAY_THEME color palette", () => {
    /**
     * **Validates: Requirements 11.1-11.8**
     *
     * Verifies that GAMEDAY_THEME colors match the expected GameDay palette.
     */
    it("should have bg matching GD_DARK", () => {
      expect(GAMEDAY_THEME.bg).toBe(GD_DARK);
    });

    it("should have accent matching GD_PURPLE (primaryColor)", () => {
      expect(GAMEDAY_THEME.accent).toBe(GD_PURPLE);
    });

    it("should have accentSecondary matching GD_PINK (secondaryColor)", () => {
      expect(GAMEDAY_THEME.accentSecondary).toBe(GD_PINK);
    });

    it("should have textPrimary matching white", () => {
      expect(GAMEDAY_THEME.textPrimary).toBe("#ffffff");
    });

    it("should preserve base theme typography settings", () => {
      // Font settings should come from THEME_DARK base
      expect(GAMEDAY_THEME.fontFamily).toBe(THEME_DARK.fontFamily);
      expect(GAMEDAY_THEME.headingWeight).toBe(THEME_DARK.headingWeight);
      expect(GAMEDAY_THEME.bodyWeight).toBe(THEME_DARK.bodyWeight);
      expect(GAMEDAY_THEME.borderRadius).toBe(THEME_DARK.borderRadius);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // Test 5: BrandKit application is idempotent
  // ══════════════════════════════════════════════════════════════════════════

  describe("BrandKit idempotence", () => {
    /**
     * **Validates: Requirements 11.8**
     *
     * Verifies that applying BrandKit twice produces the same result
     * as applying it once (idempotent operation).
     */
    it("should produce same result when applied twice", () => {
      // Apply BrandKit once
      const themeOnce = ThemeFactory.createFromBrandKit(THEME_DARK, GAMEDAY_BRANDKIT);

      // Apply BrandKit twice (to the result of first application)
      const themeTwice = ThemeFactory.createFromBrandKit(themeOnce, GAMEDAY_BRANDKIT);

      // Both should be equivalent
      expect(themeTwice.bg).toBe(themeOnce.bg);
      expect(themeTwice.bgSecondary).toBe(themeOnce.bgSecondary);
      expect(themeTwice.bgGlass).toBe(themeOnce.bgGlass);
      expect(themeTwice.accent).toBe(themeOnce.accent);
      expect(themeTwice.accentSecondary).toBe(themeOnce.accentSecondary);
      expect(themeTwice.accentGradient).toBe(themeOnce.accentGradient);
      expect(themeTwice.textPrimary).toBe(themeOnce.textPrimary);
      expect(themeTwice.textSecondary).toBe(themeOnce.textSecondary);
      expect(themeTwice.textMuted).toBe(themeOnce.textMuted);
      expect(themeTwice.cardBorder).toBe(themeOnce.cardBorder);
      expect(themeTwice.cardShadow).toBe(themeOnce.cardShadow);
    });

    it("should not mutate the base theme", () => {
      // Create a copy of THEME_DARK to compare
      const originalDarkBg = THEME_DARK.bg;
      const originalDarkAccent = THEME_DARK.accent;

      // Apply BrandKit
      ThemeFactory.createFromBrandKit(THEME_DARK, GAMEDAY_BRANDKIT);

      // THEME_DARK should be unchanged
      expect(THEME_DARK.bg).toBe(originalDarkBg);
      expect(THEME_DARK.accent).toBe(originalDarkAccent);
    });

    it("should return base theme unchanged when BrandKit is undefined", () => {
      const result = ThemeFactory.createFromBrandKit(THEME_DARK, undefined);
      expect(result).toBe(THEME_DARK);
    });

    it("should return base theme unchanged when BrandKit is empty", () => {
      const emptyBrandKit: BrandKit = {};
      const result = ThemeFactory.createFromBrandKit(THEME_DARK, emptyBrandKit);
      expect(result).toBe(THEME_DARK);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // Test 6: GAMEDAY_THEME can be used with ThemeRegistry
  // ══════════════════════════════════════════════════════════════════════════

  describe("ThemeRegistry integration", () => {
    /**
     * **Validates: Requirements 11.1-11.8, 1.1-1.7**
     *
     * Verifies that GAMEDAY_THEME can be registered and retrieved
     * from ThemeRegistry.
     */
    it("should be registerable with ThemeRegistry", () => {
      const registry = new ThemeRegistry();

      // Should not throw when registering
      expect(() => {
        registry.registerTheme("gameday-test", GAMEDAY_THEME);
      }).not.toThrow();

      // Should be retrievable
      const retrieved = registry.getTheme("gameday-test");
      expect(retrieved).toBeDefined();
    });

    it("should be retrievable by name after registration", () => {
      const registry = new ThemeRegistry();
      registry.registerTheme("gameday-custom", GAMEDAY_THEME);

      const retrieved = registry.getTheme("gameday-custom");
      expect(retrieved).toBeDefined();
      expect(retrieved?.bg).toBe(GAMEDAY_THEME.bg);
      expect(retrieved?.accent).toBe(GAMEDAY_THEME.accent);
    });

    it("should pass ThemeRegistry validation", () => {
      const registry = new ThemeRegistry();

      // isValidTheme should return true for GAMEDAY_THEME
      expect(registry.isValidTheme(GAMEDAY_THEME)).toBe(true);
    });

    it("should be included in getAllThemes after registration", () => {
      const registry = new ThemeRegistry();
      registry.registerTheme("gameday-all", GAMEDAY_THEME);

      const allThemes = registry.getAllThemes();
      const gameDayTheme = allThemes.find((t) => t.name === "gameday-all");

      expect(gameDayTheme).toBeDefined();
      expect(gameDayTheme?.accent).toBe(GD_PURPLE);
    });

    it("should be compatible with template filtering", () => {
      const registry = new ThemeRegistry();
      registry.registerTheme("gameday-filter", GAMEDAY_THEME);

      // Test with whitelist
      const whitelistThemes = registry.getCompatibleThemes({
        compatibleThemes: ["gameday-filter", "dark"],
      });
      expect(whitelistThemes.some((t) => t.name === "gameday-filter")).toBe(true);

      // Test with blacklist (should be included when not excluded)
      const blacklistThemes = registry.getCompatibleThemes({
        excludedThemes: ["dark"],
      });
      expect(blacklistThemes.some((t) => t.name === "gameday-filter")).toBe(true);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // Additional: Color derivation visual coherence tests
  // ══════════════════════════════════════════════════════════════════════════

  describe("Color derivation visual coherence", () => {
    /**
     * **Validates: Requirements 12.1-12.7**
     *
     * Verifies that derived colors maintain visual coherence.
     */
    it("should derive bgSecondary lighter than bg for dark backgrounds", () => {
      // For dark backgrounds, bgSecondary should be shifted lighter
      // GD_DARK is #0c0820, bgSecondary should be brighter
      const bgRgb = hexToRgb(GAMEDAY_THEME.bg as string);
      const bgSecondaryRgb = hexToRgb(GAMEDAY_THEME.bgSecondary);

      // bgSecondary should have higher RGB values (lighter)
      const bgLuminance = bgRgb.r + bgRgb.g + bgRgb.b;
      const bgSecondaryLuminance =
        bgSecondaryRgb.r + bgSecondaryRgb.g + bgSecondaryRgb.b;

      expect(bgSecondaryLuminance).toBeGreaterThan(bgLuminance);
    });

    it("should derive text colors with correct opacity hierarchy", () => {
      // textPrimary should be full opacity (solid color)
      expect(GAMEDAY_THEME.textPrimary).toBe("#ffffff");

      // textSecondary should be 70% opacity
      expect(GAMEDAY_THEME.textSecondary).toContain("0.7");

      // textMuted should be 45% opacity
      expect(GAMEDAY_THEME.textMuted).toContain("0.45");
    });

    it("should create gradient from primary to secondary color", () => {
      const gradient = GAMEDAY_THEME.accentGradient;

      // Should be a 135deg linear gradient
      expect(gradient).toContain("135deg");

      // Should go from primary (GD_PURPLE) to secondary (GD_PINK)
      const primaryIndex = gradient.indexOf(GD_PURPLE);
      const secondaryIndex = gradient.indexOf(GD_PINK);

      expect(primaryIndex).toBeGreaterThan(-1);
      expect(secondaryIndex).toBeGreaterThan(-1);
      expect(primaryIndex).toBeLessThan(secondaryIndex);
    });
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Helper Functions
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Converts a hex color string to RGB values.
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace(/^#/, "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return { r, g, b };
}
