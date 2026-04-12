/**
 * JSON Schema for Tutorial Overlay Configuration
 * Requirements: 7.1, 7.2, 7.3
 */

export const overlayConfigSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Tutorial Overlay Configuration',
  description: 'Schema for video tutorial overlay configurations',
  type: 'object',
  required: ['id', 'name', 'overlays'],
  properties: {
    id: {
      type: 'string',
      pattern: '^[a-z0-9-]+$',
      description: 'Unique tutorial identifier (kebab-case)',
    },
    name: {
      type: 'string',
      description: 'Human-readable tutorial name',
    },
    description: {
      type: 'string',
      description: 'Brief description of what the tutorial demonstrates',
    },
    cursor: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean', default: true },
        style: { enum: ['pointer', 'hand', 'text'], default: 'pointer' },
        clickIndicatorDuration: { type: 'number', minimum: 100, maximum: 1000 },
        smoothing: { type: 'number', minimum: 0, maximum: 1 },
      },
    },
    overlays: {
      type: 'array',
      items: {
        oneOf: [
          { $ref: '#/definitions/zoomOverlay' },
          { $ref: '#/definitions/highlightOverlay' },
          { $ref: '#/definitions/annotationOverlay' },
        ],
      },
    },
  },
  definitions: {
    zoomOverlay: {
      type: 'object',
      required: ['type', 'startFrame', 'endFrame', 'zoomLevel', 'targetRegion'],
      properties: {
        type: { const: 'zoom' },
        startFrame: { type: 'integer', minimum: 0 },
        endFrame: { type: 'integer', minimum: 0 },
        zoomLevel: { type: 'number', minimum: 1.5, maximum: 4 },
        targetRegion: {
          type: 'object',
          required: ['x', 'y'],
          properties: {
            x: { type: 'number' },
            y: { type: 'number' },
            width: { type: 'number' },
            height: { type: 'number' },
          },
        },
        zoomInDuration: { type: 'integer', minimum: 1 },
        holdDuration: { type: 'integer', minimum: 0 },
        zoomOutDuration: { type: 'integer', minimum: 1 },
        easing: { enum: ['easeInOut', 'easeOut', 'spring'] },
      },
    },
    highlightOverlay: {
      type: 'object',
      required: ['type', 'startFrame', 'endFrame', 'region'],
      properties: {
        type: { const: 'highlight' },
        startFrame: { type: 'integer', minimum: 0 },
        endFrame: { type: 'integer', minimum: 0 },
        region: {
          type: 'object',
          required: ['x', 'y', 'width', 'height'],
          properties: {
            x: { type: 'number' },
            y: { type: 'number' },
            width: { type: 'number' },
            height: { type: 'number' },
          },
        },
        style: {
          type: 'object',
          properties: {
            borderColor: { type: 'string' },
            borderWidth: { type: 'number' },
            borderRadius: { type: 'number' },
            glowColor: { type: 'string' },
            glowIntensity: { type: 'number', minimum: 0, maximum: 1 },
            pulseAnimation: { type: 'boolean' },
          },
        },
        fadeIn: { type: 'integer', minimum: 0 },
        fadeOut: { type: 'integer', minimum: 0 },
      },
    },
    annotationOverlay: {
      type: 'object',
      required: ['type', 'startFrame', 'endFrame', 'position'],
      properties: {
        type: { const: 'annotation' },
        startFrame: { type: 'integer', minimum: 0 },
        endFrame: { type: 'integer', minimum: 0 },
        text: { type: 'string' },
        position: {
          type: 'object',
          required: ['x', 'y'],
          properties: {
            x: { type: 'number' },
            y: { type: 'number' },
          },
        },
        style: {
          type: 'object',
          properties: {
            fontSize: { type: 'number' },
            fontWeight: { enum: ['normal', 'bold'] },
            textColor: { type: 'string' },
            backgroundColor: { type: 'string' },
            padding: { type: 'number' },
          },
        },
        arrow: {
          type: 'object',
          required: ['targetX', 'targetY'],
          properties: {
            targetX: { type: 'number' },
            targetY: { type: 'number' },
            curved: { type: 'boolean' },
            color: { type: 'string' },
            thickness: { type: 'number' },
          },
        },
        stepNumber: { type: 'integer', minimum: 1 },
        fadeIn: { type: 'integer', minimum: 0 },
      },
    },
  },
};
