import React from 'react'
import {
  Card,
  CardBody,
  Accordion,
  AccordionItem,
  AccordionToggle,
  AccordionContent,
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

export const QueueAttributes: React.FC<Props> = ({ queue }) => {
  const [expanded, setExpanded] = React.useState<string>('runtime')

  const onToggle = (id: string) => {
    setExpanded(prev => (prev === id ? '' : id))
  }

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

    // Numeri con formattazione
    if (typeof value === 'number') {
      // Highlight dinamico per valori critici
      if (label.toLowerCase().includes('percent') && value > 80) {
        return (
          <Label color="red" icon={<ExclamationTriangleIcon />}>
            {value.toLocaleString()}%
          </Label>
        )
      }

      return value.toLocaleString()
    }

    return String(value)
  }

  const Row = ({ label, value }: { label: string; value: any }) => (
    <DescriptionListGroup>
      <DescriptionListTerm>{label}</DescriptionListTerm>
      <DescriptionListDescription>
        {formatValue(value, label)}
      </DescriptionListDescription>
    </DescriptionListGroup>
  )

  const Section = ({
    id,
    title,
    rows
  }: {
    id: string
    title: string
    rows: { label: string; value: any }[]
  }) => (
    <AccordionItem>
      <AccordionToggle
        onClick={() => onToggle(id)}
        isExpanded={expanded === id}
        id={id}
      >
        {title}
      </AccordionToggle>

      <AccordionContent isHidden={expanded !== id}>
        <DescriptionList isHorizontal>
          {rows.map((r, i) => (
            <Row key={i} label={r.label} value={r.value} />
          ))}
        </DescriptionList>
      </AccordionContent>
    </AccordionItem>
  )

  const sections = [
    {
      id: 'runtime',
      title: 'Runtime',
      rows: [
        { label: 'Queue size', value: queue.size },
        { label: 'Enqueue count', value: queue.stats.enqueue },
        { label: 'Dequeue count', value: queue.stats.dequeue },
        { label: 'Expired', value: queue.stats.expired },
        { label: 'In flight', value: queue.stats.inflight },
        { label: 'Consumers', value: queue.consumers },
        { label: 'Producers', value: queue.producers },
        { label: 'Paused', value: queue.state.paused },
        { label: 'Stopped', value: queue.state.stopped },
        { label: 'DLQ', value: queue.state.dlq }
      ]
    },
    {
      id: 'memory',
      title: 'Memory',
      rows: [
        { label: 'Memory limit', value: queue.memory.limit },
        { label: 'Memory usage bytes', value: queue.memory.usageBytes },
        { label: 'Memory percent usage', value: queue.memory.percent }
      ]
    },
    {
      id: 'dlq',
      title: 'DLQ',
      rows: [
        { label: 'DLQ enabled', value: queue.state.dlq }
      ]
    },
    {
      id: 'misc',
      title: 'Misc',
      rows: [
        { label: 'MBean', value: queue.mbean },
        { label: 'Name', value: queue.name }
      ]
    }
  ]

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Accordion asDefinitionList>
          {sections.map(s => (
            <Section key={s.id} id={s.id} title={s.title} rows={s.rows} />
          ))}
        </Accordion>
      </CardBody>
    </Card>
  )
}
