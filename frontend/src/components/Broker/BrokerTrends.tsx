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
import type { BrokerMetrics, BrokerMetricsHistory } from '../../hooks/useBrokerMetrics'

interface Props {
  latest: BrokerMetrics
  history: BrokerMetricsHistory
}

export const BrokerTrends: React.FC<Props> = ({ latest, history }) => {
  if (!latest || !history) {
    return (
      <Card isFlat isCompact>
        <CardBody>
          <Alert variant="info" title="Loading broker trends…" isInline />
        </CardBody>
      </Card>
    )
  }

  // Identica alla tua logica
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
        <Label color={severity} icon={severityIcon} className="pf-v5-u-ml-auto">
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
        <Flex className="pf-v5-u-mt-md">
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
