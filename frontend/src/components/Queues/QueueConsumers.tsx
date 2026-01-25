import React from 'react'
import {
  Card,
  CardBody,
  Title,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Label,
  Flex,
  FlexItem
} from '@patternfly/react-core'

import {
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
  ExclamationTriangleIcon
} from '@patternfly/react-icons'

import { Queue } from '../../types/domain'

interface Props {
  queue: Queue
  history: Queue[]
}

export const QueueConsumers: React.FC<Props> = ({ queue, history }) => {
  const latest = queue
  const prev = history.length >= 2 ? history.at(-2)! : null

  /* ────────────────────────────────────────────────
     DISPATCH RATE (msg/sec)
     ──────────────────────────────────────────────── */

  const dispatchRate = prev
    ? (latest.stats.dequeue - prev.stats.dequeue) / 2
    : 0

  const dispatchTrend =
    !prev
      ? 'flat'
      : dispatchRate > 0
      ? 'up'
      : dispatchRate < 0
      ? 'down'
      : 'flat'

  const trendIcon =
    dispatchTrend === 'up' ? (
      <ArrowUpIcon color="var(--pf-v5-global--success-color--100)" />
    ) : dispatchTrend === 'down' ? (
      <ArrowDownIcon color="var(--pf-v5-global--danger-color--100)" />
    ) : (
      <MinusIcon color="var(--pf-v5-global--palette--black-500)" />
    )

  /* ────────────────────────────────────────────────
     PREFETCH VALUES
     ──────────────────────────────────────────────── */

  const prefetchValues =
    latest.subscriptions?.map(s => s.flow.prefetchSize).filter(Boolean) ?? []

  /* ────────────────────────────────────────────────
     HIGHLIGHT DINAMICO
     ──────────────────────────────────────────────── */

  const inflightLabel =
    latest.stats.inflight > 500 ? (
      <Label color="orange" icon={<ExclamationTriangleIcon />}>
        {latest.stats.inflight.toLocaleString()}
      </Label>
    ) : (
      latest.stats.inflight.toLocaleString()
    )

  /* ──────────────────────────────────────────────── */

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Consumers</Title>

        <DescriptionList isHorizontal>

          {/* ACTIVE CONSUMERS */}
          <DescriptionListGroup>
            <DescriptionListTerm>Active Consumers</DescriptionListTerm>
            <DescriptionListDescription>
              {latest.consumers.toLocaleString()}
            </DescriptionListDescription>
          </DescriptionListGroup>

          {/* INFLIGHT */}
          <DescriptionListGroup>
            <DescriptionListTerm>Inflight</DescriptionListTerm>
            <DescriptionListDescription>
              {inflightLabel}
            </DescriptionListDescription>
          </DescriptionListGroup>

          {/* DISPATCH RATE */}
          <DescriptionListGroup>
            <DescriptionListTerm>Dispatch Rate</DescriptionListTerm>
            <DescriptionListDescription>
              <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                <FlexItem>{dispatchRate.toFixed(1)} msg/s</FlexItem>
                <FlexItem>{trendIcon}</FlexItem>
              </Flex>
            </DescriptionListDescription>
          </DescriptionListGroup>

          {/* PREFETCH */}
          {prefetchValues.length > 0 && (
            <DescriptionListGroup>
              <DescriptionListTerm>Prefetch</DescriptionListTerm>
              <DescriptionListDescription>
                {prefetchValues.join(', ')}
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}

        </DescriptionList>
      </CardBody>
    </Card>
  )
}
