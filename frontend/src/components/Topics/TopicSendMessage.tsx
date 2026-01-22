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
          title="Sending messages to a topic is not supported via JMX."
        >
          Use a JMS client or AMQP/MQTT/STOMP producer to publish messages.
        </Alert>
      </CardBody>
    </Card>
  )
}
