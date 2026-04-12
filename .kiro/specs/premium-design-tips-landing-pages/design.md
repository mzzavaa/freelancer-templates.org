# Design Document: Premium Design Tips Landing Pages

## Overview

This design transforms the Design Tips section into premium landing pages by creating a reusable Hugo layout system. The architecture generalizes the existing `video-design-tips.html` layout into a data-driven template that renders rich, numbered-section pages from front matter configuration.

The system consists of:
1. **A single reusable layout** (`premium-tips.html`) that renders any premium landing page
2. **Reusable partials** for hero sections, numbered sections, and content cards
3. **Front matter schema** for configuring page content without modifying templates
4. **CSS extensions** to the existing tips styling system
5. **Remotion video integration** for hero section video players

This approach enables iterative implementation—pages can be built one at a time by adding content files with the appropriate front matter, while the layout system handles all rendering logic.

## Architecture

### High-Level Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Hugo Build Pipeline                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  content/tips/*.md          layouts/tips/              layouts/partials/ │
│  ┌──────────────────┐      ┌──────────────────┐      ┌────────────────┐ │
│  │ Front Matter     │──────│ premium-tips.html│──────│ tips-hero.html │ │
│  │ - hero config    │      │ (main layout)    │      │ tips-section   │ │
│  │ - sections[]     │      │                  │      │ tips-card.html │ │
│  │ - cards[]        │      │                  │      │ tips-cta.html  │ │
│  │ - cta config     │      └──────────────────┘      └────────────────┘ │
│  └──────────────────┘                                                    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Generated HTML Output                            │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ Hero Section (tips-hero partial)                                 │    │
│  │ - Category badge + icon                                          │    │
│  │ - Headline + description                                         │    │
│  │ - Topic tags                                                     │    │
│  │ - Embedded Remotion video player (optional)                      │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ Numbered Section 01 (tips-section partial)                       │    │
│  │ ┌─────────┐ ┌─────────────────────────────────────────────────┐ │    │
│  │ │   01    │ │ Section Title + Description                     │ │    │
│  │ └─────────┘ └─────────────────────────────────────────────────┘ │    │
│  │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                 │    │
│  │ │ Card (rule) │ │ Card (tip)  │ │ Card (ex)   │                 │    │
│  │ └─────────────┘ └─────────────┘ └─────────────┘                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ Numbered Section 02 (alternating background)                     │    │
│  │ ...                                                              │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ CTA Section (tips-cta partial)                                   │    │
│  │ - Title + description                                            │    │
│  │ - Action buttons                                                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Content File    │────▶│  Hugo Template   │────▶│  HTML Output     │
│  (front matter)  │     │  (layout logic)  │     │  (rendered page) │
└──────────────────┘     └──────────────────┘     └──────────────────┘
        │                        │                        │
        │                        │                        │
        ▼                        ▼                        ▼
   Page-specific           Reusable across          Consistent visual
   content config          all 17 pages             design system
```

## Components and Interfaces

### 1. Premium Tips Layout (`layouts/tips/premium-tips.html`)

The main layout template that orchestrates rendering of all page components.

**Responsibilities:**
- Include site navigation and footer
- Render hero section via partial
- Iterate over sections array and render each via partial
- Apply alternating backgrounds to sections
- Render CTA section via partial
- Handle graceful degradation for missing data

**Interface (expected front matter):**
```yaml
layout: "premium-tips"
hero:
  category: "Remotion Tutorials"
  icon: "monitor-play"
  title: "Master Remotion Studio"
  description: "Step-by-step guide to..."
  tags: ["Interface", "Preview", "Props"]
  video: "remotion-studio-intro"  # optional
sections:
  - title: "Interface Navigation"
    description: "Learn the Studio panels..."
    columns: 3
    cards: [...]
cta:
  title: "Ready to start?"
  description: "Browse templates..."
  buttons: [...]
```

### 2. Tips Hero Partial (`layouts/partials/tips-hero.html`)

Renders the hero section with optional video player.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | string | yes | Category label (e.g., "Remotion Tutorials") |
| icon | string | yes | Lucide icon name |
| title | string | yes | Main headline |
| description | string | yes | Subtitle/description |
| tags | []string | no | Topic tags array |
| video | string | no | Remotion composition ID |
| breadcrumb | string | no | Parent page title for breadcrumb |

**Rendering Logic:**
1. Render breadcrumb navigation if provided
2. Render category badge with icon
3. Render title and description
4. Render topic tags if provided
5. If video is specified, render Remotion player embed
6. If video is not specified, render without video section

### 3. Tips Section Partial (`layouts/partials/tips-section.html`)

Renders a numbered content section with card grid.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| number | int | yes | Section number (01, 02, etc.) |
| title | string | yes | Section title |
| description | string | yes | Section description |
| columns | int | no | Grid columns (2 or 3, default 2) |
| cards | []Card | yes | Array of card objects |
| alt | bool | no | Use alternate background |

**Card Object Structure:**
```yaml
- type: "rule"           # rule, example, tip, or default
  title: "Card title"
  body: "Card content..."
  source: "Citation..."  # optional, for rule cards
  list:                  # optional bullet list
    - "Item one"
    - "Item two"
  table:                 # optional table data
    headers: ["Name", "Size", "Use"]
    rows:
      - ["hero", "72px", "Headlines"]
```

### 4. Tips Card Partial (`layouts/partials/tips-card.html`)

Renders individual content cards with type-specific styling.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | no | Card type: rule, example, tip, default |
| title | string | yes | Card title |
| body | string | yes | Card body content |
| source | string | no | Source citation (rule cards) |
| list | []string | no | Bullet list items |
| table | object | no | Table with headers and rows |

**Type-Specific Rendering:**
- `rule`: Blue accent border, "Rule" badge, source citation at bottom
- `example`: Dark background, "This project" badge
- `tip`: Default styling, "Tip" badge
- `default`: No badge, standard styling

### 5. Tips CTA Partial (`layouts/partials/tips-cta.html`)

Renders the call-to-action section at page bottom.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| title | string | yes | CTA headline |
| description | string | yes | CTA description |
| buttons | []Button | yes | Action buttons array |

**Button Object:**
```yaml
- text: "Browse Templates"
  href: "/library/"
  style: "primary"    # primary or outline
  icon: "grid"        # optional Lucide icon
```

### 6. Video Player Component

For hero video integration, we'll use a simple iframe-based approach that loads pre-rendered videos or a lightweight Remotion player.

**Implementation Options:**
1. **Pre-rendered MP4**: Store rendered videos in `/static/videos/tips/` and use HTML5 video element
2. **Remotion Player**: Embed the Remotion player component for interactive playback
3. **Poster + Link**: Show poster image with link to full video (fallback)

**Recommended Approach:** Pre-rendered MP4 with poster frame for performance, with optional Remotion player for interactive demos.

## Data Models

### Front Matter Schema

```yaml
# Full schema for premium tips pages
---
title: "Page Title"                    # Required: Page title
description: "Page description"        # Required: Meta description
layout: "premium-tips"                 # Required: Use premium layout

# Hero Section Configuration
hero:
  category: "Category Name"            # Required: Category label
  icon: "lucide-icon-name"             # Required: Lucide icon
  title: "Hero Headline"               # Required: Main title
  description: "Hero description"      # Required: Subtitle
  tags:                                # Optional: Topic tags
    - "Tag One"
    - "Tag Two"
  video: "composition-id"              # Optional: Remotion composition
  videoFallback: "/images/poster.png"  # Optional: Fallback image

# Numbered Sections
sections:
  - number: 1                          # Optional: Explicit number (auto-increments)
    title: "Section Title"             # Required: Section heading
    description: "Section desc"        # Required: Section description
    columns: 3                         # Optional: 2 or 3 (default: 2)
    alt: false                         # Optional: Alternate background
    cards:
      - type: "rule"                   # Optional: rule, example, tip, default
        title: "Card Title"            # Required: Card heading
        body: "Card content"           # Required: Card body text
        source: "Citation"             # Optional: Source for rules
        list:                          # Optional: Bullet points
          - "Point one"
          - "Point two"
        table:                         # Optional: Data table
          headers: ["Col1", "Col2"]
          rows:
            - ["Val1", "Val2"]

# CTA Section
cta:
  title: "CTA Headline"                # Required: CTA title
  description: "CTA description"       # Required: CTA text
  buttons:
    - text: "Button Text"              # Required: Button label
      href: "/path/"                   # Required: Button link
      style: "primary"                 # Required: primary or outline
      icon: "icon-name"                # Optional: Lucide icon

# Related Tips (optional)
relatedTips:
  - slug: "page-slug"
    title: "Related Page"
    description: "Brief description"
    icon: "icon-name"
---
```

### Category Configuration

Each of the 5 categories has consistent styling:

| Category | Icon | Color Accent |
|----------|------|--------------|
| Remotion Tutorials | monitor-play | Blue (#4a90d9) |
| Template Customization | sliders | Purple (#8b5cf6) |
| Inspiration Gallery | sparkles | Amber (#f59e0b) |
| Featured Projects | briefcase | Green (#10b981) |
| Design Principles | lightbulb | Blue (#4a90d9) |

### Page Inventory

| Page Slug | Category | Sections | Priority |
|-----------|----------|----------|----------|
| remotion-studio-basics | Remotion Tutorials | 5 | High |
| cli-rendering | Remotion Tutorials | 5 | High |
| lambda-deployment | Remotion Tutorials | 5 | Medium |
| composition-structure | Remotion Tutorials | 5 | High |
| editing-props | Template Customization | 5 | High |
| custom-themes | Template Customization | 5 | Medium |
| layout-modifications | Template Customization | 5 | Medium |
| brand-integration | Template Customization | 5 | High |
| showcase-testimonials | Inspiration Gallery | 5 | Medium |
| showcase-product-launches | Inspiration Gallery | 5 | Medium |
| showcase-social-content | Inspiration Gallery | 5 | Medium |
| showcase-educational | Inspiration Gallery | 5 | Medium |
| project-agency-workflow | Featured Projects | 5 | Low |
| project-content-creator | Featured Projects | 5 | Low |
| project-saas-marketing | Featured Projects | 5 | Low |
| project-freelancer-portfolio | Featured Projects | 5 | Low |
| video-design-tips | Design Principles | 5 | Done (reference) |

## Error Handling

### Graceful Degradation Strategy

The layout system handles missing or incomplete data gracefully:

1. **Missing Hero Video**
   - If `hero.video` is not specified, render hero without video section
   - If video file doesn't exist, show `hero.videoFallback` image
   - If neither exists, render hero with text content only

2. **Missing Sections**
   - If `sections` array is empty or missing, render only hero and CTA
   - Allows incremental content building

3. **Missing Cards**
   - If a section has no cards, render section header only
   - Log warning in Hugo build output

4. **Missing CTA**
   - If `cta` is not specified, use default CTA configuration
   - Default: "Browse Templates" linking to `/library/`

5. **Invalid Card Types**
   - Unknown card types render as `default` type
   - No badge, standard styling

### Validation Warnings

Hugo build should output warnings for:
- Pages using `premium-tips` layout without required hero fields
- Sections without any cards
- Cards without title or body
- Invalid column counts (not 2 or 3)

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

**Note on PBT Applicability:** This feature involves Hugo template rendering and HTML output generation. While traditional property-based testing with random input generation is less applicable to template systems, we can define properties that validate the relationship between front matter configuration and rendered output. These properties can be tested using parameterized tests with varied configurations.

### Property 1: Section Rendering Preserves Configuration

*For any* valid sections array in front matter, the rendered HTML SHALL contain exactly that many numbered sections, each with the correct number badge, title, and description matching the configuration.

**Validates: Requirements 1.2, 8.2**

### Property 2: Alternating Section Backgrounds

*For any* sequence of N sections, sections at odd indices (1, 3, 5...) SHALL have the alternate background class applied, and sections at even indices (0, 2, 4...) SHALL have the normal background.

**Validates: Requirements 1.3**

### Property 3: Card Content Rendering

*For any* card configuration containing optional fields (source, list, table), the rendered card HTML SHALL include all specified content:
- If source is specified, a citation element appears
- If list is specified, all list items render as bullet points
- If table is specified, table renders with matching headers and row count

**Validates: Requirements 2.5, 2.6, 2.7**

### Property 4: Grid Column Configuration

*For any* section with columns value of 2 or 3, the rendered section SHALL have the corresponding grid class (`tips-grid--2` or `tips-grid--3`).

**Validates: Requirements 2.8**

### Property 5: CTA Button Rendering

*For any* CTA configuration with a buttons array, the rendered CTA section SHALL contain exactly that many buttons, each with matching text, href, and style class.

**Validates: Requirements 1.4, 8.4**

### Property 6: Breadcrumb Title Inclusion

*For any* page with a title, the rendered breadcrumb navigation SHALL contain the text "Tips" and the page title.

**Validates: Requirements 1.6**

### Property 7: Video Graceful Degradation

*For any* hero configuration:
- If video is specified and exists, video player renders
- If video is specified but doesn't exist, fallback image renders
- If video is not specified, no video player element appears

**Validates: Requirements 3.6, 12.5**

### Property 8: Partial Data Graceful Degradation

*For any* page configuration with missing optional fields (sections, cta, relatedTips), the page SHALL render without errors, displaying only the components that have configuration.

**Validates: Requirements 12.1, 12.2**

### Property 9: Related Tips Rendering

*For any* relatedTips array in front matter, the rendered page SHALL contain a related tips section with exactly that many linked cards, each with matching slug, title, and description.

**Validates: Requirements 10.2**

## Testing Strategy

### Dual Testing Approach

This feature uses a combination of:
- **Property tests**: Validate universal properties across varied configurations
- **Example tests**: Verify specific scenarios and edge cases
- **Integration tests**: Validate end-to-end rendering and navigation

### Property-Based Testing Implementation

Since Hugo templates don't support traditional PBT libraries, we implement property tests as parameterized tests using a test harness:

1. **Test Harness**: A Node.js script that:
   - Generates varied front matter configurations
   - Runs Hugo build for each configuration
   - Parses output HTML and validates properties
   - Reports failures with specific configuration that caused them

2. **Configuration Generators**:
   - `generateSections(n)`: Creates n sections with varied content
   - `generateCards(n, types)`: Creates n cards with specified types
   - `generateCTA(buttonCount)`: Creates CTA with n buttons
   - `generateHero(withVideo)`: Creates hero with/without video

3. **Property Validators**:
   - `validateSectionCount(html, expected)`: Counts section elements
   - `validateAlternatingBg(html)`: Checks CSS classes on sections
   - `validateCardContent(html, config)`: Verifies card elements match config
   - `validateBreadcrumb(html, title)`: Checks breadcrumb text

### Test Configuration

```javascript
// Property test configuration
const PROPERTY_TEST_ITERATIONS = 100;
const SECTION_COUNT_RANGE = [0, 10];
const CARD_COUNT_RANGE = [0, 8];
const BUTTON_COUNT_RANGE = [1, 4];
```

### Unit Testing Approach

Since this is a Hugo static site with HTML templates, traditional unit testing doesn't apply. Instead, we use:

1. **Build Verification Tests**
   - Hugo build completes without errors
   - All 17 pages generate successfully
   - No broken internal links

2. **Visual Regression Tests**
   - Screenshot comparison of rendered pages
   - Verify responsive breakpoints render correctly
   - Compare against video-design-tips reference

3. **Content Validation Tests**
   - Front matter schema validation
   - Required fields present
   - Valid icon names
   - Valid href paths

4. **Accessibility Tests**
   - WCAG 2.1 AA compliance
   - Proper heading hierarchy
   - Color contrast ratios
   - Keyboard navigation

### Manual Testing Checklist

For each page:
- [ ] Hero section renders correctly
- [ ] All numbered sections display
- [ ] Cards show correct type styling
- [ ] Tables render properly
- [ ] Lists display correctly
- [ ] CTA buttons work
- [ ] Responsive at 320px, 768px, 1024px, 1440px
- [ ] Dark mode styling correct
- [ ] Video player loads (if applicable)
- [ ] Breadcrumb navigation works
- [ ] Related tips links work

### Integration Testing

1. **Navigation Flow**
   - Tips list page links to all premium pages
   - Breadcrumbs navigate back correctly
   - Related tips cross-link properly

2. **Video Integration**
   - Remotion compositions load
   - Fallback images display when video unavailable
   - Player controls function

3. **Build Performance**
   - Hugo build time acceptable (<30s)
   - Generated HTML size reasonable
   - No duplicate CSS/JS

### Test Data

Create a test page (`content/tips/_test-premium.md`) with:
- All card types (rule, example, tip, default)
- Tables and lists
- 2-column and 3-column sections
- Video and non-video hero variants
- All CTA button styles

This test page validates the complete layout system without affecting production content.
