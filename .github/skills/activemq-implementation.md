# Operational Skill — Strict Implementation And PR Checklist
This skill defines the mandatory implementation workflow and review checklist for this repository.
It is focused on real project structure and responsibilities, not hypothetical architecture.

## Scope
- Backend is limited to plugin bootstrap and static-asset servlet responsibilities.
- Frontend implements broker interaction through Jolokia service operations.
- This repository currently does not implement a Java REST controller/service layer.

## Mandatory Architecture Rules (MUST)
- Follow current repository structure exactly.
- Do not create new top-level directories.
- Do not refactor unrelated modules unless explicitly requested.
- Use the existing React + TypeScript + PatternFly stack.
- Keep hash-based routing behavior compatible.

## Backend Rules (MUST)
- Java changes must stay under `src/main/java/eu/opensoftware`.
- Do not introduce Java REST controllers/services unless explicitly requested.
- Preserve plugin bootstrap and servlet lifecycle behavior.
- Preserve plugin metadata loading from `plugin.properties`.

## Frontend Rules (MUST)
- Frontend changes must stay under `frontend/src`.
- Use functional components and hooks only.
- Keep area-based organization (`Broker`, `Queues`, `Topics`, `Connectors`, `Common`).
- Do not introduce global state frameworks.

## Jolokia Service Boundary (MUST)
- All Jolokia calls must live in `frontend/src/services/activemq/operations`.
- Hooks and components must not call `jolokiaService` directly.
- New operations must be exposed via `ActiveMQClassicService`.
- JMX operation signatures must match ActiveMQ Classic behavior.

## Typing And Mapping Rules (MUST)
- Map raw ActiveMQ/Jolokia payloads into domain objects before rendering.
- Domain interfaces belong in `frontend/src/types/domain`.
- ActiveMQ raw attribute contracts belong in `frontend/src/types/activemq.ts`.
- Avoid introducing new `any` return types when concrete types are possible.

## SWR Data Rules (MUST)
- Add async data access through hooks under `frontend/src/hooks`.
- Use deterministic SWR keys.
- Keep refresh defaults aligned with existing patterns (5s or 10s unless justified).
- Ensure relevant keys are refreshable from the global refresh action.

## UI Rules (MUST)
- Use PatternFly components and utility conventions.
- Keep loading/error/empty states explicit.
- Use modals/confirmations for destructive actions.
- Keep custom CSS minimal and only for unavoidable edge cases.

## Routing Rules (MUST)
- Any new route must be added to parse + builder helpers in `frontend/src/router/router.ts`.
- Use encoded queue/topic route params.
- Maintain backwards-compatible defaults.

## Documentation Rules (MUST)
- Update `API.md` for new/changed operations and behavior.
- Update `Architecture.md` when boundaries or flow change.
- Update `frontend/src/help.md` for user-facing feature changes.
- Update `CHANGELOG.md` for delivered feature/fix work.

## Build And Dependency Rules (MUST)
- Preserve Yarn Berry immutability (`yarn install --immutable`).
- Preserve Maven frontend integration in `pom.xml`.
- Do not add heavy dependencies if the existing stack can cover the feature.

## Branch And Release Rules (MUST)
- `master` and `1.0` are different Hawtio version lines and must not be treated as interchangeable baselines.
- `master` maps to the 2.x line (PatternFly 6 expectations); `1.0` maps to the 1.x line (PatternFly 5 compatibility).
- Before porting changes between branches, validate branch-specific compatibility (UI framework APIs, dependency set, and build behavior).
- Apply compatible changes to both `master` and `1.0`.
- For `master`-only changes, document compatibility rationale explicitly.
- For PatternFly-version-sensitive fixes, evaluate and apply per-branch as applicable.

## Git Remote Rules (MUST)
- Use `github` as the primary remote of reference for normal development workflows.
- Treat `origin` as a backup remote.
- Prefer `github` for fetch/pull/push and branch tracking unless explicitly instructed otherwise.
- Use `origin` only for backup synchronization tasks.

## PR Checklist (MUST PASS)
- [ ] Change is scoped to requested behavior only.
- [ ] No direct Jolokia access from components/hooks.
- [ ] Domain mapping updated for new payload shapes.
- [ ] SWR key/refresh behavior is stable and consistent.
- [ ] Route parser/builders updated if navigation changed.
- [ ] Loading/error/empty states handled.
- [ ] Documentation updated (`API.md`, `help.md`, `CHANGELOG.md`, `Architecture.md` if needed).
- [ ] Build/test/lint expectations preserved.
- [ ] Branch applicability (`master` and `1.0`) evaluated and documented.
- [ ] Git remote usage follows policy (`github` primary, `origin` backup).

## Review Heuristics (SHOULD)
- Keep files small and explicit.
- Prefer additive changes over rewrites.
- Avoid speculative abstractions.
- Preserve naming and folder conventions used by neighboring code.

## Forbidden Actions
- Do not alter ActiveMQ JMX model assumptions.
- Do not introduce unrelated architectural rewrites.
- Do not change routing strategy from hash-based.
- Do not modify unrelated features while implementing a targeted request.

## External Reference Scope
Allowed external reference:
- ActiveMQ Classic JMX implementation (as listed in project instructions).