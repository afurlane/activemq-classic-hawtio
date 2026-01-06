import React from 'react';
import { ActiveMQQueueAttributes } from '../../types/activemq';

interface Props {
  attributes: ActiveMQQueueAttributes;
}

const status = (value: number, green: number, yellow: number) => {
  if (value < green) return 'green';
  if (value < yellow) return 'yellow';
  return 'red';
};

export const QueueHealth: React.FC<Props> = ({ attributes }) => {
  const memory = status(attributes.MemoryPercentUsage, 60, 80);
  const cursor = status(attributes.CursorPercentUsage, 50, 80);
  const inflight = status(attributes.InflightCount, 100, 500);
  const consumers = attributes.ConsumerCount > 0 ? 'green' : 'red';
  const size = status(attributes.QueueSize, 1000, 10000);

  return (
    <div className="queue-health">
      <h4>Health Overview</h4>

      <ul>
        <li><b>Memory:</b> <span className={memory}>{attributes.MemoryPercentUsage}%</span></li>
        <li><b>Cursor:</b> <span className={cursor}>{attributes.CursorPercentUsage}%</span></li>
        <li><b>Inflight:</b> <span className={inflight}>{attributes.InflightCount}</span></li>
        <li><b>Consumers:</b> <span className={consumers}>{attributes.ConsumerCount}</span></li>
        <li><b>Queue Size:</b> <span className={size}>{attributes.QueueSize}</span></li>
      </ul>
    </div>
  );
};
