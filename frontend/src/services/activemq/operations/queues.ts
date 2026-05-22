import { jolokiaService } from '@hawtio/react'
import { JolokiaRequest, RequestType } from 'jolokia.js'
import { mapDLQ, mapMessage, mapQueue, Queue } from '../../../types/domain'
import {
  ActiveMQDLQAttributes,
  ActiveMQMessageAttributes,
  ActiveMQQueueAttributes,
} from '../../../types/activemq'
import { base, getBrokerMBeanFromQueueMBean, normalizeBulk, ResolveBrokerFn } from './common'

export async function listQueues(resolveBroker: ResolveBrokerFn, brokerName?: string): Promise<Queue[]> {
  const broker = await resolveBroker(brokerName)
  if (!broker) return []

  const pattern = `${base(broker.name)},destinationType=Queue,destinationName=*`
  const mbeans = await jolokiaService.search(pattern)

  const requests: JolokiaRequest[] = mbeans.map(mbean => ({
    type: 'read' as RequestType,
    mbean,
  } as JolokiaRequest))

  const raw = await jolokiaService.bulkRequest(requests)

  return raw
    .map(normalizeBulk<ActiveMQQueueAttributes>)
    .filter(r => r.value)
    .map(r => mapQueue(r.request.mbean, r.value!))
}

export async function getQueue(mbean: string): Promise<Queue | null> {
  const attrs = await jolokiaService.readAttributes(mbean)
  if (!attrs) return null
  return mapQueue(mbean, attrs as ActiveMQQueueAttributes)
}

export async function listQueuesWithRawAttributes(resolveBroker: ResolveBrokerFn, brokerName: string) {
  const broker = await resolveBroker(brokerName)
  if (!broker) return []

  const pattern = `${base(broker.name)},destinationType=Queue,destinationName=*`
  const mbeans = await jolokiaService.search(pattern)

  const requests: JolokiaRequest[] = mbeans.map(mbean => ({
    type: 'read' as RequestType,
    mbean,
  } as JolokiaRequest))

  const raw = await jolokiaService.bulkRequest(requests)

  return raw
    .map(normalizeBulk<ActiveMQQueueAttributes>)
    .filter(r => r.value)
    .map(r => ({
      mbean: r.request.mbean,
      attrs: r.value!,
    }))
}

export async function browseQueue(mbean: string) {
  const raw = await jolokiaService.execute(mbean, 'browse()') as ActiveMQMessageAttributes[]
  return raw.map(mapMessage)
}

export async function getDLQInfo(mbean: string) {
  const attrs = await jolokiaService.readAttributes(mbean) as ActiveMQDLQAttributes
  return mapDLQ(mbean, attrs)
}

export async function purgeQueue(mbean: string) {
  return await jolokiaService.execute(mbean, 'purge()', [])
}

export async function pauseQueue(mbean: string) {
  return await jolokiaService.execute(mbean, 'pause()', [])
}

export async function resumeQueue(mbean: string) {
  return await jolokiaService.execute(mbean, 'resume()', [])
}

export async function resetStats(mbean: string) {
  return await jolokiaService.execute(mbean, 'resetStatistics()', [])
}

export async function deleteQueue(queueMBean: string, name: string) {
  const brokerMBean = getBrokerMBeanFromQueueMBean(queueMBean)
  return await jolokiaService.execute(brokerMBean, 'removeQueue(java.lang.String)', [name])
}

export async function retryMessages(mbean: string) {
  return await jolokiaService.execute(mbean, 'retryMessages()', [])
}

export async function retryMessage(mbean: string, id: string) {
  return await jolokiaService.execute(mbean, 'retryMessage(java.lang.String)', [id])
}

export async function moveMessageTo(mbean: string, id: string, dest: string) {
  return await jolokiaService.execute(mbean, 'moveMessageTo(java.lang.String,java.lang.String)', [id, dest])
}

export async function copyMessageTo(mbean: string, id: string, dest: string) {
  return await jolokiaService.execute(mbean, 'copyMessageTo(java.lang.String,java.lang.String)', [id, dest])
}

export async function removeMessage(mbean: string, id: string) {
  return await jolokiaService.execute(mbean, 'removeMessage(java.lang.String)', [id])
}

export async function moveMatchingMessages(mbean: string, selector: string, dest: string) {
  return await jolokiaService.execute(mbean, 'moveMatchingMessages(java.lang.String,java.lang.String)', [selector, dest])
}

export async function copyMatchingMessages(mbean: string, selector: string, dest: string) {
  return await jolokiaService.execute(mbean, 'copyMatchingMessages(java.lang.String,java.lang.String)', [selector, dest])
}

export async function removeMatchingMessages(mbean: string, selector: string) {
  return await jolokiaService.execute(mbean, 'removeMatchingMessages(java.lang.String)', [selector])
}

export async function removeAllMessageGroups(mbean: string) {
  return await jolokiaService.execute(mbean, 'removeAllMessageGroups()', [])
}

export async function removeMessageGroup(mbean: string, group: string) {
  return await jolokiaService.execute(mbean, 'removeMessageGroup(java.lang.String)', [group])
}

export async function sendTextMessage(mbean: string, body: string) {
  return await jolokiaService.execute(mbean, 'sendTextMessage(java.lang.String)', [body])
}

export async function sendTextMessageWithHeaders(
  mbean: string,
  body: string,
  headers: Record<string, string>
) {
  return await jolokiaService.execute(mbean, 'sendTextMessage(java.lang.String,java.util.Map)', [body, headers])
}
