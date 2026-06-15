import React from 'react'
import {
  Card,
  CardBody,
  Title,
  Label,
  Alert
} from '@patternfly/react-core'

import { TopicMetricsLatest } from 'src/hooks/useTopicMetrics'

export const TopicProducers: React.FC<{ latest: TopicMetricsLatest }> = ({ latest }) => {
  const count = latest.producers

  return (
    <Card isCompact>
      <CardBody>
        <Title headingLevel="h4">Producers</Title>

        {count === 0 ? (
          <Alert variant="warning" isInline title="No active producers" />
        ) : (
          <Label color="blue">
            {count} active producer{count !== 1 ? 's' : ''}
          </Label>
        )}
      </CardBody>
    </Card>
  )
}
