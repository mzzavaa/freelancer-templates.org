/**
 * Capture Script: Format Options
 * Demonstrates specifying output format and quality options
 */

import { BaseCapture } from '../base-capture';

async function capture() {
  const capturer = new BaseCapture({
    outputDir: 'public/tutorials/cli-rendering/format-options',
  });

  try {
    await capturer.init();
    capturer.startCapture();
    
    await capturer.wait(5000);
    
    const metadata = await capturer.stopCapture();
    console.log(`Captured ${metadata.frames.length} frames`);
  } finally {
    await capturer.close();
  }
}

capture().catch(console.error);
