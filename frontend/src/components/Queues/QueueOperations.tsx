import React, { useCallback, useMemo, useState } from 'react'
import { Button } from '@patternfly/react-core'
import { Queue } from '../../types/domain'
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
  const [isRemoveGroupOpen, setRemoveGroupOpen] = useState(false)
  const [isSendOpen, setSendOpen] = useState(false)
  const [queueModals, setQueueModals] = useState({ purge: false, delete: false })

  const handlePauseClick = useCallback(() => activemq.pauseQueue(queue.mbean), [queue])
  const handleResumeClick = useCallback(() => activemq.resumeQueue(queue.mbean), [queue])

  const queueMessageModalHandlers = useMemo(
    () => ({
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

  const createConfirmHandler = useCallback(
    <T extends unknown[]>(
      actionName: string,
      action: (...args: T) => Promise<unknown>,
      closeModal: () => void,
    ) => {
      return async (...args: T) => {
        log.debug(actionName, ...args)
        await action(...args)
        await onAction()
        closeModal()
      }
    },
    [onAction],
  )

  const handleRemoveGroupConfirm = useMemo(
    () => createConfirmHandler('REMOVE GROUP', (group: string) => activemq.removeMessageGroup(queue.mbean, group), queueMessageModalHandlers.closeRemoveGroup),
    [createConfirmHandler, queue.mbean, queueMessageModalHandlers.closeRemoveGroup],
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
        queueMessageModalHandlers.closeSend,
      ),
    [createConfirmHandler, queue.mbean, queueMessageModalHandlers.closeSend],
  )
  const handlePurgeConfirm = useMemo(
    () => createConfirmHandler('PURGE', () => activemq.purgeQueue(queue.mbean), queueAdminModalHandlers.closePurge),
    [createConfirmHandler, queue.mbean, queueAdminModalHandlers.closePurge],
  )
  const handleDeleteConfirm = useMemo(
    () => createConfirmHandler('DELETE QUEUE', () => activemq.deleteQueue(queue.mbean, queue.name), queueAdminModalHandlers.closeDelete),
    [createConfirmHandler, queue.mbean, queue.name, queueAdminModalHandlers.closeDelete],
  )
  
  return (
    <>
      <Button onClick={queueMessageModalHandlers.openRemoveGroup}>Remove Group</Button>
      <Button onClick={queueMessageModalHandlers.openSend}>Send Message</Button>
      <Button variant="secondary" isDisabled={queue.state.paused === true} onClick={handlePauseClick}>Pause</Button>
      <Button variant="secondary" isDisabled={queue.state.paused === false} onClick={handleResumeClick}>Resume</Button>
      <Button variant="danger" onClick={queueAdminModalHandlers.openPurge}>Purge</Button>
      <Button variant="danger" onClick={queueAdminModalHandlers.openDelete}>Delete Queue</Button>

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
