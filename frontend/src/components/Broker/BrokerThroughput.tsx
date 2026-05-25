import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Alert,
  Label
} from '@patternfly/react-core'

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon
} from '@patternfly/react-icons'

import type { BrokerMetrics, BrokerMetricsHistory } from '../../hooks/useBrokerMetrics'

interface Props {
  latest: BrokerMetrics
  history: BrokerMetricsHistory
}

const labelStyle = { marginLeft: 'auto' }

export const BrokerThroughput: React.FC<Props> = ({ latest, history }) => {
  if (!latest || !history) {
    return (
      <Card isFlat isCompact>
        <CardBody>
          <Alert variant="danger" title="No throughput data available" isInline />
        </CardBody>
      </Card>
    )
  }

  // Throughput rates (msg/sec)
  const enqueue = history.enqueueRate.at(-1) ?? 0
  const dequeue = history.dequeueRate.at(-1) ?? 0
  const dispatch = history.dispatchRate.at(-1) ?? 0

  // Severity logic (identica alla tua)
  const severity =
    enqueue > 5000 || dispatch > 5000
      ? 'green'
      : enqueue > 1000 || dispatch > 1000
      ? 'orange'
      : 'red'

  const severityLabel =
    severity === 'green'
      ? 'Healthy'
      : severity === 'orange'
      ? 'Warning'
      : 'Low Throughput'

  const severityIcon =
    severity === 'green'
      ? <CheckCircleIcon />
      : severity === 'orange'
      ? <ExclamationTriangleIcon />
      : <ExclamationCircleIcon />

  return (
    <Card isFlat isCompact>
      <CardHeader>
        <CardTitle>Broker Throughput (msg/sec)</CardTitle>
        <Label color={severity} icon={severityIcon} style={labelStyle}>
          {severityLabel}
        </Label>
      </CardHeader>

      <CardBody>
        <DescriptionList isHorizontal>

          <DescriptionListGroup>
            <DescriptionListTerm>Enqueue</DescriptionListTerm>
            <DescriptionListDescription>
              {enqueue.toFixed(1)}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Dequeue</DescriptionListTerm>
            <DescriptionListDescription>
              {dequeue.toFixed(1)}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Dispatch</DescriptionListTerm>
            <DescriptionListDescription>
              {dispatch.toFixed(1)}
            </DescriptionListDescription>
          </DescriptionListGroup>

        </DescriptionList>
      </CardBody>
    </Card>
  )
}
