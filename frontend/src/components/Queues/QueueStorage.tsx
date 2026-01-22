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

import { Queue } from '../../types/domain'

interface Props {
  queue: Queue
}

export const QueueStorage: React.FC<Props> = ({ queue }) => {
  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Storage</Title>

        <DescriptionList isHorizontal>

          <DescriptionListGroup>
            <DescriptionListTerm>Memory Limit</DescriptionListTerm>
            <DescriptionListDescription>
              {queue.memory.limit} bytes
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Memory Usage</DescriptionListTerm>
            <DescriptionListDescription>
              {queue.memory.usageBytes} bytes
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Memory Usage (%)</DescriptionListTerm>
            <DescriptionListDescription>
              {queue.memory.percent}%
            </DescriptionListDescription>
          </DescriptionListGroup>

        </DescriptionList>
      </CardBody>
    </Card>
  )
}
