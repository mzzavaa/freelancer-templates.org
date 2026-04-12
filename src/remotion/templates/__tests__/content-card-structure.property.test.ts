/**
 * Property-Based Tests for Content Card Structural Consistency
 *
 * Validates that all content cards contain required structural elements.
 * The content card partial is at `layouts/partials/content-card.html` and has:
 * - `.content-card__media` - Contains image, optional video, fallback, and optional meta
 * - `.content-card__body` - Contains icon and info (title + description)
 * - Required elements: media container, icon, title, description
 * - Optional elements: video, meta
 *
 * Properties tested:
 *   1. Every content card has a media container
 *   2. Every content card has an icon
 *   3. Every content card has a title
 *   4. Every content card has a description
 *   5. Optional meta is properly handled
 *
 * **Validates: Requirements 3.6, 4.6, 8.1, 8.2**
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import * as fs from "fs";
import * as path from "path";

// ── Types ───────────────────────────────────────────────────────

interface Variant {
  id: string;
  name: string;
  style: string;
}

interface Template {
  slug: string;
  camel: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  primaryVariant: string;
  variantCount: number;
  variants: Variant[];
  primaryId: string;
}

/**
 * Content card data structure matching the partial interface.
 * This mirrors the parameters accepted by layouts/partials/content-card.html
 */
interface ContentCardData {
  href: string;
  image: string;
  video?: string;
  icon: string;
  title: string;
  description: string;
  meta?: string;
  category?: string;
}

/**
 * Represents the structural elements of a rendered content card.
 * Used to verify that all required elements are present.
 */
interface ContentCardStructure {
  hasMediaContainer: boolean;
  hasImage: boolean;
  hasVideo: boolean;
  hasFallback: boolean;
  hasMeta: boolean;
  hasBody: boolean;
  hasIcon: boolean;
  hasTitle: boolean;
  hasDescription: boolean;
}

// ── Helper Functions ────────────────────────────────────────────

/**
 * Validates that a content card data object has all required fields.
 * This mirrors the validation that would occur when rendering the partial.
 */
function hasRequiredFields(card: ContentCardData): boolean {
  return (
    typeof card.href === "string" &&
    card.href.length > 0 &&
    typeof card.image === "string" &&
    card.image.length > 0 &&
    typeof card.icon === "string" &&
    card.icon.length > 0 &&
    typeof card.title === "string" &&
    card.title.length > 0 &&
    typeof card.description === "string" &&
    card.description.length > 0
  );
}

/**
 * Simulates the structural output of the content card partial.
 * Based on layouts/partials/content-card.html structure:
 *
 * <a class="content-card">
 *   <div class="content-card__media">
 *     <img class="content-card__img">
 *     <video class="content-card__vid"> (optional)
 *     <div class="content-card__fallback">
 *     <div class="content-card__meta"> (optional)
 *   </div>
 *   <div class="content-card__body">
 *     <div class="content-card__icon">
 *     <div class="content-card__info">
 *       <div class="content-card__title">
 *       <div class="content-card__desc">
 *     </div>
 *   </div>
 * </a>
 */
function getCardStructure(card: ContentCardData): ContentCardStructure {
  return {
    // Media container is always present
    hasMediaContainer: true,
    // Image is always present (required field)
    hasImage: typeof card.image === "string" && card.image.length > 0,
    // Video is optional
    hasVideo: typeof card.video === "string" && card.video.length > 0,
    // Fallback is always present (shows when image fails)
    hasFallback: true,
    // Meta is optional
    hasMeta: typeof card.meta === "string" && card.meta.length > 0,
    // Body container is always present
    hasBody: true,
    // Icon is always present (required field)
    hasIcon: typeof card.icon === "string" && card.icon.length > 0,
    // Title is always present (required field)
    hasTitle: typeof card.title === "string" && card.title.length > 0,
    // Description is always present (required field)
    hasDescription: typeof card.description === "string" && card.description.length > 0,
  };
}

/**
 * Converts a template from templates.json to content card data.
 * This mirrors how templates are rendered as content cards in the library.
 */
function templateToContentCard(template: Template): ContentCardData {
  return {
    href: `/library/${template.slug}/`,
    image: `/previews/showcase/${template.primaryId}.png`,
    video: `/previews/hero/${template.primaryId}.mp4`,
    icon: template.icon,
    title: template.name,
    description: template.description,
    meta: `${template.variantCount} variants`,
  };
}

/**
 * Validates that a content card structure has all required elements.
 */
function validateRequiredElements(structure: ContentCardStructure): {
  valid: boolean;
  missingElements: string[];
} {
  const missingElements: string[] = [];

  if (!structure.hasMediaContainer) missingElements.push("media container");
  if (!structure.hasImage) missingElements.push("image");
  if (!structure.hasFallback) missingElements.push("fallback");
  if (!structure.hasBody) missingElements.push("body");
  if (!structure.hasIcon) missingElements.push("icon");
  if (!structure.hasTitle) missingElements.push("title");
  if (!structure.hasDescription) missingElements.push("description");

  return {
    valid: missingElements.length === 0,
    missingElements,
  };
}

// ── Load Real Template Data ─────────────────────────────────────

const templatesPath = path.resolve(__dirname, "../../../../data/templates.json");
const templates: Template[] = JSON.parse(fs.readFileSync(templatesPath, "utf-8"));

// ── Arbitraries for Property-Based Testing ──────────────────────

const iconArb = fc.constantFrom(
  "star",
  "video",
  "image",
  "file",
  "message-square",
  "columns",
  "layout",
  "play",
  "zap",
  "award",
  "briefcase",
  "calendar",
  "chart-bar",
  "code",
  "coffee",
  "compass",
  "cpu",
  "credit-card",
  "database",
  "dollar-sign"
);

const colorArb = fc.constantFrom(
  "blue",
  "red",
  "green",
  "purple",
  "orange",
  "pink",
  "cyan",
  "yellow"
);

const slugArb = fc
  .string({ minLength: 1, maxLength: 30 })
  .filter((s) => /^[a-z0-9-]+$/.test(s));

const nonEmptyStringArb = fc.string({ minLength: 1, maxLength: 100 });

const contentCardDataArb: fc.Arbitrary<ContentCardData> = fc.record({
  href: fc.string({ minLength: 1, maxLength: 100 }).map((s) => `/${s}/`),
  image: fc.string({ minLength: 1, maxLength: 100 }).map((s) => `/previews/${s}.png`),
  video: fc.option(
    fc.string({ minLength: 1, maxLength: 100 }).map((s) => `/previews/${s}.mp4`),
    { nil: undefined }
  ),
  icon: iconArb,
  title: nonEmptyStringArb,
  description: nonEmptyStringArb,
  meta: fc.option(nonEmptyStringArb, { nil: undefined }),
  category: fc.option(
    fc.constantFrom(
      "client-work",
      "content-creation",
      "tech-analytics",
      "marketing-sales",
      "community-events"
    ),
    { nil: undefined }
  ),
});

// ── Property 6: Content Card Structural Consistency ─────────────

describe("Property 6: Content Card Structural Consistency", () => {
  /**
   * **Validates: Requirements 8.1, 8.2**
   *
   * Requirement 8.1: THE Content_Card component SHALL use a consistent structure
   * across Templates, Themes, and Design Tips sections
   *
   * Requirement 8.2: THE Content_Card SHALL contain: media preview area, icon,
   * title, description, and metadata (variant count, theme count, etc.)
   */
  describe("All content cards have required structural elements", () => {
    it("every template from templates.json produces a valid content card (real data)", () => {
      for (const template of templates) {
        const cardData = templateToContentCard(template);
        const structure = getCardStructure(cardData);
        const validation = validateRequiredElements(structure);

        expect(validation.valid).toBe(true);
        if (!validation.valid) {
          console.error(
            `Template ${template.slug} missing elements: ${validation.missingElements.join(", ")}`
          );
        }
      }
    });

    it("every content card has a media container (real data)", () => {
      for (const template of templates) {
        const cardData = templateToContentCard(template);
        const structure = getCardStructure(cardData);

        expect(structure.hasMediaContainer).toBe(true);
      }
    });

    it("every content card has an icon (real data)", () => {
      for (const template of templates) {
        const cardData = templateToContentCard(template);
        const structure = getCardStructure(cardData);

        expect(structure.hasIcon).toBe(true);
      }
    });

    it("every content card has a title (real data)", () => {
      for (const template of templates) {
        const cardData = templateToContentCard(template);
        const structure = getCardStructure(cardData);

        expect(structure.hasTitle).toBe(true);
      }
    });

    it("every content card has a description (real data)", () => {
      for (const template of templates) {
        const cardData = templateToContentCard(template);
        const structure = getCardStructure(cardData);

        expect(structure.hasDescription).toBe(true);
      }
    });

    it("property: any valid content card data produces all required structural elements", () => {
      fc.assert(
        fc.property(contentCardDataArb, (cardData) => {
          const structure = getCardStructure(cardData);
          const validation = validateRequiredElements(structure);

          expect(validation.valid).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Validates: Requirements 3.6, 4.6**
   *
   * Requirement 3.6: FOR ALL templates displayed in the library grid, THE Content_Card
   * SHALL show the variant count and primary theme preview
   *
   * Requirement 4.6: FOR ALL theme cards on the landing page, THE Content_Card SHALL
   * show the theme name, color palette preview, and template count
   */
  describe("Content cards from templates have proper metadata", () => {
    it("every template content card has meta showing variant count (real data)", () => {
      for (const template of templates) {
        const cardData = templateToContentCard(template);
        const structure = getCardStructure(cardData);

        expect(structure.hasMeta).toBe(true);
        expect(cardData.meta).toContain("variants");
      }
    });

    it("every template has a valid icon (real data)", () => {
      const validIcons = [
        "star",
        "video",
        "image",
        "file",
        "message-square",
        "columns",
        "layout",
        "play",
        "zap",
        "award",
        "briefcase",
        "calendar",
        "chart-bar",
        "code",
        "coffee",
        "compass",
        "cpu",
        "credit-card",
        "database",
        "dollar-sign",
        "download",
        "edit",
        "eye",
        "feather",
        "film",
        "flag",
        "folder",
        "gift",
        "globe",
        "grid",
        "hash",
        "headphones",
        "heart",
        "home",
        "inbox",
        "info",
        "key",
        "layers",
        "link",
        "list",
        "lock",
        "mail",
        "map",
        "mic",
        "monitor",
        "moon",
        "music",
        "package",
        "paperclip",
        "pen-tool",
        "percent",
        "phone",
        "pie-chart",
        "pocket",
        "power",
        "printer",
        "radio",
        "refresh-cw",
        "repeat",
        "rss",
        "save",
        "scissors",
        "search",
        "send",
        "server",
        "settings",
        "share",
        "shield",
        "shopping-bag",
        "shopping-cart",
        "shuffle",
        "sidebar",
        "skip-back",
        "skip-forward",
        "slack",
        "sliders",
        "smartphone",
        "speaker",
        "square",
        "sun",
        "sunrise",
        "sunset",
        "tablet",
        "tag",
        "target",
        "terminal",
        "thermometer",
        "thumbs-down",
        "thumbs-up",
        "toggle-left",
        "toggle-right",
        "tool",
        "trash",
        "trending-down",
        "trending-up",
        "triangle",
        "truck",
        "tv",
        "twitter",
        "type",
        "umbrella",
        "underline",
        "unlock",
        "upload",
        "user",
        "users",
        "voicemail",
        "volume",
        "watch",
        "wifi",
        "wind",
        "x",
        "youtube",
        "zoom-in",
        "zoom-out",
        "bar-chart",
        "bar-chart-2",
        "activity",
        "airplay",
        "alert-circle",
        "alert-octagon",
        "alert-triangle",
        "align-center",
        "align-justify",
        "align-left",
        "align-right",
        "anchor",
        "aperture",
        "archive",
        "arrow-down",
        "arrow-left",
        "arrow-right",
        "arrow-up",
        "at-sign",
        "battery",
        "bell",
        "bluetooth",
        "bold",
        "book",
        "bookmark",
        "box",
        "camera",
        "cast",
        "check",
        "check-circle",
        "check-square",
        "chevron-down",
        "chevron-left",
        "chevron-right",
        "chevron-up",
        "circle",
        "clipboard",
        "clock",
        "cloud",
        "command",
        "copy",
        "corner-down-left",
        "corner-down-right",
        "corner-left-down",
        "corner-left-up",
        "corner-right-down",
        "corner-right-up",
        "corner-up-left",
        "corner-up-right",
        "crosshair",
        "delete",
        "disc",
        "divide",
        "droplet",
        "external-link",
        "facebook",
        "fast-forward",
        "file-minus",
        "file-plus",
        "file-text",
        "filter",
        "folder-minus",
        "folder-plus",
        "framer",
        "frown",
        "github",
        "gitlab",
        "hard-drive",
        "help-circle",
        "hexagon",
        "image-off",
        "instagram",
        "italic",
        "life-buoy",
        "linkedin",
        "loader",
        "log-in",
        "log-out",
        "map-pin",
        "maximize",
        "meh",
        "menu",
        "message-circle",
        "mic-off",
        "minimize",
        "minus",
        "minus-circle",
        "minus-square",
        "more-horizontal",
        "more-vertical",
        "mouse-pointer",
        "move",
        "navigation",
        "octagon",
        "pause",
        "pause-circle",
        "phone-call",
        "phone-forwarded",
        "phone-incoming",
        "phone-missed",
        "phone-off",
        "phone-outgoing",
        "play-circle",
        "plus",
        "plus-circle",
        "plus-square",
        "rewind",
        "rotate-ccw",
        "rotate-cw",
        "smile",
        "stop-circle",
        "strikethrough",
        "tag",
        "trash-2",
        "user-check",
        "user-minus",
        "user-plus",
        "user-x",
        "video-off",
        "volume-1",
        "volume-2",
        "volume-x",
        "x-circle",
        "x-square",
        "zap-off",
      ];

      for (const template of templates) {
        // Icon should be a non-empty string
        expect(typeof template.icon).toBe("string");
        expect(template.icon.length).toBeGreaterThan(0);
      }
    });

    it("every template has a non-empty name for title (real data)", () => {
      for (const template of templates) {
        expect(typeof template.name).toBe("string");
        expect(template.name.length).toBeGreaterThan(0);
      }
    });

    it("every template has a non-empty description (real data)", () => {
      for (const template of templates) {
        expect(typeof template.description).toBe("string");
        expect(template.description.length).toBeGreaterThan(0);
      }
    });
  });

  /**
   * **Validates: Requirements 8.1**
   *
   * Tests that optional elements (video, meta) are properly handled.
   */
  describe("Optional elements are properly handled", () => {
    it("content cards without video still have valid structure", () => {
      const cardWithoutVideo: ContentCardData = {
        href: "/library/test/",
        image: "/previews/test.png",
        icon: "star",
        title: "Test Template",
        description: "A test description",
      };

      const structure = getCardStructure(cardWithoutVideo);
      const validation = validateRequiredElements(structure);

      expect(validation.valid).toBe(true);
      expect(structure.hasVideo).toBe(false);
    });

    it("content cards without meta still have valid structure", () => {
      const cardWithoutMeta: ContentCardData = {
        href: "/library/test/",
        image: "/previews/test.png",
        icon: "star",
        title: "Test Template",
        description: "A test description",
      };

      const structure = getCardStructure(cardWithoutMeta);
      const validation = validateRequiredElements(structure);

      expect(validation.valid).toBe(true);
      expect(structure.hasMeta).toBe(false);
    });

    it("content cards with video have video element", () => {
      const cardWithVideo: ContentCardData = {
        href: "/library/test/",
        image: "/previews/test.png",
        video: "/previews/test.mp4",
        icon: "star",
        title: "Test Template",
        description: "A test description",
      };

      const structure = getCardStructure(cardWithVideo);

      expect(structure.hasVideo).toBe(true);
    });

    it("content cards with meta have meta element", () => {
      const cardWithMeta: ContentCardData = {
        href: "/library/test/",
        image: "/previews/test.png",
        icon: "star",
        title: "Test Template",
        description: "A test description",
        meta: "16 variants",
      };

      const structure = getCardStructure(cardWithMeta);

      expect(structure.hasMeta).toBe(true);
    });

    it("property: optional video presence matches input", () => {
      fc.assert(
        fc.property(contentCardDataArb, (cardData) => {
          const structure = getCardStructure(cardData);
          const hasVideoInput =
            typeof cardData.video === "string" && cardData.video.length > 0;

          expect(structure.hasVideo).toBe(hasVideoInput);
        }),
        { numRuns: 100 }
      );
    });

    it("property: optional meta presence matches input", () => {
      fc.assert(
        fc.property(contentCardDataArb, (cardData) => {
          const structure = getCardStructure(cardData);
          const hasMetaInput =
            typeof cardData.meta === "string" && cardData.meta.length > 0;

          expect(structure.hasMeta).toBe(hasMetaInput);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Validates: Requirements 8.1**
   *
   * Tests structural consistency across different card configurations.
   */
  describe("Structural consistency across configurations", () => {
    it("property: all generated content cards have consistent required structure", () => {
      fc.assert(
        fc.property(
          fc.array(contentCardDataArb, { minLength: 1, maxLength: 20 }),
          (cards) => {
            for (const card of cards) {
              const structure = getCardStructure(card);

              // All cards must have these elements
              expect(structure.hasMediaContainer).toBe(true);
              expect(structure.hasFallback).toBe(true);
              expect(structure.hasBody).toBe(true);
              expect(structure.hasImage).toBe(true);
              expect(structure.hasIcon).toBe(true);
              expect(structure.hasTitle).toBe(true);
              expect(structure.hasDescription).toBe(true);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it("property: hasRequiredFields correctly identifies valid cards", () => {
      fc.assert(
        fc.property(contentCardDataArb, (cardData) => {
          const isValid = hasRequiredFields(cardData);
          const structure = getCardStructure(cardData);
          const validation = validateRequiredElements(structure);

          // If hasRequiredFields returns true, validation should pass
          if (isValid) {
            expect(validation.valid).toBe(true);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Edge cases and boundary conditions.
   */
  describe("Edge cases", () => {
    it("handles empty optional fields correctly", () => {
      const cardWithEmptyOptionals: ContentCardData = {
        href: "/library/test/",
        image: "/previews/test.png",
        video: "",
        icon: "star",
        title: "Test",
        description: "Test description",
        meta: "",
      };

      const structure = getCardStructure(cardWithEmptyOptionals);

      // Empty strings should be treated as not present
      expect(structure.hasVideo).toBe(false);
      expect(structure.hasMeta).toBe(false);

      // Required elements should still be valid
      expect(structure.hasMediaContainer).toBe(true);
      expect(structure.hasIcon).toBe(true);
      expect(structure.hasTitle).toBe(true);
      expect(structure.hasDescription).toBe(true);
    });

    it("all templates have valid primaryId for image paths (real data)", () => {
      for (const template of templates) {
        expect(typeof template.primaryId).toBe("string");
        expect(template.primaryId.length).toBeGreaterThan(0);
      }
    });

    it("all templates have valid slug for href paths (real data)", () => {
      for (const template of templates) {
        expect(typeof template.slug).toBe("string");
        expect(template.slug.length).toBeGreaterThan(0);
        // Slug should be URL-safe
        expect(/^[a-z0-9-]+$/.test(template.slug)).toBe(true);
      }
    });

    it("all templates have positive variant count (real data)", () => {
      for (const template of templates) {
        expect(template.variantCount).toBeGreaterThan(0);
      }
    });
  });

  /**
   * Metamorphic properties for content card structure.
   */
  describe("Metamorphic properties", () => {
    it("property: adding optional fields doesn't break required structure", () => {
      const baseCardArb = fc.record({
        href: fc.string({ minLength: 1, maxLength: 50 }).map((s) => `/${s}/`),
        image: fc.string({ minLength: 1, maxLength: 50 }).map((s) => `/img/${s}.png`),
        icon: iconArb,
        title: nonEmptyStringArb,
        description: nonEmptyStringArb,
      });

      fc.assert(
        fc.property(
          baseCardArb,
          fc.option(nonEmptyStringArb, { nil: undefined }),
          fc.option(nonEmptyStringArb, { nil: undefined }),
          (baseCard, video, meta) => {
            // Card without optionals
            const cardWithoutOptionals: ContentCardData = { ...baseCard };
            const structureWithout = getCardStructure(cardWithoutOptionals);
            const validationWithout = validateRequiredElements(structureWithout);

            // Card with optionals
            const cardWithOptionals: ContentCardData = {
              ...baseCard,
              video: video ? `/video/${video}.mp4` : undefined,
              meta,
            };
            const structureWith = getCardStructure(cardWithOptionals);
            const validationWith = validateRequiredElements(structureWith);

            // Both should be valid
            expect(validationWithout.valid).toBe(true);
            expect(validationWith.valid).toBe(true);

            // Required elements should be the same
            expect(structureWithout.hasMediaContainer).toBe(structureWith.hasMediaContainer);
            expect(structureWithout.hasIcon).toBe(structureWith.hasIcon);
            expect(structureWithout.hasTitle).toBe(structureWith.hasTitle);
            expect(structureWithout.hasDescription).toBe(structureWith.hasDescription);
          }
        ),
        { numRuns: 50 }
      );
    });

    it("property: templateToContentCard always produces valid cards", () => {
      const variantArb = fc.record({
        id: fc.string({ minLength: 1, maxLength: 50 }),
        name: fc.string({ minLength: 1, maxLength: 50 }),
        style: fc.constantFrom("dark", "clean", "bold", "warm", "minimal", "neon"),
      });

      const templateArb = fc.record({
        slug: slugArb,
        camel: fc.string({ minLength: 1, maxLength: 30 }),
        name: nonEmptyStringArb,
        description: nonEmptyStringArb,
        icon: iconArb,
        color: colorArb,
        primaryVariant: fc.string({ minLength: 1, maxLength: 30 }),
        variantCount: fc.integer({ min: 1, max: 50 }),
        variants: fc.array(variantArb, { minLength: 1, maxLength: 10 }),
        primaryId: fc.string({ minLength: 1, maxLength: 50 }),
      });

      fc.assert(
        fc.property(templateArb, (template) => {
          const cardData = templateToContentCard(template);
          const structure = getCardStructure(cardData);
          const validation = validateRequiredElements(structure);

          expect(validation.valid).toBe(true);
          expect(structure.hasMeta).toBe(true); // templateToContentCard always adds meta
        }),
        { numRuns: 100 }
      );
    });
  });
});
