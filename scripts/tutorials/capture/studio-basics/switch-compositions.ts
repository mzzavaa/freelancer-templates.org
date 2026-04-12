/**
 * Capture Script: Switch Compositions
 * Demonstrates switching between compositions in sidebar
 */

import { BaseCapture } from '../base-capture';

async function capture() {
  const capturer = new BaseCapture({
    outputDir: 'public/tutorials/studio-basics/switch-compositions',
  });

  try {
    await capturer.init();
    await capturer.navigate();
    capturer.startCapture();
    
    await capturer.wait(1000);
    
    // Click on different compositions in sidebar
    await capturer.click('[data-testid="composition-list"] li:nth-child(1)');
    await capturer.wait(1000);
    
    await capturer.click('[data-testid="composition-list"] li:nth-child(2)');
    await capturer.wait(1000);
    
    await capturer.click('[data-testid="composition-list"] li:nth-child(3)');
    await capturer.wait(1000);
    
    const metadata = await capturer.stopCapture();
    console.log(`Captured ${metadata.frames.length} frames`);
    
  } finally {
    await capturer.close();
  }
}

capture().catch(console.error);
