# UI Style Guide (PatternFly 5 + Hawtio 4)

This plugin follows the UI conventions of Hawtio 4, PatternFly 5, and the OpenShift design language.
No custom CSS is used unless strictly necessary.

# 1. Design Principles

- **Consistency** — follow PatternFly components and spacing rules
- **Clarity** — avoid visual noise; prefer simple layouts
- **Predictability** — UI behavior should match Hawtio and OpenShift
- **No custom styling** — rely on PatternFly defaults whenever possible
- **Accessibility** — use semantic components and ARIA‑aware widgets

# 2. Components

All UI elements must use PatternFly 5 React components, including:

- Page, PageSection, Card, CardBody
- Toolbar, ToolbarItem, ToolbarGroup
- Table, Thead, Tbody, Tr, Td
- Button, Dropdown, Modal, Form, FormGroup
- Alert, EmptyState, Spinner

No ```<div class="...">``` styling unless unavoidable.

# 3. Layout

- Use PatternFly layout primitives:
    - Flex
    - Grid
    - Split
    - Bullseye
    - Stack

- Spacing follows PatternFly tokens:
    - pf-v5-u-m-md
    - pf-v5-u-p-lg
    - etc.
- Avoid custom margins/paddings.

# 4. Charts

- Use PatternFly Charts (Victory‑based) where possible
- Otherwise, Recharts is acceptable for lightweight visualizations
- Keep animations subtle
- Avoid heavy or overly complex charts

# 5. Colors

Use **PatternFly global tokens**, not custom hex values:

- --pf-v5-global--primary-color--100
- --pf-v5-global--success-color--100
- --pf-v5-global--warning-color--100
- --pf-v5-global--danger-color--100

No custom color palette unless required.

# 6. Naming Conventions

-    Components: PascalCase  
    Example: QueueDetailsPage.tsx

-    Hooks: useCamelCase  
    Example: useQueueMetrics.ts

-    Services: camelCase  
    Example: activemqClassicService.ts

-    Types: PascalCase  
    Example: QueueInfo

-    Files: match the exported component/hook name

-    No CSS files unless absolutely necessary
    If needed, use kebab-case.css.

# 7. Interaction Patterns

- Use PatternFly modals for destructive actions
- Use PatternFly alerts for errors and warnings
- Use PatternFly empty states when no data is available
- Use PatternFly skeletons for loading states
- Use PatternFly pagination for message browsing

# 8. Philosophy

- No custom CSS unless required for layout edge cases
- No custom icons — use PatternFly icons
- No custom spacing — use PatternFly utility classes
- No magic — components must be explicit and predictable
- Minimalism — UI should feel lightweight and fast