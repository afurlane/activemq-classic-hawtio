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
}

export const QueueDLQ: React.FC<Props> = ({ attributes }) => {
  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">DLQ / Redelivery</Title>

        <DescriptionList isHorizontal>
          <DescriptionListGroup>
            <DescriptionListTerm>Is DLQ</DescriptionListTerm>
            <DescriptionListDescription>
              {attributes.Dlq ? 'Yes' : 'No'}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Expired Messages</DescriptionListTerm>
            <DescriptionListDescription>
              {attributes.ExpiredCount}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Redelivered Messages</DescriptionListTerm>
            <DescriptionListDescription>
              {attributes.RedeliveredCount ?? 'N/A'}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Duplicate From Store</DescriptionListTerm>
            <DescriptionListDescription>
              {attributes.DuplicateFromStoreCount}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Send Duplicate To DLQ</DescriptionListTerm>
            <DescriptionListDescription>
              {attributes.SendDuplicateFromStoreToDLQ ? 'Yes' : 'No'}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardBody>
    </Card>
  );
};
