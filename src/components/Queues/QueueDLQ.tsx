import React from 'react';
import { ActiveMQQueueAttributes } from '../../types/activemq';

interface Props {
  attributes: ActiveMQQueueAttributes;
}

export const QueueDLQ: React.FC<Props> = ({ attributes }) => {
  return (
    <div className="queue-dlq">
      <h4>DLQ / Redelivery</h4>

      <p><b>Is DLQ:</b> {attributes.Dlq ? 'Yes' : 'No'}</p>
      <p><b>Expired Messages:</b> {attributes.ExpiredCount}</p>
      <p><b>Redelivered Messages:</b> {attributes.RedeliveredCount ?? 'N/A'}</p>
      <p><b>Duplicate From Store:</b> {attributes.DuplicateFromStoreCount}</p>
      <p><b>Send Duplicate To DLQ:</b> {attributes.SendDuplicateFromStoreToDLQ ? 'Yes' : 'No'}</p>
    </div>
  );
};
