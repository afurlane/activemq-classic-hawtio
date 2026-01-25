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

import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'
import { useBrokerThroughputRates } from '../../hooks/useBrokerThroughputRates'

export const BrokerThroughput: React.FC = () => {
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

  const rates = useBrokerThroughputRates(brokerName)

  const severity =
    rates.enqueue > 5000 || rates.dispatch > 5000
      ? 'green'
      : rates.enqueue > 1000 || rates.dispatch > 1000
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
        <Label color={severity} icon={severityIcon} style={{ marginLeft: 'auto' }}>
          {severityLabel}
        </Label>
      </CardHeader>

      <CardBody>
        <DescriptionList isHorizontal>

          <DescriptionListGroup>
            <DescriptionListTerm>Enqueue</DescriptionListTerm>
            <DescriptionListDescription>
              {rates.enqueue.toFixed(1)}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Dequeue</DescriptionListTerm>
            <DescriptionListDescription>
              {rates.dequeue.toFixed(1)}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Dispatch</DescriptionListTerm>
            <DescriptionListDescription>
              {rates.dispatch.toFixed(1)}
            </DescriptionListDescription>
          </DescriptionListGroup>

        </DescriptionList>
      </CardBody>
    </Card>
  )
}
