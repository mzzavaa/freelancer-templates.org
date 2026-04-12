/**
 * CompositionGenerator Unit Tests - Part 1
 *
 * Tests for:
 * - Test setup with mock registries
 * - Constructor tests
 * - generateCompositions basic tests
 *
 * @see Requirements: 7.1-7.6
 */

import { describe, it, expect, beforeEach } from "vitest";
import { CompositionGenerator } from "../CompositionGenerator";
import type { Theme, ThemeCategory } from "../../types/theme";
import type { TemplateConfig, TemplateProps } from "../../types/template";
import type { ComponentType } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// Mock Component
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Mock component for testing.
 */
const MockComponent: ComponentType<TemplateProps> = () => null;

// ═══════════════════════════════════════════════════════════════════════════
// Mock Theme Factory
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates a valid mock theme for testing.
 */
function createMockTheme(
  name: string,
  category: ThemeCategory = "original",
  overrides: Partial<Theme> = {}
): Theme {
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
    accentGradient: "linear-gradient(135deg, #6366f1, #ec4899)",
    cardBorder: "rgba(99,102,241,0.25)",
    cardShadow: "0 4px 24px rgba(0,0,0,0.3)",
    borderRadius: 12,
    fontFamily: "'Inter', sans-serif",
    headingWeight: 700,
    bodyWeight: 400,
    ...overrides,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// Mock Template Factory
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates a valid mock template config for testing.
 */
function createMockTemplateConfig(
  id: string = "test-template",
  overrides: Partial<TemplateConfig> = {}
): TemplateConfig {
  return {
    id,
    name: "Test Template",
    description: "A test template for unit testing",
    component: MockComponent,
    layouts: ["centered", "split"],
    defaultLayout: "centered",
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 300,
    defaultProps: {},
    sampleSpecs: [],
    icon: "📝",
    color: "#6366f1",
    category: "test",
    hasImplementation: true,
    ...overrides,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// Mock ThemeRegistry
// ═══════════════════════════════════════════════════════════════════════════

interface TemplateCompatibilityConfig {
  compatibleThemes?: string[];
  excludedThemes?: string[];
}

/**
 * Mock ThemeRegistry for testing CompositionGenerator.
 * Provides minimal implementation of the ThemeRegistry interface.
 */
class MockThemeRegistry {
  private themes: Map<string, Theme> = new Map();

  registerTheme(name: string, theme: Theme): void {
    this.themes.set(name.toLowerCase(), { ...theme, name: name.toLowerCase() });
  }

  getTheme(name: string): Theme | undefined {
    return this.themes.get(name.toLowerCase());
  }

  getAllThemes(): Theme[] {
    return Array.from(this.themes.values());
  }

  getThemeNames(): string[] {
    return Array.from(this.themes.keys());
  }

  getCompatibleThemes(templateConfig: TemplateCompatibilityConfig): Theme[] {
    const allThemes = this.getAllThemes();

    // If template specifies compatible themes (whitelist), use only those
    if (templateConfig.compatibleThemes && templateConfig.compatibleThemes.length > 0) {
      const compatibleSet = new Set(
        templateConfig.compatibleThemes.map((name) => name.toLowerCase())
      );
      return allThemes.filter((theme) => compatibleSet.has(theme.name.toLowerCase()));
    }

    // If template specifies excluded themes (blacklist), exclude those
    if (templateConfig.excludedThemes && templateConfig.excludedThemes.length > 0) {
      const excludedSet = new Set(
        templateConfig.excludedThemes.map((name) => name.toLowerCase())
      );
      return allThemes.filter((theme) => !excludedSet.has(theme.name.toLowerCase()));
    }

    // If neither is specified, return all themes
    return allThemes;
  }

  hasTheme(name: string): boolean {
    return this.themes.has(name.toLowerCase());
  }

  get size(): number {
    return this.themes.size;
  }

  clear(): void {
    this.themes.clear();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Mock TemplateRegistry
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Mock TemplateRegistry for testing CompositionGenerator.
 * Provides minimal implementation of the TemplateRegistry interface.
 */
class MockTemplateRegistry {
  private templates: Map<string, TemplateConfig> = new Map();

  registerTemplate(config: TemplateConfig): void {
    this.templates.set(config.id.toLowerCase(), { ...config, id: config.id.toLowerCase() });
  }

  getTemplate(id: string): TemplateConfig | undefined {
    return this.templates.get(id.toLowerCase());
  }

  getAllTemplates(): TemplateConfig[] {
    return Array.from(this.templates.values());
  }

  hasTemplate(id: string): boolean {
    return this.templates.has(id.toLowerCase());
  }

  getOrphanedTemplates(): TemplateConfig[] {
    return this.getAllTemplates()
      .filter((template) => !template.hasImplementation)
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  get size(): number {
    return this.templates.size;
  }

  clear(): void {
    this.templates.clear();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Tests
// ═══════════════════════════════════════════════════════════════════════════

describe("CompositionGenerator", () => {
  let templateRegistry: MockTemplateRegistry;
  let themeRegistry: MockThemeRegistry;
  let generator: CompositionGenerator;

  beforeEach(() => {
    templateRegistry = new MockTemplateRegistry();
    themeRegistry = new MockThemeRegistry();
    generator = new CompositionGenerator(
      templateRegistry as unknown as import("../../registry/TemplateRegistry").TemplateRegistry,
      themeRegistry as unknown as import("../../registry/ThemeRegistry").ThemeRegistry
    );
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Constructor Tests
  // ─────────────────────────────────────────────────────────────────────────

  describe("constructor", () => {
    it("should create a CompositionGenerator instance", () => {
      expect(generator).toBeInstanceOf(CompositionGenerator);
    });

    it("should accept template and theme registries", () => {
      const newGenerator = new CompositionGenerator(
        templateRegistry as unknown as import("../../registry/TemplateRegistry").TemplateRegistry,
        themeRegistry as unknown as import("../../registry/ThemeRegistry").ThemeRegistry
      );
      expect(newGenerator).toBeInstanceOf(CompositionGenerator);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // generateCompositions - Basic Tests
  // ─────────────────────────────────────────────────────────────────────────

  describe("generateCompositions", () => {
    /**
     * Validates: Requirements 7.1
     * WHEN generateCompositions is called with empty registries,
     * THE CompositionGenerator SHALL return an empty array
     */
    it("should return empty array when no templates registered", () => {
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      const compositions = generator.generateCompositions();

      expect(compositions).toEqual([]);
    });

    it("should return empty array when no themes registered", () => {
      templateRegistry.registerTemplate(createMockTemplateConfig("testimonial"));

      const compositions = generator.generateCompositions();

      expect(compositions).toEqual([]);
    });

    it("should return empty array when both registries are empty", () => {
      const compositions = generator.generateCompositions();

      expect(compositions).toEqual([]);
    });

    /**
     * Validates: Requirements 7.1-7.3
     * WHEN generateCompositions is called with templates and themes,
     * THE CompositionGenerator SHALL generate compositions for all combinations
     */
    it("should generate compositions for single template and single theme", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", { layouts: ["centered"] })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      const compositions = generator.generateCompositions();

      expect(compositions).toHaveLength(1);
      expect(compositions[0].templateId).toBe("testimonial");
      expect(compositions[0].themeName).toBe("dark");
      expect(compositions[0].layoutName).toBe("centered");
    });

    it("should generate compositions for multiple layouts", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", { layouts: ["centered", "split"] })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      const compositions = generator.generateCompositions();

      expect(compositions).toHaveLength(2);
      expect(compositions.map((c) => c.layoutName)).toContain("centered");
      expect(compositions.map((c) => c.layoutName)).toContain("split");
    });

    it("should generate compositions for multiple themes", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", { layouts: ["centered"] })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));
      themeRegistry.registerTheme("ocean", createMockTheme("ocean", "extended"));

      const compositions = generator.generateCompositions();

      expect(compositions).toHaveLength(2);
      expect(compositions.map((c) => c.themeName)).toContain("dark");
      expect(compositions.map((c) => c.themeName)).toContain("ocean");
    });

    it("should generate compositions for multiple templates", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", { layouts: ["centered"] })
      );
      templateRegistry.registerTemplate(
        createMockTemplateConfig("case-study", { layouts: ["split"] })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      const compositions = generator.generateCompositions();

      expect(compositions).toHaveLength(2);
      expect(compositions.map((c) => c.templateId)).toContain("testimonial");
      expect(compositions.map((c) => c.templateId)).toContain("case-study");
    });

    /**
     * Validates: Requirements 7.1-7.3
     * THE CompositionGenerator SHALL generate template × theme × layout combinations
     */
    it("should generate all template × theme × layout combinations", () => {
      // 2 templates × 2 themes × 2 layouts each = 8 compositions
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", { layouts: ["centered", "split"] })
      );
      templateRegistry.registerTemplate(
        createMockTemplateConfig("case-study", { layouts: ["editorial", "minimal"] })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));
      themeRegistry.registerTheme("ocean", createMockTheme("ocean", "extended"));

      const compositions = generator.generateCompositions();

      // 2 templates × 2 themes × 2 layouts = 8
      expect(compositions).toHaveLength(8);
    });

    /**
     * Validates: Requirements 7.4-7.6
     * THE CompositionGenerator SHALL generate unique composition IDs
     */
    it("should generate unique composition IDs", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", { layouts: ["centered", "split"] })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));
      themeRegistry.registerTheme("ocean", createMockTheme("ocean", "extended"));

      const compositions = generator.generateCompositions();
      const ids = compositions.map((c) => c.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should generate IDs in PascalCase format with hyphen separators", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", { layouts: ["centered"] })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      const compositions = generator.generateCompositions();

      expect(compositions[0].id).toBe("Testimonial-Dark-Centered");
    });

    it("should handle multi-word template IDs in composition ID", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("case-study", { layouts: ["split"] })
      );
      themeRegistry.registerTheme("ocean", createMockTheme("ocean", "extended"));

      const compositions = generator.generateCompositions();

      expect(compositions[0].id).toBe("CaseStudy-Ocean-Split");
    });

    /**
     * Validates: Requirements 7.1
     * THE CompositionGenerator SHALL include correct composition properties
     */
    it("should include correct composition properties", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", {
          layouts: ["centered"],
          width: 1920,
          height: 1080,
          fps: 30,
          durationInFrames: 300,
        })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      const compositions = generator.generateCompositions();
      const comp = compositions[0];

      expect(comp.width).toBe(1920);
      expect(comp.height).toBe(1080);
      expect(comp.fps).toBe(30);
      expect(comp.durationInFrames).toBe(300);
      expect(comp.component).toBe(MockComponent);
    });

    it("should include defaultProps with theme, layout, and spec", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", {
          layouts: ["centered"],
          defaultProps: { customProp: "value" },
        })
      );
      const darkTheme = createMockTheme("dark");
      themeRegistry.registerTheme("dark", darkTheme);

      const compositions = generator.generateCompositions();
      const comp = compositions[0];

      expect(comp.defaultProps.theme).toBeDefined();
      expect(comp.defaultProps.theme.name).toBe("dark");
      expect(comp.defaultProps.layout).toBe("centered");
      expect(comp.defaultProps.spec).toEqual({ customProp: "value" });
    });

    /**
     * Validates: Requirements 6.1-6.3
     * THE CompositionGenerator SHALL skip orphaned templates by default
     */
    it("should skip orphaned templates by default", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("implemented", { hasImplementation: true, layouts: ["centered"] })
      );
      templateRegistry.registerTemplate(
        createMockTemplateConfig("orphaned", { hasImplementation: false, layouts: ["centered"] })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      const compositions = generator.generateCompositions();

      expect(compositions).toHaveLength(1);
      expect(compositions[0].templateId).toBe("implemented");
    });

    it("should include orphaned templates when skipOrphaned is false", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("implemented", { hasImplementation: true, layouts: ["centered"] })
      );
      templateRegistry.registerTemplate(
        createMockTemplateConfig("orphaned", { hasImplementation: false, layouts: ["centered"] })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      const compositions = generator.generateCompositions({ skipOrphaned: false });

      expect(compositions).toHaveLength(2);
      expect(compositions.map((c) => c.templateId)).toContain("orphaned");
    });

    /**
     * Validates: Requirements 3.2-3.4
     * THE CompositionGenerator SHALL respect template theme compatibility
     */
    it("should respect template compatibleThemes whitelist", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", {
          layouts: ["centered"],
          compatibleThemes: ["dark"],
        })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));
      themeRegistry.registerTheme("ocean", createMockTheme("ocean", "extended"));

      const compositions = generator.generateCompositions();

      expect(compositions).toHaveLength(1);
      expect(compositions[0].themeName).toBe("dark");
    });

    it("should respect template excludedThemes blacklist", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", {
          layouts: ["centered"],
          excludedThemes: ["ocean"],
        })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));
      themeRegistry.registerTheme("ocean", createMockTheme("ocean", "extended"));

      const compositions = generator.generateCompositions();

      expect(compositions).toHaveLength(1);
      expect(compositions[0].themeName).toBe("dark");
    });

    /**
     * Validates: Requirements 7.1
     * THE CompositionGenerator SHALL support template and theme filters
     */
    it("should filter by templateFilter option", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", { layouts: ["centered"] })
      );
      templateRegistry.registerTemplate(
        createMockTemplateConfig("case-study", { layouts: ["split"] })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      const compositions = generator.generateCompositions({
        templateFilter: ["testimonial"],
      });

      expect(compositions).toHaveLength(1);
      expect(compositions[0].templateId).toBe("testimonial");
    });

    it("should filter by themeFilter option", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", { layouts: ["centered"] })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));
      themeRegistry.registerTheme("ocean", createMockTheme("ocean", "extended"));

      const compositions = generator.generateCompositions({
        themeFilter: ["dark"],
      });

      expect(compositions).toHaveLength(1);
      expect(compositions[0].themeName).toBe("dark");
    });

    it("should support case-insensitive templateFilter", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", { layouts: ["centered"] })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      const compositions = generator.generateCompositions({
        templateFilter: ["TESTIMONIAL"],
      });

      expect(compositions).toHaveLength(1);
    });

    it("should support case-insensitive themeFilter", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", { layouts: ["centered"] })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      const compositions = generator.generateCompositions({
        themeFilter: ["DARK"],
      });

      expect(compositions).toHaveLength(1);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // generateForTemplate Tests
  // ─────────────────────────────────────────────────────────────────────────

  describe("generateForTemplate", () => {
    /**
     * Validates: Requirements 7.1-7.3
     * WHEN generateForTemplate is called with a non-existent template ID,
     * THE CompositionGenerator SHALL return an empty array
     */
    it("should return empty array if template not found", () => {
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      const compositions = generator.generateForTemplate("non-existent-template");

      expect(compositions).toEqual([]);
    });

    /**
     * Validates: Requirements 6.1-6.3
     * WHEN generateForTemplate is called with an orphaned template,
     * THE CompositionGenerator SHALL return an empty array
     */
    it("should return empty array if template is orphaned", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("orphaned-template", {
          hasImplementation: false,
          layouts: ["centered"],
        })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      const compositions = generator.generateForTemplate("orphaned-template");

      expect(compositions).toEqual([]);
    });

    /**
     * Validates: Requirements 7.1-7.3
     * WHEN generateForTemplate is called with a valid template,
     * THE CompositionGenerator SHALL generate compositions for all compatible themes
     */
    it("should generate compositions for all compatible themes", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", { layouts: ["centered"] })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));
      themeRegistry.registerTheme("ocean", createMockTheme("ocean", "extended"));
      themeRegistry.registerTheme("forest", createMockTheme("forest", "extended"));

      const compositions = generator.generateForTemplate("testimonial");

      expect(compositions).toHaveLength(3);
      expect(compositions.map((c) => c.themeName)).toContain("dark");
      expect(compositions.map((c) => c.themeName)).toContain("ocean");
      expect(compositions.map((c) => c.themeName)).toContain("forest");
      expect(compositions.every((c) => c.templateId === "testimonial")).toBe(true);
    });

    /**
     * Validates: Requirements 7.1-7.3
     * WHEN generateForTemplate is called with a template that has multiple layouts,
     * THE CompositionGenerator SHALL generate compositions for all layouts
     */
    it("should generate compositions for all layouts", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", {
          layouts: ["centered", "split", "minimal"],
        })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      const compositions = generator.generateForTemplate("testimonial");

      expect(compositions).toHaveLength(3);
      expect(compositions.map((c) => c.layoutName)).toContain("centered");
      expect(compositions.map((c) => c.layoutName)).toContain("split");
      expect(compositions.map((c) => c.layoutName)).toContain("minimal");
    });

    it("should generate theme × layout combinations", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", {
          layouts: ["centered", "split"],
        })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));
      themeRegistry.registerTheme("ocean", createMockTheme("ocean", "extended"));

      const compositions = generator.generateForTemplate("testimonial");

      // 2 themes × 2 layouts = 4 compositions
      expect(compositions).toHaveLength(4);
    });

    it("should respect template compatibleThemes whitelist", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", {
          layouts: ["centered"],
          compatibleThemes: ["dark"],
        })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));
      themeRegistry.registerTheme("ocean", createMockTheme("ocean", "extended"));

      const compositions = generator.generateForTemplate("testimonial");

      expect(compositions).toHaveLength(1);
      expect(compositions[0].themeName).toBe("dark");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // generateForTheme Tests
  // ─────────────────────────────────────────────────────────────────────────

  describe("generateForTheme", () => {
    /**
     * Validates: Requirements 7.1-7.3
     * WHEN generateForTheme is called with a non-existent theme name,
     * THE CompositionGenerator SHALL return an empty array
     */
    it("should return empty array if theme not found", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", { layouts: ["centered"] })
      );

      const compositions = generator.generateForTheme("non-existent-theme");

      expect(compositions).toEqual([]);
    });

    /**
     * Validates: Requirements 7.1-7.3
     * WHEN generateForTheme is called with a valid theme,
     * THE CompositionGenerator SHALL generate compositions for all compatible templates
     */
    it("should generate compositions for all compatible templates", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", { layouts: ["centered"] })
      );
      templateRegistry.registerTemplate(
        createMockTemplateConfig("case-study", { layouts: ["split"] })
      );
      templateRegistry.registerTemplate(
        createMockTemplateConfig("hero", { layouts: ["minimal"] })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      const compositions = generator.generateForTheme("dark");

      expect(compositions).toHaveLength(3);
      expect(compositions.map((c) => c.templateId)).toContain("testimonial");
      expect(compositions.map((c) => c.templateId)).toContain("case-study");
      expect(compositions.map((c) => c.templateId)).toContain("hero");
      expect(compositions.every((c) => c.themeName === "dark")).toBe(true);
    });

    /**
     * Validates: Requirements 6.1-6.3
     * WHEN generateForTheme is called,
     * THE CompositionGenerator SHALL skip orphaned templates
     */
    it("should skip orphaned templates", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("implemented", {
          hasImplementation: true,
          layouts: ["centered"],
        })
      );
      templateRegistry.registerTemplate(
        createMockTemplateConfig("orphaned", {
          hasImplementation: false,
          layouts: ["centered"],
        })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      const compositions = generator.generateForTheme("dark");

      expect(compositions).toHaveLength(1);
      expect(compositions[0].templateId).toBe("implemented");
    });

    it("should generate compositions for all layouts of compatible templates", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", {
          layouts: ["centered", "split", "minimal"],
        })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      const compositions = generator.generateForTheme("dark");

      expect(compositions).toHaveLength(3);
      expect(compositions.map((c) => c.layoutName)).toContain("centered");
      expect(compositions.map((c) => c.layoutName)).toContain("split");
      expect(compositions.map((c) => c.layoutName)).toContain("minimal");
    });

    it("should respect template excludedThemes blacklist", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", {
          layouts: ["centered"],
          excludedThemes: ["ocean"],
        })
      );
      templateRegistry.registerTemplate(
        createMockTemplateConfig("case-study", {
          layouts: ["split"],
        })
      );
      themeRegistry.registerTheme("ocean", createMockTheme("ocean", "extended"));

      const compositions = generator.generateForTheme("ocean");

      // Only case-study should be included (testimonial excludes ocean)
      expect(compositions).toHaveLength(1);
      expect(compositions[0].templateId).toBe("case-study");
    });

    it("should respect template compatibleThemes whitelist", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", {
          layouts: ["centered"],
          compatibleThemes: ["dark"], // Only compatible with dark
        })
      );
      templateRegistry.registerTemplate(
        createMockTemplateConfig("case-study", {
          layouts: ["split"],
        })
      );
      themeRegistry.registerTheme("ocean", createMockTheme("ocean", "extended"));

      const compositions = generator.generateForTheme("ocean");

      // Only case-study should be included (testimonial only allows dark)
      expect(compositions).toHaveLength(1);
      expect(compositions[0].templateId).toBe("case-study");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Default Configuration Tests
  // ─────────────────────────────────────────────────────────────────────────

  describe("default configuration", () => {
    /**
     * Validates: Requirements 8.1
     * WHEN setDefaultDuration is called,
     * THE CompositionGenerator SHALL use the new default duration for compositions
     */
    it("setDefaultDuration changes default duration", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", {
          layouts: ["centered"],
          durationInFrames: undefined, // No template-specific duration
        })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      generator.setDefaultDuration(600);
      const compositions = generator.generateCompositions();

      expect(compositions).toHaveLength(1);
      expect(compositions[0].durationInFrames).toBe(600);
    });

    /**
     * Validates: Requirements 8.2
     * WHEN setDefaultFps is called,
     * THE CompositionGenerator SHALL use the new default fps for compositions
     */
    it("setDefaultFps changes default fps", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", {
          layouts: ["centered"],
          fps: undefined, // No template-specific fps
        })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      generator.setDefaultFps(60);
      const compositions = generator.generateCompositions();

      expect(compositions).toHaveLength(1);
      expect(compositions[0].fps).toBe(60);
    });

    /**
     * Validates: Requirements 8.3
     * WHEN setDefaultDimensions is called,
     * THE CompositionGenerator SHALL use the new default width and height for compositions
     */
    it("setDefaultDimensions changes default width and height", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", {
          layouts: ["centered"],
          width: undefined, // No template-specific width
          height: undefined, // No template-specific height
        })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      generator.setDefaultDimensions(3840, 2160);
      const compositions = generator.generateCompositions();

      expect(compositions).toHaveLength(1);
      expect(compositions[0].width).toBe(3840);
      expect(compositions[0].height).toBe(2160);
    });

    /**
     * Validates: Requirements 8.1-8.3
     * WHEN a template has specific values,
     * THE CompositionGenerator SHALL use template-specific values over defaults
     */
    it("template-specific values override defaults", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", {
          layouts: ["centered"],
          width: 1280,
          height: 720,
          fps: 24,
          durationInFrames: 150,
        })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      // Set different defaults
      generator.setDefaultDimensions(3840, 2160);
      generator.setDefaultFps(60);
      generator.setDefaultDuration(600);

      const compositions = generator.generateCompositions();

      expect(compositions).toHaveLength(1);
      // Template-specific values should be used, not defaults
      expect(compositions[0].width).toBe(1280);
      expect(compositions[0].height).toBe(720);
      expect(compositions[0].fps).toBe(24);
      expect(compositions[0].durationInFrames).toBe(150);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Legacy ID Mapping Tests
  // ─────────────────────────────────────────────────────────────────────────

  describe("legacy ID mapping", () => {
    /**
     * Validates: Requirements 9.1-9.3
     * WHEN setLegacyIdMapping is called,
     * THE CompositionGenerator SHALL store the mapping
     */
    it("setLegacyIdMapping sets the mapping", () => {
      const mapping = new Map([
        ["Testimonial-Dark-Centered", "TestimonialDark"],
        ["CaseStudy-Ocean-Split", "CaseStudyOcean"],
      ]);

      generator.setLegacyIdMapping(mapping);

      expect(generator.getLegacyId("Testimonial-Dark-Centered")).toBe("TestimonialDark");
      expect(generator.getLegacyId("CaseStudy-Ocean-Split")).toBe("CaseStudyOcean");
    });

    /**
     * Validates: Requirements 9.1-9.3
     * WHEN addLegacyIdMapping is called,
     * THE CompositionGenerator SHALL add a single mapping
     */
    it("addLegacyIdMapping adds a single mapping", () => {
      generator.addLegacyIdMapping("Testimonial-Dark-Centered", "TestimonialDark");
      generator.addLegacyIdMapping("CaseStudy-Ocean-Split", "CaseStudyOcean");

      expect(generator.getLegacyId("Testimonial-Dark-Centered")).toBe("TestimonialDark");
      expect(generator.getLegacyId("CaseStudy-Ocean-Split")).toBe("CaseStudyOcean");
    });

    /**
     * Validates: Requirements 9.1-9.3
     * WHEN getLegacyId is called with a mapped ID,
     * THE CompositionGenerator SHALL return the legacy ID
     */
    it("getLegacyId returns the legacy ID", () => {
      generator.addLegacyIdMapping("Testimonial-Dark-Centered", "TestimonialDark");

      const legacyId = generator.getLegacyId("Testimonial-Dark-Centered");

      expect(legacyId).toBe("TestimonialDark");
    });

    /**
     * Validates: Requirements 9.1-9.3
     * WHEN getLegacyId is called with an unmapped ID,
     * THE CompositionGenerator SHALL return undefined
     */
    it("getLegacyId returns undefined for unmapped IDs", () => {
      generator.addLegacyIdMapping("Testimonial-Dark-Centered", "TestimonialDark");

      const legacyId = generator.getLegacyId("NonExistent-Id");

      expect(legacyId).toBeUndefined();
    });

    /**
     * Validates: Requirements 9.1-9.3
     * WHEN clearLegacyIdMappings is called,
     * THE CompositionGenerator SHALL clear all mappings
     */
    it("clearLegacyIdMappings clears all mappings", () => {
      generator.addLegacyIdMapping("Testimonial-Dark-Centered", "TestimonialDark");
      generator.addLegacyIdMapping("CaseStudy-Ocean-Split", "CaseStudyOcean");

      generator.clearLegacyIdMappings();

      expect(generator.getLegacyId("Testimonial-Dark-Centered")).toBeUndefined();
      expect(generator.getLegacyId("CaseStudy-Ocean-Split")).toBeUndefined();
    });

    /**
     * Validates: Requirements 9.1-9.3
     * WHEN getLegacyIdMappings is called,
     * THE CompositionGenerator SHALL return a copy of mappings
     */
    it("getLegacyIdMappings returns a copy of mappings", () => {
      generator.addLegacyIdMapping("Testimonial-Dark-Centered", "TestimonialDark");
      generator.addLegacyIdMapping("CaseStudy-Ocean-Split", "CaseStudyOcean");

      const mappings = generator.getLegacyIdMappings();

      expect(mappings.size).toBe(2);
      expect(mappings.get("Testimonial-Dark-Centered")).toBe("TestimonialDark");
      expect(mappings.get("CaseStudy-Ocean-Split")).toBe("CaseStudyOcean");

      // Verify it's a copy (modifying returned map doesn't affect generator)
      mappings.set("New-Id", "NewLegacy");
      expect(generator.getLegacyId("New-Id")).toBeUndefined();
    });

    /**
     * Validates: Requirements 9.1-9.3
     * WHEN compositions are generated with legacy ID mappings,
     * THE CompositionGenerator SHALL include legacyId when mapped
     */
    it("generated compositions include legacyId when mapped", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", { layouts: ["centered"] })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      // Set up legacy ID mapping before generating
      generator.addLegacyIdMapping("Testimonial-Dark-Centered", "TestimonialDark");

      const compositions = generator.generateCompositions();

      expect(compositions).toHaveLength(1);
      expect(compositions[0].id).toBe("Testimonial-Dark-Centered");
      expect(compositions[0].legacyId).toBe("TestimonialDark");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Export Methods Tests
  // ─────────────────────────────────────────────────────────────────────────

  describe("export methods", () => {
    describe("exportToRoot", () => {
      /**
       * Validates: Requirements 14.1, 14.3
       * WHEN exportToRoot is called with compositions,
       * THE CompositionGenerator SHALL return JSX string with Composition elements
       */
      it("returns JSX string with Composition elements", () => {
        templateRegistry.registerTemplate(
          createMockTemplateConfig("testimonial", { layouts: ["centered"] })
        );
        themeRegistry.registerTheme("dark", createMockTheme("dark"));

        const result = generator.exportToRoot();

        expect(result).toContain("<Composition");
        expect(result).toContain('id="Testimonial-Dark-Centered"');
        expect(result).toContain("component={TestimonialTemplate}");
        expect(result).toContain("durationInFrames={300}");
        expect(result).toContain("fps={30}");
        expect(result).toContain("width={1920}");
        expect(result).toContain("height={1080}");
      });

      /**
       * Validates: Requirements 14.1, 14.3
       * WHEN exportToRoot is called,
       * THE CompositionGenerator SHALL include import statements
       */
      it("includes import statements", () => {
        templateRegistry.registerTemplate(
          createMockTemplateConfig("testimonial", { layouts: ["centered"] })
        );
        themeRegistry.registerTheme("dark", createMockTheme("dark"));

        const result = generator.exportToRoot();

        expect(result).toContain('import { Composition } from "remotion"');
        expect(result).toContain("// Import templates");
        expect(result).toContain("// Import themes");
        expect(result).toContain("TestimonialTemplate");
        expect(result).toContain("darkTheme");
      });

      /**
       * Validates: Requirements 14.1, 14.3
       * WHEN exportToRoot is called with no compositions,
       * THE CompositionGenerator SHALL return a comment indicating no compositions
       */
      it("returns comment when no compositions", () => {
        // No templates or themes registered
        const result = generator.exportToRoot();

        expect(result).toBe("// No compositions generated");
      });
    });

    describe("exportToJson", () => {
      /**
       * Validates: Requirements 14.2
       * WHEN exportToJson is called,
       * THE CompositionGenerator SHALL return valid JSON string
       */
      it("returns valid JSON string", () => {
        templateRegistry.registerTemplate(
          createMockTemplateConfig("testimonial", { layouts: ["centered"] })
        );
        themeRegistry.registerTheme("dark", createMockTheme("dark"));

        const result = generator.exportToJson();

        expect(() => JSON.parse(result)).not.toThrow();
      });

      /**
       * Validates: Requirements 14.2
       * WHEN exportToJson is called,
       * THE CompositionGenerator SHALL include composition metadata
       */
      it("includes composition metadata", () => {
        templateRegistry.registerTemplate(
          createMockTemplateConfig("testimonial", {
            layouts: ["centered"],
            width: 1920,
            height: 1080,
            fps: 30,
            durationInFrames: 300,
          })
        );
        themeRegistry.registerTheme("dark", createMockTheme("dark"));

        const result = generator.exportToJson();
        const manifest = JSON.parse(result);

        expect(manifest.totalCompositions).toBe(1);
        expect(manifest.compositions).toHaveLength(1);
        expect(manifest.compositions[0]).toMatchObject({
          id: "Testimonial-Dark-Centered",
          templateId: "testimonial",
          themeName: "dark",
          layoutName: "centered",
          width: 1920,
          height: 1080,
          fps: 30,
          durationInFrames: 300,
        });
      });

      /**
       * Validates: Requirements 14.2
       * WHEN exportToJson is called,
       * THE CompositionGenerator SHALL include generatedAt timestamp
       */
      it("includes generatedAt timestamp", () => {
        templateRegistry.registerTemplate(
          createMockTemplateConfig("testimonial", { layouts: ["centered"] })
        );
        themeRegistry.registerTheme("dark", createMockTheme("dark"));

        const beforeTime = new Date().toISOString();
        const result = generator.exportToJson();
        const afterTime = new Date().toISOString();
        const manifest = JSON.parse(result);

        expect(manifest.generatedAt).toBeDefined();
        expect(typeof manifest.generatedAt).toBe("string");
        // Verify timestamp is within the expected range
        expect(manifest.generatedAt >= beforeTime).toBe(true);
        expect(manifest.generatedAt <= afterTime).toBe(true);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // generateWithMetadata Tests
  // ─────────────────────────────────────────────────────────────────────────

  describe("generateWithMetadata", () => {
    /**
     * Validates: Requirements 7.1-7.6, 16.1-16.3
     * WHEN generateWithMetadata is called,
     * THE CompositionGenerator SHALL return compositions array
     */
    it("returns compositions array", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", { layouts: ["centered"] })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      const result = generator.generateWithMetadata();

      expect(result.compositions).toBeDefined();
      expect(Array.isArray(result.compositions)).toBe(true);
      expect(result.compositions).toHaveLength(1);
      expect(result.compositions[0].id).toBe("Testimonial-Dark-Centered");
    });

    /**
     * Validates: Requirements 7.1-7.6, 16.1-16.3
     * WHEN generateWithMetadata is called,
     * THE CompositionGenerator SHALL return templatesProcessed count
     */
    it("returns templatesProcessed count", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", { layouts: ["centered"] })
      );
      templateRegistry.registerTemplate(
        createMockTemplateConfig("case-study", { layouts: ["split"] })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      const result = generator.generateWithMetadata();

      expect(result.templatesProcessed).toBe(2);
    });

    /**
     * Validates: Requirements 7.1-7.6, 16.1-16.3
     * WHEN generateWithMetadata is called with orphaned templates,
     * THE CompositionGenerator SHALL return templatesSkipped count
     */
    it("returns templatesSkipped count for orphaned templates", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("implemented", {
          hasImplementation: true,
          layouts: ["centered"],
        })
      );
      templateRegistry.registerTemplate(
        createMockTemplateConfig("orphaned", {
          hasImplementation: false,
          layouts: ["centered"],
        })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      const result = generator.generateWithMetadata();

      expect(result.templatesSkipped).toBe(1);
      expect(result.templatesProcessed).toBe(1);
    });

    /**
     * Validates: Requirements 7.1-7.6, 16.1-16.3
     * WHEN generateWithMetadata is called,
     * THE CompositionGenerator SHALL return themesUsed count
     */
    it("returns themesUsed count", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("testimonial", { layouts: ["centered"] })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));
      themeRegistry.registerTheme("ocean", createMockTheme("ocean", "extended"));
      themeRegistry.registerTheme("forest", createMockTheme("forest", "extended"));

      const result = generator.generateWithMetadata();

      expect(result.themesUsed).toBe(3);
    });

    /**
     * Validates: Requirements 7.1-7.6, 16.1-16.3
     * WHEN generateWithMetadata is called with orphaned templates,
     * THE CompositionGenerator SHALL return orphanedTemplates array
     */
    it("returns orphanedTemplates array", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("implemented", {
          hasImplementation: true,
          layouts: ["centered"],
        })
      );
      templateRegistry.registerTemplate(
        createMockTemplateConfig("orphaned-one", {
          hasImplementation: false,
          layouts: ["centered"],
        })
      );
      templateRegistry.registerTemplate(
        createMockTemplateConfig("orphaned-two", {
          hasImplementation: false,
          layouts: ["split"],
        })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      const result = generator.generateWithMetadata();

      expect(result.orphanedTemplates).toBeDefined();
      expect(Array.isArray(result.orphanedTemplates)).toBe(true);
      expect(result.orphanedTemplates).toHaveLength(2);
      expect(result.orphanedTemplates).toContain("orphaned-one");
      expect(result.orphanedTemplates).toContain("orphaned-two");
    });

    /**
     * Validates: Requirements 7.1-7.6, 16.1-16.3
     * WHEN generateWithMetadata is called with orphaned templates,
     * THE CompositionGenerator SHALL return warnings for skipped orphaned templates
     */
    it("returns warnings for skipped orphaned templates", () => {
      templateRegistry.registerTemplate(
        createMockTemplateConfig("implemented", {
          hasImplementation: true,
          layouts: ["centered"],
        })
      );
      templateRegistry.registerTemplate(
        createMockTemplateConfig("orphaned-template", {
          hasImplementation: false,
          layouts: ["centered"],
        })
      );
      themeRegistry.registerTheme("dark", createMockTheme("dark"));

      const result = generator.generateWithMetadata();

      expect(result.warnings).toBeDefined();
      expect(Array.isArray(result.warnings)).toBe(true);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toContain("Skipped orphaned template");
      expect(result.warnings[0]).toContain("orphaned-template");
    });
  });
});
