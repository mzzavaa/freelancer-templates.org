# Bugfix Requirements Document

## Introduction

Multiple templates are defined in `data/templates.json` and have corresponding Hugo content pages in `content/library/`, but lack actual Remotion composition implementations in `src/remotion/Root.tsx`. This causes render workflow failures, broken preview images, and non-functional player links across the site.

**Affected Templates (9 total, 143 variants):**
- LinkedinCarousel (16 variants)
- EmailSignature (16 variants)
- TimeTracking (16 variants)
- ExpenseReport (16 variants)
- ContractSummary (16 variants)
- ProjectCloseout (16 variants)
- WeeklyUpdate (16 variants)
- ClientFeedback (16 variants)
- GameDay/CommunityGameDay (35 variants - special case, may have separate implementation)

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the render script (`scripts/render-thumbnails.sh`) attempts to render thumbnails for templates defined in `data/templates.json` THEN the system fails with "Could not find composition with ID [TemplateName-Variant]" errors for LinkedinCarousel, EmailSignature, TimeTracking, ExpenseReport, ContractSummary, ProjectCloseout, WeeklyUpdate, and ClientFeedback templates

1.2 WHEN a user visits a template library page (e.g., `/library/linkedincarousel/`) THEN the system displays broken image placeholders because the preview images cannot be generated

1.3 WHEN a user clicks a player link (e.g., `/player/?comp=LinkedinCarousel-DarkSlide`) THEN the system returns an error because the composition does not exist in Remotion

1.4 WHEN the system iterates through `data/templates.json` to generate composition IDs THEN it produces IDs for templates that have no corresponding Remotion `<Composition>` registration in `src/remotion/Root.tsx`

### Expected Behavior (Correct)

2.1 WHEN the render script attempts to render thumbnails for templates defined in `data/templates.json` THEN the system SHALL either successfully render the thumbnail (if composition exists) OR skip the template gracefully with a warning (if composition does not exist)

2.2 WHEN a user visits a template library page THEN the system SHALL display either a valid preview image OR a placeholder indicating the template is "coming soon" / not yet available

2.3 WHEN a user clicks a player link for a template THEN the system SHALL either load the composition successfully OR display a user-friendly message indicating the template is not yet available

2.4 WHEN templates are defined in `data/templates.json` THEN the system SHALL ensure consistency by either having matching Remotion compositions OR marking the template as unavailable/draft in the data layer

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the render script processes templates that DO have Remotion implementations (e.g., Testimonial, AffiliateReview, AgentDashboard) THEN the system SHALL CONTINUE TO render thumbnails successfully

3.2 WHEN a user visits a template library page for an implemented template THEN the system SHALL CONTINUE TO display valid preview images

3.3 WHEN a user clicks a player link for an implemented template THEN the system SHALL CONTINUE TO load and play the composition correctly

3.4 WHEN the Hugo site builds THEN the system SHALL CONTINUE TO generate all existing template pages without errors

3.5 WHEN existing Remotion compositions are rendered THEN the system SHALL CONTINUE TO produce the same visual output as before
