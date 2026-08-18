# Contributing

Thank you for your interest in contributing to the ActiveMQ Classic 6 Hawtio Plugin.

## General Guidelines

- Keep components small and modular  
- Avoid unnecessary dependencies  
- Keep the router simple (hash‑based)  
- Use Recharts for charts and visualizations  
- Maintain UI consistency with existing panels  

---

## Code Structure

### Components
- Each panel is an isolated React component  
- Main views are located in `components/<Section>/`  

### Services
- All JMX calls via Jolokia are implemented in `services/`  
- No direct Jolokia calls inside React components  

### Style
- Use the `"broker-panel"` className for panels  
- Keep CSS minimal and focused  

---

## Pull Requests

- Clearly describe what you changed and why  
- Add screenshots if you modify the UI  
- Maintain compatibility with Hawtio 4.x  

---

## Coding Style

- React functional components only  
- Use Hooks  
- No class components  
- No Redux  
- No heavy UI frameworks  

---

## Conventional Commits

This project follows the Conventional Commits specification to ensure
clear, structured, and machine‑readable commit messages.

### Format

<type>(optional scope): <description>


Example:  
`feat(queue): add throughput chart`

### Types

- **feat**: a new feature  
- **fix**: a bug fix  
- **docs**: documentation changes only  
- **style**: formatting changes (no code logic)  
- **refactor**: code changes that neither fix a bug nor add a feature  
- **perf**: performance improvements  
- **test**: adding or updating tests  
- **build**: changes to build system or dependencies  
- **ci**: changes to CI configuration or workflows  
- **chore**: maintenance tasks (no production code changes)  
- **revert**: revert a previous commit  

### Examples

- `feat(broker): add global throughput metrics`  
- `fix(queue): correct DLQ message count`  
- `docs: update installation instructions`  
- `refactor(router): simplify hash routing logic`  
- `ci: enable automatic release workflow`  
- `chore: update copyright year`  

### Rules

- Use lowercase for the type  
- Keep descriptions short and imperative  
- Use scope only when meaningful (queue, topic, broker, router, ui, etc.)  
- One commit per logical change  
- Avoid mixing unrelated changes in a single commit  

### Referencing Issues

- If a commit (or the PR it belongs to) resolves a GitHub issue, the commit
  message body **must** include a closing keyword followed by the issue
  number, e.g. `Closes #86`, `Fixes #86`, or `Resolves #86`.  
- This is required for the release automation: the release workflow closes
  issues by scanning the generated release notes for these keywords. Without
  them, the issue is released but never automatically closed.  
- When squash-merging a PR, make sure the closing keyword survives into the
  final squashed commit message (GitHub does not carry it over automatically
  unless it is present in the PR description/title or re-added manually).  

Example:

```
feat(queue-browser): add destination queue combobox

Closes #86
```

---

Thank you for contributing!
