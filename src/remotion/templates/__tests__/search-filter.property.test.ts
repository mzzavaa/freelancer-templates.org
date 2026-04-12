/**
 * Property-Based Tests for Search Filter Correctness
 *
 * Validates the search functionality in the Templates mega menu.
 * The search filters template items in real-time using case-insensitive
 * substring matching on the data-label attribute.
 *
 * Properties tested:
 *   1. Visible items exactly match case-insensitive substring search
 *   2. All non-matching items are hidden
 *   3. Empty search shows all items
 *
 * **Validates: Requirements 7.3**
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import * as fs from "fs";
import * as path from "path";

// ── Types ───────────────────────────────────────────────────────

interface MegaMenuItem {
  label: string; // The data-label attribute value (lowercase template name)
  name: string;  // Display name
}

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

// ── Helper Functions ────────────────────────────────────────────

/**
 * Simulates the search filter logic from assets/js/main.js:
 *
 * searchInput.addEventListener('input', function () {
 *   var q = this.value.toLowerCase().trim();
 *   if (!q) { resetSearch(); return; }
 *   megaMenu.querySelectorAll('.mega__item').forEach(function (item) {
 *     var match = (item.dataset.label || '').includes(q);
 *     item.classList.toggle('mega__item--hidden', !match);
 *     if (match) hasVisible = true;
 *   });
 * });
 *
 * The search uses case-insensitive substring matching on the data-label attribute.
 */
function filterItemsBySearch(items: MegaMenuItem[], query: string): MegaMenuItem[] {
  const q = query.toLowerCase().trim();
  
  // Empty query shows all items
  if (!q) {
    return items;
  }
  
  // Filter items where label includes the query (case-insensitive substring match)
  return items.filter((item) => item.label.includes(q));
}

/**
 * Checks if an item matches the search query.
 * This mirrors the JavaScript logic: (item.dataset.label || '').includes(q)
 */
function itemMatchesSearch(item: MegaMenuItem, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true; // Empty query matches all
  return item.label.includes(q);
}

/**
 * Gets items that should be hidden (non-matching items).
 */
function getHiddenItems(items: MegaMenuItem[], query: string): MegaMenuItem[] {
  const q = query.toLowerCase().trim();
  
  // Empty query hides nothing
  if (!q) {
    return [];
  }
  
  // Items that don't match should be hidden
  return items.filter((item) => !item.label.includes(q));
}

/**
 * Converts templates to mega menu items.
 * The data-label attribute is set to the lowercase template name.
 */
function templatesToMegaMenuItems(templates: Template[]): MegaMenuItem[] {
  return templates.map((t) => ({
    label: t.name.toLowerCase(),
    name: t.name,
  }));
}

// ── Load Real Template Data ─────────────────────────────────────

const templatesPath = path.resolve(__dirname, "../../../../data/templates.json");
const templates: Template[] = JSON.parse(fs.readFileSync(templatesPath, "utf-8"));
const megaMenuItems = templatesToMegaMenuItems(templates);

// ── Property 5: Search Filter Correctness ───────────────────────

describe("Property 5: Search Filter Correctness", () => {
  /**
   * **Validates: Requirements 7.3**
   *
   * Requirement 7.3: WHEN a search query is entered, THE Mega_Menu SHALL
   * highlight matching template names and hide non-matching items.
   *
   * This property verifies that visible items exactly match case-insensitive
   * substring search.
   */
  describe("Visible items exactly match case-insensitive substring search", () => {
    it("all visible items contain the search query as substring (real data)", () => {
      const testQueries = ["test", "video", "social", "a", "e", "pro", "dash"];
      
      for (const query of testQueries) {
        const visibleItems = filterItemsBySearch(megaMenuItems, query);
        const q = query.toLowerCase().trim();
        
        // Every visible item should contain the query
        for (const item of visibleItems) {
          expect(item.label).toContain(q);
        }
      }
    });

    it("search is case-insensitive (real data)", () => {
      const testCases = [
        { query: "VIDEO", expected: "video" },
        { query: "Social", expected: "social" },
        { query: "DASHBOARD", expected: "dashboard" },
        { query: "TeSt", expected: "test" },
      ];
      
      for (const { query, expected } of testCases) {
        const visibleItems = filterItemsBySearch(megaMenuItems, query);
        
        // Results should be the same as lowercase query
        const lowercaseResults = filterItemsBySearch(megaMenuItems, expected);
        
        expect(visibleItems.length).toBe(lowercaseResults.length);
        
        const visibleLabels = visibleItems.map((i) => i.label).sort();
        const lowercaseLabels = lowercaseResults.map((i) => i.label).sort();
        expect(visibleLabels).toEqual(lowercaseLabels);
      }
    });

    it("search trims whitespace (real data)", () => {
      const testCases = [
        { query: "  video  ", expected: "video" },
        { query: "\tvideo\t", expected: "video" },
        { query: "  social", expected: "social" },
        { query: "dashboard  ", expected: "dashboard" },
      ];
      
      for (const { query, expected } of testCases) {
        const visibleItems = filterItemsBySearch(megaMenuItems, query);
        const expectedResults = filterItemsBySearch(megaMenuItems, expected);
        
        expect(visibleItems.length).toBe(expectedResults.length);
      }
    });

    it("property: for any query, all visible items contain the query substring", () => {
      const queryArb = fc.string({ minLength: 1, maxLength: 10 });
      
      fc.assert(
        fc.property(queryArb, (query) => {
          const visibleItems = filterItemsBySearch(megaMenuItems, query);
          const q = query.toLowerCase().trim();
          
          // Skip empty queries after trim
          if (!q) return;
          
          // Every visible item should contain the query
          for (const item of visibleItems) {
            expect(item.label).toContain(q);
          }
        }),
        { numRuns: 100 }
      );
    });

    it("property: for any arbitrary items and query, visible items contain query", () => {
      const itemArb = fc.record({
        label: fc.string({ minLength: 1, maxLength: 30 }).map((s) => s.toLowerCase()),
        name: fc.string({ minLength: 1, maxLength: 30 }),
      });
      
      const queryArb = fc.string({ minLength: 1, maxLength: 10 });
      
      fc.assert(
        fc.property(
          fc.array(itemArb, { minLength: 1, maxLength: 20 }),
          queryArb,
          (items, query) => {
            const visibleItems = filterItemsBySearch(items, query);
            const q = query.toLowerCase().trim();
            
            // Skip empty queries after trim
            if (!q) return;
            
            // Every visible item should contain the query
            for (const item of visibleItems) {
              expect(item.label).toContain(q);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Validates: Requirements 7.3**
   *
   * This property verifies that all non-matching items are hidden.
   */
  describe("All non-matching items are hidden", () => {
    it("items without query substring are hidden (real data)", () => {
      const testQueries = ["xyz", "video", "social", "dashboard"];
      
      for (const query of testQueries) {
        const visibleItems = filterItemsBySearch(megaMenuItems, query);
        const hiddenItems = getHiddenItems(megaMenuItems, query);
        const q = query.toLowerCase().trim();
        
        // Hidden items should NOT contain the query
        for (const item of hiddenItems) {
          expect(item.label).not.toContain(q);
        }
        
        // Total should equal original count
        expect(visibleItems.length + hiddenItems.length).toBe(megaMenuItems.length);
      }
    });

    it("property: hidden items do not contain the query substring", () => {
      const queryArb = fc.string({ minLength: 1, maxLength: 10 });
      
      fc.assert(
        fc.property(queryArb, (query) => {
          const hiddenItems = getHiddenItems(megaMenuItems, query);
          const q = query.toLowerCase().trim();
          
          // Skip empty queries after trim
          if (!q) return;
          
          // Hidden items should NOT contain the query
          for (const item of hiddenItems) {
            expect(item.label).not.toContain(q);
          }
        }),
        { numRuns: 100 }
      );
    });

    it("property: for any arbitrary items and query, hidden items don't contain query", () => {
      const itemArb = fc.record({
        label: fc.string({ minLength: 1, maxLength: 30 }).map((s) => s.toLowerCase()),
        name: fc.string({ minLength: 1, maxLength: 30 }),
      });
      
      const queryArb = fc.string({ minLength: 1, maxLength: 10 });
      
      fc.assert(
        fc.property(
          fc.array(itemArb, { minLength: 1, maxLength: 20 }),
          queryArb,
          (items, query) => {
            const hiddenItems = getHiddenItems(items, query);
            const q = query.toLowerCase().trim();
            
            // Skip empty queries after trim
            if (!q) return;
            
            // Hidden items should NOT contain the query
            for (const item of hiddenItems) {
              expect(item.label).not.toContain(q);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it("property: visible and hidden items partition the full list", () => {
      const itemArb = fc.record({
        label: fc.string({ minLength: 1, maxLength: 30 }).map((s) => s.toLowerCase()),
        name: fc.string({ minLength: 1, maxLength: 30 }),
      });
      
      const queryArb = fc.string({ minLength: 0, maxLength: 10 });
      
      fc.assert(
        fc.property(
          fc.array(itemArb, { minLength: 1, maxLength: 20 }),
          queryArb,
          (items, query) => {
            const visibleItems = filterItemsBySearch(items, query);
            const hiddenItems = getHiddenItems(items, query);
            
            // Total should equal original count
            expect(visibleItems.length + hiddenItems.length).toBe(items.length);
            
            // No overlap between visible and hidden
            const visibleLabels = new Set(visibleItems.map((i) => i.label));
            for (const item of hiddenItems) {
              expect(visibleLabels.has(item.label)).toBe(false);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Validates: Requirements 7.3**
   *
   * This property verifies that empty search shows all items.
   */
  describe("Empty search shows all items", () => {
    it("empty string query shows all items (real data)", () => {
      const visibleItems = filterItemsBySearch(megaMenuItems, "");
      expect(visibleItems.length).toBe(megaMenuItems.length);
    });

    it("whitespace-only query shows all items (real data)", () => {
      const testQueries = ["   ", "\t", "\n", "  \t  "];
      
      for (const query of testQueries) {
        const visibleItems = filterItemsBySearch(megaMenuItems, query);
        expect(visibleItems.length).toBe(megaMenuItems.length);
      }
    });

    it("property: empty or whitespace-only query shows all items", () => {
      // Generate whitespace-only strings using array of whitespace chars joined
      const whitespaceArb = fc.array(fc.constantFrom(" ", "\t", "\n"), { minLength: 0, maxLength: 5 })
        .map((chars) => chars.join(""));
      
      fc.assert(
        fc.property(whitespaceArb, (query) => {
          const visibleItems = filterItemsBySearch(megaMenuItems, query);
          expect(visibleItems.length).toBe(megaMenuItems.length);
        }),
        { numRuns: 50 }
      );
    });

    it("property: for any arbitrary items, empty query shows all", () => {
      const itemArb = fc.record({
        label: fc.string({ minLength: 1, maxLength: 30 }).map((s) => s.toLowerCase()),
        name: fc.string({ minLength: 1, maxLength: 30 }),
      });
      
      // Generate whitespace-only strings using array of whitespace chars joined
      const whitespaceArb = fc.array(fc.constantFrom(" ", "\t", "\n", ""), { minLength: 0, maxLength: 5 })
        .map((chars) => chars.join(""));
      
      fc.assert(
        fc.property(
          fc.array(itemArb, { minLength: 1, maxLength: 20 }),
          whitespaceArb,
          (items, query) => {
            const visibleItems = filterItemsBySearch(items, query);
            expect(visibleItems.length).toBe(items.length);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Metamorphic property: searching for a longer substring should return
   * a subset of results from searching for a shorter prefix.
   */
  describe("Metamorphic: longer query returns subset", () => {
    it("property: extending query returns subset of original results", () => {
      const baseQueryArb = fc.string({ minLength: 1, maxLength: 5 });
      const extensionArb = fc.string({ minLength: 1, maxLength: 5 });
      
      fc.assert(
        fc.property(baseQueryArb, extensionArb, (baseQuery, extension) => {
          const baseResults = filterItemsBySearch(megaMenuItems, baseQuery);
          const extendedQuery = baseQuery + extension;
          const extendedResults = filterItemsBySearch(megaMenuItems, extendedQuery);
          
          // Extended results should be a subset of base results
          const baseLabels = new Set(baseResults.map((i) => i.label));
          for (const item of extendedResults) {
            expect(baseLabels.has(item.label)).toBe(true);
          }
          
          // Extended results count should be <= base results count
          expect(extendedResults.length).toBeLessThanOrEqual(baseResults.length);
        }),
        { numRuns: 100 }
      );
    });

    it("property: for arbitrary items, extending query returns subset", () => {
      const itemArb = fc.record({
        label: fc.string({ minLength: 1, maxLength: 30 }).map((s) => s.toLowerCase()),
        name: fc.string({ minLength: 1, maxLength: 30 }),
      });
      
      const baseQueryArb = fc.string({ minLength: 1, maxLength: 5 });
      const extensionArb = fc.string({ minLength: 1, maxLength: 5 });
      
      fc.assert(
        fc.property(
          fc.array(itemArb, { minLength: 1, maxLength: 15 }),
          baseQueryArb,
          extensionArb,
          (items, baseQuery, extension) => {
            const baseResults = filterItemsBySearch(items, baseQuery);
            const extendedQuery = baseQuery + extension;
            const extendedResults = filterItemsBySearch(items, extendedQuery);
            
            // Extended results should be a subset of base results
            const baseLabels = new Set(baseResults.map((i) => i.label));
            for (const item of extendedResults) {
              expect(baseLabels.has(item.label)).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Metamorphic property: searching twice with the same query should
   * return the same results (idempotent).
   */
  describe("Metamorphic: idempotent search", () => {
    it("property: searching twice returns same results", () => {
      const queryArb = fc.string({ minLength: 0, maxLength: 10 });
      
      fc.assert(
        fc.property(queryArb, (query) => {
          const firstResults = filterItemsBySearch(megaMenuItems, query);
          const secondResults = filterItemsBySearch(megaMenuItems, query);
          
          expect(firstResults.length).toBe(secondResults.length);
          
          const firstLabels = firstResults.map((i) => i.label).sort();
          const secondLabels = secondResults.map((i) => i.label).sort();
          expect(firstLabels).toEqual(secondLabels);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Verify itemMatchesSearch consistency with filterItemsBySearch.
   */
  describe("itemMatchesSearch consistency", () => {
    it("itemMatchesSearch is consistent with filterItemsBySearch (real data)", () => {
      const testQueries = ["video", "social", "a", "xyz", ""];
      
      for (const query of testQueries) {
        const filteredItems = filterItemsBySearch(megaMenuItems, query);
        const filteredLabels = new Set(filteredItems.map((i) => i.label));
        
        for (const item of megaMenuItems) {
          const matches = itemMatchesSearch(item, query);
          const isInFiltered = filteredLabels.has(item.label);
          
          expect(matches).toBe(isInFiltered);
        }
      }
    });

    it("property: itemMatchesSearch is consistent with filterItemsBySearch", () => {
      const itemArb = fc.record({
        label: fc.string({ minLength: 1, maxLength: 30 }).map((s) => s.toLowerCase()),
        name: fc.string({ minLength: 1, maxLength: 30 }),
      });
      
      const queryArb = fc.string({ minLength: 0, maxLength: 10 });
      
      fc.assert(
        fc.property(
          fc.array(itemArb, { minLength: 1, maxLength: 15 }),
          queryArb,
          (items, query) => {
            const filteredItems = filterItemsBySearch(items, query);
            const filteredLabels = new Set(filteredItems.map((i) => i.label));
            
            for (const item of items) {
              const matches = itemMatchesSearch(item, query);
              const isInFiltered = filteredLabels.has(item.label);
              
              expect(matches).toBe(isInFiltered);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Edge cases.
   */
  describe("Edge cases", () => {
    it("query that matches no items returns empty list", () => {
      const visibleItems = filterItemsBySearch(megaMenuItems, "xyznonexistent123");
      expect(visibleItems.length).toBe(0);
    });

    it("single character query works correctly", () => {
      const visibleItems = filterItemsBySearch(megaMenuItems, "a");
      const q = "a";
      
      // All visible items should contain 'a'
      for (const item of visibleItems) {
        expect(item.label).toContain(q);
      }
      
      // All items with 'a' should be visible
      const itemsWithA = megaMenuItems.filter((i) => i.label.includes(q));
      expect(visibleItems.length).toBe(itemsWithA.length);
    });

    it("filtering empty items list returns empty list", () => {
      const visibleItems = filterItemsBySearch([], "test");
      expect(visibleItems.length).toBe(0);
      
      const allVisible = filterItemsBySearch([], "");
      expect(allVisible.length).toBe(0);
    });

    it("property: special characters in query are handled", () => {
      // Generate strings with special characters using array joined
      const specialCharArb = fc.array(
        fc.constantFrom(".", "*", "+", "?", "[", "]", "(", ")", "{", "}", "^", "$", "|", "\\"),
        { minLength: 1, maxLength: 5 }
      ).map((chars) => chars.join(""));
      
      fc.assert(
        fc.property(specialCharArb, (query) => {
          // Should not throw
          const visibleItems = filterItemsBySearch(megaMenuItems, query);
          
          // Results should be valid (may be empty if no matches)
          expect(Array.isArray(visibleItems)).toBe(true);
        }),
        { numRuns: 50 }
      );
    });
  });
});
