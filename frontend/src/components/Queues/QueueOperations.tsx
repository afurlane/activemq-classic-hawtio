import React, { useCallback, useMemo, useState } from 'react'
import { Button,} from '@patternfly/react-core'
import { Queue } from '../../types/domain'
import { MoveMessageModal } from './MoveMessageModal'
import { CopyMessageModal } from './CopyMessageModal'
import { RemoveMessageModal } from './RemoveMessageModal'
import { RetryMessageModal } from './RetryMessageModal'
import { RemoveMessageGroupModal } from './RemoveMessageGroupModal'
import { SendMessageModal } from './SendMessageModal'
import { log } from '../../globals'
import { activemq } from '../../services/activemq/ActiveMQClassicService'
import { PurgeQueueModal } from './PurgeQueueModal'
import { DeleteQueueModal } from './DeleteQueueModal'

type HeaderEntry = {
  key: string
  value: string
}

export const QueueOperations: React.FC<{ queue: Queue, onAction: () => Promise<void> }> = ({ queue, onAction }) => {
  const [isMoveOpen, setMoveOpen] = useState(false);
  const [isCopyOpen, setCopyOpen] = useState(false);
  const [isRemoveOpen, setRemoveOpen] = useState(false);
  const [isRetryOpen, setRetryOpen] = useState(false);
  const [isRemoveGroupOpen, setRemoveGroupOpen] = useState(false);
  const [isSendOpen, setSendOpen] = useState(false);
  const [queueModals, setQueueModals] = useState({ purge: false, delete: false });
  const handleDeleteConfirm = useCallback(() => {
    activemq.deleteQueue(queue.mbean, queue.name);
    setQueueModals((prev) => ({ ...prev, delete: false }))
  }, [queue])
  const handlePauseClick = useCallback(() => activemq.pauseQueue(queue.mbean), [queue])
  const handleResumeClick = useCallback(() => activemq.resumeQueue(queue.mbean), [queue])
  const createConfirmHandler = useCallback(
    <T extends unknown[]>(
      actionName: string,
      action: (...args: T) => Promise<unknown>,
      closeModal: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
      return async (...args: T) => {
        log.debug(actionName, ...args)
        await action(...args)
        await onAction()
        closeModal(false)
      }
    },
    [onAction],
  )

  const handleMoveConfirm = useMemo(
    () => createConfirmHandler('MOVE', (id: string, dest: string) => activemq.moveMessageTo(queue.mbean, id, dest), setMoveOpen),
    [createConfirmHandler, queue.mbean],
  )
  const handleCopyConfirm = useMemo(
    () => createConfirmHandler('COPY', (id: string, dest: string) => activemq.copyMessageTo(queue.mbean, id, dest), setCopyOpen),
    [createConfirmHandler, queue.mbean],
  )
  const handleRemoveConfirm = useMemo(
    () => createConfirmHandler('REMOVE', (id: string) => activemq.removeMessage(queue.mbean, id), setRemoveOpen),
    [createConfirmHandler, queue.mbean],
  )
  const handleRetryConfirm = useMemo(
    () => createConfirmHandler('RETRY', (id: string) => activemq.retryMessage(queue.mbean, id), setRetryOpen),
    [createConfirmHandler, queue.mbean],
  )
  const handleRemoveGroupConfirm = useMemo(
    () => createConfirmHandler('REMOVE GROUP', (group: string) => activemq.removeMessageGroup(queue.mbean, group), setRemoveGroupOpen),
    [createConfirmHandler, queue.mbean],
  )
  const handleSendConfirm = useMemo(
    () =>
      createConfirmHandler(
        'SEND',
        (body: string, headers: HeaderEntry[]) => {
          if (headers.length === 0) {
            return activemq.sendTextMessage(queue.mbean, body)
          }

          const headersMap = Object.fromEntries(headers.map(({ key, value }) => [key, value]))
          return activemq.sendTextMessageWithHeaders(queue.mbean, body, headersMap)
        },
        setSendOpen,
      ),
    [createConfirmHandler, queue.mbean],
  )
  const queueMessageModalHandlers = useMemo(
    () => ({
      openMove: () => setMoveOpen(true),
      closeMove: () => setMoveOpen(false),
      openCopy: () => setCopyOpen(true),
      closeCopy: () => setCopyOpen(false),
      openRemove: () => setRemoveOpen(true),
      closeRemove: () => setRemoveOpen(false),
      openRetry: () => setRetryOpen(true),
      closeRetry: () => setRetryOpen(false),
      openRemoveGroup: () => setRemoveGroupOpen(true),
      closeRemoveGroup: () => setRemoveGroupOpen(false),
      openSend: () => setSendOpen(true),
      closeSend: () => setSendOpen(false),
    }),
    [],
  )
  const queueAdminModalHandlers = useMemo(
    () => ({
      openPurge: () => setQueueModals((prev) => ({ ...prev, purge: true })),
      closePurge: () => setQueueModals((prev) => ({ ...prev, purge: false })),
      openDelete: () => setQueueModals((prev) => ({ ...prev, delete: true })),
      closeDelete: () => setQueueModals((prev) => ({ ...prev, delete: false })),
    }),
    [],
  )
  const handlePurgeConfirm = useCallback(() => {
    activemq.purgeQueue(queue.mbean)
    queueAdminModalHandlers.closePurge()
  }, [queue, queueAdminModalHandlers])
  
  return (
    <>
      <Button onClick={queueMessageModalHandlers.openMove}>Move Message</Button>
      <Button onClick={queueMessageModalHandlers.openCopy}>Copy Message</Button>
      <Button onClick={queueMessageModalHandlers.openRemove}>Remove Message</Button>
      <Button onClick={queueMessageModalHandlers.openRetry}>Retry Message</Button>
      <Button onClick={queueMessageModalHandlers.openRemoveGroup}>Remove Group</Button>
      <Button onClick={queueMessageModalHandlers.openSend}>Send Message</Button>
      <Button variant="secondary" isDisabled={queue.state.paused === true} onClick={handlePauseClick}>Pause</Button>
      <Button variant="secondary" isDisabled={queue.state.paused === false} onClick={handleResumeClick}>Resume</Button>
      <Button variant="danger" onClick={queueAdminModalHandlers.openPurge}>Purge</Button>
      <Button variant="danger" onClick={queueAdminModalHandlers.openDelete}>Delete Queue</Button>

      <MoveMessageModal
        isOpen={isMoveOpen}
        onClose={queueMessageModalHandlers.closeMove}
        onConfirm={handleMoveConfirm}
      />

      <CopyMessageModal
        isOpen={isCopyOpen}
        onClose={queueMessageModalHandlers.closeCopy}
        onConfirm={handleCopyConfirm}
      />

      <RemoveMessageModal
        isOpen={isRemoveOpen}
        onClose={queueMessageModalHandlers.closeRemove}
        onConfirm={handleRemoveConfirm}
      />

      <RetryMessageModal
        isOpen={isRetryOpen}
        onClose={queueMessageModalHandlers.closeRetry}
        onConfirm={handleRetryConfirm}
      />

      <RemoveMessageGroupModal
        isOpen={isRemoveGroupOpen}
        onClose={queueMessageModalHandlers.closeRemoveGroup}
        onConfirm={handleRemoveGroupConfirm}
      />

      <SendMessageModal
        isOpen={isSendOpen}
        onClose={queueMessageModalHandlers.closeSend}
        onConfirm={handleSendConfirm}
      />

      <PurgeQueueModal
        isOpen={queueModals.purge}
        onClose={queueAdminModalHandlers.closePurge}
        onConfirm={handlePurgeConfirm}
        queueName={queue.name}
      />

      <DeleteQueueModal
        isOpen={queueModals.delete}
        onClose={queueAdminModalHandlers.closeDelete}
        onConfirm={handleDeleteConfirm}
        queueName={queue.name}
      />
    </>
  )
}
