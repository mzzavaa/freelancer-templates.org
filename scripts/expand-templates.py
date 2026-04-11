#!/usr/bin/env python3
"""
Expand all templates to support all 42 themes x their layouts.

This script:
1. Reads existing template showcase files to understand their layouts
2. Generates new showcase exports for all 42 themes x layouts
3. Updates Root.tsx with new composition registrations
4. Updates data/templates.json with new variants
5. Updates content/library/*.md files

Usage:
  python3 scripts/expand-templates.py --template testimonial  # Expand single template
  python3 scripts/expand-templates.py --all                   # Expand all templates
  python3 scripts/expand-templates.py --list                  # List templates and their status
"""

import json
import os
import re
import argparse
from pathlib import Path
from typing import Dict, List, Tuple, Optional

# All 42 themes organized by group
THEMES = {
    "original": [
        ("dark", "THEME_DARK", "Dark"),
        ("clean", "THEME_CLEAN", "Clean"),
        ("bold", "THEME_BOLD", "Bold"),
        ("warm", "THEME_WARM", "Warm"),
        ("minimal", "THEME_MINIMAL", "Minimal"),
        ("neon", "THEME_NEON", "Neon"),
        ("lindamohamed", "THEME_LINDAMOHAMED", "Lindamohamed"),
    ],
    "extended": [
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
    ],
    "european": [
        ("corporate", "THEME_CORPORATE", "Corporate"),
        ("industrial", "THEME_INDUSTRIAL", "Industrial"),
        ("vienna", "THEME_VIENNA", "Vienna"),
        ("alpine", "THEME_ALPINE", "Alpine"),
        ("finance", "THEME_FINANCE", "Finance"),
    ],
    "flat": [
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
    ],
    "canva": [
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
    ],
}

# Flatten themes list
ALL_THEMES = []
for group in THEMES.values():
    ALL_THEMES.extend(group)


def get_all_theme_consts() -> List[str]:
    """Get all theme constant names for imports."""
    return [t[1] for t in ALL_THEMES]


def capitalize_layout(layout: str) -> str:
    """Convert layout name to PascalCase for component names."""
    return layout[0].upper() + layout[1:]


def analyze_showcase_file(filepath: str) -> Dict:
    """Analyze a showcase file to extract template info."""
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Extract template name from exports
    export_pattern = r'export const (\w+)(\w+)(\w+):'
    exports = re.findall(export_pattern, content)
    
    # Extract layouts from the component definitions
    layout_pattern = r'layout="(\w+)"'
    layouts = list(set(re.findall(layout_pattern, content)))
    
    # Extract the base component import
    import_pattern = r'import \{ (\w+)(?:,|\s)'
    imports = re.findall(import_pattern, content)
    base_component = imports[0] if imports else None
    
    return {
        'filepath': filepath,
        'layouts': layouts,
        'base_component': base_component,
        'exports': exports,
        'content': content,
    }


def list_templates():
    """List all templates and their current variant counts."""
    templates_dir = Path('src/remotion/templates')
    
    with open('data/templates.json', 'r') as f:
        templates_data = json.load(f)
    
    template_counts = {t['slug']: len(t.get('variants', [])) for t in templates_data}
    
    print(f"{'Template':<30} {'Current':<10} {'Target':<10} {'Status'}")
    print("-" * 60)
    
    for template_dir in sorted(templates_dir.iterdir()):
        if not template_dir.is_dir():
            continue
        
        showcase_file = template_dir / f"{template_dir.name.title().replace('_', '')}Showcase.tsx"
        if not showcase_file.exists():
            # Try other naming patterns
            for f in template_dir.glob("*Showcase.tsx"):
                showcase_file = f
                break
        
        if showcase_file.exists():
            info = analyze_showcase_file(str(showcase_file))
            layouts = info['layouts']
            target = len(ALL_THEMES) * len(layouts) if layouts else 0
            current = template_counts.get(template_dir.name, 0)
            status = "OK" if current >= target else "NEEDS EXPANSION"
            print(f"{template_dir.name:<30} {current:<10} {target:<10} {status}")


def main():
    parser = argparse.ArgumentParser(description='Expand templates to all themes')
    parser.add_argument('--template', help='Expand a specific template')
    parser.add_argument('--all', action='store_true', help='Expand all templates')
    parser.add_argument('--list', action='store_true', help='List templates and status')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be done')
    
    args = parser.parse_args()
    
    if args.list:
        list_templates()
    elif args.template:
        print(f"Expanding template: {args.template}")
        # TODO: Implement single template expansion
    elif args.all:
        print("Expanding all templates...")
        # TODO: Implement all templates expansion
    else:
        parser.print_help()


if __name__ == '__main__':
    main()
