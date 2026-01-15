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

export const TopicInfo: React.FC<{ attrs: any }> = ({ attrs }) => {
  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Info</Title>

        <DescriptionList isHorizontal>
          <DescriptionListGroup>
            <DescriptionListTerm>Producers</DescriptionListTerm>
            <DescriptionListDescription>
              {attrs.ProducerCount}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Subscribers</DescriptionListTerm>
            <DescriptionListDescription>
              {attrs.ConsumerCount}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Queue Size</DescriptionListTerm>
            <DescriptionListDescription>
              {attrs.QueueSize}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Memory Usage</DescriptionListTerm>
            <DescriptionListDescription>
              {attrs.MemoryPercentUsage}%
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Store Size</DescriptionListTerm>
            <DescriptionListDescription>
              {attrs.StoreMessageSize}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Temp Usage</DescriptionListTerm>
            <DescriptionListDescription>
              {attrs.TempUsagePercentUsage}%
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardBody>
    </Card>
  );
};
