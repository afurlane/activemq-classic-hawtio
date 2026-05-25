import { ActiveMQQueueAttributes } from '../activemq'
import { mapSubscription, Subscription } from './subscription'

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
    timestamp: Date.now(),
  }
}
