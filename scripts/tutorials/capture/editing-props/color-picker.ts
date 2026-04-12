/**
 * Capture Script: Color Picker
 * Demonstrates changing color values using color picker
 */

import { BaseCapture } from '../base-capture';

async function capture() {
  const capturer = new BaseCapture({
    outputDir: 'public/tutorials/editing-props/color-picker',
  });

  try {
    await capturer.init();
    await capturer.navigate();
    capturer.startCapture();
    
    await capturer.wait(1000);
    
    // Click color swatch to open picker
    await capturer.click('[data-testid="color-swatch"]');
    await capturer.wait(800);
    
    // Click on a color in the picker
    await capturer.clickAt(500, 300);
    await capturer.wait(1000);
    
    const metadata = await capturer.stopCapture();
    console.log(`Captured ${metadata.frames.length} frames`);
  } finally {
    await capturer.close();
  }
}

capture().catch(console.error);
