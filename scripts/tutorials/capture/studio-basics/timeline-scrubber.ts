/**
 * Capture Script: Timeline Scrubber
 * Demonstrates using the timeline scrubber to navigate frames
 */

import { BaseCapture } from '../base-capture';

async function capture() {
  const capturer = new BaseCapture({
    outputDir: 'public/tutorials/studio-basics/timeline-scrubber',
  });

  try {
    await capturer.init();
    await capturer.navigate();
    capturer.startCapture();
    
    await capturer.wait(1000);
    
    // Click on timeline at different positions
    await capturer.clickAt(400, 680); // Start of timeline
    await capturer.wait(800);
    
    await capturer.clickAt(640, 680); // Middle
    await capturer.wait(800);
    
    await capturer.clickAt(900, 680); // End
    await capturer.wait(800);
    
    const metadata = await capturer.stopCapture();
    console.log(`Captured ${metadata.frames.length} frames`);
    
  } finally {
    await capturer.close();
  }
}

capture().catch(console.error);
