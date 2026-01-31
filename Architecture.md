# ActiveMQ Classic Hawtio — Architecture Overview

Questa console è una UI moderna, modulare e reattiva per ActiveMQ Classic, costruita come plugin Hawtio 1.x, con routing hash‑based e componenti React.

L’obiettivo è fornire una console più potente, più chiara e più veloce rispetto al vecchio plugin Hawtio.

---

# 1. High‑Level Architecture

ActiveMQ Classic Plugin 
├── Router (hash-based)
├── Views 
│ ├── Queues 
│ ├── Topics 
│ ├── Connectors 
│ ├── Broker Dashboard 
│ └── Broker Overview 
├── Components 
│ ├── QueueDetails 
│ ├── TopicDetails 
│ ├── Broker panels 
│ └── Shared UI 
├── Services 
│ ├── activemq.ts  (JMX + Jolokia) 
│ ├── queues.ts 
│ ├── topics.ts 
│ └── broker.ts 
└── Styles


---

# 2. Routing

Il router è minimale, semplice, compatibile con Hawtio 1.x.

## Supported routes

| Route | View |
|-------|------|
| `#/queues` | Lista code |
| `#/queues/<name>` | Dettaglio coda |
| `#/topics` | Lista topic |
| `#/topics/<name>` | Dettaglio topic |
| `#/connectors` | Connectors |
| `#/broker` | Broker Dashboard |
| `#/overview` | Broker Overview |

## URL builders

- `buildQueueUrl(name)`
- `buildTopicUrl(name)`
- `buildQueuesUrl()`
- `buildTopicsUrl()`
- `buildBrokerUrl()`
- `buildOverviewUrl()`

---

# 3. Services (JMX via Jolokia)

I servizi incapsulano tutte le chiamate JMX:

## activemq.ts
- listQueues()
- listQueuesWithAttributes()
- listConsumers()
- listProducers()
- queue operations (pause, resume, purge, ecc.)

## topics.ts
- listTopics()
- getTopicAttributes()
- listSubscribers()
- listProducers()
- sendMessage()
- deleteTopic()
- resetStatistics()

## broker.ts
- aggregate metrics
- trends
- throughput
- storage
- alerts

---

# 4. Queues Architecture

## QueuesView
- Lista code
- Polling 5s
- Navigazione verso QueueDetailsPage

## QueueDetailsPage
Pannelli:

- QueueInfo  
- QueueCharts  
- QueueAlerts  
- QueueThroughput  
- QueueLag  
- QueueStorage  
- QueueDLQ  
- QueueConsumers  
- QueueOperations  
- QueueBrowser  

---

# 5. Topics Architecture

## TopicsView
- Lista topic
- Polling 5s
- Navigazione verso TopicDetailsPage

## TopicDetailsPage
Pannelli:

- TopicInfo  
- TopicCharts  
- TopicAlerts  
- TopicSubscribers  
- TopicProducers  
- TopicOperations  
- TopicSendMessage  
- TopicDelete  

---

# 6. Broker Architecture

## BrokerDashboard
- BrokerTrends  
- BrokerThroughput  
- BrokerStorage  
- BrokerAlerts  
- TopConsumers  
- TopProducers  

## BrokerOverview
- Griglia code con severity  
- Sparklines  
- Filtri  
- Top slow queues  

---

# 7. UI Principles

- Componenti piccoli e riusabili  
- Pannelli con className `"broker-panel"`  
- Grafici Recharts con animazioni smooth  
- Polling leggero (5s)  
- Nessuna dipendenza esterna oltre React + Recharts  

---

# 8. Philosophy

La console segue tre principi:

## 1. Osservabilità
Tutto ciò che è utile per capire lo stato del broker è visibile in un colpo d’occhio.

## 2. Auditability
Ogni pannello è modulare, isolato, leggibile, facilmente estendibile.

## 3. Minimalismo
Zero complessità inutile, zero framework pesanti, zero magia.

---

# 9. Future Extensions

- Sidebar fissa stile Hawtio 1.x  
- Tema dark/light  
- Cluster view (multi‑broker)  
- Health Score globale  
- Export JSON delle metriche  

# ActiveMQ Classic Hawtio Plugin — Architecture Overview

This document provides a high‑level overview of the architecture of the  
**ActiveMQ Classic Hawtio Plugin**, covering both backend and frontend components,  
their integration points, and the communication model with ActiveMQ Classic 6.

---

# 1. Architectural Goals

The plugin is designed to be:

- **Modular** — fully isolated federated module loaded by Hawtio 4  
- **Self‑contained** — no external services or backend logic  
- **Compatible** — works with Jetty 11, Jakarta EE, and ActiveMQ Classic 6  
- **Lightweight** — minimal dependencies, fast startup  
- **Deterministic** — reproducible builds via Yarn Berry and Webpack  
- **Extensible** — clear boundaries for future enhancements  

---

# 2. High‑Level Architecture
```
+---------------------------+ 
| ActiveMQ Classic Broker |
| (JMX + Jolokia) |
+-------------+-------------+ 
^ 
| Jolokia (JSON over HTTP) 
v 
+-------------+-------------+ 
| Hawtio 4 Console |
| (Jetty 11 Webapp) |
+-------------+-------------+ 
^
| Federated Plugin Loader 
v
+---------------------------+
| ActiveMQ Classic Plugin |
| - Java Bootstrap |
| - Plugin Servlet |
| - React Frontend |
| - Module Federation |
+---------------------------+
```

The plugin is packaged as a **single JAR** containing:

- Java bootstrap classes  
- A servlet that serves static assets  
- The compiled React application  
- Module Federation entrypoints  

Hawtio discovers and loads the plugin at runtime.

---

# 3. Backend Architecture (Java)

The backend consists of two classes:

- `ActiveMQClassicPluginBootstrap`
- `ActiveMQClassicPluginServlet`

## 3.1 Plugin Bootstrap

The bootstrap class:

- Loads `plugin.properties`
- Registers the plugin with Hawtio via `HawtioPlugin`
- Registers the servlet that serves the frontend assets

### Responsibilities

| Component | Purpose |
|----------|---------|
| `plugin.id` | Unique plugin identifier |
| `plugin.scope` | Angular/React scope used by Hawtio |
| `plugin.module` | Module Federation exposed module |
| `remoteEntry.js` | Entry file for federated loading |

The plugin is mounted under:

```
/hawtio/plugins/<pluginId>/
```

---

## 3.2 Plugin Servlet

The servlet:

- Handles `GET /plugins/<pluginId>/*`
- Serves static assets from inside the JAR
- Sets appropriate content types
- Defaults to `remoteEntry.js` when no path is provided

### Resource Resolution

Resources are stored in the JAR under:

```
/<pluginId>/
```

The servlet maps:

```
/plugins/<pluginId>/<file>
→
/<pluginId>/<file> inside the JAR
```

### Content Types

- `.js` → `application/javascript`
- `.css` → `text/css`
- `.map` → `application/json`
- `.ttf` → `font/ttf`
- `.txt` → `text/plain`

The servlet contains **no business logic**.  
All broker interaction happens in the frontend.

---

# 4. Frontend Architecture (React + TypeScript)

The frontend is a **React 18** application bundled via **Webpack Module Federation**.

## 4.1 Entry Points

| File | Purpose |
|------|---------|
| `remoteEntry.js` | Module Federation entrypoint |
| `index.js` | Main plugin bundle |
| `ActiveMQClassicPlugin.tsx` | Plugin root component |
| `ActiveMQClassicPreferences.tsx` | Preferences page |

---

## 4.2 Module Federation

The plugin exposes:

```
./ActiveMQClassicPlugin
```

Hawtio loads it dynamically at runtime using:

```ts
plugin.module("./ActiveMQClassicPlugin")
```

This allows:
- Zero coupling with Hawtio build
- Hot‑swappable plugins
- Independent versioning

# 5. Communication Model (Jolokia)

The plugin communicates with ActiveMQ Classic exclusively via Jolokia.

**Operations Used**

| Jolokia Operation	| Purpose |
|-------------------|---------|
| search | Discover MBeans |
| read | Read attributes |
| exec | Invoke broker operations |
| bulkRequest | Efficient multi‑read |

**Broker Discovery**

If no broker name is provided, the plugin resolves it via:
```ts
search org.apache.activemq:type=Broker,brokerName=*
```

# 6. Frontend Service Layer

All broker interaction is encapsulated in:

```
frontend/src/services/activemq/ActiveMQClassicService.ts
```

This service provides:

- Queue operations
- Topic operations
- DLQ inspection
- Message browsing
- Connector and connection inspection
- Consumer and producer inspection
- Broker metrics
- Write operations (purge, move, copy, delete, retry, etc.)

The UI never calls Jolokia directly.

# 7. UI Architecture

The UI is organized into feature‑based folders:

```
components/
  Broker/
  Queues/
  Topics/
  Connectors/
  Common/
hooks/
context/
router/
types/
```

**Key Concepts**

- **Hooks** encapsulate data fetching and polling
- **Context** stores the selected broker
- **Router** defines plugin navigation
- **Components** render dashboards, tables, charts, and modals

# 8. Build & Packaging

The plugin is built using:

- Yarn Berry (deterministic dependencies)
- Webpack 5 (Module Federation)
- Maven (JAR packaging)

The Maven build:

- Copies the compiled frontend into the JAR
- Includes plugin.properties
- Produces a single deployable artifact

# 9. Deployment Model

To deploy:

1. Build the plugin JAR
2. Drop it into:
```
<brokerdir>/webapps/hawtio/WEB-INF/lib/
```
3. Hawtio automatically loads the plugin at startup
4. The plugin becomes available under:
```
/hawtio/plugins/activemq-classic/
```

# 10. Extensibility

The architecture supports:

- Adding new Jolokia operations
- Adding new dashboards or views
- Extending the router
- Adding new hooks
- Adding new metrics or charts
- Supporting additional brokers in the future

# 11. Limitations

- No backend logic beyond serving static assets
- All broker interaction depends on Jolokia availability
- Only one broker is supported at a time (ActiveMQ Classic limitation)

# 12. Summary

The plugin architecture is:

- Clean — strict separation of concerns
- Modern — React + Module Federation
- Compatible — Jetty 11, Jakarta EE, Hawtio 4
- Extensible — easy to evolve
- Self‑contained — deployable as a single JAR

This document provides the foundation for contributors and maintainers to understand and extend the plugin.