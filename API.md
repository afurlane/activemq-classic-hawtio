# ActiveMQ Classic Hawtio Plugin — API Documentation

This document describes the **public API surface** of the ActiveMQ Classic Hawtio Plugin.  
It includes:

- The **Servlet API** exposed by the plugin JAR  
- The **Frontend Service API** used to communicate with ActiveMQ via Jolokia  
- The **data types** exchanged between UI and backend  
- The **Jolokia operations** invoked by the plugin  

This document does **not** re‑document ActiveMQ or Jolokia.  
Only the API surface used by this plugin is included.

---

# 1. Overview

The plugin exposes:

### ✔️ A Servlet that serves the federated module assets  
Mounted at:

```http
/hawtio/plugins/<pluginId>/*
```

### ✔️ A Frontend Service (`ActiveMQClassicService`)  
This service communicates with ActiveMQ Classic via **Jolokia** using:

- `search`
- `read`
- `exec`
- `bulkRequest`

### ✔️ A set of TypeScript types  
Queues, Topics, Messages, DLQ, Connectors, Subscriptions, etc.

---

# 2. Plugin Servlet API (Backend)

The backend exposes **static assets** for Hawtio’s Module Federation loader.

## 2.1 Base Path

```
/plugins/<pluginId>/
```

Where `<pluginId>` is defined in:

src/main/resources/plugin.properties

Example:

```properties
plugin.id=activemq-classic
plugin.scope=activemqClassic
plugin.module=ActiveMQClassicPlugin
```

---

## 2.2 Exposed Resources

The servlet serves the following files from inside the JAR:

| Path | Description |
|------|-------------|
| `/remoteEntry.js` | Module Federation entrypoint |
| `/index.js` | Main plugin bundle |
| `/style.css` | Stylesheet |
| `/help.md` | In‑app help |
| `/*.map` | Source maps |
| `/*.ttf` | Fonts |

All files are served from:

```
/<pluginId>/<resource>
```

inside the JAR.

---

## 2.3 Servlet Behavior

### GET `/plugins/<pluginId>/*`

- Resolves the requested path  
- Defaults to `/remoteEntry.js`  
- Streams the resource from the JAR  
- Sets appropriate `Content-Type`  
- Returns `404` if the resource does not exist  

### Example

```
GET /hawtio/plugins/activemq-classic/remoteEntry.js
```

---

# 3. Frontend API — ActiveMQClassicService

The frontend communicates with ActiveMQ Classic exclusively via **Jolokia**.

Base MBean pattern:

```java
org.apache.activemq:type=Broker,brokerName=<broker>
```

The service automatically resolves the broker name if not provided.

---

# 3.1 Broker Resolution

```ts
resolveBroker(name?: string): Promise<BrokerInfo | null>
```

If a name is provided → uses it

Otherwise → discovers the broker via:

```ts
search org.apache.activemq:type=Broker,brokerName=*
```

# 3.2 Queues API

```ts
listQueues(brokerName?)
```

Returns all queues with attributes.
```ts
getQueue(mbean)
```

Returns a single queue.
```ts
listQueuesWithRawAttributes(brokerName)
```

Returns raw Jolokia attributes for debugging.
```ts
browseQueue(mbean, page, pageSize)
```

Reads messages using:

```ts
exec <mbean> browse()
```

Queue Write Operations

| Method | Jolokia Operation |
|--------|-------------------|
| purgeQueue | purge() |
| pauseQueue | pause() |
| resumeQueue | resume() |
| resetStats | resetStatistics() |
| deleteQueue | removeQueue(String) |
| retryMessages | retryMessages() |
| retryMessage | retryMessage(String) |
| moveMessageTo | moveMessageTo(String,String) |
| copyMessageTo | copyMessageTo(String,String) |
| removeMessage | removeMessage(String) |
| moveMatchingMessages | moveMatchingMessages(String,String) |
| copyMatchingMessages | copyMatchingMessages(String,String) |
| removeMatchingMessages | removeMatchingMessages(String) |
| removeAllMessageGroups | removeAllMessageGroups() |
| removeMessageGroup | removeMessageGroup(String) |
| sendTextMessage | sendTextMessage(String) |

# 3.3 Topics API
listTopics(brokerName?)

Returns all topics.
getTopicAttributes(mbean)

Reads topic attributes.
browseTopic(mbean, page, pageSize)

Uses:

```
exec <mbean> browse()
```

**Topic Write Operations**

| Method | Jolokia Operation |
|--------|-------------------|
| deleteTopic | removeTopic(String) |
| createTopic | addTopic(String) |

# 3.4 Connectors & Connections

```ts
listConnectors(brokerName?)
```

Searches:

```ts
connector=*,connectorName=*
```

Searches:

```ts
connector=*,connectorName=*
```

```ts
listConnections(connectorMBean)
```

Reads connector attributes and returns:

```ts
Connections[]
```

```ts
dropConnection(connectorMBean, connectionId)
```

Executes:

```ts
dropConnection(String)
```

# 3.5 DLQ API

```ts
getDLQInfo(mbean)
```

Reads DLQ attributes and maps them.

# 3.6 Subscriptions

```ts
listSubscriptions(mbean)
```

Reads:

```ts
Subscriptions[]
```

```ts
browseSubscription(mbean)
```

# 3.7 Consumers & Producers

```ts
listConsumers(brokerName)
```

Searches:

```ts
Codice
```

```ts
destinationType=Queue,destinationName=*,consumerId=*
```

```ts
getConsumerAttributes(mbean)
```

Reads consumer attributes.

```ts
listProducers(brokerName)
```

Searches:

```ts
Codice
```

```ts
destinationType=Queue,destinationName=*,producerId=*
```

```ts
getProducerAttributes(mbean)
```

Reads producer attributes.

# 4. Data Types

The plugin defines TypeScript types for:

- Queue
- Topic
- Message
- DLQ
- Subscription
- Connector
- BrokerInfo
- ActiveMQQueueAttributes
- ActiveMQTopicAttributes
- ActiveMQConnectorAttributes
- ActiveMQMessageAttributes

These types are located under:

frontend/src/types/

# 5. Jolokia Usage Summary

The plugin uses the following Jolokia operations:

|Operation | Purpose |
|----------|---------|
|search | Discover MBeans |
|read / readAttributes |Read attributes |
|exec | Invoke broker operations |
|bulkRequest | Efficient multi‑read |

# 6. Compatibility

|Component | Version |
|----------|---------|
|ActiveMQ Classic | 6.x |
|Hawtio | 4.x |
|Jetty | 11 |
|Jakarta EE | 10 |
|React | 18.x |

# 7. Notes

The plugin does not expose any REST API of its own

All backend communication is done via Jolokia

The servlet only serves static assets