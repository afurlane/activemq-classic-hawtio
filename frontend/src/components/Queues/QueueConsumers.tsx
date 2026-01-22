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
  history: Queue[]
}

export const QueueConsumers: React.FC<Props> = ({ queue, history }) => {
  const latest = queue
  const prev = history[history.length - 2]

  // Dispatch rate (msg/sec)
  let dispatchRate = 0
  if (prev) {
    dispatchRate = (latest.stats.dequeue - prev.stats.dequeue) / 2
  }

  // Prefetch values from subscriptions
  const prefetchValues =
    latest.subscriptions?.map(s => s.flow.prefetchSize).filter(Boolean) ?? []

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Consumers</Title>

        <DescriptionList isHorizontal>

          <DescriptionListGroup>
            <DescriptionListTerm>Active Consumers</DescriptionListTerm>
            <DescriptionListDescription>
              {latest.consumers}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Inflight</DescriptionListTerm>
            <DescriptionListDescription>
              {latest.stats.inflight}
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
  )
}
