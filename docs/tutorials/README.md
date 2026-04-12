# Video Tutorial Screencasts

This system creates animated video tutorials demonstrating Remotion Studio interactions.

## Quick Start

```bash
# Scaffold a new tutorial
npx ts-node scripts/tutorials/scaffold-tutorial.ts my-tutorial studio-basics "My Tutorial Title"

# Render all tutorials
npx ts-node scripts/tutorials/batch-render.ts

# Render a specific tutorial
npx ts-node scripts/tutorials/batch-render.ts --id=open-props-panel
```

## Workflow

1. **Scaffold** - Generate capture script and overlay config templates
2. **Capture** - Record screen interactions with Playwright
3. **Configure** - Define overlays (cursor, zoom, highlights, annotations)
4. **Render** - Generate MP4, GIF, and WebM outputs
5. **Embed** - Use Hugo partial to display on tips pages

## Directory Structure

```
scripts/tutorials/
├── capture/           # Capture scripts by category
│   ├── studio-basics/
│   ├── editing-props/
│   └── cli-rendering/
├── base-capture.ts    # Playwright capture class
├── render-pipeline.ts # Render orchestration
├── batch-render.ts    # Batch rendering
└── scaffold-tutorial.ts

data/tutorials/
├── overlay-configs/   # Overlay configurations
├── templates/         # Config templates
└── manifest.ts        # Tutorial registry

src/remotion/tutorials/
├── overlays/          # Overlay components
├── utils/             # Utilities
├── TutorialComposition.tsx
└── index.ts

static/tutorials/      # Rendered outputs
```

## Overlay Types

- **Cursor** - Animated cursor with click indicators
- **Zoom** - Magnify small UI elements
- **Highlight** - Draw attention to regions
- **Annotation** - Labels and arrows

## Embedding in Hugo

```html
{{ partial "tips-video-embed" (dict 
  "id" "open-props-panel"
  "category" "studio-basics"
  "caption" "Click to open the Props panel"
) }}
```

## Troubleshooting

- **Capture fails**: Ensure Remotion Studio is running at localhost:3000
- **Render fails**: Check overlay config validation errors
- **GIF too large**: Reduce duration or increase compression
