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

export const QueueDLQ: React.FC<Props> = ({ queue }) => {
  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">DLQ / Redelivery</Title>

        <DescriptionList isHorizontal>

          <DescriptionListGroup>
            <DescriptionListTerm>Is DLQ</DescriptionListTerm>
            <DescriptionListDescription>
              {queue.state.dlq ? 'Yes' : 'No'}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Expired Messages</DescriptionListTerm>
            <DescriptionListDescription>
              {queue.stats.expired}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Redelivered Messages</DescriptionListTerm>
            <DescriptionListDescription>
              {queue.stats.redelivered ?? 'N/A'}
            </DescriptionListDescription>
          </DescriptionListGroup>

        </DescriptionList>
      </CardBody>
    </Card>
  )
}
