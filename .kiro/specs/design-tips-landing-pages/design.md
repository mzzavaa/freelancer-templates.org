# Design Document: Design Tips Landing Pages

## Overview

This design document describes the implementation of individual landing pages for the 16 Design Tips content items plus the Video Design Tips page on the freelancer-templates.org Hugo static site. The Tips Overview page (`layouts/tips/list.html`) currently displays 16 tip cards across 4 sections, but all cards link to non-existent pages. This feature creates those landing pages with rich, helpful content.

### Goals

1. Create a reusable `layouts/tips/single.html` template for individual tip pages
2. Create 16 Hugo content files in `content/tips/` for each tip card
3. Create a Video Design Tips content file that uses the existing `video-design-tips.html` layout
4. Ensure consistent navigation, styling, and user experience across all tip pages
5. Provide related content recommendations on each page

### Non-Goals

- Modifying the existing Tips Overview page (`layouts/tips/list.html`)
- Creating new CSS styles (will use existing design system)
- Adding new partials (will reuse existing hero, section-header, content-card partials)
- Implementing search or filtering functionality

## Architecture

### Hugo Content Structure

```
content/
└── tips/
    ├── _index.md                    # Existing list page metadata
    ├── video-design-tips.md         # Video Design Tips (uses special layout)
    ├── remotion-studio-basics.md    # Remotion Tutorials
    ├── cli-rendering.md
    ├── lambda-deployment.md
    ├── composition-structure.md
    ├── editing-props.md             # Template Customization
    ├── custom-themes.md
    ├── layout-modifications.md
    ├── brand-integration.md
    ├── showcase-testimonials.md     # Inspiration Gallery
    ├── showcase-product-launches.md
    ├── showcase-social-content.md
    ├── showcase-educational.md
    ├── project-agency-workflow.md   # Featured Projects
    ├── project-content-creator.md
    ├── project-saas-marketing.md
    └── project-freelancer-portfolio.md
```

### Layout Structure

```
layouts/
└── tips/
    ├── list.html    # Existing - Tips Overview page
    └── single.html  # NEW - Individual tip page template
```

### Page Rendering Flow

```mermaid
flowchart TD
    A[User clicks tip card on /tips/] --> B{URL matches content file?}
    B -->|Yes| C[Hugo loads content/tips/[slug].md]
    C --> D{Check layout param in front matter}
    D -->|video-design-tips| E[Render with layouts/_default/video-design-tips.html]
    D -->|default/none| F[Render with layouts/tips/single.html]
    F --> G[Load hero partial with page metadata]
    G --> H[Render breadcrumb navigation]
    H --> I[Render main content from markdown]
    I --> J[Render related tips section]
    J --> K[Render CTA section]
    K --> L[Load footer partial]
```

## Components and Interfaces

### Single Page Layout Template (`layouts/tips/single.html`)

The single page layout will follow the established patterns from `layouts/use-cases/single.html` and `layouts/themes/single.html`.

#### Template Structure

```html
{{ define "main" }}
{{ partial "site-nav.html" . }}

<!-- Breadcrumb Navigation -->
<section class="tip-header">
  <div class="container">
    <a href="{{ "tips/" | relURL }}" class="tip-back">
      <i data-lucide="arrow-left"></i>
      All Design Tips
    </a>
    <!-- Hero content -->
  </div>
</section>

<!-- Main Content -->
<section class="tip-content">
  <div class="container">
    {{ .Content }}
  </div>
</section>

<!-- Related Tips -->
<section class="section section--alt">
  <div class="container">
    {{ partial "section-header.html" ... }}
    <div class="content-card-grid">
      {{ range .Params.relatedTips }}
        {{ partial "content-card.html" ... }}
      {{ end }}
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="upsell">
  ...
</section>

{{ partial "site-footer.html" . }}
{{ end }}
```

#### Front Matter Interface

Each content file will use this front matter structure:

```yaml
---
title: "Page Title"
description: "Page description for SEO and hero subtitle"
icon: "lucide-icon-name"
category: "tutorials|customization|showcase|projects"
difficulty: "Beginner|Intermediate|Advanced"
relatedTips:
  - slug: "related-tip-slug"
    title: "Related Tip Title"
    description: "Brief description"
    icon: "icon-name"
    meta: "Difficulty or type"
---
```

### Content File Structure

Each markdown content file will follow this structure:

```markdown
---
title: "Tip Title"
description: "Brief description"
icon: "lucide-icon-name"
category: "tutorials"
difficulty: "Beginner"
relatedTips:
  - slug: "cli-rendering"
    title: "CLI Rendering Guide"
    description: "Render videos from the command line"
    icon: "terminal"
    meta: "Intermediate"
---

## Introduction

Opening paragraph explaining what this tip covers.

## Main Content Section

Detailed content with:
- Step-by-step instructions
- Code examples (for tutorials)
- Visual examples (for showcases)
- Best practices

## Additional Sections

More content as needed for the specific tip type.
```

### Category-Specific Content Patterns

#### Remotion Tutorials (4 pages)
- Include code examples with syntax highlighting
- Link to official Remotion documentation
- Step-by-step instructions with numbered lists
- Terminal commands in code blocks

#### Template Customization Guides (4 pages)
- Before/after examples where applicable
- Links to relevant templates
- Practical code snippets
- Tips and best practices callouts

#### Inspiration Gallery Showcases (4 pages)
- Visual examples (placeholder images initially)
- Links to templates used
- Use case descriptions
- Creator attribution where applicable

#### Featured Project Case Studies (4 pages)
- Problem/Solution/Results structure
- Specific metrics or outcomes
- Workflow descriptions
- Tools and templates used

### Video Design Tips Page

The Video Design Tips page will use the existing `layouts/_default/video-design-tips.html` layout by specifying it in the front matter:

```yaml
---
title: "Video Design Tips"
description: "Research-backed principles from broadcast design..."
layout: "video-design-tips"
---
```

This page already has a complete layout with:
- Typography principles (minimum sizes, hierarchy)
- Signal to Noise principles (one idea per scene, negative space)
- Color principles (contrast ratios, accent colors)
- Animation principles (timing, stagger, spring physics)
- Layout principles (F-pattern, card sizing, grid columns)

## Data Models

### Page Front Matter Schema

```typescript
interface TipPageFrontMatter {
  title: string;                    // Page title
  description: string;              // SEO description and hero subtitle
  icon: string;                     // Lucide icon name
  category: 'tutorials' | 'customization' | 'showcase' | 'projects';
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  layout?: string;                  // Optional: override default layout
  relatedTips: RelatedTip[];        // 3-4 related tips
}

interface RelatedTip {
  slug: string;                     // URL slug (e.g., "cli-rendering")
  title: string;                    // Card title
  description: string;              // Card description
  icon: string;                     // Lucide icon name
  meta: string;                     // Badge text (difficulty or type)
}
```

### URL Mapping

| Card Title | URL Path | Content File |
|------------|----------|--------------|
| Remotion Studio Basics | /tips/remotion-studio-basics/ | content/tips/remotion-studio-basics.md |
| CLI Rendering Guide | /tips/cli-rendering/ | content/tips/cli-rendering.md |
| Lambda Deployment | /tips/lambda-deployment/ | content/tips/lambda-deployment.md |
| Composition Structure | /tips/composition-structure/ | content/tips/composition-structure.md |
| Editing Props | /tips/editing-props/ | content/tips/editing-props.md |
| Creating Custom Themes | /tips/custom-themes/ | content/tips/custom-themes.md |
| Layout Modifications | /tips/layout-modifications/ | content/tips/layout-modifications.md |
| Brand Integration | /tips/brand-integration/ | content/tips/brand-integration.md |
| Client Testimonials | /tips/showcase-testimonials/ | content/tips/showcase-testimonials.md |
| Product Launches | /tips/showcase-product-launches/ | content/tips/showcase-product-launches.md |
| Social Media Content | /tips/showcase-social-content/ | content/tips/showcase-social-content.md |
| Educational Content | /tips/showcase-educational/ | content/tips/showcase-educational.md |
| Agency Workflow | /tips/project-agency-workflow/ | content/tips/project-agency-workflow.md |
| Content Creator Setup | /tips/project-content-creator/ | content/tips/project-content-creator.md |
| SaaS Marketing | /tips/project-saas-marketing/ | content/tips/project-saas-marketing.md |
| Freelancer Portfolio | /tips/project-freelancer-portfolio/ | content/tips/project-freelancer-portfolio.md |
| Video Design Tips | /tips/video-design-tips/ | content/tips/video-design-tips.md |



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the acceptance criteria analysis, this feature is primarily about content creation and Hugo template development. Most requirements are either:
- **Content verification** (specific pages contain specific content) - best tested with example-based tests
- **Template structure** (layouts include specific partials) - best tested with smoke tests
- **Build correctness** (Hugo generates expected URLs) - best tested with integration tests

However, there are several universal properties that can be tested across all tip pages:

### Property 1: Content File Structure Validity

*For any* content file in `content/tips/` (excluding `_index.md`), the file SHALL have valid YAML front matter containing at minimum a `title` and `description` field.

**Validates: Requirements 7.2**

### Property 2: Heading Hierarchy Validity

*For any* content file in `content/tips/`, the markdown content SHALL follow proper heading hierarchy where h3 headings only appear after h2 headings, and h4 headings only appear after h3 headings.

**Validates: Requirements 7.4**

### Property 3: Related Tips Rendering

*For any* tip page that defines `relatedTips` in its front matter, the rendered HTML output SHALL contain exactly the number of content cards matching the length of the `relatedTips` array.

**Validates: Requirements 1.4, 8.2**

### Property 4: Back Navigation Presence

*For any* tip page rendered with `layouts/tips/single.html`, the rendered HTML output SHALL contain a link element with href pointing to `/tips/` or the equivalent relative URL.

**Validates: Requirements 1.2, 8.1**

### Property 5: Category-Specific Content Patterns

*For any* tip page with `category: "tutorials"`, the content SHALL contain at least one fenced code block (triple backticks).

*For any* tip page with `category: "projects"`, the content SHALL contain headings or sections for "Problem", "Solution", and "Results" (or equivalent structure).

**Validates: Requirements 2.5, 5.5**

## Error Handling

### Missing Content Files

When a user navigates to a tip URL that doesn't have a corresponding content file:
- Hugo will return a 404 page (standard Hugo behavior)
- No custom error handling required

### Missing Front Matter Fields

When a content file is missing required front matter fields:
- Hugo will use default values or empty strings
- The template should handle missing optional fields gracefully using Hugo's `with` blocks

```html
{{ with .Params.icon }}
  <i data-lucide="{{ . }}"></i>
{{ else }}
  <i data-lucide="file-text"></i>
{{ end }}
```

### Missing Related Tips

When a content file doesn't define `relatedTips`:
- The related tips section should be hidden or show a default set
- Template should check for existence before rendering

```html
{{ if .Params.relatedTips }}
  <!-- Render related tips section -->
{{ end }}
```

### Invalid Category Values

When a content file has an unrecognized category:
- Template should fall back to default styling
- No error should be thrown

### Image Loading Failures

When referenced images fail to load:
- Use the existing `onerror` pattern from `content-card.html` to show fallback content
- Ensure alt text is always provided for accessibility

## Testing Strategy

### Unit Tests (Example-Based)

Unit tests will verify specific content and structure requirements:

1. **Content File Existence Tests**
   - Verify all 17 content files exist in `content/tips/`
   - Verify each file has the correct filename matching the URL slug

2. **Front Matter Validation Tests**
   - Verify each content file has required fields (title, description)
   - Verify category values are valid enum values
   - Verify relatedTips arrays have valid structure

3. **Template Structure Tests**
   - Verify `layouts/tips/single.html` includes hero partial
   - Verify template includes breadcrumb navigation
   - Verify template includes related tips section
   - Verify template includes CTA section

4. **Content-Specific Tests**
   - Verify tutorial pages contain code blocks
   - Verify project pages have problem/solution/results structure
   - Verify Video Design Tips page uses correct layout

### Property-Based Tests

Property tests will verify universal properties across all tip pages:

1. **Content File Structure Property Test**
   - Generate/iterate over all content files in `content/tips/`
   - Verify each has valid YAML front matter with title and description
   - Minimum 100 iterations (will test all 17 files multiple times)
   - Tag: **Feature: design-tips-landing-pages, Property 1: Content file structure validity**

2. **Heading Hierarchy Property Test**
   - Parse markdown content from each file
   - Verify heading levels follow proper hierarchy
   - Tag: **Feature: design-tips-landing-pages, Property 2: Heading hierarchy validity**

3. **Related Tips Rendering Property Test**
   - For each page with relatedTips, build and check HTML output
   - Verify card count matches relatedTips array length
   - Tag: **Feature: design-tips-landing-pages, Property 3: Related tips rendering**

4. **Back Navigation Property Test**
   - For each rendered tip page, check for back link
   - Verify link points to /tips/
   - Tag: **Feature: design-tips-landing-pages, Property 4: Back navigation presence**

5. **Category Content Patterns Property Test**
   - For tutorials: verify code blocks exist
   - For projects: verify problem/solution/results structure
   - Tag: **Feature: design-tips-landing-pages, Property 5: Category-specific content patterns**

### Integration Tests

Integration tests will verify the complete build and navigation:

1. **Hugo Build Test**
   - Run `hugo --quiet` and verify successful build
   - Verify all 17 tip URLs are generated in `public/tips/`

2. **Link Validation Test**
   - Verify all card links on `/tips/` point to existing pages
   - Verify all related tip links point to existing pages

3. **Navigation Flow Test**
   - Verify clicking a card navigates to the correct page
   - Verify back link returns to tips overview

### Test Configuration

- **Test Framework**: Vitest (existing project setup)
- **Test Command**: `npx vitest run`
- **Property Test Iterations**: Minimum 100 per property
- **Build Verification**: `hugo --quiet` must complete without errors

### Test File Structure

```
tests/
└── tips/
    ├── content-files.test.ts      # Unit tests for content file existence and structure
    ├── front-matter.test.ts       # Unit tests for front matter validation
    ├── template-structure.test.ts # Unit tests for layout template
    ├── properties.test.ts         # Property-based tests for universal properties
    └── integration.test.ts        # Integration tests for build and navigation
```
