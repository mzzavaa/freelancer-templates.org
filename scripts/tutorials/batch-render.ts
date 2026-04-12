/**
 * Batch Render Script
 * Renders all tutorials defined in the manifest
 */

import { batchRender, TutorialDefinition } from './render-pipeline';
import * as fs from 'fs';

// Load manifest or use defaults
const defaultTutorials: TutorialDefinition[] = [
  {
    id: 'open-props-panel',
    captureScript: 'scripts/tutorials/capture/studio-basics/open-props-panel.ts',
    overlayConfig: 'data/tutorials/overlay-configs/studio-basics/open-props-panel.json',
    outputDir: 'static/tutorials/studio-basics',
    formats: ['mp4', 'gif', 'webm'],
  },
  {
    id: 'edit-text-prop',
    captureScript: 'scripts/tutorials/capture/editing-props/edit-text-prop.ts',
    overlayConfig: 'data/tutorials/overlay-configs/editing-props/edit-text-prop.json',
    outputDir: 'static/tutorials/editing-props',
    formats: ['mp4', 'gif', 'webm'],
  },
  {
    id: 'basic-render',
    captureScript: 'scripts/tutorials/capture/cli-rendering/basic-render.ts',
    overlayConfig: 'data/tutorials/overlay-configs/cli-rendering/basic-render.json',
    outputDir: 'static/tutorials/cli-rendering',
    formats: ['mp4', 'gif', 'webm'],
  },
];

async function main() {
  const args = process.argv.slice(2);
  const cleanupCaptures = args.includes('--cleanup');
  const verbose = !args.includes('--quiet');

  let tutorials = defaultTutorials;

  // Load from manifest if exists
  if (fs.existsSync('data/tutorials/manifest.json')) {
    const manifest = JSON.parse(fs.readFileSync('data/tutorials/manifest.json', 'utf-8'));
    tutorials = manifest.tutorials || defaultTutorials;
  }

  // Filter by ID if specified
  const filterArg = args.find((a) => a.startsWith('--id='));
  if (filterArg) {
    const id = filterArg.split('=')[1];
    tutorials = tutorials.filter((t) => t.id === id);
  }

  await batchRender(tutorials, { cleanupCaptures, verbose });
}

main().catch(console.error);
