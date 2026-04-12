/**
 * Multi-Step Template
 * Tutorial with numbered steps for complex workflows
 */

import type { OverlayConfig } from '../../src/remotion/tutorials/types';

export const multiStepTemplate: OverlayConfig = {
  id: 'multi-step-template',
  name: 'Multi-Step Template',
  description: 'Template for tutorials with multiple sequential steps',
  cursor: {
    enabled: true,
    style: 'pointer',
    smoothing: 0.3,
  },
  overlays: [
    // Step 1
    {
      type: 'highlight',
      startFrame: 15,
      endFrame: 75,
      region: { x: 50, y: 100, width: 200, height: 50 },
      fadeIn: 8,
      fadeOut: 8,
    },
    {
      type: 'annotation',
      startFrame: 20,
      endFrame: 75,
      stepNumber: 1,
      text: 'First, click here',
      position: { x: 50, y: 60 },
      fadeIn: 6,
    },
    // Step 2
    {
      type: 'highlight',
      startFrame: 90,
      endFrame: 150,
      region: { x: 300, y: 200, width: 180, height: 40 },
      fadeIn: 8,
      fadeOut: 8,
    },
    {
      type: 'annotation',
      startFrame: 95,
      endFrame: 150,
      stepNumber: 2,
      text: 'Then select this option',
      position: { x: 300, y: 160 },
      fadeIn: 6,
    },
    // Step 3
    {
      type: 'highlight',
      startFrame: 165,
      endFrame: 225,
      region: { x: 500, y: 350, width: 120, height: 45 },
      style: {
        borderColor: '#22c55e',
      },
      fadeIn: 8,
      fadeOut: 8,
    },
    {
      type: 'annotation',
      startFrame: 170,
      endFrame: 225,
      stepNumber: 3,
      text: 'Finally, confirm',
      position: { x: 500, y: 310 },
      fadeIn: 6,
    },
  ],
};
