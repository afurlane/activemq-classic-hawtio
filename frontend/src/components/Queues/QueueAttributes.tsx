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

import { Queue } from '../../types/domain'

interface Props {
  queue: Queue
}

export const QueueAttributes: React.FC<Props> = ({ queue }) => {
  const [expanded, setExpanded] = React.useState<string | null>(null)

  const onToggle = (id: string) => {
    setExpanded(prev => (prev === id ? null : id))
  }

  const Section: React.FC<{
    id: string
    title: string
    children: React.ReactNode
  }> = ({ id, title, children }) => (
    <AccordionItem>
      <AccordionToggle
        onClick={() => onToggle(id)}
        isExpanded={expanded === id}
        id={id}
      >
        {title}
      </AccordionToggle>

      <AccordionContent isHidden={expanded !== id}>
        <DescriptionList isHorizontal>{children}</DescriptionList>
      </AccordionContent>
    </AccordionItem>
  )

  const Row: React.FC<{ label: string; value: any }> = ({ label, value }) => (
    <DescriptionListGroup>
      <DescriptionListTerm>{label}</DescriptionListTerm>
      <DescriptionListDescription>
        {value === undefined
          ? '—'
          : typeof value === 'boolean'
          ? value
            ? <Label color="green">Yes</Label>
            : <Label color="red">No</Label>
          : String(value)}
      </DescriptionListDescription>
    </DescriptionListGroup>
  )

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Accordion asDefinitionList>

          {/* RUNTIME */}
          <Section id="runtime" title="Runtime">
            <Row label="Queue size" value={queue.size} />
            <Row label="Enqueue count" value={queue.stats.enqueue} />
            <Row label="Dequeue count" value={queue.stats.dequeue} />
            <Row label="Expired" value={queue.stats.expired} />
            <Row label="In flight" value={queue.stats.inflight} />
            <Row label="Consumers" value={queue.consumers} />
            <Row label="Producers" value={queue.producers} />
            <Row label="Paused" value={queue.state.paused} />
            <Row label="Stopped" value={queue.state.stopped} />
            <Row label="DLQ" value={queue.state.dlq} />
          </Section>

          {/* MEMORY */}
          <Section id="memory" title="Memory">
            <Row label="Memory limit" value={queue.memory.limit} />
            <Row label="Memory usage bytes" value={queue.memory.usageBytes} />
            <Row label="Memory percent usage" value={queue.memory.percent} />
          </Section>

          {/* DLQ */}
          <Section id="dlq" title="DLQ">
            <Row label="DLQ enabled" value={queue.state.dlq} />
          </Section>

          {/* MISC */}
          <Section id="misc" title="Misc">
            <Row label="MBean" value={queue.mbean} />
            <Row label="Name" value={queue.name} />
          </Section>

        </Accordion>
      </CardBody>
    </Card>
  )
}
