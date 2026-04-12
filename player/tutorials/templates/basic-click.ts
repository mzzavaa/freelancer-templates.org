/**
 * Basic Click Template
 * Simple tutorial showing cursor movement and a single click action
 */

import type { OverlayConfig } from '../../src/remotion/tutorials/types';

export const basicClickTemplate: OverlayConfig = {
  id: 'basic-click-template',
  name: 'Basic Click Template',
  description: 'Template for simple click tutorials',
  cursor: {
    enabled: true,
    style: 'pointer',
    clickIndicatorDuration: 400,
    smoothing: 0.3,
  },
  overlays: [
    {
      type: 'highlight',
      startFrame: 30,
      endFrame: 90,
      region: { x: 100, y: 100, width: 150, height: 40 },
      style: {
        borderColor: '#3b82f6',
        borderWidth: 3,
        borderRadius: 8,
        pulseAnimation: true,
      },
      fadeIn: 10,
      fadeOut: 10,
    },
    {
      type: 'annotation',
      startFrame: 45,
      endFrame: 90,
      text: 'Click here',
      position: { x: 100, y: 60 },
      arrow: {
        targetX: 175,
        targetY: 100,
        curved: true,
      },
      fadeIn: 8,
    },
  ],
};
