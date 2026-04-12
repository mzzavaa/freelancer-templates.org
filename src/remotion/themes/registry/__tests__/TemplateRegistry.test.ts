/**
 * TemplateRegistry Unit Tests
 *
 * Tests for template registration with validation:
 * - registerTemplate(config)
 * - validateTemplate(config)
 * - Validation of id (lowercase kebab-case)
 * - Validation of layouts array (at least one entry)
 * - Validation of defaultLayout (present in layouts)
 * - Validation of width and height (positive integers)
 * - Validation of fps (24, 25, 30, or 60)
 * - Validation of durationInFrames (positive integer)
 *
 * @see Requirements: 5.1-5.7
 */

import { describe, it, expect, beforeEach } from "vitest";
import { TemplateRegistry } from "../TemplateRegistry";
import { TemplateValidationError } from "../../errors";
import type { TemplateConfig, TemplateProps } from "../../types";
import type { ComponentType } from "react";

/**
 * Mock component for testing.
 */
const MockComponent: ComponentType<TemplateProps> = () => null;

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

describe("TemplateRegistry", () => {
  let registry: TemplateRegistry;

  beforeEach(() => {
    registry = new TemplateRegistry();
  });

  describe("registerTemplate", () => {
    /**
     * Validates: Requirements 4.1
     * WHEN a valid template config is registered, THE TemplateRegistry
     * SHALL store it and make it retrievable by ID
     */
    it("should store valid template and make it retrievable", () => {
      const config = createMockTemplateConfig("testimonial");
      registry.registerTemplate(config);

      expect(registry.getTemplate("testimonial")).toBeDefined();
      expect(registry.hasTemplate("testimonial")).toBe(true);
    });

    it("should normalize template ID to lowercase for valid kebab-case", () => {
      const config = createMockTemplateConfig("my-template");
      registry.registerTemplate(config);

      // Should be retrievable with any case
      expect(registry.getTemplate("my-template")).toBeDefined();
      expect(registry.getTemplate("MY-TEMPLATE")).toBeDefined();
      expect(registry.getTemplate("My-Template")).toBeDefined();
    });

    /**
     * Validates: Requirements 5.1-5.7
     * WHEN validation fails, THE TemplateRegistry SHALL throw TemplateValidationError
     */
    it("should throw TemplateValidationError for invalid config", () => {
      const invalidConfig = {
        id: "INVALID_ID", // Not kebab-case
        name: "Test",
        component: MockComponent,
        layouts: [],
        defaultLayout: "centered",
        width: 1920,
        height: 1080,
        fps: 30,
        durationInFrames: 300,
      } as unknown as TemplateConfig;

      expect(() => registry.registerTemplate(invalidConfig)).toThrow(
        TemplateValidationError
      );
    });

    it("should include template ID in error", () => {
      const invalidConfig = createMockTemplateConfig("my-template", {
        layouts: [],
      });

      try {
        registry.registerTemplate(invalidConfig);
        expect.fail("Should have thrown TemplateValidationError");
      } catch (error) {
        expect(error).toBeInstanceOf(TemplateValidationError);
        const validationError = error as TemplateValidationError;
        expect(validationError.templateId).toBe("my-template");
      }
    });
  });

  describe("validateTemplate - id validation", () => {
    /**
     * Validates: Requirements 5.1
     * THE TemplateRegistry SHALL validate that template id is lowercase kebab-case
     */
    it("should accept valid kebab-case id", () => {
      const config = createMockTemplateConfig("my-template");
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should accept single-word lowercase id", () => {
      const config = createMockTemplateConfig("testimonial");
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(true);
    });

    it("should accept multi-word kebab-case id", () => {
      const config = createMockTemplateConfig("game-day-intro");
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(true);
    });

    it("should accept id with numbers", () => {
      const config = createMockTemplateConfig("template-v2");
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(true);
    });

    it("should reject uppercase letters in id", () => {
      const config = createMockTemplateConfig("MyTemplate");
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "id",
          code: "INVALID_ID_FORMAT",
        })
      );
    });

    it("should reject id starting with hyphen", () => {
      const config = createMockTemplateConfig("-my-template");
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "id",
          code: "INVALID_ID_FORMAT",
        })
      );
    });

    it("should reject id ending with hyphen", () => {
      const config = createMockTemplateConfig("my-template-");
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "id",
          code: "INVALID_ID_FORMAT",
        })
      );
    });

    it("should reject id with consecutive hyphens", () => {
      const config = createMockTemplateConfig("my--template");
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "id",
          code: "INVALID_ID_FORMAT",
        })
      );
    });

    it("should reject id with underscores", () => {
      const config = createMockTemplateConfig("my_template");
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "id",
          code: "INVALID_ID_FORMAT",
        })
      );
    });

    it("should reject id with spaces", () => {
      const config = createMockTemplateConfig("my template");
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "id",
          code: "INVALID_ID_FORMAT",
        })
      );
    });

    it("should reject empty id", () => {
      const config = createMockTemplateConfig("");
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "id",
          code: "MISSING_REQUIRED_FIELD",
        })
      );
    });

    it("should reject id starting with number", () => {
      const config = createMockTemplateConfig("2-template");
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "id",
          code: "INVALID_ID_FORMAT",
        })
      );
    });
  });

  describe("validateTemplate - layouts validation", () => {
    /**
     * Validates: Requirements 5.2
     * THE TemplateRegistry SHALL validate that layouts array has at least one entry
     */
    it("should accept layouts array with one entry", () => {
      const config = createMockTemplateConfig("test", {
        layouts: ["centered"],
        defaultLayout: "centered",
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(true);
    });

    it("should accept layouts array with multiple entries", () => {
      const config = createMockTemplateConfig("test", {
        layouts: ["centered", "split", "editorial"],
        defaultLayout: "centered",
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(true);
    });

    it("should reject empty layouts array", () => {
      const config = createMockTemplateConfig("test", {
        layouts: [],
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "layouts",
          code: "EMPTY_LAYOUTS",
        })
      );
    });

    it("should reject missing layouts", () => {
      const config = createMockTemplateConfig("test");
      // @ts-expect-error Testing missing field
      delete config.layouts;
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "layouts",
          code: "MISSING_REQUIRED_FIELD",
        })
      );
    });

    it("should reject non-array layouts", () => {
      const config = createMockTemplateConfig("test", {
        layouts: "centered" as unknown as string[],
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "layouts",
          code: "INVALID_TYPE",
        })
      );
    });
  });

  describe("validateTemplate - defaultLayout validation", () => {
    /**
     * Validates: Requirements 5.3
     * THE TemplateRegistry SHALL validate that defaultLayout is present in the layouts array
     */
    it("should accept defaultLayout present in layouts", () => {
      const config = createMockTemplateConfig("test", {
        layouts: ["centered", "split"],
        defaultLayout: "split",
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(true);
    });

    it("should reject defaultLayout not in layouts", () => {
      const config = createMockTemplateConfig("test", {
        layouts: ["centered", "split"],
        defaultLayout: "editorial",
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "defaultLayout",
          code: "INVALID_DEFAULT_LAYOUT",
        })
      );
    });

    it("should reject missing defaultLayout", () => {
      const config = createMockTemplateConfig("test");
      // @ts-expect-error Testing missing field
      delete config.defaultLayout;
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "defaultLayout",
          code: "MISSING_REQUIRED_FIELD",
        })
      );
    });

    it("should reject empty defaultLayout", () => {
      const config = createMockTemplateConfig("test", {
        defaultLayout: "",
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "defaultLayout",
          code: "MISSING_REQUIRED_FIELD",
        })
      );
    });
  });

  describe("validateTemplate - width and height validation", () => {
    /**
     * Validates: Requirements 5.4
     * THE TemplateRegistry SHALL validate that width and height are positive integers
     */
    it("should accept positive integer width and height", () => {
      const config = createMockTemplateConfig("test", {
        width: 1920,
        height: 1080,
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(true);
    });

    it("should accept small positive dimensions", () => {
      const config = createMockTemplateConfig("test", {
        width: 1,
        height: 1,
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(true);
    });

    it("should reject zero width", () => {
      const config = createMockTemplateConfig("test", {
        width: 0,
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "width",
          code: "INVALID_WIDTH",
        })
      );
    });

    it("should reject negative width", () => {
      const config = createMockTemplateConfig("test", {
        width: -100,
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "width",
          code: "INVALID_WIDTH",
        })
      );
    });

    it("should reject non-integer width", () => {
      const config = createMockTemplateConfig("test", {
        width: 1920.5,
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "width",
          code: "INVALID_WIDTH",
        })
      );
    });

    it("should reject zero height", () => {
      const config = createMockTemplateConfig("test", {
        height: 0,
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "height",
          code: "INVALID_HEIGHT",
        })
      );
    });

    it("should reject negative height", () => {
      const config = createMockTemplateConfig("test", {
        height: -100,
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "height",
          code: "INVALID_HEIGHT",
        })
      );
    });

    it("should reject non-integer height", () => {
      const config = createMockTemplateConfig("test", {
        height: 1080.5,
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "height",
          code: "INVALID_HEIGHT",
        })
      );
    });

    it("should reject missing width", () => {
      const config = createMockTemplateConfig("test");
      // @ts-expect-error Testing missing field
      delete config.width;
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "width",
          code: "MISSING_REQUIRED_FIELD",
        })
      );
    });

    it("should reject missing height", () => {
      const config = createMockTemplateConfig("test");
      // @ts-expect-error Testing missing field
      delete config.height;
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "height",
          code: "MISSING_REQUIRED_FIELD",
        })
      );
    });
  });

  describe("validateTemplate - fps validation", () => {
    /**
     * Validates: Requirements 5.5
     * THE TemplateRegistry SHALL validate that fps is one of 24, 25, 30, or 60
     */
    it("should accept fps of 24", () => {
      const config = createMockTemplateConfig("test", { fps: 24 });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(true);
    });

    it("should accept fps of 25", () => {
      const config = createMockTemplateConfig("test", { fps: 25 });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(true);
    });

    it("should accept fps of 30", () => {
      const config = createMockTemplateConfig("test", { fps: 30 });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(true);
    });

    it("should accept fps of 60", () => {
      const config = createMockTemplateConfig("test", { fps: 60 });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(true);
    });

    it("should reject fps of 29", () => {
      const config = createMockTemplateConfig("test", {
        fps: 29 as 24 | 25 | 30 | 60,
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "fps",
          code: "INVALID_FPS",
        })
      );
    });

    it("should reject fps of 0", () => {
      const config = createMockTemplateConfig("test", {
        fps: 0 as 24 | 25 | 30 | 60,
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "fps",
          code: "INVALID_FPS",
        })
      );
    });

    it("should reject negative fps", () => {
      const config = createMockTemplateConfig("test", {
        fps: -30 as 24 | 25 | 30 | 60,
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "fps",
          code: "INVALID_FPS",
        })
      );
    });

    it("should reject fps of 120", () => {
      const config = createMockTemplateConfig("test", {
        fps: 120 as 24 | 25 | 30 | 60,
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "fps",
          code: "INVALID_FPS",
        })
      );
    });

    it("should reject missing fps", () => {
      const config = createMockTemplateConfig("test");
      // @ts-expect-error Testing missing field
      delete config.fps;
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "fps",
          code: "MISSING_REQUIRED_FIELD",
        })
      );
    });
  });

  describe("validateTemplate - durationInFrames validation", () => {
    /**
     * Validates: Requirements 5.6
     * THE TemplateRegistry SHALL validate that durationInFrames is a positive integer
     */
    it("should accept positive integer durationInFrames", () => {
      const config = createMockTemplateConfig("test", {
        durationInFrames: 300,
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(true);
    });

    it("should accept durationInFrames of 1", () => {
      const config = createMockTemplateConfig("test", {
        durationInFrames: 1,
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(true);
    });

    it("should accept large durationInFrames", () => {
      const config = createMockTemplateConfig("test", {
        durationInFrames: 10000,
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(true);
    });

    it("should reject zero durationInFrames", () => {
      const config = createMockTemplateConfig("test", {
        durationInFrames: 0,
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "durationInFrames",
          code: "INVALID_DURATION",
        })
      );
    });

    it("should reject negative durationInFrames", () => {
      const config = createMockTemplateConfig("test", {
        durationInFrames: -100,
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "durationInFrames",
          code: "INVALID_DURATION",
        })
      );
    });

    it("should reject non-integer durationInFrames", () => {
      const config = createMockTemplateConfig("test", {
        durationInFrames: 300.5,
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "durationInFrames",
          code: "INVALID_DURATION",
        })
      );
    });

    it("should reject missing durationInFrames", () => {
      const config = createMockTemplateConfig("test");
      // @ts-expect-error Testing missing field
      delete config.durationInFrames;
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "durationInFrames",
          code: "MISSING_REQUIRED_FIELD",
        })
      );
    });
  });

  describe("validateTemplate - ValidationResult", () => {
    /**
     * Validates: Requirements 5.7
     * WHEN validation fails, THE TemplateRegistry SHALL return a ValidationResult with detailed errors
     */
    it("should return valid=true and empty errors for valid config", () => {
      const config = createMockTemplateConfig("test");
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("should return valid=false and errors for invalid config", () => {
      const config = createMockTemplateConfig("INVALID", {
        layouts: [],
        fps: 45 as 24 | 25 | 30 | 60,
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should include all validation errors", () => {
      const config = createMockTemplateConfig("INVALID", {
        layouts: [],
        width: -100,
        height: 0,
        fps: 45 as 24 | 25 | 30 | 60,
        durationInFrames: -10,
      });
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      // Should have errors for: id, layouts, width, height, fps, durationInFrames
      expect(result.errors.length).toBeGreaterThanOrEqual(5);
    });

    it("should include field name in each error", () => {
      const config = createMockTemplateConfig("INVALID");
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      result.errors.forEach((error) => {
        expect(error.field).toBeDefined();
        expect(typeof error.field).toBe("string");
      });
    });

    it("should include message in each error", () => {
      const config = createMockTemplateConfig("INVALID");
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      result.errors.forEach((error) => {
        expect(error.message).toBeDefined();
        expect(typeof error.message).toBe("string");
        expect(error.message.length).toBeGreaterThan(0);
      });
    });

    it("should include error code in each error", () => {
      const config = createMockTemplateConfig("INVALID");
      const result = registry.validateTemplate(config);

      expect(result.valid).toBe(false);
      result.errors.forEach((error) => {
        expect(error.code).toBeDefined();
      });
    });

    it("should include invalid value when applicable", () => {
      const config = createMockTemplateConfig("INVALID_ID");
      const result = registry.validateTemplate(config);

      const idError = result.errors.find((e) => e.field === "id");
      expect(idError).toBeDefined();
      expect(idError?.value).toBe("INVALID_ID");
    });
  });

  describe("TemplateValidationError", () => {
    it("should be thrown with detailed errors", () => {
      const config = createMockTemplateConfig("INVALID", {
        layouts: [],
      });

      try {
        registry.registerTemplate(config);
        expect.fail("Should have thrown TemplateValidationError");
      } catch (error) {
        expect(error).toBeInstanceOf(TemplateValidationError);
        const validationError = error as TemplateValidationError;
        expect(validationError.errors.length).toBeGreaterThan(0);
      }
    });

    it("should include template ID in error", () => {
      const config = createMockTemplateConfig("my-template", {
        layouts: [],
      });

      try {
        registry.registerTemplate(config);
        expect.fail("Should have thrown TemplateValidationError");
      } catch (error) {
        expect(error).toBeInstanceOf(TemplateValidationError);
        const validationError = error as TemplateValidationError;
        expect(validationError.templateId).toBe("my-template");
      }
    });

    it("should provide getDetailedMessage()", () => {
      const config = createMockTemplateConfig("INVALID", {
        layouts: [],
      });

      try {
        registry.registerTemplate(config);
        expect.fail("Should have thrown TemplateValidationError");
      } catch (error) {
        expect(error).toBeInstanceOf(TemplateValidationError);
        const validationError = error as TemplateValidationError;
        const detailedMessage = validationError.getDetailedMessage();
        expect(detailedMessage).toContain("id");
        expect(detailedMessage).toContain("layouts");
      }
    });
  });

  describe("getTemplatesByCategory", () => {
    /**
     * Validates: Requirements 4.5
     * THE TemplateRegistry SHALL provide a method to filter templates by category
     */
    it("should return templates matching the specified category", () => {
      const socialTemplate = createMockTemplateConfig("social-post", {
        category: "social",
      });
      const marketingTemplate = createMockTemplateConfig("marketing-banner", {
        category: "marketing",
      });
      const anotherSocialTemplate = createMockTemplateConfig("social-story", {
        category: "social",
      });

      registry.registerTemplate(socialTemplate);
      registry.registerTemplate(marketingTemplate);
      registry.registerTemplate(anotherSocialTemplate);

      const socialTemplates = registry.getTemplatesByCategory("social");

      expect(socialTemplates).toHaveLength(2);
      expect(socialTemplates.map((t) => t.id)).toContain("social-post");
      expect(socialTemplates.map((t) => t.id)).toContain("social-story");
    });

    it("should return empty array when no templates match category", () => {
      const template = createMockTemplateConfig("test-template", {
        category: "marketing",
      });
      registry.registerTemplate(template);

      const result = registry.getTemplatesByCategory("social");

      expect(result).toEqual([]);
    });

    it("should perform case-insensitive category matching", () => {
      const template = createMockTemplateConfig("test-template", {
        category: "Social",
      });
      registry.registerTemplate(template);

      const lowerResult = registry.getTemplatesByCategory("social");
      const upperResult = registry.getTemplatesByCategory("SOCIAL");
      const mixedResult = registry.getTemplatesByCategory("SoCiAl");

      expect(lowerResult).toHaveLength(1);
      expect(upperResult).toHaveLength(1);
      expect(mixedResult).toHaveLength(1);
    });

    it("should return empty array when registry is empty", () => {
      const result = registry.getTemplatesByCategory("any");

      expect(result).toEqual([]);
    });

    it("should return a new array (not modify internal state)", () => {
      const template = createMockTemplateConfig("test-template", {
        category: "social",
      });
      registry.registerTemplate(template);

      const result1 = registry.getTemplatesByCategory("social");
      const result2 = registry.getTemplatesByCategory("social");

      expect(result1).not.toBe(result2);
      expect(result1).toEqual(result2);
    });
  });

  describe("getOrphanedTemplates", () => {
    /**
     * Validates: Requirements 6.1-6.3
     * THE TemplateRegistry SHALL track the hasImplementation status for each template
     * WHEN getOrphanedTemplates is called, THE TemplateRegistry SHALL return all templates where hasImplementation is false
     * THE TemplateRegistry SHALL return orphaned templates sorted by template ID
     */
    it("should return templates where hasImplementation is false", () => {
      const implementedTemplate = createMockTemplateConfig("implemented", {
        hasImplementation: true,
      });
      const orphanedTemplate = createMockTemplateConfig("orphaned", {
        hasImplementation: false,
      });

      registry.registerTemplate(implementedTemplate);
      registry.registerTemplate(orphanedTemplate);

      const orphans = registry.getOrphanedTemplates();

      expect(orphans).toHaveLength(1);
      expect(orphans[0].id).toBe("orphaned");
      expect(orphans[0].hasImplementation).toBe(false);
    });

    it("should return empty array when all templates have implementations", () => {
      const template1 = createMockTemplateConfig("template-a", {
        hasImplementation: true,
      });
      const template2 = createMockTemplateConfig("template-b", {
        hasImplementation: true,
      });

      registry.registerTemplate(template1);
      registry.registerTemplate(template2);

      const orphans = registry.getOrphanedTemplates();

      expect(orphans).toEqual([]);
    });

    it("should return all orphaned templates when none have implementations", () => {
      const orphan1 = createMockTemplateConfig("orphan-a", {
        hasImplementation: false,
      });
      const orphan2 = createMockTemplateConfig("orphan-b", {
        hasImplementation: false,
      });

      registry.registerTemplate(orphan1);
      registry.registerTemplate(orphan2);

      const orphans = registry.getOrphanedTemplates();

      expect(orphans).toHaveLength(2);
    });

    it("should return orphaned templates sorted by template ID", () => {
      const orphanC = createMockTemplateConfig("orphan-charlie", {
        hasImplementation: false,
      });
      const orphanA = createMockTemplateConfig("orphan-alpha", {
        hasImplementation: false,
      });
      const orphanB = createMockTemplateConfig("orphan-bravo", {
        hasImplementation: false,
      });

      // Register in non-alphabetical order
      registry.registerTemplate(orphanC);
      registry.registerTemplate(orphanA);
      registry.registerTemplate(orphanB);

      const orphans = registry.getOrphanedTemplates();

      expect(orphans).toHaveLength(3);
      expect(orphans[0].id).toBe("orphan-alpha");
      expect(orphans[1].id).toBe("orphan-bravo");
      expect(orphans[2].id).toBe("orphan-charlie");
    });

    it("should return empty array when registry is empty", () => {
      const orphans = registry.getOrphanedTemplates();

      expect(orphans).toEqual([]);
    });

    it("should track hasImplementation status correctly", () => {
      const template = createMockTemplateConfig("test-template", {
        hasImplementation: false,
      });

      registry.registerTemplate(template);

      const retrieved = registry.getTemplate("test-template");
      expect(retrieved?.hasImplementation).toBe(false);

      const orphans = registry.getOrphanedTemplates();
      expect(orphans).toHaveLength(1);
    });

    it("should return a new array (not modify internal state)", () => {
      const orphan = createMockTemplateConfig("orphan", {
        hasImplementation: false,
      });
      registry.registerTemplate(orphan);

      const result1 = registry.getOrphanedTemplates();
      const result2 = registry.getOrphanedTemplates();

      expect(result1).not.toBe(result2);
      expect(result1).toEqual(result2);
    });

    it("should correctly filter mixed implementation statuses", () => {
      const templates = [
        createMockTemplateConfig("alpha-implemented", { hasImplementation: true }),
        createMockTemplateConfig("bravo-orphan", { hasImplementation: false }),
        createMockTemplateConfig("charlie-implemented", { hasImplementation: true }),
        createMockTemplateConfig("delta-orphan", { hasImplementation: false }),
        createMockTemplateConfig("echo-implemented", { hasImplementation: true }),
      ];

      templates.forEach((t) => registry.registerTemplate(t));

      const orphans = registry.getOrphanedTemplates();

      expect(orphans).toHaveLength(2);
      expect(orphans.map((t) => t.id)).toEqual(["bravo-orphan", "delta-orphan"]);
    });
  });
});
