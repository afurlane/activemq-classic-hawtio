import React from 'react'
import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'
import { useQueues } from '../../hooks/useQueues'

import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Alert,
  AlertGroup,
  Label
} from '@patternfly/react-core'

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon
} from '@patternfly/react-icons'

export const BrokerAlerts: React.FC = () => {
  const brokerName = useSelectedBrokerName()

  if (!brokerName) {
    return (
      <Card isFlat isCompact>
        <CardBody>
          <Alert variant="danger" title="No broker selected" isInline />
        </CardBody>
      </Card>
    )
  }

  // SWR: carica tutte le queue
  const { data: queues = [], error, isLoading } = useQueues(brokerName)

  // Calcolo alert (funzione pura)
  const computeAlerts = () => {
    if (!queues || queues.length === 0) return []

    let totalLag = 0
    let totalInflight = 0
    let consumers = 0
    let memorySum = 0

    queues.forEach(q => {
      const inflight = q.stats.inflight ?? 0
      const size = q.size ?? 0

      totalLag += size - inflight
      totalInflight += inflight
      consumers += q.consumers
      memorySum += q.memory.percent
    })

    const avgMemory = memorySum / queues.length

    const alerts: string[] = []

    if (avgMemory > 80) alerts.push(`High average memory: ${avgMemory.toFixed(1)}%`)
    if (totalLag > 50000) alerts.push(`High global lag: ${totalLag}`)
    if (totalInflight > 10000) alerts.push(`Too many inflight messages: ${totalInflight}`)
    if (consumers === 0) alerts.push(`No active consumers in the broker`)

    return alerts
  }

  const alerts = computeAlerts()

  const severity =
    alerts.length === 0
      ? 'green'
      : alerts.length < 3
      ? 'orange'
      : 'red'

  const severityLabel =
    severity === 'green'
      ? 'Healthy'
      : severity === 'orange'
      ? 'Warnings'
      : 'Critical'

  const severityIcon =
    severity === 'green'
      ? <CheckCircleIcon />
      : severity === 'orange'
      ? <ExclamationTriangleIcon />
      : <ExclamationCircleIcon />

  return (
    <Card isFlat isCompact>
      <CardHeader>
        <CardTitle>Broker Alerts</CardTitle>
        <Label color={severity} icon={severityIcon} style={{ marginLeft: 'auto' }}>
          {severityLabel}
        </Label>
      </CardHeader>

      <CardBody>

        {isLoading && (
          <Alert variant="info" title="Loading alerts…" isInline />
        )}

        {error && (
          <Alert variant="danger" title="Failed to load broker data" isInline />
        )}

        {!isLoading && !error && alerts.length === 0 && (
          <Alert variant="success" title="No global alerts" isInline />
        )}

        {!isLoading && !error && alerts.length > 0 && (
          <AlertGroup isLiveRegion>
            {alerts.map((a, i) => (
              <Alert key={i} variant="danger" title={a} isInline />
            ))}
          </AlertGroup>
        )}

      </CardBody>
    </Card>
  )
}
