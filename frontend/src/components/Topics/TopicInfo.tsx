import React from 'react'
import {
  Card,
  CardBody,
  Title,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription
} from '@patternfly/react-core'

import { ActiveMQTopicAttributes } from '../../types/activemq'

export const TopicInfo: React.FC<{ attrs: ActiveMQTopicAttributes }> = ({ attrs }) => {
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
            <DescriptionListTerm>Enqueued</DescriptionListTerm>
            <DescriptionListDescription>
              {attrs.EnqueueCount}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Dequeued</DescriptionListTerm>
            <DescriptionListDescription>
              {attrs.DequeueCount}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Dispatched</DescriptionListTerm>
            <DescriptionListDescription>
              {attrs.DispatchCount}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Memory Usage</DescriptionListTerm>
            <DescriptionListDescription>
              {attrs.MemoryPercentUsage}%
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Memory Used</DescriptionListTerm>
            <DescriptionListDescription>
              {attrs.MemoryUsageByteCount} bytes
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Memory Limit</DescriptionListTerm>
            <DescriptionListDescription>
              {attrs.MemoryLimit} bytes
            </DescriptionListDescription>
          </DescriptionListGroup>

        </DescriptionList>
      </CardBody>
    </Card>
  )
}
