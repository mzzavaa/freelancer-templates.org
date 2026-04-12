/**
 * Scaffold Tutorial CLI
 * Generates capture script, overlay config, and definition templates
 */

import * as fs from 'fs';
import * as path from 'path';

interface ScaffoldOptions {
  id: string;
  category: 'studio-basics' | 'editing-props' | 'cli-rendering';
  title: string;
}

function scaffoldTutorial(options: ScaffoldOptions): void {
  const { id, category, title } = options;

  // Create capture script
  const captureDir = `scripts/tutorials/capture/${category}`;
  fs.mkdirSync(captureDir, { recursive: true });
  
  const captureScript = `/**
 * Capture Script: ${title}
 */

import { BaseCapture } from '../base-capture';

async function capture() {
  const capturer = new BaseCapture({
    outputDir: 'public/tutorials/${category}/${id}',
  });

  try {
    await capturer.init();
    await capturer.navigate();
    capturer.startCapture();
    
    // TODO: Add interaction steps
    await capturer.wait(3000);
    
    const metadata = await capturer.stopCapture();
    console.log(\`Captured \${metadata.frames.length} frames\`);
  } finally {
    await capturer.close();
  }
}

capture().catch(console.error);
`;
  
  fs.writeFileSync(path.join(captureDir, `${id}.ts`), captureScript);
  console.log(`+ Created capture script: ${captureDir}/${id}.ts`);

  // Create overlay config
  const configDir = `data/tutorials/overlay-configs/${category}`;
  fs.mkdirSync(configDir, { recursive: true });
  
  const overlayConfig = `import type { OverlayConfig } from '../../../../src/remotion/tutorials/types';

export const ${id.replace(/-/g, '')}Config: OverlayConfig = {
  id: '${id}',
  name: '${title}',
  description: 'TODO: Add description',
  cursor: { enabled: true, style: 'pointer' },
  overlays: [
    // TODO: Add overlays
  ],
};
`;
  
  fs.writeFileSync(path.join(configDir, `${id}.ts`), overlayConfig);
  console.log(`+ Created overlay config: ${configDir}/${id}.ts`);

  // Create output directory
  const outputDir = `static/tutorials/${category}`;
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`+ Created output directory: ${outputDir}`);

  console.log(`\n[DONE] Scaffolded tutorial: ${id}`);
  console.log(`\nNext steps:`);
  console.log(`1. Edit capture script: ${captureDir}/${id}.ts`);
  console.log(`2. Edit overlay config: ${configDir}/${id}.ts`);
  console.log(`3. Add to manifest: data/tutorials/manifest.ts`);
}

// CLI
const args = process.argv.slice(2);
if (args.length < 3) {
  console.log('Usage: npx ts-node scaffold-tutorial.ts <id> <category> <title>');
  console.log('Categories: studio-basics, editing-props, cli-rendering');
  process.exit(1);
}

scaffoldTutorial({
  id: args[0],
  category: args[1] as ScaffoldOptions['category'],
  title: args.slice(2).join(' '),
});
