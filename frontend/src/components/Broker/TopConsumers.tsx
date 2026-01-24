import React, { useEffect, useState } from "react"
import { activemq } from "../../services/activemq/ActiveMQClassicService"
import { useSelectedBrokerName } from "../../hooks/useSelectedBroker"
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
} from "@patternfly/react-core"
import { ExclamationCircleIcon } from '@patternfly/react-icons'

export const TopConsumers: React.FC = () => {
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

  return (
    <Card isFlat isCompact>
      <CardHeader>
        <CardTitle>Top Consumers</CardTitle>
      </CardHeader>

      <CardBody>

        {consumers.length === 0 && (
          <Alert variant="info" title="No consumers found" isInline />
        )}

        {consumers.map((c, i) => (
          <Card key={i} isCompact isFlat style={{ marginBottom: '0.75rem' }}>
            <CardBody>

              <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                <FlexItem>
                  <strong>{c.clientId}</strong>
                </FlexItem>

                {c.slow && (
                  <FlexItem>
                    <Label color="red" icon={<ExclamationCircleIcon />}>
                      Slow
                    </Label>
                  </FlexItem>
                )}
              </Flex>

              <DescriptionList isHorizontal style={{ marginTop: '0.5rem' }}>
                <DescriptionListGroup>
                  <DescriptionListTerm>Destination</DescriptionListTerm>
                  <DescriptionListDescription>
                    {c.destination}
                  </DescriptionListDescription>
                </DescriptionListGroup>

                <DescriptionListGroup>
                  <DescriptionListTerm>Dispatched</DescriptionListTerm>
                  <DescriptionListDescription>
                    {c.dispatched.toLocaleString()}
                  </DescriptionListDescription>
                </DescriptionListGroup>

                <DescriptionListGroup>
                  <DescriptionListTerm>Pending</DescriptionListTerm>
                  <DescriptionListDescription>
                    {c.pending.toLocaleString()}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>

            </CardBody>
          </Card>
        ))}

      </CardBody>
    </Card>
  )
}
