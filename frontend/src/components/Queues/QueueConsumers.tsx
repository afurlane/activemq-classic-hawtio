import React from 'react';
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
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Consumers</Title>

        <DescriptionList isHorizontal>
          <DescriptionListGroup>
            <DescriptionListTerm>Active Consumers</DescriptionListTerm>
            <DescriptionListDescription>
              {latest.ConsumerCount}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Inflight</DescriptionListTerm>
            <DescriptionListDescription>
              {latest.InflightCount}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Dispatch Rate</DescriptionListTerm>
            <DescriptionListDescription>
              {dispatchRate.toFixed(1)} msg/s
            </DescriptionListDescription>
          </DescriptionListGroup>

          {prefetchValues.length > 0 && (
            <DescriptionListGroup>
              <DescriptionListTerm>Prefetch</DescriptionListTerm>
              <DescriptionListDescription>
                {prefetchValues.join(', ')}
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}
        </DescriptionList>
      </CardBody>
    </Card>
  );
};
