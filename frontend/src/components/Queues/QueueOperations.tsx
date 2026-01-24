import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Grid,
  GridItem,
  Flex,
  FlexItem,
  Button,
  Alert
} from '@patternfly/react-core'

import {
  ArrowRightIcon,
  CopyIcon,
  TrashIcon,
  RedoIcon,
  TimesIcon,
  EnvelopeIcon
} from '@patternfly/react-icons'

import { activemq, getBrokerMBean } from '../../services/activemq/ActiveMQClassicService'
import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'
import { Queue } from '../../types/domain'

import {
  MoveMessageModal,
  CopyMessageModal,
  RemoveMessageModal,
  RetryMessageModal,
  RemoveMessageGroupModal,
  SendMessageModal
} from './QueueOperationModals'

type OperationName =
  | 'moveMessage'
  | 'copyMessage'
  | 'removeMessage'
  | 'retryMessage'
  | 'removeMessageGroup'
  | 'sendMessage'

export const QueueOperations: React.FC<{
  queue: Queue
  onAction: () => Promise<void>
}> = ({ queue, onAction }) => {

  const brokerName = useSelectedBrokerName()
  const mbean = queue.mbean

  const [modal, setModal] = useState<OperationName | null>(null)
  const [confirm, setConfirm] = useState<{ message: string, action: () => Promise<void> } | null>(null)

  if (!brokerName) {
    return <Alert variant="danger" title="No broker selected" isInline />
  }

  const open = (name: OperationName) => setModal(name)
  const close = () => setModal(null)

  const run = async (fn: () => Promise<any>) => {
    await fn()
    await onAction()
    close()
  }

  const confirmAction = (message: string, action: () => Promise<void>) => {
    setConfirm({ message, action })
  }

  return (
    <Grid hasGutter>

      {/* Queue Control */}
      <GridItem span={6}>
        <Card isFlat className="pf-v5-u-mb-lg">
          <CardHeader><CardTitle>Queue Control</CardTitle></CardHeader>
          <CardBody>
            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <Button
                  variant="warning"
                  icon={<TrashIcon />}
                  onClick={() =>
                    confirmAction(
                      `Purge all messages from ${queue.name}?`,
                      () => run(() => activemq.purgeQueue(mbean))
                    )
                  }
                >
                  Purge
                </Button>
              </FlexItem>

              <FlexItem>
                {queue.state.paused ? (
                  <Button icon={<RedoIcon />} onClick={() => run(() => activemq.resumeQueue(mbean))}>
                    Resume
                  </Button>
                ) : (
                  <Button icon={<TimesIcon />} onClick={() => run(() => activemq.pauseQueue(mbean))}>
                    Pause
                  </Button>
                )}
              </FlexItem>

              <FlexItem>
                <Button icon={<RedoIcon />} onClick={() => run(() => activemq.resetStats(mbean))}>
                  Reset Stats
                </Button>
              </FlexItem>

              <FlexItem>
                <Button
                  variant="danger"
                  icon={<TrashIcon />}
                  onClick={() =>
                    confirmAction(
                      `Delete queue ${queue.name}? This cannot be undone.`,
                      () =>
                        run(() =>
                          activemq.deleteQueue(
                            getBrokerMBean(brokerName),
                            queue.name
                          )
                        )
                    )
                  }
                >
                  Delete
                </Button>
              </FlexItem>
            </Flex>
          </CardBody>
        </Card>
      </GridItem>

      {/* DLQ Tools */}
      {queue.state.dlq && (
        <GridItem span={6}>
          <Card isFlat className="pf-v5-u-mb-lg">
            <CardHeader><CardTitle>DLQ Tools</CardTitle></CardHeader>
            <CardBody>
              <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                <FlexItem>
                  <Button
                    variant="warning"
                    icon={<RedoIcon />}
                    onClick={() =>
                      confirmAction(
                        `Retry ALL messages in DLQ ${queue.name}?`,
                        () => run(() => activemq.retryMessages(mbean))
                      )
                    }
                  >
                    Retry All
                  </Button>
                </FlexItem>

                <FlexItem>
                  <Button icon={<RedoIcon />} onClick={() => open('retryMessage')}>
                    Retry Single
                  </Button>
                </FlexItem>
              </Flex>
            </CardBody>
          </Card>
        </GridItem>
      )}

      {/* Message Tools */}
      <GridItem span={6}>
        <Card isFlat className="pf-v5-u-mb-lg">
          <CardHeader><CardTitle>Message Tools</CardTitle></CardHeader>
          <CardBody>
            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <Button icon={<ArrowRightIcon />} onClick={() => open('moveMessage')}>
                  Move
                </Button>
              </FlexItem>

              <FlexItem>
                <Button icon={<CopyIcon />} onClick={() => open('copyMessage')}>
                  Copy
                </Button>
              </FlexItem>

              <FlexItem>
                <Button icon={<TrashIcon />} onClick={() => open('removeMessage')}>
                  Remove
                </Button>
              </FlexItem>
            </Flex>
          </CardBody>
        </Card>
      </GridItem>

      {/* Message Groups */}
      <GridItem span={6}>
        <Card isFlat className="pf-v5-u-mb-lg">
          <CardHeader><CardTitle>Message Groups</CardTitle></CardHeader>
          <CardBody>
            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <Button
                  variant="warning"
                  icon={<TrashIcon />}
                  onClick={() =>
                    confirmAction(
                      `Remove ALL message groups from ${queue.name}?`,
                      () => run(() => activemq.removeAllMessageGroups(mbean))
                    )
                  }
                >
                  Remove All
                </Button>
              </FlexItem>

              <FlexItem>
                <Button icon={<TimesIcon />} onClick={() => open('removeMessageGroup')}>
                  Remove Group
                </Button>
              </FlexItem>
            </Flex>
          </CardBody>
        </Card>
      </GridItem>

      {/* Send Message */}
      <GridItem span={6}>
        <Card isFlat className="pf-v5-u-mb-lg">
          <CardHeader><CardTitle>Send Message</CardTitle></CardHeader>
          <CardBody>
            <Button icon={<EnvelopeIcon />} onClick={() => open('sendMessage')}>
              Send Text Message
            </Button>
          </CardBody>
        </Card>
      </GridItem>

      {/* MODALS */}
      {modal === 'moveMessage' && (
        <MoveMessageModal
          isOpen
          onClose={close}
          onConfirm={(id, dest) =>
            confirmAction(
              `Move message ${id} to ${dest}?`,
              () => run(() => activemq.moveMessageTo(mbean, id, dest))
            )
          }
        />
      )}

      {modal === 'copyMessage' && (
        <CopyMessageModal
          isOpen
          onClose={close}
          onConfirm={(id, dest) =>
            confirmAction(
              `Copy message ${id} to ${dest}?`,
              () => run(() => activemq.copyMessageTo(mbean, id, dest))
            )
          }
        />
      )}

      {modal === 'removeMessage' && (
        <RemoveMessageModal
          isOpen
          onClose={close}
          onConfirm={(id) =>
            confirmAction(
              `Remove message ${id}?`,
              () => run(() => activemq.removeMessage(mbean, id))
            )
          }
        />
      )}

      {modal === 'retryMessage' && (
        <RetryMessageModal
          isOpen
          onClose={close}
          onConfirm={(id) =>
            confirmAction(
              `Retry message ${id}?`,
              () => run(() => activemq.retryMessage(mbean, id))
            )
          }
        />
      )}

      {modal === 'removeMessageGroup' && (
        <RemoveMessageGroupModal
          isOpen
          onClose={close}
          onConfirm={(group) =>
            confirmAction(
              `Remove message group ${group}?`,
              () => run(() => activemq.removeMessageGroup(mbean, group))
            )
          }
        />
      )}

      {modal === 'sendMessage' && (
        <SendMessageModal
          isOpen
          onClose={close}
          onConfirm={(body) =>
            confirmAction(
              `Send message to ${queue.name}?`,
              () => run(() => activemq.sendTextMessage(mbean, body))
            )
          }
        />
      )}

    </Grid>
  )
}

