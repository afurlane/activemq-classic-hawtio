import React from 'react'
import { TrashIcon } from '@patternfly/react-icons'
import { BaseModal } from './BaseModal'

interface PurgeQueueModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  queueName: string
}

export const PurgeQueueModal: React.FC<PurgeQueueModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  queueName
}) => (
  <BaseModal
    title="Purge Queue"
    isOpen={isOpen}
    onClose={onClose}
    confirmLabel="Purge"
    confirmIcon={<TrashIcon />}
    confirmVariant="danger"
    onConfirm={onConfirm}
  >
    <p>
      Are you sure you want to purge all messages from <strong>{queueName}</strong>?  
      This action cannot be undone.
    </p>
  </BaseModal>
)
