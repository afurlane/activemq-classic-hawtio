import React, { useCallback, useMemo } from "react"
import { BaseModal } from "./BaseModal"
import { TrashIcon } from "@patternfly/react-icons"
import { ButtonVariant } from "@patternfly/react-core"

interface RemoveMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (messageIds: string[]) => void
  messageIds: string[]
}

export const RemoveMessageModal: React.FC<RemoveMessageModalProps> = ({
  isOpen, onClose, onConfirm, messageIds
}) => {
  const handleConfirm = useCallback(() => onConfirm(messageIds), [onConfirm, messageIds])
  const summary = useMemo(() => {
    if (messageIds.length === 0) {
      return 'Select one or more messages to remove.'
    }

    if (messageIds.length === 1) {
      return `This will remove message ${messageIds[0]} from the queue.`
    }

    return `This will remove ${messageIds.length} selected messages from the queue.`
  }, [messageIds])

  return (
    <BaseModal
      title={messageIds.length === 1 ? 'Remove Message' : 'Remove Messages'}
      isOpen={isOpen}
      onClose={onClose}
      confirmLabel="Remove"
      confirmIcon={<TrashIcon />}
      confirmVariant={ButtonVariant.danger}
      isConfirmDisabled={messageIds.length === 0}
      onConfirm={handleConfirm}
    >
      <p>{summary}</p>
    </BaseModal>
  )
}
