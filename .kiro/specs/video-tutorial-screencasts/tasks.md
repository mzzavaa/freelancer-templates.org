# Implementation Plan: Video Tutorial Screencasts

## Overview

This implementation plan creates an automated system for producing animated video tutorials that demonstrate Remotion Studio interactions. The system uses Playwright for screen capture, Remotion for overlay rendering, and integrates with Hugo for embedding tutorials in premium tips pages.

The implementation follows a bottom-up approach: first establishing the foundation (types, utilities), then building overlay components, followed by the capture pipeline, render pipeline, and finally Hugo integration.

## Tasks

- [x] 1. Set up project structure and core types
  - [x] 1.1 Create directory structure for tutorial system
    - Create `src/remotion/tutorials/` directory with `overlays/` and `utils/` subdirectories
    - Create `scripts/tutorials/capture/` directory with category subdirectories
    - Create `data/tutorials/overlay-configs/` and `data/tutorials/templates/` directories
    - Create `static/tutorials/` directory with category subdirectories
    - _Requirements: 13.1_

  - [x] 1.2 Define TypeScript interfaces and types
    - Create `src/remotion/tutorials/types.ts` with all interfaces:
      - `TutorialCompositionProps`, `CaptureMetadata`, `FrameData`, `ClickEvent`
      - `CursorOverlayProps`, `ZoomEffectProps`, `ZoomConfig`
      - `HighlightBoxProps`, `HighlightConfig`
      - `AnnotationOverlayProps`, `AnnotationConfig`
      - `OverlayConfig` (full overlay configuration type)
    - _Requirements: 2.5, 3.3, 4.4, 5.1, 7.1_

  - [x] 1.3 Create easing utility functions
    - Create `src/remotion/tutorials/utils/easing.ts`
    - Implement `easeInOut`, `easeOut`, and `spring` easing functions
    - Export interpolation helpers for smooth animations
    - _Requirements: 2.2, 3.4_

  - [x] 1.4 Create frame loader utility
    - Create `src/remotion/tutorials/utils/frameLoader.ts`
    - Implement function to load frame sequence from directory
    - Implement function to parse capture metadata JSON
    - Handle missing frames gracefully with fallback to previous frame
    - _Requirements: 6.1_

- [x] 2. Implement CursorOverlay component
  - [x] 2.1 Create CursorOverlay base component
    - Create `src/remotion/tutorials/overlays/CursorOverlay.tsx`
    - Render cursor icon at recorded mouse position for each frame
    - Support configurable cursor styles (pointer, hand, text)
    - Accept mouse position data from capture metadata
    - _Requirements: 2.1, 2.4, 2.5_

  - [x] 2.2 Add cursor animation smoothing
    - Implement smooth interpolation between recorded positions using easing functions
    - Use configurable smoothing factor for animation
    - _Requirements: 2.2_

  - [x] 2.3 Implement click indicator animation
    - Add ripple effect animation when click event occurs
    - Configure indicator duration (300-500ms)
    - Ensure visibility against any background
    - _Requirements: 2.3, 2.6_

  - [x] 2.4 Write property tests for CursorOverlay
    - **Property 1: Cursor Position Accuracy** - cursor renders at recorded position ±1 pixel
    - **Property 2: Cursor Animation Smoothness** - no discontinuities between frames
    - **Property 3: Click Indicator Visibility** - indicator visible for correct duration
    - **Validates: Requirements 2.1, 2.2, 2.3**

- [x] 3. Implement ZoomEffect component
  - [x] 3.1 Create ZoomEffect base component
    - Create `src/remotion/tutorials/overlays/ZoomEffect.tsx`
    - Accept children to apply zoom transformation
    - Support configurable zoom levels (1.5x to 4x)
    - Accept target region by center coordinates or bounding box
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 3.2 Implement zoom animation transitions
    - Add smooth zoom-in animation with configurable duration (default 500ms)
    - Implement hold duration at zoomed level
    - Add smooth zoom-out animation back to full-frame view
    - Use easing functions for smooth transitions
    - _Requirements: 3.4, 3.5, 3.6, 3.7_

  - [x] 3.3 Write property tests for ZoomEffect
    - **Property 4: Zoom Transition Smoothness** - scale interpolates smoothly with no discontinuities
    - **Validates: Requirements 3.1, 3.4, 3.6, 3.7**

- [x] 4. Implement HighlightBox component
  - [x] 4.1 Create HighlightBox base component
    - Create `src/remotion/tutorials/overlays/HighlightBox.tsx`
    - Render visible border around specified region
    - Support configurable styles (color, width, radius, glow)
    - Accept region coordinates from overlay config
    - _Requirements: 4.1, 4.3, 4.4_

  - [x] 4.2 Add highlight animations
    - Implement pulsing animation to draw attention
    - Add fade-in and fade-out animations
    - Ensure visibility against light and dark backgrounds
    - _Requirements: 4.2, 4.5, 4.6_

  - [x] 4.3 Write property tests for HighlightBox
    - **Property 5: Highlight Region Accuracy** - border positioned at correct coordinates ±1 pixel
    - **Property 6: Fade Animation Interpolation** - opacity interpolates linearly during fade
    - **Validates: Requirements 4.1, 4.5**

- [x] 5. Implement AnnotationOverlay component
  - [x] 5.1 Create AnnotationOverlay base component
    - Create `src/remotion/tutorials/overlays/AnnotationOverlay.tsx`
    - Render text labels at specified positions
    - Support configurable text styles (font size, weight, color, background pill)
    - Support step numbers for multi-step tutorials
    - _Requirements: 5.1, 5.3, 5.7_

  - [x] 5.2 Implement arrow indicators
    - Render curved and straight arrows pointing to UI elements
    - Support configurable arrow styles (color, thickness, arrowhead)
    - Position labels to avoid overlapping with highlighted elements
    - _Requirements: 5.2, 5.4, 5.6_

  - [x] 5.3 Add annotation animations
    - Implement fade-in effects for text and arrows
    - _Requirements: 5.5_

  - [x] 5.4 Write property tests for AnnotationOverlay
    - **Property 7: Annotation Position Accuracy** - label rendered at correct position ±1 pixel
    - **Property 8: Arrow Target Accuracy** - arrow endpoint at target ±2 pixels
    - **Property 9: Label-Highlight Non-Overlap** - label does not intersect highlight region
    - **Validates: Requirements 5.1, 5.2, 5.6**

- [x] 6. Checkpoint - Verify overlay components
  - Ensure all overlay components render correctly in isolation
  - Run property tests to verify correctness properties
  - Ask the user if questions arise

- [x] 7. Implement TutorialComposition
  - [x] 7.1 Create TutorialComposition component
    - Create `src/remotion/tutorials/TutorialComposition.tsx`
    - Accept props: frameSequencePath, metadataPath, overlayConfig, fps, dimensions
    - Load frame sequence and metadata using frameLoader utility
    - _Requirements: 6.1_

  - [x] 7.2 Implement layer composition
    - Layer components in correct order: frames → zoom → highlight → cursor → annotation
    - Synchronize all overlay animations with frame timing
    - Support configurable frame rate (default 30fps) and dimensions (default 1280x720)
    - _Requirements: 6.2, 6.3, 6.4, 6.5_

  - [x] 7.3 Add GIF optimization support
    - Implement reduced frame rate and dimensions for GIF output
    - Optimize for file size while maintaining readability
    - _Requirements: 6.6_

  - [x] 7.4 Create tutorial composition index
    - Create `src/remotion/tutorials/index.ts` to export all compositions
    - Register TutorialComposition with Remotion
    - _Requirements: 6.1_

  - [x] 7.5 Write property tests for TutorialComposition
    - **Property 10: Overlay Timeline Visibility** - overlays visible only within start/end frames
    - **Property 11: Overlay Synchronization** - all layers render correct state for each frame
    - **Validates: Requirements 6.3, 7.2, 7.4**

- [x] 8. Implement overlay configuration validation
  - [x] 8.1 Create JSON schema for overlay configuration
    - Create `data/tutorials/overlay-config.schema.json`
    - Define schema for cursor, zoom, highlight, and annotation overlays
    - Support timeline-based overlay definitions with start/end frames
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 8.2 Implement configuration validator
    - Create `scripts/tutorials/validate-configs.ts`
    - Validate overlay configs against JSON schema
    - Return clear error messages for invalid configurations
    - _Requirements: 7.5_

  - [x] 8.3 Create overlay config templates
    - Create `data/tutorials/templates/basic-click.json`
    - Create `data/tutorials/templates/zoom-and-click.json`
    - Create `data/tutorials/templates/multi-step.json`
    - _Requirements: 7.6_

  - [x] 8.4 Write property tests for config validation
    - **Property 12: Config Validation Error Specificity** - errors contain field path, reason, expected type
    - **Validates: Requirements 7.5**

- [x] 9. Checkpoint - Verify composition and configuration
  - Ensure TutorialComposition renders with sample data
  - Verify config validation catches invalid configurations
  - Ask the user if questions arise

- [x] 10. Implement capture pipeline
  - [x] 10.1 Create BaseCapture class
    - Create `scripts/tutorials/capture/base-capture.ts`
    - Implement Playwright browser connection to configurable URL (default localhost:3000)
    - Support configurable viewport dimensions (default 1280x720)
    - Support configurable capture interval (default 100ms)
    - _Requirements: 1.1, 1.8_

  - [x] 10.2 Implement interaction methods
    - Add navigate, click, clickAt, type, wait, waitForSelector, hover methods
    - Record mouse position at each capture interval
    - Record click events with timestamps and coordinates
    - _Requirements: 1.3, 1.4, 1.5_

  - [x] 10.3 Implement capture output
    - Capture screenshots at configurable intervals during interactions
    - Output numbered PNG frames to specified directory
    - Output JSON metadata file with mouse positions, clicks, and timing
    - Handle Studio not accessible with descriptive error message
    - _Requirements: 1.2, 1.6, 1.7_

  - [x] 10.4 Write unit tests for BaseCapture
    - Test mouse position recording
    - Test click event capture with timestamps
    - Test interaction step execution order
    - _Requirements: 1.3, 1.4, 1.5_

- [ ] 11. Create capture scripts for Studio Basics tutorials
  - [x] 11.1 Create open-props-panel capture script
    - Create `scripts/tutorials/capture/studio-basics/open-props-panel.ts`
    - Navigate to Studio, hover over Props panel toggle, click to open
    - Capture 5-15 seconds of interaction
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 11.2 Create timeline-scrubber capture script
    - Create `scripts/tutorials/capture/studio-basics/timeline-scrubber.ts`
    - Demonstrate using timeline scrubber to navigate frames
    - _Requirements: 9.1_

  - [x] 11.3 Create preview-controls capture script
    - Create `scripts/tutorials/capture/studio-basics/preview-controls.ts`
    - Demonstrate play/pause controls for composition preview
    - _Requirements: 9.1_

  - [x] 11.4 Create switch-compositions capture script
    - Create `scripts/tutorials/capture/studio-basics/switch-compositions.ts`
    - Demonstrate switching between compositions in sidebar
    - _Requirements: 9.1_

  - [x] 11.5 Create keyboard-shortcuts capture script
    - Create `scripts/tutorials/capture/studio-basics/keyboard-shortcuts.ts`
    - Demonstrate spacebar for play, arrow keys for frames
    - _Requirements: 9.1_

- [x] 12. Create capture scripts for Editing Props tutorials
  - [x] 12.1 Create locate-props-panel capture script
    - Create `scripts/tutorials/capture/editing-props/locate-props-panel.ts`
    - Demonstrate locating and opening the Props panel
    - _Requirements: 10.1_

  - [x] 12.2 Create edit-text-prop capture script
    - Create `scripts/tutorials/capture/editing-props/edit-text-prop.ts`
    - Demonstrate editing text content in a text prop field
    - Show before and after state of the change
    - _Requirements: 10.1, 10.3_

  - [x] 12.3 Create color-picker capture script
    - Create `scripts/tutorials/capture/editing-props/color-picker.ts`
    - Demonstrate changing color values using color picker
    - Use zoom effects to show small input fields clearly
    - _Requirements: 10.1, 10.4_

  - [x] 12.4 Create numeric-values capture script
    - Create `scripts/tutorials/capture/editing-props/numeric-values.ts`
    - Demonstrate adjusting numeric values (duration, size, position)
    - _Requirements: 10.1_

  - [x] 12.5 Create save-preview capture script
    - Create `scripts/tutorials/capture/editing-props/save-preview.ts`
    - Demonstrate saving changes and seeing preview update
    - _Requirements: 10.1_

- [x] 13. Create capture scripts for CLI Rendering tutorials
  - [x] 13.1 Create open-terminal capture script
    - Create `scripts/tutorials/capture/cli-rendering/open-terminal.ts`
    - Demonstrate opening terminal and navigating to project directory
    - Show terminal with clear, readable text
    - _Requirements: 11.1, 11.2_

  - [x] 13.2 Create basic-render capture script
    - Create `scripts/tutorials/capture/cli-rendering/basic-render.ts`
    - Demonstrate running basic render command with composition name
    - Use annotations to explain command flags
    - _Requirements: 11.1, 11.3_

  - [x] 13.3 Create format-options capture script
    - Create `scripts/tutorials/capture/cli-rendering/format-options.ts`
    - Demonstrate specifying output format and quality options
    - _Requirements: 11.1_

  - [x] 13.4 Create render-progress capture script
    - Create `scripts/tutorials/capture/cli-rendering/render-progress.ts`
    - Demonstrate viewing render progress and completion
    - Highlight output file location after rendering completes
    - _Requirements: 11.1, 11.4_

- [x] 14. Checkpoint - Verify capture pipeline
  - Test capture scripts execute successfully against running Remotion Studio
  - Verify frame sequences and metadata are generated correctly
  - Ask the user if questions arise

- [x] 15. Create overlay configurations for all tutorials
  - [x] 15.1 Create overlay configs for Studio Basics tutorials
    - Create JSON configs in `data/tutorials/overlay-configs/studio-basics/`
    - Configure cursor, zoom, highlight, and annotation overlays for each tutorial
    - Include cursor movement, highlight on target, click indicator, and brief annotation
    - _Requirements: 9.4_

  - [x] 15.2 Create overlay configs for Editing Props tutorials
    - Create JSON configs in `data/tutorials/overlay-configs/editing-props/`
    - Configure zoom effects for small input fields
    - _Requirements: 10.4_

  - [x] 15.3 Create overlay configs for CLI Rendering tutorials
    - Create JSON configs in `data/tutorials/overlay-configs/cli-rendering/`
    - Configure annotations to explain command flags and options
    - _Requirements: 11.3_

- [x] 16. Implement render pipeline
  - [x] 16.1 Create render pipeline orchestration script
    - Create `scripts/tutorials/render-pipeline.ts`
    - Accept tutorial definition file with capture script, overlay config, output settings
    - Execute capture, validate config, render composition, output to static directory
    - Provide progress output during rendering
    - _Requirements: 8.1, 8.2, 8.4_

  - [x] 16.2 Implement format-specific rendering
    - Render MP4 with H.264 encoding for browser compatibility
    - Render optimized GIF (under 2MB for 10-second tutorials)
    - Render WebM as alternative for smaller file sizes
    - Generate poster frame for video player
    - _Requirements: 15.1, 15.2, 15.3, 9.5_

  - [x] 16.3 Implement error handling and cleanup
    - Exit with descriptive error if any step fails
    - Clean up temporary capture files after successful rendering (configurable)
    - _Requirements: 8.5, 8.6_

  - [x] 16.4 Create batch render script
    - Create `scripts/tutorials/batch-render.ts`
    - Support rendering multiple tutorials in sequence
    - _Requirements: 8.3_

  - [x] 16.5 Write property tests for render pipeline
    - **Property 13: Batch Render Completeness** - N tutorials produce N output sets with all formats
    - **Validates: Requirements 8.3**

- [x] 17. Create tutorial manifest and scaffold tool
  - [x] 17.1 Create tutorial manifest
    - Create `data/tutorials/manifest.json`
    - List all tutorials with ID, category, page, title, duration, file paths
    - _Requirements: 13.3, 13.4_

  - [x] 17.2 Create scaffold tutorial CLI
    - Create `scripts/tutorials/scaffold-tutorial.ts`
    - Generate capture script template with common interaction patterns
    - Generate overlay configuration template
    - Generate tutorial definition file
    - _Requirements: 14.1, 14.2_

  - [x] 17.3 Add npm scripts for tutorial workflow
    - Add `tutorial:capture`, `tutorial:render`, `tutorial:render:all` scripts
    - Add `tutorial:scaffold`, `tutorial:preview`, `tutorial:validate` scripts
    - Support re-rendering individual tutorials without affecting others
    - _Requirements: 14.3, 14.4_

- [x] 18. Checkpoint - Verify render pipeline
  - Test render pipeline produces MP4, GIF, and WebM outputs
  - Verify file sizes meet performance requirements
  - Ask the user if questions arise

- [x] 19. Implement Hugo integration
  - [x] 19.1 Create tips-video-embed partial
    - Create `layouts/partials/tips-video-embed.html`
    - Support embedding MP4/WebM video and animated GIF formats
    - Display poster frame before playback
    - Include play/pause controls and loop option
    - Make responsive and maintain aspect ratio
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

  - [x] 19.2 Extend tips-card partial
    - Modify `layouts/partials/tips-card.html` to support screencast field
    - Display video instead of or alongside text content when screencast specified
    - _Requirements: 12.5, 12.6_

  - [x] 19.3 Add CSS styles for video embed
    - Create styles in `assets/css/` for `.tips-video` component
    - Style video player, GIF display, and caption
    - Ensure responsive layout with max 1280px width
    - _Requirements: 12.4, 15.4_

  - [x] 19.4 Add JavaScript for viewport autoplay
    - Create `assets/js/tips-video.js`
    - Implement IntersectionObserver for autoplay when scrolled into view
    - Autoplay muted with user control to unmute
    - _Requirements: 12.7_

- [x] 20. Create documentation
  - [x] 20.1 Create tutorial creation workflow documentation
    - Document the complete workflow from capture to embedding
    - Include examples and troubleshooting tips
    - _Requirements: 14.5_

- [x] 21. Final checkpoint - End-to-end verification
  - Render at least one complete tutorial from each category
  - Verify tutorials display correctly on tips pages
  - Ensure frame rate is sufficient for smooth cursor movement (minimum 24fps)
  - Verify text remains readable after compression
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- The capture scripts require Remotion Studio to be running at localhost:3000
- GIF optimization targets under 2MB for typical 10-second tutorials
- All tutorials should be 5-15 seconds in duration demonstrating ONE specific action
