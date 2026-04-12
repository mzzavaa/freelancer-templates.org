/**
 * Capture Script: Locate Props Panel
 * Demonstrates locating and opening the Props panel
 */

import { BaseCapture } from '../base-capture';

async function capture() {
  const capturer = new BaseCapture({
    outputDir: 'public/tutorials/editing-props/locate-props-panel',
  });

  try {
    await capturer.init();
    await capturer.navigate();
    capturer.startCapture();
    
    await capturer.wait(1000);
    await capturer.hover('[data-testid="props-panel-toggle"]');
    await capturer.wait(800);
    await capturer.click('[data-testid="props-panel-toggle"]');
    await capturer.wait(1500);
    
    const metadata = await capturer.stopCapture();
    console.log(`Captured ${metadata.frames.length} frames`);
  } finally {
    await capturer.close();
  }
}

capture().catch(console.error);
