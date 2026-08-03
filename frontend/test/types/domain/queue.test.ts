import { mapQueue } from '../../../src/types/domain/queue'
import { ActiveMQQueueAttributes } from '../../../src/types/activemq'

function makeQueueAttrs(overrides: Partial<ActiveMQQueueAttributes> = {}): ActiveMQQueueAttributes {
  return {
    Name: 'orders',
    QueueSize: 10,
    EnqueueCount: 100,
    DequeueCount: 90,
    DispatchCount: 95,
    ConsumerCount: 2,
    ProducerCount: 1,
    MemoryLimit: 1024,
    MemoryUsageByteCount: 512,
    MemoryPercentUsage: 50,
    Paused: false,
    Stopped: false,
    Dlq: false,
    Subscriptions: [],
    ...overrides,
  }
}

describe('mapQueue message groups', () => {
  test('maps flat message groups object to group list and totals', () => {
    const attrs = makeQueueAttrs({
      MessageGroupType: 'simple',
      MessageGroups: {
        groupA: 'consumer-1',
        groupB: '',
      },
    })

    const queue = mapQueue('org.apache.activemq:type=Broker,brokerName=localhost,destinationType=Queue,destinationName=orders', attrs)

    expect(queue.messageGroups).not.toBeNull()
    expect(queue.messageGroups?.type).toBe('simple')
    expect(queue.messageGroups?.totals.total).toBe(2)
    expect(queue.messageGroups?.totals.assigned).toBe(1)
    expect(queue.messageGroups?.totals.unassigned).toBe(1)
    expect(queue.messageGroups?.groups).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'groupA', consumerId: 'consumer-1', state: 'assigned' }),
        expect.objectContaining({ id: 'groupB', consumerId: null, state: 'unassigned' }),
      ])
    )
  })

  test('supports nested tabular payload shape', () => {
    const attrs = makeQueueAttrs({
      MessageGroupType: 'cached',
      MessageGroups: {
        Entries: [
          { GroupId: 'alpha', ConsumerId: 'consumer-a' },
          { GroupId: 'beta', ConsumerId: null },
        ],
      },
    })

    const queue = mapQueue('org.apache.activemq:type=Broker,brokerName=localhost,destinationType=Queue,destinationName=orders', attrs)

    expect(queue.messageGroups?.totals.total).toBe(2)
    expect(queue.messageGroups?.totals.assigned).toBe(1)
    expect(queue.messageGroups?.totals.unassigned).toBe(1)
  })

  test('returns null when message groups are not exposed by broker', () => {
    const attrs = makeQueueAttrs()

    const queue = mapQueue('org.apache.activemq:type=Broker,brokerName=localhost,destinationType=Queue,destinationName=orders', attrs)

    expect(queue.messageGroups).toBeNull()
  })
})
