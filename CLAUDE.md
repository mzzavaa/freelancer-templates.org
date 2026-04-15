# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Local dev server with live reload
hugo server

# Build for production (output → public/)
hugo --gc --minify

# Build and serve with drafts
hugo server -D
```

Deploy is automatic via GitHub Actions on push to `main` - no manual deploy step.

## Configuration principles (never hardcode)

These rules apply to ALL future work. Violations must be fixed on sight.

1. **Never hardcode counts, lists, or connections.** Hugo templates must compute everything dynamically — `{{ len .Site.Pages }}`, `{{ range .Params.variants }}`, etc. No literal "22 themes" or "80 templates" anywhere. Grep for any remaining hardcoded numbers and remove them.

2. **All themes must be applicable to all compositions.** `src/remotion/templates/_shared/themes.ts` is the single source of truth for the theme list. When a composition wraps content in a `Themed` component, it must accept a `theme` prop and use ONLY theme tokens — never hardcoded colors. Audit all compositions for hardcoded colors and replace with theme tokens.

3. **Every composition auto-generates one variant per theme.** `src/remotion/Root.tsx` (or a helper) must iterate through ALL themes × ALL compositions automatically via a loop. Adding a theme gives every composition it for free. Adding a composition gives every theme to it for free. Never hand-pick a subset.

4. **Preview assets auto-generate on local builds.** `scripts/generate-missing-previews.mjs` diffs composition IDs against files in `static/previews/showcase/*.png` and `static/previews/hero/*.mp4`, then renders only the missing ones via `npx remotion still` / `npx remotion render`. Wired as `predev` and `prebuild` npm scripts so both `npm run dev` and `npm run build` trigger it automatically.

5. **Content files auto-link to their Remotion composition.** `scripts/verify-links.mjs` fails the build if any `content/library/*.md` references a non-existent composition ID, or any composition ID in Root.tsx has no matching content file.

6. **Nav is derived from content, not hand-written.** The library dropdown must group entries by the `category` frontmatter field on each content file. No hand-listed template names in layout files — only `range` loops over `.Site.Pages`.

## Architecture

Hugo static site with content collections, multiple layout types, and a data-driven library.

**Key files:**
- `layouts/_default/baseof.html` - base HTML shell (fonts, CSS, JS)
- `layouts/index.html` - homepage
- `layouts/library/list.html` - `/library/` grid of all template types
- `layouts/library/single.html` - individual template type page (variants grid + detail drawer + how-to)
- `layouts/_default/studio.html` - Remotion Studio setup guide
- `layouts/_default/tips.html` - Video design tips landing page
- `layouts/partials/site-nav.html` - shared nav (add new pages here)
- `assets/css/main.css` - all styles, dark mode via `.dark` class on `<html>`
- `assets/js/main.js` - dark mode toggle, mobile nav, lucide icon init

**Content and data:**
- `content/library/*.md` - one file per template type (80 files). Each has: `title`, `description`, `slug`, `icon`, `primaryId`, `variantCount`, `variants[]` (id + name + style per variant)
- `data/templates.json` - flat lookup used by the style-switcher JS on the list page
- `data/molecules.json` - component library molecules

**Static assets:**
- `static/previews/showcase/*.png` - 1x showcase PNGs, named by composition ID (e.g. `Testimonial-NeonSplit.png`)
- `static/previews/hero/*.mp4` - short hover preview MP4s, named by composition ID
- `static/previews/molecules/` - per-molecule per-theme PNGs

## Critical: primaryId field

Every `content/library/*.md` file MUST have a `primaryId` field that is the exact Remotion composition ID. This is used directly in image/video paths:

```html
<img src="previews/showcase/{{ .Params.primaryId }}.png">
<video><source src="previews/hero/{{ .Params.primaryId }}.mp4"></video>
```

Do NOT derive the path from `camel` + `primaryVariant` - composition IDs do not follow a consistent formula. Always use `primaryId` explicitly.

## Adding a new template type

1. Create `content/library/<slug>.md` with all required frontmatter fields
2. Add a `primaryId` matching an actual Remotion composition ID in the Remotion project
3. Add a `previews/showcase/<primaryId>.png` and `previews/hero/<primaryId>.mp4` to `static/`
4. Add an entry to `data/templates.json` so the style-switcher works on the list page
5. Hugo will auto-generate the library listing and single page - no layout changes needed

## Hugo template notes

- `baseURL` is always `"/"` in `config.toml`. Never hardcode the domain. The actual URL is injected at build time by GitHub Actions via `--baseURL`. Hardcoding causes fingerprinted assets to 404.
- Icons use `lucide.js` loaded from unpkg. All `<i data-lucide="...">` are replaced at runtime - never use emoji as icon substitutes.
- Hugo's `resources.Get | minify | fingerprint` handles CSS/JS in baseof.html. Never reference raw `assets/` paths in HTML.

## JavaScript: XSS safety

All JS in layout files must use DOM APIs for untrusted data, not `innerHTML`. Data from `card.dataset.*` (which comes from Hugo-rendered data attributes) is technically server-controlled, but the security hook will still flag `innerHTML` with concatenated strings. Use `textContent` and `createElement`/`appendChild` for all content derived from page data.

## Design system (Remotion project - freelance-automation-animation-video)

These guidelines apply to the Remotion compositions at `src/remotion/templates/`. The single source of truth for visual tokens is `_shared/layouts.ts` (TYPE scale) and `_shared/DesignTokens.ts` (SPACE, RADIUS, DUR, ALPHA, Z).

### Typography scale (TYPE in layouts.ts)

Calibrated for 1280x720. Broadcast minimum = 2% of frame height = ~24px. Never go below `TYPE.caption`.

| Token | Value | Use |
|---|---|---|
| hero | 72px | One main headline per composition |
| title | 52px | Section titles |
| subtitle | 38px | Supporting/secondary lines |
| stat | 60px | Large CountUp numbers |
| cardTitle | 36px | Card headings |
| body | 32px | All body copy (minimum for readable text) |
| label | 26px | Badges, tags, small labels |
| caption | 24px | Absolute minimum - timestamps, fine print |

**Why these sizes:** At 1280x720, text below 24px becomes illegible when video is compressed (H.264 blurs low-contrast edges). At 32px, body text is readable at 720p on mobile. All values are scaled from BBC/EBU broadcast spec (40px body at 1920x1080).

### Layout rules

- Always use `PADDING=80` left/right safe zones - never hardcode pixel values
- Always use `TOP_SAFE=48` top margin
- Grid containers: use `alignContent: "start"` - never `flex: 1` on grids (causes cards to stretch to fill frame, creating whitespace with small text)
- Card padding: use `SPACE.md` (16px) to `SPACE.lg` (24px) from DesignTokens
- Max 3 grid columns at 1280x720
- Leave 30-60 idle frames after last animation for viewer retention

### Animation timing

- Entrance duration: 9-18 frames (DUR.fast to DUR.normal at 30fps = 0.3-0.6s)
- Stagger between list items: 15-25 frames
- Spring physics (`SPRING.default`) for translations/scales - more natural than CSS easing
- Always leave idle frames at the end (DUR.xslow = 60 frames = 2s)

### Color rules

- Never hardcode colors in template components - always use theme object (`.accent`, `.textPrimary`, etc.)
- 4.5:1 minimum contrast ratio for all text
- Maximum 4 colors visible at once (bg + text + accent + supporting)
- One accent color per scene for "look here" direction

### Common mistakes to avoid

- `flex: 1` on card grids - use `alignContent: "start"` instead
- `gap: 12` hardcoded - use `SPACE.sm` (8) or `SPACE.md` (16)
- `padding: "14px 20px"` hardcoded - use `SPACE.md` / `SPACE.lg` tokens
- Font sizes below `TYPE.caption` (24px) anywhere
