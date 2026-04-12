/**
 * Integration Tests for generate-compositions.ts
 *
 * Tests for the composition generation script that initializes registries
 * and generates all composition configurations.
 *
 * Test Coverage:
 * - Composition Generation Tests
 * - Registry Integration Tests
 * - Export Function Tests
 * - Backward Compatibility Tests
 *
 * @see Requirements: 9.1-9.3, 14.1-14.3
 */

import { describe, it, expect } from "vitest";
import {
  compositions,
  themeRegistry,
  templateRegistry,
  generator,
  generateManifest,
  generateRootContent,
  generateWithStats,
} from "../generate-compositions";

// ═══════════════════════════════════════════════════════════════════════════
// Composition Generation Tests
// ═══════════════════════════════════════════════════════════════════════════

describe("Composition Generation", () => {
  /**
   * Validates: Requirements 7.1
   * THE compositions array SHALL not be empty when templates and themes are registered
   */
  describe("compositions array", () => {
    it("should not be empty", () => {
      expect(compositions).toBeDefined();
      expect(Array.isArray(compositions)).toBe(true);
      expect(compositions.length).toBeGreaterThan(0);
    });

    /**
     * Validates: Requirements 7.1-7.6
     * All compositions SHALL have required properties
     */
    it("should have all required properties on each composition", () => {
      for (const comp of compositions) {
        // Identity
        expect(comp.id).toBeDefined();
        expect(typeof comp.id).toBe("string");
        expect(comp.id.length).toBeGreaterThan(0);

        // Component
        expect(comp.component).toBeDefined();
        expect(typeof comp.component).toBe("function");

        // Dimensions
        expect(comp.durationInFrames).toBeDefined();
        expect(typeof comp.durationInFrames).toBe("number");
        expect(comp.durationInFrames).toBeGreaterThan(0);

        expect(comp.fps).toBeDefined();
        expect(typeof comp.fps).toBe("number");
        expect([24, 25, 30, 60]).toContain(comp.fps);

        expect(comp.width).toBeDefined();
        expect(typeof comp.width).toBe("number");
        expect(comp.width).toBeGreaterThan(0);

        expect(comp.height).toBeDefined();
        expect(typeof comp.height).toBe("number");
        expect(comp.height).toBeGreaterThan(0);

        // Metadata
        expect(comp.templateId).toBeDefined();
        expect(typeof comp.templateId).toBe("string");

        expect(comp.themeName).toBeDefined();
        expect(typeof comp.themeName).toBe("string");

        expect(comp.layoutName).toBeDefined();
        expect(typeof comp.layoutName).toBe("string");

        // Default props
        expect(comp.defaultProps).toBeDefined();
        expect(comp.defaultProps.theme).toBeDefined();
        expect(comp.defaultProps.layout).toBeDefined();
      }
    });

    /**
     * Validates: Requirements 18.1-18.3
     * All composition IDs SHALL be unique
     */
    it("should have unique composition IDs", () => {
      const ids = compositions.map((c) => c.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });

    /**
     * Validates: Requirements 7.6
     * Composition IDs SHALL follow expected naming pattern (PascalCase with hyphens)
     */
    it("should have composition IDs following expected naming pattern", () => {
      const idPattern = /^[A-Z][a-zA-Z0-9]*(-[A-Z][a-zA-Z0-9]*)+$/;

      for (const comp of compositions) {
        expect(comp.id).toMatch(idPattern);
      }
    });

    it("should have composition IDs in Template-Theme-Layout format", () => {
      for (const comp of compositions) {
        const parts = comp.id.split("-");
        // Should have at least 3 parts: Template, Theme, Layout
        expect(parts.length).toBeGreaterThanOrEqual(3);

        // Each part should start with uppercase
        for (const part of parts) {
          expect(part[0]).toBe(part[0].toUpperCase());
        }
      }
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Registry Integration Tests
// ═══════════════════════════════════════════════════════════════════════════

describe("Registry Integration", () => {
  /**
   * Validates: Requirements 1.1, 1.7
   * THE themeRegistry SHALL be populated with themes from THEME_PRESETS
   */
  describe("themeRegistry", () => {
    it("should be populated with themes", () => {
      expect(themeRegistry).toBeDefined();
      expect(themeRegistry.size).toBeGreaterThan(0);
    });

    it("should have getAllThemes method returning themes", () => {
      const themes = themeRegistry.getAllThemes();
      expect(Array.isArray(themes)).toBe(true);
      expect(themes.length).toBeGreaterThan(0);
    });

    it("should have getThemeNames method returning theme names", () => {
      const names = themeRegistry.getThemeNames();
      expect(Array.isArray(names)).toBe(true);
      expect(names.length).toBeGreaterThan(0);
    });

    it("should allow retrieving individual themes by name", () => {
      const names = themeRegistry.getThemeNames();
      expect(names.length).toBeGreaterThan(0);

      const firstThemeName = names[0];
      const theme = themeRegistry.getTheme(firstThemeName);

      expect(theme).toBeDefined();
      expect(theme?.name).toBe(firstThemeName);
    });
  });

  /**
   * Validates: Requirements 4.1, 4.2
   * THE templateRegistry SHALL be populated with template configurations
   */
  describe("templateRegistry", () => {
    it("should be populated with templates", () => {
      expect(templateRegistry).toBeDefined();
      expect(templateRegistry.size).toBeGreaterThan(0);
    });

    it("should have getAllTemplates method returning templates", () => {
      const templates = templateRegistry.getAllTemplates();
      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBeGreaterThan(0);
    });

    it("should have the testimonial template registered", () => {
      const testimonial = templateRegistry.getTemplate("testimonial");
      expect(testimonial).toBeDefined();
      expect(testimonial?.id).toBe("testimonial");
    });

    it("should have templates with hasImplementation set to true", () => {
      const templates = templateRegistry.getAllTemplates();
      const implementedTemplates = templates.filter((t) => t.hasImplementation);

      expect(implementedTemplates.length).toBeGreaterThan(0);
    });
  });

  /**
   * Validates: Requirements 7.1-7.6
   * THE generator SHALL be properly initialized with both registries
   */
  describe("generator", () => {
    it("should be properly initialized", () => {
      expect(generator).toBeDefined();
    });

    it("should be able to generate compositions", () => {
      const generatedComps = generator.generateCompositions();
      expect(Array.isArray(generatedComps)).toBe(true);
      expect(generatedComps.length).toBeGreaterThan(0);
    });

    it("should generate same compositions as exported compositions array", () => {
      const generatedComps = generator.generateCompositions();

      // Should have same length
      expect(generatedComps.length).toBe(compositions.length);

      // Should have same IDs
      const generatedIds = new Set(generatedComps.map((c) => c.id));
      const exportedIds = new Set(compositions.map((c) => c.id));

      expect(generatedIds).toEqual(exportedIds);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Export Function Tests
// ═══════════════════════════════════════════════════════════════════════════

describe("Export Functions", () => {
  /**
   * Validates: Requirements 14.2
   * THE generateManifest function SHALL return valid JSON
   */
  describe("generateManifest", () => {
    it("should return a valid JSON string", () => {
      const manifest = generateManifest();

      expect(typeof manifest).toBe("string");
      expect(manifest.length).toBeGreaterThan(0);

      // Should be parseable as JSON
      expect(() => JSON.parse(manifest)).not.toThrow();
    });

    it("should return JSON with expected structure", () => {
      const manifest = generateManifest();
      const parsed = JSON.parse(manifest);

      expect(parsed.generatedAt).toBeDefined();
      expect(typeof parsed.generatedAt).toBe("string");

      expect(parsed.totalCompositions).toBeDefined();
      expect(typeof parsed.totalCompositions).toBe("number");
      expect(parsed.totalCompositions).toBeGreaterThan(0);

      expect(parsed.compositions).toBeDefined();
      expect(Array.isArray(parsed.compositions)).toBe(true);
      expect(parsed.compositions.length).toBe(parsed.totalCompositions);
    });

    it("should include composition metadata in manifest", () => {
      const manifest = generateManifest();
      const parsed = JSON.parse(manifest);

      for (const comp of parsed.compositions) {
        expect(comp.id).toBeDefined();
        expect(comp.templateId).toBeDefined();
        expect(comp.themeName).toBeDefined();
        expect(comp.layoutName).toBeDefined();
        expect(comp.width).toBeDefined();
        expect(comp.height).toBeDefined();
        expect(comp.fps).toBeDefined();
        expect(comp.durationInFrames).toBeDefined();
      }
    });
  });

  /**
   * Validates: Requirements 14.1, 14.3
   * THE generateRootContent function SHALL return valid JSX string
   */
  describe("generateRootContent", () => {
    it("should return a non-empty string", () => {
      const rootContent = generateRootContent();

      expect(typeof rootContent).toBe("string");
      expect(rootContent.length).toBeGreaterThan(0);
    });

    it("should contain Composition elements", () => {
      const rootContent = generateRootContent();

      expect(rootContent).toContain("<Composition");
      expect(rootContent).toContain("/>");
    });

    it("should contain composition IDs", () => {
      const rootContent = generateRootContent();

      // Should contain at least one composition ID
      const hasCompositionId = compositions.some((comp) =>
        rootContent.includes(`id="${comp.id}"`)
      );
      expect(hasCompositionId).toBe(true);
    });

    it("should contain import statements", () => {
      const rootContent = generateRootContent();

      expect(rootContent).toContain("import");
      expect(rootContent).toContain("Composition");
    });

    it("should contain JSX wrapper elements", () => {
      const rootContent = generateRootContent();

      expect(rootContent).toContain("<>");
      expect(rootContent).toContain("</>");
    });
  });

  /**
   * Validates: Requirements 7.1-7.6, 16.1-16.3
   * THE generateWithStats function SHALL return metadata about generation
   */
  describe("generateWithStats", () => {
    it("should return a result object with compositions", () => {
      const result = generateWithStats();

      expect(result).toBeDefined();
      expect(result.compositions).toBeDefined();
      expect(Array.isArray(result.compositions)).toBe(true);
      expect(result.compositions.length).toBeGreaterThan(0);
    });

    it("should return metadata about templates processed", () => {
      const result = generateWithStats();

      expect(result.templatesProcessed).toBeDefined();
      expect(typeof result.templatesProcessed).toBe("number");
      expect(result.templatesProcessed).toBeGreaterThan(0);
    });

    it("should return metadata about templates skipped", () => {
      const result = generateWithStats();

      expect(result.templatesSkipped).toBeDefined();
      expect(typeof result.templatesSkipped).toBe("number");
      expect(result.templatesSkipped).toBeGreaterThanOrEqual(0);
    });

    it("should return metadata about themes used", () => {
      const result = generateWithStats();

      expect(result.themesUsed).toBeDefined();
      expect(typeof result.themesUsed).toBe("number");
      expect(result.themesUsed).toBeGreaterThan(0);
    });

    it("should return orphaned templates array", () => {
      const result = generateWithStats();

      expect(result.orphanedTemplates).toBeDefined();
      expect(Array.isArray(result.orphanedTemplates)).toBe(true);
    });

    it("should return warnings array", () => {
      const result = generateWithStats();

      expect(result.warnings).toBeDefined();
      expect(Array.isArray(result.warnings)).toBe(true);
    });

    it("should have consistent composition count with exported compositions", () => {
      const result = generateWithStats();

      expect(result.compositions.length).toBe(compositions.length);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Backward Compatibility Tests
// ═══════════════════════════════════════════════════════════════════════════

describe("Backward Compatibility", () => {
  /**
   * Validates: Requirements 9.1-9.3
   * THE Testimonial template compositions SHALL be generated
   */
  describe("Testimonial template compositions", () => {
    it("should generate Testimonial template compositions", () => {
      const testimonialComps = compositions.filter(
        (c) => c.templateId === "testimonial"
      );

      expect(testimonialComps.length).toBeGreaterThan(0);
    });

    it("should have Testimonial compositions with expected layouts", () => {
      const testimonialComps = compositions.filter(
        (c) => c.templateId === "testimonial"
      );

      const layouts = new Set(testimonialComps.map((c) => c.layoutName));

      // Testimonial should have at least one layout
      expect(layouts.size).toBeGreaterThan(0);
    });

    it("should have Testimonial compositions with multiple themes", () => {
      const testimonialComps = compositions.filter(
        (c) => c.templateId === "testimonial"
      );

      const themes = new Set(testimonialComps.map((c) => c.themeName));

      // Testimonial should work with multiple themes
      expect(themes.size).toBeGreaterThan(1);
    });
  });

  /**
   * Validates: Requirements 9.1-9.3
   * Composition IDs SHALL match expected patterns for existing templates
   */
  describe("composition ID patterns", () => {
    it("should have Testimonial composition IDs starting with 'Testimonial-'", () => {
      const testimonialComps = compositions.filter(
        (c) => c.templateId === "testimonial"
      );

      for (const comp of testimonialComps) {
        expect(comp.id).toMatch(/^Testimonial-/);
      }
    });

    it("should have composition IDs matching Template-Theme-Layout pattern", () => {
      for (const comp of compositions) {
        // Convert templateId to PascalCase for comparison
        const templatePascal = comp.templateId
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join("");

        expect(comp.id).toContain(templatePascal);
      }
    });

    it("should have composition IDs that can be parsed back to components", () => {
      for (const comp of compositions) {
        const parts = comp.id.split("-");

        // Should have at least 3 parts
        expect(parts.length).toBeGreaterThanOrEqual(3);

        // First part should be template (PascalCase)
        expect(parts[0][0]).toBe(parts[0][0].toUpperCase());
      }
    });
  });

  /**
   * Validates: Requirements 9.1-9.3
   * Existing preview URLs SHALL continue to work
   */
  describe("preview URL compatibility", () => {
    it("should generate compositions that can be used as Remotion composition IDs", () => {
      for (const comp of compositions) {
        // Remotion composition IDs should not contain special characters
        // except hyphens and alphanumeric characters
        expect(comp.id).toMatch(/^[A-Za-z0-9-]+$/);
      }
    });

    it("should have compositions with valid component references", () => {
      for (const comp of compositions) {
        expect(comp.component).toBeDefined();
        expect(typeof comp.component).toBe("function");
      }
    });

    it("should have compositions with valid default props for rendering", () => {
      for (const comp of compositions) {
        expect(comp.defaultProps).toBeDefined();
        expect(comp.defaultProps.theme).toBeDefined();
        expect(comp.defaultProps.layout).toBeDefined();
        expect(typeof comp.defaultProps.layout).toBe("string");
      }
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Cross-Registry Consistency Tests
// ═══════════════════════════════════════════════════════════════════════════

describe("Cross-Registry Consistency", () => {
  it("should have compositions only for registered templates", () => {
    const registeredTemplateIds = new Set(
      templateRegistry.getAllTemplates().map((t) => t.id)
    );

    for (const comp of compositions) {
      expect(registeredTemplateIds.has(comp.templateId)).toBe(true);
    }
  });

  it("should have compositions only for registered themes", () => {
    const registeredThemeNames = new Set(themeRegistry.getThemeNames());

    for (const comp of compositions) {
      expect(registeredThemeNames.has(comp.themeName)).toBe(true);
    }
  });

  it("should have composition themes matching registry themes", () => {
    for (const comp of compositions) {
      const registryTheme = themeRegistry.getTheme(comp.themeName);
      expect(registryTheme).toBeDefined();
      expect(comp.defaultProps.theme.name).toBe(registryTheme?.name);
    }
  });

  it("should have composition layouts matching template layouts", () => {
    for (const comp of compositions) {
      const template = templateRegistry.getTemplate(comp.templateId);
      expect(template).toBeDefined();
      expect(template?.layouts).toContain(comp.layoutName);
    }
  });
});
