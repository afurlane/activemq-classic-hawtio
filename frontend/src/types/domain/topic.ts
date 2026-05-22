import { ActiveMQTopicAttributes } from '../activemq'

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
