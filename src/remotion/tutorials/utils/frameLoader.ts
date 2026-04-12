/**
 * Frame loader utility for Video Tutorial Screencasts
 *
 * Provides functions to load frame sequences from directories and parse
 * capture metadata JSON files. Used by TutorialComposition to load
 * captured frames and their associated metadata.
 *
 * Frame naming convention: frame-{####}.png (zero-padded 4 digits)
 * Example: frame-0001.png, frame-0002.png, etc.
 *
 * Requirements: 6.1
 */

import { staticFile } from 'remotion';
import type { CaptureMetadata, FrameData } from '../types';

// =============================================================================
// Constants
// =============================================================================

/**
 * Frame filename pattern with zero-padded 4-digit frame number
 */
const FRAME_FILENAME_PATTERN = 'frame-{####}.png';

/**
 * Number of digits for zero-padding frame numbers
 */
const FRAME_NUMBER_PADDING = 4;

/**
 * Default metadata filename
 */
const DEFAULT_METADATA_FILENAME = 'metadata.json';

// =============================================================================
// Frame Path Generation
// =============================================================================

/**
 * Generate a frame filename from a frame number
 *
 * @param frameNumber - The frame number (0-indexed)
 * @returns The formatted filename (e.g., "frame-0001.png")
 */
export function getFrameFilename(frameNumber: number): string {
  const paddedNumber = String(frameNumber + 1).padStart(FRAME_NUMBER_PADDING, '0');
  return `frame-${paddedNumber}.png`;
}

/**
 * Generate the full path to a frame file using Remotion's staticFile
 *
 * @param frameSequencePath - Base path to the frame sequence directory (relative to public/)
 * @param frameNumber - The frame number (0-indexed)
 * @returns The full path suitable for use with Remotion's Img component
 */
export function getFramePath(frameSequencePath: string, frameNumber: number): string {
  const filename = getFrameFilename(frameNumber);
  // Ensure path doesn't have double slashes
  const basePath = frameSequencePath.endsWith('/')
    ? frameSequencePath.slice(0, -1)
    : frameSequencePath;
  return staticFile(`${basePath}/${filename}`);
}

/**
 * Generate an array of frame paths for a sequence
 *
 * @param frameSequencePath - Base path to the frame sequence directory
 * @param frameCount - Total number of frames in the sequence
 * @returns Array of frame paths
 */
export function getFramePaths(frameSequencePath: string, frameCount: number): string[] {
  const paths: string[] = [];
  for (let i = 0; i < frameCount; i++) {
    paths.push(getFramePath(frameSequencePath, i));
  }
  return paths;
}

// =============================================================================
// Metadata Loading
// =============================================================================

/**
 * Parse capture metadata from a JSON string
 *
 * @param jsonString - The JSON string containing capture metadata
 * @returns Parsed CaptureMetadata object
 * @throws Error if JSON is invalid or missing required fields
 */
export function parseMetadataJson(jsonString: string): CaptureMetadata {
  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonString);
  } catch (error) {
    throw new Error(
      `Invalid metadata JSON: ${error instanceof Error ? error.message : 'Parse error'}`
    );
  }

  // Validate required fields
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid metadata JSON: Expected an object');
  }

  const metadata = parsed as Record<string, unknown>;

  // Validate frames array
  if (!Array.isArray(metadata.frames)) {
    throw new Error('Invalid metadata JSON: Missing or invalid "frames" array');
  }

  // Validate clicks array
  if (!Array.isArray(metadata.clicks)) {
    throw new Error('Invalid metadata JSON: Missing or invalid "clicks" array');
  }

  // Validate duration
  if (typeof metadata.duration !== 'number' || metadata.duration <= 0) {
    throw new Error('Invalid metadata JSON: Missing or invalid "duration" field');
  }

  // Validate fps
  if (typeof metadata.fps !== 'number' || metadata.fps <= 0) {
    throw new Error('Invalid metadata JSON: Missing or invalid "fps" field');
  }

  // Validate frame data structure
  for (let i = 0; i < metadata.frames.length; i++) {
    const frame = metadata.frames[i] as Record<string, unknown>;
    if (
      typeof frame.frameNumber !== 'number' ||
      typeof frame.timestamp !== 'number' ||
      typeof frame.mouseX !== 'number' ||
      typeof frame.mouseY !== 'number'
    ) {
      throw new Error(
        `Invalid metadata JSON: Frame at index ${i} is missing required fields (frameNumber, timestamp, mouseX, mouseY)`
      );
    }
  }

  return {
    frames: metadata.frames as FrameData[],
    clicks: metadata.clicks as CaptureMetadata['clicks'],
    duration: metadata.duration,
    fps: metadata.fps,
  };
}

/**
 * Get the path to the metadata file using Remotion's staticFile
 *
 * @param frameSequencePath - Base path to the frame sequence directory
 * @param metadataFilename - Name of the metadata file (default: metadata.json)
 * @returns The full path to the metadata file
 */
export function getMetadataPath(
  frameSequencePath: string,
  metadataFilename: string = DEFAULT_METADATA_FILENAME
): string {
  const basePath = frameSequencePath.endsWith('/')
    ? frameSequencePath.slice(0, -1)
    : frameSequencePath;
  return staticFile(`${basePath}/${metadataFilename}`);
}

// =============================================================================
// Frame Data Access with Fallback
// =============================================================================

/**
 * Get frame data for a specific frame number with fallback to previous frame
 *
 * If the requested frame is not found in the metadata, this function
 * falls back to the previous available frame. This handles cases where
 * frames might be missing from the capture.
 *
 * @param metadata - The capture metadata containing frame data
 * @param frameNumber - The frame number to retrieve (0-indexed)
 * @returns The frame data for the requested frame, or the nearest previous frame
 */
export function getFrameData(metadata: CaptureMetadata, frameNumber: number): FrameData | null {
  // Handle edge cases
  if (!metadata.frames || metadata.frames.length === 0) {
    return null;
  }

  // Clamp frame number to valid range
  const clampedFrame = Math.max(0, Math.min(frameNumber, metadata.frames.length - 1));

  // Try to find exact frame match
  const exactMatch = metadata.frames.find((f) => f.frameNumber === clampedFrame);
  if (exactMatch) {
    return exactMatch;
  }

  // Fallback: find the nearest previous frame
  let fallbackFrame: FrameData | null = null;
  for (const frame of metadata.frames) {
    if (frame.frameNumber <= clampedFrame) {
      if (!fallbackFrame || frame.frameNumber > fallbackFrame.frameNumber) {
        fallbackFrame = frame;
      }
    }
  }

  // If no previous frame found, use the first frame
  if (!fallbackFrame && metadata.frames.length > 0) {
    fallbackFrame = metadata.frames[0];
  }

  return fallbackFrame;
}

/**
 * Get mouse position for a specific frame with fallback
 *
 * Convenience function that extracts just the mouse position from frame data.
 *
 * @param metadata - The capture metadata containing frame data
 * @param frameNumber - The frame number to retrieve (0-indexed)
 * @returns Object with x and y coordinates, or null if no data available
 */
export function getMousePosition(
  metadata: CaptureMetadata,
  frameNumber: number
): { x: number; y: number } | null {
  const frameData = getFrameData(metadata, frameNumber);
  if (!frameData) {
    return null;
  }
  return { x: frameData.mouseX, y: frameData.mouseY };
}

/**
 * Get click events that occur at or near a specific frame
 *
 * @param metadata - The capture metadata containing click events
 * @param frameNumber - The frame number to check
 * @param tolerance - Number of frames before/after to include (default: 0)
 * @returns Array of click events at or near the specified frame
 */
export function getClicksAtFrame(
  metadata: CaptureMetadata,
  frameNumber: number,
  tolerance: number = 0
): CaptureMetadata['clicks'] {
  return metadata.clicks.filter(
    (click) =>
      click.frameNumber >= frameNumber - tolerance &&
      click.frameNumber <= frameNumber + tolerance
  );
}

/**
 * Check if a click event occurs at a specific frame
 *
 * @param metadata - The capture metadata containing click events
 * @param frameNumber - The frame number to check
 * @returns True if a click occurs at this frame
 */
export function hasClickAtFrame(metadata: CaptureMetadata, frameNumber: number): boolean {
  return metadata.clicks.some((click) => click.frameNumber === frameNumber);
}

// =============================================================================
// Frame Sequence Utilities
// =============================================================================

/**
 * Calculate the total number of frames based on duration and fps
 *
 * @param metadata - The capture metadata
 * @returns Total number of frames in the sequence
 */
export function getTotalFrames(metadata: CaptureMetadata): number {
  return Math.ceil((metadata.duration / 1000) * metadata.fps);
}

/**
 * Get the frame number for a given timestamp
 *
 * @param timestamp - Timestamp in milliseconds
 * @param fps - Frames per second
 * @returns The frame number (0-indexed)
 */
export function timestampToFrame(timestamp: number, fps: number): number {
  return Math.floor((timestamp / 1000) * fps);
}

/**
 * Get the timestamp for a given frame number
 *
 * @param frameNumber - The frame number (0-indexed)
 * @param fps - Frames per second
 * @returns Timestamp in milliseconds
 */
export function frameToTimestamp(frameNumber: number, fps: number): number {
  return (frameNumber / fps) * 1000;
}

/**
 * Create a frame path resolver function for use in Remotion compositions
 *
 * This returns a function that can be used to get the path for any frame,
 * with automatic fallback handling for missing frames.
 *
 * @param frameSequencePath - Base path to the frame sequence directory
 * @param metadata - The capture metadata
 * @returns A function that takes a frame number and returns the frame path
 */
export function createFrameResolver(
  frameSequencePath: string,
  metadata: CaptureMetadata
): (frameNumber: number) => string {
  const totalFrames = getTotalFrames(metadata);

  return (frameNumber: number): string => {
    // Clamp to valid range
    const clampedFrame = Math.max(0, Math.min(frameNumber, totalFrames - 1));

    // Check if we have data for this frame
    const frameData = getFrameData(metadata, clampedFrame);

    // Use the frame number from the data (which may be a fallback)
    const actualFrame = frameData ? frameData.frameNumber : clampedFrame;

    return getFramePath(frameSequencePath, actualFrame);
  };
}

/**
 * Validate that a frame sequence directory has the expected structure
 *
 * This is a helper for development/debugging - it checks if the expected
 * frame files exist based on the metadata.
 *
 * @param metadata - The capture metadata
 * @returns Object with validation results
 */
export function validateFrameSequence(metadata: CaptureMetadata): {
  isValid: boolean;
  totalFrames: number;
  expectedFrames: number;
  missingFrames: number[];
} {
  const totalFrames = getTotalFrames(metadata);
  const expectedFrames = metadata.frames.length;
  const missingFrames: number[] = [];

  // Check for gaps in frame numbers
  const frameNumbers = new Set(metadata.frames.map((f) => f.frameNumber));
  for (let i = 0; i < expectedFrames; i++) {
    if (!frameNumbers.has(i)) {
      missingFrames.push(i);
    }
  }

  return {
    isValid: missingFrames.length === 0,
    totalFrames,
    expectedFrames,
    missingFrames,
  };
}
