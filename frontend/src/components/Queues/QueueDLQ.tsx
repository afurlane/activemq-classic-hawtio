import React from 'react'
import {
  Card,
  CardBody,
  Title,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Label
} from '@patternfly/react-core'

import { Queue } from '../../types/domain'

interface Props {
  queue: Queue
}

export const QueueDLQ: React.FC<Props> = ({ queue }) => {
  const yesNo = (v: boolean) =>
    v ? <Label color="green">Yes</Label> : <Label color="red">No</Label>

  const valueOrNA = (v: any) =>
    v === undefined || v === null ? '—' : String(v)

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">DLQ / Redelivery</Title>

        <DescriptionList isHorizontal>

          <DescriptionListGroup>
            <DescriptionListTerm>Is DLQ</DescriptionListTerm>
            <DescriptionListDescription>
              {yesNo(queue.state.dlq)}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Expired Messages</DescriptionListTerm>
            <DescriptionListDescription>
              {valueOrNA(queue.stats.expired)}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Redelivered Messages</DescriptionListTerm>
            <DescriptionListDescription>
              {valueOrNA(queue.stats.redelivered)}
            </DescriptionListDescription>
          </DescriptionListGroup>

        </DescriptionList>
      </CardBody>
    </Card>
  )
}
