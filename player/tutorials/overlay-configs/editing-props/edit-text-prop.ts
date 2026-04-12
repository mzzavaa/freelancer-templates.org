import type { OverlayConfig } from '../../../src/remotion/tutorials/types';

export const editTextPropConfig: OverlayConfig = {
  id: 'edit-text-prop',
  name: 'Edit Text Prop',
  description: 'How to edit text content in the Props panel',
  cursor: { enabled: true, style: 'text' },
  overlays: [
    {
      type: 'zoom',
      startFrame: 20,
      endFrame: 90,
      zoomLevel: 2,
      targetRegion: { x: 1100, y: 200 },
      zoomInDuration: 12,
      zoomOutDuration: 12,
      easing: 'easeInOut',
    },
    {
      type: 'highlight',
      startFrame: 35,
      endFrame: 85,
      region: { x: 1000, y: 180, width: 200, height: 40 },
      fadeIn: 6,
      fadeOut: 6,
    },
  ],
};
