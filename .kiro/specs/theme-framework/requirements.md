# Requirements Document

## Introduction

This document defines the formal requirements for a configuration-based theme framework that decouples themes from templates in the Remotion video generation system. The framework addresses the combinatorial explosion problem (80+ templates × 42 themes = 3,360+ compositions), enables custom color branding for GameDay templates, and reduces maintenance burden when adding new themes. Requirements are derived from the approved design document and follow EARS (Easy Approach to Requirements Syntax) patterns.

## Glossary

- **ThemeRegistry**: Central registry component that stores, retrieves, and validates theme definitions
- **TemplateRegistry**: Central registry component that stores template metadata and tracks implementation status
- **CompositionGenerator**: Component that dynamically generates Remotion composition configurations from template and theme registries
- **ThemeFactory**: Component that creates and customizes themes, including color derivation and BrandKit application
- **Theme**: Data model representing visual styling properties including colors, typography, and card styles
- **TemplateConfig**: Data model representing template metadata including layouts, dimensions, and compatibility rules
- **CompositionConfig**: Data model representing a generated Remotion composition with template, theme, and layout
- **BrandKit**: Data model representing custom brand colors and typography that can override theme defaults
- **Orphaned_Template**: A template that exists in data files but lacks a Remotion component implementation
- **Theme_Category**: Classification of themes (original, extended, european, flat, canva, custom)
- **Composition_ID**: Unique identifier for a composition in PascalCase format (e.g., "Testimonial-Ocean-Centered")

## Requirements

### Requirement 1: Theme Registration and Retrieval

**User Story:** As a developer, I want to register and retrieve themes from a central registry, so that themes can be shared across all templates without duplication.

#### Acceptance Criteria

1. WHEN a valid theme is registered with a unique name, THE ThemeRegistry SHALL store the theme and make it retrievable by that name
2. WHEN a theme is retrieved by name, THE ThemeRegistry SHALL return the exact theme object that was registered
3. WHEN a theme is retrieved that does not exist, THE ThemeRegistry SHALL return undefined
4. THE ThemeRegistry SHALL provide a method to retrieve all registered themes as an array
5. THE ThemeRegistry SHALL provide a method to retrieve all registered theme names as an array
6. WHEN a theme is registered, THE ThemeRegistry SHALL freeze the theme object to prevent mutation
7. WHEN a theme preset is registered, THE ThemeRegistry SHALL extract and store all themes from the preset

### Requirement 2: Theme Validation

**User Story:** As a developer, I want theme objects to be validated on registration, so that invalid themes cannot corrupt the system.

#### Acceptance Criteria

1. WHEN a theme is registered with invalid color values, THE ThemeRegistry SHALL throw a ThemeValidationError with field-level details
2. WHEN a theme is registered with missing required fields, THE ThemeRegistry SHALL throw a ThemeValidationError listing the missing fields
3. THE ThemeRegistry SHALL validate that all color fields contain valid CSS color values (hex, rgb, rgba, hsl)
4. THE ThemeRegistry SHALL validate that the bg field is either a valid color or a valid CSS gradient string
5. THE ThemeRegistry SHALL validate that borderRadius is a non-negative number
6. THE ThemeRegistry SHALL validate that headingWeight and bodyWeight are valid font weights (100-900)
7. THE ThemeRegistry SHALL validate that fontFamily is a valid CSS font-family string
8. THE ThemeRegistry SHALL provide an isValidTheme method that returns a boolean without throwing

### Requirement 3: Theme Filtering and Categorization

**User Story:** As a developer, I want to filter themes by category and template compatibility, so that I can find appropriate themes for specific use cases.

#### Acceptance Criteria

1. WHEN filtering themes by category, THE ThemeRegistry SHALL return only themes matching that ThemeCategory
2. WHEN requesting compatible themes for a template, THE ThemeRegistry SHALL return themes not in the template's excludedThemes list
3. WHEN a template specifies compatibleThemes, THE ThemeRegistry SHALL return only themes in that list
4. WHEN a template specifies neither compatibleThemes nor excludedThemes, THE ThemeRegistry SHALL return all themes

### Requirement 4: Template Registration and Retrieval

**User Story:** As a developer, I want to register and retrieve template configurations, so that templates can be managed centrally with their metadata.

#### Acceptance Criteria

1. WHEN a valid template config is registered, THE TemplateRegistry SHALL store it and make it retrievable by ID
2. WHEN a template is retrieved by ID, THE TemplateRegistry SHALL return the exact config that was registered
3. WHEN a template is retrieved that does not exist, THE TemplateRegistry SHALL return undefined
4. THE TemplateRegistry SHALL provide a method to retrieve all registered templates as an array
5. THE TemplateRegistry SHALL provide a method to filter templates by category

### Requirement 5: Template Validation

**User Story:** As a developer, I want template configurations to be validated, so that invalid templates cannot be registered.

#### Acceptance Criteria

1. THE TemplateRegistry SHALL validate that template id is lowercase kebab-case
2. THE TemplateRegistry SHALL validate that layouts array has at least one entry
3. THE TemplateRegistry SHALL validate that defaultLayout is present in the layouts array
4. THE TemplateRegistry SHALL validate that width and height are positive integers
5. THE TemplateRegistry SHALL validate that fps is one of 24, 25, 30, or 60
6. THE TemplateRegistry SHALL validate that durationInFrames is a positive integer
7. WHEN validation fails, THE TemplateRegistry SHALL return a ValidationResult with detailed errors

### Requirement 6: Orphaned Template Detection

**User Story:** As a developer, I want to identify templates that exist in data files but lack implementations, so that I can track and prioritize implementation work.

#### Acceptance Criteria

1. THE TemplateRegistry SHALL track the hasImplementation status for each template
2. WHEN getOrphanedTemplates is called, THE TemplateRegistry SHALL return all templates where hasImplementation is false
3. THE TemplateRegistry SHALL return orphaned templates sorted by template ID

### Requirement 7: Composition Generation

**User Story:** As a developer, I want compositions to be automatically generated from template and theme combinations, so that I don't have to manually create each composition.

#### Acceptance Criteria

1. WHEN generateCompositions is called, THE CompositionGenerator SHALL create configs for all template × theme × layout combinations
2. THE CompositionGenerator SHALL skip templates where hasImplementation is false
3. THE CompositionGenerator SHALL only use compatible themes for each template
4. WHEN generating compositions, THE CompositionGenerator SHALL ensure all composition IDs are unique
5. WHEN a composition ID would conflict, THE CompositionGenerator SHALL append a numeric suffix to create a unique ID
6. THE CompositionGenerator SHALL generate composition IDs in PascalCase format matching the pattern "Template-Theme-Layout"

### Requirement 8: Composition Configuration

**User Story:** As a developer, I want to configure default composition settings, so that generated compositions have consistent properties.

#### Acceptance Criteria

1. THE CompositionGenerator SHALL allow setting default duration in frames
2. THE CompositionGenerator SHALL allow setting default fps
3. THE CompositionGenerator SHALL allow setting default dimensions (width and height)
4. WHEN generating compositions, THE CompositionGenerator SHALL apply template-specific overrides to defaults

### Requirement 9: Backward Compatibility

**User Story:** As a developer, I want existing composition URLs to continue working after migration, so that users don't experience broken links.

#### Acceptance Criteria

1. THE CompositionGenerator SHALL support legacy composition IDs for backward compatibility
2. WHEN a composition has a legacy ID pattern, THE CompositionConfig SHALL include a legacyId field
3. THE CompositionGenerator SHALL generate IDs that match existing URL patterns

### Requirement 10: Theme Creation

**User Story:** As a developer, I want to create new themes from configuration, so that I can add themes without modifying core code.

#### Acceptance Criteria

1. WHEN createTheme is called with valid config, THE ThemeFactory SHALL return a complete Theme object
2. THE ThemeFactory SHALL provide access to built-in theme presets by name
3. THE ThemeFactory SHALL list all available preset names

### Requirement 11: BrandKit Application

**User Story:** As a developer, I want to apply custom brand colors to base themes, so that GameDay templates can use event-specific branding.

#### Acceptance Criteria

1. WHEN createFromBrandKit is called, THE ThemeFactory SHALL return a new theme with BrandKit colors applied
2. THE ThemeFactory SHALL NOT mutate the original base theme when applying BrandKit
3. WHEN BrandKit specifies primaryColor, THE ThemeFactory SHALL set accent and derive accentGradient
4. WHEN BrandKit specifies bgColor, THE ThemeFactory SHALL derive bgSecondary and bgGlass from it
5. WHEN BrandKit specifies textColor, THE ThemeFactory SHALL derive textSecondary and textMuted from it
6. WHEN BrandKit specifies fontFamily, THE ThemeFactory SHALL apply it to the theme
7. WHEN BrandKit is undefined or empty, THE ThemeFactory SHALL return the base theme unchanged
8. THE ThemeFactory SHALL apply BrandKit idempotently (applying twice produces same result as once)

### Requirement 12: Color Derivation

**User Story:** As a developer, I want secondary colors to be automatically derived from primary colors, so that themes maintain visual coherence.

#### Acceptance Criteria

1. WHEN deriveSecondaryColors is called with a valid hex color, THE ThemeFactory SHALL return complementary colors
2. THE ThemeFactory SHALL derive bgSecondary by shifting the background color appropriately for light/dark themes
3. THE ThemeFactory SHALL derive bgGlass with appropriate alpha transparency
4. THE ThemeFactory SHALL derive textSecondary at 70% opacity of textPrimary
5. THE ThemeFactory SHALL derive textMuted at 45% opacity of textPrimary
6. THE ThemeFactory SHALL derive cardBorder at 25% opacity of the accent color
7. THE ThemeFactory SHALL derive cardShadow appropriate for light or dark backgrounds

### Requirement 13: Color Validation

**User Story:** As a developer, I want color values to be validated, so that invalid colors cannot break rendering.

#### Acceptance Criteria

1. THE ThemeFactory SHALL validate that all color inputs are valid CSS colors
2. WHEN BrandKit contains invalid hex colors, THE ThemeFactory SHALL throw a BrandKitValidationError
3. THE ThemeFactory SHALL validate that derived colors are valid hex colors

### Requirement 14: Composition Export

**User Story:** As a developer, I want to export generated compositions in formats usable by Remotion, so that the build process can use them.

#### Acceptance Criteria

1. THE CompositionGenerator SHALL provide exportToRoot method that generates valid Root.tsx JSX content
2. THE CompositionGenerator SHALL provide exportToJson method that generates a composition manifest
3. WHEN exporting to Root, THE CompositionGenerator SHALL include all Composition elements with correct props

### Requirement 15: Error Handling for Invalid Registration

**User Story:** As a developer, I want clear error messages when registration fails, so that I can quickly fix issues.

#### Acceptance Criteria

1. WHEN theme registration fails validation, THE ThemeRegistry SHALL throw ThemeValidationError with field-level details
2. WHEN template registration fails validation, THE TemplateRegistry SHALL return ValidationResult with specific errors
3. WHEN BrandKit validation fails, THE ThemeFactory SHALL throw BrandKitValidationError with invalid field names

### Requirement 16: Orphaned Template Handling in Generation

**User Story:** As a developer, I want orphaned templates to be handled gracefully during composition generation, so that the build doesn't fail.

#### Acceptance Criteria

1. WHEN an orphaned template is encountered during generation, THE CompositionGenerator SHALL log a warning
2. THE CompositionGenerator SHALL skip composition generation for orphaned templates
3. THE CompositionGenerator SHALL continue processing remaining templates after encountering an orphan

### Requirement 17: Theme Immutability

**User Story:** As a developer, I want registered themes to be immutable, so that themes cannot be accidentally modified after registration.

#### Acceptance Criteria

1. WHEN a theme is retrieved from ThemeRegistry, THE theme object SHALL be frozen (immutable)
2. WHEN attempting to modify a retrieved theme, THE modification SHALL have no effect or throw an error

### Requirement 18: Composition Uniqueness

**User Story:** As a developer, I want all generated compositions to have unique IDs, so that there are no conflicts in the Remotion registry.

#### Acceptance Criteria

1. THE CompositionGenerator SHALL ensure no two compositions share the same ID
2. WHEN a duplicate ID would be generated, THE CompositionGenerator SHALL append a numeric suffix starting at 2
3. THE CompositionGenerator SHALL increment the suffix until a unique ID is found

