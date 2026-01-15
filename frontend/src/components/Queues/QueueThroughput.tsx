import React, { useMemo } from 'react';
import {
  Card,
  CardBody,
  Title,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription
} from '@patternfly/react-core';

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

  if (!rates) {
    return (
      <Card isFlat isCompact>
        <CardBody>
          <Title headingLevel="h4">Throughput (msg/sec)</Title>
          Collecting throughput data…
        </CardBody>
      </Card>
    );
  }

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Throughput (msg/sec)</Title>

        <DescriptionList isHorizontal>
          <DescriptionListGroup>
            <DescriptionListTerm>Enqueue</DescriptionListTerm>
            <DescriptionListDescription>
              {rates.enqueue.toFixed(1)}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Dequeue</DescriptionListTerm>
            <DescriptionListDescription>
              {rates.dequeue.toFixed(1)}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Dispatch</DescriptionListTerm>
            <DescriptionListDescription>
              {rates.dispatch.toFixed(1)}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardBody>
    </Card>
  );
};
