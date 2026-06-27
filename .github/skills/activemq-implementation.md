# Operational Skill — What Copilot Must Update When Implementing Features
This skill defines how Copilot must update the repository when implementing new features or modifying existing ones.
It does not describe JMX internals; it describes the workflow and file responsibilities inside this project.

## General Rules
Copilot must follow the repository’s architecture as defined in Architecture.md.
All changes must respect the existing folder structure.
No new top‑level directories may be created.
No refactoring of unrelated components unless explicitly requested.
All new features must integrate with:
- backend Java (JMX → REST)
- frontend React/TSX (Hawtio federated plugin)
- API documentation (API.md)
- domain types (frontend/src/app/activemq/types)
- operations (frontend/src/app/activemq/services/activemq/operations)

## Backend Update Rules
When implementing a new feature:

### Java Backend
Update files under: src/main/java/eu/opensoftware/activemqclassic
Copilot must:
- Add or extend a Java service class for JMX access.
- Add or extend a REST controller exposing the new operations.
- Use existing patterns from:
  - ActiveMQClassicPluginServlet
  - existing service classes
- Return DTOs only; no business logic in controllers.

### JMX Access
Copilot must:
- Use the ObjectName patterns defined in skills/activemq-jmx.md.
- Use Jolokia-compatible operations (string-based invocation).
- Never invent JMX methods; only use those listed in the JMX skill.

## REST API Update Rules
REST endpoints must be added under: src/main/java/eu/opensoftware/activemqclassic/api

Copilot must:
- Follow existing naming conventions (/api/activemq/...).
- Document all new endpoints in API.md.
- Ensure JSON responses match the domain types in the frontend.

## Frontend Update Rules
Frontend lives under: frontend/src/app/activemq
Copilot must update:

### Domain Types
frontend/src/app/activemq/types/domain/*.ts
- Add new TypeScript interfaces for new REST responses.
- Keep naming consistent with existing domain types.

### Service Layer
frontend/src/app/activemq/services/activemq/operations/*.ts
- Add functions that call the new REST endpoints.
- Use existing patterns (queues.ts, topics.ts, etc.).

### Hooks
frontend/src/app/activemq/hooks
- Add or update hooks (useXxx.ts) to fetch new data.
- Hooks must use the service layer, not fetch directly.

### Components
frontend/src/app/activemq/components
- Add new components or extend existing ones.
- Follow the existing UI structure:
  - QueueDetailsPage.tsx
  - TopicDetailsPage.tsx
  - BrokerPanel.tsx
- New tabs must be added inside the relevant DetailsPage.

### Modals
If the feature requires user actions (e.g., remove group): frontend/src/app/activemq/components/Queues/RemoveMessageGroupModal.tsx
Copilot must:
- Follow existing modal patterns.
- Use confirmation dialogs.
- Use the service layer for actions.

## Documentation Update Rules
Copilot must update:

### API.md
- Add new endpoints.
- Add request/response examples.
- Add error cases if relevant.

### help.md
- Add user-facing documentation for new UI features.

### CHANGELOG.md
- Add an entry under “Added” or “Changed”.

## Style & Consistency Rules
- Follow STYLEGUIDE.md for frontend.
- Follow existing Java formatting conventions.
- No TODO placeholders.
- No speculative abstractions.
- No unused code.

## Forbidden Actions
Copilot must NOT:
- Modify unrelated components.
- Change the plugin bootstrap.
- Introduce new frameworks or libraries.
- Change routing structure.
- Change JMX model.
- Change REST base paths.
- Create new top-level folders.

## Implementation Workflow (Mandatory Sequence)
When implementing a feature (e.g., Message Groups):
- Backend JMX service
- REST controller
- API.md update
- Domain types
- Service layer operations
- Hooks
- UI components
- Modals (if needed)
- help.md update
- CHANGELOG.md update
Copilot must follow this sequence unless explicitly instructed otherwise.

## External References
Copilot may reference only the following external source:
- ActiveMQ Classic JMX implementation (source code path listed in copilot-instructions.md)
No other external links are allowed.