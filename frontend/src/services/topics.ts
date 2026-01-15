import { jolokia } from './jolokia';

export const topics = {
  async listTopics() {
    const mbeans = await jolokia.search(
      'org.apache.activemq:type=Broker,brokerName=*,destinationType=Topic,destinationName=*'
    );

    const results = await Promise.all(
      mbeans.map(async mbean => {
        const attrs = await jolokia.read(mbean);
        return {
          mbean,
          name: attrs.Name,
          enqueueCount: attrs.EnqueueCount,
          dequeueCount: attrs.DequeueCount,
          producerCount: attrs.ProducerCount,
          consumerCount: attrs.ConsumerCount,
          queueSize: attrs.QueueSize,
        };
      })
    );

    return results;
  },

  async getTopicAttributes(mbean: string) {
    return jolokia.read(mbean);
  },

  async resetStatistics(mbean: string) {
    return jolokia.exec(mbean, 'resetStatistics');
  },

  async browse(mbean: string, selector?: string) {
    if (selector) {
      return jolokia.exec(mbean, 'browseMessages(java.lang.String)', selector);
    }
    return jolokia.exec(mbean, 'browseMessages');
  },

  async sendMessage(mbean: string, body: string, headers: Record<string, string>) {
    return jolokia.exec(
      mbean,
      'sendTextMessageWithProperties(java.lang.String,java.lang.String)',
      body,
      Object.entries(headers)
        .map(([k, v]) => `${k}=${v}`)
        .join(',')
    );
  },

  async deleteTopic(mbean: string) {
    return jolokia.exec(mbean, 'removeTopic');
  },

  async listSubscribers(topicName: string) {
    const mbeans = await jolokia.search(
      `org.apache.activemq:type=Broker,brokerName=*,destinationType=Topic,destinationName=${topicName},endpoint=Consumer,*`
    );

    return Promise.all(mbeans.map(m => jolokia.read(m)));
  },

  async listProducers(topicName: string) {
    const mbeans = await jolokia.search(
      `org.apache.activemq:type=Broker,brokerName=*,endpoint=dynamicProducer,*`
    );

    const attrs = await Promise.all(mbeans.map(m => jolokia.read(m)));

    return attrs.filter(a => a.DestinationName === topicName);
  },
};
