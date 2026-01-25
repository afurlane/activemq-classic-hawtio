export type View =
  | 'connectors'
  | 'queues'
  | 'topics'
  | 'broker'
  | 'overview';

export interface Route {
  view: View;
  queueName?: string;
  topicName?: string;
}

export function parseHashRoute(hash: string): Route {
  const h = hash.replace(/^#\/?/, '');
  const parts = h.split('/').filter(Boolean);

  if (parts.length === 0) {
    return { view: 'queues' };
  }

  if (parts[0] === 'connectors') {
    return { view: 'connectors' };
  }

  if (parts[0] === 'topics') {
    // /topics/<topic>
    if (parts[1]) {
      return { view: 'topics', topicName: decodeURIComponent(parts[1]) }
    }

    // /topics
    return { view: 'topics' }
  }

  if (parts[0] === 'broker') {
    return { view: 'broker' };
  }

  if (parts[0] === 'overview') {
    return { view: 'overview' };
  }

  if (parts[0] === 'queues') {
    if (parts[1]) {
      return {
        view: 'queues',
        queueName: decodeURIComponent(parts[1]),
      };
    }
    return { view: 'queues' };
  }

  return { view: 'queues' };
}

// URL builders
export function buildQueueUrl(name: string): string {
  return `#/queues/${encodeURIComponent(name)}`;
}

export function buildQueuesUrl(): string {
  return '#/queues';
}

export function buildTopicUrl(name: string): string {   // <-- aggiunto
  return `#/topics/${encodeURIComponent(name)}`;
}

export function buildTopicsUrl(): string {
  return '#/topics';
}

export function buildConnectorsUrl(): string {
  return '#/connectors';
}

export function buildBrokerUrl(): string {
  return '#/broker';
}

export function buildOverviewUrl(): string {
  return '#/overview';
}
