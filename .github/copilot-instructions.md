# Purpose
These instructions define how Copilot should generate code and propose changes within this repository.
The goal is consistency, correctness, and alignment with the plugin architecture that is currently implemented in this codebase.

## Source Of Truth
- When docs/instructions conflict with source code, the repository source code is authoritative.
- Before implementing a feature, verify current implementation patterns in matching folders and files.
- If you detect instruction drift, update this file as part of the same work item.

## Architecture Overview (Current)
- Backend: minimal Java plugin bootstrap and servlet for static asset serving.
- Frontend: React + TypeScript + PatternFly, loaded as a Hawtio federated plugin.
- Broker communication: Jolokia calls from frontend services.
- Routing: hash-based router.
- Data flow: Jolokia raw attributes -> domain mappers -> hooks -> components.

## Backend Rules (Java)
- All Java code lives under `src/main/java/eu/opensoftware`.
- The backend is limited to plugin bootstrap/servlet responsibilities unless explicitly requested.
- Do not introduce REST controllers/services unless there is an approved architecture change.
- Keep servlet behavior deterministic: path resolution, content type, and 404 behavior must remain explicit.
- Preserve plugin metadata wiring via `plugin.properties`.

## Frontend Rules
- All frontend code lives under `frontend/src`.
- Use React functional components and hooks only.
- Use hash-based routing helpers from `frontend/src/router/router.ts`.
- Keep views modular by area (`Broker`, `Queues`, `Topics`, `Connectors`, `Common`).
- Do not introduce state management frameworks (no Redux/MobX).

## Service Layer Rules (Jolokia)
- All Jolokia calls must be implemented only in `frontend/src/services/activemq/operations`.
- Components and hooks must not call `jolokiaService` directly.
- Keep operation names aligned with ActiveMQ Classic MBean/Jolokia signatures.
- New operations must be exposed through `ActiveMQClassicService` and typed where possible.

## Type And Mapping Rules
- Components should consume domain models from `frontend/src/types/domain`, not raw Jolokia payloads.
- Add/update mappers in `frontend/src/types/domain/*` for any new payload shape.
- Avoid introducing new `any` return types in services/hooks when a concrete type can be defined.
- Keep nullable and optional ActiveMQ fields explicit in TypeScript types.

## Data Fetching Rules (SWR)
- Use SWR for async broker data in hooks.
- Keep key construction stable and deterministic.
- New hook refresh intervals should follow existing defaults (typically 5s or 10s) unless justified.
- Ensure new SWR keys participate in global refresh behavior when relevant.

## UI Rules (PatternFly/Hawtio)
- Use PatternFly components/tokens and Hawtio-compatible patterns.
- Prefer PatternFly layout primitives over custom layout CSS.
- Keep custom CSS minimal and only for edge cases.
- Use standard loading/error/empty-state patterns in data views.
- Use confirmation dialogs/modals for destructive actions.

## Routing And Navigation Rules
- Any new route must be represented in parser + builder helpers.
- Use encoded route parameters for queue/topic names.
- Keep default route behavior backward compatible.

## Documentation Rules
- Update `API.md` when adding/changing Jolokia operations, service methods, or exposed behavior.
- Update `Architecture.md` when changing module boundaries or data flow.
- Keep docs aligned with actual implementation (no speculative architecture).

## Testing Rules
- For behavior changes in components, routing, or formatting, add/update tests under `frontend/test`.
- Keep tests focused on observable behavior.
- Reuse existing jest/testing-library setup and patterns.

## Build And Dependency Rules
- Do not bypass Yarn Berry immutability (`yarn install --immutable`).
- Keep Maven + frontend integration compatible with `pom.xml` build flow.
- Do not introduce heavy external libraries for features that can be implemented with existing stack.

## Release And Branch Rules
- If a change is compatible with both versions, apply it on both `master` and `1.0` branches.
- If a change is not compatible with `1.0`, document why and keep it `master`-only.
- PatternFly-version-specific fixes should be evaluated per branch and applied where applicable.

## Git Remote Priority Rules
- The `github` remote is the primary remote of reference for everyday work.
- The `origin` remote is a backup remote and should not be treated as the default target.
- Prefer `github` for pull, fetch, push, branch tracking, and PR-related workflows.
- Use `origin` only when explicitly requested for backup synchronization.

## Constraints
- Do not modify the ActiveMQ Classic JMX model.
- Do not introduce breaking changes to existing UI navigation and plugin loading behavior unless requested.
- Do not propose architectural rewrites unless explicitly asked.
- Prefer small, explicit, maintainable changes.

## External Reference Scope
When needed, references related to ActiveMQ Classic JMX should be based on:
- ActiveMQ Classic JMX implementation: https://github.com/apache/activemq/tree/main/activemq-broker/src/main/java/org/apache/activemq/broker/jmx

## Goal
Copilot should act as an assistant that respects the existing architecture, branch strategy, naming conventions, and design principles of this plugin.
All generated code must integrate cleanly with the current structure.
