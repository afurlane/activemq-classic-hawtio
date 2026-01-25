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

const getSeverity = (value: number, green: number, yellow: number): Severity => {
  if (value < green) return 'green'
  if (value < yellow) return 'yellow'
  return 'red'
}

const renderStatus = (value: React.ReactNode, severity: Severity) => {
  const icons: Record<Severity, React.ReactNode> = {
    green: <CheckCircleIcon />,
    yellow: <ExclamationTriangleIcon />,
    red: <ExclamationCircleIcon />
  }

  const colors: Record<Severity, "green" | "red" | "orange"> = { green: "green", yellow: "orange", red: "red" }

  return (
    <Label color={colors[severity]} icon={icons[severity]}>
      {value}
    </Label>
  )
}

export const QueueHealth: React.FC<Props> = ({ queue }) => {
  const memory = getSeverity(queue.memory.percent, 60, 80)
  const inflight = getSeverity(queue.stats.inflight, 100, 500)
  const consumers: Severity = queue.consumers > 0 ? 'green' : 'red'
  const size = getSeverity(queue.size, 1000, 10000)

  const metrics = [
    {
      label: 'Memory',
      value: `${queue.memory.percent}%`,
      severity: memory
    },
    {
      label: 'Inflight',
      value: queue.stats.inflight.toLocaleString(),
      severity: inflight
    },
    {
      label: 'Consumers',
      value: queue.consumers.toLocaleString(),
      severity: consumers
    },
    {
      label: 'Queue Size',
      value: queue.size.toLocaleString(),
      severity: size
    }
  ]

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Health Overview</Title>

        <DescriptionList isHorizontal>
          {metrics.map((m, i) => (
            <DescriptionListGroup key={i}>
              <DescriptionListTerm>{m.label}</DescriptionListTerm>
              <DescriptionListDescription>
                {renderStatus(m.value, m.severity)}
              </DescriptionListDescription>
            </DescriptionListGroup>
          ))}
        </DescriptionList>
      </CardBody>
    </Card>
  )
}
