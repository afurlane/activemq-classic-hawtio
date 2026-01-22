import {
  ActiveMQQueueAttributes,
  ActiveMQTopicAttributes,
  ActiveMQConnectorAttributes,
  ActiveMQMessageAttributes,
  ActiveMQDLQAttributes,
  ActiveMQSubscriptionAttributes
} from './activemq'


// ────────────────────────────────────────────────────────────────
// QUEUE
// ────────────────────────────────────────────────────────────────

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

export function mapConnector(mbean: string, a: ActiveMQConnectorAttributes): Connector {
  return {
    name: a.Name,
    mbean,

    protocol: a.Protocol,
    active: a.State === 'Started' || a.State === 'Active',
    connectionCount: a.ConnectionCount,

    traffic: {
      inbound: a.InboundTraffic,
      outbound: a.OutboundTraffic,
    },
  }
}

export interface Message {
  id: string
  timestamp: number
  priority: number
  expiration: number
  redelivered: boolean

  properties: Record<string, any>
  body: string | null

  metadata: {
    type?: string
    replyTo?: string
    correlationId?: string
    groupId?: string
    groupSequence?: number
    userId?: string
    size?: number
    redeliveryCounter?: number
  }
}

export function mapMessage(a: ActiveMQMessageAttributes): Message {
  return {
    id: a.JMSMessageID,
    timestamp: a.JMSTimestamp,
    priority: a.JMSPriority,
    expiration: a.JMSExpiration,
    redelivered: a.JMSRedelivered,

    properties: a.Properties ?? {},
    body: a.Body ?? null,

    metadata: {
      type: a.JMSType,
      replyTo: a.JMSReplyTo,
      correlationId: a.JMSCorrelationID,
      groupId: a.GroupID,
      groupSequence: a.GroupSequence,
      userId: a.UserID,
      size: a.Size,
      redeliveryCounter: a.RedeliveryCounter,
    },
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
