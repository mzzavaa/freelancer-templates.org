# Missing Template Compositions Bugfix Design

## Overview

This bugfix addresses the data inconsistency where 8 templates (128 variants) are defined in `data/templates.json` but have no corresponding Remotion composition implementations. The fix removes these orphaned template entries from the data layer, eliminating render failures, broken preview images, and non-functional player links.

**Approach**: Data cleanup (remove orphaned entries) rather than feature implementation (creating 128 new Remotion compositions would be a massive undertaking outside the scope of a bugfix).

## Glossary

- **Bug_Condition (C)**: A template entry exists in `data/templates.json` but has no corresponding Remotion `<Composition>` registration in `src/remotion/Root.tsx`
- **Property (P)**: All templates in `data/templates.json` have matching Remotion implementations, enabling successful rendering
- **Preservation**: Existing implemented templates continue to render correctly; Hugo site builds without errors
- **Orphaned Template**: A template defined in the data layer without a corresponding Remotion implementation
- **Composition ID**: The unique identifier for a Remotion composition (format: `TemplateName-VariantName`)

## Bug Details

### Bug Condition

The bug manifests when the render script or player attempts to use a composition ID that exists in `data/templates.json` but has no corresponding Remotion implementation. The system fails because it cannot find the composition to render.

**Formal Specification:**
```
FUNCTION isBugCondition(templateEntry)
  INPUT: templateEntry from data/templates.json
  OUTPUT: boolean
  
  compositionId := templateEntry.variants[*].id
  remotionCompositions := getAllCompositionIds(src/remotion/Root.tsx)
  
  RETURN compositionId NOT IN remotionCompositions
END FUNCTION
```

**Orphaned Templates (8 templates, 128 variants):**

| Template | Camel Case | Variants | Status |
|----------|------------|----------|--------|
| LinkedIn Carousel | LinkedinCarousel | 16 | No Remotion implementation |
| Email Signature | EmailSignature | 16 | No Remotion implementation |
| Time Tracking | TimeTracking | 16 | No Remotion implementation |
| Expense Report | ExpenseReport | 16 | No Remotion implementation |
| Contract Summary | ContractSummary | 16 | No Remotion implementation |
| Project Closeout | ProjectCloseout | 16 | No Remotion implementation |
| Weekly Update | WeeklyUpdate | 16 | No Remotion implementation |
| Client Feedback | ClientFeedback | 16 | No Remotion implementation |

### Examples

- **Render failure**: Running `./scripts/render-thumbnails.sh LinkedinCarousel` fails with "Could not find composition with ID LinkedinCarousel-DarkSlide"
- **Broken preview**: Visiting `/library/emailsignature/` shows broken image placeholders because `static/previews/showcase/EmailSignature-DarkClassic.png` cannot be generated
- **Player error**: Navigating to `/player/?comp=TimeTracking-DarkWeekly` returns an error because the composition doesn't exist
- **Batch render failure**: Running `./scripts/render-thumbnails.sh all` fails partway through when it encounters the first orphaned template

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- All existing implemented templates (Testimonial, AffiliateReview, AgentDashboard, etc.) continue to render successfully
- Hugo site builds complete without errors
- Player loads and plays all implemented compositions correctly
- Render script successfully processes all implemented templates
- Template library pages for implemented templates display correct preview images

**Scope:**
The fix only removes orphaned template entries from `data/templates.json`. No changes to:
- `src/remotion/Root.tsx` (no new compositions added)
- `scripts/render-thumbnails.sh` (render logic unchanged)
- Hugo layouts or templates
- Existing Remotion composition implementations

## Hypothesized Root Cause

Based on the bug description, the root cause is:

1. **Premature Data Entry**: Template entries were added to `data/templates.json` before their Remotion implementations were created, likely as placeholders for planned future templates

2. **Missing Implementation Follow-through**: The corresponding Remotion compositions were never implemented, leaving the data entries orphaned

3. **No Validation Layer**: There is no automated check to ensure data/template consistency with Remotion implementations

4. **Hugo Content Pages Created**: Hugo content pages (`content/library/*.md`) were also created for these templates, compounding the visibility of the issue

## Correctness Properties

Property 1: Bug Condition - Orphaned Templates Removed

_For any_ template entry in `data/templates.json` where the bug condition holds (no corresponding Remotion composition exists), the fixed data file SHALL NOT contain that template entry, eliminating the source of render failures.

**Validates: Requirements 2.1, 2.4**

Property 2: Preservation - Implemented Templates Unchanged

_For any_ template entry in `data/templates.json` where the bug condition does NOT hold (a corresponding Remotion composition exists), the fixed data file SHALL retain that template entry exactly as before, preserving all existing functionality.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

## Fix Implementation

### Changes Required

**File**: `data/templates.json`

**Specific Changes**:

1. **Remove LinkedinCarousel entry**: Delete the entire template object for `"slug": "linkedincarousel"` (lines ~7556-7647)

2. **Remove EmailSignature entry**: Delete the entire template object for `"slug": "emailsignature"` (lines ~7649-7740)

3. **Remove TimeTracking entry**: Delete the entire template object for `"slug": "timetracking"` (lines ~7742-7833)

4. **Remove ExpenseReport entry**: Delete the entire template object for `"slug": "expensereport"` (lines ~7835-7926)

5. **Remove ContractSummary entry**: Delete the entire template object for `"slug": "contractsummary"` (lines ~7928-8019)

6. **Remove ProjectCloseout entry**: Delete the entire template object for `"slug": "projectcloseout"` (lines ~8021-8112)

7. **Remove WeeklyUpdate entry**: Delete the entire template object for `"slug": "weeklyupdate"` (lines ~8114-8205)

8. **Remove ClientFeedback entry**: Delete the entire template object for `"slug": "clientfeedback"` (lines ~8207-8298)

**Optional Cleanup** (recommended but not required for the fix):

9. **Remove Hugo content pages**: Delete the corresponding content files:
   - `content/library/linkedincarousel.md`
   - `content/library/emailsignature.md`
   - `content/library/timetracking.md`
   - `content/library/expensereport.md`
   - `content/library/contractsummary.md`
   - `content/library/projectcloseout.md`
   - `content/library/weeklyupdate.md`
   - `content/library/clientfeedback.md`

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, confirm the bug exists on unfixed code, then verify the fix eliminates the bug while preserving existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Confirm the bug exists BEFORE implementing the fix by attempting to render orphaned templates.

**Test Plan**: Run the render script targeting orphaned templates and observe the failure.

**Test Cases**:
1. **LinkedinCarousel Render Test**: Run `npx remotion still src/remotion/index.ts LinkedinCarousel-DarkSlide test.png` (will fail on unfixed code)
2. **EmailSignature Render Test**: Run `npx remotion still src/remotion/index.ts EmailSignature-DarkClassic test.png` (will fail on unfixed code)
3. **Batch Render Test**: Run `./scripts/render-thumbnails.sh LinkedinCarousel` (will fail on unfixed code)

**Expected Counterexamples**:
- Error: "Could not find composition with ID LinkedinCarousel-DarkSlide"
- Render script exits with non-zero status
- No output file generated

### Fix Checking

**Goal**: Verify that after removing orphaned templates from `data/templates.json`, the render script no longer attempts to render non-existent compositions.

**Pseudocode:**
```
FOR ALL templateEntry IN data/templates.json (after fix) DO
  compositionId := templateEntry.variants[0].id
  result := attemptRender(compositionId)
  ASSERT result.success = true
END FOR
```

**Test Cases**:
1. **Verify orphaned templates removed**: Parse `data/templates.json` and confirm none of the 8 orphaned template slugs exist
2. **Render script success**: Run `./scripts/render-thumbnails.sh all` and verify no "Could not find composition" errors
3. **Template count verification**: Confirm template count decreased by 8 (and variant count by 128)

### Preservation Checking

**Goal**: Verify that all implemented templates continue to work correctly after the fix.

**Pseudocode:**
```
FOR ALL templateEntry IN data/templates.json (after fix) DO
  ASSERT hasRemotionComposition(templateEntry.variants[0].id) = true
  ASSERT renderSucceeds(templateEntry.variants[0].id) = true
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It can verify all remaining templates have valid compositions
- It catches any accidental removal of implemented templates
- It provides strong guarantees that the fix is surgical and targeted

**Test Cases**:
1. **Testimonial Preservation**: Verify `npx remotion still src/remotion/index.ts Testimonial-DarkCentered test.png` succeeds
2. **AffiliateReview Preservation**: Verify `npx remotion still src/remotion/index.ts AffiliateReview-DarkScorecard test.png` succeeds
3. **Hugo Build Preservation**: Run `hugo build` and verify no errors related to missing templates
4. **JSON Validity**: Verify `data/templates.json` is valid JSON after edits

### Unit Tests

- Verify `data/templates.json` is valid JSON
- Verify no orphaned template slugs remain in the file
- Verify all remaining templates have corresponding Remotion imports in `Root.tsx`

### Property-Based Tests

- Generate random template selections from `data/templates.json` and verify each has a valid Remotion composition
- Verify the render script can process any randomly selected template from the data file

### Integration Tests

- Run full render pipeline for a sample of implemented templates
- Verify Hugo site builds successfully
- Verify player loads correctly for implemented templates
