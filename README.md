# ActiveMC Classic 6 – Hawtio Plugin

A modern, fast, and modular management console for ActiveMC Classic 6, built as a
self‑contained Hawtio 4 plugin running on Jetty 11 / Jakarta EE.

![Build](https://github.com/afurlane/activemq-classic-hawtio/actions/workflows/build.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue)
![Hawtio](https://img.shields.io/badge/Hawtio-4.x-orange)
![Jetty](https://img.shields.io/badge/Jetty-11%20%2F%20Jakarta%20EE-green)
![Dependabot](https://img.shields.io/badge/dependabot-enabled-brightgreen)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://www.conventionalcommits.org/en/v1.0.0/)
[![Release Automation](https://img.shields.io/badge/Release%20Automation-Enabled-brightgreen)](RELEASE_PROCESS.md)

---

## Key Features

### ✔️ Queues
- Queue list
- Detailed metrics
- Charts and trends
- Alerts
- Throughput and lag
- Storage usage
- DLQ inspection
- Consumers overview
- Operations
- Message browser

### ✔️ Topics
- Topic list
- Detailed metrics
- Charts and alerts
- Subscribers and producers
- Operations
- Send message
- Delete topic

### ✔️ Broker
- Global dashboard
- Trends and activity
- Throughput
- Storage usage
- Alerts
- Top producers
- Top consumers

### ✔️ Router
- Hash‑based routing
- No external dependencies
- Fully compatible with Hawtio 4

---

## Installation

1. Clone the repository  
2. Install UI dependencies:

```sh
npm install
```
3. Build production assets:
```sh
npm run build
```
4. Build the plugin JAR:
```sh
mvn clean package
```
5. Drop the resulting JAR into your Hawtio plugins directory and test.

# Architecture
See [Architecture](Architecture.md) for a detailed overview of:
- Plugin lifecycle
- Servlet integration
- UI resource bundling
- Jetty / Jakarta EE compatibility
- Module boundaries and extension points

# Roadmap
Short‑term
- Add screenshots and UI documentation
- Improve metrics visualization
- Add more broker‑level insights
- Expand test coverage

Mid‑term
- Introduce plugin configuration UI
- Add message search and filtering
- Improve DLQ tooling
- Add performance profiling tools

Long‑term
- Optional multi‑module architecture
- Support for additional brokers
- Advanced routing strategies
- Plugin marketplace integration

# Security
Do not report security issues publicly.
See [SECURITY.md](SECURITY.md) for the full disclosure policy.

# Code of Conduct
This project follows a respectful and collaborative community model.
See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

# Contributing
Contributions are welcome.
Before opening an issue or pull request, please review:
- Issue templates see [issue templates](.github/ISSUE_TEMPLATE/)
- Pull request template: see [pull_request_template.md](.github/pull_request_template.md)
- Dependency update policy: see [.github/dependabot.yml](.github/dependabot.yml)

All contributions should maintain:
- Code clarity and consistency
- Compatibility with Hawtio and Jetty
- Minimal external dependencies
- Operational stability
See [CONTRIBUTING.md](CONTRIBUTING.md)

# Dependency Update Policy
Dependabot is configured with:
- Annual update schedule
- Grouped updates (Jetty, Hawtio, Jackson, Logging, Test, Build)
- Exclusions for Jakarta EE and SLF4J (version‑locked to Hawtio)
- GitHub Actions updates included
See .github/dependabot.yml for details.

# License
MIT License.
See the [LICENSE.md](LICENSE.md) file for more information.
