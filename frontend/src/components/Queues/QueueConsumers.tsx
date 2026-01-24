import React from 'react'
import {
  Card,
  CardBody,
  Title,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Label
} from '@patternfly/react-core'

import { Queue } from '../../types/domain'

interface Props {
  queue: Queue
  history: Queue[]
}

export const QueueConsumers: React.FC<Props> = ({ queue, history }) => {

  // Se non ci sono abbastanza dati storici, evitiamo errori
  const prev = history.length >= 2 ? history[history.length - 2] : null
  const latest = queue

  // Dispatch rate (msg/sec)
  const dispatchRate = prev
    ? (latest.stats.dequeue - prev.stats.dequeue) / 2
    : 0

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
