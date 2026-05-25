import { jolokiaService } from '@hawtio/react'
import { mapMessage, mapSubscription, Subscription } from '../../../types/domain'
import { ActiveMQMessageAttributes } from '../../../types/activemq'

export async function listSubscriptions(topicOrQueueMBean: string): Promise<Subscription[]> {
  const attrs = await jolokiaService.readAttributes(topicOrQueueMBean) as any
  const subs = attrs.Subscriptions ?? []
  return subs.map(mapSubscription)
}

export async function browseSubscription(mbean: string) {
  const raw = await jolokiaService.execute(mbean, 'browse()') as ActiveMQMessageAttributes[]
  return raw.map(mapMessage)
}
