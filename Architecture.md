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

