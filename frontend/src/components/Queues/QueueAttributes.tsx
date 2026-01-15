import React from 'react';
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
  DescriptionListDescription
} from '@patternfly/react-core';
import { ActiveMQQueueAttributes } from '../../types/activemq';

interface Props {
  attributes: ActiveMQQueueAttributes;
}

export const QueueAttributes: React.FC<Props> = ({ attributes }) => {
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const onToggle = (id: string) => {
    setExpanded(prev => (prev === id ? null : id));
  };

  const Section = (props: { id: string; title: string; children: React.ReactNode }) => (
    <AccordionItem>
      <AccordionToggle
        onClick={() => onToggle(props.id)}
        isExpanded={expanded === props.id}
        id={props.id}
      >
        {props.title}
      </AccordionToggle>
      <AccordionContent isHidden={expanded !== props.id}>
        <DescriptionList isHorizontal>{props.children}</DescriptionList>
      </AccordionContent>
    </AccordionItem>
  );

  const Row = (props: { label: string; value: any }) => (
    <DescriptionListGroup>
      <DescriptionListTerm>{props.label}</DescriptionListTerm>
      <DescriptionListDescription>{String(props.value)}</DescriptionListDescription>
    </DescriptionListGroup>
  );

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Accordion asDefinitionList>
          <Section id="runtime" title="Runtime">
            <Row label="Queue size" value={attributes.QueueSize} />
            <Row label="Enqueue count" value={attributes.EnqueueCount} />
            <Row label="Dequeue count" value={attributes.DequeueCount} />
            <Row label="Dispatch count" value={attributes.DispatchCount} />
            <Row label="In flight count" value={attributes.InflightCount} />
            <Row label="Consumer count" value={attributes.ConsumerCount} />
            <Row label="Producer count" value={attributes.ProducerCount} />
            <Row label="Paused" value={attributes.Paused} />
            <Row label="Stopped" value={attributes.Stopped} />
          </Section>

          <Section id="memory" title="Memory">
            <Row label="Memory limit" value={attributes.MemoryLimit} />
            <Row label="Memory usage bytes" value={attributes.MemoryUsageByteCount} />
            <Row label="Memory percent usage" value={attributes.MemoryPercentUsage} />
            <Row label="Memory usage portion" value={attributes.MemoryUsagePortion} />
            <Row label="Temp usage limit" value={attributes.TempUsageLimit} />
            <Row label="Temp usage percent" value={attributes.TempUsagePercentUsage} />
          </Section>

          <Section id="cursor" title="Cursor">
            <Row label="Cursor full" value={attributes.CursorFull} />
            <Row label="Cursor memory usage" value={attributes.CursorMemoryUsage} />
            <Row label="Cursor percent usage" value={attributes.CursorPercentUsage} />
            <Row label="Store message size" value={attributes.StoreMessageSize} />
            <Row label="Max page size" value={attributes.MaxPageSize} />
          </Section>

          <Section id="audit" title="Audit">
            <Row label="Max audit depth" value={attributes.MaxAuditDepth} />
            <Row label="Max producers to audit" value={attributes.MaxProducersToAudit} />
            <Row label="Duplicate from store count" value={attributes.DuplicateFromStoreCount} />
            <Row label="Send duplicate from store to DLQ" value={attributes.SendDuplicateFromStoreToDLQ} />
            <Row label="Max uncommitted exceeded count" value={attributes.MaxUncommittedExceededCount} />
          </Section>

          <Section id="msgsize" title="Message Size Stats">
            <Row label="Average message size" value={attributes.AverageMessageSize} />
            <Row label="Max message size" value={attributes.MaxMessageSize} />
            <Row label="Min message size" value={attributes.MinMessageSize} />
          </Section>

          <Section id="enqtime" title="Enqueue Time Stats">
            <Row label="Average enqueue time" value={attributes.AverageEnqueueTime} />
            <Row label="Max enqueue time" value={attributes.MaxEnqueueTime} />
            <Row label="Min enqueue time" value={attributes.MinEnqueueTime} />
          </Section>

          <Section id="dlq" title="DLQ">
            <Row label="DLQ" value={attributes.Dlq} />
            <Row label="Options" value={attributes.Options} />
          </Section>

          <Section id="network" title="Network">
            <Row label="Network enqueues" value={attributes.NetworkEnqueues} />
            <Row label="Network dequeues" value={attributes.NetworkDequeues} />
          </Section>

          <Section id="groups" title="Message Groups">
            <Row label="Message group type" value={attributes.MessageGroupType} />
            <Row label="Message groups" value={JSON.stringify(attributes.MessageGroups)} />
          </Section>

          <Section id="misc" title="Misc">
            <Row label="Use cache" value={attributes.UseCache} />
            <Row label="Cache enabled" value={attributes.CacheEnabled} />
            <Row label="Prioritized messages" value={attributes.PrioritizedMessages} />
            <Row label="Producer flow control" value={attributes.ProducerFlowControl} />
            <Row label="Slow consumer strategy" value={attributes.SlowConsumerStrategy} />
            <Row label="Subscriptions" value={JSON.stringify(attributes.Subscriptions)} />
          </Section>
        </Accordion>
      </CardBody>
    </Card>
  );
};
