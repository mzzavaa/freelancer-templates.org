/**
 * Zoom and Click Template
 * Tutorial with zoom effect to highlight small UI elements
 */

import type { OverlayConfig } from '../../src/remotion/tutorials/types';

export const zoomAndClickTemplate: OverlayConfig = {
  id: 'zoom-and-click-template',
  name: 'Zoom and Click Template',
  description: 'Template for tutorials requiring zoom on small elements',
  cursor: {
    enabled: true,
    style: 'pointer',
    smoothing: 0.25,
  },
  overlays: [
    {
      type: 'zoom',
      startFrame: 30,
      endFrame: 120,
      zoomLevel: 2.5,
      targetRegion: { x: 640, y: 360 },
      zoomInDuration: 15,
      holdDuration: 60,
      zoomOutDuration: 15,
      easing: 'easeInOut',
    },
    {
      type: 'highlight',
      startFrame: 50,
      endFrame: 100,
      region: { x: 600, y: 340, width: 80, height: 40 },
      style: {
        borderColor: '#10b981',
        borderWidth: 2,
        glowIntensity: 0.5,
      },
      fadeIn: 8,
      fadeOut: 8,
    },
    {
      type: 'annotation',
      startFrame: 55,
      endFrame: 100,
      text: 'Small input field',
      position: { x: 600, y: 300 },
      style: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      fadeIn: 6,
    },
  ],
};
