# Requirements Document

## Introduction

This feature creates animated video tutorial content for the premium design tips landing pages. Each tutorial transforms static screenshots into short, engaging screencasts that demonstrate exactly where to click and what to do in Remotion Studio. The videos use Remotion-powered overlays including animated cursors, zoom effects, highlight boxes, and step-by-step annotations.

The system captures interactions from Remotion Studio (running at localhost:3000) using Playwright browser automation, then renders the captured frames with tutorial overlays using Remotion compositions. The final output is embedded video/GIF content that replaces or supplements static images on pages like remotion-studio-basics, editing-props, and cli-rendering.

**Key Components:**
- **Capture Pipeline**: Playwright-based screen capture from Remotion Studio
- **Tutorial Compositions**: Remotion components for cursor, zoom, highlights, and annotations
- **Rendering Workflow**: Scripts to combine captures with overlays and render final videos
- **Integration**: Embedding rendered tutorials in existing premium tips pages

## Glossary

- **Tutorial_Screencast**: A short animated video (5-15 seconds) showing one specific action in Remotion Studio with overlays
- **Capture_Frame**: A screenshot taken from Remotion Studio during a recorded interaction sequence
- **Cursor_Overlay**: An animated cursor indicator showing mouse position and click events
- **Zoom_Effect**: A smooth zoom-in animation focusing on a specific UI region
- **Highlight_Box**: A pulsing or glowing rectangle that draws attention to a UI element
- **Annotation_Overlay**: Text labels, arrows, or callouts explaining what is happening
- **Click_Indicator**: A visual ripple or pulse effect showing where a click occurred
- **Capture_Script**: A Playwright script that records a specific interaction sequence
- **Tutorial_Composition**: A Remotion composition that combines Capture_Frames with overlays
- **Render_Pipeline**: The automated workflow from capture to final video output
- **Tutorial_Step**: One discrete action demonstrated in a Tutorial_Screencast (e.g., "Click the Props panel")
- **Interaction_Sequence**: An ordered list of actions (navigate, click, type, wait) that Playwright executes
- **Frame_Sequence**: The series of Capture_Frames extracted from an Interaction_Sequence
- **Overlay_Config**: JSON configuration specifying which overlays to apply and their timing
- **Tips_Video_Embed**: The HTML/Hugo partial that embeds a Tutorial_Screencast in a tips page

## Requirements

### Requirement 1: Screen Capture Pipeline

**User Story:** As a content creator, I want to capture screen recordings from Remotion Studio, so that I can create tutorial content showing real UI interactions.

#### Acceptance Criteria

1. THE Capture_Script SHALL connect to Remotion Studio running at a configurable URL (default: localhost:3000)
2. WHEN an Interaction_Sequence is executed, THE Capture_Script SHALL capture screenshots at configurable intervals (default: 100ms)
3. THE Capture_Script SHALL support the following interaction types:
   - Navigate to a specific URL or route
   - Click on an element by selector or coordinates
   - Type text into an input field
   - Wait for a specified duration
   - Wait for an element to appear
   - Hover over an element
4. THE Capture_Script SHALL record mouse position at each capture interval
5. THE Capture_Script SHALL record click events with timestamps and coordinates
6. WHEN the Interaction_Sequence completes, THE Capture_Script SHALL output:
   - A directory of numbered Capture_Frames (PNG images)
   - A JSON metadata file containing mouse positions, click events, and timing
7. IF Remotion Studio is not accessible, THEN THE Capture_Script SHALL exit with a descriptive error message
8. THE Capture_Script SHALL support configurable viewport dimensions (default: 1280x720)

### Requirement 2: Cursor Overlay Component

**User Story:** As a tutorial viewer, I want to see an animated cursor showing mouse movements and clicks, so that I can follow along with the demonstrated actions.

#### Acceptance Criteria

1. THE Cursor_Overlay component SHALL render a visible cursor icon at the recorded mouse position for each frame
2. THE Cursor_Overlay component SHALL animate smoothly between recorded positions using easing functions
3. WHEN a click event occurs, THE Cursor_Overlay SHALL display a Click_Indicator animation (ripple effect)
4. THE Cursor_Overlay component SHALL support configurable cursor styles:
   - Default pointer cursor
   - Hand cursor for clickable elements
   - Text cursor for input fields
5. THE Cursor_Overlay component SHALL accept mouse position data from the capture metadata JSON
6. THE Click_Indicator animation SHALL last 300-500ms and be clearly visible against any background

### Requirement 3: Zoom Effect Component

**User Story:** As a tutorial viewer, I want the video to zoom in on specific UI areas, so that I can clearly see small interface elements and text.

#### Acceptance Criteria

1. THE Zoom_Effect component SHALL smoothly animate from full-frame view to a zoomed region
2. THE Zoom_Effect component SHALL support configurable zoom levels (1.5x to 4x)
3. THE Zoom_Effect component SHALL accept a target region defined by:
   - Center coordinates (x, y)
   - Or bounding box (x, y, width, height)
4. THE Zoom_Effect component SHALL use easing functions for smooth zoom transitions
5. THE Zoom_Effect component SHALL support configurable zoom duration (default: 500ms)
6. WHEN zoomed in, THE Zoom_Effect SHALL maintain the zoomed view for a configurable hold duration
7. THE Zoom_Effect component SHALL smoothly animate back to full-frame view after the hold duration

### Requirement 4: Highlight Box Component

**User Story:** As a tutorial viewer, I want important UI elements to be highlighted, so that I can quickly identify what to look at.

#### Acceptance Criteria

1. THE Highlight_Box component SHALL render a visible border around a specified region
2. THE Highlight_Box component SHALL support a pulsing animation to draw attention
3. THE Highlight_Box component SHALL support configurable styles:
   - Border color (default: brand accent color)
   - Border width (default: 3px)
   - Border radius (default: 8px)
   - Glow/shadow effect
4. THE Highlight_Box component SHALL accept region coordinates from the Overlay_Config
5. THE Highlight_Box component SHALL support fade-in and fade-out animations
6. THE Highlight_Box component SHALL be clearly visible against both light and dark UI backgrounds

### Requirement 5: Annotation Overlay Component

**User Story:** As a tutorial viewer, I want text labels and arrows explaining what is happening, so that I understand each step without audio.

#### Acceptance Criteria

1. THE Annotation_Overlay component SHALL render text labels at specified positions
2. THE Annotation_Overlay component SHALL render arrow indicators pointing to UI elements
3. THE Annotation_Overlay component SHALL support configurable text styles:
   - Font size (default: 24px)
   - Font weight (default: bold)
   - Text color with background pill for readability
4. THE Annotation_Overlay component SHALL support arrow styles:
   - Curved arrows
   - Straight arrows with arrowhead
   - Configurable color and thickness
5. THE Annotation_Overlay component SHALL animate text and arrows with fade-in effects
6. THE Annotation_Overlay component SHALL position labels to avoid overlapping with the highlighted UI element
7. THE Annotation_Overlay component SHALL support step numbers (e.g., "1", "2", "3") for multi-step tutorials

### Requirement 6: Tutorial Composition Structure

**User Story:** As a developer, I want a reusable Remotion composition that combines all overlay components, so that I can efficiently create consistent tutorial videos.

#### Acceptance Criteria

1. THE Tutorial_Composition SHALL accept the following props:
   - frameSequencePath: Path to the directory of Capture_Frames
   - metadataPath: Path to the capture metadata JSON
   - overlayConfig: Configuration for overlays (cursor, zoom, highlights, annotations)
   - outputFormat: Target format (mp4, gif, webm)
2. THE Tutorial_Composition SHALL layer components in the correct order:
   - Base layer: Capture_Frames as background
   - Zoom layer: Zoom_Effect applied to base
   - Highlight layer: Highlight_Box overlays
   - Cursor layer: Cursor_Overlay with Click_Indicator
   - Annotation layer: Text labels and arrows on top
3. THE Tutorial_Composition SHALL synchronize all overlay animations with the frame timing
4. THE Tutorial_Composition SHALL support configurable frame rate (default: 30fps)
5. THE Tutorial_Composition SHALL support configurable output dimensions (default: 1280x720)
6. WHEN rendering as GIF, THE Tutorial_Composition SHALL optimize for file size while maintaining readability

### Requirement 7: Overlay Configuration Format

**User Story:** As a content creator, I want to define overlay timing and positioning in a configuration file, so that I can customize tutorials without modifying code.

#### Acceptance Criteria

1. THE Overlay_Config SHALL be defined in JSON format
2. THE Overlay_Config SHALL support timeline-based overlay definitions with start and end frames
3. THE Overlay_Config SHALL support the following overlay types:
   - cursor: { enabled: boolean, style: string }
   - zoom: { startFrame, endFrame, targetRegion, zoomLevel, holdDuration }
   - highlight: { startFrame, endFrame, region, style }
   - annotation: { startFrame, endFrame, text, position, arrow }
4. THE Overlay_Config SHALL support multiple overlays of the same type with different timings
5. THE Overlay_Config SHALL be validated before rendering with clear error messages for invalid configurations
6. THE system SHALL provide example Overlay_Config templates for common tutorial patterns

### Requirement 8: Render Pipeline Automation

**User Story:** As a content creator, I want an automated pipeline to render tutorial videos, so that I can efficiently produce multiple tutorials.

#### Acceptance Criteria

1. THE Render_Pipeline SHALL accept a tutorial definition file specifying:
   - Capture script to execute
   - Overlay configuration to apply
   - Output filename and format
2. THE Render_Pipeline SHALL execute the following steps in order:
   - Start Remotion Studio if not running (or verify it is accessible)
   - Execute the Capture_Script to generate frames and metadata
   - Validate the Overlay_Config
   - Render the Tutorial_Composition using Remotion CLI
   - Output the final video to the specified location
3. THE Render_Pipeline SHALL support batch rendering of multiple tutorials
4. THE Render_Pipeline SHALL provide progress output during rendering
5. IF any step fails, THEN THE Render_Pipeline SHALL output a descriptive error and stop
6. THE Render_Pipeline SHALL clean up temporary capture files after successful rendering (configurable)

### Requirement 9: Tutorial Content for Remotion Studio Basics

**User Story:** As a site visitor learning Remotion, I want video tutorials showing basic Studio interactions, so that I can see exactly where to click and what to do.

#### Acceptance Criteria

1. THE system SHALL include Tutorial_Screencasts for the following actions:
   - Opening the Props panel and editing a text value
   - Using the timeline scrubber to navigate frames
   - Previewing a composition with play/pause controls
   - Switching between compositions in the sidebar
   - Using keyboard shortcuts (spacebar for play, arrow keys for frames)
2. EACH Tutorial_Screencast SHALL demonstrate ONE specific action
3. EACH Tutorial_Screencast SHALL be 5-15 seconds in duration
4. EACH Tutorial_Screencast SHALL include:
   - Cursor movement showing the path to the target element
   - Highlight on the target element before clicking
   - Click indicator when the action is performed
   - Brief annotation explaining the action
5. THE Tutorial_Screencasts SHALL be rendered in both MP4 and GIF formats

### Requirement 10: Tutorial Content for Editing Props

**User Story:** As a template user, I want video tutorials showing how to edit props, so that I can customize templates effectively.

#### Acceptance Criteria

1. THE system SHALL include Tutorial_Screencasts for the following actions:
   - Locating and opening the Props panel
   - Editing text content in a text prop field
   - Changing color values using the color picker
   - Adjusting numeric values (duration, size, position)
   - Saving changes and seeing the preview update
2. EACH Tutorial_Screencast SHALL demonstrate ONE specific prop editing action
3. EACH Tutorial_Screencast SHALL show the before and after state of the change
4. THE Tutorial_Screencasts SHALL use zoom effects to show small input fields clearly

### Requirement 11: Tutorial Content for CLI Rendering

**User Story:** As a developer, I want video tutorials showing CLI rendering commands, so that I can render videos programmatically.

#### Acceptance Criteria

1. THE system SHALL include Tutorial_Screencasts for the following actions:
   - Opening a terminal and navigating to the project directory
   - Running a basic render command with composition name
   - Specifying output format and quality options
   - Viewing render progress and completion
2. EACH Tutorial_Screencast SHALL show the terminal with clear, readable text
3. THE Tutorial_Screencasts SHALL use annotations to explain command flags and options
4. THE Tutorial_Screencasts SHALL highlight the output file location after rendering completes

### Requirement 12: Tips Page Video Integration

**User Story:** As a site visitor, I want tutorial videos embedded in the tips pages, so that I can watch demonstrations alongside the text content.

#### Acceptance Criteria

1. THE Tips_Video_Embed partial SHALL support embedding Tutorial_Screencasts in tips cards
2. THE Tips_Video_Embed partial SHALL support both video (MP4/WebM) and animated GIF formats
3. WHEN a video is embedded, THE partial SHALL display:
   - A poster frame before playback
   - Play/pause controls
   - A loop option for short tutorials
4. THE Tips_Video_Embed partial SHALL be responsive and maintain aspect ratio
5. THE tips-card partial SHALL be extended to support a "video" or "screencast" field
6. WHEN a card has a screencast specified, THE card SHALL display the video instead of or alongside text content
7. THE embedded videos SHALL autoplay when scrolled into view (muted, with user control to unmute)

### Requirement 13: Asset Organization

**User Story:** As a developer, I want tutorial assets organized in a clear directory structure, so that I can easily manage and update content.

#### Acceptance Criteria

1. THE system SHALL organize tutorial assets in the following structure:
   - `static/tutorials/` - Rendered video files for Hugo
   - `src/remotion/tutorials/` - Remotion compositions for tutorial overlays
   - `scripts/tutorials/` - Capture scripts and render pipeline
   - `data/tutorials/` - Overlay configurations and tutorial definitions
2. EACH tutorial SHALL have a consistent naming convention: `{page-slug}-{action-slug}.{format}`
   - Example: `remotion-studio-basics-open-props-panel.mp4`
3. THE system SHALL include a manifest file listing all available tutorials with metadata
4. THE manifest SHALL include: tutorial ID, page association, duration, file paths, description

### Requirement 14: Development Workflow

**User Story:** As a developer, I want a streamlined workflow for creating new tutorials, so that I can efficiently add content.

#### Acceptance Criteria

1. THE system SHALL provide a CLI command or npm script to create a new tutorial scaffold
2. THE scaffold SHALL generate:
   - A capture script template with common interaction patterns
   - An overlay configuration template
   - A tutorial definition file
3. THE system SHALL provide a preview mode to test overlays before final rendering
4. THE system SHALL support re-rendering individual tutorials without affecting others
5. THE system SHALL provide documentation for the tutorial creation workflow

### Requirement 15: Performance and Quality

**User Story:** As a site visitor, I want tutorial videos to load quickly and display clearly, so that I have a good learning experience.

#### Acceptance Criteria

1. THE rendered GIF files SHALL be optimized to under 2MB for typical 10-second tutorials
2. THE rendered MP4 files SHALL use H.264 encoding for broad browser compatibility
3. THE system SHALL support WebM format as an alternative for smaller file sizes
4. THE video dimensions SHALL match the tips page layout (responsive, max 1280px width)
5. THE frame rate SHALL be sufficient for smooth cursor movement (minimum 24fps, recommended 30fps)
6. THE text in tutorials SHALL remain readable after compression (minimum effective resolution for UI text)

