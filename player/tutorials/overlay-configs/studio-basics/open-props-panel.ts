import type { OverlayConfig } from '../../../src/remotion/tutorials/types';

export const openPropsPanelConfig: OverlayConfig = {
  id: 'open-props-panel',
  name: 'Open Props Panel',
  description: 'How to open the Props panel in Remotion Studio',
  cursor: { enabled: true, style: 'pointer' },
  overlays: [
    {
      type: 'highlight',
      startFrame: 30,
      endFrame: 75,
      region: { x: 1200, y: 50, width: 60, height: 40 },
      fadeIn: 8,
      fadeOut: 8,
    },
    {
      type: 'annotation',
      startFrame: 35,
      endFrame: 75,
      text: 'Click to open Props',
      position: { x: 1050, y: 30 },
      arrow: { targetX: 1230, targetY: 70, curved: true },
      fadeIn: 6,
    },
  ],
};
