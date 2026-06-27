# Purpose
These instructions define how Copilot should generate code and propose changes within this repository.
The goal is consistency, correctness, and alignment with the plugin’s architecture.

## Architecture Overview
- Backend: Java (JMX → REST)
- Frontend: Angular (Hawtio federated plugin)
- Communication: REST API exposed under /api/activemq
- Broker interaction: JMX MBeans from ActiveMQ Classic 6
- Each feature = Java service + REST controller + Angular component

## Backend Rules
- All Java code lives under src/main/java/io/hawt/activemq.
- Use existing services as reference (QueueService, BrokerService, etc.).
- JMX access must use MBeanServerConnection and ObjectName patterns already present.
- Do not introduce new packages unless strictly necessary.
- Follow existing naming conventions:
  - Services: XxxService.java
  - Controllers: XxxController.java
- REST controllers must return JSON‑serializable DTOs only.
- No business logic inside controllers; logic stays in services.

## REST API Rules
- All endpoints must follow the existing structure under /api/activemq.
- Use plural nouns for collections (/queues, /topics).
- Use nested paths for queue‑specific operations:
    /queues/{name}/metrics
    /queues/{name}/consumers
    /queues/{name}/messages

- For Message Groups:
    GET /queues/{name}/groups
    DELETE /queues/{name}/groups/{group}
    DELETE /queues/{name}/groups

- Responses must be deterministic and typed.

## JMX Rules
Copilot must assume the plugin interacts with the ActiveMQ Classic MBeans
All JMX operations must follow these structures and naming patterns.

## Frontend Rules

- All Angular code lives under frontend/src/app/activemq.
- Each queue tab is a dedicated component.
- Use existing components as reference (queue-metrics, queue-consumers, etc.).
- REST calls must go through activemq.service.ts.
- UI must follow Hawtio style conventions (tables, actions, confirmation dialogs).
- No external libraries.

## Coding Style

- Keep code minimal and explicit.
- No TODO placeholders.
- No speculative abstractions.
- Prefer clarity over cleverness.
- Document new endpoints in API.md.

## Feature Development Pattern

When adding a new feature (e.g., Message Groups):

- Add Java service methods.
- Add REST controller endpoints.
- Add Angular component + routing.
- Add UI tab.
- Update API.md.

## Constraints

- Do not modify the JMX model.
- Do not introduce breaking changes to existing REST endpoints.
- Do not generate code outside the defined folder structure.
- Do not propose architectural rewrites.

## Skill Usage Rules
Copilot must use the skills defined under the skills/ directory when generating code or reasoning about ActiveMQ Classic, Hawtio, JMX, REST, or UI conventions.
Skills contain domain knowledge only (e.g., Domain Objects, REST mappings, JSON schemas, UI patterns).
Skills must not include external links, except those explicitly listed in the External References section of this file.
When referencing ActiveMQ Classic JMX structures, Copilot must rely exclusively on:
- the skill file skills/activemq-jmx.md
Copilot must not use JMX models from Artemis, HornetQ, or other brokers.

## External References
Copilot may reference the following external sources when needed:
- ActiveMQ Classic JMX implementation: https://github.com/apache/activemq/tree/main/activemq-broker/src/main/java/org/apache/activemq/broker/jmx

No other external links are allowed in skill files.

## Goal
Copilot should act as an assistant that respects the existing architecture, naming conventions, and design principles of this plugin.
All generated code must integrate cleanly with the current structure.