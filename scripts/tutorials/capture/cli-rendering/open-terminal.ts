/**
 * Capture Script: Open Terminal
 * Demonstrates opening terminal and navigating to project directory
 */

import { BaseCapture } from '../base-capture';

async function capture() {
  const capturer = new BaseCapture({
    outputDir: 'public/tutorials/cli-rendering/open-terminal',
  });

  try {
    await capturer.init();
    // This would capture a terminal emulator or VS Code terminal
    capturer.startCapture();
    
    await capturer.wait(3000);
    
    const metadata = await capturer.stopCapture();
    console.log(`Captured ${metadata.frames.length} frames`);
  } finally {
    await capturer.close();
  }
}

capture().catch(console.error);
