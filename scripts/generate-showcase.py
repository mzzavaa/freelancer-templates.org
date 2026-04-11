#!/usr/bin/env python3
"""
Generate expanded showcase files for templates with all 42 themes.

This script generates:
1. Updated *Showcase.tsx files with all theme/layout combinations
2. Updated Root.tsx imports and compositions
3. Updated data/templates.json variants
4. Updated content/library/*.md frontmatter

Usage:
  python3 scripts/generate-showcase.py listicle
  python3 scripts/generate-showcase.py --all
"""

import json
import os
import re
import argparse
from pathlib import Path
from typing import Dict, List, Tuple

# All 42 themes
THEMES = [
    # Original (7)
    ("dark", "THEME_DARK", "Dark"),
    ("clean", "THEME_CLEAN", "Clean"),
    ("bold", "THEME_BOLD", "Bold"),
    ("warm", "THEME_WARM", "Warm"),
    ("minimal", "THEME_MINIMAL", "Minimal"),
    ("neon", "THEME_NEON", "Neon"),
    ("lindamohamed", "THEME_LINDAMOHAMED", "Lindamohamed"),
    # Extended (10)
    ("ocean", "THEME_OCEAN", "Ocean"),
    ("sunset", "THEME_SUNSET", "Sunset"),
    ("forest", "THEME_FOREST", "Forest"),
    ("rose", "THEME_ROSE", "Rose"),
    ("gold", "THEME_GOLD", "Gold"),
    ("midnight", "THEME_MIDNIGHT", "Midnight"),
    ("crimson", "THEME_CRIMSON", "Crimson"),
    ("lavender", "THEME_LAVENDER", "Lavender"),
    ("arctic", "THEME_ARCTIC", "Arctic"),
    ("espresso", "THEME_ESPRESSO", "Espresso"),
    # European (5)
    ("corporate", "THEME_CORPORATE", "Corporate"),
    ("industrial", "THEME_INDUSTRIAL", "Industrial"),
    ("vienna", "THEME_VIENNA", "Vienna"),
    ("alpine", "THEME_ALPINE", "Alpine"),
    ("finance", "THEME_FINANCE", "Finance"),
    # Flat (10)
    ("materialBlue", "THEME_MATERIAL_BLUE", "MaterialBlue"),
    ("materialDark", "THEME_MATERIAL_DARK", "MaterialDark"),
    ("flatRed", "THEME_FLAT_RED", "FlatRed"),
    ("flatNavy", "THEME_FLAT_NAVY", "FlatNavy"),
    ("swiss", "THEME_SWISS", "Swiss"),
    ("bauhaus", "THEME_BAUHAUS", "Bauhaus"),
    ("mono", "THEME_MONO", "Mono"),
    ("paper", "THEME_PAPER", "Paper"),
    ("slate", "THEME_SLATE", "Slate"),
    ("blueprint", "THEME_BLUEPRINT", "Blueprint"),
    # Canva (10)
    ("candy", "THEME_CANDY", "Candy"),
    ("mint", "THEME_MINT", "Mint"),
    ("coral", "THEME_CORAL", "Coral"),
    ("sky", "THEME_SKY", "Sky"),
    ("grape", "THEME_GRAPE", "Grape"),
    ("charcoal", "THEME_CHARCOAL", "Charcoal"),
    ("peach", "THEME_PEACH", "Peach"),
    ("oceanDark", "THEME_OCEAN_DARK", "OceanDark"),
    ("cream", "THEME_CREAM", "Cream"),
    ("electric", "THEME_ELECTRIC", "Electric"),
]

def get_theme_imports():
    """Generate theme import statement."""
    consts = [t[1] for t in THEMES]
    return ", ".join(consts)

def generate_variants_json(template_name: str, prefix: str, layouts: List[str]) -> List[dict]:
    """Generate variants array for templates.json."""
    variants = []
    for theme_name, theme_const, theme_display in THEMES:
        for layout in layouts:
            layout_cap = layout[0].upper() + layout[1:]
            variant_id = f"{prefix}-{theme_display}{layout_cap}"
            variants.append({
                "id": variant_id,
                "theme": theme_name,
                "layout": layout,
                "previewUrl": f"player/?comp={variant_id}"
            })
    return variants

def generate_root_compositions(prefix: str, layouts: List[str]) -> str:
    """Generate Composition registrations for Root.tsx."""
    lines = []
    for theme_name, theme_const, theme_display in THEMES:
        for layout in layouts:
            layout_cap = layout[0].upper() + layout[1:]
            comp_name = f"{prefix}{theme_display}{layout_cap}"
            comp_id = f"{prefix}-{theme_display}{layout_cap}"
            lines.append(f'      <Composition id="{comp_id}" component={{{comp_name}}} durationInFrames={{150}} fps={{30}} width={{1080}} height={{1920}} defaultProps={{{{ brandKit: undefined }}}} />')
    return "\n".join(lines)

def generate_root_imports(prefix: str, layouts: List[str]) -> str:
    """Generate import statement for Root.tsx."""
    imports = []
    for theme_name, theme_const, theme_display in THEMES:
        for layout in layouts:
            layout_cap = layout[0].upper() + layout[1:]
            imports.append(f"{prefix}{theme_display}{layout_cap}")
    return ", ".join(imports)

def main():
    parser = argparse.ArgumentParser(description='Generate expanded showcase files')
    parser.add_argument('template', nargs='?', help='Template name to expand')
    parser.add_argument('--all', action='store_true', help='Expand all templates')
    parser.add_argument('--json-only', action='store_true', help='Only output JSON variants')
    args = parser.parse_args()

    if args.json_only and args.template:
        # Example: generate JSON for a template
        # This would need template-specific layout info
        print("JSON generation requires template layout info")
        return

    if not args.template and not args.all:
        parser.print_help()
        return

    print(f"Total themes: {len(THEMES)}")
    print(f"Theme constants: {get_theme_imports()[:100]}...")

if __name__ == '__main__':
    main()
