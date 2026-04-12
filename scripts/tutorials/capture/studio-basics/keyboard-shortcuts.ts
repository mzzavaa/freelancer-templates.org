/**
 * Capture Script: Keyboard Shortcuts
 * Demonstrates spacebar for play, arrow keys for frames
 */

import { BaseCapture } from '../base-capture';

async function capture() {
  const capturer = new BaseCapture({
    outputDir: 'public/tutorials/studio-basics/keyboard-shortcuts',
  });

  try {
    await capturer.init();
    await capturer.navigate();
    capturer.startCapture();
    
    await capturer.wait(1000);
    
    // Note: Keyboard shortcuts would need page.keyboard.press()
    // This is a placeholder - actual implementation would use:
    // await page.keyboard.press('Space');
    // await page.keyboard.press('ArrowRight');
    
    await capturer.wait(3000);
    
    const metadata = await capturer.stopCapture();
    console.log(`Captured ${metadata.frames.length} frames`);
    
  } finally {
    await capturer.close();
  }
}

capture().catch(console.error);
