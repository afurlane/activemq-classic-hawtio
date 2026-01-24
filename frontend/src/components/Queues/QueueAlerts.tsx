import React from 'react'
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
  InfoCircleIcon,
  CheckCircleIcon
} from '@patternfly/react-icons'

import { Queue } from '../../types/domain'

interface Props {
  queue: Queue
  history: Queue[]
}

export const QueueAlerts: React.FC<Props> = ({ queue, history }) => {

  type AlertItem = {
    variant: AlertVariant
    title: string
    icon: React.ReactNode
  }

  const alerts: AlertItem[] = []

  const lag = queue.size - queue.stats.inflight

  // Memory
  if (queue.memory.percent > 80) {
    alerts.push({
      variant: AlertVariant.danger,
      title: `High memory usage: ${queue.memory.percent}%`,
      icon: <ExclamationCircleIcon />
    })
  }

  // Consumers
  if (queue.consumers === 0) {
    alerts.push({
      variant: AlertVariant.warning,
      title: `No active consumers`,
      icon: <ExclamationTriangleIcon />
    })
  }

  // Lag
  if (lag > 10000) {
    alerts.push({
      variant: AlertVariant.danger,
      title: `High consumer lag: ${lag} messages`,
      icon: <ExclamationCircleIcon />
    })
  }

  // Inflight
  if (queue.stats.inflight > 500) {
    alerts.push({
      variant: AlertVariant.warning,
      title: `Too many inflight messages: ${queue.stats.inflight}`,
      icon: <ExclamationTriangleIcon />
    })
  }

  // Queue size
  if (queue.size > 10000) {
    alerts.push({
      variant: AlertVariant.warning,
      title: `Queue backlog growing: ${queue.size} messages`,
      icon: <ExclamationTriangleIcon />
    })
  }

  // Dispatch stall
  if (history.length > 2) {
    const latest = history.at(-1)
    const prev = history.at(-2)

    if (latest && prev) {
      const enqueueDelta = latest.stats.enqueue - prev.stats.enqueue
      const dispatchDelta = latest.stats.dequeue - prev.stats.dequeue

      if (enqueueDelta > 0 && dispatchDelta === 0) {
        alerts.push({
          variant: AlertVariant.danger,
          title: `Messages enqueued but not dispatched`,
          icon: <ExclamationCircleIcon />
        })
      }
    }
  }

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Alerts</Title>

        {alerts.length === 0 && (
          <Alert
            variant={AlertVariant.success}
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
                title={
                  <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem>{a.icon}</FlexItem>
                    <FlexItem>{a.title}</FlexItem>
                  </Flex>
                }
                isInline
                customIcon={a.icon}
              />
            ))}
          </AlertGroup>
        )}
      </CardBody>
    </Card>
  )
}
