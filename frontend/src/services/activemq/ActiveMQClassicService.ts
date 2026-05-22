import { BrokerInfo } from '../../hooks/useBrokers'
import { Connector, DLQ, Message, Queue, Subscription, Topic } from '../../types/domain'
import {
  createTopic,
  deleteTopic,
  getTopicAttributes,
  listTopics,
  browseTopic,
} from './operations/topics'
import {
  browseQueue,
  copyMatchingMessages,
  copyMessageTo,
  deleteQueue,
  getDLQInfo,
  getQueue,
  listQueues,
  listQueuesWithRawAttributes,
  moveMatchingMessages,
  moveMessageTo,
  pauseQueue,
  purgeQueue,
  removeAllMessageGroups,
  removeMatchingMessages,
  removeMessage,
  removeMessageGroup,
  resetStats,
  resumeQueue,
  retryMessage,
  retryMessages,
  sendTextMessage,
  sendTextMessageWithHeaders,
} from './operations/queues'
import {
  dropConnection,
  getConsumerAttributes,
  getProducerAttributes,
  listConnectors,
  listConnections,
  listConsumers,
  listProducers,
} from './operations/connectors'
import { browseSubscription, listSubscriptions } from './operations/subscriptions'
import { getBrokerMBean, resolveBroker } from './operations/common'

export { getBrokerMBean }

export class ActiveMQClassicService {
  private async resolveBroker(name?: string): Promise<BrokerInfo | null> {
    return resolveBroker(name)
  }

  async listQueues(brokerName?: string): Promise<Queue[]> {
    return listQueues(this.resolveBroker.bind(this), brokerName)
  }

  async getQueue(mbean: string): Promise<Queue | null> {
    return getQueue(mbean)
  }

  async listQueuesWithRawAttributes(brokerName: string) {
    return listQueuesWithRawAttributes(this.resolveBroker.bind(this), brokerName)
  }

  async listTopics(brokerName?: string): Promise<Topic[]> {
    return listTopics(this.resolveBroker.bind(this), brokerName)
  }

  async getTopicAttributes(mbean: string): Promise<any> {
    return getTopicAttributes(mbean)
  }

  async listConnectors(brokerName?: string): Promise<Connector[]> {
    return listConnectors(this.resolveBroker.bind(this), brokerName)
  }

  async listConnections(connectorMBean: string): Promise<any[]> {
    return listConnections(connectorMBean)
  }

  async browseQueue(mbean: string): Promise<Message[]> {
    return browseQueue(mbean)
  }

  async browseTopic(mbean: string): Promise<Message[]> {
    return browseTopic(mbean)
  }

  async getDLQInfo(mbean: string): Promise<DLQ> {
    return getDLQInfo(mbean)
  }

  async listSubscriptions(topicOrQueueMBean: string): Promise<Subscription[]> {
    return listSubscriptions(topicOrQueueMBean)
  }

  async listConsumers(brokerName: string): Promise<string[]> {
    return listConsumers(this.resolveBroker.bind(this), brokerName)
  }

  async getConsumerAttributes(mbean: string): Promise<any> {
    return getConsumerAttributes(mbean)
  }

  async listProducers(brokerName: string): Promise<string[]> {
    return listProducers(this.resolveBroker.bind(this), brokerName)
  }

  async getProducerAttributes(mbean: string): Promise<any> {
    return getProducerAttributes(mbean)
  }

  async purgeQueue(mbean: string) {
    return purgeQueue(mbean)
  }

  async pauseQueue(mbean: string) {
    return pauseQueue(mbean)
  }

  async resumeQueue(mbean: string) {
    return resumeQueue(mbean)
  }

  async resetStats(mbean: string) {
    return resetStats(mbean)
  }

  async deleteQueue(queueMBean: string, name: string) {
    return deleteQueue(queueMBean, name)
  }

  async retryMessages(mbean: string) {
    return retryMessages(mbean)
  }

  async retryMessage(mbean: string, id: string) {
    return retryMessage(mbean, id)
  }

  async moveMessageTo(mbean: string, id: string, dest: string) {
    return moveMessageTo(mbean, id, dest)
  }

  async copyMessageTo(mbean: string, id: string, dest: string) {
    return copyMessageTo(mbean, id, dest)
  }

  async removeMessage(mbean: string, id: string) {
    return removeMessage(mbean, id)
  }

  async moveMatchingMessages(mbean: string, selector: string, dest: string) {
    return moveMatchingMessages(mbean, selector, dest)
  }

  async copyMatchingMessages(mbean: string, selector: string, dest: string) {
    return copyMatchingMessages(mbean, selector, dest)
  }

  async removeMatchingMessages(mbean: string, selector: string) {
    return removeMatchingMessages(mbean, selector)
  }

  async removeAllMessageGroups(mbean: string) {
    return removeAllMessageGroups(mbean)
  }

  async removeMessageGroup(mbean: string, group: string) {
    return removeMessageGroup(mbean, group)
  }

  async sendTextMessage(mbean: string, body: string) {
    return sendTextMessage(mbean, body)
  }

  async sendTextMessageWithHeaders(
    mbean: string,
    body: string,
    headers: Record<string, string>
  ) {
    return sendTextMessageWithHeaders(mbean, body, headers)
  }

  async dropConnection(connectorMBean: string, connectionId: string) {
    return dropConnection(connectorMBean, connectionId)
  }

  async deleteTopic(brokerMBean: string, name: string) {
    return deleteTopic(brokerMBean, name)
  }

  async createTopic(brokerMBean: string, name: string) {
    return createTopic(brokerMBean, name)
  }

  async browseSubscription(mbean: string): Promise<Message[]> {
    return browseSubscription(mbean)
  }
}

export const activemq = new ActiveMQClassicService()
