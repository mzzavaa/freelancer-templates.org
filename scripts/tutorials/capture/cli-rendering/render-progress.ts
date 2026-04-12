/**
 * Capture Script: Render Progress
 * Demonstrates viewing render progress and completion
 */

import { BaseCapture } from '../base-capture';

async function capture() {
  const capturer = new BaseCapture({
    outputDir: 'public/tutorials/cli-rendering/render-progress',
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
