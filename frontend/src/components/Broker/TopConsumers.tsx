import React, { useEffect, useState } from "react"
import { activemq } from "../../services/activemq/ActiveMQClassicService"
import { useSelectedBrokerName } from "../../hooks/useSelectedBroker"
import {
  Card,
  CardBody,
  Title,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Label,
  Alert
} from "@patternfly/react-core"
import {
  ExclamationCircleIcon
} from '@patternfly/react-icons'

export const TopConsumers: React.FC = () => {
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

  const [consumers, setConsumers] = useState<any[]>([])

  const load = async () => {
    if (!brokerName) return

    const mbeans = await activemq.listConsumers(brokerName)
    const attrs = await Promise.all(
      mbeans.map(m => activemq.getConsumerAttributes(m))
    )

    const sorted = attrs
      .map(a => ({
        clientId: a.ClientId ?? "unknown",
        destination: a.DestinationName ?? "unknown",
        dispatched: a.DispatchedCounter ?? 0,
        dequeue: a.DequeueCounter ?? 0,
        pending: a.PendingQueueSize ?? 0,
        slow: a.SlowConsumer ?? false
      }))
      .sort((a, b) => b.dispatched - a.dispatched)
      .slice(0, 10)

    setConsumers(sorted)
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 5000)
    return () => clearInterval(id)
  }, [brokerName])

  if (!brokerName) return <p>No broker selected</p>

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Top Consumers</Title>

        {consumers.length === 0 && <p>No consumers found</p>}

        {consumers.map((c, i) => (
          <DescriptionList key={i} isHorizontal>
            <DescriptionListGroup>
              <DescriptionListTerm>Client</DescriptionListTerm>
              <DescriptionListDescription>
                <b>{c.clientId}</b>
              </DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>Destination</DescriptionListTerm>
              <DescriptionListDescription>
                {c.destination}
              </DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>Dispatched</DescriptionListTerm>
              <DescriptionListDescription>
                {c.dispatched}
              </DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>Pending</DescriptionListTerm>
              <DescriptionListDescription>
                {c.pending}
              </DescriptionListDescription>
            </DescriptionListGroup>

            {c.slow && (
              <DescriptionListGroup>
                <DescriptionListTerm>Status</DescriptionListTerm>
                <DescriptionListDescription>
                  <Label color="red" icon={<ExclamationCircleIcon />}>
                    Slow
                  </Label>
                </DescriptionListDescription>
              </DescriptionListGroup>
            )}
          </DescriptionList>
        ))}
      </CardBody>
    </Card>
  )
}
