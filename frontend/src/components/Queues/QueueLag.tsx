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

export const QueueLag: React.FC<Props> = ({ attributes }) => {
  const lag = attributes.QueueSize - attributes.InflightCount;

  let severity: 'green' | 'yellow' | 'red' = 'green';
  if (lag > 1000) severity = 'yellow';
  if (lag > 10000) severity = 'red';

  const renderLabel = () => {
    if (severity === 'green') {
      return (
        <Label color="green" icon={<CheckCircleIcon />}>
          {lag}
        </Label>
      );
    }
    if (severity === 'yellow') {
      return (
        <Label color="orange" icon={<ExclamationTriangleIcon />}>
          {lag}
        </Label>
      );
    }
    return (
      <Label color="red" icon={<ExclamationCircleIcon />}>
        {lag}
      </Label>
    );
  };

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Consumer Lag</Title>

        <DescriptionList isHorizontal>
          <DescriptionListGroup>
            <DescriptionListTerm>Lag</DescriptionListTerm>
            <DescriptionListDescription>
              {renderLabel()}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardBody>
    </Card>
  );
};
