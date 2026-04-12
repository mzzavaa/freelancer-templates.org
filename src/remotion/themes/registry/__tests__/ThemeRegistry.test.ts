/**
 * ThemeRegistry Unit Tests
 *
 * Tests for the core operations of ThemeRegistry:
 * - getTheme(name)
 * - getAllThemes()
 * - getThemeNames()
 * - Internal Map storage
 * - Theme validation and immutability
 *
 * @see Requirements: 1.1-1.7, 17.1-17.2
 */

import { describe, it, expect, beforeEach } from "vitest";
import { ThemeRegistry } from "../ThemeRegistry";
import { ThemeValidationError } from "../../errors";
import type { Theme, ThemePreset } from "../../types";

/**
 * Creates a valid mock theme for testing.
 */
function createMockTheme(name: string, category: Theme["category"] = "original"): Theme {
  return {
    name,
    category,
    bg: "#0a0a0f",
    bgSecondary: "rgba(255,255,255,0.04)",
    bgGlass: "rgba(255,255,255,0.06)",
    textPrimary: "#ffffff",
    textSecondary: "#94a3b8",
    textMuted: "#64748b",
    accent: "#6366f1",
    accentSecondary: "#a855f7",
    accentGradient: "linear-gradient(135deg, #6366f1, #a855f7)",
    cardBorder: "rgba(99,102,241,0.25)",
    cardShadow: "0 4px 24px rgba(0,0,0,0.3)",
    borderRadius: 12,
    fontFamily: "'Inter', sans-serif",
    headingWeight: 700,
    bodyWeight: 400,
  };
}

describe("ThemeRegistry", () => {
  let registry: ThemeRegistry;

  beforeEach(() => {
    registry = new ThemeRegistry();
  });

  describe("getTheme", () => {
    /**
     * Validates: Requirements 1.2
     * WHEN a theme is retrieved by name, THE ThemeRegistry SHALL return
     * the exact theme object that was registered
     */
    it("should return the registered theme when it exists", () => {
      const theme = createMockTheme("dark");
      registry.registerTheme("dark", theme);

      const retrieved = registry.getTheme("dark");

      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe("dark");
      expect(retrieved?.accent).toBe("#6366f1");
    });

    /**
     * Validates: Requirements 1.3
     * WHEN a theme is retrieved that does not exist, THE ThemeRegistry
     * SHALL return undefined
     */
    it("should return undefined for non-existent theme", () => {
      const retrieved = registry.getTheme("nonexistent");

      expect(retrieved).toBeUndefined();
    });

    /**
     * Validates: Requirements 1.2
     * Case-insensitive lookup
     */
    it("should perform case-insensitive lookup", () => {
      const theme = createMockTheme("ocean");
      registry.registerTheme("Ocean", theme);

      expect(registry.getTheme("ocean")).toBeDefined();
      expect(registry.getTheme("OCEAN")).toBeDefined();
      expect(registry.getTheme("Ocean")).toBeDefined();
    });

    it("should return undefined for empty string", () => {
      expect(registry.getTheme("")).toBeUndefined();
    });

    it("should return undefined for invalid input", () => {
      // @ts-expect-error Testing invalid input
      expect(registry.getTheme(null)).toBeUndefined();
      // @ts-expect-error Testing invalid input
      expect(registry.getTheme(undefined)).toBeUndefined();
    });
  });

  describe("getAllThemes", () => {
    /**
     * Validates: Requirements 1.4
     * THE ThemeRegistry SHALL provide a method to retrieve all registered
     * themes as an array
     */
    it("should return empty array when no themes registered", () => {
      const themes = registry.getAllThemes();

      expect(themes).toEqual([]);
    });

    it("should return all registered themes", () => {
      registry.registerTheme("dark", createMockTheme("dark"));
      registry.registerTheme("ocean", createMockTheme("ocean"));
      registry.registerTheme("sunset", createMockTheme("sunset"));

      const themes = registry.getAllThemes();

      expect(themes).toHaveLength(3);
      expect(themes.map((t) => t.name).sort()).toEqual(["dark", "ocean", "sunset"]);
    });

    it("should return a new array copy", () => {
      registry.registerTheme("dark", createMockTheme("dark"));

      const themes1 = registry.getAllThemes();
      const themes2 = registry.getAllThemes();

      expect(themes1).not.toBe(themes2);
      expect(themes1).toEqual(themes2);
    });
  });

  describe("getThemeNames", () => {
    /**
     * Validates: Requirements 1.5
     * THE ThemeRegistry SHALL provide a method to retrieve all registered
     * theme names as an array
     */
    it("should return empty array when no themes registered", () => {
      const names = registry.getThemeNames();

      expect(names).toEqual([]);
    });

    it("should return all registered theme names", () => {
      registry.registerTheme("dark", createMockTheme("dark"));
      registry.registerTheme("ocean", createMockTheme("ocean"));

      const names = registry.getThemeNames();

      expect(names).toHaveLength(2);
      expect(names.sort()).toEqual(["dark", "ocean"]);
    });

    it("should return lowercase names", () => {
      registry.registerTheme("Dark", createMockTheme("dark"));
      registry.registerTheme("OCEAN", createMockTheme("ocean"));

      const names = registry.getThemeNames();

      expect(names.sort()).toEqual(["dark", "ocean"]);
    });

    it("should return a new array copy", () => {
      registry.registerTheme("dark", createMockTheme("dark"));

      const names1 = registry.getThemeNames();
      const names2 = registry.getThemeNames();

      expect(names1).not.toBe(names2);
      expect(names1).toEqual(names2);
    });
  });

  describe("internal Map storage", () => {
    it("should use Map for O(1) lookup", () => {
      // Register many themes
      for (let i = 0; i < 100; i++) {
        registry.registerTheme(`theme-${i}`, createMockTheme(`theme-${i}`));
      }

      // Verify all can be retrieved
      expect(registry.size).toBe(100);
      expect(registry.getTheme("theme-50")).toBeDefined();
      expect(registry.getTheme("theme-99")).toBeDefined();
    });

    it("should track size correctly", () => {
      expect(registry.size).toBe(0);

      registry.registerTheme("dark", createMockTheme("dark"));
      expect(registry.size).toBe(1);

      registry.registerTheme("ocean", createMockTheme("ocean"));
      expect(registry.size).toBe(2);
    });

    it("should support hasTheme check", () => {
      registry.registerTheme("dark", createMockTheme("dark"));

      expect(registry.hasTheme("dark")).toBe(true);
      expect(registry.hasTheme("DARK")).toBe(true);
      expect(registry.hasTheme("ocean")).toBe(false);
    });

    it("should support clear operation", () => {
      registry.registerTheme("dark", createMockTheme("dark"));
      registry.registerTheme("ocean", createMockTheme("ocean"));

      registry.clear();

      expect(registry.size).toBe(0);
      expect(registry.getAllThemes()).toEqual([]);
    });
  });

  describe("registerTheme", () => {
    /**
     * Validates: Requirements 1.1
     * WHEN a valid theme is registered with a unique name, THE ThemeRegistry
     * SHALL store the theme and make it retrievable by that name
     */
    it("should store theme and make it retrievable", () => {
      const theme = createMockTheme("dark");
      registry.registerTheme("dark", theme);

      expect(registry.getTheme("dark")).toBeDefined();
      expect(registry.hasTheme("dark")).toBe(true);
    });

    /**
     * Validates: Requirements 1.6
     * WHEN a theme is registered, THE ThemeRegistry SHALL freeze the theme
     * object to prevent mutation
     */
    it("should freeze theme on registration", () => {
      const theme = createMockTheme("dark");
      registry.registerTheme("dark", theme);

      const retrieved = registry.getTheme("dark");

      expect(Object.isFrozen(retrieved)).toBe(true);
    });

    it("should normalize theme name to lowercase", () => {
      const theme = createMockTheme("Dark");
      registry.registerTheme("Dark", theme);

      const retrieved = registry.getTheme("dark");

      expect(retrieved?.name).toBe("dark");
    });

    it("should overwrite existing theme with same name", () => {
      const theme1 = createMockTheme("dark");
      theme1.accent = "#ff0000";

      const theme2 = createMockTheme("dark");
      theme2.accent = "#00ff00";

      registry.registerTheme("dark", theme1);
      registry.registerTheme("dark", theme2);

      expect(registry.size).toBe(1);
      expect(registry.getTheme("dark")?.accent).toBe("#00ff00");
    });
  });

  describe("registerPreset", () => {
    /**
     * Validates: Requirements 1.7
     * WHEN a theme preset is registered, THE ThemeRegistry SHALL extract
     * and store all themes from the preset
     */
    it("should register all themes from preset", () => {
      const preset: ThemePreset = {
        name: "original",
        category: "original",
        themes: {
          dark: createMockTheme("dark"),
          clean: createMockTheme("clean"),
          bold: createMockTheme("bold"),
        },
      };

      registry.registerPreset(preset);

      expect(registry.size).toBe(3);
      expect(registry.getTheme("dark")).toBeDefined();
      expect(registry.getTheme("clean")).toBeDefined();
      expect(registry.getTheme("bold")).toBeDefined();
    });

    it("should apply preset category to themes", () => {
      const preset: ThemePreset = {
        name: "extended",
        category: "extended",
        themes: {
          ocean: { ...createMockTheme("ocean"), category: undefined as unknown as Theme["category"] },
        },
      };

      registry.registerPreset(preset);

      expect(registry.getTheme("ocean")?.category).toBe("extended");
    });

    it("should preserve theme's own category if specified", () => {
      const preset: ThemePreset = {
        name: "mixed",
        category: "original",
        themes: {
          custom: createMockTheme("custom", "custom"),
        },
      };

      registry.registerPreset(preset);

      expect(registry.getTheme("custom")?.category).toBe("custom");
    });
  });

  describe("theme validation", () => {
    /**
     * Validates: Requirements 2.2
     * WHEN a theme is registered with missing required fields, THE ThemeRegistry
     * SHALL throw a ThemeValidationError listing the missing fields
     */
    it("should throw ThemeValidationError for missing required fields", () => {
      const invalidTheme = {
        name: "invalid",
        category: "original",
        // Missing most required fields
      } as unknown as Theme;

      expect(() => registry.registerTheme("invalid", invalidTheme)).toThrow(ThemeValidationError);
    });

    it("should include field-level details in validation error", () => {
      const invalidTheme = {
        name: "invalid",
        category: "original",
      } as unknown as Theme;

      try {
        registry.registerTheme("invalid", invalidTheme);
        expect.fail("Should have thrown ThemeValidationError");
      } catch (error) {
        expect(error).toBeInstanceOf(ThemeValidationError);
        const validationError = error as ThemeValidationError;
        expect(validationError.errors.length).toBeGreaterThan(0);
        expect(validationError.getInvalidFields()).toContain("bg");
        expect(validationError.getInvalidFields()).toContain("accent");
      }
    });

    /**
     * Validates: Requirements 2.5
     * THE ThemeRegistry SHALL validate that borderRadius is a non-negative number
     */
    it("should throw ThemeValidationError for negative borderRadius", () => {
      const invalidTheme = {
        ...createMockTheme("invalid"),
        borderRadius: -5,
      };

      expect(() => registry.registerTheme("invalid", invalidTheme)).toThrow(ThemeValidationError);
    });

    /**
     * Validates: Requirements 2.6
     * THE ThemeRegistry SHALL validate that headingWeight and bodyWeight are valid font weights (100-900)
     */
    it("should throw ThemeValidationError for invalid headingWeight", () => {
      const invalidTheme = {
        ...createMockTheme("invalid"),
        headingWeight: 1000, // Invalid: must be 100-900
      };

      expect(() => registry.registerTheme("invalid", invalidTheme)).toThrow(ThemeValidationError);
    });

    it("should throw ThemeValidationError for invalid bodyWeight", () => {
      const invalidTheme = {
        ...createMockTheme("invalid"),
        bodyWeight: 50, // Invalid: must be 100-900
      };

      expect(() => registry.registerTheme("invalid", invalidTheme)).toThrow(ThemeValidationError);
    });

    it("should throw ThemeValidationError for non-100-increment font weights", () => {
      const invalidTheme = {
        ...createMockTheme("invalid"),
        headingWeight: 450, // Invalid: must be in increments of 100
      };

      expect(() => registry.registerTheme("invalid", invalidTheme)).toThrow(ThemeValidationError);
    });

    it("should throw ThemeValidationError for invalid category", () => {
      const invalidTheme = {
        ...createMockTheme("invalid"),
        category: "invalid-category" as Theme["category"],
      };

      expect(() => registry.registerTheme("invalid", invalidTheme)).toThrow(ThemeValidationError);
    });

    it("should throw ThemeValidationError for empty theme name", () => {
      const theme = createMockTheme("test");

      expect(() => registry.registerTheme("", theme)).toThrow(ThemeValidationError);
      expect(() => registry.registerTheme("   ", theme)).toThrow(ThemeValidationError);
    });

    it("should throw ThemeValidationError for empty fontFamily", () => {
      const invalidTheme = {
        ...createMockTheme("invalid"),
        fontFamily: "",
      };

      expect(() => registry.registerTheme("invalid", invalidTheme)).toThrow(ThemeValidationError);
    });

    it("should throw ThemeValidationError for non-string color fields", () => {
      const invalidTheme = {
        ...createMockTheme("invalid"),
        accent: 123 as unknown as string,
      };

      expect(() => registry.registerTheme("invalid", invalidTheme)).toThrow(ThemeValidationError);
    });
  });

  describe("theme immutability", () => {
    /**
     * Validates: Requirements 17.1
     * WHEN a theme is retrieved from ThemeRegistry, THE theme object SHALL be frozen (immutable)
     */
    it("should return frozen theme objects", () => {
      const theme = createMockTheme("dark");
      registry.registerTheme("dark", theme);

      const retrieved = registry.getTheme("dark");

      expect(Object.isFrozen(retrieved)).toBe(true);
    });

    /**
     * Validates: Requirements 17.2
     * WHEN attempting to modify a retrieved theme, THE modification SHALL have no effect or throw an error
     */
    it("should prevent modification of retrieved themes", () => {
      const theme = createMockTheme("dark");
      registry.registerTheme("dark", theme);

      const retrieved = registry.getTheme("dark")!;

      // In strict mode, this would throw. In non-strict mode, it silently fails.
      expect(() => {
        (retrieved as { accent: string }).accent = "#ff0000";
      }).toThrow();
    });

    it("should not mutate original theme object on registration", () => {
      const originalTheme = createMockTheme("dark");
      const originalAccent = originalTheme.accent;

      registry.registerTheme("dark", originalTheme);

      // Original should not be frozen
      expect(Object.isFrozen(originalTheme)).toBe(false);
      expect(originalTheme.accent).toBe(originalAccent);
    });
  });

  describe("registerPreset validation", () => {
    it("should throw ThemeValidationError for null preset", () => {
      expect(() => registry.registerPreset(null as unknown as ThemePreset)).toThrow(ThemeValidationError);
    });

    it("should throw ThemeValidationError for preset without themes", () => {
      const invalidPreset = {
        name: "invalid",
        category: "original",
      } as unknown as ThemePreset;

      expect(() => registry.registerPreset(invalidPreset)).toThrow(ThemeValidationError);
    });

    it("should throw ThemeValidationError for preset with invalid category", () => {
      const invalidPreset: ThemePreset = {
        name: "invalid",
        category: "invalid-category" as Theme["category"],
        themes: {
          dark: createMockTheme("dark"),
        },
      };

      expect(() => registry.registerPreset(invalidPreset)).toThrow(ThemeValidationError);
    });

    it("should throw ThemeValidationError if any theme in preset is invalid", () => {
      const preset: ThemePreset = {
        name: "mixed",
        category: "original",
        themes: {
          valid: createMockTheme("valid"),
          invalid: { name: "invalid" } as unknown as Theme, // Missing required fields
        },
      };

      expect(() => registry.registerPreset(preset)).toThrow(ThemeValidationError);
    });
  });

  describe("isValidTheme", () => {
    /**
     * Validates: Requirements 2.8
     * THE ThemeRegistry SHALL provide an isValidTheme method that returns a boolean without throwing
     */
    it("should return true for a valid theme", () => {
      const theme = createMockTheme("dark");

      expect(registry.isValidTheme(theme)).toBe(true);
    });

    it("should return false for null", () => {
      expect(registry.isValidTheme(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(registry.isValidTheme(undefined)).toBe(false);
    });

    it("should return false for non-object values", () => {
      expect(registry.isValidTheme("string")).toBe(false);
      expect(registry.isValidTheme(123)).toBe(false);
      expect(registry.isValidTheme(true)).toBe(false);
      expect(registry.isValidTheme([])).toBe(false);
    });

    it("should return false for missing required fields", () => {
      const invalidTheme = {
        name: "invalid",
        category: "original",
        // Missing most required fields
      };

      expect(registry.isValidTheme(invalidTheme)).toBe(false);
    });

    it("should return false for invalid category", () => {
      const invalidTheme = {
        ...createMockTheme("invalid"),
        category: "invalid-category",
      };

      expect(registry.isValidTheme(invalidTheme)).toBe(false);
    });

    it("should return false for negative borderRadius", () => {
      const invalidTheme = {
        ...createMockTheme("invalid"),
        borderRadius: -5,
      };

      expect(registry.isValidTheme(invalidTheme)).toBe(false);
    });

    it("should return false for invalid headingWeight", () => {
      const invalidTheme = {
        ...createMockTheme("invalid"),
        headingWeight: 1000,
      };

      expect(registry.isValidTheme(invalidTheme)).toBe(false);
    });

    it("should return false for invalid bodyWeight", () => {
      const invalidTheme = {
        ...createMockTheme("invalid"),
        bodyWeight: 50,
      };

      expect(registry.isValidTheme(invalidTheme)).toBe(false);
    });

    it("should return false for non-100-increment font weights", () => {
      const invalidTheme = {
        ...createMockTheme("invalid"),
        headingWeight: 450,
      };

      expect(registry.isValidTheme(invalidTheme)).toBe(false);
    });

    it("should return false for empty fontFamily", () => {
      const invalidTheme = {
        ...createMockTheme("invalid"),
        fontFamily: "",
      };

      expect(registry.isValidTheme(invalidTheme)).toBe(false);
    });

    it("should return false for non-string color fields", () => {
      const invalidTheme = {
        ...createMockTheme("invalid"),
        accent: 123,
      };

      expect(registry.isValidTheme(invalidTheme)).toBe(false);
    });

    it("should act as a type guard", () => {
      const maybeTheme: unknown = createMockTheme("dark");

      if (registry.isValidTheme(maybeTheme)) {
        // TypeScript should now know maybeTheme is Theme
        expect(maybeTheme.accent).toBe("#6366f1");
        expect(maybeTheme.name).toBe("dark");
      } else {
        expect.fail("Should have been a valid theme");
      }
    });
  });

  describe("CSS color validation", () => {
    /**
     * Validates: Requirements 2.3
     * THE ThemeRegistry SHALL validate that all color fields contain valid CSS color values (hex, rgb, rgba, hsl)
     */
    describe("hex colors", () => {
      it("should accept valid 3-digit hex colors", () => {
        const theme = {
          ...createMockTheme("test"),
          accent: "#f00",
        };

        expect(registry.isValidTheme(theme)).toBe(true);
      });

      it("should accept valid 6-digit hex colors", () => {
        const theme = {
          ...createMockTheme("test"),
          accent: "#ff0000",
        };

        expect(registry.isValidTheme(theme)).toBe(true);
      });

      it("should accept valid 8-digit hex colors (with alpha)", () => {
        const theme = {
          ...createMockTheme("test"),
          accent: "#ff0000ff",
        };

        expect(registry.isValidTheme(theme)).toBe(true);
      });

      it("should reject invalid hex colors", () => {
        const theme = {
          ...createMockTheme("test"),
          accent: "#gg0000", // Invalid hex characters
        };

        expect(registry.isValidTheme(theme)).toBe(false);
      });

      it("should reject hex colors without hash", () => {
        const theme = {
          ...createMockTheme("test"),
          accent: "ff0000",
        };

        expect(registry.isValidTheme(theme)).toBe(false);
      });

      it("should reject hex colors with wrong length", () => {
        const theme = {
          ...createMockTheme("test"),
          accent: "#ff00", // 4 digits - invalid
        };

        expect(registry.isValidTheme(theme)).toBe(false);
      });
    });

    describe("rgb colors", () => {
      it("should accept valid rgb colors", () => {
        const theme = {
          ...createMockTheme("test"),
          accent: "rgb(255, 0, 0)",
        };

        expect(registry.isValidTheme(theme)).toBe(true);
      });

      it("should accept rgb colors with percentage values", () => {
        const theme = {
          ...createMockTheme("test"),
          accent: "rgb(100%, 0%, 0%)",
        };

        expect(registry.isValidTheme(theme)).toBe(true);
      });

      it("should reject rgb colors with out-of-range values", () => {
        const theme = {
          ...createMockTheme("test"),
          accent: "rgb(300, 0, 0)", // 300 > 255
        };

        expect(registry.isValidTheme(theme)).toBe(false);
      });
    });

    describe("rgba colors", () => {
      it("should accept valid rgba colors", () => {
        const theme = {
          ...createMockTheme("test"),
          accent: "rgba(255, 0, 0, 0.5)",
        };

        expect(registry.isValidTheme(theme)).toBe(true);
      });

      it("should accept rgba colors with alpha = 0", () => {
        const theme = {
          ...createMockTheme("test"),
          accent: "rgba(255, 0, 0, 0)",
        };

        expect(registry.isValidTheme(theme)).toBe(true);
      });

      it("should accept rgba colors with alpha = 1", () => {
        const theme = {
          ...createMockTheme("test"),
          accent: "rgba(255, 0, 0, 1)",
        };

        expect(registry.isValidTheme(theme)).toBe(true);
      });

      it("should accept rgba colors with percentage alpha", () => {
        const theme = {
          ...createMockTheme("test"),
          accent: "rgba(255, 0, 0, 50%)",
        };

        expect(registry.isValidTheme(theme)).toBe(true);
      });

      it("should reject rgba colors with out-of-range alpha", () => {
        const theme = {
          ...createMockTheme("test"),
          accent: "rgba(255, 0, 0, 1.5)", // alpha > 1
        };

        expect(registry.isValidTheme(theme)).toBe(false);
      });
    });

    describe("hsl colors", () => {
      it("should accept valid hsl colors", () => {
        const theme = {
          ...createMockTheme("test"),
          accent: "hsl(0, 100%, 50%)",
        };

        expect(registry.isValidTheme(theme)).toBe(true);
      });

      it("should accept hsl colors with decimal hue", () => {
        const theme = {
          ...createMockTheme("test"),
          accent: "hsl(180.5, 100%, 50%)",
        };

        expect(registry.isValidTheme(theme)).toBe(true);
      });

      it("should reject hsl colors with out-of-range hue", () => {
        const theme = {
          ...createMockTheme("test"),
          accent: "hsl(400, 100%, 50%)", // hue > 360
        };

        expect(registry.isValidTheme(theme)).toBe(false);
      });

      it("should reject hsl colors with out-of-range saturation", () => {
        const theme = {
          ...createMockTheme("test"),
          accent: "hsl(0, 150%, 50%)", // saturation > 100%
        };

        expect(registry.isValidTheme(theme)).toBe(false);
      });
    });

    describe("hsla colors", () => {
      it("should accept valid hsla colors", () => {
        const theme = {
          ...createMockTheme("test"),
          accent: "hsla(0, 100%, 50%, 0.5)",
        };

        expect(registry.isValidTheme(theme)).toBe(true);
      });

      it("should accept hsla colors with percentage alpha", () => {
        const theme = {
          ...createMockTheme("test"),
          accent: "hsla(0, 100%, 50%, 50%)",
        };

        expect(registry.isValidTheme(theme)).toBe(true);
      });

      it("should reject hsla colors with out-of-range alpha", () => {
        const theme = {
          ...createMockTheme("test"),
          accent: "hsla(0, 100%, 50%, 1.5)", // alpha > 1
        };

        expect(registry.isValidTheme(theme)).toBe(false);
      });
    });

    describe("invalid color formats", () => {
      it("should reject plain color names", () => {
        const theme = {
          ...createMockTheme("test"),
          accent: "red",
        };

        expect(registry.isValidTheme(theme)).toBe(false);
      });

      it("should reject empty strings", () => {
        const theme = {
          ...createMockTheme("test"),
          accent: "",
        };

        expect(registry.isValidTheme(theme)).toBe(false);
      });

      it("should reject random strings", () => {
        const theme = {
          ...createMockTheme("test"),
          accent: "not-a-color",
        };

        expect(registry.isValidTheme(theme)).toBe(false);
      });
    });
  });

  describe("CSS gradient validation", () => {
    /**
     * Validates: Requirements 2.4
     * THE ThemeRegistry SHALL validate that the bg field is either a valid color or a valid CSS gradient string
     */
    describe("bg field accepts gradients", () => {
      it("should accept linear-gradient", () => {
        const theme = {
          ...createMockTheme("test"),
          bg: "linear-gradient(180deg, #1a1520 0%, #1e1215 100%)",
        };

        expect(registry.isValidTheme(theme)).toBe(true);
      });

      it("should accept radial-gradient", () => {
        const theme = {
          ...createMockTheme("test"),
          bg: "radial-gradient(circle, #1a1520 0%, #1e1215 100%)",
        };

        expect(registry.isValidTheme(theme)).toBe(true);
      });

      it("should accept conic-gradient", () => {
        const theme = {
          ...createMockTheme("test"),
          bg: "conic-gradient(from 0deg, #1a1520, #1e1215)",
        };

        expect(registry.isValidTheme(theme)).toBe(true);
      });

      it("should accept repeating-linear-gradient", () => {
        const theme = {
          ...createMockTheme("test"),
          bg: "repeating-linear-gradient(45deg, #1a1520, #1e1215 10px)",
        };

        expect(registry.isValidTheme(theme)).toBe(true);
      });

      it("should accept repeating-radial-gradient", () => {
        const theme = {
          ...createMockTheme("test"),
          bg: "repeating-radial-gradient(circle, #1a1520, #1e1215 10px)",
        };

        expect(registry.isValidTheme(theme)).toBe(true);
      });

      it("should accept repeating-conic-gradient", () => {
        const theme = {
          ...createMockTheme("test"),
          bg: "repeating-conic-gradient(from 0deg, #1a1520, #1e1215)",
        };

        expect(registry.isValidTheme(theme)).toBe(true);
      });

      it("should accept bg as a solid color", () => {
        const theme = {
          ...createMockTheme("test"),
          bg: "#0a0a0f",
        };

        expect(registry.isValidTheme(theme)).toBe(true);
      });
    });

    describe("accentGradient field accepts gradients", () => {
      it("should accept linear-gradient for accentGradient", () => {
        const theme = {
          ...createMockTheme("test"),
          accentGradient: "linear-gradient(135deg, #6366f1, #ec4899)",
        };

        expect(registry.isValidTheme(theme)).toBe(true);
      });

      it("should accept solid color for accentGradient", () => {
        const theme = {
          ...createMockTheme("test"),
          accentGradient: "#6366f1",
        };

        expect(registry.isValidTheme(theme)).toBe(true);
      });
    });

    describe("invalid gradients", () => {
      it("should reject gradients with unbalanced parentheses", () => {
        const theme = {
          ...createMockTheme("test"),
          bg: "linear-gradient(180deg, #1a1520 0%, #1e1215 100%", // Missing closing paren
        };

        expect(registry.isValidTheme(theme)).toBe(false);
      });

      it("should reject non-gradient strings for bg", () => {
        const theme = {
          ...createMockTheme("test"),
          bg: "not-a-gradient",
        };

        expect(registry.isValidTheme(theme)).toBe(false);
      });
    });

    describe("color-only fields reject gradients", () => {
      it("should reject gradient for accent field", () => {
        const theme = {
          ...createMockTheme("test"),
          accent: "linear-gradient(135deg, #6366f1, #ec4899)",
        };

        expect(registry.isValidTheme(theme)).toBe(false);
      });

      it("should reject gradient for textPrimary field", () => {
        const theme = {
          ...createMockTheme("test"),
          textPrimary: "linear-gradient(135deg, #ffffff, #000000)",
        };

        expect(registry.isValidTheme(theme)).toBe(false);
      });

      it("should reject gradient for bgSecondary field", () => {
        const theme = {
          ...createMockTheme("test"),
          bgSecondary: "linear-gradient(135deg, #ffffff, #000000)",
        };

        expect(registry.isValidTheme(theme)).toBe(false);
      });
    });
  });

  describe("getThemesByCategory", () => {
    /**
     * Validates: Requirements 3.1
     * WHEN filtering themes by category, THE ThemeRegistry SHALL return
     * only themes matching that ThemeCategory
     */
    it("should return only themes matching the specified category", () => {
      registry.registerTheme("dark", createMockTheme("dark", "original"));
      registry.registerTheme("ocean", createMockTheme("ocean", "extended"));
      registry.registerTheme("sunset", createMockTheme("sunset", "extended"));
      registry.registerTheme("corporate", createMockTheme("corporate", "european"));

      const extendedThemes = registry.getThemesByCategory("extended");

      expect(extendedThemes).toHaveLength(2);
      expect(extendedThemes.map((t) => t.name).sort()).toEqual(["ocean", "sunset"]);
    });

    it("should return empty array when no themes match the category", () => {
      registry.registerTheme("dark", createMockTheme("dark", "original"));
      registry.registerTheme("ocean", createMockTheme("ocean", "extended"));

      const canvaThemes = registry.getThemesByCategory("canva");

      expect(canvaThemes).toEqual([]);
    });

    it("should return empty array when no themes are registered", () => {
      const themes = registry.getThemesByCategory("original");

      expect(themes).toEqual([]);
    });

    it("should return all themes of a category when multiple exist", () => {
      registry.registerTheme("dark", createMockTheme("dark", "original"));
      registry.registerTheme("bold", createMockTheme("bold", "original"));
      registry.registerTheme("clean", createMockTheme("clean", "original"));
      registry.registerTheme("ocean", createMockTheme("ocean", "extended"));

      const originalThemes = registry.getThemesByCategory("original");

      expect(originalThemes).toHaveLength(3);
      expect(originalThemes.every((t) => t.category === "original")).toBe(true);
    });

    it("should return a new array copy", () => {
      registry.registerTheme("dark", createMockTheme("dark", "original"));

      const themes1 = registry.getThemesByCategory("original");
      const themes2 = registry.getThemesByCategory("original");

      expect(themes1).not.toBe(themes2);
      expect(themes1).toEqual(themes2);
    });

    it("should return frozen theme objects", () => {
      registry.registerTheme("dark", createMockTheme("dark", "original"));

      const themes = registry.getThemesByCategory("original");

      expect(themes).toHaveLength(1);
      expect(Object.isFrozen(themes[0])).toBe(true);
    });
  });

  describe("getCompatibleThemes", () => {
    /**
     * Validates: Requirements 3.4
     * WHEN a template specifies neither compatibleThemes nor excludedThemes,
     * THE ThemeRegistry SHALL return all themes
     */
    it("should return all themes when neither compatibleThemes nor excludedThemes is specified", () => {
      registry.registerTheme("dark", createMockTheme("dark", "original"));
      registry.registerTheme("ocean", createMockTheme("ocean", "extended"));
      registry.registerTheme("sunset", createMockTheme("sunset", "extended"));
      registry.registerTheme("neon", createMockTheme("neon", "flat"));
      registry.registerTheme("corporate", createMockTheme("corporate", "european"));

      const themes = registry.getCompatibleThemes({});

      expect(themes).toHaveLength(5);
    });

    it("should return all themes when both arrays are empty", () => {
      registry.registerTheme("dark", createMockTheme("dark", "original"));
      registry.registerTheme("ocean", createMockTheme("ocean", "extended"));

      const themes = registry.getCompatibleThemes({
        compatibleThemes: [],
        excludedThemes: [],
      });

      expect(themes).toHaveLength(2);
    });

    /**
     * Validates: Requirements 3.3
     * WHEN a template specifies compatibleThemes, THE ThemeRegistry SHALL
     * return only themes in that list
     */
    it("should return only compatible themes when compatibleThemes is specified", () => {
      registry.registerTheme("dark", createMockTheme("dark", "original"));
      registry.registerTheme("ocean", createMockTheme("ocean", "extended"));
      registry.registerTheme("sunset", createMockTheme("sunset", "extended"));

      const themes = registry.getCompatibleThemes({
        compatibleThemes: ["dark", "ocean"],
      });

      expect(themes).toHaveLength(2);
      expect(themes.map((t) => t.name).sort()).toEqual(["dark", "ocean"]);
    });

    it("should handle case-insensitive matching for compatibleThemes", () => {
      registry.registerTheme("dark", createMockTheme("dark", "original"));
      registry.registerTheme("ocean", createMockTheme("ocean", "extended"));
      registry.registerTheme("sunset", createMockTheme("sunset", "extended"));

      const themes = registry.getCompatibleThemes({
        compatibleThemes: ["DARK", "Ocean", "SUNSET"],
      });

      expect(themes).toHaveLength(3);
      expect(themes.map((t) => t.name).sort()).toEqual(["dark", "ocean", "sunset"]);
    });

    it("should return empty array when compatibleThemes contains no matching themes", () => {
      registry.registerTheme("dark", createMockTheme("dark", "original"));

      const themes = registry.getCompatibleThemes({
        compatibleThemes: ["nonexistent", "also-nonexistent"],
      });

      expect(themes).toEqual([]);
    });

    it("should ignore non-existent themes in compatibleThemes list", () => {
      registry.registerTheme("dark", createMockTheme("dark", "original"));
      registry.registerTheme("ocean", createMockTheme("ocean", "extended"));

      const themes = registry.getCompatibleThemes({
        compatibleThemes: ["dark", "nonexistent", "ocean"],
      });

      expect(themes).toHaveLength(2);
      expect(themes.map((t) => t.name).sort()).toEqual(["dark", "ocean"]);
    });

    /**
     * Validates: Requirements 3.2
     * WHEN requesting compatible themes for a template, THE ThemeRegistry SHALL
     * return themes not in the template's excludedThemes list
     */
    it("should exclude themes when excludedThemes is specified", () => {
      registry.registerTheme("dark", createMockTheme("dark", "original"));
      registry.registerTheme("ocean", createMockTheme("ocean", "extended"));
      registry.registerTheme("sunset", createMockTheme("sunset", "extended"));
      registry.registerTheme("neon", createMockTheme("neon", "flat"));
      registry.registerTheme("corporate", createMockTheme("corporate", "european"));

      const themes = registry.getCompatibleThemes({
        excludedThemes: ["neon", "corporate"],
      });

      expect(themes).toHaveLength(3);
      expect(themes.map((t) => t.name).sort()).toEqual(["dark", "ocean", "sunset"]);
    });

    it("should handle case-insensitive matching for excludedThemes", () => {
      registry.registerTheme("dark", createMockTheme("dark", "original"));
      registry.registerTheme("ocean", createMockTheme("ocean", "extended"));
      registry.registerTheme("neon", createMockTheme("neon", "flat"));
      registry.registerTheme("corporate", createMockTheme("corporate", "european"));

      const themes = registry.getCompatibleThemes({
        excludedThemes: ["NEON", "Corporate"],
      });

      expect(themes).toHaveLength(2);
      expect(themes.map((t) => t.name).sort()).toEqual(["dark", "ocean"]);
    });

    it("should return all themes when excludedThemes contains no matching themes", () => {
      registry.registerTheme("dark", createMockTheme("dark", "original"));
      registry.registerTheme("ocean", createMockTheme("ocean", "extended"));

      const themes = registry.getCompatibleThemes({
        excludedThemes: ["nonexistent"],
      });

      expect(themes).toHaveLength(2);
    });

    it("should ignore non-existent themes in excludedThemes list", () => {
      registry.registerTheme("dark", createMockTheme("dark", "original"));
      registry.registerTheme("ocean", createMockTheme("ocean", "extended"));

      const themes = registry.getCompatibleThemes({
        excludedThemes: ["dark", "nonexistent"],
      });

      expect(themes).toHaveLength(1);
      expect(themes.map((t) => t.name)).not.toContain("dark");
    });

    /**
     * Validates: Requirements 3.3
     * compatibleThemes takes precedence over excludedThemes
     */
    it("should prioritize compatibleThemes over excludedThemes when both are specified", () => {
      registry.registerTheme("dark", createMockTheme("dark", "original"));
      registry.registerTheme("ocean", createMockTheme("ocean", "extended"));
      registry.registerTheme("neon", createMockTheme("neon", "flat"));

      const themes = registry.getCompatibleThemes({
        compatibleThemes: ["dark", "ocean", "neon"],
        excludedThemes: ["neon"], // This should be ignored
      });

      expect(themes).toHaveLength(3);
      expect(themes.map((t) => t.name).sort()).toEqual(["dark", "neon", "ocean"]);
    });

    it("should return a new array copy", () => {
      registry.registerTheme("dark", createMockTheme("dark", "original"));

      const themes1 = registry.getCompatibleThemes({});
      const themes2 = registry.getCompatibleThemes({});

      expect(themes1).not.toBe(themes2);
      expect(themes1).toEqual(themes2);
    });

    it("should return frozen theme objects", () => {
      registry.registerTheme("dark", createMockTheme("dark", "original"));

      const themes = registry.getCompatibleThemes({
        compatibleThemes: ["dark"],
      });

      expect(themes).toHaveLength(1);
      expect(Object.isFrozen(themes[0])).toBe(true);
    });

    it("should work with empty registry", () => {
      const themes = registry.getCompatibleThemes({
        compatibleThemes: ["dark", "ocean"],
      });

      expect(themes).toEqual([]);
    });

    it("should handle single theme in compatibleThemes", () => {
      registry.registerTheme("dark", createMockTheme("dark", "original"));

      const themes = registry.getCompatibleThemes({
        compatibleThemes: ["dark"],
      });

      expect(themes).toHaveLength(1);
      expect(themes[0].name).toBe("dark");
    });

    it("should handle excluding all themes", () => {
      registry.registerTheme("dark", createMockTheme("dark", "original"));
      registry.registerTheme("ocean", createMockTheme("ocean", "extended"));

      const themes = registry.getCompatibleThemes({
        excludedThemes: ["dark", "ocean"],
      });

      expect(themes).toEqual([]);
    });
  });
});
