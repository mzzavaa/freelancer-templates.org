/**
 * Tutorial Manifest
 * Lists all tutorials with metadata
 */

export interface TutorialEntry {
  id: string;
  category: 'studio-basics' | 'editing-props' | 'cli-rendering';
  page: string;
  title: string;
  duration: number; // seconds
  captureScript: string;
  overlayConfig: string;
  outputDir: string;
}

export const tutorials: TutorialEntry[] = [
  // Studio Basics
  {
    id: 'open-props-panel',
    category: 'studio-basics',
    page: '/tips/studio-basics',
    title: 'Opening the Props Panel',
    duration: 5,
    captureScript: 'scripts/tutorials/capture/studio-basics/open-props-panel.ts',
    overlayConfig: 'data/tutorials/overlay-configs/studio-basics/open-props-panel.ts',
    outputDir: 'static/tutorials/studio-basics',
  },
  {
    id: 'timeline-scrubber',
    category: 'studio-basics',
    page: '/tips/studio-basics',
    title: 'Using the Timeline Scrubber',
    duration: 8,
    captureScript: 'scripts/tutorials/capture/studio-basics/timeline-scrubber.ts',
    overlayConfig: 'data/tutorials/overlay-configs/studio-basics/timeline-scrubber.ts',
    outputDir: 'static/tutorials/studio-basics',
  },
  // Editing Props
  {
    id: 'edit-text-prop',
    category: 'editing-props',
    page: '/tips/editing-props',
    title: 'Editing Text Properties',
    duration: 6,
    captureScript: 'scripts/tutorials/capture/editing-props/edit-text-prop.ts',
    overlayConfig: 'data/tutorials/overlay-configs/editing-props/edit-text-prop.ts',
    outputDir: 'static/tutorials/editing-props',
  },
  // CLI Rendering
  {
    id: 'basic-render',
    category: 'cli-rendering',
    page: '/tips/cli-rendering',
    title: 'Basic Render Command',
    duration: 10,
    captureScript: 'scripts/tutorials/capture/cli-rendering/basic-render.ts',
    overlayConfig: 'data/tutorials/overlay-configs/cli-rendering/basic-render.ts',
    outputDir: 'static/tutorials/cli-rendering',
  },
];

export function getTutorialsByCategory(category: TutorialEntry['category']): TutorialEntry[] {
  return tutorials.filter((t) => t.category === category);
}

export function getTutorialById(id: string): TutorialEntry | undefined {
  return tutorials.find((t) => t.id === id);
}
