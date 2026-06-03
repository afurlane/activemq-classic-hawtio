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

import type { TopicMetricsLatest } from '../../hooks/useTopicMetrics'

const labelsContainerStyle = { marginTop: 4 }
const dispatchedLabelStyle = { marginRight: 8 }
const slowLabelStyle = { marginLeft: 8 }

interface Props {
  latest: TopicMetricsLatest
}

export const TopicSubscribers: React.FC<Props> = ({ latest }) => {
  const subs = latest.subscriptions
  const memoizedDataListCells = React.useMemo(
    () =>
      subs.map(s => [
        <DataListCell key="client">
          <strong>{s.clientId}</strong>

          <div style={labelsContainerStyle}>
            <Label color="blue" style={dispatchedLabelStyle}>
              Dispatched: {s.stats.dispatched}
            </Label>

            <Label color={s.stats.dispatchedQueueSize > 0 ? 'orange' : 'green'}>
              Pending: {s.stats.dispatchedQueueSize}
            </Label>

            {s.state.slow && (
              <Label color="red" style={slowLabelStyle}>
                Slow
              </Label>
            )}
          </div>
        </DataListCell>
      ]),
    [subs]
  )

  return (
    <Card isCompact>
      <CardBody>
        <Title headingLevel="h4">Subscribers</Title>

        {subs.length === 0 && (
          <Alert variant="info" isInline title="No active subscribers" />
        )}

        {subs.length > 0 && (
          <DataList aria-label="Topic subscribers list" isCompact>
            {subs.map((s, i) => {
              return (
                <DataListItem key={i}>
                  <DataListItemRow>
                    <DataListItemCells dataListCells={memoizedDataListCells[i]} />
                  </DataListItemRow>
                </DataListItem>
              )
            })}
          </DataList>
        )}
      </CardBody>
    </Card>
  )
}
