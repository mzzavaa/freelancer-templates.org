# Implementation Plan

## Bug Summary
Remove 8 orphaned template entries from `data/templates.json` that have no corresponding Remotion composition implementations, causing render failures, broken preview images, and non-functional player links.

**Orphaned Templates**: LinkedinCarousel, EmailSignature, TimeTracking, ExpenseReport, ContractSummary, ProjectCloseout, WeeklyUpdate, ClientFeedback (128 variants total)

---

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Orphaned Template Render Failure
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to the concrete failing cases - the 8 orphaned templates
  - Test that attempting to render any orphaned template composition fails with "Could not find composition" error
  - Bug Condition from design: `isBugCondition(templateEntry)` returns true when `compositionId NOT IN remotionCompositions`
  - Expected Behavior: After fix, all templates in `data/templates.json` should have valid Remotion compositions
  - Run test on UNFIXED code by checking if orphaned template slugs exist in `data/templates.json`
  - **EXPECTED OUTCOME**: Test FAILS (orphaned templates exist in data file, confirming the bug)
  - Document counterexamples found: LinkedinCarousel, EmailSignature, TimeTracking, ExpenseReport, ContractSummary, ProjectCloseout, WeeklyUpdate, ClientFeedback
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Implemented Templates Remain Valid
  - **IMPORTANT**: Follow observation-first methodology
  - Observe: Parse `data/templates.json` and identify all implemented templates (those with Remotion compositions)
  - Observe: Verify implemented templates like Testimonial, AffiliateReview, AgentDashboard exist and have valid structure
  - Write property-based test: for all templates in `data/templates.json` that have Remotion implementations, verify they remain in the data file after fix
  - Preservation Requirements from design: All existing implemented templates continue to render successfully; Hugo site builds without errors
  - Verify test passes on UNFIXED code (implemented templates exist and are valid)
  - **EXPECTED OUTCOME**: Tests PASS (confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 3. Remove orphaned template entries from data/templates.json

  - [x] 3.1 Remove LinkedinCarousel template entry
    - Delete the entire template object for `"slug": "linkedincarousel"` from `data/templates.json`
    - _Bug_Condition: isBugCondition(LinkedinCarousel) = true (no Remotion composition exists)_
    - _Expected_Behavior: Template entry removed, no render failures for this template_
    - _Preservation: Other templates unchanged_
    - _Requirements: 2.1, 2.4_

  - [x] 3.2 Remove EmailSignature template entry
    - Delete the entire template object for `"slug": "emailsignature"` from `data/templates.json`
    - _Bug_Condition: isBugCondition(EmailSignature) = true (no Remotion composition exists)_
    - _Expected_Behavior: Template entry removed, no render failures for this template_
    - _Preservation: Other templates unchanged_
    - _Requirements: 2.1, 2.4_

  - [x] 3.3 Remove TimeTracking template entry
    - Delete the entire template object for `"slug": "timetracking"` from `data/templates.json`
    - _Bug_Condition: isBugCondition(TimeTracking) = true (no Remotion composition exists)_
    - _Expected_Behavior: Template entry removed, no render failures for this template_
    - _Preservation: Other templates unchanged_
    - _Requirements: 2.1, 2.4_

  - [x] 3.4 Remove ExpenseReport template entry
    - Delete the entire template object for `"slug": "expensereport"` from `data/templates.json`
    - _Bug_Condition: isBugCondition(ExpenseReport) = true (no Remotion composition exists)_
    - _Expected_Behavior: Template entry removed, no render failures for this template_
    - _Preservation: Other templates unchanged_
    - _Requirements: 2.1, 2.4_

  - [x] 3.5 Remove ContractSummary template entry
    - Delete the entire template object for `"slug": "contractsummary"` from `data/templates.json`
    - _Bug_Condition: isBugCondition(ContractSummary) = true (no Remotion composition exists)_
    - _Expected_Behavior: Template entry removed, no render failures for this template_
    - _Preservation: Other templates unchanged_
    - _Requirements: 2.1, 2.4_

  - [x] 3.6 Remove ProjectCloseout template entry
    - Delete the entire template object for `"slug": "projectcloseout"` from `data/templates.json`
    - _Bug_Condition: isBugCondition(ProjectCloseout) = true (no Remotion composition exists)_
    - _Expected_Behavior: Template entry removed, no render failures for this template_
    - _Preservation: Other templates unchanged_
    - _Requirements: 2.1, 2.4_

  - [x] 3.7 Remove WeeklyUpdate template entry
    - Delete the entire template object for `"slug": "weeklyupdate"` from `data/templates.json`
    - _Bug_Condition: isBugCondition(WeeklyUpdate) = true (no Remotion composition exists)_
    - _Expected_Behavior: Template entry removed, no render failures for this template_
    - _Preservation: Other templates unchanged_
    - _Requirements: 2.1, 2.4_

  - [x] 3.8 Remove ClientFeedback template entry
    - Delete the entire template object for `"slug": "clientfeedback"` from `data/templates.json`
    - _Bug_Condition: isBugCondition(ClientFeedback) = true (no Remotion composition exists)_
    - _Expected_Behavior: Template entry removed, no render failures for this template_
    - _Preservation: Other templates unchanged_
    - _Requirements: 2.1, 2.4_

  - [x] 3.9 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Orphaned Templates Removed
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior (no orphaned templates in data file)
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms orphaned templates removed)
    - _Requirements: 2.1, 2.4_

  - [x] 3.10 Verify preservation tests still pass
    - **Property 2: Preservation** - Implemented Templates Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all implemented templates still exist in `data/templates.json`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4. Remove orphaned Hugo content pages (optional cleanup)

  - [x] 4.1 Remove content/library/linkedincarousel.md
    - Delete the Hugo content page for the orphaned LinkedinCarousel template
    - _Requirements: 2.2, 2.3_

  - [x] 4.2 Remove content/library/emailsignature.md
    - Delete the Hugo content page for the orphaned EmailSignature template
    - _Requirements: 2.2, 2.3_

  - [x] 4.3 Remove content/library/timetracking.md
    - Delete the Hugo content page for the orphaned TimeTracking template
    - _Requirements: 2.2, 2.3_

  - [x] 4.4 Remove content/library/expensereport.md
    - Delete the Hugo content page for the orphaned ExpenseReport template
    - _Requirements: 2.2, 2.3_

  - [x] 4.5 Remove content/library/contractsummary.md
    - Delete the Hugo content page for the orphaned ContractSummary template
    - _Requirements: 2.2, 2.3_

  - [x] 4.6 Remove content/library/projectcloseout.md
    - Delete the Hugo content page for the orphaned ProjectCloseout template
    - _Requirements: 2.2, 2.3_

  - [x] 4.7 Remove content/library/weeklyupdate.md
    - Delete the Hugo content page for the orphaned WeeklyUpdate template
    - _Requirements: 2.2, 2.3_

  - [x] 4.8 Remove content/library/clientfeedback.md
    - Delete the Hugo content page for the orphaned ClientFeedback template
    - _Requirements: 2.2, 2.3_

- [x] 5. Checkpoint - Ensure all tests pass
  - Verify `data/templates.json` is valid JSON after edits
  - Verify no orphaned template slugs remain in the data file
  - Verify Hugo site builds successfully with `hugo build`
  - Verify all preservation tests pass (implemented templates still work)
  - Ask the user if questions arise
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5_
