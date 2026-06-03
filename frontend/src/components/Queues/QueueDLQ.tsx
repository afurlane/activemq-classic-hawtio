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
  TimesCircleIcon,
  ExclamationTriangleIcon
} from '@patternfly/react-icons'

import { Queue } from '../../types/domain'

interface Props {
  queue: Queue
}

export const QueueDLQ: React.FC<Props> = ({ queue }) => {

  const formatValue = (value: any, key: string) => {
    if (value === undefined || value === null) return '—'

    if (typeof value === 'boolean') {
      return value ? (
        <Label color="green" icon={<CheckCircleIcon />}>Yes</Label>
      ) : (
        <Label color="red" icon={<TimesCircleIcon />}>No</Label>
      )
    }

    if (typeof value === 'number') {
      if (key === 'expired' && value > 1000) {
        return (
          <Label color="orange" icon={<ExclamationTriangleIcon />}>
            {value.toLocaleString()}
          </Label>
        )
      }

      if (key === 'redelivered' && value > 1000) {
        return (
          <Label color="red" icon={<ExclamationTriangleIcon />}>
            {value.toLocaleString()}
          </Label>
        )
      }

      return value.toLocaleString()
    }

    return String(value)
  }

  const rows = [
    { key: 'dlq', label: 'Is DLQ', value: queue.state.dlq },
    { key: 'expired', label: 'Expired Messages', value: queue.stats.expired },
    { key: 'redelivered', label: 'Redelivered Messages', value: queue.stats.redelivered }
  ]

  return (
    <Card isCompact>
      <CardBody>
        <Title headingLevel="h4">DLQ / Redelivery</Title>

        <DescriptionList isHorizontal>
          {rows.map((r) => (
            <DescriptionListGroup key={r.key}>
              <DescriptionListTerm>{r.label}</DescriptionListTerm>
              <DescriptionListDescription>
                {formatValue(r.value, r.key)}
              </DescriptionListDescription>
            </DescriptionListGroup>
          ))}
        </DescriptionList>
      </CardBody>
    </Card>
  )
}
