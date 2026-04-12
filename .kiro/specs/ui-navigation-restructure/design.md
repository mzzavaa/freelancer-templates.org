# Design Document: UI Navigation Restructure

## Overview

This design document specifies the technical implementation for restructuring the UI and navigation of freelancer-templates.org. The restructure creates a consistent visual design across all landing pages, improves navigation architecture with a streamlined 5-item primary menu, establishes bidirectional cross-linking between templates and themes, and prepares the design system for future color coding.

### Goals

1. **Visual Consistency**: All landing pages use the same hero pattern as the home page
2. **Simplified Navigation**: Reduce primary nav to 5 focused items (Templates, Themes, Design Tips, Studio, Enterprise)
3. **Content Discovery**: Enable bidirectional navigation between templates and themes
4. **New Content Sections**: Create Design Tips hub and Enterprise upselling pages
5. **Improved Mega Menu**: Enhanced search and category organization
6. **Future-Ready**: CSS custom properties for category color coding

### Non-Goals

- Changing the Remotion template rendering system
- Modifying the player or studio functionality
- Redesigning the overall site color scheme
- Adding user authentication or accounts

## Architecture

### High-Level Component Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                        Site Navigation                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Primary Nav: Templates | Themes | Design Tips | Studio │   │
│  │               | Enterprise                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Mega Menus: Templates (grouped + search)               │   │
│  │              Themes (grouped + color swatches)          │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      Landing Pages                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │   Templates  │ │    Themes    │ │  Design Tips │            │
│  │   (library)  │ │   (themes)   │ │    (tips)    │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│  ┌──────────────┐ ┌──────────────┐                             │
│  │    Studio    │ │  Enterprise  │                             │
│  └──────────────┘ └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Shared Components                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │  Hero Section│ │ Content Card │ │Section Header│            │
│  │   (unified)  │ │  (unified)   │ │  (unified)   │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      Site Footer                                │
│  Secondary Nav: Use Cases | Design System | Customize |         │
│                 My Brands                                       │
└─────────────────────────────────────────────────────────────────┘
```

### File Structure Changes

```
layouts/
├── partials/
│   ├── site-nav.html          # Modified: 5 primary items + themes mega menu
│   ├── site-footer.html       # Modified: secondary nav links
│   ├── hero.html              # New: unified hero partial
│   ├── section-header.html    # New: unified section header partial
│   └── content-card.html      # New: unified content card partial
├── library/
│   └── list.html              # Modified: use unified hero
├── themes/
│   ├── list.html              # Modified: use unified hero
│   └── single.html            # Modified: add template cross-links
├── tips/
│   └── list.html              # New: Design Tips hub page
├── enterprise/
│   └── single.html            # New: Enterprise landing page
├── use-cases/
│   └── list.html              # Modified: use unified hero
└── _default/
    └── studio.html            # Modified: use unified hero

data/
├── navgroups.yaml             # Existing: template categories
├── themegroups.yaml           # New: theme navigation groups
└── themes.json                # Existing: theme definitions

assets/css/
└── main.css                   # Modified: unified component styles + CSS custom properties
```

## Components and Interfaces

### 1. Unified Hero Partial (`layouts/partials/hero.html`)

A reusable hero component that accepts parameters for customization while maintaining visual consistency.

**Interface:**
```go-template
{{ partial "hero.html" (dict
  "badge" "Badge Text"
  "badgeIcon" "lucide-icon-name"
  "title" "Page Title with <span class='hl'>highlight</span>"
  "subtitle" "Descriptive subtitle text"
  "ctas" (slice
    (dict "text" "Primary CTA" "href" "/path" "style" "primary" "icon" "icon-name")
    (dict "text" "Secondary CTA" "href" "/path" "style" "outline" "icon" "icon-name")
  )
  "stats" (slice
    (dict "value" "318" "label" "Compositions")
    (dict "value" "42" "label" "Themes")
  )
) }}
```

**HTML Structure:**
```html
<section class="hero">
  <div class="container">
    <div class="hero__content">
      <div class="hero__badge">
        <i data-lucide="{{ .badgeIcon }}"></i>
        {{ .badge }}
      </div>
      <h1 class="hero__title">{{ .title | safeHTML }}</h1>
      <p class="hero__sub">{{ .subtitle }}</p>
      <div class="hero__ctas">
        {{ range .ctas }}
        <a href="{{ .href }}" class="btn btn--{{ .style }} btn--lg">
          {{ if .icon }}<i data-lucide="{{ .icon }}"></i>{{ end }}
          {{ .text }}
        </a>
        {{ end }}
      </div>
      {{ if .stats }}
      <div class="hero__stats">
        {{ range .stats }}
        <div class="hero__stat">
          <div class="hero__stat-val">{{ .value }}</div>
          <div class="hero__stat-lbl">{{ .label }}</div>
        </div>
        {{ end }}
      </div>
      {{ end }}
    </div>
  </div>
</section>
```

### 2. Unified Section Header Partial (`layouts/partials/section-header.html`)

**Interface:**
```go-template
{{ partial "section-header.html" (dict
  "eyebrow" "Section Label"
  "title" "Section Title"
  "subtitle" "Optional subtitle text"
  "centered" true
) }}
```

**HTML Structure:**
```html
<div class="section-hd{{ if .centered }} section-hd--c{{ end }}">
  <div class="eyebrow">{{ .eyebrow }}</div>
  <h2 class="section-title">{{ .title }}</h2>
  {{ if .subtitle }}<p class="section-sub">{{ .subtitle }}</p>{{ end }}
</div>
```

### 3. Unified Content Card Partial (`layouts/partials/content-card.html`)

**Interface:**
```go-template
{{ partial "content-card.html" (dict
  "href" "/library/testimonial/"
  "image" "/previews/showcase/Testimonial-NeonSplit.png"
  "video" "/previews/hero/Testimonial-NeonSplit.mp4"
  "icon" "message-square"
  "title" "Testimonial"
  "description" "Client quotes and social proof"
  "meta" "16 variants"
  "category" "client-work"
) }}
```

**HTML Structure:**
```html
<a href="{{ .href }}" class="content-card{{ if .category }} content-card--{{ .category }}{{ end }}" data-name="{{ lower .title }}">
  <div class="content-card__media">
    <img src="{{ .image }}" alt="{{ .title }} preview" class="content-card__img" loading="lazy">
    {{ if .video }}
    <video class="content-card__vid" muted loop playsinline preload="none">
      <source src="{{ .video }}" type="video/mp4">
    </video>
    {{ end }}
    <div class="content-card__fallback">
      <i data-lucide="{{ .icon }}"></i>
      <span>{{ .title }}</span>
    </div>
    {{ if .meta }}
    <div class="content-card__meta">{{ .meta }}</div>
    {{ end }}
  </div>
  <div class="content-card__body">
    <div class="content-card__icon"><i data-lucide="{{ .icon }}"></i></div>
    <div class="content-card__title">{{ .title }}</div>
    <div class="content-card__desc">{{ .description }}</div>
  </div>
</a>
```

### 4. Navigation Component (`layouts/partials/site-nav.html`)

**Modified Structure:**
```html
<nav class="nav" role="navigation" aria-label="Main navigation">
  <div class="container">
    <div class="nav__inner">
      <a href="/" class="nav__wordmark">freelancer<em>-templates</em></a>

      <ul class="nav__links" role="list">
        <!-- Templates mega-menu (existing, enhanced) -->
        <li class="nav__item nav__item--has-mega">
          <button class="nav__link nav__link--btn" aria-expanded="false" aria-controls="megaTemplates">
            Templates
            <svg class="nav__chevron">...</svg>
          </button>
          <div class="mega" id="megaTemplates">
            <!-- Enhanced with search + grouped categories -->
          </div>
        </li>

        <!-- Themes mega-menu (new) -->
        <li class="nav__item nav__item--has-mega">
          <button class="nav__link nav__link--btn" aria-expanded="false" aria-controls="megaThemes">
            Themes
            <svg class="nav__chevron">...</svg>
          </button>
          <div class="mega mega--themes" id="megaThemes">
            <!-- Theme groups with color swatches -->
          </div>
        </li>

        <!-- Direct links -->
        <li><a href="/tips/" class="nav__link">Design Tips</a></li>
        <li><a href="/studio/" class="nav__link">Studio</a></li>
        <li><a href="/enterprise/" class="nav__link nav__link--cta">Enterprise</a></li>
      </ul>

      <div class="nav__actions">
        <!-- Dark mode toggle + GitHub button -->
      </div>
    </div>
  </div>
</nav>
```

### 5. Themes Mega Menu Structure

**Data File (`data/themegroups.yaml`):**
```yaml
groups:
  - name: "Original"
    key: "original"
    themes:
      - { name: "dark", displayName: "Dark", accent: "#6366f1" }
      - { name: "clean", displayName: "Clean", accent: "#2563eb" }
      - { name: "bold", displayName: "Bold", accent: "#8b5cf6" }
      - { name: "warm", displayName: "Warm", accent: "#f97316" }
      - { name: "minimal", displayName: "Minimal", accent: "#334155" }
      - { name: "neon", displayName: "Neon", accent: "#00ff88" }
      - { name: "lindamohamed", displayName: "Linda Mohamed", accent: "#2E7D32" }

  - name: "Extended"
    key: "extended"
    themes:
      - { name: "ocean", displayName: "Ocean", accent: "#0891b2" }
      - { name: "sunset", displayName: "Sunset", accent: "#f472b6" }
      - { name: "forest", displayName: "Forest", accent: "#16a34a" }
      # ... additional themes

  - name: "European"
    key: "european"
    themes:
      - { name: "corporate", displayName: "Corporate", accent: "#c8a94e" }
      - { name: "industrial", displayName: "Industrial", accent: "#2e8b8b" }
      # ... additional themes

  - name: "Flat"
    key: "flat"
    themes:
      - { name: "materialBlue", displayName: "Material Blue", accent: "#2196f3" }
      - { name: "swiss", displayName: "Swiss", accent: "#000000" }
      # ... additional themes
```

**Mega Menu HTML:**
```html
<div class="mega mega--themes" id="megaThemes">
  <div class="mega__inner container">
    <div class="mega__groups mega__groups--themes">
      {{ range .Site.Data.themegroups.groups }}
      <div class="mega__group">
        <div class="mega__group-hd">{{ .name }}</div>
        <ul class="mega__list mega__list--themes">
          {{ range .themes }}
          <li class="mega__item">
            <a href="/themes/{{ .name }}/" class="mega__link mega__link--theme">
              <span class="mega__swatch" style="background: {{ .accent }};"></span>
              {{ .displayName }}
            </a>
          </li>
          {{ end }}
        </ul>
      </div>
      {{ end }}
    </div>
    <div class="mega__footer">
      <a href="/themes/" class="mega__footer-link">
        View all 42 themes
        <svg>...</svg>
      </a>
    </div>
  </div>
</div>
```

### 6. Cross-Linking Components

**Template Page - Available Themes Section:**
```html
<!-- In layouts/library/single.html -->
<section class="section">
  <div class="container">
    {{ partial "section-header.html" (dict
      "eyebrow" "Available Themes"
      "title" (printf "This template in %d themes" (len .Params.variants))
    ) }}
    
    <div class="theme-grid">
      {{ $variants := .Params.variants }}
      {{ $uniqueStyles := slice }}
      {{ range $variants }}
        {{ if not (in $uniqueStyles .style) }}
          {{ $uniqueStyles = $uniqueStyles | append .style }}
        {{ end }}
      {{ end }}
      
      {{ range $style := $uniqueStyles }}
        {{ $theme := index $.Site.Data.themes.groups.original.themes 0 }}
        <!-- Find theme by name -->
        <a href="/themes/{{ $style }}/" class="theme-link-card">
          <span class="theme-link-card__swatch" style="background: {{ $theme.accent }};"></span>
          <span class="theme-link-card__name">{{ $theme.displayName }}</span>
        </a>
      {{ end }}
    </div>
  </div>
</section>
```

**Theme Page - Templates in Theme Section:**
```html
<!-- In layouts/themes/single.html -->
<section class="section">
  <div class="container">
    {{ partial "section-header.html" (dict
      "eyebrow" "Templates in this Theme"
      "title" (printf "%d templates available" $templateCount)
    ) }}
    
    <div class="content-card-grid">
      {{ $themeName := .Params.name }}
      {{ range $.Site.Data.templates }}
        {{ $hasTheme := false }}
        {{ range .variants }}
          {{ if eq .style $themeName }}{{ $hasTheme = true }}{{ end }}
        {{ end }}
        {{ if $hasTheme }}
          {{ partial "content-card.html" (dict
            "href" (printf "/library/%s/" .slug)
            "image" (printf "/previews/showcase/%s.png" .primaryId)
            "video" (printf "/previews/hero/%s.mp4" .primaryId)
            "icon" .icon
            "title" .name
            "description" .description
            "meta" (printf "%d variants" .variantCount)
          ) }}
        {{ end }}
      {{ end }}
    </div>
  </div>
</section>
```

## Data Models

### Theme Data Structure (existing `data/themes.json`)

The existing theme data structure is sufficient. Each theme contains:
- `name`: URL-safe identifier
- `displayName`: Human-readable name
- `bg`, `accent`, `textPrimary`, etc.: Color values
- `bgIsLight`: Boolean for contrast calculations

### Template Data Structure (existing `data/templates.json`)

The existing template data structure is sufficient. Each template contains:
- `slug`: URL-safe identifier
- `name`: Human-readable name
- `variants`: Array with `id`, `name`, `style` (theme name)
- `variantCount`: Total number of variants

### Navigation Groups Data

**Existing `data/navgroups.yaml`** - Template categories for mega menu (no changes needed)

**New `data/themegroups.yaml`** - Theme categories for themes mega menu (structure shown above)



## Error Handling

### Navigation Errors

1. **Missing Theme Data**: If a theme referenced in a template variant doesn't exist in `themes.json`, display the variant without a theme link
2. **Missing Template Data**: If a template referenced in navigation doesn't exist, hide the navigation item
3. **Image/Video Load Failures**: Content cards display fallback state with icon and title when media fails to load

### Cross-Link Errors

1. **Orphan Themes**: Themes with no templates display a message "No templates currently use this theme"
2. **Orphan Templates**: Templates with no theme variants (shouldn't happen) display without theme section

### Page Not Found

1. **Invalid Theme Slug**: Redirect to `/themes/` with a flash message
2. **Invalid Template Slug**: Redirect to `/library/` with a flash message

## Testing Strategy

### Unit Testing

Since this is primarily a Hugo static site with HTML templates and CSS, traditional unit testing is limited. Instead, we focus on:

1. **Template Rendering Tests**: Verify Hugo templates render without errors
2. **Data Validation**: Ensure data files (JSON/YAML) are valid and complete
3. **Link Validation**: Verify all internal links resolve correctly

### Integration Testing

1. **Visual Regression Testing**: Screenshot comparison of landing pages before/after changes
2. **Navigation Flow Testing**: Verify mega menus open/close correctly
3. **Cross-Link Verification**: Ensure template→theme and theme→template links work bidirectionally

### Manual Testing Checklist

1. **Hero Consistency**
   - [ ] Home page hero renders correctly
   - [ ] Templates landing page uses unified hero
   - [ ] Themes landing page uses unified hero
   - [ ] Design Tips hub uses unified hero
   - [ ] Studio page uses unified hero
   - [ ] Enterprise page uses unified hero

2. **Navigation**
   - [ ] Primary nav shows 5 items: Templates, Themes, Design Tips, Studio, Enterprise
   - [ ] Templates mega menu opens with search and categories
   - [ ] Themes mega menu opens with color swatches
   - [ ] Design Tips links to hub page
   - [ ] Studio links to studio page
   - [ ] Enterprise links to enterprise page
   - [ ] Secondary nav items appear in footer

3. **Cross-Linking**
   - [ ] Template detail pages show "Available Themes" section
   - [ ] Theme detail pages show "Templates in this Theme" section
   - [ ] All cross-links navigate correctly

4. **Content Cards**
   - [ ] Cards display consistently across all sections
   - [ ] Video plays on hover
   - [ ] Fallback displays when media fails
   - [ ] Hover states apply correctly

5. **Responsive Behavior**
   - [ ] Navigation collapses to hamburger on mobile
   - [ ] Mega menus adapt to mobile layout
   - [ ] Content card grids reflow correctly

6. **Accessibility**
   - [ ] Keyboard navigation works for mega menus
   - [ ] ARIA attributes are correct
   - [ ] Focus states are visible
   - [ ] Color contrast meets WCAG AA

---

## CSS Architecture

### CSS Custom Properties for Category Colors

Add to `assets/css/main.css`:

```css
/* ==========================================================================
   Category Color System (Future Color Coding)
   ========================================================================== */
:root {
  /* Category accent colors - can be applied to cards, nav items, badges */
  --cat-client-work:      #f59e0b;  /* amber */
  --cat-content-creation: #8b5cf6;  /* purple */
  --cat-tech-analytics:   #3b82f6;  /* blue */
  --cat-marketing-sales:  #10b981;  /* emerald */
  --cat-community-events: #22c55e;  /* green */
  --cat-ai-explainers:    #06b6d4;  /* cyan */
  --cat-lifestyle:        #f472b6;  /* pink */
  --cat-portfolio-brand:  #6366f1;  /* indigo */
  
  /* Default fallback */
  --cat-default:          var(--accent);
}

/* Category color application */
.content-card--client-work       { --card-accent: var(--cat-client-work); }
.content-card--content-creation  { --card-accent: var(--cat-content-creation); }
.content-card--tech-analytics    { --card-accent: var(--cat-tech-analytics); }
.content-card--marketing-sales   { --card-accent: var(--cat-marketing-sales); }
.content-card--community-events  { --card-accent: var(--cat-community-events); }
.content-card--ai-explainers     { --card-accent: var(--cat-ai-explainers); }
.content-card--lifestyle         { --card-accent: var(--cat-lifestyle); }
.content-card--portfolio-brand   { --card-accent: var(--cat-portfolio-brand); }

/* Optional: Apply category color to card border on hover */
.content-card[class*="content-card--"]:hover {
  border-color: var(--card-accent, var(--accent));
}
```

### Unified Content Card Styles

```css
/* ==========================================================================
   Unified Content Card
   ========================================================================== */
.content-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  overflow: hidden;
  box-shadow: var(--sh);
  transition: border-color .15s, box-shadow .15s, transform .15s;
  display: block;
  text-decoration: none;
}

.content-card:hover {
  border-color: var(--card-accent, var(--accent));
  box-shadow: 0 0 0 3px var(--accent-light), var(--sh-md);
  transform: translateY(-2px);
}

.content-card__media {
  position: relative;
  aspect-ratio: 16/9;
  background: var(--surface-2);
  overflow: hidden;
}

.content-card__img,
.content-card__vid {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content-card__vid {
  opacity: 0;
  transition: opacity .25s;
}

.content-card:hover .content-card__vid {
  opacity: 1;
}

.content-card__fallback {
  position: absolute;
  inset: 0;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--surface-2);
  color: var(--text-muted);
}

.content-card__fallback svg {
  width: 32px;
  height: 32px;
}

.content-card__meta {
  position: absolute;
  bottom: 8px;
  right: 8px;
  padding: 4px 10px;
  background: rgba(0,0,0,0.7);
  border-radius: var(--r-sm);
  font-size: 11px;
  font-weight: 600;
  color: #fff;
}

.content-card__body {
  padding: 16px;
}

.content-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--r-sm);
  background: var(--accent-light);
  color: var(--accent);
  margin-bottom: 12px;
}

.content-card__icon svg {
  width: 16px;
  height: 16px;
}

.content-card__title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
}

.content-card__desc {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
}

/* Content card grid */
.content-card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 1100px) {
  .content-card-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 768px) {
  .content-card-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .content-card-grid { grid-template-columns: 1fr; }
}
```

### Themes Mega Menu Styles

```css
/* ==========================================================================
   Themes Mega Menu
   ========================================================================== */
.mega--themes .mega__groups {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.mega__list--themes {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mega__link--theme {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: var(--r-sm);
  font-size: 13px;
  color: var(--text-muted);
  transition: color .12s, background .12s;
}

.mega__link--theme:hover {
  color: var(--text);
  background: var(--surface-2);
}

.mega__swatch {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  flex-shrink: 0;
  border: 1px solid rgba(0,0,0,0.1);
}

html.dark .mega__swatch {
  border-color: rgba(255,255,255,0.1);
}

@media (max-width: 900px) {
  .mega--themes .mega__groups {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .mega--themes .mega__groups {
    grid-template-columns: 1fr;
  }
}
```

### Theme Cross-Link Card Styles

```css
/* ==========================================================================
   Theme Link Cards (for cross-linking)
   ========================================================================== */
.theme-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.theme-link-card {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-full);
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  transition: border-color .15s, background .15s;
}

.theme-link-card:hover {
  border-color: var(--accent);
  background: var(--accent-light);
}

.theme-link-card__swatch {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

.theme-link-card__name {
  white-space: nowrap;
}
```

---

## New Page Layouts

### Design Tips Hub (`layouts/tips/list.html`)

```html
{{ define "main" }}
{{ partial "site-nav.html" . }}

{{ partial "hero.html" (dict
  "badge" "Design Tips"
  "badgeIcon" "lightbulb"
  "title" "Learn to create <span class='hl'>stunning videos</span>"
  "subtitle" "Tutorials, customization guides, and inspiration to help you get the most out of the template library."
  "ctas" (slice
    (dict "text" "Browse Tutorials" "href" "#tutorials" "style" "primary" "icon" "book-open")
    (dict "text" "View Inspiration" "href" "#inspiration" "style" "outline" "icon" "sparkles")
  )
) }}

<!-- Remotion Tutorials Section -->
<section class="section" id="tutorials">
  <div class="container">
    {{ partial "section-header.html" (dict
      "eyebrow" "Remotion Tutorials"
      "title" "Master the tools"
      "subtitle" "Step-by-step guides for Remotion Studio, CLI rendering, and Lambda deployment."
    ) }}
    
    <div class="content-card-grid">
      <!-- Tutorial cards -->
    </div>
  </div>
</section>

<!-- Template Customization Section -->
<section class="section section--alt" id="customization">
  <div class="container">
    {{ partial "section-header.html" (dict
      "eyebrow" "Template Customization"
      "title" "Make it yours"
      "subtitle" "Learn to edit props, create custom themes, and modify layouts."
    ) }}
    
    <div class="content-card-grid">
      <!-- Customization guide cards -->
    </div>
  </div>
</section>

<!-- Inspiration Gallery Section -->
<section class="section" id="inspiration">
  <div class="container">
    {{ partial "section-header.html" (dict
      "eyebrow" "Inspiration Gallery"
      "title" "See what's possible"
      "subtitle" "Example videos and creative use cases from the community."
    ) }}
    
    <div class="content-card-grid">
      <!-- Inspiration cards -->
    </div>
  </div>
</section>

<!-- Main Projects Section -->
<section class="section section--alt" id="projects">
  <div class="container">
    {{ partial "section-header.html" (dict
      "eyebrow" "Featured Projects"
      "title" "Community highlights"
      "subtitle" "Standout projects and case studies from template users."
    ) }}
    
    <div class="content-card-grid">
      <!-- Project cards -->
    </div>
  </div>
</section>

{{ partial "site-footer.html" . }}
{{ end }}
```

### Enterprise Page (`layouts/enterprise/single.html`)

```html
{{ define "main" }}
{{ partial "site-nav.html" . }}

{{ partial "hero.html" (dict
  "badge" "Enterprise"
  "badgeIcon" "building-2"
  "title" "Commercial licenses for <span class='hl'>agencies and teams</span>"
  "subtitle" "Remove attribution requirements, access premium templates, and get priority support for your business."
  "ctas" (slice
    (dict "text" "View Commercial License" "href" "https://freelancer-automation.com" "style" "primary" "icon" "arrow-up-right")
    (dict "text" "Contact Sales" "href" "mailto:enterprise@freelancer-templates.org" "style" "outline" "icon" "mail")
  )
) }}

<!-- Commercial License Benefits -->
<section class="section">
  <div class="container">
    {{ partial "section-header.html" (dict
      "eyebrow" "License Benefits"
      "title" "What you get with commercial licensing"
    ) }}
    
    <div class="license-grid">
      <!-- Benefit cards similar to existing license section -->
    </div>
  </div>
</section>

<!-- Volume Pricing -->
<section class="section section--alt">
  <div class="container">
    {{ partial "section-header.html" (dict
      "eyebrow" "Volume Pricing"
      "title" "Scales with your team"
      "subtitle" "Flexible pricing for agencies, studios, and enterprise teams."
    ) }}
    
    <!-- Pricing tiers -->
  </div>
</section>

<!-- Custom Development -->
<section class="section">
  <div class="container">
    {{ partial "section-header.html" (dict
      "eyebrow" "Custom Development"
      "title" "Need something unique?"
      "subtitle" "Our team can build custom templates tailored to your brand and workflow."
    ) }}
    
    <!-- Custom dev info -->
  </div>
</section>

<!-- CTA -->
<section class="upsell">
  <div class="container">
    <div class="upsell__inner">
      <h2 class="upsell__title">Ready to upgrade?</h2>
      <p class="upsell__sub">Visit freelancer-automation.com for commercial licensing, premium templates, and enterprise support.</p>
      <a href="https://freelancer-automation.com" target="_blank" rel="noopener" class="btn btn--ghost btn--lg">
        <i data-lucide="arrow-up-right"></i>
        Get Commercial License
      </a>
    </div>
  </div>
</section>

{{ partial "site-footer.html" . }}
{{ end }}
```

---

## Migration Strategy

### Phase 1: Create Shared Partials
1. Create `layouts/partials/hero.html`
2. Create `layouts/partials/section-header.html`
3. Create `layouts/partials/content-card.html`
4. Add unified CSS styles to `main.css`

### Phase 2: Update Navigation
1. Modify `layouts/partials/site-nav.html` with new 5-item structure
2. Create `data/themegroups.yaml`
3. Add themes mega menu
4. Update `layouts/partials/site-footer.html` with secondary nav

### Phase 3: Update Existing Landing Pages
1. Update `layouts/library/list.html` to use unified hero
2. Update `layouts/themes/list.html` to use unified hero
3. Update `layouts/use-cases/list.html` to use unified hero
4. Update `layouts/_default/studio.html` to use unified hero

### Phase 4: Create New Pages
1. Create `layouts/tips/list.html` (Design Tips hub)
2. Create `content/tips/_index.md`
3. Create `layouts/enterprise/single.html`
4. Create `content/enterprise.md`

### Phase 5: Add Cross-Linking
1. Update `layouts/library/single.html` with "Available Themes" section
2. Update `layouts/themes/single.html` with "Templates in this Theme" section

### Phase 6: Testing and Polish
1. Visual regression testing
2. Navigation flow testing
3. Cross-link verification
4. Responsive testing
5. Accessibility audit


---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis, the following properties have been identified as suitable for property-based testing. Note that this feature is primarily UI/template-based, so most acceptance criteria are better suited to example-based tests. However, the cross-linking and filtering behaviors have universal properties that should hold across all data.

### Property 1: Template-Theme Cross-Link Completeness

*For any* template that has variants, the "Available Themes" section on the template detail page SHALL list all unique theme styles present in the template's variants array, with no themes missing and no duplicate entries.

**Validates: Requirements 3.1**

### Property 2: Theme-Template Cross-Link Completeness

*For any* theme, the "Templates in this Theme" section on the theme detail page SHALL list all templates from the templates data that have at least one variant with a style matching the theme name, with no templates missing and no duplicate entries.

**Validates: Requirements 4.1**

### Property 3: Cross-Link Navigation Validity

*For any* cross-link (theme link on a template page or template link on a theme page), clicking the link SHALL navigate to a valid, existing detail page that renders without error.

**Validates: Requirements 3.2, 4.2**

### Property 4: Theme Filter Correctness

*For any* theme filter selection on the Templates landing page, the displayed templates SHALL be exactly the set of templates that have at least one variant with a style matching the selected theme—no more, no less.

**Validates: Requirements 3.4**

### Property 5: Search Filter Correctness

*For any* search query entered in the Templates mega menu, the visible template items SHALL be exactly those whose names contain the search query as a case-insensitive substring, and all non-matching items SHALL be hidden.

**Validates: Requirements 7.3**

### Property 6: Content Card Structural Consistency

*For any* content card rendered on any landing page (Templates, Themes, or Design Tips), the card SHALL contain all required structural elements: media preview area, icon element, title element, description element, and metadata element (variant count or theme count as appropriate).

**Validates: Requirements 3.6, 4.6, 8.1, 8.2**

### Property 7: Grid Layout Consistency

*For any* content card grid on any landing page, the grid SHALL use the same CSS grid configuration: 4 columns at desktop (>1100px), 3 columns at tablet (768-1100px), 2 columns at mobile (480-768px), and 1 column at small mobile (<480px), with consistent 20px gap spacing.

**Validates: Requirements 8.6**

---

## Summary

This design document specifies the complete technical implementation for restructuring the UI and navigation of freelancer-templates.org. The key changes include:

1. **Unified Hero Pattern**: A reusable `hero.html` partial that provides consistent visual design across all landing pages
2. **Streamlined Navigation**: Reduction from 8+ nav items to 5 focused primary items with secondary items moved to footer
3. **Themes Mega Menu**: New mega menu for themes with color swatches and category grouping
4. **Bidirectional Cross-Linking**: Template pages show available themes; theme pages show compatible templates
5. **New Content Sections**: Design Tips hub and Enterprise landing pages
6. **CSS Custom Properties**: Category color system prepared for future color coding
7. **Unified Content Cards**: Consistent card component used across all sections

The implementation follows a phased migration strategy to minimize disruption while ensuring all existing functionality is preserved.
