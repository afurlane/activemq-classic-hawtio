import { jolokiaService } from '@hawtio/react'
import { JolokiaRequest, RequestType } from 'jolokia.js'
import { Cache } from '../swrcacheimpl'
import { brokerRegistry, BrokerInfo } from './BrokerRegistry'
import {
  mapQueue,
  mapTopic,
  mapConnector,
  mapMessage,
  mapDLQ,
  mapSubscription,
  Queue,
  Topic,
  Connector,
  Message,
  DLQ,
  Subscription,
} from '../../types/domain'
import {
  ActiveMQQueueAttributes,
  ActiveMQTopicAttributes,
  ActiveMQConnectorAttributes,
  ActiveMQMessageAttributes,
  ActiveMQDLQAttributes,
} from '../../types/activemq'

function normalizeBulk<T>(r: any) {
  if (r.status !== 200 || r.error) {
    return { request: r.request, value: null as T | null }
  }
  return { request: r.request, value: r.value as T }
}

export function getBrokerMBean(brokerName: string) {
  return `org.apache.activemq:type=Broker,brokerName=${brokerName}`
}

export class ActiveMQClassicService {
  private cache = new Cache(10000)

  private async resolveBroker(name?: string): Promise<BrokerInfo | null> {
    if (name) return brokerRegistry.getBroker(name) ?? null
    const brokers = await brokerRegistry.refresh()
    return brokers[0] ?? null
  }

  private base(brokerName: string) {
    return getBrokerMBean(brokerName)
  }

  // ────────────────────────────────────────────────────────────────
  // QUEUES
  // ────────────────────────────────────────────────────────────────

  async listQueues(brokerName?: string): Promise<Queue[]> {
    const broker = await this.resolveBroker(brokerName)
    if (!broker) return []

    return this.cache.getOrRefresh(
      async () => {
        const pattern = `${this.base(broker.name)},destinationType=Queue,destinationName=*`
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
      },
      10000,
      'queues',
      broker.name,
    )
  }

  async getQueue(mbean: string): Promise<Queue | null> {
    return this.cache.getOrRefresh(
      async () => {
        const attrs = await jolokiaService.readAttributes(mbean)
        if (!attrs) return null
        return mapQueue(mbean, attrs as ActiveMQQueueAttributes)
      },
      10000,
      'queue',
      mbean,
    )
  }

  async listQueuesWithRawAttributes(brokerName: string) {
    const broker = await this.resolveBroker(brokerName)
    if (!broker) return []

    return this.cache.getOrRefresh(
      async () => {
        const pattern = `${this.base(broker.name)},destinationType=Queue,destinationName=*`
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
      },
      10000,
      'queues-raw',
      broker.name,
    )
  }

  // ────────────────────────────────────────────────────────────────
  // TOPICS
  // ────────────────────────────────────────────────────────────────

  async listTopics(brokerName?: string): Promise<Topic[]> {
    const broker = await this.resolveBroker(brokerName)
    if (!broker) return []

    return this.cache.getOrRefresh(
      async () => {
        const pattern = `${this.base(broker.name)},destinationType=Topic,destinationName=*`
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
      },
      10000,
      'topics',
      broker.name,
    )
  }

  async getTopicAttributes(mbean: string): Promise<any> {
    return this.cache.getOrRefresh(
      async () => {
        return jolokiaService.readAttributes(mbean)
      },
      10000,
      'topic-attrs',
      mbean,
    )
  }

  // ────────────────────────────────────────────────────────────────
  // CONNECTORS & CONNECTIONS
  // ────────────────────────────────────────────────────────────────

  async listConnectors(brokerName?: string): Promise<Connector[]> {
    const broker = await this.resolveBroker(brokerName)
    if (!broker) return []

    return this.cache.getOrRefresh(
      async () => {
        const pattern = `${this.base(broker.name)},connector=*,connectorName=*`
        const mbeans = await jolokiaService.search(pattern)

        const requests: JolokiaRequest[] = mbeans.map(mbean => ({
          type: 'read' as RequestType,
          mbean,
        } as JolokiaRequest))

        const raw = await jolokiaService.bulkRequest(requests)

        return raw
          .map(normalizeBulk<ActiveMQConnectorAttributes>)
          .filter(r => r.value)
          .map(r => mapConnector(r.request.mbean, r.value!))
      },
      10000,
      'connectors',
      broker.name,
    )
  }

  async listConnections(connectorMBean: string): Promise<any[]> {
    return this.cache.getOrRefresh(
      async () => {
        const attrs = await jolokiaService.readAttributes(connectorMBean) as ActiveMQConnectorAttributes
        return attrs?.Connections ?? []
      },
      10000,
      'connections',
      connectorMBean,
    )
  }

  // ────────────────────────────────────────────────────────────────
  // BROWSE / MESSAGES / DLQ / SUBSCRIPTIONS
  // ────────────────────────────────────────────────────────────────

  async browseQueue(mbean: string, page: number, pageSize: number): Promise<Message[]> {
    return this.cache.getOrRefresh(
      async () => {
        const start = page * pageSize
        const raw = await jolokiaService.execute(
          mbean,
          'browse()',
        ) as ActiveMQMessageAttributes[]

        const slice = raw.slice(start, start + pageSize)
        return slice.map(mapMessage)
      },
      10000,
      'browse-queue',
      mbean,
      page,
      pageSize,
    )
  }

  async browseTopic(mbean: string, page: number, pageSize: number): Promise<Message[]> {
    return this.cache.getOrRefresh(
      async () => {
        const start = page * pageSize
        const raw = await jolokiaService.execute(
          mbean,
          'browse()',
        ) as ActiveMQMessageAttributes[]

        const slice = raw.slice(start, start + pageSize)
        return slice.map(mapMessage)
      },
      10000,
      'browse-topic',
      mbean,
      page,
      pageSize,
    )
  }

  async getDLQInfo(mbean: string): Promise<DLQ> {
    return this.cache.getOrRefresh(
      async () => {
        const attrs = await jolokiaService.readAttributes(mbean) as ActiveMQDLQAttributes
        return mapDLQ(mbean, attrs)
      },
      10000,
      'dlq',
      mbean,
    )
  }

  async listSubscriptions(topicOrQueueMBean: string): Promise<Subscription[]> {
    return this.cache.getOrRefresh(
      async () => {
        const attrs = await jolokiaService.readAttributes(topicOrQueueMBean) as any
        const subs = attrs.Subscriptions ?? []
        return subs.map(mapSubscription)
      },
      10000,
      'subscriptions',
      topicOrQueueMBean,
    )
  }

  // ────────────────────────────────────────────────────────────────
  // CONSUMERS / PRODUCERS
  // ────────────────────────────────────────────────────────────────

  async listConsumers(brokerName: string): Promise<string[]> {
    const broker = await this.resolveBroker(brokerName)
    if (!broker) return []

    return this.cache.getOrRefresh(
      async () => {
        const pattern = `${this.base(broker.name)},destinationType=Queue,destinationName=*,consumerId=*`
        return jolokiaService.search(pattern)
      },
      10000,
      'consumers',
      broker.name,
    )
  }

  async getConsumerAttributes(mbean: string): Promise<any> {
    return this.cache.getOrRefresh(
      async () => {
        return jolokiaService.readAttributes(mbean)
      },
      10000,
      'consumer-attrs',
      mbean,
    )
  }

  async listProducers(brokerName: string): Promise<string[]> {
    const broker = await this.resolveBroker(brokerName)
    if (!broker) return []

    return this.cache.getOrRefresh(
      async () => {
        const pattern = `${this.base(broker.name)},destinationType=Queue,destinationName=*,producerId=*`
        return jolokiaService.search(pattern)
      },
      10000,
      'producers',
      broker.name,
    )
  }

  async getProducerAttributes(mbean: string): Promise<any> {
    return this.cache.getOrRefresh(
      async () => {
        return jolokiaService.readAttributes(mbean)
      },
      10000,
      'producer-attrs',
      mbean,
    )
  }

  // ────────────────────────────────────────────────────────────────
  // WRITE OPS + INVALIDAZIONI GROSSE (cache.clear)
  // ────────────────────────────────────────────────────────────────

  async purgeQueue(mbean: string) {
    const res = await jolokiaService.execute(mbean, 'purge()', [])
    this.cache.clear()
    return res
  }

  async pauseQueue(mbean: string) {
    const res = await jolokiaService.execute(mbean, 'pause()', [])
    this.cache.clear()
    return res
  }

  async resumeQueue(mbean: string) {
    const res = await jolokiaService.execute(mbean, 'resume()', [])
    this.cache.clear()
    return res
  }

  async resetStats(mbean: string) {
    const res = await jolokiaService.execute(mbean, 'resetStatistics()', [])
    this.cache.clear()
    return res
  }

  async deleteQueue(brokerMBean: string, name: string) {
    const res = await jolokiaService.execute(
      brokerMBean,
      'removeQueue(java.lang.String)',
      [name],
    )
    this.cache.clear()
    return res
  }

  async retryMessages(mbean: string) {
    const res = await jolokiaService.execute(mbean, 'retryMessages()', [])
    this.cache.clear()
    return res
  }

  async retryMessage(mbean: string, id: string) {
    const res = await jolokiaService.execute(
      mbean,
      'retryMessage(java.lang.String)',
      [id],
    )
    this.cache.clear()
    return res
  }

  async moveMessageTo(mbean: string, id: string, dest: string) {
    const res = await jolokiaService.execute(
      mbean,
      'moveMessageTo(java.lang.String,java.lang.String)',
      [id, dest],
    )
    this.cache.clear()
    return res
  }

  async copyMessageTo(mbean: string, id: string, dest: string) {
    const res = await jolokiaService.execute(
      mbean,
      'copyMessageTo(java.lang.String,java.lang.String)',
      [id, dest],
    )
    this.cache.clear()
    return res
  }

  async removeMessage(mbean: string, id: string) {
    const res = await jolokiaService.execute(
      mbean,
      'removeMessage(java.lang.String)',
      [id],
    )
    this.cache.clear()
    return res
  }

  async moveMatchingMessages(mbean: string, selector: string, dest: string) {
    const res = await jolokiaService.execute(
      mbean,
      'moveMatchingMessages(java.lang.String,java.lang.String)',
      [selector, dest],
    )
    this.cache.clear()
    return res
  }

  async copyMatchingMessages(mbean: string, selector: string, dest: string) {
    const res = await jolokiaService.execute(
      mbean,
      'copyMatchingMessages(java.lang.String,java.lang.String)',
      [selector, dest],
    )
    this.cache.clear()
    return res
  }

  async removeMatchingMessages(mbean: string, selector: string) {
    const res = await jolokiaService.execute(
      mbean,
      'removeMatchingMessages(java.lang.String)',
      [selector],
    )
    this.cache.clear()
    return res
  }

  async removeAllMessageGroups(mbean: string) {
    const res = await jolokiaService.execute(mbean, 'removeAllMessageGroups()', [])
    this.cache.clear()
    return res
  }

  async removeMessageGroup(mbean: string, group: string) {
    const res = await jolokiaService.execute(
      mbean,
      'removeMessageGroup(java.lang.String)',
      [group],
    )
    this.cache.clear()
    return res
  }

  async sendTextMessage(mbean: string, body: string) {
    const res = await jolokiaService.execute(
      mbean,
      'sendTextMessage(java.lang.String)',
      [body],
    )
    this.cache.clear()
    return res
  }

  async dropConnection(connectorMBean: string, connectionId: string) {
    const res = await jolokiaService.execute(
      connectorMBean,
      'dropConnection(java.lang.String)',
      [connectionId],
    )
    this.cache.clear()
    return res
  }

  async deleteTopic(brokerMBean: string, name: string) {
    const res = await jolokiaService.execute(
      brokerMBean,
      'removeTopic(java.lang.String)',
      [name],
    )
    this.cache.clear()
    return res
  }

  async createTopic(brokerMBean: string, name: string) {
    const res = await jolokiaService.execute(
      brokerMBean,
      'addTopic(java.lang.String)',
      [name],
    )
    this.cache.clear()
    return res
  }
}

export const activemq = new ActiveMQClassicService()
