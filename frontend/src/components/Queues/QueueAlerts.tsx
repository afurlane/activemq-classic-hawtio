import React, { useMemo } from 'react'
import {
  Card,
  CardBody,
  Title,
  Alert,
  AlertGroup,
  AlertVariant,
  Flex,
  FlexItem
} from '@patternfly/react-core'

import {
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@patternfly/react-icons'

import { Queue } from '../../types/domain'

interface Props {
  queue: Queue
  history: Queue[]
}

type AlertItem = {
  variant: AlertVariant
  title: string
  icon: React.ReactNode
  severity: number   // 0 = critical, 1 = warning, 2 = info, 3 = success
}

export const QueueAlerts: React.FC<Props> = ({ queue, history }) => {

  const alerts = useMemo(() => computeQueueAlerts(queue, history), [queue, history])

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Alerts</Title>

        {alerts.length === 0 && (
          <Alert
            variant="success"
            title="No alerts"
            isInline
            customIcon={<CheckCircleIcon />}
          />
        )}

        {alerts.length > 0 && (
          <AlertGroup isLiveRegion>
            {alerts.map((a, i) => (
              <Alert
                key={i}
                variant={a.variant}
                isInline
                customIcon={a.icon}
                title={
                  <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem>{a.icon}</FlexItem>
                    <FlexItem>{a.title}</FlexItem>
                  </Flex>
                }
              />
            ))}
          </AlertGroup>
        )}
      </CardBody>
    </Card>
  )
}

function computeQueueAlerts(queue: Queue, history: Queue[]): AlertItem[] {
  const alerts: AlertItem[] = []
  const lag = queue.size - queue.stats.inflight

  const push = (
    variant: AlertVariant,
    title: string,
    icon: React.ReactNode,
    severity: number
  ) => alerts.push({ variant, title, icon, severity })

  /* MEMORY */
  if (queue.memory.percent > 80) {
    push(
      AlertVariant.danger,
      `High memory usage: ${queue.memory.percent}%`,
      <ExclamationCircleIcon />,
      0
    )
  }

  /* NO CONSUMERS */
  if (queue.consumers === 0) {
    push(
      AlertVariant.warning,
      `No active consumers`,
      <ExclamationTriangleIcon />,
      1
    )
  }

  /* LAG */
  if (lag > 10000) {
    push(
      AlertVariant.danger,
      `High consumer lag: ${lag.toLocaleString()} messages`,
      <ExclamationCircleIcon />,
      0
    )
  }

  /* INFLIGHT */
  if (queue.stats.inflight > 500) {
    push(
      AlertVariant.warning,
      `Too many inflight messages: ${queue.stats.inflight.toLocaleString()}`,
      <ExclamationTriangleIcon />,
      1
    )
  }

  /* QUEUE SIZE */
  if (queue.size > 10000) {
    push(
      AlertVariant.warning,
      `Queue backlog growing: ${queue.size.toLocaleString()} messages`,
      <ExclamationTriangleIcon />,
      1
    )
  }

  /* DISPATCH STALL */
  if (history.length > 2) {
    const latest = history.at(-1)
    const prev = history.at(-2)

    if (latest && prev) {
      const enqueueDelta = latest.stats.enqueue - prev.stats.enqueue
      const dispatchDelta = latest.stats.dequeue - prev.stats.dequeue

      if (enqueueDelta > 0 && dispatchDelta === 0) {
        push(
          AlertVariant.danger,
          `Messages enqueued but not dispatched`,
          <ExclamationCircleIcon />,
          0
        )
      }
    }
  }

  /* ORDER BY SEVERITY */
  alerts.sort((a, b) => a.severity - b.severity)

  return alerts
}
