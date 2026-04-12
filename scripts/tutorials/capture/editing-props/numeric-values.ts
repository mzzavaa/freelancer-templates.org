/**
 * Capture Script: Numeric Values
 * Demonstrates adjusting numeric values (duration, size, position)
 */

import { BaseCapture } from '../base-capture';

async function capture() {
  const capturer = new BaseCapture({
    outputDir: 'public/tutorials/editing-props/numeric-values',
  });

  try {
    await capturer.init();
    await capturer.navigate();
    capturer.startCapture();
    
    await capturer.wait(1000);
    
    await capturer.click('[data-testid="prop-number-input"]');
    await capturer.wait(500);
    await capturer.type('[data-testid="prop-number-input"]', '150');
    await capturer.wait(1500);
    
    const metadata = await capturer.stopCapture();
    console.log(`Captured ${metadata.frames.length} frames`);
  } finally {
    await capturer.close();
  }
}

capture().catch(console.error);
