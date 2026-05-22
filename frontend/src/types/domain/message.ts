import { ActiveMQMessageAttributes } from '../activemq'

export type BodyType = 'text' | 'bytes' | 'map' | 'object' | 'stream' | 'none'

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
    timestamp: typeof a.JMSTimestamp === 'number' ? a.JMSTimestamp : new Date(a.JMSTimestamp).getTime(),

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
    },
  }
}

function decodeBody(a: ActiveMQMessageAttributes): { body: string | null; bodyType: BodyType } {
  if (typeof a.Text === 'string') {
    return { body: a.Text, bodyType: 'text' }
  }

  if (a.BodyBuffer) {
    return { body: a.BodyBuffer, bodyType: 'bytes' }
  }

  if (a.Body) {
    return { body: a.Body, bodyType: 'bytes' }
  }

  if (a.ContentMap) {
    try {
      return { body: JSON.stringify(a.ContentMap, null, 2), bodyType: 'map' }
    } catch {
      return { body: '<error serializing map message>', bodyType: 'map' }
    }
  }

  if (a.Object) {
    return { body: null, bodyType: 'object' }
  }

  if (a.Stream) {
    return { body: JSON.stringify(a.Stream, null, 2), bodyType: 'stream' }
  }

  return { body: null, bodyType: 'none' }
}

function parsePropertiesText(text?: string): Record<string, string> {
  if (!text) return {}

  const trimmed = text.trim()
  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) return {}

  const inner = trimmed.slice(1, -1)
  const result: Record<string, string> = {}

  inner.split(',').forEach(pair => {
    const [key, value] = pair.split('=')
    if (key && value) {
      result[key.trim()] = value.trim()
    }
  })

  return result
}
