import React from 'react';
import { ActiveMQQueueAttributes } from '../../types/activemq';

interface Props {
  attributes: ActiveMQQueueAttributes;
  history: ActiveMQQueueAttributes[];
}

export const QueueConsumers: React.FC<Props> = ({ attributes, history }) => {
  const latest = attributes;
  const prev = history[history.length - 2];

  let dispatchRate = 0;
  if (prev) {
    dispatchRate = (latest.DispatchCount - prev.DispatchCount) / 2; // msg/sec
  }

  const prefetchValues =
    latest.Subscriptions?.map(s => s.prefetchSize).filter(Boolean) ?? [];

  return (
    <div className="queue-consumers">
      <h4>Consumers</h4>

      <p><b>Active Consumers:</b> {latest.ConsumerCount}</p>
      <p><b>Inflight:</b> {latest.InflightCount}</p>
      <p><b>Dispatch Rate:</b> {dispatchRate.toFixed(1)} msg/s</p>

      {prefetchValues.length > 0 && (
        <p><b>Prefetch:</b> {prefetchValues.join(', ')}</p>
      )}
    </div>
  );
};
