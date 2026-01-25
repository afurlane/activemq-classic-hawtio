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
  Label,
  Alert,
  Flex,
  FlexItem
} from '@patternfly/react-core'

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon
} from '@patternfly/react-icons'

import { Sparkline } from '../Common/Sparkline'
import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'
import { useBrokerTrendsHistory } from '../../hooks/useBrokerTrendsHistory'

export const BrokerTrends: React.FC = () => {
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

  const { history, latest } = useBrokerTrendsHistory(brokerName)

  if (!latest) {
    return (
      <Card isFlat isCompact>
        <CardBody>Loading broker trends…</CardBody>
      </Card>
    )
  }

  const severity =
    latest.avgMemory > 80 || latest.totalLag > 50000
      ? 'red'
      : latest.avgMemory > 60 || latest.totalLag > 10000
      ? 'orange'
      : 'green'

  const severityLabel =
    severity === 'red'
      ? 'Critical'
      : severity === 'orange'
      ? 'Warning'
      : 'Healthy'

  const severityIcon =
    severity === 'red'
      ? <ExclamationCircleIcon />
      : severity === 'orange'
      ? <ExclamationTriangleIcon />
      : <CheckCircleIcon />

  return (
    <Card isFlat isCompact>
      <CardHeader>
        <CardTitle>Broker Trends</CardTitle>
        <Label color={severity} icon={severityIcon} style={{ marginLeft: 'auto' }}>
          {severityLabel}
        </Label>
      </CardHeader>

      <CardBody>

        {/* TOTAL MESSAGES */}
        <DescriptionList isHorizontal>
          <DescriptionListGroup>
            <DescriptionListTerm>Total Messages</DescriptionListTerm>
            <DescriptionListDescription>
              {latest.totalSize.toLocaleString()}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
        <Sparkline data={history.totalSize} color="#007bff" />

        {/* TOTAL INFLIGHT */}
        <DescriptionList isHorizontal>
          <DescriptionListGroup>
            <DescriptionListTerm>Total Inflight</DescriptionListTerm>
            <DescriptionListDescription>
              {latest.totalInflight.toLocaleString()}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
        <Sparkline data={history.totalInflight} color="#ff8800" />

        {/* TOTAL LAG */}
        <DescriptionList isHorizontal>
          <DescriptionListGroup>
            <DescriptionListTerm>Total Lag</DescriptionListTerm>
            <DescriptionListDescription>
              {latest.totalLag.toLocaleString()}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
        <Sparkline data={history.totalLag} color="#dc3545" />

        {/* EXTRA METRICS */}
        <Flex style={{ marginTop: '1rem' }}>
          <FlexItem>
            <strong>Active Consumers:</strong> {latest.consumers}
          </FlexItem>
          <FlexItem>
            <strong>Average Memory:</strong> {latest.avgMemory.toFixed(1)}%
          </FlexItem>
        </Flex>

      </CardBody>
    </Card>
  )
}
