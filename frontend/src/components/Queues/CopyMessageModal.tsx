import React, { useCallback, useEffect, useMemo, useState } from "react"
import { BaseModal } from "./BaseModal"
import { CopyIcon } from "@patternfly/react-icons"
import { MessageDestinationField } from './MessageDestinationField'

interface CopyMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (messageIds: string[], dest: string) => void
  messageIds: string[]
  availableQueues: string[]
}

export const CopyMessageModal: React.FC<CopyMessageModalProps> = ({
  isOpen, onClose, onConfirm, messageIds, availableQueues
}) => {
  const [dest, setDest] = useState('')
  useEffect(() => {
    if (!isOpen) {
      setDest('')
    }
  }, [isOpen])
  const handleConfirm = useCallback(() => onConfirm(messageIds, dest.trim()), [onConfirm, messageIds, dest])
  const summary = useMemo(() => {
    if (messageIds.length === 0) {
      return 'Select one or more messages to copy.'
    }

    if (messageIds.length === 1) {
      return `This will copy message ${messageIds[0]} to another queue.`
    }

    return `This will copy ${messageIds.length} selected messages to another queue.`
  }, [messageIds])

  return (
    <BaseModal
      title={messageIds.length === 1 ? 'Copy Message' : 'Copy Messages'}
      isOpen={isOpen}
      onClose={onClose}
      confirmLabel="Copy"
      confirmIcon={<CopyIcon />}
      isConfirmDisabled={messageIds.length === 0 || !dest.trim()}
      onConfirm={handleConfirm}
    >
      <p>{summary}</p>
      <MessageDestinationField
        destination={dest}
        availableQueues={availableQueues}
        onDestinationChange={setDest}
      />
    </BaseModal>
  )
}
