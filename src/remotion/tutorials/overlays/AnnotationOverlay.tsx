/**
 * AnnotationOverlay Component for Video Tutorial Screencasts
 *
 * Renders text labels, step numbers, and arrows at specified positions
 * to explain tutorial steps. Supports configurable text styles including
 * font size, weight, color, and background pills for readability.
 *
 * The component accepts annotation configurations from overlay config and
 * supports fade-in animations for smooth appearance.
 *
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.6, 5.7
 */

import { AbsoluteFill } from 'remotion';
import type { AnnotationOverlayProps, AnnotationConfig, AnnotationStyle, ArrowConfig } from '../types';
import { interpolateOpacity, easeOut } from '../utils/easing';

// =============================================================================
// Constants
// =============================================================================

/** Default font size in pixels */
const DEFAULT_FONT_SIZE = 24;

/** Default font weight */
const DEFAULT_FONT_WEIGHT: 'normal' | 'bold' = 'bold';

/** Default text color */
const DEFAULT_TEXT_COLOR = '#FFFFFF';

/** Default background color for pills */
const DEFAULT_BACKGROUND_COLOR = 'rgba(0, 0, 0, 0.8)';

/** Default padding around text in pixels */
const DEFAULT_PADDING = 12;

/** Default fade-in duration in frames */
const DEFAULT_FADE_IN = 5;

/** Step number circle size multiplier (relative to font size) */
const STEP_NUMBER_SIZE_MULTIPLIER = 1.8;

/** Step number background color */
const STEP_NUMBER_BACKGROUND = '#3B82F6';

/** Default arrow color */
const DEFAULT_ARROW_COLOR = '#3B82F6';

/** Default arrow thickness in pixels */
const DEFAULT_ARROW_THICKNESS = 3;

/** Default arrowhead size multiplier (relative to thickness) */
const ARROWHEAD_SIZE_MULTIPLIER = 4;

/** Control point offset for curved arrows (as fraction of distance) */
const CURVE_CONTROL_OFFSET = 0.3;

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Check if an annotation should be visible at the current frame
 *
 * @param annotation - The annotation configuration
 * @param currentFrame - The current frame number
 * @returns True if the annotation should be rendered
 */
function isAnnotationVisible(annotation: AnnotationConfig, currentFrame: number): boolean {
  const fadeIn = annotation.fadeIn ?? DEFAULT_FADE_IN;

  // Include fade-in period in visibility check
  return currentFrame >= annotation.startFrame - fadeIn && currentFrame <= annotation.endFrame;
}

/**
 * Get merged style with defaults
 *
 * @param style - Optional style configuration
 * @returns Complete style object with defaults applied
 */
function getMergedStyle(style?: AnnotationStyle): Required<AnnotationStyle> {
  return {
    fontSize: style?.fontSize ?? DEFAULT_FONT_SIZE,
    fontWeight: style?.fontWeight ?? DEFAULT_FONT_WEIGHT,
    textColor: style?.textColor ?? DEFAULT_TEXT_COLOR,
    backgroundColor: style?.backgroundColor ?? DEFAULT_BACKGROUND_COLOR,
    padding: style?.padding ?? DEFAULT_PADDING,
  };
}

// =============================================================================
// Label Annotation Component
// =============================================================================

/**
 * Props for the LabelAnnotation component
 */
interface LabelAnnotationProps {
  /** Annotation configuration */
  config: AnnotationConfig;
  /** Current frame number */
  currentFrame: number;
}

/**
 * LabelAnnotation Component
 *
 * Renders a text label with a background pill for readability.
 * Uses contrasting colors for visibility against any background.
 *
 * Requirements: 5.1, 5.3
 */
const LabelAnnotation: React.FC<LabelAnnotationProps> = ({ config, currentFrame }) => {
  const { text, position, style, startFrame, endFrame, fadeIn = DEFAULT_FADE_IN } = config;

  // Get merged style with defaults
  const mergedStyle = getMergedStyle(style);

  // Calculate opacity with fade-in effect
  const opacity = interpolateOpacity(currentFrame, startFrame, endFrame, fadeIn, 0);

  // Don't render if no text
  if (!text) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        opacity: opacity,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        willChange: 'opacity',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          padding: `${mergedStyle.padding * 0.6}px ${mergedStyle.padding}px`,
          backgroundColor: mergedStyle.backgroundColor,
          borderRadius: mergedStyle.padding / 2,
          // Add subtle shadow for depth and visibility
          boxShadow: `
            0 2px 8px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1)
          `,
        }}
      >
        <span
          style={{
            fontSize: mergedStyle.fontSize,
            fontWeight: mergedStyle.fontWeight,
            color: mergedStyle.textColor,
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            // Text shadow for additional readability
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

// =============================================================================
// Step Number Annotation Component
// =============================================================================

/**
 * Props for the StepNumberAnnotation component
 */
interface StepNumberAnnotationProps {
  /** Annotation configuration */
  config: AnnotationConfig;
  /** Current frame number */
  currentFrame: number;
}

/**
 * StepNumberAnnotation Component
 *
 * Renders a numbered step indicator (e.g., "1", "2", "3") in a circular badge.
 * Used for multi-step tutorials to show the sequence of actions.
 *
 * Requirements: 5.7
 */
const StepNumberAnnotation: React.FC<StepNumberAnnotationProps> = ({ config, currentFrame }) => {
  const { stepNumber, position, style, startFrame, endFrame, fadeIn = DEFAULT_FADE_IN } = config;

  // Get merged style with defaults
  const mergedStyle = getMergedStyle(style);

  // Calculate opacity with fade-in effect
  const opacity = interpolateOpacity(currentFrame, startFrame, endFrame, fadeIn, 0);

  // Don't render if no step number
  if (stepNumber === undefined) {
    return null;
  }

  // Calculate circle size based on font size
  const circleSize = mergedStyle.fontSize * STEP_NUMBER_SIZE_MULTIPLIER;

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        opacity: opacity,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        willChange: 'opacity',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: circleSize,
          height: circleSize,
          backgroundColor: style?.backgroundColor ?? STEP_NUMBER_BACKGROUND,
          borderRadius: '50%',
          // Add shadow and border for visibility
          boxShadow: `
            0 2px 8px rgba(0, 0, 0, 0.4),
            0 0 0 2px rgba(255, 255, 255, 0.9),
            0 0 0 4px rgba(0, 0, 0, 0.2)
          `,
        }}
      >
        <span
          style={{
            fontSize: mergedStyle.fontSize,
            fontWeight: 'bold',
            color: mergedStyle.textColor,
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            lineHeight: 1,
            // Text shadow for readability
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
          }}
        >
          {stepNumber}
        </span>
      </div>
    </div>
  );
};

// =============================================================================
// Arrow Annotation Component
// =============================================================================

/**
 * Props for the ArrowAnnotation component
 */
interface ArrowAnnotationProps {
  /** Annotation configuration */
  config: AnnotationConfig;
  /** Current frame number */
  currentFrame: number;
}

/**
 * Calculate the control point for a curved arrow using quadratic Bezier
 *
 * The control point is offset perpendicular to the line between start and end,
 * creating a smooth curve that arcs away from the direct path.
 *
 * @param startX - Starting X coordinate
 * @param startY - Starting Y coordinate
 * @param endX - Ending X coordinate
 * @param endY - Ending Y coordinate
 * @returns Control point coordinates
 */
function calculateCurveControlPoint(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): { x: number; y: number } {
  // Calculate midpoint
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  // Calculate perpendicular offset
  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Perpendicular vector (normalized and scaled)
  const perpX = -dy / distance;
  const perpY = dx / distance;

  // Offset the control point perpendicular to the line
  const offset = distance * CURVE_CONTROL_OFFSET;

  return {
    x: midX + perpX * offset,
    y: midY + perpY * offset,
  };
}

/**
 * Calculate the angle at the end of a path for arrowhead rotation
 *
 * For curved arrows, this calculates the tangent angle at the endpoint.
 * For straight arrows, this is simply the angle of the line.
 *
 * @param startX - Starting X coordinate
 * @param startY - Starting Y coordinate
 * @param endX - Ending X coordinate
 * @param endY - Ending Y coordinate
 * @param curved - Whether the arrow is curved
 * @param controlX - Control point X (for curved arrows)
 * @param controlY - Control point Y (for curved arrows)
 * @returns Angle in degrees
 */
function calculateArrowheadAngle(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  curved: boolean,
  controlX?: number,
  controlY?: number
): number {
  let dx: number;
  let dy: number;

  if (curved && controlX !== undefined && controlY !== undefined) {
    // For curved arrows, calculate tangent at endpoint
    // The tangent at t=1 of a quadratic Bezier is the direction from control to end
    dx = endX - controlX;
    dy = endY - controlY;
  } else {
    // For straight arrows, use the line direction
    dx = endX - startX;
    dy = endY - startY;
  }

  // Convert to degrees
  return Math.atan2(dy, dx) * (180 / Math.PI);
}

/**
 * Generate SVG path data for the arrow line
 *
 * @param startX - Starting X coordinate
 * @param startY - Starting Y coordinate
 * @param endX - Ending X coordinate
 * @param endY - Ending Y coordinate
 * @param curved - Whether to draw a curved arrow
 * @returns SVG path data string and control point (if curved)
 */
function generateArrowPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  curved: boolean
): { pathData: string; controlX?: number; controlY?: number } {
  if (curved) {
    const control = calculateCurveControlPoint(startX, startY, endX, endY);
    // Quadratic Bezier curve: M start Q control end
    return {
      pathData: `M ${startX} ${startY} Q ${control.x} ${control.y} ${endX} ${endY}`,
      controlX: control.x,
      controlY: control.y,
    };
  } else {
    // Straight line: M start L end
    return {
      pathData: `M ${startX} ${startY} L ${endX} ${endY}`,
    };
  }
}

/**
 * ArrowAnnotation Component
 *
 * Renders curved or straight arrows pointing from the annotation position
 * to a target UI element. Supports configurable styles including color,
 * thickness, and arrowhead.
 *
 * The arrow starts at the annotation position and points to the target
 * coordinates specified in the arrow configuration.
 *
 * Requirements: 5.2, 5.4
 */
const ArrowAnnotation: React.FC<ArrowAnnotationProps> = ({ config, currentFrame }) => {
  const { position, arrow, text, style, startFrame, endFrame, fadeIn = DEFAULT_FADE_IN } = config;

  // Don't render if no arrow configuration
  if (!arrow) {
    return null;
  }

  // Get merged style with defaults
  const mergedStyle = getMergedStyle(style);

  // Calculate opacity with fade-in effect
  const opacity = interpolateOpacity(currentFrame, startFrame, endFrame, fadeIn, 0);

  // Arrow configuration with defaults
  const arrowColor = arrow.color ?? DEFAULT_ARROW_COLOR;
  const arrowThickness = arrow.thickness ?? DEFAULT_ARROW_THICKNESS;
  const isCurved = arrow.curved !== false; // Default to curved

  // Calculate arrow path
  const startX = position.x;
  const startY = position.y;
  const endX = arrow.targetX;
  const endY = arrow.targetY;

  const { pathData, controlX, controlY } = generateArrowPath(startX, startY, endX, endY, isCurved);

  // Calculate arrowhead angle
  const arrowheadAngle = calculateArrowheadAngle(startX, startY, endX, endY, isCurved, controlX, controlY);

  // Arrowhead size based on thickness
  const arrowheadSize = arrowThickness * ARROWHEAD_SIZE_MULTIPLIER;

  // Calculate bounding box for SVG (with padding for arrowhead)
  const padding = arrowheadSize + arrowThickness;
  const minX = Math.min(startX, endX, controlX ?? startX) - padding;
  const minY = Math.min(startY, endY, controlY ?? startY) - padding;
  const maxX = Math.max(startX, endX, controlX ?? startX) + padding;
  const maxY = Math.max(startY, endY, controlY ?? startY) + padding;
  const svgWidth = maxX - minX;
  const svgHeight = maxY - minY;

  // Adjust path coordinates relative to SVG viewBox
  const adjustedStartX = startX - minX;
  const adjustedStartY = startY - minY;
  const adjustedEndX = endX - minX;
  const adjustedEndY = endY - minY;
  const adjustedControlX = controlX !== undefined ? controlX - minX : undefined;
  const adjustedControlY = controlY !== undefined ? controlY - minY : undefined;

  const { pathData: adjustedPathData } = generateArrowPath(
    adjustedStartX,
    adjustedStartY,
    adjustedEndX,
    adjustedEndY,
    isCurved
  );

  // Recalculate for adjusted coordinates if curved
  let finalPathData = adjustedPathData;
  if (isCurved && adjustedControlX !== undefined && adjustedControlY !== undefined) {
    finalPathData = `M ${adjustedStartX} ${adjustedStartY} Q ${adjustedControlX} ${adjustedControlY} ${adjustedEndX} ${adjustedEndY}`;
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: minX,
        top: minY,
        width: svgWidth,
        height: svgHeight,
        opacity: opacity,
        pointerEvents: 'none',
        willChange: 'opacity',
      }}
    >
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ overflow: 'visible' }}
      >
        {/* Arrow line with shadow for visibility */}
        <path
          d={finalPathData}
          fill="none"
          stroke="rgba(0, 0, 0, 0.3)"
          strokeWidth={arrowThickness + 2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={finalPathData}
          fill="none"
          stroke={arrowColor}
          strokeWidth={arrowThickness}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Arrowhead */}
        <g transform={`translate(${adjustedEndX}, ${adjustedEndY}) rotate(${arrowheadAngle})`}>
          {/* Shadow for arrowhead */}
          <polygon
            points={`0,0 ${-arrowheadSize},-${arrowheadSize / 2} ${-arrowheadSize},${arrowheadSize / 2}`}
            fill="rgba(0, 0, 0, 0.3)"
            transform="translate(1, 1)"
          />
          {/* Arrowhead */}
          <polygon
            points={`0,0 ${-arrowheadSize},-${arrowheadSize / 2} ${-arrowheadSize},${arrowheadSize / 2}`}
            fill={arrowColor}
          />
        </g>
      </svg>

      {/* Optional text label positioned to avoid overlap with arrow target */}
      {text && (
        <div
          style={{
            position: 'absolute',
            left: adjustedStartX,
            top: adjustedStartY,
            transform: calculateLabelOffset(startX, startY, endX, endY),
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: `${mergedStyle.padding * 0.6}px ${mergedStyle.padding}px`,
              backgroundColor: mergedStyle.backgroundColor,
              borderRadius: mergedStyle.padding / 2,
              boxShadow: `
                0 2px 8px rgba(0, 0, 0, 0.3),
                0 0 0 1px rgba(255, 255, 255, 0.1)
              `,
            }}
          >
            <span
              style={{
                fontSize: mergedStyle.fontSize,
                fontWeight: mergedStyle.fontWeight,
                color: mergedStyle.textColor,
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
              }}
            >
              {text}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Calculate label offset to avoid overlapping with the arrow target
 *
 * Positions the label on the opposite side of the arrow direction
 * to ensure it doesn't cover the highlighted element.
 *
 * Requirements: 5.6
 *
 * @param startX - Arrow start X
 * @param startY - Arrow start Y
 * @param endX - Arrow end X (target)
 * @param endY - Arrow end Y (target)
 * @returns CSS transform string for label positioning
 */
function calculateLabelOffset(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): string {
  // Calculate direction from start to end
  const dx = endX - startX;
  const dy = endY - startY;

  // Determine which quadrant the arrow points to
  // Position label on the opposite side
  let translateX = '-50%'; // Center by default
  let translateY = '-50%';

  // Horizontal positioning: if arrow points right, label goes left
  if (Math.abs(dx) > Math.abs(dy)) {
    // Primarily horizontal arrow
    if (dx > 0) {
      translateX = '-100%'; // Arrow points right, label to the left
    } else {
      translateX = '0%'; // Arrow points left, label to the right
    }
    translateY = '-50%'; // Vertically centered
  } else {
    // Primarily vertical arrow
    if (dy > 0) {
      translateY = '-100%'; // Arrow points down, label above
    } else {
      translateY = '0%'; // Arrow points up, label below
    }
    translateX = '-50%'; // Horizontally centered
  }

  return `translate(${translateX}, ${translateY})`;
}

// =============================================================================
// Single Annotation Component
// =============================================================================

/**
 * Props for the SingleAnnotation component
 */
interface SingleAnnotationProps {
  /** Annotation configuration */
  config: AnnotationConfig;
  /** Current frame number */
  currentFrame: number;
}

/**
 * SingleAnnotation Component
 *
 * Routes to the appropriate annotation component based on type.
 * Supports 'label', 'step-number', and 'arrow' types.
 */
const SingleAnnotation: React.FC<SingleAnnotationProps> = ({ config, currentFrame }) => {
  switch (config.type) {
    case 'label':
      return <LabelAnnotation config={config} currentFrame={currentFrame} />;
    case 'step-number':
      return <StepNumberAnnotation config={config} currentFrame={currentFrame} />;
    case 'arrow':
      return <ArrowAnnotation config={config} currentFrame={currentFrame} />;
    default:
      return null;
  }
};

// =============================================================================
// Main AnnotationOverlay Component
// =============================================================================

/**
 * AnnotationOverlay Component
 *
 * Renders multiple annotations based on configuration. Each annotation
 * can have its own timing, position, and style settings.
 *
 * The component filters annotations based on the current frame and renders
 * only those that should be visible (including fade-in periods).
 *
 * @param annotations - Array of annotation configurations
 * @param currentFrame - Current frame number for animation timing
 *
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.6, 5.7
 */
export const AnnotationOverlay: React.FC<AnnotationOverlayProps> = ({ annotations, currentFrame }) => {
  // Filter to only visible annotations
  const visibleAnnotations = annotations.filter((annotation) => isAnnotationVisible(annotation, currentFrame));

  // If no annotations are visible, don't render anything
  if (visibleAnnotations.length === 0) {
    return null;
  }

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        zIndex: 600, // Above highlights (500) but below cursor (1000)
      }}
    >
      {visibleAnnotations.map((annotation, index) => (
        <SingleAnnotation
          key={`annotation-${annotation.startFrame}-${annotation.position.x}-${annotation.position.y}-${index}`}
          config={annotation}
          currentFrame={currentFrame}
        />
      ))}
    </AbsoluteFill>
  );
};

export default AnnotationOverlay;
