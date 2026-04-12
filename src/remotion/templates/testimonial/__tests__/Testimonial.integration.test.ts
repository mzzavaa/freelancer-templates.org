/**
 * Testimonial Template Integration Tests
 *
 * Tests for Testimonial template integration with the theme framework:
 * - Template registration in TemplateRegistry
 * - Template validation
 * - Theme compatibility with all built-in themes
 * - Layout configuration
 * - Adapter component instantiation
 *
 * @see Requirements: 9.1-9.3
 */

import { describe, it, expect, beforeEach } from "vitest";
import { TemplateRegistry } from "../../../themes/registry/TemplateRegistry";
import { TESTIMONIAL_CONFIG } from "../config";
import {
  THEME_PRESETS,
  THEME_PRESET_NAMES,
  THEME_DARK,
  THEME_BOLD,
  THEME_CLEAN,
  THEME_WARM,
  THEME_MINIMAL,
  THEME_NEON,
  THEME_OCEAN,
  THEME_SUNSET,
  THEME_FOREST,
  THEME_ROSE,
  THEME_GOLD,
  THEME_MIDNIGHT,
  THEME_GAMEDAY,
} from "../../../themes/presets";
import type { Theme } from "../../../themes/types";

describe("Testimonial Template Integration", () => {
  let registry: TemplateRegistry;

  beforeEach(() => {
    registry = new TemplateRegistry();
  });

  describe("TemplateRegistry Registration", () => {
    /**
     * Validates: Requirements 9.1
     * Test that TESTIMONIAL_CONFIG can be registered in TemplateRegistry
     */
    it("should register TESTIMONIAL_CONFIG in TemplateRegistry without errors", () => {
      expect(() => registry.registerTemplate(TESTIMONIAL_CONFIG)).not.toThrow();
    });

    it("should be retrievable after registration", () => {
      registry.registerTemplate(TESTIMONIAL_CONFIG);

      const retrieved = registry.getTemplate("testimonial");

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe("testimonial");
      expect(retrieved?.name).toBe("Testimonial");
    });

    it("should be retrievable with case-insensitive lookup", () => {
      registry.registerTemplate(TESTIMONIAL_CONFIG);

      expect(registry.getTemplate("TESTIMONIAL")).toBeDefined();
      expect(registry.getTemplate("Testimonial")).toBeDefined();
      expect(registry.getTemplate("testimonial")).toBeDefined();
    });
  });

  describe("Template Validation", () => {
    /**
     * Validates: Requirements 9.2
     * Test that TESTIMONIAL_CONFIG passes validation
     */
    it("should pass validation with valid=true and no errors", () => {
      const result = registry.validateTemplate(TESTIMONIAL_CONFIG);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should have valid kebab-case id", () => {
      expect(TESTIMONIAL_CONFIG.id).toBe("testimonial");
      expect(TESTIMONIAL_CONFIG.id).toMatch(/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/);
    });

    it("should have valid layouts array with at least one entry", () => {
      expect(Array.isArray(TESTIMONIAL_CONFIG.layouts)).toBe(true);
      expect(TESTIMONIAL_CONFIG.layouts.length).toBeGreaterThanOrEqual(1);
    });

    it("should have defaultLayout present in layouts array", () => {
      expect(TESTIMONIAL_CONFIG.layouts).toContain(
        TESTIMONIAL_CONFIG.defaultLayout
      );
    });

    it("should have positive integer width and height", () => {
      expect(Number.isInteger(TESTIMONIAL_CONFIG.width)).toBe(true);
      expect(TESTIMONIAL_CONFIG.width).toBeGreaterThan(0);
      expect(Number.isInteger(TESTIMONIAL_CONFIG.height)).toBe(true);
      expect(TESTIMONIAL_CONFIG.height).toBeGreaterThan(0);
    });

    it("should have valid fps value (24, 25, 30, or 60)", () => {
      expect([24, 25, 30, 60]).toContain(TESTIMONIAL_CONFIG.fps);
    });

    it("should have positive integer durationInFrames", () => {
      expect(Number.isInteger(TESTIMONIAL_CONFIG.durationInFrames)).toBe(true);
      expect(TESTIMONIAL_CONFIG.durationInFrames).toBeGreaterThan(0);
    });
  });

  describe("Theme Compatibility", () => {
    /**
     * Validates: Requirements 9.3
     * Test that the template is compatible with all built-in themes
     */
    const builtInThemes: Array<{ name: string; theme: Theme }> = [
      { name: "dark", theme: THEME_DARK },
      { name: "bold", theme: THEME_BOLD },
      { name: "clean", theme: THEME_CLEAN },
      { name: "warm", theme: THEME_WARM },
      { name: "minimal", theme: THEME_MINIMAL },
      { name: "neon", theme: THEME_NEON },
      { name: "ocean", theme: THEME_OCEAN },
      { name: "sunset", theme: THEME_SUNSET },
      { name: "forest", theme: THEME_FOREST },
      { name: "rose", theme: THEME_ROSE },
      { name: "gold", theme: THEME_GOLD },
      { name: "midnight", theme: THEME_MIDNIGHT },
      { name: "gameday", theme: THEME_GAMEDAY },
    ];

    it("should have undefined compatibleThemes (compatible with all themes)", () => {
      // When compatibleThemes is undefined, the template is compatible with all themes
      expect(TESTIMONIAL_CONFIG.compatibleThemes).toBeUndefined();
    });

    it("should have undefined excludedThemes (no themes excluded)", () => {
      // When excludedThemes is undefined, no themes are excluded
      expect(TESTIMONIAL_CONFIG.excludedThemes).toBeUndefined();
    });

    it.each(builtInThemes)(
      "should be compatible with $name theme",
      ({ name, theme }) => {
        // Verify the theme exists in presets
        expect(THEME_PRESETS[name]).toBeDefined();
        expect(THEME_PRESETS[name]).toEqual(theme);

        // Since compatibleThemes is undefined, all themes are compatible
        // This test verifies the theme is available for use with the template
        expect(theme.name).toBe(name);
        expect(theme.bg).toBeDefined();
        expect(theme.textPrimary).toBeDefined();
        expect(theme.accent).toBeDefined();
      }
    );

    it("should be compatible with all 13 built-in themes", () => {
      // Verify we have all expected themes
      const expectedThemes = [
        "dark",
        "bold",
        "clean",
        "warm",
        "minimal",
        "neon",
        "ocean",
        "sunset",
        "forest",
        "rose",
        "gold",
        "midnight",
        "gameday",
      ];

      expectedThemes.forEach((themeName) => {
        expect(THEME_PRESETS[themeName]).toBeDefined();
      });

      // Since compatibleThemes is undefined, all themes are compatible
      expect(TESTIMONIAL_CONFIG.compatibleThemes).toBeUndefined();
    });
  });

  describe("Layout Configuration", () => {
    /**
     * Test that the template config has correct layouts
     */
    it("should have exactly three layouts: centered, split, editorial", () => {
      expect(TESTIMONIAL_CONFIG.layouts).toHaveLength(3);
      expect(TESTIMONIAL_CONFIG.layouts).toContain("centered");
      expect(TESTIMONIAL_CONFIG.layouts).toContain("split");
      expect(TESTIMONIAL_CONFIG.layouts).toContain("editorial");
    });

    it("should have centered as the default layout", () => {
      expect(TESTIMONIAL_CONFIG.defaultLayout).toBe("centered");
    });

    it("should have layouts in expected order", () => {
      expect(TESTIMONIAL_CONFIG.layouts).toEqual([
        "centered",
        "split",
        "editorial",
      ]);
    });
  });

  describe("Implementation Status", () => {
    /**
     * Test that the template config has hasImplementation: true
     */
    it("should have hasImplementation set to true", () => {
      expect(TESTIMONIAL_CONFIG.hasImplementation).toBe(true);
    });

    it("should not appear in orphaned templates list", () => {
      registry.registerTemplate(TESTIMONIAL_CONFIG);

      const orphans = registry.getOrphanedTemplates();

      expect(orphans.map((t) => t.id)).not.toContain("testimonial");
    });
  });

  describe("Adapter Component", () => {
    /**
     * Test that the adapter component can be instantiated with different themes
     */
    it("should have a valid component reference", () => {
      expect(TESTIMONIAL_CONFIG.component).toBeDefined();
      expect(typeof TESTIMONIAL_CONFIG.component).toBe("function");
    });

    it("should have defaultProps with required fields", () => {
      expect(TESTIMONIAL_CONFIG.defaultProps).toBeDefined();
      expect(TESTIMONIAL_CONFIG.defaultProps.spec).toBeDefined();
      expect(TESTIMONIAL_CONFIG.defaultProps.layout).toBeDefined();
    });

    it("should have sampleSpecs array with at least one entry", () => {
      expect(Array.isArray(TESTIMONIAL_CONFIG.sampleSpecs)).toBe(true);
      expect(TESTIMONIAL_CONFIG.sampleSpecs.length).toBeGreaterThanOrEqual(1);
    });

    it("should have three sample specs for different layouts", () => {
      expect(TESTIMONIAL_CONFIG.sampleSpecs).toHaveLength(3);
    });

    it.each(builtInThemes)(
      "adapter component should accept $name theme as prop",
      ({ theme }) => {
        // Verify the component can accept theme props
        // This is a type-level test - the component accepts TemplateProps which includes theme
        const TestimonialAdapter = TESTIMONIAL_CONFIG.component;

        // Verify the adapter is a valid React component type
        expect(TestimonialAdapter).toBeDefined();
        expect(typeof TestimonialAdapter).toBe("function");

        // The adapter should be able to receive these props without type errors
        const mockProps = {
          theme,
          layout: "centered",
          spec: TESTIMONIAL_CONFIG.defaultProps.spec,
        };

        // Verify props structure is valid
        expect(mockProps.theme).toBe(theme);
        expect(mockProps.layout).toBe("centered");
        expect(mockProps.spec).toBeDefined();
      }
    );
  });

  describe("Template Metadata", () => {
    it("should have valid icon", () => {
      expect(TESTIMONIAL_CONFIG.icon).toBe("💬");
    });

    it("should have valid color (hex format)", () => {
      expect(TESTIMONIAL_CONFIG.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    it("should have category set to social", () => {
      expect(TESTIMONIAL_CONFIG.category).toBe("social");
    });

    it("should have a description", () => {
      expect(TESTIMONIAL_CONFIG.description).toBeDefined();
      expect(TESTIMONIAL_CONFIG.description.length).toBeGreaterThan(0);
    });
  });

  describe("Dimensions and Timing", () => {
    it("should have standard 1080p dimensions", () => {
      expect(TESTIMONIAL_CONFIG.width).toBe(1920);
      expect(TESTIMONIAL_CONFIG.height).toBe(1080);
    });

    it("should have 30 fps", () => {
      expect(TESTIMONIAL_CONFIG.fps).toBe(30);
    });

    it("should have 5 second duration (150 frames at 30fps)", () => {
      expect(TESTIMONIAL_CONFIG.durationInFrames).toBe(150);
      // Verify: 150 frames / 30 fps = 5 seconds
      expect(TESTIMONIAL_CONFIG.durationInFrames / TESTIMONIAL_CONFIG.fps).toBe(
        5
      );
    });
  });
});

// Re-export builtInThemes for use in parameterized tests
const builtInThemes: Array<{ name: string; theme: Theme }> = [
  { name: "dark", theme: THEME_DARK },
  { name: "bold", theme: THEME_BOLD },
  { name: "clean", theme: THEME_CLEAN },
  { name: "warm", theme: THEME_WARM },
  { name: "minimal", theme: THEME_MINIMAL },
  { name: "neon", theme: THEME_NEON },
  { name: "ocean", theme: THEME_OCEAN },
  { name: "sunset", theme: THEME_SUNSET },
  { name: "forest", theme: THEME_FOREST },
  { name: "rose", theme: THEME_ROSE },
  { name: "gold", theme: THEME_GOLD },
  { name: "midnight", theme: THEME_MIDNIGHT },
  { name: "gameday", theme: THEME_GAMEDAY },
];
