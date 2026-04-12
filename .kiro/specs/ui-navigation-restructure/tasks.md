# Implementation Plan: UI Navigation Restructure

## Overview

This implementation plan restructures the UI and navigation of freelancer-templates.org following a 6-phase migration strategy. The changes create consistent visual design across all landing pages, streamline navigation to 5 primary items, establish bidirectional cross-linking between templates and themes, and add new Design Tips and Enterprise sections.

The implementation uses Hugo templates (HTML/Go templates) and CSS, following the existing project patterns.

## Tasks

- [x] 1. Create Shared Partials and Unified CSS
  - [x] 1.1 Create unified hero partial (`layouts/partials/hero.html`)
    - Implement reusable hero component accepting badge, badgeIcon, title, subtitle, ctas, and stats parameters
    - Use Go template dict syntax for parameter passing
    - Apply existing hero CSS classes (hero__badge, hero__title, hero__sub, hero__ctas, hero__stats)
    - Support optional stats row with value/label pairs
    - _Requirements: 1.1, 1.2_

  - [x] 1.2 Create section header partial (`layouts/partials/section-header.html`)
    - Implement reusable section header with eyebrow, title, subtitle, and centered parameters
    - Apply existing CSS classes (section-hd, section-hd--c, eyebrow, section-title, section-sub)
    - _Requirements: 1.8_

  - [x] 1.3 Create content card partial (`layouts/partials/content-card.html`)
    - Implement reusable card component with href, image, video, icon, title, description, meta, and category parameters
    - Include video hover play functionality
    - Include fallback state for failed media loads
    - Support optional category color parameter for future color coding
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 1.4 Add unified CSS styles to `assets/css/main.css`
    - Add CSS custom properties for category colors (--cat-client-work, --cat-content-creation, etc.)
    - Add unified content card styles (.content-card, .content-card__media, .content-card__body, etc.)
    - Add content card grid responsive styles (4 columns desktop, 3 tablet, 2 mobile, 1 small mobile)
    - Add theme cross-link card styles (.theme-grid, .theme-link-card)
    - _Requirements: 8.6, 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 2. Checkpoint - Verify shared partials
  - Ensure all partials render without errors by testing with `hugo server`
  - Ask the user if questions arise

- [x] 3. Update Navigation Structure
  - [x] 3.1 Create theme groups data file (`data/themegroups.yaml`)
    - Define four theme groups: Original, Extended, European, Flat
    - Include theme name, displayName, and accent color for each theme
    - Structure to match existing navgroups.yaml pattern
    - _Requirements: 4.3_

  - [x] 3.2 Modify site navigation (`layouts/partials/site-nav.html`)
    - Update primary nav to exactly 5 items: Templates, Themes, Design Tips, Studio, Enterprise
    - Remove Use Cases, Design System, Customize, My Brands from primary nav
    - Keep existing Templates mega menu with search functionality
    - Add Enterprise nav item with nav__link--cta styling
    - _Requirements: 2.1, 2.2, 2.5, 2.6, 2.7_

  - [x] 3.3 Add Themes mega menu to navigation
    - Create new mega menu for Themes nav item
    - Display theme groups (Original, Extended, European, Flat) in 4-column grid
    - Include color swatch preview for each theme using .mega__swatch class
    - Add footer link to full themes gallery
    - _Requirements: 2.4, 7.4, 7.5_

  - [x] 3.4 Add themes mega menu CSS styles
    - Add .mega--themes styles for 4-column theme group layout
    - Add .mega__link--theme styles with swatch display
    - Add .mega__swatch styles for color preview circles
    - Add responsive breakpoints for tablet (2 columns) and mobile (1 column)
    - _Requirements: 7.4_

  - [x] 3.5 Update site footer (`layouts/partials/site-footer.html`)
    - Add secondary navigation links: Use Cases, Design System, Customize, My Brands
    - Ensure links navigate to existing pages
    - Apply active state indicator for current page
    - _Requirements: 2.8, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [x] 4. Checkpoint - Verify navigation changes
  - Test all navigation items link correctly
  - Verify mega menus open/close properly
  - Ensure all tests pass, ask the user if questions arise

- [x] 5. Update Existing Landing Pages to Use Unified Hero
  - [x] 5.1 Update Templates landing page (`layouts/library/list.html`)
    - Replace lib-hero section with unified hero partial
    - Pass appropriate badge ("Full Library"), title, subtitle, and CTAs
    - Include stats row with composition and template type counts
    - Preserve existing template grid and filtering functionality
    - _Requirements: 1.3, 3.3_

  - [x] 5.2 Update Themes landing page (`layouts/themes/list.html`)
    - Replace ds-hero section with unified hero partial
    - Pass appropriate badge ("Theme Gallery"), title, subtitle, and CTAs
    - Preserve existing theme groups display
    - _Requirements: 1.4_

  - [x] 5.3 Update Use Cases landing page (`layouts/use-cases/list.html`)
    - Replace uc-header section with unified hero partial
    - Pass appropriate badge, title, subtitle, and CTAs
    - Preserve existing use case cards
    - _Requirements: 1.5_

  - [x] 5.4 Update Studio page (`layouts/_default/studio.html`)
    - Replace studio-hero section with unified hero partial
    - Pass appropriate badge ("Preview Studio"), title, subtitle, and CTAs
    - Preserve existing studio functionality
    - _Requirements: 1.6_

- [x] 6. Checkpoint - Verify landing page updates
  - Visually compare updated pages to home page hero style
  - Ensure all tests pass, ask the user if questions arise

- [x] 7. Create New Pages
  - [x] 7.1 Create Design Tips hub layout (`layouts/tips/list.html`)
    - Use unified hero partial with "Design Tips" badge and appropriate messaging
    - Create four content sections: Remotion Tutorials, Template Customization, Inspiration Gallery, Main Projects
    - Use section-header partial for each section
    - Use content-card-grid for tutorial and guide cards
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [x] 7.2 Create Design Tips content file (`content/tips/_index.md`)
    - Add front matter with title and description
    - Configure as list page for tips section
    - _Requirements: 5.1_

  - [x] 7.3 Create Enterprise page layout (`layouts/enterprise/single.html`)
    - Use unified hero partial with "Enterprise" badge and commercial-focused messaging
    - Create sections: Commercial License Benefits, Volume Pricing, Custom Template Development
    - Include prominent CTAs linking to freelancer-automation.com
    - Add upsell section at bottom
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.7_

  - [x] 7.4 Create Enterprise content file (`content/enterprise.md`)
    - Add front matter with title, description, and layout
    - Configure as single page
    - _Requirements: 6.1_

- [x] 8. Checkpoint - Verify new pages
  - Test Design Tips hub renders correctly with all sections
  - Test Enterprise page renders correctly with CTAs
  - Ensure all tests pass, ask the user if questions arise

- [x] 9. Add Cross-Linking Between Templates and Themes
  - [x] 9.1 Update template detail page (`layouts/library/single.html`)
    - Add "Available Themes" section after main content
    - Extract unique theme styles from template variants
    - Display theme link cards with color swatches
    - Link each theme to its detail page
    - Add "Preview in Studio" CTA button
    - _Requirements: 3.1, 3.2, 3.5_

  - [x] 9.2 Update theme detail page (`layouts/themes/single.html`)
    - Add "Templates in this Theme" section
    - Query all templates that have variants matching the theme name
    - Display templates using content-card partial
    - Add "Adapt this Theme" section explaining customization
    - _Requirements: 4.1, 4.2, 4.4, 4.5_

  - [x] 9.3 Write property test for template-theme cross-link completeness
    - **Property 1: Template-Theme Cross-Link Completeness**
    - Verify all unique theme styles from variants are listed in Available Themes section
    - Verify no duplicate themes are displayed
    - **Validates: Requirements 3.1**

  - [x] 9.4 Write property test for theme-template cross-link completeness
    - **Property 2: Theme-Template Cross-Link Completeness**
    - Verify all templates with matching variants are listed in Templates in this Theme section
    - Verify no duplicate templates are displayed
    - **Validates: Requirements 4.1**

  - [x] 9.5 Write property test for cross-link navigation validity
    - **Property 3: Cross-Link Navigation Validity**
    - Verify all cross-links navigate to valid, existing detail pages
    - Verify linked pages render without error
    - **Validates: Requirements 3.2, 4.2**

- [x] 10. Add Template Filtering by Theme
  - [x] 10.1 Add theme filter controls to Templates landing page
    - Add filter buttons for each theme style (dark, clean, bold, warm, minimal, neon, lindamohamed)
    - Style filter buttons consistently with existing lib-sf buttons
    - _Requirements: 3.3_

  - [x] 10.2 Implement theme filter JavaScript functionality
    - Filter template cards based on selected theme
    - Show only templates that have variants in the selected theme
    - Update preview images to show matching style variant
    - _Requirements: 3.4_

  - [x] 10.3 Write property test for theme filter correctness
    - **Property 4: Theme Filter Correctness**
    - Verify displayed templates exactly match those with variants in selected theme
    - Verify no templates are incorrectly shown or hidden
    - **Validates: Requirements 3.4**

- [x] 11. Enhance Mega Menu Search
  - [x] 11.1 Verify existing search functionality in Templates mega menu
    - Confirm search input filters templates in real-time
    - Confirm matching items are highlighted and non-matching items are hidden
    - _Requirements: 7.2, 7.3_

  - [x] 11.2 Write property test for search filter correctness
    - **Property 5: Search Filter Correctness**
    - Verify visible items exactly match case-insensitive substring search
    - Verify all non-matching items are hidden
    - **Validates: Requirements 7.3**

- [x] 12. Checkpoint - Verify cross-linking and filtering
  - Test template→theme links navigate correctly
  - Test theme→template links navigate correctly
  - Test theme filter shows correct templates
  - Ensure all tests pass, ask the user if questions arise

- [x] 13. Testing and Polish
  - [x] 13.1 Visual regression testing
    - Compare all landing pages to ensure consistent hero styling
    - Verify content cards display consistently across sections
    - Check hover states and animations work correctly
    - _Requirements: 1.1, 1.2, 8.5_

  - [x] 13.2 Navigation flow testing
    - Verify all 5 primary nav items link correctly
    - Test Templates mega menu opens with search and categories
    - Test Themes mega menu opens with color swatches
    - Verify mega menus close on outside click and Escape key
    - _Requirements: 2.1, 2.3, 2.4, 7.6_

  - [x] 13.3 Cross-link verification
    - Verify all template→theme links work bidirectionally
    - Verify all theme→template links work bidirectionally
    - Test "Preview in Studio" CTA links correctly
    - _Requirements: 3.1, 3.2, 4.1, 4.2_

  - [x] 13.4 Responsive testing
    - Test navigation collapses to hamburger on mobile
    - Test mega menus adapt to mobile layout
    - Test content card grids reflow correctly at all breakpoints
    - _Requirements: 8.6_

  - [x] 13.5 Accessibility audit
    - Verify keyboard navigation works for mega menus
    - Verify ARIA attributes are correct (aria-expanded, aria-controls)
    - Verify focus states are visible
    - Verify color contrast meets WCAG AA
    - _Requirements: 7.7_

  - [x] 13.6 Write property test for content card structural consistency
    - **Property 6: Content Card Structural Consistency**
    - Verify all content cards contain required elements: media, icon, title, description, metadata
    - **Validates: Requirements 3.6, 4.6, 8.1, 8.2**

  - [x] 13.7 Write property test for grid layout consistency
    - **Property 7: Grid Layout Consistency**
    - Verify all grids use consistent column counts at each breakpoint
    - Verify consistent 20px gap spacing
    - **Validates: Requirements 8.6**

- [x] 14. Final checkpoint - Complete verification
  - Run full site build with `hugo`
  - Verify no build errors or warnings
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional property-based tests that can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation after each major phase
- The implementation follows the 6-phase migration strategy from the design document
- All changes use Hugo templates (HTML/Go templates) and CSS following existing project patterns
- Property tests validate universal correctness properties for cross-linking and filtering behaviors
