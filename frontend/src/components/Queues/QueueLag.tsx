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

export const QueueLag: React.FC<Props> = ({ queue }) => {
  const lag = queue.size - queue.stats.inflight

  const severity: Severity =
    lag > 10000 ? 'red' :
    lag > 1000  ? 'yellow' :
                  'green'

  const renderLabel = (value: number, sev: Severity) => {
    switch (sev) {
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

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Consumer Lag</Title>

        <DescriptionList isHorizontal>
          <DescriptionListGroup>
            <DescriptionListTerm>Lag</DescriptionListTerm>
            <DescriptionListDescription>
              {renderLabel(lag, severity)}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardBody>
    </Card>
  )
}
