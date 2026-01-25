import React from 'react'
import {
  Card,
  CardBody,
  Title,
  Alert
} from '@patternfly/react-core'

export const TopicSendMessage: React.FC = () => {
  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Send Message</Title>

        <Alert
          variant="info"
          isInline
          title="Message publishing is not available via JMX"
        >
          Use a JMS client or an AMQP/MQTT/STOMP producer to send messages to this topic.
        </Alert>
      </CardBody>
    </Card>
  )
}
