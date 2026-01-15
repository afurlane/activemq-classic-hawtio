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

export const QueueStorage: React.FC<Props> = ({ attributes }) => {
  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Storage</Title>

        <DescriptionList isHorizontal>
          <DescriptionListGroup>
            <DescriptionListTerm>Store Message Size</DescriptionListTerm>
            <DescriptionListDescription>
              {attributes.StoreMessageSize} bytes
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Temp Usage</DescriptionListTerm>
            <DescriptionListDescription>
              {attributes.TempUsagePercentUsage}%
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Cursor Memory Usage</DescriptionListTerm>
            <DescriptionListDescription>
              {attributes.CursorMemoryUsage} bytes
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Total Memory Usage</DescriptionListTerm>
            <DescriptionListDescription>
              {attributes.MemoryUsageByteCount} bytes
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardBody>
    </Card>
  );
};
