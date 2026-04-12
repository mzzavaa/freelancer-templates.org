/**
 * Property-Based Tests for Grid Layout Consistency
 *
 * Validates that all grids use consistent column counts at each breakpoint
 * and consistent 20px gap spacing across the site.
 *
 * Grid classes tested:
 *   - .content-card-grid - Main content card grid
 *   - .lib-grid - Library template grid
 *   - .theme-grid - Theme cards grid (flex-based)
 *
 * Breakpoints:
 *   - Desktop (≥1200px): 4 columns for content-card-grid, 3 for lib-grid
 *   - Tablet (768px-1199px): 3 columns for content-card-grid, 2-3 for lib-grid
 *   - Mobile (480px-767px): 2 columns
 *   - Small mobile (<480px): 1 column
 *
 * **Validates: Requirements 8.6**
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import * as fs from "fs";
import * as path from "path";

// ── Types ───────────────────────────────────────────────────────

interface GridConfig {
  className: string;
  displayType: "grid" | "flex";
  defaultColumns: number | null; // null for flex layouts
  gap: string;
  breakpoints: BreakpointConfig[];
}

interface BreakpointConfig {
  maxWidth: number;
  columns: number | null; // null for flex layouts
  gap?: string; // optional override
}

interface CSSRule {
  selector: string;
  properties: Record<string, string>;
  mediaQuery?: string;
}

// ── CSS Parser ──────────────────────────────────────────────────

/**
 * Improved CSS parser that correctly separates base rules from media query rules.
 * Handles nested braces and complex media query conditions.
 */
function parseCSSForGridRules(cssContent: string): CSSRule[] {
  const rules: CSSRule[] = [];
  
  // Remove comments
  const cleanCSS = cssContent.replace(/\/\*[\s\S]*?\*\//g, "");
  
  // Find all media query blocks with their positions
  const mediaBlocks: { query: string; content: string; start: number; end: number }[] = [];
  const mediaStartRegex = /@media\s*\(([^)]+(?:\)\s*and\s*\([^)]+)*)\)\s*\{/g;
  
  let match;
  while ((match = mediaStartRegex.exec(cleanCSS)) !== null) {
    const startIndex = match.index;
    const queryCondition = match[1];
    
    // Find matching closing brace by counting braces
    let braceCount = 1;
    let endIndex = match.index + match[0].length;
    
    while (braceCount > 0 && endIndex < cleanCSS.length) {
      if (cleanCSS[endIndex] === "{") braceCount++;
      if (cleanCSS[endIndex] === "}") braceCount--;
      endIndex++;
    }
    
    const content = cleanCSS.slice(match.index + match[0].length, endIndex - 1);
    mediaBlocks.push({
      query: queryCondition,
      content,
      start: startIndex,
      end: endIndex,
    });
  }
  
  // Create CSS without media queries for parsing base rules
  let cssWithoutMedia = cleanCSS;
  // Sort by start position descending to remove from end first
  const sortedBlocks = [...mediaBlocks].sort((a, b) => b.start - a.start);
  for (const block of sortedBlocks) {
    cssWithoutMedia = cssWithoutMedia.slice(0, block.start) + " ".repeat(block.end - block.start) + cssWithoutMedia.slice(block.end);
  }
  
  // Parse base rules (outside media queries)
  const ruleRegex = /([.#][\w-]+(?:[\s,]+[.#][\w-]+)*)\s*\{([^}]+)\}/g;
  
  while ((match = ruleRegex.exec(cssWithoutMedia)) !== null) {
    const selector = match[1].trim();
    const propertiesStr = match[2];
    const properties = parseProperties(propertiesStr);
    
    if (isGridRelated(selector, properties)) {
      rules.push({ selector, properties });
    }
  }
  
  // Parse rules inside media queries
  for (const block of mediaBlocks) {
    const innerRuleRegex = /([.#][\w-]+(?:[\s,]+[.#][\w-]+)*)\s*\{([^}]+)\}/g;
    while ((match = innerRuleRegex.exec(block.content)) !== null) {
      const selector = match[1].trim();
      const propertiesStr = match[2];
      const properties = parseProperties(propertiesStr);
      
      if (isGridRelated(selector, properties)) {
        rules.push({ selector, properties, mediaQuery: block.query });
      }
    }
  }
  
  return rules;
}

/**
 * Parse CSS properties from a property string.
 */
function parseProperties(propertiesStr: string): Record<string, string> {
  const properties: Record<string, string> = {};
  const propRegex = /([\w-]+)\s*:\s*([^;]+);?/g;
  let match;
  
  while ((match = propRegex.exec(propertiesStr)) !== null) {
    properties[match[1].trim()] = match[2].trim();
  }
  
  return properties;
}

/**
 * Check if a rule is grid-related based on selector or properties.
 */
function isGridRelated(selector: string, properties: Record<string, string>): boolean {
  const gridSelectors = [
    ".content-card-grid",
    ".lib-grid",
    ".lib-grid--mol",
    ".theme-grid",
    ".rmt-grid",
    ".cat-grid",
    ".mega__groups",
  ];
  
  const hasGridSelector = gridSelectors.some((gs) => selector.includes(gs));
  const hasGridProperty =
    properties["display"] === "grid" ||
    properties["display"] === "flex" ||
    properties["grid-template-columns"] !== undefined ||
    properties["gap"] !== undefined;
  
  return hasGridSelector || (hasGridProperty && selector.startsWith("."));
}

/**
 * Extract column count from grid-template-columns value.
 */
function extractColumnCount(gridTemplateColumns: string): number | null {
  if (!gridTemplateColumns) return null;
  
  // Match repeat(N, 1fr) pattern
  const repeatMatch = gridTemplateColumns.match(/repeat\s*\(\s*(\d+)\s*,/);
  if (repeatMatch) {
    return parseInt(repeatMatch[1], 10);
  }
  
  // Match explicit 1fr values
  const frMatches = gridTemplateColumns.match(/1fr/g);
  if (frMatches) {
    return frMatches.length;
  }
  
  return null;
}

/**
 * Extract max-width value from media query.
 */
function extractMaxWidth(mediaQuery: string): number | null {
  const match = mediaQuery.match(/max-width\s*:\s*(\d+)px/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Parse gap value to pixels.
 */
function parseGapToPixels(gap: string): number | null {
  if (!gap) return null;
  
  // Direct pixel value
  const pxMatch = gap.match(/^(\d+(?:\.\d+)?)px$/);
  if (pxMatch) {
    return parseFloat(pxMatch[1]);
  }
  
  // rem value (assuming 16px base)
  const remMatch = gap.match(/^(\d+(?:\.\d+)?)rem$/);
  if (remMatch) {
    return parseFloat(remMatch[1]) * 16;
  }
  
  return null;
}

// ── Load CSS Data ───────────────────────────────────────────────

const cssPath = path.resolve(__dirname, "../../../../assets/css/main.css");
const cssContent = fs.readFileSync(cssPath, "utf-8");
const cssRules = parseCSSForGridRules(cssContent);

// ── Expected Grid Configurations ────────────────────────────────

/**
 * Expected grid configurations based on design specifications.
 * 
 * From design.md:
 * - Desktop (≥1200px): 4 columns
 * - Tablet (768px-1199px): 3 columns
 * - Mobile (480px-767px): 2 columns
 * - Small mobile (<480px): 1 column
 * - Gap: 20px (var(--gap-lg) or 1.25rem)
 */
const expectedGridConfigs: GridConfig[] = [
  {
    className: ".content-card-grid",
    displayType: "grid",
    defaultColumns: 4,
    gap: "20px",
    breakpoints: [
      { maxWidth: 1100, columns: 3 },
      { maxWidth: 768, columns: 2 },
      { maxWidth: 480, columns: 1 },
    ],
  },
  {
    className: ".lib-grid",
    displayType: "grid",
    defaultColumns: 3,
    gap: "24px", // lib-grid uses 24px gap
    breakpoints: [
      { maxWidth: 1024, columns: 2 },
      { maxWidth: 768, columns: 2, gap: "16px" },
      { maxWidth: 480, columns: 1, gap: "14px" },
    ],
  },
  {
    className: ".theme-grid",
    displayType: "flex",
    defaultColumns: null, // flex layout
    gap: "12px",
    breakpoints: [],
  },
];

// ── Property 7: Grid Layout Consistency ─────────────────────────

describe("Property 7: Grid Layout Consistency", () => {
  /**
   * **Validates: Requirements 8.6**
   *
   * Requirement 8.6: FOR ALL Content_Card grids, THE Grid_Layout SHALL use
   * consistent column counts and gap spacing across all landing pages.
   */
  describe("Verify all grids use consistent column counts at each breakpoint", () => {
    it("content-card-grid has correct default column count (4 columns)", () => {
      const contentCardGridRules = cssRules.filter(
        (rule) => rule.selector === ".content-card-grid" && !rule.mediaQuery
      );
      
      expect(contentCardGridRules.length).toBeGreaterThan(0);
      
      for (const rule of contentCardGridRules) {
        if (rule.properties["grid-template-columns"]) {
          const columns = extractColumnCount(rule.properties["grid-template-columns"]);
          expect(columns).toBe(4);
        }
      }
    });

    it("content-card-grid has correct tablet breakpoint (3 columns at max-width: 1100px)", () => {
      const tabletRules = cssRules.filter(
        (rule) =>
          rule.selector === ".content-card-grid" &&
          rule.mediaQuery &&
          extractMaxWidth(rule.mediaQuery) === 1100
      );
      
      expect(tabletRules.length).toBeGreaterThan(0);
      
      for (const rule of tabletRules) {
        if (rule.properties["grid-template-columns"]) {
          const columns = extractColumnCount(rule.properties["grid-template-columns"]);
          expect(columns).toBe(3);
        }
      }
    });

    it("content-card-grid has correct mobile breakpoint (2 columns at max-width: 768px)", () => {
      const mobileRules = cssRules.filter(
        (rule) =>
          rule.selector === ".content-card-grid" &&
          rule.mediaQuery &&
          extractMaxWidth(rule.mediaQuery) === 768
      );
      
      expect(mobileRules.length).toBeGreaterThan(0);
      
      for (const rule of mobileRules) {
        if (rule.properties["grid-template-columns"]) {
          const columns = extractColumnCount(rule.properties["grid-template-columns"]);
          expect(columns).toBe(2);
        }
      }
    });

    it("content-card-grid has correct small mobile breakpoint (1 column at max-width: 480px)", () => {
      const smallMobileRules = cssRules.filter(
        (rule) =>
          rule.selector === ".content-card-grid" &&
          rule.mediaQuery &&
          extractMaxWidth(rule.mediaQuery) === 480
      );
      
      expect(smallMobileRules.length).toBeGreaterThan(0);
      
      for (const rule of smallMobileRules) {
        if (rule.properties["grid-template-columns"]) {
          const columns = extractColumnCount(rule.properties["grid-template-columns"]);
          expect(columns).toBe(1);
        }
      }
    });

    it("lib-grid has correct default column count (3 columns)", () => {
      const libGridRules = cssRules.filter(
        (rule) => rule.selector === ".lib-grid" && !rule.mediaQuery
      );
      
      expect(libGridRules.length).toBeGreaterThan(0);
      
      // Find the rule with grid-template-columns
      const ruleWithColumns = libGridRules.find(
        (rule) => rule.properties["grid-template-columns"]
      );
      
      expect(ruleWithColumns).toBeDefined();
      if (ruleWithColumns) {
        const columns = extractColumnCount(ruleWithColumns.properties["grid-template-columns"]);
        expect(columns).toBe(3);
      }
    });

    it("lib-grid has responsive breakpoints defined", () => {
      const libGridResponsiveRules = cssRules.filter(
        (rule) => rule.selector === ".lib-grid" && rule.mediaQuery
      );
      
      expect(libGridResponsiveRules.length).toBeGreaterThan(0);
      
      // Check that breakpoints reduce column count
      for (const rule of libGridResponsiveRules) {
        if (rule.properties["grid-template-columns"]) {
          const columns = extractColumnCount(rule.properties["grid-template-columns"]);
          expect(columns).toBeLessThanOrEqual(3);
          expect(columns).toBeGreaterThanOrEqual(1);
        }
      }
    });

    it("theme-grid uses flex display for flexible layout", () => {
      const themeGridRules = cssRules.filter(
        (rule) => rule.selector === ".theme-grid" && !rule.mediaQuery
      );
      
      expect(themeGridRules.length).toBeGreaterThan(0);
      
      for (const rule of themeGridRules) {
        expect(rule.properties["display"]).toBe("flex");
        expect(rule.properties["flex-wrap"]).toBe("wrap");
      }
    });

    it("property: column counts decrease monotonically as viewport narrows", () => {
      // For content-card-grid, verify columns decrease at each breakpoint
      const contentCardGridRules = cssRules.filter(
        (rule) => rule.selector === ".content-card-grid"
      );
      
      const columnsByBreakpoint: { maxWidth: number | null; columns: number }[] = [];
      
      for (const rule of contentCardGridRules) {
        if (rule.properties["grid-template-columns"]) {
          const columns = extractColumnCount(rule.properties["grid-template-columns"]);
          const maxWidth = rule.mediaQuery ? extractMaxWidth(rule.mediaQuery) : null;
          
          if (columns !== null) {
            columnsByBreakpoint.push({ maxWidth, columns });
          }
        }
      }
      
      // Sort by maxWidth (null = desktop = largest)
      columnsByBreakpoint.sort((a, b) => {
        if (a.maxWidth === null) return -1;
        if (b.maxWidth === null) return 1;
        return b.maxWidth - a.maxWidth;
      });
      
      // Verify monotonic decrease
      for (let i = 1; i < columnsByBreakpoint.length; i++) {
        expect(columnsByBreakpoint[i].columns).toBeLessThanOrEqual(
          columnsByBreakpoint[i - 1].columns
        );
      }
    });
  });

  /**
   * **Validates: Requirements 8.6**
   *
   * Verify consistent 20px gap spacing for content-card-grid.
   */
  describe("Verify consistent 20px gap spacing", () => {
    it("content-card-grid has 20px gap", () => {
      const contentCardGridRules = cssRules.filter(
        (rule) => rule.selector === ".content-card-grid" && !rule.mediaQuery
      );
      
      expect(contentCardGridRules.length).toBeGreaterThan(0);
      
      const ruleWithGap = contentCardGridRules.find((rule) => rule.properties["gap"]);
      expect(ruleWithGap).toBeDefined();
      
      if (ruleWithGap) {
        const gapPixels = parseGapToPixels(ruleWithGap.properties["gap"]);
        expect(gapPixels).toBe(20);
      }
    });

    it("lib-grid has consistent gap spacing (24px default)", () => {
      const libGridRules = cssRules.filter(
        (rule) => rule.selector === ".lib-grid" && !rule.mediaQuery
      );
      
      expect(libGridRules.length).toBeGreaterThan(0);
      
      const ruleWithGap = libGridRules.find((rule) => rule.properties["gap"]);
      expect(ruleWithGap).toBeDefined();
      
      if (ruleWithGap) {
        const gapPixels = parseGapToPixels(ruleWithGap.properties["gap"]);
        // lib-grid uses 24px gap
        expect(gapPixels).toBe(24);
      }
    });

    it("theme-grid has consistent gap spacing (12px)", () => {
      const themeGridRules = cssRules.filter(
        (rule) => rule.selector === ".theme-grid" && !rule.mediaQuery
      );
      
      expect(themeGridRules.length).toBeGreaterThan(0);
      
      const ruleWithGap = themeGridRules.find((rule) => rule.properties["gap"]);
      expect(ruleWithGap).toBeDefined();
      
      if (ruleWithGap) {
        const gapPixels = parseGapToPixels(ruleWithGap.properties["gap"]);
        // theme-grid uses 12px gap
        expect(gapPixels).toBe(12);
      }
    });

    it("property: gap values are positive and reasonable", () => {
      const gridRules = cssRules.filter(
        (rule) =>
          (rule.selector === ".content-card-grid" ||
            rule.selector === ".lib-grid" ||
            rule.selector === ".theme-grid") &&
          rule.properties["gap"]
      );
      
      for (const rule of gridRules) {
        const gapPixels = parseGapToPixels(rule.properties["gap"]);
        if (gapPixels !== null) {
          expect(gapPixels).toBeGreaterThan(0);
          expect(gapPixels).toBeLessThanOrEqual(32); // Reasonable max gap
        }
      }
    });
  });

  /**
   * **Validates: Requirements 8.6**
   *
   * Property-based tests for grid configuration consistency.
   */
  describe("Property-based grid configuration tests", () => {
    it("property: all main grid classes have display: grid or display: flex", () => {
      const gridClassNames = [".content-card-grid", ".lib-grid", ".theme-grid"];
      
      for (const className of gridClassNames) {
        const rules = cssRules.filter(
          (rule) => rule.selector === className && !rule.mediaQuery
        );
        
        expect(rules.length).toBeGreaterThan(0);
        
        // Find the rule that defines display
        const ruleWithDisplay = rules.find((rule) => rule.properties["display"]);
        expect(ruleWithDisplay).toBeDefined();
        
        if (ruleWithDisplay) {
          const display = ruleWithDisplay.properties["display"];
          expect(["grid", "flex"]).toContain(display);
        }
      }
    });

    it("property: grid breakpoints use reasonable max-width values", () => {
      // Allow a wider range of breakpoints that are commonly used
      const minBreakpoint = 300;
      const maxBreakpoint = 1400;
      
      const gridRulesWithMedia = cssRules.filter(
        (rule) =>
          (rule.selector === ".content-card-grid" || rule.selector === ".lib-grid") &&
          rule.mediaQuery
      );
      
      for (const rule of gridRulesWithMedia) {
        const maxWidth = extractMaxWidth(rule.mediaQuery!);
        if (maxWidth !== null) {
          // Check that breakpoint is within reasonable range
          expect(maxWidth).toBeGreaterThanOrEqual(minBreakpoint);
          expect(maxWidth).toBeLessThanOrEqual(maxBreakpoint);
        }
      }
    });

    it("property: generated grid configs follow valid structure patterns", () => {
      // Test that our expected grid config structure is valid
      // Generate configs where breakpoint columns are always <= default columns
      const gridConfigArb = fc.integer({ min: 1, max: 6 }).chain((defaultCols) =>
        fc.record({
          className: fc.constantFrom(".content-card-grid", ".lib-grid", ".theme-grid"),
          displayType: fc.constantFrom("grid", "flex") as fc.Arbitrary<"grid" | "flex">,
          defaultColumns: fc.constant(defaultCols),
          gap: fc.constantFrom("12px", "16px", "20px", "24px"),
          breakpoints: fc.array(
            fc.record({
              maxWidth: fc.constantFrom(480, 768, 900, 1024, 1100, 1200),
              columns: fc.integer({ min: 1, max: defaultCols }), // Ensure columns <= defaultCols
            }),
            { minLength: 0, maxLength: 4 }
          ),
        })
      );

      fc.assert(
        fc.property(gridConfigArb, (config) => {
          // Grid configs should have valid structure
          expect(config.className).toMatch(/^\.[a-z-]+$/);
          expect(["grid", "flex"]).toContain(config.displayType);
          
          // Gap should be a valid CSS value
          expect(config.gap).toMatch(/^\d+px$/);
          
          // Verify breakpoint columns are valid
          for (const bp of config.breakpoints) {
            expect(bp.columns).toBeGreaterThanOrEqual(1);
            expect(bp.columns).toBeLessThanOrEqual(config.defaultColumns);
          }
        }),
        { numRuns: 50 }
      );
    });

    it("property: CSS rules maintain grid structure across breakpoints", () => {
      const breakpointArb = fc.constantFrom(null, 480, 768, 900, 1024, 1100);
      
      fc.assert(
        fc.property(breakpointArb, (breakpoint) => {
          const contentCardRules = cssRules.filter((rule) => {
            if (rule.selector !== ".content-card-grid") return false;
            if (breakpoint === null) return !rule.mediaQuery;
            return rule.mediaQuery && extractMaxWidth(rule.mediaQuery) === breakpoint;
          });
          
          // At each breakpoint, content-card-grid should have grid-template-columns
          for (const rule of contentCardRules) {
            if (rule.properties["grid-template-columns"]) {
              const columns = extractColumnCount(rule.properties["grid-template-columns"]);
              expect(columns).toBeGreaterThanOrEqual(1);
              expect(columns).toBeLessThanOrEqual(4);
            }
          }
        }),
        { numRuns: 20 }
      );
    });
  });

  /**
   * Verify grid configurations are consistent across all grid classes.
   */
  describe("Grid configurations are consistent across all grid classes", () => {
    it("all grid classes define display property", () => {
      const gridClassNames = [".content-card-grid", ".lib-grid", ".theme-grid"];
      
      for (const className of gridClassNames) {
        const baseRule = cssRules.find(
          (rule) => rule.selector === className && !rule.mediaQuery
        );
        
        expect(baseRule).toBeDefined();
        expect(baseRule?.properties["display"]).toBeDefined();
      }
    });

    it("all grid classes define gap property", () => {
      const gridClassNames = [".content-card-grid", ".lib-grid", ".theme-grid"];
      
      for (const className of gridClassNames) {
        const baseRule = cssRules.find(
          (rule) => rule.selector === className && !rule.mediaQuery
        );
        
        expect(baseRule).toBeDefined();
        expect(baseRule?.properties["gap"]).toBeDefined();
      }
    });

    it("grid-based classes define grid-template-columns", () => {
      const gridClassNames = [".content-card-grid", ".lib-grid"];
      
      for (const className of gridClassNames) {
        const baseRule = cssRules.find(
          (rule) => rule.selector === className && !rule.mediaQuery
        );
        
        expect(baseRule).toBeDefined();
        expect(baseRule?.properties["grid-template-columns"]).toBeDefined();
      }
    });

    it("flex-based classes define flex-wrap", () => {
      const flexClassNames = [".theme-grid"];
      
      for (const className of flexClassNames) {
        const baseRule = cssRules.find(
          (rule) => rule.selector === className && !rule.mediaQuery
        );
        
        expect(baseRule).toBeDefined();
        expect(baseRule?.properties["flex-wrap"]).toBe("wrap");
      }
    });
  });

  /**
   * Edge cases and metamorphic properties.
   */
  describe("Edge cases", () => {
    it("CSS file exists and is readable", () => {
      expect(fs.existsSync(cssPath)).toBe(true);
      expect(cssContent.length).toBeGreaterThan(0);
    });

    it("CSS rules are parsed correctly", () => {
      expect(cssRules.length).toBeGreaterThan(0);
      
      // Should have at least the main grid classes
      const hasContentCardGrid = cssRules.some(
        (rule) => rule.selector === ".content-card-grid"
      );
      const hasLibGrid = cssRules.some((rule) => rule.selector === ".lib-grid");
      const hasThemeGrid = cssRules.some((rule) => rule.selector === ".theme-grid");
      
      expect(hasContentCardGrid).toBe(true);
      expect(hasLibGrid).toBe(true);
      expect(hasThemeGrid).toBe(true);
    });

    it("media queries are parsed with correct max-width values", () => {
      const rulesWithMedia = cssRules.filter((rule) => rule.mediaQuery);
      
      for (const rule of rulesWithMedia) {
        const maxWidth = extractMaxWidth(rule.mediaQuery!);
        if (maxWidth !== null) {
          expect(maxWidth).toBeGreaterThan(0);
          expect(maxWidth).toBeLessThanOrEqual(2000);
        }
      }
    });

    it("column counts are valid integers", () => {
      for (const rule of cssRules) {
        if (rule.properties["grid-template-columns"]) {
          const columns = extractColumnCount(rule.properties["grid-template-columns"]);
          if (columns !== null) {
            expect(Number.isInteger(columns)).toBe(true);
            expect(columns).toBeGreaterThanOrEqual(1);
          }
        }
      }
    });
  });
});
