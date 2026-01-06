import React, { useMemo } from 'react';
import { ActiveMQQueueAttributes } from '../../types/activemq';

interface Props {
  history: ActiveMQQueueAttributes[];
  intervalMs?: number;
}

export const QueueThroughput: React.FC<Props> = ({ history, intervalMs = 2000 }) => {
  const latest = history[history.length - 1];
  const prev = history[history.length - 2];

  const rates = useMemo(() => {
    if (!latest || !prev) return null;

    const dt = intervalMs / 1000;

    return {
      enqueue: (latest.EnqueueCount - prev.EnqueueCount) / dt,
      dequeue: (latest.DequeueCount - prev.DequeueCount) / dt,
      dispatch: (latest.DispatchCount - prev.DispatchCount) / dt,
    };
  }, [history, intervalMs]);

  if (!rates) return <p>Collecting throughput data…</p>;

  return (
    <div className="queue-throughput">
      <h4>Throughput (msg/sec)</h4>
      <p><b>Enqueue:</b> {rates.enqueue.toFixed(1)}</p>
      <p><b>Dequeue:</b> {rates.dequeue.toFixed(1)}</p>
      <p><b>Dispatch:</b> {rates.dispatch.toFixed(1)}</p>
    </div>
  );
};
