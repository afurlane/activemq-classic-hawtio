import React from 'react'
import {
  Card,
  CardBody,
  Title,
  Alert,
  DataList,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
  Label
} from '@patternfly/react-core'

import { ActiveMQTopicAttributes } from '../../types/activemq'

interface Props {
  attrs: ActiveMQTopicAttributes
}

export const TopicSubscribers: React.FC<Props> = ({ attrs }) => {
  const subs = attrs.Subscriptions ?? []

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Subscribers</Title>

        {subs.length === 0 && (
          <Alert
            variant="info"
            isInline
            title="No active subscribers"
          >
            This topic currently has no consumers connected.
          </Alert>
        )}

        {subs.length > 0 && (
          <DataList aria-label="Topic subscribers list" isCompact>
            {subs.map((s, i) => (
              <DataListItem key={i}>
                <DataListItemRow>
                  <DataListItemCells
                    dataListCells={[
                      <DataListCell key="client">
                        <strong>{s.ClientId}</strong>

                        <div style={{ marginTop: 4 }}>
                          <Label color="blue" style={{ marginRight: 8 }}>
                            Dispatched: {s.DispatchedCounter}
                          </Label>

                          <Label
                            color={s.PendingQueueSize > 0 ? 'orange' : 'green'}
                          >
                            Pending: {s.PendingQueueSize}
                          </Label>
                        </div>
                      </DataListCell>
                    ]}
                  />
                </DataListItemRow>
              </DataListItem>
            ))}
          </DataList>
        )}
      </CardBody>
    </Card>
  )
}
