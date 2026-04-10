# Requirements Document

## Introduction

This document defines the requirements for the AWS Community Austria Templates Library v2 — a documentation and preview system for the aws-community-austria-templates repository. The system provides a landing page showcasing available templates and an interactive Remotion player for previewing all compositions with sample data. The solution is deployed via GitHub Pages.

## Glossary

- **Landing_Page**: A static HTML page (docs/index.html) that showcases the templates library with descriptions, categories, and links to the player
- **Player_App**: A Vite + React application that uses @remotion/player to preview all compositions interactively
- **Composition**: A Remotion component that renders video/still content (slides, social posts, thumbnails, venue loops)
- **Registry**: A TypeScript module that lists all available compositions with their metadata (id, component, duration, fps, dimensions, category)
- **Sample_Data**: Pre-defined props for each composition that demonstrate realistic usage
- **GitHub_Pages**: Static site hosting service that serves the docs/ and player/ build output
- **Build_Workflow**: GitHub Actions workflow that builds the landing page and player, then deploys to GitHub Pages

## Requirements

### Requirement 1: Landing Page Structure

**User Story:** As a developer, I want a landing page that showcases the templates library, so that I can understand what templates are available and how to use them.

#### Acceptance Criteria

1. THE Landing_Page SHALL be located at docs/index.html
2. THE Landing_Page SHALL display the repository name "AWS Community Austria Templates" as the main heading
3. THE Landing_Page SHALL include a brief description of the templates library purpose
4. THE Landing_Page SHALL display template categories (Slides, Social, Stills, Venue) with their respective compositions
5. THE Landing_Page SHALL include a prominent link to the Player_App for interactive previews
6. THE Landing_Page SHALL include links to the GitHub repository
7. THE Landing_Page SHALL use a dark theme consistent with AWS Community branding (dark background, orange accents)
8. THE Landing_Page SHALL be responsive and display correctly on mobile and desktop devices

### Requirement 2: Template Category Display

**User Story:** As a developer, I want to see templates organized by category, so that I can quickly find the type of template I need.

#### Acceptance Criteria

1. THE Landing_Page SHALL display the Slides category containing: TitleSlide, WelcomeSlide, AgendaSlide, SpeakerSlide, TeamSlide, SponsorsSlide, ThankYouSlide, MeetupSequence
2. THE Landing_Page SHALL display the Social category containing: LinkedInAnnouncement, LinkedInRecap
3. THE Landing_Page SHALL display the Stills category containing: MeetupThumbnail
4. THE Landing_Page SHALL display the Venue category containing: BackgroundLoopVideo
5. WHEN a user clicks on a template name, THE Landing_Page SHALL navigate to the Player_App with that composition pre-selected

### Requirement 3: Player Application Setup

**User Story:** As a developer, I want a Vite + React application that previews compositions, so that I can see how templates look with sample data.

#### Acceptance Criteria

1. THE Player_App SHALL be located in the player/ directory
2. THE Player_App SHALL use Vite as the build tool with React plugin
3. THE Player_App SHALL use @remotion/player for composition playback
4. THE Player_App SHALL import compositions from the parent aws-community-austria-templates/src directory via path aliases
5. THE Player_App SHALL build to a static output directory suitable for GitHub Pages deployment
6. THE Player_App SHALL configure Vite to resolve React, remotion, and @remotion/* packages from player/node_modules to avoid duplicate React instances

### Requirement 4: Player Registry

**User Story:** As a developer, I want a registry of all compositions, so that the player can list and load them dynamically.

#### Acceptance Criteria

1. THE Registry SHALL be located at player/src/registry.ts
2. THE Registry SHALL export a CompSpec interface with: id, component, durationInFrames, fps, width, height, category
3. THE Registry SHALL export a COMPOSITIONS array containing all registered compositions
4. THE Registry SHALL export a COMP_BY_ID lookup object for O(1) composition access by id
5. THE Registry SHALL export a CATEGORIES array listing unique category names
6. THE Registry SHALL register all 12 compositions: TitleSlide, WelcomeSlide, AgendaSlide, SpeakerSlide, TeamSlide, SponsorsSlide, ThankYouSlide, MeetupSequence, LinkedInAnnouncement, LinkedInRecap, MeetupThumbnail, BackgroundLoopVideo

### Requirement 5: Sample Data for Compositions

**User Story:** As a developer, I want sample data for each composition, so that I can preview templates with realistic content.

#### Acceptance Criteria

1. THE Player_App SHALL provide sample props for TitleSlide including: groupName, groupShortName, meetupNumber, title, date, venue, hostedBy, logoPath
2. THE Player_App SHALL provide sample props for WelcomeSlide including: groupName, meetupNumber, hostedBy, venue, wifiNetwork, wifiPassword, slackUrl
3. THE Player_App SHALL provide sample props for AgendaSlide including: agenda array with time and label, groupName
4. THE Player_App SHALL provide sample props for SpeakerSlide including: talkTitle, speakerName, speakerTitle, speakerCompany, speakerPhoto, talkNumber, totalTalks
5. THE Player_App SHALL provide sample props for TeamSlide including: groupName, members array with name, role, photo
6. THE Player_App SHALL provide sample props for SponsorsSlide including: sponsors array, hostedBy
7. THE Player_App SHALL provide sample props for ThankYouSlide including: groupName, sessionizeUrl, slackUrl, meetupUrl, logoPath
8. THE Player_App SHALL provide sample props for MeetupSequence including all nested slide props
9. THE Player_App SHALL provide sample props for LinkedInAnnouncement including: groupName, meetupNumber, date, venue, logoPath, talks array
10. THE Player_App SHALL provide sample props for LinkedInRecap including: groupName, meetupNumber, date, venue, logoPath, talks array, attendeeCount
11. THE Player_App SHALL provide sample props for MeetupThumbnail including: groupName, groupShortName, meetupNumber, title, date, venue, logoPath
12. THE Player_App SHALL provide sample props for BackgroundLoopVideo including: groupName, meetupNumber, date, venue, logoPath

### Requirement 6: Player User Interface

**User Story:** As a developer, I want a sidebar navigation with composition list and filters, so that I can easily browse and preview templates.

#### Acceptance Criteria

1. THE Player_App SHALL display a sidebar on the left side containing the composition list
2. THE Player_App SHALL display the Remotion Player component on the right side
3. THE Player_App SHALL include a search input that filters compositions by name
4. THE Player_App SHALL include category filter buttons to show only compositions from a selected category
5. WHEN a user selects a composition from the sidebar, THE Player_App SHALL load that composition in the player
6. WHEN a user selects a composition, THE Player_App SHALL update the URL query parameter (?comp=composition-id)
7. WHEN the page loads with a comp query parameter, THE Player_App SHALL pre-select that composition
8. THE Player_App SHALL support keyboard navigation (arrow keys to navigate compositions)
9. THE Player_App SHALL display composition metadata (duration, fps, dimensions) below the player

### Requirement 7: Player Embed Mode

**User Story:** As a developer, I want an embed mode for the player, so that I can embed composition previews in other pages.

#### Acceptance Criteria

1. WHEN the URL contains embed=1 query parameter, THE Player_App SHALL display only the player without sidebar
2. WHEN in embed mode, THE Player_App SHALL fill the viewport with the player
3. WHEN in embed mode, THE Player_App SHALL enable autoplay and loop by default

### Requirement 8: GitHub Actions Build Workflow

**User Story:** As a maintainer, I want automated builds and deployments, so that the documentation stays up to date with the templates.

#### Acceptance Criteria

1. THE Build_Workflow SHALL be located at .github/workflows/deploy.yml
2. THE Build_Workflow SHALL trigger on push to main branch
3. THE Build_Workflow SHALL trigger on workflow_dispatch for manual runs
4. THE Build_Workflow SHALL use Node.js 20 for building
5. THE Build_Workflow SHALL install dependencies for both root and player directories
6. THE Build_Workflow SHALL build the Player_App using Vite
7. THE Build_Workflow SHALL copy the landing page and player build to the deployment directory
8. THE Build_Workflow SHALL deploy to GitHub Pages using actions/deploy-pages

### Requirement 9: Build Output Structure

**User Story:** As a maintainer, I want a predictable build output structure, so that GitHub Pages serves the correct files.

#### Acceptance Criteria

1. THE Build_Workflow SHALL output the landing page at the root (index.html)
2. THE Build_Workflow SHALL output the player at /player/ path
3. THE Player_App SHALL use relative paths (base: "./") so it works under the /player/ subdirectory
4. THE Landing_Page SHALL link to /player/ for the interactive preview

### Requirement 10: Public Assets

**User Story:** As a developer, I want public assets available to compositions, so that logos and images render correctly in previews.

#### Acceptance Criteria

1. THE Player_App SHALL configure Vite publicDir to point to the aws-community-austria-templates/public directory
2. THE Player_App SHALL include a sample AWS Community Austria logo in the public directory for preview purposes
3. WHEN a composition uses staticFile(), THE Player_App SHALL resolve the file from the public directory

### Requirement 11: Responsive Player Layout

**User Story:** As a developer, I want the player to work on different screen sizes, so that I can preview templates on any device.

#### Acceptance Criteria

1. WHILE the viewport width is less than 768px, THE Player_App SHALL stack the sidebar above the player
2. WHILE the viewport width is 768px or greater, THE Player_App SHALL display sidebar and player side by side
3. THE Player_App SHALL maintain the composition aspect ratio when resizing

### Requirement 12: Dark Theme Styling

**User Story:** As a developer, I want consistent dark theme styling, so that the player matches the AWS Community Austria brand.

#### Acceptance Criteria

1. THE Player_App SHALL use a dark background color (#0f172a or similar)
2. THE Player_App SHALL use light text colors for readability
3. THE Player_App SHALL use orange accent colors (#f97316 or similar) for interactive elements
4. THE Landing_Page SHALL use the same color scheme as the Player_App
