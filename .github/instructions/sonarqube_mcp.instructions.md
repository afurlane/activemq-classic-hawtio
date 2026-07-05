---
applyTo: "**/*"
---

These are some guidelines when using the SonarQube MCP server.

# Scope

- Use these instructions only when SonarQube is connected for this workspace and a valid project reference is available.
- Preferred flow: use SonarQube MCP after PR analysis/checks are available, then apply fixes in the corresponding feature branch.
- If SonarQube MCP tools are not available in the current session, continue with standard local lint/test diagnostics.

# Important Tool Guidelines

## Basic usage
- **IMPORTANT**: After you finish generating or modifying any code files at the very end of the task, you MUST call the `analyze_file_list` tool (if it exists) to analyze the files you created or modified.
- **IMPORTANT**: When starting a SonarQube-focused task, disable automatic analysis with the `toggle_automatic_analysis` tool only if that tool exists.
- **IMPORTANT**: When you are done generating code in a SonarQube-focused task, re-enable automatic analysis with the `toggle_automatic_analysis` tool only if that tool exists.

## Project Keys
- When a user mentions a project key, use `search_my_sonarqube_projects` first to find the exact project key
- Don't guess project keys - always look them up

## Code Language Detection
- When analyzing code snippets, try to detect the programming language from the code syntax
- If unclear, ask the user or make an educated guess based on syntax

## Branch and Pull Request Context
- Many operations support branch-specific analysis
- If user mentions working on a feature branch, include the branch parameter
- For PR-driven fixes, always analyze against the PR head branch that received the SonarQube analysis

## Code Issues and Violations
- After fixing issues, do not attempt to verify them using `search_sonar_issues_in_projects`, as the server will not yet reflect the updates

# Common Troubleshooting

## Authentication Issues
- SonarQube requires USER tokens (not project tokens)
- When the error `SonarQube answered with Not authorized` occurs, verify the token type

## Project Not Found
- Use `search_my_sonarqube_projects` to find available projects
- Verify project key spelling and format

## Code Analysis Issues
- Ensure programming language is correctly specified
- Remind users that snippet analysis doesn't replace full project scans
- Provide full file content for better analysis results
