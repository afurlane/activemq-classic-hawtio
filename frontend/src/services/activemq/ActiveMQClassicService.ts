import { jolokiaService } from '@hawtio/react'
import { JolokiaRequest, RequestType } from 'jolokia.js'
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
import { BrokerInfo } from 'src/hooks/useBrokers';

function normalizeBulk<T>(r: any) {
  if (r.status !== 200 || r.error) {
    return { request: r.request, value: null as T | null };
  }
  return { request: r.request, value: r.value as T };
}

export function getBrokerMBean(brokerName: string) {
  return `org.apache.activemq:type=Broker,brokerName=${brokerName}`;
}

export class ActiveMQClassicService {

  private async resolveBroker(name?: string): Promise<BrokerInfo | null> {
    // Se il nome è stato passato dal contesto React → usalo
    if (name && name.trim().length > 0) {
      return {
        name,
        mbean: getBrokerMBean(name)
      }
    }

    // Altrimenti scopri il broker via Jolokia
    const mbeans = await jolokiaService.search(
      'org.apache.activemq:type=Broker,brokerName=*'
    )

    if (!mbeans || mbeans.length === 0) {
      return null
    }

    const mbean = mbeans[0]
    if (!mbean) {
      return null
    }
    const match = /brokerName=([^,]+)/.exec(mbean)
    const brokerName = match?.[1] ?? 'default'

    return {
      name: brokerName,
      mbean
    }
  }

  private base(brokerName: string) {
    return getBrokerMBean(brokerName);
  }

  // ────────────────────────────────────────────────────────────────
  // QUEUES
  // ────────────────────────────────────────────────────────────────

  async listQueues(brokerName?: string): Promise<Queue[]> {
    const broker = await this.resolveBroker(brokerName);
    if (!broker) return [];

    const pattern = `${this.base(broker.name)},destinationType=Queue,destinationName=*`;
    const mbeans = await jolokiaService.search(pattern);

    const requests: JolokiaRequest[] = mbeans.map(mbean => ({
      type: 'read' as RequestType,
      mbean,
    } as JolokiaRequest));

    const raw = await jolokiaService.bulkRequest(requests);

    return raw
      .map(normalizeBulk<ActiveMQQueueAttributes>)
      .filter(r => r.value)
      .map(r => mapQueue(r.request.mbean, r.value!));
  }

  async getQueue(mbean: string): Promise<Queue | null> {
    const attrs = await jolokiaService.readAttributes(mbean);
    if (!attrs) return null;
    return mapQueue(mbean, attrs as ActiveMQQueueAttributes);
  }

  async listQueuesWithRawAttributes(brokerName: string) {
    const broker = await this.resolveBroker(brokerName);
    if (!broker) return [];

    const pattern = `${this.base(broker.name)},destinationType=Queue,destinationName=*`;
    const mbeans = await jolokiaService.search(pattern);

    const requests: JolokiaRequest[] = mbeans.map(mbean => ({
      type: 'read' as RequestType,
      mbean,
    } as JolokiaRequest));

    const raw = await jolokiaService.bulkRequest(requests);

    return raw
      .map(normalizeBulk<ActiveMQQueueAttributes>)
      .filter(r => r.value)
      .map(r => ({
        mbean: r.request.mbean,
        attrs: r.value!,
      }));
  }

  // ────────────────────────────────────────────────────────────────
  // TOPICS
  // ────────────────────────────────────────────────────────────────

  async listTopics(brokerName?: string): Promise<Topic[]> {
    const broker = await this.resolveBroker(brokerName);
    if (!broker) return [];

    const pattern = `${this.base(broker.name)},destinationType=Topic,destinationName=*`;
    const mbeans = await jolokiaService.search(pattern);

    const requests: JolokiaRequest[] = mbeans.map(mbean => ({
      type: 'read' as RequestType,
      mbean,
    } as JolokiaRequest));

    const raw = await jolokiaService.bulkRequest(requests);

    return raw
      .map(normalizeBulk<ActiveMQTopicAttributes>)
      .filter(r => r.value)
      .map(r => mapTopic(r.request.mbean, r.value!));
  }

  async getTopicAttributes(mbean: string): Promise<any> {
    return jolokiaService.readAttributes(mbean);
  }

  // ────────────────────────────────────────────────────────────────
  // CONNECTORS & CONNECTIONS
  // ────────────────────────────────────────────────────────────────

  async listConnectors(brokerName?: string): Promise<Connector[]> {
    const broker = await this.resolveBroker(brokerName);
    if (!broker) return [];

    const pattern = `${this.base(broker.name)},connector=*,connectorName=*`;
    const mbeans = await jolokiaService.search(pattern);

    const requests: JolokiaRequest[] = mbeans.map(mbean => ({
      type: 'read' as RequestType,
      mbean,
    } as JolokiaRequest));

    const raw = await jolokiaService.bulkRequest(requests);

    return raw
      .map(normalizeBulk<ActiveMQConnectorAttributes>)
      .filter(r => r.value)
      .map(r => mapConnector(r.request.mbean, r.value!));
  }

  async listConnections(connectorMBean: string): Promise<any[]> {
    const attrs = await jolokiaService.readAttributes(connectorMBean) as ActiveMQConnectorAttributes;
    return attrs?.Connections ?? [];
  }

  // ────────────────────────────────────────────────────────────────
  // BROWSE / MESSAGES / DLQ / SUBSCRIPTIONS
  // ────────────────────────────────────────────────────────────────

  async browseQueue(mbean: string, page: number, pageSize: number): Promise<Message[]> {
    const start = page * pageSize;
    const raw = await jolokiaService.execute(
      mbean,
      'browse()',
    ) as ActiveMQMessageAttributes[];

    const slice = raw.slice(start, start + pageSize);
    return slice.map(mapMessage);
  }

  async browseTopic(mbean: string, page: number, pageSize: number): Promise<Message[]> {
    const start = page * pageSize;
    const raw = await jolokiaService.execute(
      mbean,
      'browse()',
    ) as ActiveMQMessageAttributes[];

    const slice = raw.slice(start, start + pageSize);
    return slice.map(mapMessage);
  }

  async getDLQInfo(mbean: string): Promise<DLQ> {
    const attrs = await jolokiaService.readAttributes(mbean) as ActiveMQDLQAttributes;
    return mapDLQ(mbean, attrs);
  }

  async listSubscriptions(topicOrQueueMBean: string): Promise<Subscription[]> {
    const attrs = await jolokiaService.readAttributes(topicOrQueueMBean) as any;
    const subs = attrs.Subscriptions ?? [];
    return subs.map(mapSubscription);
  }

  // ────────────────────────────────────────────────────────────────
  // CONSUMERS / PRODUCERS
  // ────────────────────────────────────────────────────────────────

  async listConsumers(brokerName: string): Promise<string[]> {
    const broker = await this.resolveBroker(brokerName);
    if (!broker) return [];

    const pattern = `${this.base(broker.name)},destinationType=Queue,destinationName=*,consumerId=*`;
    return jolokiaService.search(pattern);
  }

  async getConsumerAttributes(mbean: string): Promise<any> {
    return jolokiaService.readAttributes(mbean);
  }

  async listProducers(brokerName: string): Promise<string[]> {
    const broker = await this.resolveBroker(brokerName);
    if (!broker) return [];

    const pattern = `${this.base(broker.name)},destinationType=Queue,destinationName=*,producerId=*`;
    return jolokiaService.search(pattern);
  }

  async getProducerAttributes(mbean: string): Promise<any> {
    return jolokiaService.readAttributes(mbean)
  }

  // ────────────────────────────────────────────────────────────────
  // WRITE OPS + INVALIDAZIONI GROSSE (cache.clear)
  // ────────────────────────────────────────────────────────────────

  async purgeQueue(mbean: string) {
    return await jolokiaService.execute(mbean, 'purge()', []);
  }

  async pauseQueue(mbean: string) {
    return await jolokiaService.execute(mbean, 'pause()', []);
  }

  async resumeQueue(mbean: string) {
    return await jolokiaService.execute(mbean, 'resume()', []);
  }

  async resetStats(mbean: string) {
    return await jolokiaService.execute(mbean, 'resetStatistics()', []);
  }

  async deleteQueue(brokerMBean: string, name: string) {
    return await jolokiaService.execute(
      brokerMBean,
      'removeQueue(java.lang.String)',
      [name],
    );
  }

  async retryMessages(mbean: string) {
    return await jolokiaService.execute(mbean, 'retryMessages()', []);
  }

  async retryMessage(mbean: string, id: string) {
    return await jolokiaService.execute(
      mbean,
      'retryMessage(java.lang.String)',
      [id],
    );
  }

  async moveMessageTo(mbean: string, id: string, dest: string) {
    return await jolokiaService.execute(
      mbean,
      'moveMessageTo(java.lang.String,java.lang.String)',
      [id, dest],
    );
  }

  async copyMessageTo(mbean: string, id: string, dest: string) {
    return await jolokiaService.execute(
      mbean,
      'copyMessageTo(java.lang.String,java.lang.String)',
      [id, dest],
    );
  }

  async removeMessage(mbean: string, id: string) {
    return await jolokiaService.execute(
      mbean,
      'removeMessage(java.lang.String)',
      [id],
    );
  }

  async moveMatchingMessages(mbean: string, selector: string, dest: string) {
    return await jolokiaService.execute(
      mbean,
      'moveMatchingMessages(java.lang.String,java.lang.String)',
      [selector, dest],
    );
  }

  async copyMatchingMessages(mbean: string, selector: string, dest: string) {
    return await jolokiaService.execute(
      mbean,
      'copyMatchingMessages(java.lang.String,java.lang.String)',
      [selector, dest],
    );
  }

  async removeMatchingMessages(mbean: string, selector: string) {
    return await jolokiaService.execute(
      mbean,
      'removeMatchingMessages(java.lang.String)',
      [selector],
    );
  }

  async removeAllMessageGroups(mbean: string) {
    return await jolokiaService.execute(mbean, 'removeAllMessageGroups()', []);
  }

  async removeMessageGroup(mbean: string, group: string) {
    return await jolokiaService.execute(
      mbean,
      'removeMessageGroup(java.lang.String)',
      [group],
    );
  }

  async sendTextMessage(mbean: string, body: string) {
    return await jolokiaService.execute(
      mbean,
      'sendTextMessage(java.lang.String)',
      [body],
    );
  }

  async dropConnection(connectorMBean: string, connectionId: string) {
    return await jolokiaService.execute(
      connectorMBean,
      'dropConnection(java.lang.String)',
      [connectionId],
    );
  }

  async deleteTopic(brokerMBean: string, name: string) {
    return await jolokiaService.execute(
      brokerMBean,
      'removeTopic(java.lang.String)',
      [name],
    );
  }

  async createTopic(brokerMBean: string, name: string) {
    return await jolokiaService.execute(
      brokerMBean,
      'addTopic(java.lang.String)',
      [name],
    )
  }
}

export const activemq = new ActiveMQClassicService()
