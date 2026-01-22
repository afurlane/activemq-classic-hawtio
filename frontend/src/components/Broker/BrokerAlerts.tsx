import React, { useEffect, useState } from 'react'
import { activemq } from '../../services/activemq/ActiveMQClassicService'
import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'
import {
  Card,
  CardBody,
  Title,
  Alert,
  AlertGroup
} from '@patternfly/react-core'

export const BrokerAlerts: React.FC = () => {
  const brokerName = useSelectedBrokerName()

  if (!brokerName) {
    return (
      <Card isFlat isCompact>
        <CardBody>
          <Alert
            variant="danger"
            title="No broker selected"
            isInline
          />
        </CardBody>
      </Card>
    )
  }

  const [alerts, setAlerts] = useState<string[]>([])

  const poll = async () => {
    if (!brokerName) {
      setAlerts([`No broker selected`])
      return
    }

    const queues = await activemq.listQueues(brokerName)

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

    const avgMemory = queues.length > 0 ? memorySum / queues.length : 0

    const newAlerts: string[] = []

    if (avgMemory > 80) newAlerts.push(`High average memory: ${avgMemory.toFixed(1)}%`)
    if (totalLag > 50000) newAlerts.push(`High global lag: ${totalLag}`)
    if (totalInflight > 10000) newAlerts.push(`Too many inflight messages: ${totalInflight}`)
    if (consumers === 0) newAlerts.push(`No active consumers in the broker`)

    setAlerts(newAlerts)
  }

  useEffect(() => {
    poll()
    const id = setInterval(poll, 5000)
    return () => clearInterval(id)
  }, [brokerName])

  return (
    <Card isFlat isCompact className="broker-panel">
      <CardBody>
        <Title headingLevel="h4">Broker Alerts</Title>

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
