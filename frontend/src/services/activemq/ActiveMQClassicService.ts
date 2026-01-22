import { jolokiaService } from '@hawtio/react'
import { JolokiaRequest } from 'jolokia.js'
import { RequestType } from 'jolokia.js'
import { Cache } from '../cache'
import { brokerRegistry } from './BrokerRegistry'
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
    return { request: r.request, value: null }
  }
  return { request: r.request, value: r.value as T }
}

export function getBrokerMBean(brokerName: string) {
   return `org.apache.activemq:type=Broker,brokerName=${brokerName}` 
}

export class ActiveMQClassicService {
  private cache = new Cache(3000)

  private async resolveBroker(name?: string) {
    if (name) return brokerRegistry.getBroker(name)
    const brokers = await brokerRegistry.refresh()
    return brokers[0]
  }

  private base(brokerName: string) {
    return getBrokerMBean(brokerName);
  }

  // ────────────────────────────────────────────────────────────────
  // QUEUES
  // ────────────────────────────────────────────────────────────────

  async listQueues(brokerName?: string): Promise<Queue[]> {
    const broker = await this.resolveBroker(brokerName)
    if (!broker) return []

    const cacheKey = ['queues', broker.name]
    const cached = this.cache.get<Queue[]>(...cacheKey)
    if (cached) return cached

    const pattern = `${this.base(broker.name)},destinationType=Queue,destinationName=*`
    const mbeans = await jolokiaService.search(pattern)

    const requests: JolokiaRequest[] = mbeans.map(mbean => ({
      type: 'read' as RequestType,
      mbean,
    } as JolokiaRequest))

    const raw = await jolokiaService.bulkRequest(requests)

    const queues = raw
      .map(normalizeBulk<ActiveMQQueueAttributes>)
      .filter(r => r.value)
      .map(r => mapQueue(r.request.mbean, r.value!))

    this.cache.set(queues, 3000, ...cacheKey)
    return queues
  }

  // ────────────────────────────────────────────────────────────────
  // TOPICS
  // ────────────────────────────────────────────────────────────────

  async listTopics(brokerName?: string): Promise<Topic[]> {
    const broker = await this.resolveBroker(brokerName)
    if (!broker) return []

    const cacheKey = ['topics', broker.name]
    const cached = this.cache.get<Topic[]>(...cacheKey)
    if (cached) return cached

    const pattern = `${this.base(broker.name)},destinationType=Topic,destinationName=*`
    const mbeans = await jolokiaService.search(pattern)

    const requests: JolokiaRequest[] = mbeans.map(mbean => ({
      type: 'read' as RequestType,
      mbean,
    } as JolokiaRequest))

    const raw = await jolokiaService.bulkRequest(requests)

    const topics = raw
      .map(normalizeBulk<ActiveMQTopicAttributes>)
      .filter(r => r.value)
      .map(r => mapTopic(r.request.mbean, r.value!))

    this.cache.set(topics, 3000, ...cacheKey)
    return topics
  }

  // ────────────────────────────────────────────────────────────────
  // CONNECTORS
  // ────────────────────────────────────────────────────────────────

  async listConnectors(brokerName?: string): Promise<Connector[]> {
    const broker = await this.resolveBroker(brokerName)
    if (!broker) return []

    const cacheKey = ['connectors', broker.name]
    const cached = this.cache.get<Connector[]>(...cacheKey)
    if (cached) return cached

    const pattern = `${this.base(broker.name)},connector=*,connectorName=*`
    const mbeans = await jolokiaService.search(pattern)

    const requests: JolokiaRequest[] = mbeans.map(mbean => ({
      type: 'read' as RequestType,
      mbean,
    } as JolokiaRequest))

    const raw = await jolokiaService.bulkRequest(requests)

    const connectors = raw
      .map(normalizeBulk<ActiveMQConnectorAttributes>)
      .filter(r => r.value)
      .map(r => mapConnector(r.request.mbean, r.value!))

    this.cache.set(connectors, 3000, ...cacheKey)
    return connectors
  }

  // ────────────────────────────────────────────────────────────────
  // MESSAGES / DLQ / SUBSCRIPTIONS
  // ────────────────────────────────────────────────────────────────

  async browseQueue(mbean: string, page: number, pageSize: number): Promise<Message[]> {
    const start = page * pageSize

    const raw = await jolokiaService.execute(
      mbean,
      'browse(int)',
      [start + pageSize]
    ) as ActiveMQMessageAttributes[]

    const slice = raw.slice(start, start + pageSize)
    return slice.map(mapMessage)
  }

  async getDLQInfo(mbean: string): Promise<DLQ> {
    const attrs = await jolokiaService.readAttributes(mbean) as ActiveMQDLQAttributes
    return mapDLQ(mbean, attrs)
  }

  async listSubscriptions(topicOrQueueMBean: string): Promise<Subscription[]> {
    const attrs = await jolokiaService.readAttributes(topicOrQueueMBean) as any
    const subs = attrs.Subscriptions ?? []
    return subs.map(mapSubscription)
  }

  async getQueue(mbean: string): Promise<Queue | null> {
    const attrs = await jolokiaService.readAttributes(mbean)
    if (!attrs) return null
    return mapQueue(mbean, attrs as ActiveMQQueueAttributes)
  }

    // Purge all messages
  async purgeQueue(mbean: string) {
    return jolokiaService.execute(mbean, "purge()", []);
  }

  // Pause / Resume
  async pauseQueue(mbean: string) {
    return jolokiaService.execute(mbean, "pause()", []);
  }

  async resumeQueue(mbean: string) {
    return jolokiaService.execute(mbean, "resume()", []);
  }

  // Reset statistics
  async resetStats(mbean: string) {
    return jolokiaService.execute(mbean, "resetStatistics()", []);
  }

  // Delete queue (broker-level op)
  async deleteQueue(brokerMBean: string, name: string) {
    return jolokiaService.execute(
      brokerMBean,
      "removeQueue(java.lang.String)",
      [name]
    );
  }

  // DLQ operations
  async retryMessages(mbean: string) {
    return jolokiaService.execute(mbean, "retryMessages()", []);
  }

  async retryMessage(mbean: string, id: string) {
    return jolokiaService.execute(
      mbean,
      "retryMessage(java.lang.String)",
      [id]
    );
  }

  // Single message ops
  async moveMessageTo(mbean: string, id: string, dest: string) {
    return jolokiaService.execute(
      mbean,
      "moveMessageTo(java.lang.String,java.lang.String)",
      [id, dest]
    );
  }

  async copyMessageTo(mbean: string, id: string, dest: string) {
    return jolokiaService.execute(
      mbean,
      "copyMessageTo(java.lang.String,java.lang.String)",
      [id, dest]
    );
  }

  async removeMessage(mbean: string, id: string) {
    return jolokiaService.execute(
      mbean,
      "removeMessage(java.lang.String)",
      [id]
    );
  }

  // Bulk ops
  async moveMatchingMessages(mbean: string, selector: string, dest: string) {
    return jolokiaService.execute(
      mbean,
      "moveMatchingMessages(java.lang.String,java.lang.String)",
      [selector, dest]
    );
  }

  async copyMatchingMessages(mbean: string, selector: string, dest: string) {
    return jolokiaService.execute(
      mbean,
      "copyMatchingMessages(java.lang.String,java.lang.String)",
      [selector, dest]
    );
  }

  async removeMatchingMessages(mbean: string, selector: string) {
    return jolokiaService.execute(
      mbean,
      "removeMatchingMessages(java.lang.String)",
      [selector]
    );
  }

  // Message groups
  async removeAllMessageGroups(mbean: string) {
    return jolokiaService.execute(mbean, "removeAllMessageGroups()", []);
  }

  async removeMessageGroup(mbean: string, group: string) {
    return jolokiaService.execute(
      mbean,
      "removeMessageGroup(java.lang.String)",
      [group]
    );
  }

  // Send text message
  async sendTextMessage(mbean: string, body: string) {
    return jolokiaService.execute(
      mbean,
      "sendTextMessage(java.lang.String)",
      [body]
    );
  }

  async listQueuesWithRawAttributes(brokerName: string) {
    const broker = await this.resolveBroker(brokerName)
    if (!broker) return []

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
  }

  async listConsumers(brokerName: string): Promise<string[]> {
    const broker = await this.resolveBroker(brokerName)
    if (!broker) return []

    const pattern = `${this.base(broker.name)},destinationType=Queue,destinationName=*,consumerId=*`
    return jolokiaService.search(pattern)
  }

  async getConsumerAttributes(mbean: string): Promise<any> {
    return jolokiaService.readAttributes(mbean)
  }

  async listProducers(brokerName: string): Promise<string[]> {
    const broker = await this.resolveBroker(brokerName)
    if (!broker) return []

    const pattern = `${this.base(broker.name)},destinationType=Queue,destinationName=*,producerId=*`
    return jolokiaService.search(pattern)
  }

  async getProducerAttributes(mbean: string): Promise<any> {
    return jolokiaService.readAttributes(mbean)
  }

  async listConnections(connectorMBean: string): Promise<any[]> {
    const attrs = await jolokiaService.readAttributes(connectorMBean) as ActiveMQConnectorAttributes
    return attrs?.Connections ?? []
  }

  async dropConnection(connectorMBean: string, connectionId: string) {
    return jolokiaService.execute(
      connectorMBean,
      "dropConnection(java.lang.String)",
      [connectionId]
    )
  }

  // Delete topic (broker-level op)
  async deleteTopic(brokerMBean: string, name: string) {
    return jolokiaService.execute(
      brokerMBean,
      "removeTopic(java.lang.String)",
      [name]
    )
  }

  async createTopic(brokerMBean: string, name: string) {
    return jolokiaService.execute(
      brokerMBean,
      "addTopic(java.lang.String)",
      [name]
    )
  }

  async getTopicAttributes(mbean: string): Promise<any> {
    return jolokiaService.readAttributes(mbean)
  }

}

export const activemq = new ActiveMQClassicService()
