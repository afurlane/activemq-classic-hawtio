// src/services/activemq.ts
import { jolokia } from './jolokia';
import { ActiveMQQueueAttributes, QueueInfo, TopicInfo } from '../types/activemq';
import { JolokiaReadRequest, JolokiaRequest } from '../types/jolokia';

const BROKER = 'org.apache.activemq:type=Broker,brokerName=*';

export class ActiveMQService {

  // ────────────────────────────────────────────────────────────────
  //   QUEUES
  // ────────────────────────────────────────────────────────────────

  async listQueues(): Promise<QueueInfo[]> {
    const mbeans = await jolokia.search(`${BROKER},destinationType=Queue,destinationName=*`);

    const requests: JolokiaReadRequest[] = mbeans.map(mbean => ({
      type: 'read' as const,
      mbean,
    }));

    const responses = await jolokia.bulk<JolokiaReadRequest>(requests);

    return responses.map(r => {
      const v = r.value as ActiveMQQueueAttributes;
      return {
        name: v.Name,
        mbean: r.request.mbean,
        queueSize: v.QueueSize,
        enqueueCount: v.EnqueueCount,
        dequeueCount: v.DequeueCount,
        consumerCount: v.ConsumerCount,
        memoryPercentUsage: v.MemoryPercentUsage,
        averageEnqueueTime: v.AverageEnqueueTime,
        expiredCount: v.ExpiredCount,
        inflightCount: v.InflightCount,
        paused: v.Paused,
        stopped: v.Stopped,
        dlq: v.Dlq,
      };
    });
  }

  async getQueueInfo(mbean: string): Promise<QueueInfo> {
    const v = await jolokia.read<ActiveMQQueueAttributes>(mbean);
    return {
      name: v.Name,
      mbean,
      queueSize: v.QueueSize,
      enqueueCount: v.EnqueueCount,
      dequeueCount: v.DequeueCount,
      consumerCount: v.ConsumerCount,
      memoryPercentUsage: v.MemoryPercentUsage,
      averageEnqueueTime: v.AverageEnqueueTime,
      expiredCount: v.ExpiredCount,
      inflightCount: v.InflightCount,
      paused: v.Paused,
      stopped: v.Stopped,
      dlq: v.Dlq
    };
  }

  async browseQueue(mbean: string, page: number, pageSize: number) {
    const start = page * pageSize;
    const messages = await jolokia.exec(mbean, 'browse(int)', start + pageSize);
    return messages.slice(start, start + pageSize);
  }

  async purgeQueue(mbean: string) {
    return jolokia.exec(mbean, 'purge');
  }

  async pauseQueue(mbean: string) {
    return jolokia.exec(mbean, 'pause');
  }

  async resumeQueue(mbean: string) {
    return jolokia.exec(mbean, 'resume');
  }

  async deleteQueue(name: string) {
    return jolokia.exec(BROKER, 'removeQueue(java.lang.String)', name);
  }

  async resetStats(mbean: string) {
    return jolokia.exec(mbean, 'resetStatistics');
  }

  // ────────────────────────────────────────────────────────────────
  //   TOPICS
  // ────────────────────────────────────────────────────────────────

  async listTopics(): Promise<TopicInfo[]> {
    const mbeans = await jolokia.search(`${BROKER},destinationType=Topic,destinationName=*`);

    const requests: JolokiaReadRequest[] = mbeans.map(mbean => ({
      type: 'read' as const,
      mbean,
    }));

    const responses = await jolokia.bulk(requests);

    return responses.map(r => {
      const v = r.value;
      return {
        name: v.Name,
        mbean: r.request.mbean,
        enqueueCount: v.EnqueueCount,
        dequeueCount: v.DequeueCount,
        consumerCount: v.ConsumerCount,
        producerCount: v.ProducerCount,
      };
    });
  }

  // ────────────────────────────────────────────────────────────────
  //   CONNECTORS
  // ────────────────────────────────────────────────────────────────

  async listConnectors() {
    const mbeans = await jolokia.search(`${BROKER},connector=*,connectorName=*`);

    const requests: JolokiaReadRequest[] = mbeans.map(mbean => ({
      type: 'read' as const,
      mbean,
    }));

    const responses = await jolokia.bulk(requests);

    return responses.map(r => {
      const v = r.value;
      return {
        name: v.Name,
        protocol: v.Protocol,
        active: v.State === 'Started',
        connectionCount: v.ConnectionCount,
        inbound: v.InboundTraffic,
        outbound: v.OutboundTraffic,
        mbean: r.request.mbean,
      };
    });
  }

  async listConnections(connectorMBean: string) {
    return jolokia.exec(connectorMBean, 'connections()');
  }

  async dropConnection(connectorMBean: string, connectionId: string) {
    return jolokia.exec(connectorMBean, 'stopConnection(java.lang.String)', connectionId);
  }

  async startConnector(name: string) {
    return jolokia.exec(BROKER, 'startConnector(java.lang.String)', name);
  }

  async stopConnector(name: string) {
    return jolokia.exec(BROKER, 'stopConnector(java.lang.String)', name);
  }

    //
  // ────────────────────────────────────────────────────────────────
  //   DLQ TOOLS
  // ────────────────────────────────────────────────────────────────
  //

  async retryMessages(mbean: string) {
    return jolokia.exec(mbean, 'retryMessages()');
  }

  async retryMessage(mbean: string, messageId: string) {
    return jolokia.exec(mbean, 'retryMessage(java.lang.String)', messageId);
  }

  //
  // ────────────────────────────────────────────────────────────────
  //   MESSAGE TOOLS
  // ────────────────────────────────────────────────────────────────
  //

  async moveMessageTo(mbean: string, messageId: string, destination: string) {
    return jolokia.exec(
      mbean,
      'moveMessageTo(java.lang.String, java.lang.String)',
      messageId,
      destination
    );
  }

  async copyMessageTo(mbean: string, messageId: string, destination: string) {
    return jolokia.exec(
      mbean,
      'copyMessageTo(java.lang.String, java.lang.String)',
      messageId,
      destination
    );
  }

  async removeMessage(mbean: string, messageId: string) {
    return jolokia.exec(
      mbean,
      'removeMessage(java.lang.String)',
      messageId
    );
  }

  //
  // ────────────────────────────────────────────────────────────────
  //   BULK TOOLS
  // ────────────────────────────────────────────────────────────────
  //

  async moveMatchingMessagesTo(
    mbean: string,
    selector: string,
    destination: string,
    limit: number
  ) {
    return jolokia.exec(
      mbean,
      'moveMatchingMessagesTo(java.lang.String, java.lang.String, int)',
      selector,
      destination,
      limit
    );
  }

  async copyMatchingMessagesTo(
    mbean: string,
    selector: string,
    destination: string,
    limit: number
  ) {
    return jolokia.exec(
      mbean,
      'copyMatchingMessagesTo(java.lang.String, java.lang.String, int)',
      selector,
      destination,
      limit
    );
  }

  async removeMatchingMessages(
    mbean: string,
    selector: string,
    limit: number
  ) {
    return jolokia.exec(
      mbean,
      'removeMatchingMessages(java.lang.String, int)',
      selector,
      limit
    );
  }

  //
  // ────────────────────────────────────────────────────────────────
  //   MESSAGE GROUPS
  // ────────────────────────────────────────────────────────────────
  //

  async removeAllMessageGroups(mbean: string) {
    return jolokia.exec(mbean, 'removeAllMessageGroups()');
  }

  async removeMessageGroup(mbean: string, groupName: string) {
    return jolokia.exec(
      mbean,
      'removeMessageGroup(java.lang.String)',
      groupName
    );
  }

  //
  // ────────────────────────────────────────────────────────────────
  //   SEND MESSAGE
  // ────────────────────────────────────────────────────────────────
  //

  async sendTextMessage(mbean: string, body: string) {
    return jolokia.exec(
      mbean,
      'sendTextMessage(java.lang.String)',
      body
    );
  }

  async listQueuesWithAttributes() {
    const queues = await this.listQueues();
    const results = [];
    
    for (const q of queues) {
      const attrs = await this.getQueueAttributes(q.mbean);
      results.push({ info: q, attrs });
    }

    return results;
  }

  async getQueueAttributes(mbean: string): Promise<ActiveMQQueueAttributes> {
    return jolokia.read<ActiveMQQueueAttributes>(mbean);
  }

  async listConsumers() {
    return jolokia.search("org.apache.activemq:type=Broker,brokerName=*,destinationType=Queue,*,endpoint=Consumer,*");
  }

  async getConsumerAttributes(mbean: string) {
    return jolokia.read(mbean);
  }

  async listProducers() {
    return jolokia.search("org.apache.activemq:type=Broker,brokerName=*,endpoint=dynamicProducer,*");
  }

  async getProducerAttributes(mbean: string) {
    return jolokia.read(mbean);
  }

}

export const activemq = new ActiveMQService();
