# Implementation Plan: Configuration-Based Theme Framework

## Overview

This implementation plan converts the theme framework design into actionable coding tasks. The framework decouples themes from templates using registries, enables dynamic composition generation, and supports BrandKit for custom theming. Tasks are organized to build incrementally, with each step validating core functionality before proceeding.

## Tasks

- [x] 1. Set up core interfaces and type definitions
  - [x] 1.1 Create Theme interface and related types
    - Create `src/remotion/themes/types/theme.ts`
    - Define `Theme` interface with all color, typography, and card properties
    - Define `ThemeCategory` type union ("original" | "extended" | "european" | "flat" | "canva" | "custom")
    - Define `ThemePreset` type for bulk theme registration
    - Define `DerivedColors` and `TextColors` helper types
    - _Requirements: 1.1, 1.6, 2.1-2.7_

  - [x] 1.2 Create TemplateConfig interface and related types
    - Create `src/remotion/themes/types/template.ts`
    - Define `TemplateConfig` interface with id, name, component, layouts, dimensions, compatibility rules
    - Define `ValidationResult` type for template validation
    - Define `TemplateProps` base interface that all templates will extend
    - _Requirements: 4.1-4.5, 5.1-5.7_

  - [x] 1.3 Create CompositionConfig interface and related types
    - Create `src/remotion/themes/types/composition.ts`
    - Define `CompositionConfig` interface with id, legacyId, component, dimensions, defaultProps
    - Define composition ID generation types
    - _Requirements: 7.1-7.6, 9.1-9.3_

  - [x] 1.4 Create BrandKit interface
    - Create `src/remotion/themes/types/brandkit.ts`
    - Define `BrandKit` interface with optional color and typography overrides
    - Define validation types for BrandKit
    - _Requirements: 11.1-11.8, 13.1-13.3_

  - [x] 1.5 Create barrel export for all types
    - Create `src/remotion/themes/types/index.ts`
    - Export all interfaces and types from a single entry point
    - _Requirements: 1.1, 4.1, 7.1, 11.1_

- [x] 2. Checkpoint - Ensure all types compile correctly
  - Ensure TypeScript compilation passes with no errors
  - Ask the user if questions arise

- [x] 3. Implement ThemeRegistry
  - [x] 3.1 Create ThemeRegistry class with core operations
    - Create `src/remotion/themes/registry/ThemeRegistry.ts`
    - Implement `getTheme(name: string): Theme | undefined`
    - Implement `getAllThemes(): Theme[]`
    - Implement `getThemeNames(): string[]`
    - Implement internal theme storage using Map
    - _Requirements: 1.1-1.5_

  - [x] 3.2 Implement theme registration with validation
    - Implement `registerTheme(name: string, theme: Theme): void`
    - Implement `registerPreset(preset: ThemePreset): void`
    - Freeze theme objects on registration to ensure immutability
    - Throw `ThemeValidationError` for invalid themes
    - _Requirements: 1.6, 1.7, 17.1, 17.2_

  - [x] 3.3 Implement theme validation logic
    - Implement `isValidTheme(theme: unknown): theme is Theme`
    - Validate all color fields are valid CSS colors (hex, rgb, rgba, hsl)
    - Validate `bg` field accepts colors or CSS gradient strings
    - Validate `borderRadius` is non-negative
    - Validate `headingWeight` and `bodyWeight` are valid font weights (100-900)
    - Validate `fontFamily` is a valid CSS font-family string
    - _Requirements: 2.1-2.8_

  - [x] 3.4 Implement theme filtering and categorization
    - Implement `getThemesByCategory(category: ThemeCategory): Theme[]`
    - Implement `getCompatibleThemes(templateId: string): Theme[]`
    - Handle `compatibleThemes` and `excludedThemes` template properties
    - _Requirements: 3.1-3.4_

  - [x] 3.5 Write unit tests for ThemeRegistry
    - Test theme registration with valid and invalid inputs
    - Test theme retrieval by name
    - Test theme immutability after registration
    - Test filtering by category
    - Test compatibility filtering
    - _Requirements: 1.1-1.7, 2.1-2.8, 3.1-3.4, 17.1-17.2_

- [x] 4. Implement TemplateRegistry
  - [x] 4.1 Create TemplateRegistry class with core operations
    - Create `src/remotion/themes/registry/TemplateRegistry.ts`
    - Implement `getTemplate(id: string): TemplateConfig | undefined`
    - Implement `getAllTemplates(): TemplateConfig[]`
    - Implement internal template storage using Map
    - _Requirements: 4.1-4.4_

  - [x] 4.2 Implement template registration with validation
    - Implement `registerTemplate(config: TemplateConfig): void`
    - Implement `validateTemplate(config: TemplateConfig): ValidationResult`
    - Validate `id` is lowercase kebab-case
    - Validate `layouts` array has at least one entry
    - Validate `defaultLayout` is present in `layouts` array
    - Validate `width` and `height` are positive integers
    - Validate `fps` is one of 24, 25, 30, or 60
    - Validate `durationInFrames` is positive
    - _Requirements: 5.1-5.7_

  - [x] 4.3 Implement template filtering and orphan detection
    - Implement `getTemplatesByCategory(category: string): TemplateConfig[]`
    - Implement `getOrphanedTemplates(): TemplateConfig[]`
    - Track `hasImplementation` status for each template
    - Return orphaned templates sorted by template ID
    - _Requirements: 4.5, 6.1-6.3_

  - [x] 4.4 Write unit tests for TemplateRegistry
    - Test template registration with valid and invalid configs
    - Test template retrieval by ID
    - Test validation error messages
    - Test orphaned template detection
    - Test filtering by category
    - _Requirements: 4.1-4.5, 5.1-5.7, 6.1-6.3_

- [x] 5. Checkpoint - Ensure registries work correctly
  - Ensure all tests pass
  - Ask the user if questions arise

- [x] 6. Implement ThemeFactory
  - [x] 6.1 Create ThemeFactory class with theme creation
    - Create `src/remotion/themes/factory/ThemeFactory.ts`
    - Implement `createTheme(config: ThemeConfig): Theme`
    - Implement `getPreset(name: string): Theme`
    - Implement `listPresets(): string[]`
    - _Requirements: 10.1-10.3_

  - [x] 6.2 Implement color derivation algorithms
    - Implement `deriveSecondaryColors(primaryColor: string): DerivedColors`
    - Implement `deriveTextColors(backgroundColor: string): TextColors`
    - Implement `hexToRgb()` and `calculateLuminance()` helper functions
    - Implement `shiftColor()` for light/dark background adjustments
    - Derive `bgSecondary` by shifting background color appropriately
    - Derive `bgGlass` with appropriate alpha transparency
    - Derive `textSecondary` at 70% opacity of `textPrimary`
    - Derive `textMuted` at 45% opacity of `textPrimary`
    - Derive `cardBorder` at 25% opacity of accent color
    - Derive `cardShadow` appropriate for light or dark backgrounds
    - _Requirements: 12.1-12.7_

  - [x] 6.3 Implement BrandKit application
    - Implement `createFromBrandKit(baseTheme: Theme, brandKit: BrandKit): Theme`
    - Apply `primaryColor` → `accent` and derive `accentGradient`
    - Apply `bgColor` → derive `bgSecondary` and `bgGlass`
    - Apply `textColor` → derive `textSecondary` and `textMuted`
    - Apply `fontFamily` to theme
    - Ensure base theme is NOT mutated
    - Return base theme unchanged when BrandKit is undefined or empty
    - Ensure idempotent application (applying twice = applying once)
    - _Requirements: 11.1-11.8_

  - [x] 6.4 Implement color validation
    - Implement `validateColors(colors: Partial<Theme>): ValidationResult`
    - Validate all color inputs are valid CSS colors
    - Throw `BrandKitValidationError` for invalid hex colors
    - Validate derived colors are valid hex colors
    - _Requirements: 13.1-13.3_

  - [x] 6.5 Write unit tests for ThemeFactory
    - Test theme creation from config
    - Test color derivation algorithms
    - Test BrandKit application with partial overrides
    - Test BrandKit idempotence
    - Test color validation
    - _Requirements: 10.1-10.3, 11.1-11.8, 12.1-12.7, 13.1-13.3_

- [x] 7. Implement CompositionGenerator
  - [x] 7.1 Create CompositionGenerator class with core generation
    - Create `src/remotion/themes/generator/CompositionGenerator.ts`
    - Implement constructor accepting `TemplateRegistry` and `ThemeRegistry`
    - Implement `generateCompositions(): CompositionConfig[]`
    - Implement `generateForTemplate(templateId: string): CompositionConfig[]`
    - Implement `generateForTheme(themeName: string): CompositionConfig[]`
    - _Requirements: 7.1-7.6_

  - [x] 7.2 Implement composition ID generation
    - Implement `generateCompositionId(template, theme, layout): string`
    - Generate IDs in PascalCase format matching pattern "Template-Theme-Layout"
    - Implement `generateUniqueId()` to append numeric suffix for conflicts
    - Ensure all composition IDs are unique
    - _Requirements: 7.4-7.6, 18.1-18.3_

  - [x] 7.3 Implement default configuration
    - Implement `setDefaultDuration(frames: number): void`
    - Implement `setDefaultFps(fps: number): void`
    - Implement `setDefaultDimensions(width: number, height: number): void`
    - Apply template-specific overrides to defaults
    - _Requirements: 8.1-8.4_

  - [x] 7.4 Implement backward compatibility
    - Support legacy composition IDs
    - Include `legacyId` field in CompositionConfig when applicable
    - Generate IDs that match existing URL patterns
    - _Requirements: 9.1-9.3_

  - [x] 7.5 Implement orphaned template handling
    - Skip templates where `hasImplementation` is false
    - Log warning when orphaned template is encountered
    - Continue processing remaining templates after encountering orphan
    - _Requirements: 16.1-16.3_

  - [x] 7.6 Implement export methods
    - Implement `exportToRoot(): string` to generate valid Root.tsx JSX content
    - Implement `exportToJson(): string` to generate composition manifest
    - Include all Composition elements with correct props
    - _Requirements: 14.1-14.3_

  - [x] 7.7 Write unit tests for CompositionGenerator
    - Test composition generation for known template/theme combinations
    - Test unique ID generation
    - Test legacy ID preservation
    - Test orphaned template handling
    - Test export methods
    - _Requirements: 7.1-7.6, 8.1-8.4, 9.1-9.3, 14.1-14.3, 16.1-16.3, 18.1-18.3_

- [x] 8. Checkpoint - Ensure generator works correctly
  - Ensure all tests pass
  - Ask the user if questions arise

- [x] 9. Create built-in theme presets
  - [x] 9.1 Migrate existing themes to Theme interface
    - Create `src/remotion/themes/presets/index.ts`
    - Define `THEME_DARK`, `THEME_BOLD`, `THEME_CLEAN`, `THEME_WARM`, `THEME_MINIMAL`, `THEME_NEON`
    - Define extended themes: `THEME_OCEAN`, `THEME_SUNSET`, `THEME_FOREST`, `THEME_ROSE`, `THEME_GOLD`, `THEME_MIDNIGHT`
    - Define additional themes: `THEME_CRIMSON`, `THEME_LAVENDER`, `THEME_ARCTIC`, `THEME_ESPRESSO`
    - Define european themes: `THEME_CORPORATE`, `THEME_INDUSTRIAL`, `THEME_VIENNA`, `THEME_ALPINE`, `THEME_FINANCE`
    - Define flat themes: `THEME_MATERIAL_BLUE`, `THEME_MATERIAL_DARK`, `THEME_FLAT_RED`, `THEME_FLAT_NAVY`
    - Define canva themes: `THEME_SWISS`, `THEME_BAUHAUS`, `THEME_MONO`, `THEME_PAPER`, `THEME_SLATE`, `THEME_BLUEPRINT`
    - _Requirements: 1.1, 1.7, 10.2, 10.3_

  - [x] 9.2 Create GameDay theme preset
    - Create `src/remotion/themes/presets/gameday.ts`
    - Define `THEME_GAMEDAY` with GameDay-specific colors (GD_PURPLE, GD_PINK, GD_ORANGE, GD_DARK)
    - Include success/error colors for GameDay status indicators
    - _Requirements: 11.1-11.8_

- [x] 10. Create error classes
  - [x] 10.1 Create custom error classes
    - Create `src/remotion/themes/errors/index.ts`
    - Implement `ThemeValidationError` with field-level details
    - Implement `BrandKitValidationError` with invalid field names
    - Implement `TemplateValidationError` with specific errors
    - _Requirements: 2.1, 15.1-15.3_

- [x] 11. Create barrel exports and public API
  - [x] 11.1 Create main entry point
    - Create `src/remotion/themes/index.ts`
    - Export `ThemeRegistry`, `TemplateRegistry`, `CompositionGenerator`, `ThemeFactory`
    - Export all types and interfaces
    - Export built-in theme presets
    - Export error classes
    - _Requirements: 1.1, 4.1, 7.1, 10.1, 11.1_

- [x] 12. Checkpoint - Ensure public API is complete
  - Ensure all exports are accessible
  - Ensure TypeScript compilation passes
  - Ask the user if questions arise

- [x] 13. Migrate existing templates to theme-agnostic approach
  - [x] 13.1 Create TemplateProps base interface
    - Update `src/remotion/templates/_shared/types.ts` (or create if needed)
    - Define base `TemplateProps` interface with `theme: Theme`, `layout: string`, `spec: Record<string, unknown>`
    - Define optional `brandKit?: BrandKit` prop
    - _Requirements: 1.1, 11.1_

  - [x] 13.2 Update Testimonial template as reference implementation
    - Update `src/remotion/templates/testimonial/` to accept `Theme` prop
    - Remove hardcoded theme values
    - Use theme properties for all colors, typography, and card styles
    - Maintain backward compatibility with existing props
    - _Requirements: 1.1, 1.2, 9.1-9.3_

  - [x] 13.3 Register Testimonial template in TemplateRegistry
    - Create template config for Testimonial
    - Define layouts, dimensions, compatibility rules
    - Set `hasImplementation: true`
    - _Requirements: 4.1, 4.2, 5.1-5.7_

  - [x] 13.4 Write integration tests for Testimonial migration
    - Test Testimonial renders correctly with different themes
    - Test backward compatibility with existing composition IDs
    - _Requirements: 9.1-9.3_

- [x] 14. Integrate BrandKit with GameDay templates
  - [x] 14.1 Update GameDay event config to use BrandKit
    - Update `src/remotion/GameDay/config/event.ts`
    - Define `gameDayBrandKit: BrandKit` with event colors
    - Use `ThemeFactory.createFromBrandKit()` to create custom theme
    - _Requirements: 11.1-11.8_

  - [x] 14.2 Update GameDay components to use Theme
    - Update GameDay components to accept `Theme` prop
    - Replace hardcoded GD_* color constants with theme properties
    - Maintain visual consistency with existing GameDay design
    - _Requirements: 11.3-11.6_

  - [x] 14.3 Write integration tests for GameDay BrandKit
    - Test GameDay renders correctly with custom BrandKit
    - Test color derivation produces visually coherent results
    - _Requirements: 11.1-11.8, 12.1-12.7_

- [x] 15. Checkpoint - Ensure template migration works
  - Ensure all tests pass
  - Verify Testimonial and GameDay render correctly
  - Ask the user if questions arise

- [x] 16. Generate dynamic Root.tsx
  - [x] 16.1 Create composition generation script
    - Create `src/remotion/themes/scripts/generate-compositions.ts`
    - Initialize `ThemeRegistry` with all presets
    - Initialize `TemplateRegistry` with all template configs
    - Use `CompositionGenerator` to generate all compositions
    - _Requirements: 7.1-7.6, 14.1-14.3_

  - [x] 16.2 Update Root.tsx to use generated compositions
    - Update `src/remotion/Root.tsx` to import from generated config
    - Maintain existing folder structure for organization
    - Ensure all existing composition IDs continue to work
    - _Requirements: 9.1-9.3, 14.1_

  - [x] 16.3 Write integration tests for Root.tsx generation
    - Test all compositions are registered without errors
    - Test existing preview URLs continue to work
    - _Requirements: 9.1-9.3, 14.1-14.3_

- [x] 17. Document orphaned templates
  - [x] 17.1 Create orphaned template report
    - Use `TemplateRegistry.getOrphanedTemplates()` to identify orphans
    - Create `src/remotion/themes/reports/orphaned-templates.md`
    - List all templates that exist in data but lack implementations
    - _Requirements: 6.1-6.3_

- [x] 18. Final checkpoint - Ensure all tests pass
  - Run full test suite
  - Verify backward compatibility with existing URLs
  - Verify GameDay templates render with custom branding
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- The framework uses TypeScript throughout, matching the existing codebase
- Backward compatibility is critical - existing composition URLs must continue to work
- BrandKit support enables GameDay custom theming without modifying core templates
