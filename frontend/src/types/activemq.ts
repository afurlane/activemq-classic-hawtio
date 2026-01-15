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
  Name: string;
  QueueSize: number;
  EnqueueCount: number;
  DequeueCount: number;
  DispatchCount: number;
  ConsumerCount: number;
  ProducerCount: number;

  MemoryLimit: number;
  MemoryUsageByteCount: number;
  MemoryPercentUsage: number;
  MemoryUsagePortion: number;

  TempUsageLimit: number;
  TempUsagePercentUsage: number;

  CursorFull: boolean;
  CursorMemoryUsage: number;
  CursorPercentUsage: number;
  StoreMessageSize: number;
  MaxPageSize: number;

  MaxAuditDepth: number;
  MaxProducersToAudit: number;
  DuplicateFromStoreCount: number;
  SendDuplicateFromStoreToDLQ: boolean;
  MaxUncommittedExceededCount: number;

  AverageMessageSize: number;
  MaxMessageSize: number;
  MinMessageSize: number;

  AverageEnqueueTime: number;
  MaxEnqueueTime: number;
  MinEnqueueTime: number;

  Dlq: boolean;
  Options: string;

  NetworkEnqueues: number;
  NetworkDequeues: number;

  MessageGroupType: string;
  MessageGroups: Record<string, any>;

  UseCache: boolean;
  CacheEnabled: boolean;
  PrioritizedMessages: boolean;
  ProducerFlowControl: boolean;

  SlowConsumerStrategy: string | null;
  Subscriptions: any[];

  Paused: boolean;
  Stopped: boolean;

  // fallback per eventuali attributi non mappati
  [key: string]: any;
}

