import React from 'react'
import {
  Card,
  CardBody,
  Title,
  Label,
  Alert
} from '@patternfly/react-core'

import { ActiveMQTopicAttributes } from '../../types/activemq'

interface Props {
  attrs: ActiveMQTopicAttributes
}

export const TopicProducers: React.FC<Props> = ({ attrs }) => {
  const count = attrs.ProducerCount

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Producers</Title>

        {count === 0 ? (
          <Alert
            variant="warning"
            isInline
            title="No active producers"
          >
            This topic currently has no producers connected.
          </Alert>
        ) : (
          <Label color="blue">
            {count} active producer{count !== 1 ? 's' : ''}
          </Label>
        )}
      </CardBody>
    </Card>
  )
}
