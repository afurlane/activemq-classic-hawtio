import React, { useEffect, useState } from 'react'
import { activemq } from '../../services/activemq/ActiveMQClassicService'
import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'
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

  const [history, setHistory] = useState<
    { enqueue: number; dequeue: number; dispatch: number }[]
  >([])

  const [rates, setRates] = useState({
    enqueue: 0,
    dequeue: 0,
    dispatch: 0,
  })

  const poll = async () => {
    if (!brokerName) return

    const queues = await activemq.listQueues(brokerName)

    const total = queues.reduce(
      (acc, q) => {
        acc.enqueue += q.stats.enqueue ?? 0
        acc.dequeue += q.stats.dequeue ?? 0
        acc.dispatch += q.stats.dispatch ?? 0
        return acc
      },
      { enqueue: 0, dequeue: 0, dispatch: 0 }
    )

    setHistory(prev => {
      const next = [...prev, total].slice(-2)

      if (next.length === 2) {
        const prev = next[0]!
        const curr = next[1]!
        const dt = 5

        setRates({
          enqueue: (curr.enqueue - prev.enqueue) / dt,
          dequeue: (curr.dequeue - prev.dequeue) / dt,
          dispatch: (curr.dispatch - prev.dispatch) / dt,
        })
      }

      return next
    })
  }

  useEffect(() => {
    poll()
    const id = setInterval(poll, 5000)
    return () => clearInterval(id)
  }, [brokerName])

  // Severità basata sul throughput
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
