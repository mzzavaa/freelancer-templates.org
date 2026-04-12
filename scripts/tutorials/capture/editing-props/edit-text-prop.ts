/**
 * Capture Script: Edit Text Prop
 * Demonstrates editing text content in a text prop field
 */

import { BaseCapture } from '../base-capture';

async function capture() {
  const capturer = new BaseCapture({
    outputDir: 'public/tutorials/editing-props/edit-text-prop',
  });

  try {
    await capturer.init();
    await capturer.navigate();
    capturer.startCapture();
    
    await capturer.wait(1000);
    
    // Click on text input field
    await capturer.click('[data-testid="prop-text-input"]');
    await capturer.wait(500);
    
    // Type new text
    await capturer.type('[data-testid="prop-text-input"]', 'Hello World');
    await capturer.wait(1500);
    
    const metadata = await capturer.stopCapture();
    console.log(`Captured ${metadata.frames.length} frames`);
  } finally {
    await capturer.close();
  }
}

capture().catch(console.error);
