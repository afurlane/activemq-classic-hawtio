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

const formatBytes = (bytes: number) => {
  if (bytes === undefined || bytes === null) return '—'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let i = 0
  let value = bytes
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024
    i++
  }
  return `${value.toFixed(1)} ${units[i]}`
}

type Severity = 'green' | 'orange' | 'red'

const severityForPercent = (percent: number): Severity => {
  if (percent < 60) return 'green'
  if (percent < 80) return 'orange'
  return 'red'
}

const icons: Record<Severity, React.ReactNode> = {
  green: <CheckCircleIcon />,
  orange: <ExclamationTriangleIcon />,
  red: <ExclamationCircleIcon />
}

const renderPercentLabel = (percent: number) => {
  const sev = severityForPercent(percent)
  return (
    <Label color={sev} icon={icons[sev]}>
      {percent}%
    </Label>
  )
}

export const QueueStorage: React.FC<Props> = ({ queue }) => {
  const items = [
    {
      label: 'Memory Limit',
      value: formatBytes(queue.memory.limit)
    },
    {
      label: 'Memory Usage',
      value: formatBytes(queue.memory.usageBytes)
    },
    {
      label: 'Memory Usage (%)',
      value: renderPercentLabel(queue.memory.percent)
    }
  ]

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Storage</Title>

        <DescriptionList isHorizontal>
          {items.map((item, i) => (
            <DescriptionListGroup key={i}>
              <DescriptionListTerm>{item.label}</DescriptionListTerm>
              <DescriptionListDescription>{item.value}</DescriptionListDescription>
            </DescriptionListGroup>
          ))}
        </DescriptionList>
      </CardBody>
    </Card>
  )
}
