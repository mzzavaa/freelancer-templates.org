#!/bin/bash
# Script to add flat/material theme imports and exports to all showcase files

# New theme imports to add after THEME_FINANCE
NEW_IMPORTS='  THEME_MATERIAL_BLUE,
  THEME_MATERIAL_DARK,
  THEME_FLAT_RED,
  THEME_FLAT_NAVY,
  THEME_SWISS,
  THEME_BAUHAUS,
  THEME_MONO,
  THEME_PAPER,
  THEME_SLATE,
  THEME_BLUEPRINT,'

# Find all showcase files
for file in src/remotion/templates/*/[A-Z]*Showcase.tsx; do
  echo "Processing: $file"
  
  # Check if file already has THEME_MATERIAL_BLUE
  if grep -q "THEME_MATERIAL_BLUE" "$file"; then
    echo "  - Already has flat themes, skipping"
    continue
  fi
  
  # Check if file has THEME_FINANCE (European themes)
  if grep -q "THEME_FINANCE" "$file"; then
    # Add new imports after THEME_FINANCE
    sed -i '' 's/THEME_FINANCE,/THEME_FINANCE,\
  THEME_MATERIAL_BLUE,\
  THEME_MATERIAL_DARK,\
  THEME_FLAT_RED,\
  THEME_FLAT_NAVY,\
  THEME_SWISS,\
  THEME_BAUHAUS,\
  THEME_MONO,\
  THEME_PAPER,\
  THEME_SLATE,\
  THEME_BLUEPRINT,/' "$file"
    echo "  - Added flat theme imports"
  elif grep -q "THEME_ESPRESSO" "$file"; then
    # Add new imports after THEME_ESPRESSO
    sed -i '' 's/THEME_ESPRESSO,/THEME_ESPRESSO,\
  THEME_MATERIAL_BLUE,\
  THEME_MATERIAL_DARK,\
  THEME_FLAT_RED,\
  THEME_FLAT_NAVY,\
  THEME_SWISS,\
  THEME_BAUHAUS,\
  THEME_MONO,\
  THEME_PAPER,\
  THEME_SLATE,\
  THEME_BLUEPRINT,/' "$file"
    echo "  - Added flat theme imports (after ESPRESSO)"
  else
    echo "  - No THEME_FINANCE or THEME_ESPRESSO found, skipping"
  fi
done

echo "Done adding imports!"
