import React, { useCallback, useMemo } from "react"
import { BaseModal } from "./BaseModal"
import { RedoIcon } from "@patternfly/react-icons"

interface RetryMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (messageIds: string[]) => void
  messageIds: string[]
}

export const RetryMessageModal: React.FC<RetryMessageModalProps> = ({
  isOpen, onClose, onConfirm, messageIds
}) => {
  const handleConfirm = useCallback(() => onConfirm(messageIds), [onConfirm, messageIds])
  const summary = useMemo(() => {
    if (messageIds.length === 0) {
      return 'Select one or more messages to retry.'
    }

    if (messageIds.length === 1) {
      return `This will retry message ${messageIds[0]}.`
    }

    return `This will retry ${messageIds.length} selected messages.`
  }, [messageIds])

  return (
    <BaseModal
      title={messageIds.length === 1 ? 'Retry Message' : 'Retry Messages'}
      isOpen={isOpen}
      onClose={onClose}
      confirmLabel="Retry"
      confirmIcon={<RedoIcon />}
      isConfirmDisabled={messageIds.length === 0}
      onConfirm={handleConfirm}
    >
      <p>{summary}</p>
    </BaseModal>
  )
}
