import type { OverlayConfig } from '../../../src/remotion/tutorials/types';

export const basicRenderConfig: OverlayConfig = {
  id: 'basic-render',
  name: 'Basic Render Command',
  description: 'How to render a composition using the CLI',
  cursor: { enabled: false },
  overlays: [
    {
      type: 'annotation',
      startFrame: 30,
      endFrame: 120,
      text: 'npx remotion render MyComp out.mp4',
      position: { x: 100, y: 300 },
      style: { fontSize: 20, fontWeight: 'bold', backgroundColor: '#1e293b' },
      fadeIn: 8,
    },
    {
      type: 'annotation',
      startFrame: 60,
      endFrame: 120,
      text: 'Composition name',
      position: { x: 350, y: 260 },
      arrow: { targetX: 420, targetY: 300, curved: true },
      fadeIn: 6,
    },
  ],
};
