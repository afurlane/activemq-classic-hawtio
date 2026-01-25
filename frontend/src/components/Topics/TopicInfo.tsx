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

import { ActiveMQTopicAttributes } from '../../types/activemq'

interface Props {
  attrs: ActiveMQTopicAttributes
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

export const TopicInfo: React.FC<Props> = ({ attrs }) => {
  const items = [
    { label: 'Producers', value: attrs.ProducerCount },
    { label: 'Subscribers', value: attrs.ConsumerCount },
    { label: 'Enqueued', value: attrs.EnqueueCount },
    { label: 'Dequeued', value: attrs.DequeueCount },
    { label: 'Dispatched', value: attrs.DispatchCount },
    { label: 'Memory Usage (%)', value: `${attrs.MemoryPercentUsage}%` },
    { label: 'Memory Used', value: formatBytes(attrs.MemoryUsageByteCount) },
    { label: 'Memory Limit', value: formatBytes(attrs.MemoryLimit) }
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
