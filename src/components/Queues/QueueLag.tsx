import React from 'react';
import { ActiveMQQueueAttributes } from '../../types/activemq';

interface Props {
  attributes: ActiveMQQueueAttributes;
}

export const QueueLag: React.FC<Props> = ({ attributes }) => {
  const lag = attributes.QueueSize - attributes.InflightCount;

  let color = 'green';
  if (lag > 1000) color = 'yellow';
  if (lag > 10000) color = 'red';

  return (
    <div className="queue-lag">
      <h4>Consumer Lag</h4>
      <p><b>Lag:</b> <span className={color}>{lag}</span></p>
    </div>
  );
};
