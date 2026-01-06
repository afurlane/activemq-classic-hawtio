# API — JMX Services

Questa console usa Jolokia per interrogare ActiveMQ Classic via JMX.

---

# 1. Queue API

## listQueues()
Restituisce la lista delle code.

## listQueuesWithAttributes()
Restituisce code + attributi JMX.

## queue operations
- pause()
- resume()
- purge()
- resetStatistics()
- browse()
- browseMessages()

---

# 2. Topic API

## listTopics()
Restituisce la lista dei topic.

## getTopicAttributes(mbean)
Restituisce gli attributi JMX del topic.

## listSubscribers(topicName)
Restituisce i subscriber del topic.

## listProducers(topicName)
Restituisce i producer del topic.

## sendMessage(mbean, body, headers)
Invia un TextMessage.

## deleteTopic(mbean)
Elimina il topic.

---

# 3. Broker API

## aggregate metrics
- total queue size
- total inflight
- total lag

## throughput
- enqueue/sec
- dequeue/sec
- dispatch/sec

## storage
- store size
- temp usage
- cursor usage

## alerts
- memory > 80%
- lag > threshold
- no consumers
- blocked producers

