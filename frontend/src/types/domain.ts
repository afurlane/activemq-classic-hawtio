import {
  ActiveMQQueueAttributes,
  ActiveMQTopicAttributes,
  ActiveMQMessageAttributes,
  ActiveMQDLQAttributes,
  ActiveMQSubscriptionAttributes
} from './activemq'

export type BodyType = "text" | "bytes" | "map" | "object" | "stream" | "none"

export interface Queue {
  mbean: string
  name: string

  size: number
  consumers: number
  producers: number

  stats: {
    enqueue: number
    dequeue: number
    inflight: number
    expired: number
    redelivered: number
    dispatch: number
  }

  memory: {
    limit: number
    usageBytes: number
    percent: number
  }

  state: {
    paused: boolean
    stopped: boolean
    dlq: boolean
  }

  subscriptions?: Subscription[]

  /** ⬅️ AGGIUNGERE QUESTO */
  timestamp: number
}

export function mapQueue(mbean: string, a: ActiveMQQueueAttributes): Queue {
  return {
    mbean,
    name: a.Name,
    size: a.QueueSize,
    consumers: a.ConsumerCount,
    producers: a.ProducerCount,

    stats: {
      enqueue: a.EnqueueCount,
      dequeue: a.DequeueCount,
      inflight: a.InflightCount ?? 0,
      expired: a.ExpiredCount ?? 0,
      redelivered: a.RedeliveredCount ?? 0,
      dispatch: a.DispatchCount ?? 0,
    },

    memory: {
      limit: a.MemoryLimit,
      usageBytes: a.MemoryUsageByteCount,
      percent: a.MemoryPercentUsage,
    },

    state: {
      paused: a.Paused,
      stopped: a.Stopped,
      dlq: a.Dlq,
    },

    subscriptions: a.Subscriptions?.map(mapSubscription),

    /** ⬅️ TIMESTAMP AGGIUNTO QUI */
    timestamp: Date.now(),
  }
}

// ────────────────────────────────────────────────────────────────
// TOPIC
// ────────────────────────────────────────────────────────────────

export interface Topic {
  name: string
  mbean: string

  producers: number
  consumers: number

  stats: {
    enqueue: number
    dequeue: number
    dispatch: number
    producers: number
    consumers: number
    size: number
    expired: number
    forward: number
    duplicateFromStore: number
    inflight: number
    memoryPercentUsage: number

  }
}

export function mapTopic(mbean: string, a: ActiveMQTopicAttributes): Topic {
  return {
    name: a.Name,
    mbean,

    producers: a.ProducerCount,
    consumers: a.ConsumerCount,

    stats: {
      enqueue: a.EnqueueCount,
      dequeue: a.DequeueCount,
      dispatch: a.DispatchCount,
      producers: a.ProducerCount,
      consumers: a.ConsumerCount,
      size: a.QueueSize ?? 0,
      expired: a.ExpiredCount ?? 0,
      forward: a.ForwardCount ?? 0,
      duplicateFromStore: a.DuplicateFromStoreCount ?? 0,
      inflight: a.InflightCount ?? 0,
      memoryPercentUsage: a.MemoryPercentUsage ?? 0,
    },
  }
}

// ────────────────────────────────────────────────────────────────
// CONNECTOR
// ────────────────────────────────────────────────────────────────

export interface Connector {
  name: string
  mbean: string

  protocol: string
  active: boolean
  connectionCount: number

  traffic: {
    inbound: number
    outbound: number
  }
}

export function mapConnector(mbean: string, a: any): Connector {
  // Estrai i parametri dal nome dell’MBean
  const parts = mbean.split(',')

  const connectorPart = parts.find(p => p.startsWith('connector='))
  const connectorNamePart = parts.find(p => p.startsWith('connectorName='))

  const name = connectorPart?.split('=')[1] ?? 'unknown'
  const protocol = connectorNamePart?.split('=')[1] ?? 'unknown'

  return {
    name,
    mbean,

    protocol,
    active: !!a.Started,

    // ActiveMQ 5 non espone ConnectionCount per connector
    connectionCount:
      typeof a.MaxConnectionExceededCount === 'number' && a.MaxConnectionExceededCount >= 0
        ? a.MaxConnectionExceededCount
        : 0,

    traffic: {
      inbound: 0,
      outbound: 0,
    },
  }
}

export interface Message {
  id: string
  timestamp: number
  priority: number
  expiration: number
  redelivered: boolean

  jms: {
    destination?: string
    deliveryMode?: string | number
    type?: string
    replyTo?: string
    correlationId?: string
    groupId?: string
    groupSequence?: number
    userId?: string
  }

  properties: Record<string, any>

  body: string | null
  bodyType: BodyType

  extra: {
    brokerPath?: string[]
    originalDestination?: string
    size?: number
    redeliveryCounter?: number
  }
}

export function mapMessage(a: ActiveMQMessageAttributes): Message {
  return {
    id: a.JMSMessageID,
    timestamp: typeof a.JMSTimestamp === "number"
      ? a.JMSTimestamp
      : new Date(a.JMSTimestamp).getTime(),

    priority: a.JMSPriority,
    expiration: a.JMSExpiration,
    redelivered: a.JMSRedelivered,

    jms: {
      destination: a.JMSDestination,
      deliveryMode: a.JMSDeliveryMode,
      type: a.JMSType,
      replyTo: a.JMSReplyTo,
      correlationId: a.JMSCorrelationID,
      groupId: a.JMSXGroupID ?? a.GroupID,
      groupSequence: a.JMSXGroupSeq ?? a.GroupSequence,
      userId: a.JMSXUserID ?? a.UserID,
    },

    properties: {
      ...a.BooleanProperties,
      ...a.ByteProperties,
      ...a.DoubleProperties,
      ...a.FloatProperties,
      ...a.IntProperties,
      ...a.LongProperties,
      ...a.ShortProperties,
      ...a.StringProperties,
      ...parsePropertiesText(a.PropertiesText),
    },

    ...decodeBody(a),

    extra: {
      brokerPath: a.BrokerPath,
      originalDestination: a.OriginalDestination,
      size: a.Size,
      redeliveryCounter: a.RedeliveryCounter,
    }
  }
}

export interface DLQ extends Queue {
  audit: {
    duplicateFromStore: number
    sendDuplicateToDLQ: boolean
    maxProducersToAudit: number
    maxAuditDepth: number
  }
}

export function mapDLQ(mbean: string, a: ActiveMQDLQAttributes): DLQ {
  const base = mapQueue(mbean, a)

  return {
    ...base,
    audit: {
      duplicateFromStore: a.DuplicateFromStoreCount,
      sendDuplicateToDLQ: a.SendDuplicateFromStoreToDLQ,
      maxProducersToAudit: a.MaxProducersToAudit,
      maxAuditDepth: a.MaxAuditDepth,
    },
  }
}

export interface Subscription {
  clientId: string
  connectionId: string
  name?: string
  selector?: string

  stats: {
    enqueue: number
    dequeue: number
    dispatched: number
    dispatchedQueueSize: number
  }

  flow: {
    prefetchSize: number
    maxPending: number
  }

  state: {
    slow: boolean
    active: boolean
  }

  metadata: {
    retroactive?: boolean
    exclusive?: boolean
    priority?: number
  }
}

export function mapSubscription(a: ActiveMQSubscriptionAttributes): Subscription {
  return {
    clientId: a.ClientId,
    connectionId: a.ConnectionId,
    name: a.SubscriptionName,
    selector: a.Selector,

    stats: {
      enqueue: a.EnqueueCounter,
      dequeue: a.DequeueCounter,
      dispatched: a.DispatchedCounter,
      dispatchedQueueSize: a.DispatchedQueueSize,
    },

    flow: {
      prefetchSize: a.PrefetchSize,
      maxPending: a.MaximumPendingMessageLimit,
    },

    state: {
      slow: a.SlowConsumer,
      active: a.Active,
    },

    metadata: {
      retroactive: a.Retroactive,
      exclusive: a.Exclusive,
      priority: a.Priority,
    },
  }
}

function decodeBody(a: ActiveMQMessageAttributes): {body: string | null, bodyType: BodyType} {
  if (typeof a.Text === "string") {
    return { body: a.Text, bodyType: "text" }
  }

  if (a.BodyBuffer) {
    return { body: a.BodyBuffer, bodyType: "bytes" }
  }

  if (a.Body) {
    return { body: a.Body, bodyType: "bytes" }
  }

  if (a.ContentMap) {
    try {
      return { body: JSON.stringify(a.ContentMap, null, 2), bodyType: "map" }
    } catch {
      return { body: "<error serializing map message>", bodyType: "map" }
    }
  }

  if (a.Object) {
    return { body: null, bodyType: "object" }
  }

  if (a.Stream) {
    return { body: JSON.stringify(a.Stream, null, 2), bodyType: "stream" }
  }

  return { body: null, bodyType: "none" }
}

function parsePropertiesText(text?: string): Record<string, string> {
  if (!text) return {}

  const trimmed = text.trim()
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return {}

  const inner = trimmed.slice(1, -1) // remove { }
  const result: Record<string, string> = {}

  inner.split(",").forEach(pair => {
    const [key, value] = pair.split("=")
    if (key && value) {
      result[key.trim()] = value.trim()
    }
  })

  return result
}
