# ActiveMQ Classic Hawtio Plugin

Una console moderna, veloce e modulare per ActiveMQ Classic, costruita come plugin Hawtio 1.x.

![Build](https://github.com/afurlane/activemq-classic-hawtio/actions/workflows/build.yml/badge.svg)
![License](https://img.shields.io/badge/license-Apache%202.0-blue)

## Funzionalità principali

### ✔️ Code
- Lista code
- Dettaglio completo
- Grafici
- Alerts
- Throughput
- Lag
- Storage
- DLQ
- Consumers
- Operations
- Browser messaggi

### ✔️ Topic
- Lista topic
- Dettaglio completo
- Grafici
- Alerts
- Subscribers
- Producers
- Operations
- Send Message
- Delete

### ✔️ Broker
- Dashboard globale
- Trends
- Throughput
- Storage
- Alerts
- Top Producers
- Top Consumers

### ✔️ Router
- Hash-based
- Nessuna dipendenza esterna
- Compatibile con Hawtio 1.x

---

## Installazione

1. Clona il repository
2. Installa le dipendenze:

```sh
npm install
```

3. Build produzione:

```sh
npm run build
```

4. Installa in hawtio e testa

---

## Architettura

Vedi `Architecture.md`.

---

## Licenza

MIT
