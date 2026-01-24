import React, { useEffect, useState } from 'react'
import { activemq } from '../../services/activemq/ActiveMQClassicService'
import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'
import { Sparkline } from '../Common/Sparkline'
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

interface TrendHistory {
  totalSize: number[]
  totalInflight: number[]
  totalLag: number[]
}

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

  const [history, setHistory] = useState<TrendHistory>({
    totalSize: [],
    totalInflight: [],
    totalLag: [],
  })

  const [latest, setLatest] = useState({
    totalSize: 0,
    totalInflight: 0,
    totalLag: 0,
    consumers: 0,
    avgMemory: 0,
  })

  const [loading, setLoading] = useState(true)

  const poll = async () => {
    if (!brokerName) return

    const queues = await activemq.listQueues(brokerName)

    let totalSize = 0
    let totalInflight = 0
    let totalLag = 0
    let consumers = 0
    let memorySum = 0

    queues.forEach(q => {
      const size = q.size ?? 0
      const inflight = q.stats.inflight ?? 0
      const mem = q.memory.percent ?? 0

      totalSize += size
      totalInflight += inflight
      totalLag += size - inflight
      consumers += q.consumers
      memorySum += mem
    })

    const avgMemory = queues.length > 0 ? memorySum / queues.length : 0

    setLatest({
      totalSize,
      totalInflight,
      totalLag,
      consumers,
      avgMemory,
    })

    setHistory(prev => ({
      totalSize: [...prev.totalSize, totalSize].slice(-50),
      totalInflight: [...prev.totalInflight, totalInflight].slice(-50),
      totalLag: [...prev.totalLag, totalLag].slice(-50),
    }))

    setLoading(false)
  }

  useEffect(() => {
    poll()
    const id = setInterval(poll, 5000)
    return () => clearInterval(id)
  }, [brokerName])

  if (loading) {
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
