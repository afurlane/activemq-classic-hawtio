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
import type { BrokerMetrics } from "../../hooks/useBrokerMetrics"

interface Props {
  latest: BrokerMetrics
}

const producerCardStyle = { marginBottom: '0.75rem' } as const
const producerHeaderJustifyContent = { default: 'justifyContentSpaceBetween' } as const
const producerDescriptionListStyle = { marginTop: '0.5rem' } as const

export const TopProducers: React.FC<Props> = ({ latest }) => {
  const producers = latest.topProducers ?? []

  if (!producers) {
    return (
      <Card isFlat isCompact>
        <CardBody>
          <Alert variant="danger" title="No producer data available" isInline />
        </CardBody>
      </Card>
    )
  }

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
          <Card key={i} isCompact isFlat style={producerCardStyle}>
            <CardBody>

              <Flex justifyContent={producerHeaderJustifyContent}>
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

              <DescriptionList isHorizontal style={producerDescriptionListStyle}>
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
