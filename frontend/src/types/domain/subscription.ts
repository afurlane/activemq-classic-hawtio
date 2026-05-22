import { ActiveMQSubscriptionAttributes } from '../activemq'

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
