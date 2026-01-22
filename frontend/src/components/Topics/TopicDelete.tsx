import React, { useState } from 'react'
import {
  Card,
  CardBody,
  Title,
  Button,
  ButtonVariant,
  Modal,
  Alert
} from '@patternfly/react-core'

import { activemq } from '../../services/activemq/ActiveMQClassicService'
import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'
import { getBrokerMBean } from '../../services/activemq/ActiveMQClassicService'

export const TopicDelete: React.FC<{ mbean: string }> = ({ mbean }) => {
  const [isOpen, setIsOpen] = useState(false)
  const brokerName = useSelectedBrokerName()

  if (!brokerName) {
    return (
      <Card isFlat isCompact>
        <CardBody>
          <Alert
            variant="danger"
            title="No broker selected"
            isInline
          />
        </CardBody>
      </Card>
    )
  }

  // Estrae il nome del topic dal mbean
  const topicName = mbean.split('destinationName=')[1]
  if (!topicName) {
    return (
      <Card isFlat isCompact>
        <CardBody>
          <Alert
            variant="danger"
            title="Invalid topic MBean"
            isInline
          />
        </CardBody>
      </Card>
    )
  }

  const del = async () => {
    await activemq.deleteTopic(getBrokerMBean(brokerName), topicName)
    setIsOpen(false)
  }

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Delete Topic</Title>

        <Button
          variant={ButtonVariant.danger}
          onClick={() => setIsOpen(true)}
        >
          Delete topic
        </Button>

        <Modal
          title="Confirm deletion"
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          actions={[
            <Button
              key="confirm"
              variant={ButtonVariant.danger}
              onClick={del}
            >
              Yes, delete
            </Button>,
            <Button
              key="cancel"
              variant={ButtonVariant.secondary}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          ]}
        >
          This action will permanently delete the topic <b>{topicName}</b>.  
          This cannot be undone.
        </Modal>
      </CardBody>
    </Card>
  )
}
