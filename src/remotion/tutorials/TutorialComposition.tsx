/**
 * TutorialComposition - Main composition for video tutorial screencasts
 *
 * This component layers captured frames with overlay components:
 * frames → zoom → highlight → cursor → annotation
 *
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import React from 'react';
import { AbsoluteFill, Img, useCurrentFrame } from 'remotion';
import type {
  TutorialCompositionProps,
  CaptureMetadata,
  OverlayConfig,
  ZoomConfig,
  HighlightConfig,
  AnnotationConfig,
} from './types';
import { getFramePath } from './utils/frameLoader';
import { CursorOverlay } from './overlays/CursorOverlay';
import { ZoomEffect } from './overlays/ZoomEffect';
import { HighlightBox } from './overlays/HighlightBox';
import { AnnotationOverlay } from './overlays/AnnotationOverlay';

/**
 * Default values for composition
 */
const DEFAULTS = {
  fps: 30,
  width: 1280,
  height: 720,
};

/**
 * GIF-optimized settings for smaller file sizes
 * Targets under 2MB for 10-second tutorials
 */
export const GIF_OPTIMIZED = {
  fps: 15, // Reduced frame rate
  width: 640, // Half resolution
  height: 360,
};

/**
 * Get optimized settings based on output format
 */
export function getOptimizedSettings(format: 'mp4' | 'webm' | 'gif' = 'mp4') {
  if (format === 'gif') {
    return GIF_OPTIMIZED;
  }
  return DEFAULTS;
}

/**
 * Props for the internal composition (with loaded metadata)
 */
interface InternalCompositionProps {
  frameSequencePath: string;
  metadata: CaptureMetadata;
  overlayConfig: OverlayConfig;
  width: number;
  height: number;
}

/**
 * Extract zoom configs from overlay items
 */
function extractZoomConfigs(overlayConfig: OverlayConfig): ZoomConfig[] {
  return overlayConfig.overlays
    .filter((item) => item.type === 'zoom')
    .map((item) => ({
      startFrame: item.startFrame,
      endFrame: item.endFrame,
      zoomLevel: item.zoomLevel,
      targetRegion: item.targetRegion,
      zoomInDuration: item.zoomInDuration,
      holdDuration: item.holdDuration,
      zoomOutDuration: item.zoomOutDuration,
      easing: item.easing,
    }));
}

/**
 * Extract highlight configs from overlay items
 */
function extractHighlightConfigs(overlayConfig: OverlayConfig): HighlightConfig[] {
  return overlayConfig.overlays
    .filter((item) => item.type === 'highlight')
    .map((item) => ({
      startFrame: item.startFrame,
      endFrame: item.endFrame,
      region: item.region,
      style: item.style,
      fadeIn: item.fadeIn,
      fadeOut: item.fadeOut,
    }));
}

/**
 * Extract annotation configs from overlay items
 */
function extractAnnotationConfigs(overlayConfig: OverlayConfig): AnnotationConfig[] {
  return overlayConfig.overlays
    .filter((item) => item.type === 'annotation')
    .map((item) => ({
      startFrame: item.startFrame,
      endFrame: item.endFrame,
      type: item.type as 'label' | 'arrow' | 'step-number',
      text: item.text,
      position: item.position,
      style: item.style,
      arrow: item.arrow,
      stepNumber: item.stepNumber,
      fadeIn: item.fadeIn,
    }));
}

/**
 * Internal composition component that renders with loaded metadata
 */
const InternalComposition: React.FC<InternalCompositionProps> = ({
  frameSequencePath,
  metadata,
  overlayConfig,
  width,
  height,
}) => {
  const currentFrame = useCurrentFrame();

  // Get the current frame image path
  const framePath = getFramePath(frameSequencePath, currentFrame);

  // Extract overlay configurations
  const zoomConfigs = extractZoomConfigs(overlayConfig);
  const highlightConfigs = extractHighlightConfigs(overlayConfig);
  const annotationConfigs = extractAnnotationConfigs(overlayConfig);

  // Find active zoom config for current frame
  const activeZoom = zoomConfigs.find(
    (z) => currentFrame >= z.startFrame && currentFrame <= z.endFrame
  );

  // Base content: frame image with highlights
  const baseContent = (
    <AbsoluteFill>
      {/* Layer 1: Captured frame */}
      <Img
        src={framePath}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />

      {/* Layer 2: Highlight boxes */}
      <HighlightBox highlights={highlightConfigs} currentFrame={currentFrame} />
    </AbsoluteFill>
  );

  // Wrap with zoom if active
  const zoomedContent = activeZoom ? (
    <ZoomEffect zoomConfig={activeZoom} currentFrame={currentFrame}>
      {baseContent}
    </ZoomEffect>
  ) : (
    baseContent
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Zoomed/base content */}
      {zoomedContent}

      {/* Layer 3: Cursor overlay (on top of zoom) */}
      {overlayConfig.cursor?.enabled !== false && (
        <CursorOverlay
          metadata={metadata}
          cursorStyle={overlayConfig.cursor?.style}
          clickIndicatorDuration={overlayConfig.cursor?.clickIndicatorDuration}
          smoothing={overlayConfig.cursor?.smoothing}
        />
      )}

      {/* Layer 4: Annotations (always on top) */}
      <AnnotationOverlay annotations={annotationConfigs} currentFrame={currentFrame} />
    </AbsoluteFill>
  );
};

/**
 * Main TutorialComposition component
 *
 * This is the entry point for rendering tutorial videos.
 * It expects metadata to be passed as a prop (loaded externally).
 */
export const TutorialComposition: React.FC<
  Omit<TutorialCompositionProps, 'metadataPath'> & { metadata: CaptureMetadata }
> = ({
  frameSequencePath,
  metadata,
  overlayConfig,
  width = DEFAULTS.width,
  height = DEFAULTS.height,
}) => {
  return (
    <InternalComposition
      frameSequencePath={frameSequencePath}
      metadata={metadata}
      overlayConfig={overlayConfig}
      width={width}
      height={height}
    />
  );
};

export default TutorialComposition;
