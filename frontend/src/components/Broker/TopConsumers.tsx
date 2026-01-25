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
import { useTopConsumers } from "../../hooks/useTopConsumers"

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

  const { data: consumers = [], isLoading, error } = useTopConsumers(brokerName)

  return (
    <Card isFlat isCompact>
      <CardHeader>
        <CardTitle>Top Consumers</CardTitle>
      </CardHeader>

      <CardBody>

        {isLoading && (
          <Alert variant="info" title="Loading consumers…" isInline />
        )}

        {error && (
          <Alert variant="danger" title="Failed to load consumers" isInline />
        )}

        {!isLoading && !error && consumers.length === 0 && (
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
