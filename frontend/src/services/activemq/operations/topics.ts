import { jolokiaService } from '@hawtio/react'
import { JolokiaRequest, RequestType } from 'jolokia.js'
import { mapMessage, mapTopic, Topic } from '../../../types/domain'
import { ActiveMQMessageAttributes, ActiveMQTopicAttributes } from '../../../types/activemq'
import { base, normalizeBulk, ResolveBrokerFn } from './common'

export async function listTopics(resolveBroker: ResolveBrokerFn, brokerName?: string): Promise<Topic[]> {
  const broker = await resolveBroker(brokerName)
  if (!broker) return []

  const pattern = `${base(broker.name)},destinationType=Topic,destinationName=*`
  const mbeans = await jolokiaService.search(pattern)

  const requests: JolokiaRequest[] = mbeans.map(mbean => ({
    type: 'read' as RequestType,
    mbean,
  } as JolokiaRequest))

  const raw = await jolokiaService.bulkRequest(requests)

  return raw
    .map(normalizeBulk<ActiveMQTopicAttributes>)
    .filter(r => r.value)
    .map(r => mapTopic(r.request.mbean, r.value!))
}

export async function getTopicAttributes(mbean: string): Promise<any> {
  return jolokiaService.readAttributes(mbean)
}

export async function browseTopic(mbean: string) {
  const raw = await jolokiaService.execute(mbean, 'browse()') as ActiveMQMessageAttributes[]
  return raw.map(mapMessage)
}

export async function deleteTopic(brokerMBean: string, name: string) {
  return await jolokiaService.execute(brokerMBean, 'removeTopic(java.lang.String)', [name])
}

export async function createTopic(brokerMBean: string, name: string) {
  return await jolokiaService.execute(brokerMBean, 'addTopic(java.lang.String)', [name])
}
