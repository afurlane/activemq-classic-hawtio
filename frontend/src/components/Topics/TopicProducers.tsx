import React from 'react'
import {
  Card,
  CardBody,
  Title
} from '@patternfly/react-core'

import { ActiveMQTopicAttributes } from '../../types/activemq'

export const TopicProducers: React.FC<{ attrs: ActiveMQTopicAttributes }> = ({ attrs }) => {
  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Producers</Title>
        <p>{attrs.ProducerCount} active producers</p>
      </CardBody>
    </Card>
  )
}
