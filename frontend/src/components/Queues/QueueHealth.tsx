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

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon
} from '@patternfly/react-icons'

import { Queue } from '../../types/domain'

interface Props {
  queue: Queue
}

type Severity = 'green' | 'yellow' | 'red'

const status = (value: number, green: number, yellow: number): Severity => {
  if (value < green) return 'green'
  if (value < yellow) return 'yellow'
  return 'red'
}

const renderStatus = (value: React.ReactNode, severity: Severity) => {
  switch (severity) {
    case 'green':
      return (
        <Label color="green" icon={<CheckCircleIcon />}>
          {value}
        </Label>
      )
    case 'yellow':
      return (
        <Label color="orange" icon={<ExclamationTriangleIcon />}>
          {value}
        </Label>
      )
    case 'red':
    default:
      return (
        <Label color="red" icon={<ExclamationCircleIcon />}>
          {value}
        </Label>
      )
  }
}

export const QueueHealth: React.FC<Props> = ({ queue }) => {
  const memory = status(queue.memory.percent, 60, 80)
  const inflight = status(queue.stats.inflight, 100, 500)
  const consumers: Severity = queue.consumers > 0 ? 'green' : 'red'
  const size = status(queue.size, 1000, 10000)

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Health Overview</Title>

        <DescriptionList isHorizontal>

          <DescriptionListGroup>
            <DescriptionListTerm>Memory</DescriptionListTerm>
            <DescriptionListDescription>
              {renderStatus(`${queue.memory.percent}%`, memory)}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Inflight</DescriptionListTerm>
            <DescriptionListDescription>
              {renderStatus(queue.stats.inflight, inflight)}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Consumers</DescriptionListTerm>
            <DescriptionListDescription>
              {renderStatus(queue.consumers, consumers)}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Queue Size</DescriptionListTerm>
            <DescriptionListDescription>
              {renderStatus(queue.size, size)}
            </DescriptionListDescription>
          </DescriptionListGroup>

        </DescriptionList>
      </CardBody>
    </Card>
  )
}
