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

export const BrokerStorage: React.FC = () => {
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

  const [storage, setStorage] = useState({
    store: 0,
    temp: 0,
    cursor: 0,
    memory: 0,
  })

  const poll = async () => {
    if (!brokerName) return

    const queues = await activemq.listQueuesWithRawAttributes(brokerName)

    let store = 0
    let cursor = 0
    let memory = 0
    let tempSum = 0
    let tempCount = 0

    queues.forEach(({ attrs }) => {
      store += attrs.StoreMessageSize ?? 0
      cursor += attrs.CursorMemoryUsage ?? 0
      memory += attrs.MemoryUsageByteCount ?? 0

      if (attrs.TempUsagePercentUsage !== undefined) {
        tempSum += attrs.TempUsagePercentUsage
        tempCount++
      }
    })

    const temp = tempCount > 0 ? tempSum / tempCount : 0

    setStorage({ store, temp, cursor, memory })
  }

  useEffect(() => {
    poll()
    const id = setInterval(poll, 5000)
    return () => clearInterval(id)
  }, [brokerName])

  // Severità per evidenziare problemi
  const severity =
    storage.temp > 80 || storage.memory > 80_000_000
      ? 'red'
      : storage.temp > 60 || storage.memory > 40_000_000
      ? 'orange'
      : 'green'

  return (
    <Card isFlat isCompact>
      <CardHeader>
        <CardTitle>Broker Storage</CardTitle>
        <Label color={severity} style={{ marginLeft: 'auto' }}>
          {severity === 'red'
            ? 'Critical'
            : severity === 'orange'
            ? 'Warning'
            : 'Healthy'}
        </Label>
      </CardHeader>

      <CardBody>
        <DescriptionList isHorizontal>

          <DescriptionListGroup>
            <DescriptionListTerm>Total Store Size</DescriptionListTerm>
            <DescriptionListDescription>
              {storage.store.toLocaleString()} bytes
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Average Temp Usage</DescriptionListTerm>
            <DescriptionListDescription>
              {storage.temp.toFixed(1)}%
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Total Cursor Memory</DescriptionListTerm>
            <DescriptionListDescription>
              {storage.cursor.toLocaleString()} bytes
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Total Memory Usage</DescriptionListTerm>
            <DescriptionListDescription>
              {storage.memory.toLocaleString()} bytes
            </DescriptionListDescription>
          </DescriptionListGroup>

        </DescriptionList>
      </CardBody>
    </Card>
  )
}
