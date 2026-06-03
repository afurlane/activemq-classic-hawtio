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

const justifyContentSpaceBetween = { default: 'justifyContentSpaceBetween' } as const
const consumerCardStyle = { marginBottom: '0.75rem' } as const

export const TopConsumers: React.FC<Props> = ({ latest }) => {
  const consumers = latest.topConsumers ?? []

  if (!consumers) {
    return (
      <Card isCompact>
        <CardBody>
          <Alert variant="danger" title="No consumer data available" isInline />
        </CardBody>
      </Card>
    )
  }

  return (
    <Card isCompact>
      <CardHeader>
        <CardTitle>Top Consumers</CardTitle>
      </CardHeader>

      <CardBody>

        {consumers.length === 0 && (
          <Alert variant="info" title="No consumers found" isInline />
        )}

        {consumers.map((c, i) => (
          <Card key={i} isCompact style={consumerCardStyle}>
            <CardBody>

              <Flex justifyContent={justifyContentSpaceBetween}>
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

              <DescriptionList isHorizontal className="pf-v5-u-mt-sm">
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
