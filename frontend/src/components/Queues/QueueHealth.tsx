import React from 'react';
import {
  Card,
  CardBody,
  Title,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Label
} from '@patternfly/react-core';

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon
} from '@patternfly/react-icons';

import { ActiveMQQueueAttributes } from '../../types/activemq';

interface Props {
  attributes: ActiveMQQueueAttributes;
}

const status = (value: number, green: number, yellow: number) => {
  if (value < green) return 'green';
  if (value < yellow) return 'yellow';
  return 'red';
};

const renderStatus = (value: any, severity: string) => {
  if (severity === 'green') {
    return (
      <Label color="green" icon={<CheckCircleIcon />}>
        {value}
      </Label>
    );
  }
  if (severity === 'yellow') {
    return (
      <Label color="orange" icon={<ExclamationTriangleIcon />}>
        {value}
      </Label>
    );
  }
  return (
    <Label color="red" icon={<ExclamationCircleIcon />}>
      {value}
    </Label>
  );
};

export const QueueHealth: React.FC<Props> = ({ attributes }) => {
  const memory = status(attributes.MemoryPercentUsage, 60, 80);
  const cursor = status(attributes.CursorPercentUsage, 50, 80);
  const inflight = status(attributes.InflightCount, 100, 500);
  const consumers = attributes.ConsumerCount > 0 ? 'green' : 'red';
  const size = status(attributes.QueueSize, 1000, 10000);

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Health Overview</Title>

        <DescriptionList isHorizontal>
          <DescriptionListGroup>
            <DescriptionListTerm>Memory</DescriptionListTerm>
            <DescriptionListDescription>
              {renderStatus(`${attributes.MemoryPercentUsage}%`, memory)}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Cursor</DescriptionListTerm>
            <DescriptionListDescription>
              {renderStatus(`${attributes.CursorPercentUsage}%`, cursor)}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Inflight</DescriptionListTerm>
            <DescriptionListDescription>
              {renderStatus(attributes.InflightCount, inflight)}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Consumers</DescriptionListTerm>
            <DescriptionListDescription>
              {renderStatus(attributes.ConsumerCount, consumers)}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Queue Size</DescriptionListTerm>
            <DescriptionListDescription>
              {renderStatus(attributes.QueueSize, size)}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardBody>
    </Card>
  );
};
