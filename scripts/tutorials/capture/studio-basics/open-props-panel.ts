/**
 * Capture Script: Open Props Panel
 * Demonstrates opening the Props panel in Remotion Studio
 */

import { BaseCapture } from '../base-capture';

async function capture() {
  const capturer = new BaseCapture({
    outputDir: 'public/tutorials/studio-basics/open-props-panel',
  });

  try {
    await capturer.init();
    await capturer.navigate();
    
    // Start capturing
    capturer.startCapture();
    
    // Wait for Studio to load
    await capturer.wait(1000);
    
    // Hover over Props panel toggle
    await capturer.hover('[data-testid="props-panel-toggle"]');
    await capturer.wait(500);
    
    // Click to open
    await capturer.click('[data-testid="props-panel-toggle"]');
    await capturer.wait(1500);
    
    // Stop and save
    const metadata = await capturer.stopCapture();
    console.log(`Captured ${metadata.frames.length} frames`);
    
  } finally {
    await capturer.close();
  }
}

capture().catch(console.error);
