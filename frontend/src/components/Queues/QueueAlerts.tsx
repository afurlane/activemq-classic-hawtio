import React from 'react';
import { ActiveMQQueueAttributes } from '../../types/activemq';
import {
  Card,
  CardBody,
  Title,
  Alert,
  AlertGroup
} from '@patternfly/react-core';

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
    const latest = history.at(-1);
    const prev = history.at(-2);

    if (!latest || !prev) return null; // o semplicemente non fare nulla

    const enqueueDelta = latest.EnqueueCount - prev.EnqueueCount;
    const dispatchDelta = latest.DispatchCount - prev.DispatchCount;

    if (enqueueDelta > 0 && dispatchDelta === 0)
      alerts.push(`Messages enqueued but not dispatched`);
  }

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Alerts</Title>

        {alerts.length === 0 && (
          <Alert
            variant="success"
            title="No alerts"
            isInline
          />
        )}

        {alerts.length > 0 && (
          <AlertGroup isLiveRegion>
            {alerts.map((a, i) => (
              <Alert
                key={i}
                variant="danger"
                title={a}
                isInline
              />
            ))}
          </AlertGroup>
        )}
      </CardBody>
    </Card>
  );
};
