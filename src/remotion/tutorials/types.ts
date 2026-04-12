/**
 * TypeScript interfaces and types for Video Tutorial Screencasts
 *
 * This file defines all the type definitions used by the tutorial system including:
 * - Capture metadata types (frames, clicks, mouse positions)
 * - Overlay component props (cursor, zoom, highlight, annotation)
 * - Configuration types for the overlay system
 *
 * Requirements: 2.5, 3.3, 4.4, 5.1, 7.1
 */

import type { ReactNode } from 'react';

// =============================================================================
// Capture Metadata Types
// =============================================================================

/**
 * Represents a single captured frame with mouse position data
 */
export interface FrameData {
  /** Frame number in the sequence (0-indexed) */
  frameNumber: number;
  /** Timestamp in milliseconds from capture start */
  timestamp: number;
  /** Mouse X coordinate at this frame */
  mouseX: number;
  /** Mouse Y coordinate at this frame */
  mouseY: number;
}

/**
 * Represents a click event captured during recording
 */
export interface ClickEvent {
  /** Frame number when the click occurred */
  frameNumber: number;
  /** Timestamp in milliseconds from capture start */
  timestamp: number;
  /** Click X coordinate */
  x: number;
  /** Click Y coordinate */
  y: number;
  /** Mouse button that was clicked */
  button: 'left' | 'right';
}

/**
 * Complete metadata from a capture session
 */
export interface CaptureMetadata {
  /** Array of frame data with mouse positions */
  frames: FrameData[];
  /** Array of click events */
  clicks: ClickEvent[];
  /** Total duration in milliseconds */
  duration: number;
  /** Frames per second of the capture */
  fps: number;
}

// =============================================================================
// Cursor Overlay Types
// =============================================================================

/**
 * Props for the CursorOverlay component
 * Renders an animated cursor with click indicators
 */
export interface CursorOverlayProps {
  /** Capture metadata containing mouse positions and click events */
  metadata: CaptureMetadata;
  /** Style of cursor to display */
  cursorStyle?: 'pointer' | 'hand' | 'text';
  /** Duration of click indicator animation in milliseconds (default: 400) */
  clickIndicatorDuration?: number;
  /** Easing factor for smooth cursor movement (default: 0.3) */
  smoothing?: number;
}

// =============================================================================
// Zoom Effect Types
// =============================================================================

/**
 * Configuration for a zoom effect
 */
export interface ZoomConfig {
  /** Frame number when zoom begins */
  startFrame: number;
  /** Frame number when zoom ends */
  endFrame: number;
  /** Zoom magnification level (1.5 to 4.0) */
  zoomLevel: number;
  /** Target region to zoom into */
  targetRegion: {
    /** Center X coordinate of zoom target */
    x: number;
    /** Center Y coordinate of zoom target */
    y: number;
    /** Optional width of target region */
    width?: number;
    /** Optional height of target region */
    height?: number;
  };
  /** Duration of zoom-in animation in frames (default: 15 @ 30fps = 500ms) */
  zoomInDuration?: number;
  /** Duration to hold at zoomed level in frames */
  holdDuration?: number;
  /** Duration of zoom-out animation in frames (default: 15) */
  zoomOutDuration?: number;
  /** Easing function for zoom transitions */
  easing?: 'easeInOut' | 'easeOut' | 'spring';
}

/**
 * Props for the ZoomEffect component
 */
export interface ZoomEffectProps {
  /** Content to apply zoom transformation to */
  children: ReactNode;
  /** Zoom configuration */
  zoomConfig: ZoomConfig;
  /** Current frame number for animation */
  currentFrame: number;
}

// =============================================================================
// Highlight Box Types
// =============================================================================

/**
 * Style configuration for a highlight box
 */
export interface HighlightStyle {
  /** Border color (default: brand accent) */
  borderColor?: string;
  /** Border width in pixels (default: 3) */
  borderWidth?: number;
  /** Border radius in pixels (default: 8) */
  borderRadius?: number;
  /** Glow/shadow color */
  glowColor?: string;
  /** Glow intensity (0-1) */
  glowIntensity?: number;
  /** Whether to animate with pulsing effect (default: true) */
  pulseAnimation?: boolean;
}

/**
 * Configuration for a single highlight box
 */
export interface HighlightConfig {
  /** Frame number when highlight appears */
  startFrame: number;
  /** Frame number when highlight disappears */
  endFrame: number;
  /** Region to highlight */
  region: {
    /** X coordinate of region */
    x: number;
    /** Y coordinate of region */
    y: number;
    /** Width of region */
    width: number;
    /** Height of region */
    height: number;
  };
  /** Style configuration for the highlight */
  style?: HighlightStyle;
  /** Fade-in duration in frames */
  fadeIn?: number;
  /** Fade-out duration in frames */
  fadeOut?: number;
}

/**
 * Props for the HighlightBox component
 */
export interface HighlightBoxProps {
  /** Array of highlight configurations */
  highlights: HighlightConfig[];
  /** Current frame number for animation */
  currentFrame: number;
}

// =============================================================================
// Annotation Overlay Types
// =============================================================================

/**
 * Style configuration for annotation text
 */
export interface AnnotationStyle {
  /** Font size in pixels (default: 24) */
  fontSize?: number;
  /** Font weight */
  fontWeight?: 'normal' | 'bold';
  /** Text color */
  textColor?: string;
  /** Background pill color */
  backgroundColor?: string;
  /** Padding around text in pixels */
  padding?: number;
}

/**
 * Configuration for an arrow indicator
 */
export interface ArrowConfig {
  /** Target X coordinate the arrow points to */
  targetX: number;
  /** Target Y coordinate the arrow points to */
  targetY: number;
  /** Whether the arrow should be curved (default: true) */
  curved?: boolean;
  /** Arrow color */
  color?: string;
  /** Arrow line thickness in pixels */
  thickness?: number;
}

/**
 * Configuration for a single annotation
 */
export interface AnnotationConfig {
  /** Frame number when annotation appears */
  startFrame: number;
  /** Frame number when annotation disappears */
  endFrame: number;
  /** Type of annotation */
  type: 'label' | 'arrow' | 'step-number';
  /** Text content for label annotations */
  text?: string;
  /** Position of the annotation */
  position: {
    /** X coordinate */
    x: number;
    /** Y coordinate */
    y: number;
  };
  /** Style configuration for text */
  style?: AnnotationStyle;
  /** Arrow configuration for arrow annotations */
  arrow?: ArrowConfig;
  /** Step number for step-number annotations */
  stepNumber?: number;
  /** Fade-in duration in frames */
  fadeIn?: number;
}

/**
 * Props for the AnnotationOverlay component
 */
export interface AnnotationOverlayProps {
  /** Array of annotation configurations */
  annotations: AnnotationConfig[];
  /** Current frame number for animation */
  currentFrame: number;
}

// =============================================================================
// Full Overlay Configuration Type
// =============================================================================

/**
 * Cursor configuration within overlay config
 */
export interface CursorConfig {
  /** Whether cursor overlay is enabled */
  enabled: boolean;
  /** Cursor style to use */
  style?: 'pointer' | 'hand' | 'text';
  /** Click indicator duration in milliseconds */
  clickIndicatorDuration?: number;
  /** Smoothing factor for cursor movement */
  smoothing?: number;
}

/**
 * Union type for all overlay types in the config
 */
export type OverlayItem =
  | ({ type: 'zoom' } & Omit<ZoomConfig, 'startFrame' | 'endFrame'> & {
        startFrame: number;
        endFrame: number;
      })
  | ({ type: 'highlight' } & Omit<HighlightConfig, 'startFrame' | 'endFrame'> & {
        startFrame: number;
        endFrame: number;
      })
  | ({ type: 'annotation' } & Omit<AnnotationConfig, 'startFrame' | 'endFrame'> & {
        startFrame: number;
        endFrame: number;
      });

/**
 * Full overlay configuration for a tutorial
 * This is the main configuration type used to define all overlays for a tutorial
 */
export interface OverlayConfig {
  /** Unique tutorial identifier (kebab-case) */
  id: string;
  /** Human-readable tutorial name */
  name: string;
  /** Brief description of what the tutorial demonstrates */
  description?: string;
  /** Cursor overlay configuration */
  cursor?: CursorConfig;
  /** Array of overlay items (zoom, highlight, annotation) */
  overlays: OverlayItem[];
}

// =============================================================================
// Tutorial Composition Types
// =============================================================================

/**
 * Props for the main TutorialComposition component
 */
export interface TutorialCompositionProps {
  /** Path to the directory containing captured frame images */
  frameSequencePath: string;
  /** Path to the capture metadata JSON file */
  metadataPath: string;
  /** Overlay configuration for the tutorial */
  overlayConfig: OverlayConfig;
  /** Frame rate for the composition (default: 30) */
  fps?: number;
  /** Output width in pixels (default: 1280) */
  width?: number;
  /** Output height in pixels (default: 720) */
  height?: number;
}

// =============================================================================
// Helper Types
// =============================================================================

/**
 * Easing function type
 */
export type EasingFunction = (t: number) => number;

/**
 * Supported easing types
 */
export type EasingType = 'easeInOut' | 'easeOut' | 'spring';

/**
 * Position type used throughout the system
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Region/bounding box type
 */
export interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}
