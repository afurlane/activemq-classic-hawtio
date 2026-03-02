import { Message } from '../../src/types/domain'
import { BodyType } from '../../src/types/domain'

export const makeMessage = (partial: Partial<Message> = {}): Message => ({
  id: 'msg-1',
  timestamp: Date.now(),
  priority: 4,
  expiration: 0,
  redelivered: false,

  jms: {},
  properties: {},
  extra: {},

  body: null,
  bodyType: "text" as BodyType,

  ...partial
})
