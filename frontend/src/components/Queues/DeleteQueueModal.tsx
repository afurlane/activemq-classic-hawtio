import React from 'react'
import { ExclamationTriangleIcon } from '@patternfly/react-icons'
import { BaseModal } from './BaseModal'

interface DeleteQueueModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  queueName: string
}

export const DeleteQueueModal: React.FC<DeleteQueueModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  queueName
}) => (
  <BaseModal
    title="Delete Queue"
    isOpen={isOpen}
    onClose={onClose}
    confirmLabel="Delete"
    confirmIcon={<ExclamationTriangleIcon />}
    confirmVariant="danger"
    onConfirm={onConfirm}
  >
    <p>
      This will permanently delete the queue <strong>{queueName}</strong>  
      and all of its messages.  
      This action cannot be undone.
    </p>
  </BaseModal>
)
