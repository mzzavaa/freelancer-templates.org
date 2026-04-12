/**
 * Capture Script: Preview Controls
 * Demonstrates play/pause controls for composition preview
 */

import { BaseCapture } from '../base-capture';

async function capture() {
  const capturer = new BaseCapture({
    outputDir: 'public/tutorials/studio-basics/preview-controls',
  });

  try {
    await capturer.init();
    await capturer.navigate();
    capturer.startCapture();
    
    await capturer.wait(1000);
    
    // Click play button
    await capturer.click('[data-testid="play-button"]');
    await capturer.wait(2000);
    
    // Click pause
    await capturer.click('[data-testid="play-button"]');
    await capturer.wait(1000);
    
    const metadata = await capturer.stopCapture();
    console.log(`Captured ${metadata.frames.length} frames`);
    
  } finally {
    await capturer.close();
  }
}

capture().catch(console.error);
