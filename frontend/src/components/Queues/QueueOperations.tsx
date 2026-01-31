import React, { useState } from 'react'
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

export const QueueOperations: React.FC<{ queue: Queue, onAction: () => Promise<void> }> = ({ queue, onAction }) => {
  const [isMoveOpen, setMoveOpen] = useState(false);
  const [isCopyOpen, setCopyOpen] = useState(false);
  const [isRemoveOpen, setRemoveOpen] = useState(false);
  const [isRetryOpen, setRetryOpen] = useState(false);
  const [isRemoveGroupOpen, setRemoveGroupOpen] = useState(false);
  const [isSendOpen, setSendOpen] = useState(false);
  const [showPurge, setShowPurge] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <Button onClick={() => setMoveOpen(true)}>Move Message</Button>
      <Button onClick={() => setCopyOpen(true)}>Copy Message</Button>
      <Button onClick={() => setRemoveOpen(true)}>Remove Message</Button>
      <Button onClick={() => setRetryOpen(true)}>Retry Message</Button>
      <Button onClick={() => setRemoveGroupOpen(true)}>Remove Group</Button>
      <Button onClick={() => setSendOpen(true)}>Send Message</Button>
      <Button variant="secondary" isDisabled={queue.state.paused === true} onClick={() => activemq.pauseQueue(queue.mbean)}>Pause</Button>
      <Button variant="secondary" isDisabled={queue.state.paused === false} onClick={() => activemq.resumeQueue(queue.mbean)}>Resume</Button>
      <Button variant="danger" onClick={() => setShowPurge(true)}>Purge</Button>
      <Button variant="danger" onClick={() => setShowDelete(true)}>Delete Queue</Button>

      <MoveMessageModal
        isOpen={isMoveOpen}
        onClose={() => setMoveOpen(false)}
        onConfirm={async (id, dest) => {
          log.debug("MOVE", id, dest);
          await activemq.moveMessageTo(queue.mbean, id, dest);
          await onAction();
          setMoveOpen(false);
        }}
      />

      <CopyMessageModal
        isOpen={isCopyOpen}
        onClose={() => setCopyOpen(false)}
        onConfirm={async (id, dest) => {
          log.debug("COPY", id, dest);
          await activemq.copyMessageTo(queue.mbean, id, dest);
          await onAction();
          setCopyOpen(false);
        }}
      />

      <RemoveMessageModal
        isOpen={isRemoveOpen}
        onClose={() => setRemoveOpen(false)}
        onConfirm={async (id) => {
          log.debug("REMOVE", id);
          await activemq.removeMessage(queue.mbean, id);
          await onAction();
          setRemoveOpen(false);
        }}
      />

      <RetryMessageModal
        isOpen={isRetryOpen}
        onClose={() => setRetryOpen(false)}
        onConfirm={async(id) => {
          log.debug("RETRY", id);
          await activemq.retryMessage(queue.mbean, id);
          await onAction();
          setRetryOpen(false);
        }}
      />

      <RemoveMessageGroupModal
        isOpen={isRemoveGroupOpen}
        onClose={() => setRemoveGroupOpen(false)}
        onConfirm={async(group) => {
          log.debug("REMOVE GROUP", group);
          await activemq.removeMessageGroup(queue.mbean, group);
          await onAction();
          setRemoveGroupOpen(false);
        }}
      />

      <SendMessageModal
        isOpen={isSendOpen}
        onClose={() => setSendOpen(false)}
        onConfirm={async (body) => {          
          log.debug("SEND", body);
          await activemq.sendTextMessage(queue.mbean, body);
          await onAction();
          setSendOpen(false);
        }}
      />

      <PurgeQueueModal
        isOpen={showPurge}
        onClose={() => setShowPurge(false)}
        onConfirm={() => {
          activemq.purgeQueue(queue.mbean)
          setShowPurge(false) }
        }
        queueName={queue.name}
      />

      <DeleteQueueModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => {
            activemq.deleteQueue(queue.mbean, queue.name);
            setShowDelete(false)
        }}
        queueName={queue.name}
      />
    </>
  )
}
