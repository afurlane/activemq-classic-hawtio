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

  /* ────────────────────────────────────────────────
     VALUE FORMATTER
     ──────────────────────────────────────────────── */

  const formatValue = (value: any, label: string) => {
    if (value === undefined || value === null) return '—'

    // Booleani con icone PF5
    if (typeof value === 'boolean') {
      return value ? (
        <Label color="green" icon={<CheckCircleIcon />}>Yes</Label>
      ) : (
        <Label color="red" icon={<TimesCircleIcon />}>No</Label>
      )
    }

    // Numeri con highlight dinamico
    if (typeof value === 'number') {
      if (label.toLowerCase().includes('expired') && value > 1000) {
        return (
          <Label color="orange" icon={<ExclamationTriangleIcon />}>
            {value.toLocaleString()}
          </Label>
        )
      }

      if (label.toLowerCase().includes('redelivered') && value > 1000) {
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

  /* ────────────────────────────────────────────────
     DECLARATIVE ROWS
     ──────────────────────────────────────────────── */

  const rows = [
    { label: 'Is DLQ', value: queue.state.dlq },
    { label: 'Expired Messages', value: queue.stats.expired },
    { label: 'Redelivered Messages', value: queue.stats.redelivered }
  ]

  /* ──────────────────────────────────────────────── */

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">DLQ / Redelivery</Title>

        <DescriptionList isHorizontal>
          {rows.map((r, i) => (
            <DescriptionListGroup key={i}>
              <DescriptionListTerm>{r.label}</DescriptionListTerm>
              <DescriptionListDescription>
                {formatValue(r.value, r.label)}
              </DescriptionListDescription>
            </DescriptionListGroup>
          ))}
        </DescriptionList>
      </CardBody>
    </Card>
  )
}
