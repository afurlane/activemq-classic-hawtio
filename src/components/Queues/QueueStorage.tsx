import React from 'react';
import { ActiveMQQueueAttributes } from '../../types/activemq';

interface Props {
  attributes: ActiveMQQueueAttributes;
}

export const QueueStorage: React.FC<Props> = ({ attributes }) => {
  return (
    <div className="queue-storage">
      <h4>Storage</h4>

      <p><b>Store Message Size:</b> {attributes.StoreMessageSize} bytes</p>
      <p><b>Temp Usage:</b> {attributes.TempUsagePercentUsage}%</p>
      <p><b>Cursor Memory Usage:</b> {attributes.CursorMemoryUsage} bytes</p>
      <p><b>Total Memory Usage:</b> {attributes.MemoryUsageByteCount} bytes</p>
    </div>
  );
};
