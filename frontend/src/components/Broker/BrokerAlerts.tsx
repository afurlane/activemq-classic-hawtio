import React from 'react'
import {
  Card, CardHeader, CardTitle, CardBody,
  Alert, AlertGroup, Label
} from '@patternfly/react-core'

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon
} from '@patternfly/react-icons'

import type { BrokerMetrics, BrokerMetricsHistory } from '../../hooks/useBrokerMetrics'

const LABEL_STYLE = { marginLeft: 'auto' }

const ICONS = {
  green: <CheckCircleIcon />,
  orange: <ExclamationTriangleIcon />,
  red: <ExclamationCircleIcon />
}

interface Props {
  latest: BrokerMetrics
  history: BrokerMetricsHistory
}

export const BrokerAlerts: React.FC<Props> = ({ latest, history }) => {
  if (!latest || !history) {
    return (
      <Card isFlat isCompact>
        <CardBody>
          <Alert variant="info" title="Loading alerts…" isInline />
        </CardBody>
      </Card>
    )
  }

  const alerts: string[] = []

  if (latest.avgMemory > 80)
    alerts.push(`High average memory: ${latest.avgMemory.toFixed(1)}%`)

  if (latest.totalLag > 50000)
    alerts.push(`High global lag: ${latest.totalLag.toLocaleString()}`)

  if (latest.totalInflight > 10000)
    alerts.push(`Too many inflight messages: ${latest.totalInflight.toLocaleString()}`)

  if (latest.consumers === 0)
    alerts.push(`No active consumers in the broker`)

  const severity =
    alerts.length === 0 ? 'green'
    : alerts.length < 3 ? 'orange'
    : 'red'

  const severityLabel =
    severity === 'green' ? 'Healthy'
    : severity === 'orange' ? 'Warnings'
    : 'Critical'

  const severityIcon = ICONS[severity]

  return (
    <Card isFlat isCompact>
      <CardHeader>
        <CardTitle>Broker Alerts</CardTitle>
        <Label color={severity} icon={severityIcon} style={LABEL_STYLE}>
          {severityLabel}
        </Label>
      </CardHeader>

      <CardBody>
        {alerts.length === 0 && (
          <Alert variant="success" title="No global alerts" isInline />
        )}

        {alerts.length > 0 && (
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
