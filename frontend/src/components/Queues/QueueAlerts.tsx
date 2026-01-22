import React from 'react'
import {
  Card,
  CardBody,
  Title,
  Alert,
  AlertGroup
} from '@patternfly/react-core'

import { Queue } from '../../types/domain'

interface Props {
  queue: Queue
  history: Queue[]
}

export const QueueAlerts: React.FC<Props> = ({ queue, history }) => {
  const alerts: string[] = []

  const lag = queue.size - queue.stats.inflight

  // Memory
  if (queue.memory.percent > 80)
    alerts.push(`High memory usage: ${queue.memory.percent}%`)

  // Consumers
  if (queue.consumers === 0)
    alerts.push(`No active consumers`)

  // Lag
  if (lag > 10000)
    alerts.push(`High consumer lag: ${lag} messages`)

  // Inflight
  if (queue.stats.inflight > 500)
    alerts.push(`Too many inflight messages: ${queue.stats.inflight}`)

  // Queue size
  if (queue.size > 10000)
    alerts.push(`Queue backlog growing: ${queue.size} messages`)

  // Dispatch stall (domain model)
  if (history.length > 2) {
    const latest = history.at(-1)
    const prev = history.at(-2)

    if (latest && prev) {
      const enqueueDelta = latest.stats.enqueue - prev.stats.enqueue
      const dispatchDelta = latest.stats.dequeue - prev.stats.dequeue

      if (enqueueDelta > 0 && dispatchDelta === 0)
        alerts.push(`Messages enqueued but not dispatched`)
    }
  }

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Alerts</Title>

        {alerts.length === 0 && (
          <Alert
            variant="success"
            title="No alerts"
            isInline
          />
        )}

        {alerts.length > 0 && (
          <AlertGroup isLiveRegion>
            {alerts.map((a, i) => (
              <Alert
                key={i}
                variant="danger"
                title={a}
                isInline
              />
            ))}
          </AlertGroup>
        )}
      </CardBody>
    </Card>
  )
}
