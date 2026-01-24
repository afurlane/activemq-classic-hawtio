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

export const TopProducers: React.FC = () => {
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

  const [producers, setProducers] = useState<any[]>([])

  const load = async () => {
    if (!brokerName) return

    const mbeans = await activemq.listProducers(brokerName)
    const attrs = await Promise.all(
      mbeans.map(m => activemq.getProducerAttributes(m))
    )

    const sorted = attrs
      .map(a => ({
        clientId: a.ClientId ?? "unknown",
        destination: a.DestinationName ?? "unknown",
        sent: a.SentCount ?? 0,
        blocked: a.ProducerBlocked ?? false,
        pctBlocked: a.PercentageBlocked ?? 0
      }))
      .sort((a, b) => b.sent - a.sent)
      .slice(0, 10)

    setProducers(sorted)
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 5000)
    return () => clearInterval(id)
  }, [brokerName])

  return (
    <Card isFlat isCompact>
      <CardHeader>
        <CardTitle>Top Producers</CardTitle>
      </CardHeader>

      <CardBody>

        {producers.length === 0 && (
          <Alert variant="info" title="No producers found" isInline />
        )}

        {producers.map((p, i) => (
          <Card key={i} isCompact isFlat style={{ marginBottom: '0.75rem' }}>
            <CardBody>

              <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                <FlexItem>
                  <strong>{p.clientId}</strong>
                </FlexItem>

                {p.blocked && (
                  <FlexItem>
                    <Label color="red" icon={<ExclamationCircleIcon />}>
                      Blocked
                    </Label>
                  </FlexItem>
                )}
              </Flex>

              <DescriptionList isHorizontal style={{ marginTop: '0.5rem' }}>
                <DescriptionListGroup>
                  <DescriptionListTerm>Destination</DescriptionListTerm>
                  <DescriptionListDescription>
                    {p.destination}
                  </DescriptionListDescription>
                </DescriptionListGroup>

                <DescriptionListGroup>
                  <DescriptionListTerm>Sent</DescriptionListTerm>
                  <DescriptionListDescription>
                    {p.sent.toLocaleString()}
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
