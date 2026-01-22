import React from 'react'
import {
  Card,
  CardBody,
  Title,
  DataList,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell
} from '@patternfly/react-core'

import { ActiveMQTopicAttributes } from '../../types/activemq'

export const TopicSubscribers: React.FC<{ attrs: ActiveMQTopicAttributes }> = ({ attrs }) => {
  const subs = attrs.Subscriptions ?? []

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Subscribers</Title>

        <DataList aria-label="Topic subscribers list" isCompact>
          {subs.map((s, i) => (
            <DataListItem key={i}>
              <DataListItemRow>
                <DataListItemCells
                  dataListCells={[
                    <DataListCell key="client">
                      <strong>{s.ClientId}</strong> — dispatched {s.DispatchedCounter}, pending {s.PendingQueueSize}
                    </DataListCell>
                  ]}
                />
              </DataListItemRow>
            </DataListItem>
          ))}
        </DataList>
      </CardBody>
    </Card>
  )
}
