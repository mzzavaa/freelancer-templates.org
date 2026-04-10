# Implementation Plan: AWS Community Austria Templates Library v2

## Overview

This implementation creates a documentation and preview system for the aws-community-austria-templates repository, consisting of a landing page (docs/index.html) and an interactive Remotion player app (player/). The solution follows the established pattern from freelancer-templates.org/player and deploys via GitHub Pages.

**Target Workspace**: `aws-community-austria-templates` (NOT freelancer-templates.org)

## Tasks

- [x] 1. Set up Player App project structure
  - [x] 1.1 Create player/ directory with package.json
    - Initialize with Vite, React, @remotion/player dependencies
    - Include TypeScript and @types/react
    - Add build script for production output
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 1.2 Create vite.config.ts with path aliases and deduplication
    - Configure base: "./" for relative paths
    - Set publicDir to ../public for assets
    - Set build.outDir to ../docs/player
    - Add resolve.alias for react, react-dom, remotion, @remotion/* packages from player/node_modules
    - Add @compositions alias pointing to ../src/compositions
    - Add @components alias pointing to ../src/components
    - Add @design alias pointing to ../src/design
    - _Requirements: 3.4, 3.5, 3.6, 9.3, 10.1_

  - [x] 1.3 Create player/src/main.tsx entry point
    - Import and render App component
    - Include basic CSS reset for dark theme
    - _Requirements: 3.2_

  - [x] 1.4 Create player/index.html
    - Include viewport meta tag for responsive layout
    - Set dark background color in body
    - Link to main.tsx entry point
    - _Requirements: 3.2, 11.1, 11.2_

  - [x] 1.5 Create player/tsconfig.json
    - Configure for React JSX
    - Include path aliases matching vite.config.ts
    - _Requirements: 3.2_

- [x] 2. Implement composition registry
  - [x] 2.1 Create player/src/registry.ts with CompSpec interface
    - Define CompSpec interface with id, component, durationInFrames, fps, width, height, category
    - Import all 12 compositions from @compositions alias
    - _Requirements: 4.1, 4.2_

  - [x] 2.2 Register all 12 compositions in COMPOSITIONS array
    - Register Slides: TitleSlide, WelcomeSlide, AgendaSlide, SpeakerSlide, TeamSlide, SponsorsSlide, ThankYouSlide, MeetupSequence
    - Register Social: LinkedInAnnouncement, LinkedInRecap
    - Register Stills: MeetupThumbnail
    - Register Venue: BackgroundLoopVideo
    - Set appropriate dimensions (1920x1080 for slides/stills/venue, 1080x1080 for social)
    - Set fps to 30 for all compositions
    - Set duration: 300 frames for slides, 600-900 for social, 1 for stills, 900 for venue loop
    - _Requirements: 4.6_

  - [x] 2.3 Create COMP_BY_ID lookup object and CATEGORIES array
    - Build COMP_BY_ID from COMPOSITIONS for O(1) lookup
    - Extract unique CATEGORIES from compositions
    - _Requirements: 4.3, 4.4, 4.5_

  - [x] 2.4 Write property test for registry lookup consistency
    - **Property 4: Registry Lookup Consistency**
    - For any composition in COMPOSITIONS, COMP_BY_ID[comp.id] returns the same object
    - **Validates: Requirements 4.3, 4.4**

- [x] 3. Implement sample data module
  - [x] 3.1 Create player/src/sampleData.ts with sample props
    - Create SAMPLE_TITLE_SLIDE with groupName, groupShortName, meetupNumber, title, date, venue, hostedBy, logoPath
    - Create SAMPLE_WELCOME_SLIDE with groupName, meetupNumber, hostedBy, venue, wifiNetwork, wifiPassword, slackUrl
    - Create SAMPLE_AGENDA_SLIDE with agenda array (time, label items), groupName
    - Create SAMPLE_SPEAKER_SLIDE with talkTitle, speakerName, speakerTitle, speakerCompany, speakerPhoto, talkNumber, totalTalks
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 3.2 Add remaining slide sample data
    - Create SAMPLE_TEAM_SLIDE with groupName, members array (name, role, photo)
    - Create SAMPLE_SPONSORS_SLIDE with sponsors array, hostedBy
    - Create SAMPLE_THANK_YOU_SLIDE with groupName, sessionizeUrl, slackUrl, meetupUrl, logoPath
    - Create SAMPLE_MEETUP_SEQUENCE with all nested slide props
    - _Requirements: 5.5, 5.6, 5.7, 5.8_

  - [x] 3.3 Add social, stills, and venue sample data
    - Create SAMPLE_LINKEDIN_ANNOUNCEMENT with groupName, meetupNumber, date, venue, logoPath, talks array
    - Create SAMPLE_LINKEDIN_RECAP with groupName, meetupNumber, date, venue, logoPath, talks array, attendeeCount
    - Create SAMPLE_MEETUP_THUMBNAIL with groupName, groupShortName, meetupNumber, title, date, venue, logoPath
    - Create SAMPLE_BACKGROUND_LOOP with groupName, meetupNumber, date, venue, logoPath
    - _Requirements: 5.9, 5.10, 5.11, 5.12_

  - [x] 3.4 Create SAMPLE_PROPS lookup object
    - Map composition ids to their sample props
    - Export for use in App.tsx
    - _Requirements: 5.1-5.12_

- [x] 4. Checkpoint - Verify registry and sample data
  - Ensure TypeScript compiles without errors
  - Verify all compositions can be imported
  - Ask the user if questions arise

- [x] 5. Implement Player App UI
  - [x] 5.1 Create player/src/App.tsx with main layout
    - Implement sidebar on left, player on right layout
    - Use dark theme colors (#0f172a background, #e2e8f0 text)
    - Use orange accent color (#f97316) for interactive elements
    - _Requirements: 6.1, 6.2, 12.1, 12.2, 12.3_

  - [x] 5.2 Implement URL parameter handling
    - Create getCompFromUrl() to read ?comp= parameter
    - Create setCompInUrl() to update URL on selection
    - Create isEmbed() to detect ?embed=1 parameter
    - Pre-select composition from URL on page load
    - _Requirements: 6.6, 6.7_

  - [x] 5.3 Write property test for URL round-trip
    - **Property 3: URL Composition Selection Round-Trip**
    - For any valid composition id, setCompInUrl(id) then getCompFromUrl() returns same id
    - **Validates: Requirements 6.6, 6.7**

  - [x] 5.4 Implement composition list in sidebar
    - Group compositions by category
    - Highlight active composition
    - Handle click to select composition
    - _Requirements: 6.1, 6.5_

  - [x] 5.5 Implement search filter
    - Add search input at top of sidebar
    - Filter compositions by name (case-insensitive)
    - _Requirements: 6.3_

  - [x] 5.6 Write property test for search filter
    - **Property 1: Search Filter Correctness**
    - For any search string, all returned compositions have ids containing the search string
    - **Validates: Requirements 6.3**

  - [x] 5.7 Implement category filter buttons
    - Add filter buttons for each category (Slides, Social, Stills, Venue)
    - Add "All" button to show all compositions
    - Filter composition list based on selected category
    - _Requirements: 6.4_

  - [x] 5.8 Write property test for category filter
    - **Property 2: Category Filter Correctness**
    - For any selected category, all returned compositions have matching category field
    - **Validates: Requirements 6.4**

  - [x] 5.9 Implement Remotion Player component
    - Use @remotion/player Player component
    - Pass active composition's component, duration, fps, dimensions
    - Pass sample props from SAMPLE_PROPS lookup
    - Add playback controls
    - _Requirements: 3.3, 6.5_

  - [x] 5.10 Display composition metadata
    - Show duration, fps, dimensions below player
    - Update when composition changes
    - _Requirements: 6.9_

  - [x] 5.11 Implement keyboard navigation
    - Arrow up/down or left/right to navigate compositions
    - Update active composition and URL
    - _Requirements: 6.8_

- [x] 6. Implement embed mode
  - [x] 6.1 Create embed mode layout in App.tsx
    - Detect embed=1 URL parameter
    - Hide sidebar when in embed mode
    - Fill viewport with player
    - Enable autoplay and loop
    - _Requirements: 7.1, 7.2, 7.3_

- [x] 7. Implement responsive layout
  - [x] 7.1 Add responsive CSS for mobile/desktop
    - Stack sidebar above player when viewport < 768px
    - Side-by-side layout when viewport >= 768px
    - Maintain composition aspect ratio on resize
    - _Requirements: 11.1, 11.2, 11.3_

- [x] 8. Checkpoint - Verify Player App functionality
  - Ensure player builds without errors (npm run build)
  - Verify compositions render with sample data
  - Test search and category filters
  - Test URL parameter handling
  - Test embed mode
  - Ask the user if questions arise

- [x] 9. Create Landing Page
  - [x] 9.1 Create docs/index.html with structure
    - Add main heading "AWS Community Austria Templates"
    - Add brief description of templates library
    - Use dark theme (#0f172a background, #f97316 orange accents)
    - _Requirements: 1.1, 1.2, 1.3, 1.7_

  - [x] 9.2 Add template category sections
    - Display Slides category with 8 compositions
    - Display Social category with 2 compositions
    - Display Stills category with 1 composition
    - Display Venue category with 1 composition
    - _Requirements: 1.4, 2.1, 2.2, 2.3, 2.4_

  - [x] 9.3 Add navigation links
    - Add prominent link to Player App (/player/)
    - Add link to GitHub repository
    - Make template names clickable, linking to player with ?comp= parameter
    - _Requirements: 1.5, 1.6, 2.5, 9.4_

  - [x] 9.4 Add responsive styling
    - Ensure landing page displays correctly on mobile and desktop
    - Use CSS media queries for responsive layout
    - _Requirements: 1.8_

  - [x] 9.5 Apply consistent dark theme
    - Use same color scheme as Player App
    - Dark background (#0f172a), light text, orange accents (#f97316)
    - _Requirements: 12.4_

- [x] 10. Create GitHub Actions workflow
  - [x] 10.1 Create .github/workflows/deploy.yml
    - Trigger on push to main branch
    - Trigger on workflow_dispatch for manual runs
    - Use Node.js 20
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [x] 10.2 Add build steps
    - Install dependencies for root directory
    - Install dependencies for player directory
    - Build Player App using Vite (npm run build in player/)
    - _Requirements: 8.5, 8.6_

  - [x] 10.3 Add deployment steps
    - Copy docs/index.html to deployment root
    - Ensure player build is at /player/ path
    - Deploy to GitHub Pages using actions/deploy-pages
    - _Requirements: 8.7, 8.8, 9.1, 9.2_

- [x] 11. Final checkpoint - Verify complete implementation
  - Ensure all files are created in aws-community-austria-templates workspace
  - Verify landing page structure and links
  - Verify player app builds and runs
  - Verify GitHub Actions workflow syntax
  - Ensure all 12 compositions are registered
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP
- All implementation targets the `aws-community-austria-templates` workspace, NOT freelancer-templates.org
- Follow the reference pattern from `freelancer-templates.org/player` for architecture
- Use relative paths (base: "./") in Vite config for GitHub Pages subdirectory deployment
- Package deduplication is critical to avoid duplicate React instances when importing from parent src/
