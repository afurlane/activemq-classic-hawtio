import React, { useCallback, useEffect, useMemo, useState } from "react"
import { ArrowRightIcon } from "@patternfly/react-icons"
import { BaseModal } from "./BaseModal"
import { MessageDestinationField } from './MessageDestinationField'

interface MoveMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (messageIds: string[], dest: string) => void
  messageIds: string[]
  availableQueues: string[]
}

export const MoveMessageModal: React.FC<MoveMessageModalProps> = ({
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
      return 'Select one or more messages to move.'
    }

    if (messageIds.length === 1) {
      return `This will move message ${messageIds[0]} to another queue.`
    }

    return `This will move ${messageIds.length} selected messages to another queue.`
  }, [messageIds])

  return (
    <BaseModal
      title={messageIds.length === 1 ? 'Move Message' : 'Move Messages'}
      isOpen={isOpen}
      onClose={onClose}
      confirmLabel="Move"
      confirmIcon={<ArrowRightIcon />}
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
