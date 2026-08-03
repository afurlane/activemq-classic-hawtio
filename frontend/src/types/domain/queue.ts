import { ActiveMQQueueAttributes } from '../activemq'
import { QueueMessageGroup, QueueMessageGroupsInfo } from './messageGroup'
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
  messageGroups?: QueueMessageGroupsInfo | null

  timestamp: number
}

function toStringOrNull(value: unknown): string | null {
  if (value === null || value === undefined) return null

  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (typeof value === 'object') {
    return stringifyObjectValue(value as Record<string, unknown>)
  }

  return null
}

function stringifyObjectValue(value: Record<string, unknown>): string | null {
  const knownKeys = ['consumerId', 'ConsumerId', 'clientId', 'ClientId', 'connectionId', 'ConnectionId', 'value']
  const nestedValue = readFirstKnownKey(value, knownKeys)
  if (nestedValue) return nestedValue

  try {
    return JSON.stringify(value)
  } catch {
    return null
  }
}

function readFirstKnownKey(
  value: Record<string, unknown>,
  keys: string[]
): string | null {
  for (const key of keys) {
    if (!(key in value)) continue

    const nested = toStringOrNull(value[key])
    if (nested) return nested
  }

  return null
}

function flattenEntries(raw: unknown): Array<[string, string | null]> {
  if (!raw) return []

  if (Array.isArray(raw)) {
    return raw.flatMap(item => flattenEntries(item))
  }

  if (typeof raw !== 'object') return []

  const value = raw as Record<string, unknown>
  const nestedEntries = flattenNestedEntries(value)
  if (nestedEntries.length > 0) return nestedEntries

  const rowEntry = mapRowEntry(value)
  if (rowEntry) return [rowEntry]

  return mapPrimitiveEntries(value)
}

function flattenNestedEntries(value: Record<string, unknown>): Array<[string, string | null]> {
  const nestedKeys = ['entries', 'Entries', 'map', 'Map', 'value', 'Value', 'Contents', 'content']

  for (const key of nestedKeys) {
    if (!(key in value)) continue

    const nested = flattenEntries(value[key])
    if (nested.length > 0) return nested
  }

  return []
}

function mapRowEntry(value: Record<string, unknown>): [string, string | null] | null {
  const rowKey = readFirstKnownKey(value, GROUP_ID_CANDIDATE_KEYS)
  if (!rowKey) return null

  const rowValue = readFirstKnownKey(value, GROUP_CONSUMER_CANDIDATE_KEYS)
  return [rowKey, rowValue]
}

function mapPrimitiveEntries(value: Record<string, unknown>): Array<[string, string | null]> {
  const primitiveEntries = Object.entries(value).filter(([, v]) => {
    const type = typeof v
    return v === null || type === 'string' || type === 'number' || type === 'boolean'
  })

  return primitiveEntries
    .map(([k, v]) => [k, toStringOrNull(v)] as [string, string | null])
    .filter(([k]) => k.length > 0)
}

  const GROUP_ID_CANDIDATE_KEYS = ['groupId', 'GroupId', 'group', 'Group', 'key', 'Key', 'name', 'Name']
  const GROUP_CONSUMER_CANDIDATE_KEYS = ['consumerId', 'ConsumerId', 'consumer', 'Consumer', 'value', 'Value']

function mapMessageGroups(a: ActiveMQQueueAttributes): QueueMessageGroupsInfo | null {
  const hasGroupData = a.MessageGroups !== undefined && a.MessageGroups !== null
  const hasGroupType = a.MessageGroupType !== undefined && a.MessageGroupType !== null

  if (!hasGroupData && !hasGroupType) {
    return null
  }

  const rawEntries = flattenEntries(a.MessageGroups)

  const groups: QueueMessageGroup[] = rawEntries.map(([id, consumerId]) => {
    const normalizedConsumer = toStringOrNull(consumerId)

    return {
      id,
      consumerId: normalizedConsumer,
      state: normalizedConsumer ? 'assigned' : 'unassigned',
    }
  })

  const assigned = groups.filter(g => g.state === 'assigned').length

  return {
    supported: true,
    type: toStringOrNull(a.MessageGroupType),
    groups,
    totals: {
      total: groups.length,
      assigned,
      unassigned: groups.length - assigned,
    },
  }
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
    messageGroups: mapMessageGroups(a),
    timestamp: Date.now(),
  }
}
