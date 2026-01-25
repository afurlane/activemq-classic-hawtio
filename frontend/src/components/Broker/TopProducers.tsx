import React from "react"
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
import { useSelectedBrokerName } from "../../hooks/useSelectedBroker"
import { useTopProducers } from "../../hooks/useTopProducers"

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

  const { data: producers = [], isLoading, error } = useTopProducers(brokerName)

  return (
    <Card isFlat isCompact>
      <CardHeader>
        <CardTitle>Top Producers</CardTitle>
      </CardHeader>

      <CardBody>

        {isLoading && (
          <Alert variant="info" title="Loading producers…" isInline />
        )}

        {error && (
          <Alert variant="danger" title="Failed to load producers" isInline />
        )}

        {!isLoading && !error && producers.length === 0 && (
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
