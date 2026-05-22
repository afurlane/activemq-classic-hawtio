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

import { TopicMetricsLatest } from 'src/hooks/useTopicMetrics'

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

const formatNullableNumber = (value: number | null | undefined) => {
  if (value === undefined || value === null) return '—'
  return value
}

export const TopicInfo: React.FC<{ latest: TopicMetricsLatest }> = ({ latest }) => {
  const items = [
    { label: 'Object Name', value: latest.objectName ?? '—' },
    { label: 'Producers', value: latest.producers },
    { label: 'Subscribers', value: latest.consumers },
    { label: 'Enqueued', value: latest.enqueue },
    { label: 'Dequeued', value: latest.dequeue },
    { label: 'Dispatched', value: latest.dispatch },
    { label: 'Memory Usage (%)', value: `${latest.memoryPercent}%` },
    { label: 'Memory Usage (bytes)', value: formatBytes(latest.memoryUsageBytes) },
    { label: 'Memory Limit', value: formatBytes(latest.memoryLimit) },
    { label: 'Avg Enqueue Time', value: formatNullableNumber(latest.averageEnqueueTime) },
    { label: 'Max Enqueue Time', value: formatNullableNumber(latest.maxEnqueueTime) },
    { label: 'Min Enqueue Time', value: formatNullableNumber(latest.minEnqueueTime) },
    { label: 'Avg Message Size', value: formatNullableNumber(latest.averageMessageSize) },
    { label: 'Max Message Size', value: formatNullableNumber(latest.maxMessageSize) },
    { label: 'Min Message Size', value: formatNullableNumber(latest.minMessageSize) },
    { label: 'Network Enqueues', value: formatNullableNumber(latest.networkEnqueues) },
    { label: 'Network Dequeues', value: formatNullableNumber(latest.networkDequeues) },
    { label: 'Options', value: latest.options ?? '—' }
  ]

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Info</Title>

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
