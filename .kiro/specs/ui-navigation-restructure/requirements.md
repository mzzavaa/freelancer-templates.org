# Requirements Document

## Introduction

This document specifies the requirements for restructuring the UI and navigation of freelancer-templates.org. The goal is to create a consistent visual design across all landing pages (matching the polished home page style), improve the navigation structure and mega menu organization, and establish a clear information architecture that makes content discoverable for both users and the site owner.

The restructure addresses five main content areas: Home (overview), Templates (video compositions), Themes/Designs (visual styles), Design Tips (tutorials and inspiration), and Enterprise (commercial upselling).

## Glossary

- **Landing_Page**: A top-level section page that serves as the entry point for a content category (e.g., Templates list, Themes gallery, Design Tips hub)
- **Hero_Section**: The prominent introductory area at the top of a landing page containing badge, title, subtitle, CTAs, and optional stats
- **Mega_Menu**: An expanded navigation dropdown that displays grouped content with search functionality
- **Template**: A Remotion video composition that can be customized with different themes and props
- **Theme**: A visual style definition (colors, fonts, gradients) that can be applied to any template
- **Design_System**: The shared visual tokens and components used across all templates
- **Preview_Studio**: The Remotion Studio interface for live template preview and customization
- **Cross_Link**: A bidirectional navigation element connecting related content (e.g., template to its available themes)
- **Navigation_Component**: The site-wide navigation bar including logo, menu items, mega menu, and action buttons
- **Content_Card**: A clickable card component displaying a preview, title, and description for a content item
- **Section_Header**: A consistent header pattern with eyebrow text, title, and subtitle used to introduce page sections

## Requirements

### Requirement 1: Consistent Landing Page Design System

**User Story:** As a site visitor, I want all landing pages to have a consistent visual design, so that I can navigate the site with a cohesive experience and recognize I'm on the same website.

#### Acceptance Criteria

1. THE Landing_Page SHALL use the Hero_Section pattern from the home page consisting of: badge with icon, large title with highlight span, subtitle paragraph, dual CTA buttons, and optional stats row
2. WHEN a Landing_Page is rendered, THE Hero_Section SHALL apply the same CSS classes and structure as the home page hero (hero__badge, hero__title with .hl span, hero__sub, hero__ctas, hero__stats)
3. THE Landing_Page for Templates (library/list.html) SHALL replace the current lib-hero class with the standard hero class pattern
4. THE Landing_Page for Themes (themes/list.html) SHALL replace the current ds-hero class with the standard hero class pattern
5. THE Landing_Page for Use Cases (use-cases/list.html) SHALL replace the current uc-header class with the standard hero class pattern
6. THE Landing_Page for Studio (studio.html) SHALL replace the current studio-hero class with the standard hero class pattern
7. THE Landing_Page for Design Tips SHALL use the standard hero class pattern
8. WHEN a Section_Header is rendered on any page, THE Section_Header SHALL use the consistent pattern: eyebrow div, section-title h2, section-sub paragraph

### Requirement 2: Restructured Navigation Architecture

**User Story:** As a site visitor, I want a clear and logical navigation structure, so that I can quickly find the content I'm looking for without confusion.

#### Acceptance Criteria

1. THE Navigation_Component SHALL display exactly five primary navigation items in this order: Templates, Themes, Design Tips, Studio, Enterprise
2. THE Navigation_Component SHALL remove the following items from the primary navigation: Use Cases, Design System, Customize, My Brands
3. WHEN the Templates navigation item is activated, THE Mega_Menu SHALL display template categories grouped by use case with search functionality
4. WHEN the Themes navigation item is activated, THE Mega_Menu SHALL display theme groups (Original, Extended, European, Flat) with visual color swatches
5. THE Design Tips navigation item SHALL link to a hub page containing: Remotion tutorials, template customization guides, inspiration gallery, and main projects showcase
6. THE Studio navigation item SHALL link directly to the Studio page without a dropdown
7. THE Enterprise navigation item SHALL link to a dedicated enterprise/commercial page with upselling content
8. THE Navigation_Component SHALL include a secondary navigation row or footer links for: Use Cases, Design System, Customize, My Brands

### Requirement 3: Templates Section with Theme Cross-Linking

**User Story:** As a site visitor, I want to see all available themes for a template and all templates that support a theme, so that I can explore the full range of customization options.

#### Acceptance Criteria

1. WHEN a template detail page is displayed, THE Template_Page SHALL show a "Available Themes" section listing all themes compatible with that template
2. WHEN a theme is listed on a template page, THE Cross_Link SHALL navigate to the theme detail page
3. THE Templates Landing_Page SHALL display a filter control allowing users to filter templates by theme/style
4. WHEN a user selects a theme filter, THE Templates Landing_Page SHALL display only templates that have variants in that theme
5. THE Template_Page SHALL include a "Preview in Studio" CTA button that links to the Preview_Studio with the template pre-selected
6. FOR ALL templates displayed in the library grid, THE Content_Card SHALL show the variant count and primary theme preview

### Requirement 4: Themes Section with Template Cross-Linking

**User Story:** As a site visitor, I want to browse themes and see which templates are available in each theme, so that I can choose a visual style and find matching templates.

#### Acceptance Criteria

1. WHEN a theme detail page is displayed, THE Theme_Page SHALL show a "Templates in this Theme" section listing all templates available in that theme
2. WHEN a template is listed on a theme page, THE Cross_Link SHALL navigate to the template detail page
3. THE Themes Landing_Page SHALL display themes grouped by category (Original, Extended, European, Flat) with visual previews
4. WHEN a user clicks a theme card, THE Theme_Page SHALL display: color swatches, gradient preview, font information, and a grid of all template variants using that theme
5. THE Theme_Page SHALL include an "Adapt this Theme" section explaining how to customize the theme colors and fonts
6. FOR ALL theme cards on the landing page, THE Content_Card SHALL show the theme name, color palette preview, and template count

### Requirement 5: Design Tips Hub Page

**User Story:** As a site visitor, I want a central hub for learning resources, so that I can find tutorials, inspiration, and guidance on using the templates effectively.

#### Acceptance Criteria

1. THE Design_Tips_Hub SHALL be a new landing page accessible from the primary navigation
2. THE Design_Tips_Hub SHALL contain four content sections: Remotion Tutorials, Template Customization, Inspiration Gallery, Main Projects
3. WHEN the Remotion Tutorials section is displayed, THE Section SHALL list guides on Remotion Studio usage, CLI commands, and Lambda rendering
4. WHEN the Template Customization section is displayed, THE Section SHALL list guides on editing props, creating custom themes, and modifying layouts
5. WHEN the Inspiration Gallery section is displayed, THE Section SHALL showcase example videos and use cases created with the templates
6. WHEN the Main Projects section is displayed, THE Section SHALL highlight featured community projects and case studies
7. THE Design_Tips_Hub SHALL use the standard Landing_Page hero pattern with appropriate badge, title, and CTAs

### Requirement 6: Enterprise Section

**User Story:** As a business decision-maker, I want a dedicated section explaining commercial options, so that I can understand the value proposition for my company.

#### Acceptance Criteria

1. THE Enterprise_Page SHALL be a new landing page accessible from the primary navigation
2. THE Enterprise_Page SHALL use the standard Landing_Page hero pattern with enterprise-focused messaging
3. THE Enterprise_Page SHALL contain sections for: Commercial License Benefits, Volume Pricing, Custom Template Development, Priority Support
4. WHEN the Commercial License Benefits section is displayed, THE Section SHALL explain the differences between CC-BY-NC-SA and commercial licensing
5. THE Enterprise_Page SHALL include prominent CTAs linking to freelancer-automation.com for commercial inquiries
6. THE Enterprise_Page SHALL display social proof elements: client logos, testimonials, or case studies if available
7. IF a visitor navigates from a template page "Need commercial use?" link, THEN THE Enterprise_Page SHALL be the destination

### Requirement 7: Improved Mega Menu Structure

**User Story:** As a site visitor, I want the mega menu to be well-organized and searchable, so that I can quickly find specific templates or themes.

#### Acceptance Criteria

1. THE Mega_Menu for Templates SHALL group templates by category: Client Work, Content Creation, Business, Community & Events
2. THE Mega_Menu for Templates SHALL include a search input that filters templates in real-time as the user types
3. WHEN a search query is entered, THE Mega_Menu SHALL highlight matching template names and hide non-matching items
4. THE Mega_Menu for Themes SHALL display theme groups with small color swatch previews for each theme
5. THE Mega_Menu SHALL include a footer link to the full landing page (e.g., "View all templates" or "View all themes")
6. WHEN the Mega_Menu is open, THE Mega_Menu SHALL close when the user clicks outside or presses Escape
7. THE Mega_Menu SHALL be keyboard accessible with arrow key navigation between items

### Requirement 8: Content Card Consistency

**User Story:** As a site visitor, I want content cards to have a consistent design across all sections, so that I can easily scan and compare items.

#### Acceptance Criteria

1. THE Content_Card component SHALL use a consistent structure across Templates, Themes, and Design Tips sections
2. THE Content_Card SHALL contain: media preview area, icon, title, description, and metadata (variant count, theme count, etc.)
3. WHEN a Content_Card contains video content, THE Content_Card SHALL play the video on hover and pause on mouse leave
4. THE Content_Card SHALL display a fallback state with icon and title when preview media fails to load
5. THE Content_Card hover state SHALL apply consistent elevation, border, or glow effects matching the home page card styles
6. FOR ALL Content_Card grids, THE Grid_Layout SHALL use consistent column counts and gap spacing across all landing pages

### Requirement 9: Secondary Navigation and Footer Links

**User Story:** As a site visitor, I want to access utility pages and secondary content without cluttering the main navigation, so that I can find specialized tools when needed.

#### Acceptance Criteria

1. THE Navigation_Component SHALL include a secondary navigation area or the site footer SHALL contain links to: Use Cases, Design System, Customize, My Brands
2. THE Use Cases link SHALL navigate to the existing use-cases section
3. THE Design System link SHALL navigate to the existing design-system documentation page
4. THE Customize link SHALL navigate to the existing customize page
5. THE My Brands link SHALL navigate to the existing my-brands page
6. WHEN a secondary navigation item corresponds to the current page, THE Link SHALL display an active state indicator

### Requirement 10: Future Color Coding System Preparation

**User Story:** As a site owner, I want the design system to support future color coding for different use cases and personas, so that I can implement visual categorization later.

#### Acceptance Criteria

1. THE Design_System SHALL define CSS custom properties for category colors that can be applied to Content_Cards and navigation items
2. THE Content_Card component SHALL accept an optional category color parameter that applies a colored accent or border
3. THE Mega_Menu groups SHALL support optional color-coded headers or icons per category
4. THE category color definitions SHALL be centralized in a single CSS file or design tokens file for easy future modification
5. WHEN no category color is specified, THE Component SHALL fall back to the default accent color from the current theme
