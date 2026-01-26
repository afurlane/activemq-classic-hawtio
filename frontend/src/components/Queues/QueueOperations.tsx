import React, { useState } from 'react'
import {  Button,} from '@patternfly/react-core'
import { Queue } from '../../types/domain'
import { MoveMessageModal } from './MoveMessageModal'
import { CopyMessageModal } from './CopyMessageModal'
import { RemoveMessageModal } from './RemoveMessageModal'
import { RetryMessageModal } from './RetryMessageModal'
import { RemoveMessageGroupModal } from './RemoveMessageGroupModal'
import { SendMessageModal } from './SendMessageModal'
import { log } from '../../globals'

type OperationName =
  | 'moveMessage'
  | 'copyMessage'
  | 'removeMessage'
  | 'retryMessage'
  | 'removeMessageGroup'
  | 'sendMessage'
export const QueueOperations: React.FC<{ queue: Queue, onAction: () => Promise<void> }> = ({ queue, onAction }) => {
  const [isMoveOpen, setMoveOpen] = useState(false)
  const [isCopyOpen, setCopyOpen] = useState(false)
  const [isRemoveOpen, setRemoveOpen] = useState(false)
  const [isRetryOpen, setRetryOpen] = useState(false)
  const [isRemoveGroupOpen, setRemoveGroupOpen] = useState(false)
  const [isSendOpen, setSendOpen] = useState(false)

  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  return (
    <>
      <Button onClick={() => setMoveOpen(true)}>Move Message</Button>
      <Button onClick={() => setCopyOpen(true)}>Copy Message</Button>
      <Button onClick={() => setRemoveOpen(true)}>Remove Message</Button>
      <Button onClick={() => setRetryOpen(true)}>Retry Message</Button>
      <Button onClick={() => setRemoveGroupOpen(true)}>Remove Group</Button>
      <Button onClick={() => setSendOpen(true)}>Send Message</Button>

      <MoveMessageModal
        isOpen={isMoveOpen}
        onClose={() => setMoveOpen(false)}
        onConfirm={(id, dest) => {
          log.debug("MOVE", id, dest)
          setMoveOpen(false)
        }}
      />

      <CopyMessageModal
        isOpen={isCopyOpen}
        onClose={() => setCopyOpen(false)}
        onConfirm={(id, dest) => {
          log.debug("COPY", id, dest)
          setCopyOpen(false)
        }}
      />

      <RemoveMessageModal
        isOpen={isRemoveOpen}
        onClose={() => setRemoveOpen(false)}
        onConfirm={(id) => {
          log.debug("REMOVE", id)
          setRemoveOpen(false)
        }}
      />

      <RetryMessageModal
        isOpen={isRetryOpen}
        onClose={() => setRetryOpen(false)}
        onConfirm={(id) => {
          log.debug("RETRY", id)
          setRetryOpen(false)
        }}
      />

      <RemoveMessageGroupModal
        isOpen={isRemoveGroupOpen}
        onClose={() => setRemoveGroupOpen(false)}
        onConfirm={(group) => {
          log.debug("REMOVE GROUP", group)
          setRemoveGroupOpen(false)
        }}
      />

      <SendMessageModal
        isOpen={isSendOpen}
        onClose={() => setSendOpen(false)}
        onConfirm={(body) => {
          log.debug("SEND", body)
          setSendOpen(false)
        }}
      />
    </>
  )
}
