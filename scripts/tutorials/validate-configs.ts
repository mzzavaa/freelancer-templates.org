/**
 * Overlay Configuration Validator
 *
 * Validates overlay configs against the schema and returns clear error messages.
 * Requirements: 7.5
 */

import type { OverlayConfig, OverlayItem } from '../../src/remotion/tutorials/types';

export interface ValidationError {
  path: string;
  message: string;
  expected?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validate an overlay configuration
 */
export function validateOverlayConfig(config: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!config || typeof config !== 'object') {
    return { valid: false, errors: [{ path: '', message: 'Config must be an object' }] };
  }

  const cfg = config as Record<string, unknown>;

  // Required fields
  if (!cfg.id || typeof cfg.id !== 'string') {
    errors.push({ path: 'id', message: 'Missing or invalid id', expected: 'string (kebab-case)' });
  } else if (!/^[a-z0-9-]+$/.test(cfg.id)) {
    errors.push({ path: 'id', message: 'Invalid id format', expected: 'kebab-case (a-z, 0-9, -)' });
  }

  if (!cfg.name || typeof cfg.name !== 'string') {
    errors.push({ path: 'name', message: 'Missing or invalid name', expected: 'string' });
  }

  if (!Array.isArray(cfg.overlays)) {
    errors.push({ path: 'overlays', message: 'Missing or invalid overlays', expected: 'array' });
  } else {
    cfg.overlays.forEach((overlay, index) => {
      const overlayErrors = validateOverlayItem(overlay, index);
      errors.push(...overlayErrors);
    });
  }

  // Optional cursor config
  if (cfg.cursor !== undefined) {
    const cursorErrors = validateCursorConfig(cfg.cursor);
    errors.push(...cursorErrors);
  }

  return { valid: errors.length === 0, errors };
}

function validateOverlayItem(item: unknown, index: number): ValidationError[] {
  const errors: ValidationError[] = [];
  const path = `overlays[${index}]`;

  if (!item || typeof item !== 'object') {
    return [{ path, message: 'Overlay must be an object' }];
  }

  const overlay = item as Record<string, unknown>;

  // Common required fields
  if (typeof overlay.startFrame !== 'number' || overlay.startFrame < 0) {
    errors.push({ path: `${path}.startFrame`, message: 'Invalid startFrame', expected: 'number >= 0' });
  }

  if (typeof overlay.endFrame !== 'number' || overlay.endFrame < 0) {
    errors.push({ path: `${path}.endFrame`, message: 'Invalid endFrame', expected: 'number >= 0' });
  }

  if (typeof overlay.startFrame === 'number' && typeof overlay.endFrame === 'number') {
    if (overlay.endFrame < overlay.startFrame) {
      errors.push({ path: `${path}.endFrame`, message: 'endFrame must be >= startFrame' });
    }
  }

  // Type-specific validation
  switch (overlay.type) {
    case 'zoom':
      errors.push(...validateZoomOverlay(overlay, path));
      break;
    case 'highlight':
      errors.push(...validateHighlightOverlay(overlay, path));
      break;
    case 'annotation':
      errors.push(...validateAnnotationOverlay(overlay, path));
      break;
    default:
      errors.push({ path: `${path}.type`, message: 'Invalid type', expected: 'zoom | highlight | annotation' });
  }

  return errors;
}

function validateZoomOverlay(overlay: Record<string, unknown>, path: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (typeof overlay.zoomLevel !== 'number' || overlay.zoomLevel < 1.5 || overlay.zoomLevel > 4) {
    errors.push({ path: `${path}.zoomLevel`, message: 'Invalid zoomLevel', expected: 'number 1.5-4' });
  }

  if (!overlay.targetRegion || typeof overlay.targetRegion !== 'object') {
    errors.push({ path: `${path}.targetRegion`, message: 'Missing targetRegion', expected: 'object with x, y' });
  } else {
    const region = overlay.targetRegion as Record<string, unknown>;
    if (typeof region.x !== 'number') {
      errors.push({ path: `${path}.targetRegion.x`, message: 'Missing x', expected: 'number' });
    }
    if (typeof region.y !== 'number') {
      errors.push({ path: `${path}.targetRegion.y`, message: 'Missing y', expected: 'number' });
    }
  }

  return errors;
}

function validateHighlightOverlay(overlay: Record<string, unknown>, path: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!overlay.region || typeof overlay.region !== 'object') {
    errors.push({ path: `${path}.region`, message: 'Missing region', expected: 'object with x, y, width, height' });
  } else {
    const region = overlay.region as Record<string, unknown>;
    ['x', 'y', 'width', 'height'].forEach((field) => {
      if (typeof region[field] !== 'number') {
        errors.push({ path: `${path}.region.${field}`, message: `Missing ${field}`, expected: 'number' });
      }
    });
  }

  return errors;
}

function validateAnnotationOverlay(overlay: Record<string, unknown>, path: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!overlay.position || typeof overlay.position !== 'object') {
    errors.push({ path: `${path}.position`, message: 'Missing position', expected: 'object with x, y' });
  } else {
    const pos = overlay.position as Record<string, unknown>;
    if (typeof pos.x !== 'number') {
      errors.push({ path: `${path}.position.x`, message: 'Missing x', expected: 'number' });
    }
    if (typeof pos.y !== 'number') {
      errors.push({ path: `${path}.position.y`, message: 'Missing y', expected: 'number' });
    }
  }

  return errors;
}

function validateCursorConfig(cursor: unknown): ValidationError[] {
  const errors: ValidationError[] = [];

  if (typeof cursor !== 'object' || cursor === null) {
    return [{ path: 'cursor', message: 'Invalid cursor config', expected: 'object' }];
  }

  const cfg = cursor as Record<string, unknown>;

  if (cfg.style !== undefined && !['pointer', 'hand', 'text'].includes(cfg.style as string)) {
    errors.push({ path: 'cursor.style', message: 'Invalid style', expected: 'pointer | hand | text' });
  }

  if (cfg.smoothing !== undefined && (typeof cfg.smoothing !== 'number' || cfg.smoothing < 0 || cfg.smoothing > 1)) {
    errors.push({ path: 'cursor.smoothing', message: 'Invalid smoothing', expected: 'number 0-1' });
  }

  return errors;
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(result: ValidationResult): string {
  if (result.valid) return 'Configuration is valid';

  return result.errors
    .map((e) => `  ${e.path}: ${e.message}${e.expected ? ` (expected: ${e.expected})` : ''}`)
    .join('\n');
}
