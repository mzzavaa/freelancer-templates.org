# Orphaned Templates Report

## Overview

This report lists templates that exist in the template registry but lack Remotion component implementations. Orphaned templates are templates where `hasImplementation` is set to `false` in their configuration.

An orphaned template represents a template definition that has been registered with metadata (name, layouts, dimensions, etc.) but does not yet have a working Remotion component that can render video content.

## Current Status

| Metric | Count |
|--------|-------|
| **Total Templates** | 1 |
| **Implemented Templates** | 1 |
| **Orphaned Templates** | 0 |

> **Note:** This report reflects the current state of the TemplateRegistry. As of now, only the Testimonial template is registered, and it has a complete implementation.

## Orphaned Templates

**No orphaned templates found.**

All currently registered templates have working implementations.

## How to Identify Orphaned Templates

Orphaned templates can be identified programmatically using the `TemplateRegistry`:

```typescript
import { TemplateRegistry } from "../registry/TemplateRegistry";

const registry = new TemplateRegistry();
// ... register templates ...

const orphanedTemplates = registry.getOrphanedTemplates();

if (orphanedTemplates.length > 0) {
  console.log("Orphaned templates found:");
  orphanedTemplates.forEach(template => {
    console.log(`- ${template.id}: ${template.name}`);
    console.log(`  Category: ${template.category}`);
    console.log(`  Layouts: ${template.layouts.join(", ")}`);
  });
} else {
  console.log("No orphaned templates found.");
}
```

## How to Implement an Orphaned Template

To implement an orphaned template, follow these steps:

### 1. Create the Template Component

Create a new directory under `src/remotion/templates/` with the template ID:

```
src/remotion/templates/{template-id}/
├── {TemplateName}.tsx      # Main component
├── config.tsx              # Template configuration
├── index.ts                # Barrel export
└── __tests__/              # Unit tests
    └── {TemplateName}.test.tsx
```

### 2. Implement the Component

The component should accept `TemplateProps` and use the theme system:

```typescript
import React from "react";
import type { Theme } from "../../themes/types";

interface MyTemplateProps {
  spec: MyTemplateSpec;
  theme: Theme;
  layout: "default" | "alternate";
}

export const MyTemplate: React.FC<MyTemplateProps> = ({ spec, theme, layout }) => {
  return (
    <div style={{ 
      backgroundColor: theme.bg,
      color: theme.textPrimary,
      fontFamily: theme.fontFamily 
    }}>
      {/* Template content */}
    </div>
  );
};
```

### 3. Create the Template Configuration

Update or create the config file with `hasImplementation: true`:

```typescript
import type { TemplateConfig } from "../../themes/types";
import { MyTemplateAdapter } from "./MyTemplate";

export const MY_TEMPLATE_CONFIG: TemplateConfig = {
  id: "my-template",
  name: "My Template",
  description: "Description of the template",
  component: MyTemplateAdapter,
  layouts: ["default", "alternate"],
  defaultLayout: "default",
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 150,
  defaultProps: { /* ... */ },
  sampleSpecs: [ /* ... */ ],
  icon: "🎬",
  color: "#6366f1",
  category: "general",
  hasImplementation: true,  // Set to true when implementation is complete
};
```

### 4. Register the Template

Add the template to the composition generation script:

```typescript
// In src/remotion/themes/scripts/generate-compositions.ts
import { MY_TEMPLATE_CONFIG } from "../../templates/my-template/config";

templateRegistry.registerTemplate(MY_TEMPLATE_CONFIG);
```

### 5. Write Tests

Create tests to verify the template renders correctly with different themes:

```typescript
import { render } from "@testing-library/react";
import { MyTemplate } from "../MyTemplate";
import { THEME_DARK, THEME_OCEAN } from "../../../themes/presets";

describe("MyTemplate", () => {
  it("renders with dark theme", () => {
    const { container } = render(
      <MyTemplate spec={sampleSpec} theme={THEME_DARK} layout="default" />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with ocean theme", () => {
    const { container } = render(
      <MyTemplate spec={sampleSpec} theme={THEME_OCEAN} layout="default" />
    );
    expect(container).toMatchSnapshot();
  });
});
```

## Regenerating This Report

To regenerate this report with current data, run:

```bash
npx ts-node src/remotion/themes/scripts/generate-orphan-report.ts
```

Or use the generation script programmatically:

```typescript
import { generateWithStats } from "../scripts/generate-compositions";

const result = generateWithStats();

console.log(`Total Templates: ${result.templatesProcessed + result.templatesSkipped}`);
console.log(`Implemented: ${result.templatesProcessed}`);
console.log(`Orphaned: ${result.orphanedTemplates.length}`);

if (result.orphanedTemplates.length > 0) {
  console.log("\nOrphaned Templates:");
  result.orphanedTemplates.forEach(id => console.log(`- ${id}`));
}
```

## Related Documentation

- [Theme Framework Design](/.kiro/specs/theme-framework/design.md) - Architecture overview
- [Requirements](/.kiro/specs/theme-framework/requirements.md) - Requirements 6.1-6.3
- [TemplateRegistry](../registry/TemplateRegistry.ts) - Registry implementation
- [CompositionGenerator](../generator/CompositionGenerator.ts) - Composition generation

---

*Last updated: This is a static report. Run the generation script to get current data.*
