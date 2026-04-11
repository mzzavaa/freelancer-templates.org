#!/usr/bin/env node
/**
 * Generate Hugo data file and theme content pages from themes.ts
 * This script reads the theme definitions and outputs:
 * 1. data/themes.json - JSON data for Hugo templates
 * 2. content/themes/*.md - Individual theme landing pages
 */

const fs = require('fs');
const path = require('path');

// Read the themes.ts file
const themesPath = path.join(__dirname, '../src/remotion/templates/_shared/themes.ts');
const themesContent = fs.readFileSync(themesPath, 'utf-8');

// Theme groups for organization
const THEME_GROUPS = {
  original: {
    label: "Original themes",
    description: "Hand-crafted palettes for versatile use",
    themes: ["dark", "clean", "bold", "warm", "minimal", "neon", "lindamohamed"]
  },
  extended: {
    label: "Extended themes",
    description: "Audience-optimised palettes for specific moods",
    themes: ["ocean", "sunset", "forest", "rose", "gold", "midnight", "crimson", "lavender", "arctic", "espresso"]
  },
  european: {
    label: "European themes",
    description: "Grounded professional palettes for corporate use",
    themes: ["corporate", "industrial", "vienna", "alpine", "finance"]
  },
  flat: {
    label: "Flat/Material themes",
    description: "Hard edges, no glow effects, clean design",
    themes: ["materialBlue", "materialDark", "flatRed", "flatNavy", "swiss", "bauhaus", "mono", "paper", "slate", "blueprint"]
  },
  canva: {
    label: "Canva-style themes",
    description: "Simple, colorful designs for content creators",
    themes: ["candy", "mint", "coral", "sky", "grape", "charcoal", "peach", "oceanDark", "cream", "electric"]
  }
};

// Theme descriptions for landing pages
const THEME_DESCRIPTIONS = {
  dark: "A sophisticated dark theme with purple-pink gradients. Perfect for tech products, SaaS demos, and modern presentations.",
  clean: "A light, professional theme with blue accents. Ideal for corporate presentations, business proposals, and formal content.",
  bold: "A high-contrast dark theme with vibrant purple-pink accents. Great for creative agencies, bold statements, and attention-grabbing content.",
  warm: "A cozy dark theme with orange-red gradients. Perfect for lifestyle brands, food content, and welcoming presentations.",
  minimal: "A subtle light theme with muted grays. Ideal for elegant presentations, minimalist brands, and content-focused layouts.",
  neon: "A cyberpunk-inspired dark theme with electric green-cyan accents. Perfect for tech startups, gaming content, and futuristic presentations.",
  lindamohamed: "A professional light theme with forest green accents. Designed for consultants, coaches, and professional services.",
  ocean: "A deep blue theme with cyan accents. Perfect for marine, travel, and calm professional content.",
  sunset: "A warm pink-orange theme. Ideal for lifestyle, beauty, and creative content.",
  forest: "A nature-inspired dark green theme. Great for sustainability, outdoor, and eco-friendly brands.",
  rose: "A romantic dark theme with red-pink accents. Perfect for beauty, fashion, and elegant presentations.",
  gold: "A luxurious dark theme with golden accents. Ideal for premium brands, finance, and high-end content.",
  midnight: "A deep blue professional theme. Perfect for corporate, tech, and trustworthy presentations.",
  crimson: "A bold dark theme with red-orange accents. Great for urgent announcements, sales, and high-energy content.",
  lavender: "A soft purple theme with elegant gradients. Ideal for wellness, beauty, and creative presentations.",
  arctic: "A fresh light blue theme. Perfect for clean, modern, and refreshing content.",
  espresso: "A warm brown theme with coffee tones. Great for cafes, artisan brands, and cozy content.",
  corporate: "A professional navy theme with gold accents. Designed for enterprise presentations and executive reports.",
  industrial: "A teal-accented dark theme. Perfect for manufacturing, engineering, and technical content.",
  vienna: "An elegant purple theme with European sophistication. Ideal for cultural, artistic, and refined presentations.",
  alpine: "A clean light theme with teal accents. Perfect for Swiss-style precision and professional services.",
  finance: "A premium dark theme with gold accents. Designed for banking, investment, and financial presentations.",
  materialBlue: "A flat Material Design theme with blue accents. Clean, modern, and Google-inspired.",
  materialDark: "A dark Material Design theme with teal accents. Perfect for apps and modern interfaces.",
  flatRed: "A clean flat theme with red accents. Great for alerts, CTAs, and attention-grabbing content.",
  flatNavy: "A professional flat theme with navy accents. Ideal for corporate and formal presentations.",
  swiss: "A pure black and white theme. Perfect for typography-focused and minimalist design.",
  bauhaus: "A classic design theme with primary colors. Inspired by the Bauhaus movement.",
  mono: "A monochrome dark theme with mint accents. Great for code, terminal, and developer content.",
  paper: "A warm paper-like theme with sepia tones. Perfect for documents, books, and classic content.",
  slate: "A modern dark gray theme with amber accents. Ideal for dashboards and data presentations.",
  blueprint: "A bold blue theme with white accents. Perfect for technical diagrams and engineering content.",
  // New Canva-style themes
  candy: "A playful pink theme with rounded typography. Perfect for social media, lifestyle, and youthful content.",
  mint: "A fresh mint green theme. Ideal for health, wellness, and eco-friendly content.",
  coral: "A warm coral orange theme on cream. Great for lifestyle, food, and inviting presentations.",
  sky: "A calm sky blue theme. Perfect for tech, trust-building, and professional content.",
  grape: "A rich purple theme on lavender. Ideal for creative, premium, and modern presentations.",
  charcoal: "A sophisticated dark charcoal theme. Perfect for minimal, elegant, and professional content.",
  peach: "A soft peach theme with editorial typography. Great for beauty, lifestyle, and feminine content.",
  oceanDark: "A deep ocean blue theme with cyan accents. Perfect for tech, gaming, and immersive content.",
  cream: "A warm cream theme with brown accents. Ideal for artisan, handcrafted, and cozy content.",
  electric: "A high-energy dark theme with electric blue. Perfect for gaming, tech, and bold presentations."
};

// Parse theme definitions from the TypeScript file
function parseThemes(content) {
  const themes = {};
  
  // Match theme constant definitions
  const themeRegex = /export const (THEME_\w+): Theme = \{([^}]+(?:\{[^}]*\}[^}]*)*)\}/g;
  let match;
  
  while ((match = themeRegex.exec(content)) !== null) {
    const constName = match[1];
    const body = match[2];
    
    // Extract name
    const nameMatch = body.match(/name:\s*["']([^"']+)["']/);
    if (!nameMatch) continue;
    const name = nameMatch[1];
    
    // Extract colors
    const bg = extractValue(body, 'bg');
    const bgSecondary = extractValue(body, 'bgSecondary');
    const bgGlass = extractValue(body, 'bgGlass');
    const textPrimary = extractValue(body, 'textPrimary');
    const textSecondary = extractValue(body, 'textSecondary');
    const textMuted = extractValue(body, 'textMuted');
    const accent = extractValue(body, 'accent');
    const accentSecondary = extractValue(body, 'accentSecondary');
    const accentGradient = extractValue(body, 'accentGradient');
    const cardBorder = extractValue(body, 'cardBorder');
    const cardShadow = extractValue(body, 'cardShadow');
    const fontFamily = extractValue(body, 'fontFamily');
    const headingWeight = extractNumber(body, 'headingWeight');
    
    themes[name] = {
      name,
      constName,
      bg,
      bgSecondary,
      bgGlass,
      textPrimary,
      textSecondary,
      textMuted,
      accent,
      accentSecondary,
      accentGradient,
      cardBorder,
      cardShadow,
      fontFamily,
      headingWeight
    };
  }
  
  return themes;
}

function extractValue(body, key) {
  // Handle multi-line values and various quote styles
  const regex = new RegExp(`${key}:\\s*["'\`]([^"'\`]+)["'\`]`);
  const match = body.match(regex);
  return match ? match[1] : '';
}

function extractNumber(body, key) {
  const regex = new RegExp(`${key}:\\s*(\\d+)`);
  const match = body.match(regex);
  return match ? parseInt(match[1], 10) : 400;
}

function formatDisplayName(name) {
  // Convert camelCase to Title Case with spaces
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

function getLayoutSuffix(name) {
  // Map themes to their typical layout variants
  const suffixes = {
    dark: 'Centered',
    clean: 'Split',
    bold: 'Editorial',
    warm: 'Centered',
    minimal: 'Editorial',
    neon: 'Split',
    lindamohamed: '',
    ocean: 'Centered',
    sunset: 'Split',
    forest: 'Centered',
    rose: 'Editorial',
    gold: 'Centered',
    midnight: 'Centered',
    crimson: 'Editorial',
    lavender: 'Split',
    arctic: 'Split',
    espresso: 'Centered',
    corporate: 'Dashboard',
    industrial: 'Dashboard',
    vienna: 'Dashboard',
    alpine: 'Dashboard',
    finance: 'Dashboard',
    materialBlue: 'Centered',
    materialDark: 'Centered',
    flatRed: 'Editorial',
    flatNavy: 'Split',
    swiss: 'Editorial',
    bauhaus: 'Centered',
    mono: 'Split',
    paper: 'Editorial',
    slate: 'Centered',
    blueprint: 'Split',
    // New Canva-style themes
    candy: 'Centered',
    mint: 'Split',
    coral: 'Centered',
    sky: 'Split',
    grape: 'Centered',
    charcoal: 'Editorial',
    peach: 'Editorial',
    oceanDark: 'Centered',
    cream: 'Editorial',
    electric: 'Split'
  };
  return suffixes[name] || 'Centered';
}

function isLightBackground(bg) {
  return bg.startsWith('#f') || bg.startsWith('#e') || bg === '#ffffff' || bg.startsWith('#fff');
}

// Generate the data structure
const themes = parseThemes(themesContent);

// Build grouped output for data/themes.json
const output = {
  totalThemes: Object.keys(themes).length,
  groups: {}
};

for (const [groupKey, groupDef] of Object.entries(THEME_GROUPS)) {
  output.groups[groupKey] = {
    label: groupDef.label,
    description: groupDef.description,
    themes: groupDef.themes.map(name => {
      const theme = themes[name];
      if (!theme) {
        console.warn(`Warning: Theme "${name}" not found in themes.ts`);
        return null;
      }
      
      // Determine a good preview composition
      let previewComp = 'Testimonial';
      let previewVariant = name.charAt(0).toUpperCase() + name.slice(1);
      
      // Handle camelCase names
      if (name === 'materialBlue') previewVariant = 'MaterialBlue';
      if (name === 'materialDark') previewVariant = 'MaterialDark';
      if (name === 'flatRed') previewVariant = 'FlatRed';
      if (name === 'flatNavy') previewVariant = 'FlatNavy';
      
      // European and flat themes use ClientReport
      if (['corporate', 'industrial', 'vienna', 'alpine', 'finance'].includes(name)) {
        previewComp = 'ClientReport';
        previewVariant = name.charAt(0).toUpperCase() + name.slice(1);
      }
      
      const layoutSuffix = getLayoutSuffix(name);
      const bgIsLight = isLightBackground(theme.bg);
      
      return {
        ...theme,
        displayName: formatDisplayName(name),
        bgIsLight,
        previewUrl: `player/?comp=${previewComp}-${previewVariant}${layoutSuffix}`
      };
    }).filter(Boolean)
  };
}

// Write the JSON output
const outputPath = path.join(__dirname, '../data/themes.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`Generated ${outputPath} with ${output.totalThemes} themes in ${Object.keys(output.groups).length} groups`);

// Generate theme content pages
const themesDir = path.join(__dirname, '../content/themes');
if (!fs.existsSync(themesDir)) {
  fs.mkdirSync(themesDir, { recursive: true });
}

// Create _index.md for the themes section
const indexContent = `---
title: "Theme Gallery"
description: "Browse all ${output.totalThemes} themes available for freelancer templates. Each theme works with every template."
layout: "list"
---

Browse all available themes. Each theme is a complete visual identity that works with every template.
`;
fs.writeFileSync(path.join(themesDir, '_index.md'), indexContent);
console.log(`Generated content/themes/_index.md`);

// Helper function to convert object to YAML format
function toYaml(obj, indent = 0) {
  const spaces = '  '.repeat(indent);
  let yaml = '';
  
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      yaml += `${spaces}${key}: null\n`;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      yaml += `${spaces}${key}:\n${toYaml(value, indent + 1)}`;
    } else if (Array.isArray(value)) {
      yaml += `${spaces}${key}:\n`;
      for (const item of value) {
        if (typeof item === 'object') {
          yaml += `${spaces}  -\n${toYaml(item, indent + 2)}`;
        } else {
          yaml += `${spaces}  - ${JSON.stringify(item)}\n`;
        }
      }
    } else if (typeof value === 'string') {
      // Quote strings that contain special characters or look like numbers
      if (value.includes(':') || value.includes('#') || value.includes('"') || 
          value.includes("'") || value.includes('\n') || value.startsWith(' ') ||
          value.endsWith(' ') || /^[\d.]+$/.test(value)) {
        yaml += `${spaces}${key}: "${value.replace(/"/g, '\\"')}"\n`;
      } else {
        yaml += `${spaces}${key}: "${value}"\n`;
      }
    } else if (typeof value === 'boolean') {
      yaml += `${spaces}${key}: ${value}\n`;
    } else if (typeof value === 'number') {
      yaml += `${spaces}${key}: ${value}\n`;
    } else {
      yaml += `${spaces}${key}: ${JSON.stringify(value)}\n`;
    }
  }
  
  return yaml;
}

// Create individual theme pages
let themePageCount = 0;
for (const [groupKey, groupDef] of Object.entries(THEME_GROUPS)) {
  const group = output.groups[groupKey];
  if (!group) continue;
  
  for (const theme of group.themes) {
    const description = THEME_DESCRIPTIONS[theme.name] || `The ${theme.displayName} theme - a versatile color palette for professional video content.`;
    
    const frontmatter = {
      title: `${theme.displayName} Theme`,
      description: description,
      layout: "single",
      themeName: theme.name,
      groupKey: groupKey,
      groupLabel: groupDef.label,
      themeData: theme
    };
    
    const yamlContent = toYaml(frontmatter);
    
    const content = `---
${yamlContent}---

${description}
`;
    
    const filePath = path.join(themesDir, `${theme.name}.md`);
    fs.writeFileSync(filePath, content);
    themePageCount++;
  }
}

console.log(`Generated ${themePageCount} theme pages in content/themes/`);
console.log('Done!');
