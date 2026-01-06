import React from 'react';
import { ActiveMQQueueAttributes } from '../../types/activemq';

interface Props {
  attributes: ActiveMQQueueAttributes;
  history: ActiveMQQueueAttributes[];
}

export const QueueAlerts: React.FC<Props> = ({ attributes, history }) => {
  const alerts: string[] = [];

  const lag = attributes.QueueSize - attributes.InflightCount;

  // Memory
  if (attributes.MemoryPercentUsage > 80)
    alerts.push(`High memory usage: ${attributes.MemoryPercentUsage}%`);

  // Cursor
  if (attributes.CursorPercentUsage > 80)
    alerts.push(`Cursor near capacity: ${attributes.CursorPercentUsage}%`);

  // Consumers
  if (attributes.ConsumerCount === 0)
    alerts.push(`No active consumers`);

  // Lag
  if (lag > 10000)
    alerts.push(`High consumer lag: ${lag} messages`);

  // Inflight
  if (attributes.InflightCount > 500)
    alerts.push(`Too many inflight messages: ${attributes.InflightCount}`);

  // Queue size
  if (attributes.QueueSize > 10000)
    alerts.push(`Queue backlog growing: ${attributes.QueueSize} messages`);

  // Dispatch stall
  if (history.length > 2) {
    const latest = history[history.length - 1];
    const prev = history[history.length - 2];

    const enqueueDelta = latest.EnqueueCount - prev.EnqueueCount;
    const dispatchDelta = latest.DispatchCount - prev.DispatchCount;

    if (enqueueDelta > 0 && dispatchDelta === 0)
      alerts.push(`Messages enqueued but not dispatched`);
  }

  return (
    <div className="queue-alerts">
      <h4>Alerts</h4>

      {alerts.length === 0 && <p>No alerts</p>}

      <ul>
        {alerts.map((a, i) => (
          <li key={i} style={{ color: '#dc3545', fontWeight: 'bold' }}>
            ⚠️ {a}
          </li>
        ))}
      </ul>
    </div>
  );
};
