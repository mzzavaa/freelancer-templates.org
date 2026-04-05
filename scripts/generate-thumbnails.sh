#!/usr/bin/env bash
# generate-thumbnails.sh
# Renders PNG thumbnails and 2-second MP4 hover previews for all (or changed) compositions.
#
# Usage:
#   bash scripts/generate-thumbnails.sh           # render all compositions
#   bash scripts/generate-thumbnails.sh --changed # only compositions in changed templates
#   bash scripts/generate-thumbnails.sh Testimonial-DarkCentered  # single comp

set -euo pipefail

ENTRY="src/remotion/index.ts"
PNG_DIR="static/previews/showcase"
MP4_DIR="static/previews/hero"
FRAME=60        # still snapshot at frame 60 (2s in at 30fps — content visible)
MP4_FRAMES="0-59"  # 2-second hover preview clip

mkdir -p "$PNG_DIR" "$MP4_DIR"

# Ensure Chrome is available for Remotion
npx remotion browser ensure --log=error 2>/dev/null || true

render_comp() {
  local id="$1"
  echo "  rendering: $id"
  npx remotion still "$ENTRY" "$id" "$PNG_DIR/${id}.png" \
    --frame="$FRAME" --overwrite --log=error 2>&1 | tail -1 || \
    echo "  WARN: still failed for $id"
  npx remotion render "$ENTRY" "$id" "$MP4_DIR/${id}.mp4" \
    --frames="$MP4_FRAMES" --codec=h264 --overwrite --log=error 2>&1 | tail -1 || \
    echo "  WARN: render failed for $id"
}

# ── Single composition mode ──────────────────────────────────────
if [[ $# -ge 1 && "$1" != "--changed" ]]; then
  render_comp "$1"
  exit 0
fi

# ── Determine which composition IDs to render ───────────────────
if [[ "${1:-}" == "--changed" ]]; then
  CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD 2>/dev/null)

  # Slugs from src/remotion/templates/<slug>/
  CHANGED_SLUGS=$(echo "$CHANGED_FILES" | \
    grep "^src/remotion/templates/" | \
    sed 's|src/remotion/templates/||' | \
    cut -d/ -f1 | sort -u)

  # Extra slugs for non-templates source dirs (direct mapping)
  EXTRA_SLUGS=""
  echo "$CHANGED_FILES" | grep -q "^src/remotion/GameDay/" && EXTRA_SLUGS="$EXTRA_SLUGS communitygameday"

  ALL_SLUGS=$(printf '%s\n%s\n' "$CHANGED_SLUGS" "$EXTRA_SLUGS" | tr ' ' '\n' | grep -v '^$' | sort -u)

  if [[ -z "$ALL_SLUGS" ]]; then
    echo "No template changes detected. Skipping thumbnail generation."
    exit 0
  fi

  echo "Changed slugs: $ALL_SLUGS"
  IDS=()
  while IFS= read -r slug; do
    [[ -z "$slug" ]] && continue
    # Extract variant IDs from data/templates.json for this slug
    # Pass slug as argv[1] to avoid shell injection
    VARIANT_IDS=$(python3 - "$slug" 2>/dev/null <<'PYEOF'
import json, sys
slug = sys.argv[1]
with open('data/templates.json') as f:
    data = json.load(f)
for t in data:
    if t['slug'] == slug:
        for v in t.get('variants', []):
            print(v['id'])
PYEOF
)
    while IFS= read -r id; do
      [[ -n "$id" ]] && IDS+=("$id")
    done <<< "$VARIANT_IDS"
  done <<< "$ALL_SLUGS"
else
  # Render ALL compositions from data/templates.json
  echo "Rendering thumbnails for all compositions..."
  mapfile -t IDS < <(python3 -c "
import json
with open('data/templates.json') as f:
  data = json.load(f)
for t in data:
  for v in t.get('variants', []):
    print(v['id'])
")
fi

echo "Rendering ${#IDS[@]} compositions..."
for id in "${IDS[@]}"; do
  render_comp "$id"
done

echo "Done. PNGs → $PNG_DIR/  |  MP4s → $MP4_DIR/"
