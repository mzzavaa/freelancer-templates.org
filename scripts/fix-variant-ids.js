#!/usr/bin/env node
/**
 * Fix variant IDs in content/library/*.md files to match the registry
 * 
 * This script reads the registry IDs and updates the content files to use
 * the exact IDs from the registry.
 */

const fs = require('fs');
const path = require('path');

// Read registry file and extract all composition IDs
const registryPath = path.join(__dirname, '../player/src/registry.ts');
const registryContent = fs.readFileSync(registryPath, 'utf8');

// Extract all IDs from c("ID", ...) or cFHD("ID", ...) or cShort("ID", ...) or cSquare("ID", ...)
const idRegex = /c(?:FHD|Short|Square)?\("([^"]+)"/g;
const registryIds = new Set();
let match;
while ((match = idRegex.exec(registryContent)) !== null) {
  registryIds.add(match[1]);
}

console.log(`Found ${registryIds.size} unique IDs in registry`);

// Read all content files
const libraryDir = path.join(__dirname, '../content/library');
const files = fs.readdirSync(libraryDir).filter(f => f.endsWith('.md') && f !== '_index.md');

let totalFixed = 0;
let totalMissing = 0;

for (const file of files) {
  const filePath = path.join(libraryDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Parse YAML frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    console.log(`Skipping ${file}: no frontmatter`);
    continue;
  }
  
  const frontmatter = frontmatterMatch[1];
  
  // Extract camel name
  const camelMatch = frontmatter.match(/^camel:\s*"([^"]+)"/m);
  if (!camelMatch) {
    console.log(`Skipping ${file}: no camel field`);
    continue;
  }
  const camel = camelMatch[1];
  
  // Find all variant IDs in the file
  const variantIdRegex = /id:\s*"([^"]+)"/g;
  let variantMatch;
  const fixes = [];
  
  while ((variantMatch = variantIdRegex.exec(content)) !== null) {
    const oldId = variantMatch[1];
    
    // Skip if already in registry
    if (registryIds.has(oldId)) {
      continue;
    }
    
    // Try to find a matching ID in the registry
    // Strategy 1: Add hyphen after camel name
    const withHyphen = oldId.replace(new RegExp(`^${camel}`), `${camel}-`);
    if (registryIds.has(withHyphen)) {
      fixes.push({ old: oldId, new: withHyphen });
      continue;
    }
    
    // Strategy 2: Look for similar IDs in registry
    const similar = Array.from(registryIds).filter(id => {
      // Normalize both IDs by removing hyphens and comparing
      const normalizedOld = oldId.replace(/-/g, '').toLowerCase();
      const normalizedNew = id.replace(/-/g, '').toLowerCase();
      return normalizedOld === normalizedNew;
    });
    
    if (similar.length === 1) {
      fixes.push({ old: oldId, new: similar[0] });
      continue;
    }
    
    // Strategy 3: Check if it's a special template (gameday, sims4, etc.)
    if (oldId.includes('GameDay') || oldId.includes('Sims4') || oldId.includes('LindaMohamed') || oldId.includes('NetApp')) {
      // These are special templates, skip
      continue;
    }
    
    console.log(`  WARNING: No match found for ${oldId} in ${file}`);
    totalMissing++;
  }
  
  // Apply fixes
  if (fixes.length > 0) {
    console.log(`\nFixing ${file}:`);
    for (const fix of fixes) {
      console.log(`  ${fix.old} -> ${fix.new}`);
      content = content.replace(new RegExp(`id:\\s*"${fix.old}"`, 'g'), `id: "${fix.new}"`);
      
      // Also fix primaryId if it matches
      content = content.replace(new RegExp(`primaryId:\\s*"${fix.old}"`, 'g'), `primaryId: "${fix.new}"`);
      
      totalFixed++;
    }
    
    fs.writeFileSync(filePath, content);
    modified = true;
  }
}

console.log(`\n=== Summary ===`);
console.log(`Fixed: ${totalFixed} IDs`);
console.log(`Missing: ${totalMissing} IDs (no match found)`);
