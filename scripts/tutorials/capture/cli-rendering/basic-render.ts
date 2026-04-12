/**
 * Capture Script: Basic Render
 * Demonstrates running basic render command with composition name
 */

import { BaseCapture } from '../base-capture';

async function capture() {
  const capturer = new BaseCapture({
    outputDir: 'public/tutorials/cli-rendering/basic-render',
  });

  try {
    await capturer.init();
    capturer.startCapture();
    
    // Placeholder - would capture terminal with render command
    await capturer.wait(5000);
    
    const metadata = await capturer.stopCapture();
    console.log(`Captured ${metadata.frames.length} frames`);
  } finally {
    await capturer.close();
  }
}

capture().catch(console.error);
