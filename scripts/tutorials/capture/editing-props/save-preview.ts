/**
 * Capture Script: Save Preview
 * Demonstrates saving changes and seeing preview update
 */

import { BaseCapture } from '../base-capture';

async function capture() {
  const capturer = new BaseCapture({
    outputDir: 'public/tutorials/editing-props/save-preview',
  });

  try {
    await capturer.init();
    await capturer.navigate();
    capturer.startCapture();
    
    await capturer.wait(1000);
    
    // Make a change
    await capturer.click('[data-testid="prop-text-input"]');
    await capturer.type('[data-testid="prop-text-input"]', 'Updated');
    await capturer.wait(500);
    
    // Click save/apply
    await capturer.click('[data-testid="save-button"]');
    await capturer.wait(1500);
    
    const metadata = await capturer.stopCapture();
    console.log(`Captured ${metadata.frames.length} frames`);
  } finally {
    await capturer.close();
  }
}

capture().catch(console.error);
