import React, { useEffect, useState } from 'react';
import { activemq } from '../../services/activemq';
import { buildQueuesUrl } from '../../router/router';
import { QueueBrowser } from './QueueBrowser';
import { QueueOperations } from './QueueOperations';
import { QueueAttributes } from './QueueAttributes';
import { QueueCharts } from './QueueCharts';
import { ActiveMQQueueAttributes, QueueInfo } from '../../types/activemq';
import { useQueueMetrics } from '../../hooks/useQueueMetrics';
import { QueueHealth } from './QueueHealth';
import { QueueThroughput } from './QueueThroughput';
import { QueueLag } from './QueueLag';
import { QueueAlerts } from './QueueAlerts';
import { QueueStorage } from './QueueStorage';
import { QueueDLQ } from './QueueDLQ';
import { QueueConsumers } from './QueueConsumers';

interface Props {
  queueName: string;
}

export const QueueDetailsPage: React.FC<Props> = ({ queueName }) => {
  const [info, setInfo] = useState<QueueInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // 1) Carichiamo solo QueueInfo (statico)
  const loadInfo = async () => {
    setLoading(true);

    const queues = await activemq.listQueues();
    const q = queues.find(q => q.name === queueName);

    if (!q) {
      setInfo(null);
      setLoading(false);
      return;
    }

    const full = await activemq.getQueueInfo(q.mbean);
    setInfo(full);
    setLoading(false);
  };

  useEffect(() => {
    loadInfo();
  }, [queueName]);

  // 2) Polling continuo degli attributi completi
  const { latest: raw, history, loading: metricsLoading } =
    useQueueMetrics(info?.mbean ?? '');

  if (loading || metricsLoading || !info || !raw) {
    return <div>Loading queue {queueName}…</div>;
  }

  return (
    <div className="queue-details-page">
      <h2>Queue: {info.name}</h2>
      <button onClick={() => (window.location.hash = buildQueuesUrl())}>
        Back to queues
      </button>

      {/* Info sintetiche */}
      <div className="info">
        <p><b>Size:</b> {info.queueSize}</p>
        <p><b>Enqueue:</b> {info.enqueueCount}</p>
        <p><b>Dequeue:</b> {info.dequeueCount}</p>
        <p><b>Consumers:</b> {info.consumerCount}</p>
        <p><b>Memory:</b> {info.memoryPercentUsage}%</p>
        <p><b>State:</b> {info.stopped ? 'Stopped' : info.paused ? 'Paused' : 'Running'}</p>
      </div>

      {/* Operazioni */}
      <h3>Operations</h3>
      <QueueOperations queue={info} onAction={loadInfo} />

      {/* HEALTH */}
      <h3>Health</h3>
      <QueueHealth attributes={raw} />

      {/* THROUGHPUT */}
      <h3>Throughput</h3>
      <QueueThroughput history={history} />

      {/* LAG */}
      <h3>Consumer Lag</h3>
      <QueueLag attributes={raw} />

      {/* CHARTS */}
      <h3>Charts</h3>
      <QueueCharts history={history} />

      {/* ATTRIBUTES */}
      <h3>Attributes</h3>
      <QueueAttributes attributes={raw} />

      <h3>Alerts</h3>
      <QueueAlerts attributes={raw} history={history} />

      <h3>Storage</h3>
      <QueueStorage attributes={raw} />

      <h3>DLQ</h3>
      <QueueDLQ attributes={raw} />

      <h3>Consumers</h3>
      <QueueConsumers attributes={raw} history={history} />

      {/* MESSAGES */}
      <h3>Messages</h3>
      <QueueBrowser queue={info} />
    </div>
  );
};
