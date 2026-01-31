export interface QueueInfo {
  name: string;
  mbean: string;
  queueSize: number;
  enqueueCount: number;
  dequeueCount: number;
  consumerCount: number;
  memoryPercentUsage: number;
  averageEnqueueTime: number;
  expiredCount: number;
  inflightCount: number;
  paused: boolean;
  stopped: boolean;
  dlq: boolean;
}


export interface TopicInfo {
  name: string;
  enqueueCount: number;
  dequeueCount: number;
  consumerCount: number;
  producerCount: number;
}

export interface ActiveMQQueueAttributes {
  // Identità
  Name: string
  ObjectName?: string

  // Statistiche principali
  QueueSize: number
  EnqueueCount: number
  DequeueCount: number
  DispatchCount: number
  ExpiredCount?: number
  InflightCount?: number

  // Produttori / Consumatori
  ConsumerCount: number
  ProducerCount: number

  // Memoria
  MemoryLimit: number
  MemoryUsageByteCount: number
  MemoryPercentUsage: number
  MemoryUsagePortion?: number | null // 5.x only

  // Cursor / Store
  CursorFull?: boolean
  CursorMemoryUsage?: number
  CursorPercentUsage?: number
  StoreMessageSize?: number
  MaxPageSize?: number

  // Audit
  MaxAuditDepth?: number
  MaxProducersToAudit?: number
  DuplicateFromStoreCount?: number
  SendDuplicateFromStoreToDLQ?: boolean
  MaxUncommittedExceededCount?: number

  // Tempi di enqueue (5.x only)
  AverageEnqueueTime?: number | null
  MaxEnqueueTime?: number | null
  MinEnqueueTime?: number | null

  // Dimensioni messaggi (5.x only)
  AverageMessageSize?: number | null
  MaxMessageSize?: number | null
  MinMessageSize?: number | null

  // Network stats (5.x only)
  NetworkEnqueues?: number | null
  NetworkDequeues?: number | null

  // Message groups (5.x only)
  MessageGroupType?: string | null
  MessageGroups?: Record<string, any> | null

  // Cache / Priorità (5.x only)
  UseCache?: boolean | null
  CacheEnabled?: boolean | null
  PrioritizedMessages?: boolean | null
  ProducerFlowControl?: boolean | null

  // Stato
  Paused: boolean
  Stopped: boolean
  Dlq: boolean

  // Subscriptions
  Subscriptions: any[]

  // Opzioni varie
  Options?: string

  RedeliveredCount?: number | null
  
  // Fallback
  [key: string]: any
}

export interface ActiveMQTopicAttributes {
  // Identità
  Name: string
  ObjectName?: string

  // Statistiche principali
  EnqueueCount: number
  DequeueCount: number
  DispatchCount: number

  // Produttori / Consumatori
  ConsumerCount: number
  ProducerCount: number

  // Memoria
  MemoryLimit: number
  MemoryUsageByteCount: number
  MemoryPercentUsage: number

  // Tempi di enqueue (5.x only)
  AverageEnqueueTime?: number | null
  MaxEnqueueTime?: number | null
  MinEnqueueTime?: number | null

  // Dimensioni messaggi (5.x only)
  AverageMessageSize?: number | null
  MaxMessageSize?: number | null
  MinMessageSize?: number | null

  // Network stats (5.x only)
  NetworkEnqueues?: number | null
  NetworkDequeues?: number | null

  // Subscriptions
  Subscriptions: any[]

  // Opzioni varie
  Options?: string

  // Fallback
  [key: string]: any
}

export interface ActiveMQConnectorAttributes {
  Started: boolean
  StatisticsEnabled: boolean
  MaxConnectionExceededCount: number

  RebalanceClusterClients?: boolean
  UpdateClusterClientsOnRemove?: boolean
  UpdateClusterFilter?: string | null
  AllowLinkStealingEnabled?: boolean
  UpdateClusterClients?: boolean

  [key: string]: any
}

export interface ActiveMQMessageAttributes {
  // Identità JMS
  JMSMessageID: string
  JMSTimestamp: number
  JMSCorrelationID?: string
  JMSReplyTo?: string
  JMSType?: string

  // Delivery
  JMSPriority: number
  JMSExpiration: number
  JMSRedelivered: boolean
  JMSTimeToLive?: number
  JMSDeliveryMode?: number

  // Proprietà custom
  Properties: Record<string, any>

  // Corpo del messaggio
  Body: string | null

  // AMQ specifici
  BrokerPath?: string[]
  OriginalDestination?: string
  OriginalTransactionId?: string
  GroupID?: string
  GroupSequence?: number
  UserID?: string

  // AMQ6
  RedeliveryCounter?: number
  Size?: number

  // fallback
  [key: string]: any
}

export interface ActiveMQDLQAttributes extends ActiveMQQueueAttributes {
  // DLQ-specific
  SendDuplicateFromStoreToDLQ: boolean
  DuplicateFromStoreCount: number
  MaxProducersToAudit: number
  MaxAuditDepth: number

  // AMQ6: extra
  DeadLetterStrategy?: string

  [key: string]: any
}

export interface ActiveMQSubscriptionAttributes {
  // Identità
  ClientId: string
  ConnectionId: string
  SubscriptionName?: string
  Selector?: string

  // Statistiche
  EnqueueCounter: number
  DequeueCounter: number
  DispatchedCounter: number
  DispatchedQueueSize: number

  // Prefetch & flow control
  PrefetchSize: number
  MaximumPendingMessageLimit: number

  // Stato
  SlowConsumer: boolean
  Active: boolean

  // AMQ6: opzionali
  Retroactive?: boolean
  Exclusive?: boolean
  Priority?: number

  // Fallback
  [key: string]: any
}
