#!/bin/bash
# Render thumbnails locally for all or specific compositions
# Supports both still images (PNG) and animated videos (MP4)
#
# Usage:
#   ./scripts/render-thumbnails.sh                    # Render missing stills only
#   ./scripts/render-thumbnails.sh all                # Render all stills
#   ./scripts/render-thumbnails.sh Testimonial        # Render all Testimonial stills
#   ./scripts/render-thumbnails.sh Testimonial-DarkCentered  # Render specific still
#
# Options:
#   --still       Render still images only (default)
#   --video       Render animated videos only
#   --both        Render both stills and videos
#   --parallel N  Render N compositions in parallel (default: 1)
#   --frames N    Number of frames for video (default: 60, ~2 seconds at 30fps)
#
# Examples:
#   ./scripts/render-thumbnails.sh all --both              # All stills + videos
#   ./scripts/render-thumbnails.sh Testimonial --video     # Testimonial videos only
#   ./scripts/render-thumbnails.sh missing --both --parallel 4  # Missing, both formats, 4 parallel

set -e

# Default values
MODE="missing"
RENDER_STILL=true
RENDER_VIDEO=false
PARALLEL=1
VIDEO_FRAMES=60
ENTRY="src/remotion/index.ts"
SHOWCASE_DIR="static/previews/showcase"
HERO_DIR="static/previews/hero"

# Parse arguments
POSITIONAL_ARGS=()
while [[ $# -gt 0 ]]; do
  case $1 in
    --still)
      RENDER_STILL=true
      RENDER_VIDEO=false
      shift
      ;;
    --video)
      RENDER_STILL=false
      RENDER_VIDEO=true
      shift
      ;;
    --both)
      RENDER_STILL=true
      RENDER_VIDEO=true
      shift
      ;;
    --parallel)
      PARALLEL="$2"
      shift 2
      ;;
    --frames)
      VIDEO_FRAMES="$2"
      shift 2
      ;;
    --help|-h)
      echo "Usage: $0 [MODE] [OPTIONS]"
      echo ""
      echo "Modes:"
      echo "  missing              Render only missing thumbnails (default)"
      echo "  all                  Render all thumbnails"
      echo "  <pattern>            Render compositions matching pattern (e.g., Testimonial)"
      echo "  <composition-id>     Render specific composition (e.g., Testimonial-DarkCentered)"
      echo ""
      echo "Options:"
      echo "  --still              Render still images only (PNG) - default"
      echo "  --video              Render animated videos only (MP4)"
      echo "  --both               Render both stills and videos"
      echo "  --parallel N         Render N compositions in parallel (default: 1)"
      echo "  --frames N           Number of frames for video (default: 60)"
      echo "  --help, -h           Show this help message"
      echo ""
      echo "Examples:"
      echo "  $0                           # Render missing stills"
      echo "  $0 all --both                # Render all stills and videos"
      echo "  $0 Testimonial --video       # Render Testimonial videos only"
      echo "  $0 all --both --parallel 4   # Render all, both formats, 4 parallel"
      exit 0
      ;;
    *)
      POSITIONAL_ARGS+=("$1")
      shift
      ;;
  esac
done

# Restore positional arguments
set -- "${POSITIONAL_ARGS[@]}"
MODE="${1:-missing}"

mkdir -p "$SHOWCASE_DIR" "$HERO_DIR"

# Get all composition IDs from templates.json
get_all_ids() {
  python3 -c "
import json
with open('data/templates.json') as f:
  data = json.load(f)
for t in data:
  for v in t.get('variants', []):
    print(v['id'])
"
}

# Get missing composition IDs based on render mode
get_missing_ids() {
  local check_still="$RENDER_STILL"
  local check_video="$RENDER_VIDEO"
  python3 -c "
import json, os
check_still = '$check_still' == 'true'
check_video = '$check_video' == 'true'
with open('data/templates.json') as f:
  data = json.load(f)
for t in data:
  for v in t.get('variants', []):
    vid = v['id']
    png = f'static/previews/showcase/{vid}.png'
    mp4 = f'static/previews/hero/{vid}.mp4'
    missing_still = check_still and not os.path.exists(png)
    missing_video = check_video and not os.path.exists(mp4)
    if missing_still or missing_video:
      print(vid)
"
}

# Get IDs matching a pattern
get_matching_ids() {
  local pattern="$1"
  python3 -c "
import json
pattern = '$pattern'
with open('data/templates.json') as f:
  data = json.load(f)
for t in data:
  for v in t.get('variants', []):
    vid = v['id']
    if pattern in vid:
      print(vid)
"
}

# Render a single composition
render_one() {
  local id="$1"
  local status=""
  
  # Render still (frame 60)
  if [[ "$RENDER_STILL" == "true" ]]; then
    if npx remotion still "$ENTRY" "$id" \
      "${SHOWCASE_DIR}/${id}.png" \
      --frame=60 --overwrite --log=error 2>/dev/null; then
      status="still:OK"
    else
      status="still:FAIL"
    fi
  fi
  
  # Render video (frames 0 to VIDEO_FRAMES-1)
  if [[ "$RENDER_VIDEO" == "true" ]]; then
    local end_frame=$((VIDEO_FRAMES - 1))
    if npx remotion render "$ENTRY" "$id" \
      "${HERO_DIR}/${id}.mp4" \
      --frames=0-${end_frame} --codec=h264 --overwrite --log=error 2>/dev/null; then
      status="${status:+$status, }video:OK"
    else
      status="${status:+$status, }video:FAIL"
    fi
  fi
  
  echo "  $id - $status"
}

# Export function for parallel execution
export -f render_one
export RENDER_STILL RENDER_VIDEO VIDEO_FRAMES ENTRY SHOWCASE_DIR HERO_DIR

# Main logic
case "$MODE" in
  all)
    echo "Rendering ALL compositions..."
    IDS=$(get_all_ids)
    ;;
  missing)
    echo "Rendering MISSING compositions only..."
    IDS=$(get_missing_ids)
    ;;
  *)
    # Check if it's a specific composition ID or a pattern
    if [[ "$MODE" == *"-"* ]]; then
      # Specific composition ID (contains hyphen)
      echo "Rendering specific composition: $MODE"
      IDS="$MODE"
    else
      # Pattern match (e.g., "Testimonial" matches all Testimonial variants)
      echo "Rendering compositions matching: $MODE"
      IDS=$(get_matching_ids "$MODE")
    fi
    ;;
esac

if [[ -z "$IDS" ]]; then
  echo "No compositions to render."
  exit 0
fi

COUNT=$(echo "$IDS" | wc -l | tr -d ' ')
echo "Found $COUNT composition(s) to render"
echo ""
echo "Render mode: still=$RENDER_STILL, video=$RENDER_VIDEO"
echo "Parallel jobs: $PARALLEL"
if [[ "$RENDER_VIDEO" == "true" ]]; then
  echo "Video frames: $VIDEO_FRAMES (0-$((VIDEO_FRAMES-1)))"
fi
echo ""
echo "Starting render..."
echo ""

# Render compositions
if [[ "$PARALLEL" -gt 1 ]]; then
  # Parallel rendering using xargs
  echo "$IDS" | xargs -P "$PARALLEL" -I {} bash -c 'render_one "$@"' _ {}
else
  # Sequential rendering
  echo "$IDS" | while IFS= read -r id; do
    [[ -z "$id" ]] && continue
    render_one "$id"
  done
fi

echo ""
echo "Done!"
echo "  Stills saved to: $SHOWCASE_DIR"
if [[ "$RENDER_VIDEO" == "true" ]]; then
  echo "  Videos saved to: $HERO_DIR"
fi
