import React from 'react';
import {
  Card,
  CardBody,
  Title,
  Alert,
  AlertGroup
} from '@patternfly/react-core';

export const TopicAlerts: React.FC<{ attrs: any; history: any[] }> = ({ attrs }) => {
  const alerts: string[] = [];

  if (attrs.MemoryPercentUsage > 80) alerts.push(`High memory usage`);
  if (attrs.TempUsagePercentUsage > 80) alerts.push(`High temp usage`);
  if (attrs.ProducerCount === 0) alerts.push(`No producers`);
  if (attrs.ConsumerCount === 0) alerts.push(`No subscribers`);
  if (attrs.QueueSize > 10000) alerts.push(`Large backlog`);

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
