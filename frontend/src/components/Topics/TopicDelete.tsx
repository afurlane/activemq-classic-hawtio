import React, { useState } from 'react'
import {
  Card,
  CardBody,
  Title,
  Button,
  ButtonVariant,
  Modal,
  Alert,
  Spinner
} from '@patternfly/react-core'

import { activemq, getBrokerMBean } from '../../services/activemq/ActiveMQClassicService'
import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'

interface Props {
  mbean: string
}

export const TopicDelete: React.FC<Props> = ({ mbean }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const brokerName = useSelectedBrokerName()

  if (!brokerName) {
    return (
      <Card isFlat isCompact>
        <CardBody>
          <Alert variant="danger" title="No broker selected" isInline />
        </CardBody>
      </Card>
    )
  }

  const match = /destinationName=([^,]+)/.exec(mbean)
  const topicName = match?.[1]

  if (!topicName) {
    return (
      <Card isFlat isCompact>
        <CardBody>
          <Alert variant="danger" title="Invalid topic MBean" isInline />
        </CardBody>
      </Card>
    )
  }

  const del = async () => {
    setIsDeleting(true)
    setError(null)
    setSuccess(false)

    try {
      await activemq.deleteTopic(getBrokerMBean(brokerName), topicName)
      setSuccess(true)
      setIsOpen(false)
    } catch (err: any) {
      setError(err?.message ?? 'Unknown error')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Delete Topic</Title>

        {success && (
          <Alert
            variant="success"
            title={`Topic "${topicName}" deleted successfully`}
            isInline
          />
        )}

        {error && (
          <Alert
            variant="danger"
            title="Failed to delete topic"
            isInline
          >
            {error}
          </Alert>
        )}

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
              isDisabled={isDeleting}
              onClick={del}
            >
              {isDeleting ? <Spinner size="sm" /> : 'Yes, delete'}
            </Button>,
            <Button
              key="cancel"
              variant={ButtonVariant.secondary}
              isDisabled={isDeleting}
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
