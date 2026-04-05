#!/usr/bin/env bash
# generate-thumbnails.sh
# Renders PNG thumbnails for all (or changed) Remotion compositions.
#
# Usage:
#   bash scripts/generate-thumbnails.sh           # render all compositions
#   bash scripts/generate-thumbnails.sh --changed # only compositions in changed templates
#   bash scripts/generate-thumbnails.sh Testimonial-DarkCentered  # single comp

set -euo pipefail

ENTRY="src/remotion/index.ts"
OUT_DIR="static/previews/showcase"
FRAME=60  # frame to snapshot (60 = 2s in at 30fps, content is visible for most compositions)

mkdir -p "$OUT_DIR"

# Ensure Chrome is available for Remotion
npx remotion browser ensure --log=error 2>/dev/null || true

render_comp() {
  local id="$1"
  local out="$OUT_DIR/${id}.png"
  echo "  rendering: $id"
  npx remotion still "$ENTRY" "$id" "$out" --frame="$FRAME" --overwrite --log=error 2>&1 | tail -1 || \
    echo "  WARN: failed to render $id"
}

# ── Single composition mode ──────────────────────────────────────
if [[ $# -ge 1 && "$1" != "--changed" ]]; then
  render_comp "$1"
  exit 0
fi

# ── Determine which composition IDs to render ───────────────────
if [[ "${1:-}" == "--changed" ]]; then
  # Find template slugs that changed since last commit
  CHANGED_SLUGS=$(git diff --name-only HEAD~1 HEAD 2>/dev/null | \
    grep "^src/remotion/templates/" | \
    sed 's|src/remotion/templates/||' | \
    cut -d/ -f1 | sort -u)

  if [[ -z "$CHANGED_SLUGS" ]]; then
    echo "No template changes detected. Skipping thumbnail generation."
    exit 0
  fi

  echo "Changed slugs: $CHANGED_SLUGS"
  IDS=()
  while IFS= read -r slug; do
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
  done <<< "$CHANGED_SLUGS"
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

echo "Done. Thumbnails saved to $OUT_DIR/"
