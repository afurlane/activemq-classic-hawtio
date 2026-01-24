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
  if (!bytes && bytes !== 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let i = 0
  let value = bytes
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024
    i++
  }
  return `${value.toFixed(1)} ${units[i]}`
}

const severityForPercent = (percent: number) => {
  if (percent < 60) return 'green'
  if (percent < 80) return 'orange'
  return 'red'
}

const renderPercentLabel = (percent: number) => {
  const sev = severityForPercent(percent)
  if (sev === 'green') {
    return (
      <Label color="green" icon={<CheckCircleIcon />}>
        {percent}%
      </Label>
    )
  }
  if (sev === 'orange') {
    return (
      <Label color="orange" icon={<ExclamationTriangleIcon />}>
        {percent}%
      </Label>
    )
  }
  return (
    <Label color="red" icon={<ExclamationCircleIcon />}>
      {percent}%
    </Label>
  )
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
              {formatBytes(queue.memory.limit)}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Memory Usage</DescriptionListTerm>
            <DescriptionListDescription>
              {formatBytes(queue.memory.usageBytes)}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Memory Usage (%)</DescriptionListTerm>
            <DescriptionListDescription>
              {renderPercentLabel(queue.memory.percent)}
            </DescriptionListDescription>
          </DescriptionListGroup>

        </DescriptionList>
      </CardBody>
    </Card>
  )
}
