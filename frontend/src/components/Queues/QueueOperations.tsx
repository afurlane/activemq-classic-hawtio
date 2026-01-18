import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Title,
  Button,
  ButtonVariant,
  Modal,
  Form,
  FormGroup,
  TextInput,
  Toolbar,
  ToolbarContent,
  ToolbarGroup
} from '@patternfly/react-core';

import { activemq } from '../../services/activemq';
import { QueueInfo } from '../../types/activemq';

interface QueueOperationsProps {
  queue: QueueInfo;
  onAction: () => Promise<void>;
}

type OperationName =
  | 'retryMessage'
  | 'moveMessage'
  | 'copyMessage'
  | 'removeMessage'
  | 'moveMatching'
  | 'copyMatching'
  | 'removeMatching'
  | 'removeMessageGroup'
  | 'sendMessage';

export const QueueOperations: React.FC<QueueOperationsProps> = ({ queue, onAction }) => {
  const mbean = queue.mbean;

  const [modal, setModal] = useState<OperationName | null>(null);
  const [form, setForm] = useState<Record<string, string | number>>({});
  const [confirm, setConfirm] = useState<{
    message: string;
    action: () => Promise<void>;
  } | null>(null);

  const open = (name: OperationName) => {
    setForm({});
    setModal(name);
  };

  const close = () => setModal(null);

  const update = (field: string, value: string | number) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const run = async (fn: () => Promise<any>) => {
    await fn();
    await onAction();
    close();
  };

  const confirmAction = (message: string, action: () => Promise<void>) => {
    setConfirm({ message, action });
  };

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Queue Control</Title>

        <Toolbar>
          <ToolbarContent>
            <ToolbarGroup>
              <Button
                variant={ButtonVariant.warning}
                onClick={() =>
                  confirmAction(
                    `Are you sure you want to purge all messages from ${queue.name}?`,
                    () => run(() => activemq.purgeQueue(mbean))
                  )
                }
              >
                Purge
              </Button>

              {queue.paused ? (
                <Button onClick={() => run(() => activemq.resumeQueue(mbean))}>
                  Resume
                </Button>
              ) : (
                <Button onClick={() => run(() => activemq.pauseQueue(mbean))}>
                  Pause
                </Button>
              )}

              <Button onClick={() => run(() => activemq.resetStats(mbean))}>
                Reset Stats
              </Button>

              <Button
                variant={ButtonVariant.danger}
                onClick={() =>
                  confirmAction(
                    `Delete queue ${queue.name}? This cannot be undone.`,
                    () => run(() => activemq.deleteQueue(queue.name))
                  )
                }
              >
                Delete Queue
              </Button>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        {queue.dlq && (
          <>
            <Title headingLevel="h4" style={{ marginTop: '1rem' }}>
              DLQ Tools
            </Title>

            <Toolbar>
              <ToolbarContent>
                <ToolbarGroup>
                  <Button
                    variant={ButtonVariant.warning}
                    onClick={() =>
                      confirmAction(
                        `Retry ALL messages in DLQ ${queue.name}?`,
                        () => run(() => activemq.retryMessages(mbean))
                      )
                    }
                  >
                    Retry All Messages
                  </Button>

                  <Button onClick={() => open('retryMessage')}>
                    Retry Single Message
                  </Button>
                </ToolbarGroup>
              </ToolbarContent>
            </Toolbar>
          </>
        )}

        <Title headingLevel="h4" style={{ marginTop: '1rem' }}>
          Message Tools
        </Title>

        <Toolbar>
          <ToolbarContent>
            <ToolbarGroup>
              <Button onClick={() => open('moveMessage')}>Move Message</Button>
              <Button onClick={() => open('copyMessage')}>Copy Message</Button>
              <Button onClick={() => open('removeMessage')}>Remove Message</Button>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        <Title headingLevel="h4" style={{ marginTop: '1rem' }}>
          Bulk Tools
        </Title>

        <Toolbar>
          <ToolbarContent>
            <ToolbarGroup>
              <Button onClick={() => open('moveMatching')}>
                Move Matching Messages
              </Button>
              <Button onClick={() => open('copyMatching')}>
                Copy Matching Messages
              </Button>
              <Button onClick={() => open('removeMatching')}>
                Remove Matching Messages
              </Button>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        <Title headingLevel="h4" style={{ marginTop: '1rem' }}>
          Message Groups
        </Title>

        <Toolbar>
          <ToolbarContent>
            <ToolbarGroup>
              <Button
                variant={ButtonVariant.warning}
                onClick={() =>
                  confirmAction(
                    `Remove ALL message groups from ${queue.name}?`,
                    () => run(() => activemq.removeAllMessageGroups(mbean))
                  )
                }
              >
                Remove All Message Groups
              </Button>

              <Button onClick={() => open('removeMessageGroup')}>
                Remove Message Group
              </Button>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        <Title headingLevel="h4" style={{ marginTop: '1rem' }}>
          Send Message
        </Title>

        <Button onClick={() => open('sendMessage')}>Send Text Message</Button>

        {/* Confirmation Modal */}
        {confirm && (
          <Modal
            title="Confirm"
            isOpen={true}
            onClose={() => setConfirm(null)}
            actions={[
              <Button key="confirm" variant={ButtonVariant.danger} onClick={() => confirm.action()}>
                Yes, proceed
              </Button>,
              <Button key="cancel" variant={ButtonVariant.secondary} onClick={() => setConfirm(null)}>
                Cancel
              </Button>
            ]}
          >
            {confirm.message}
          </Modal>
        )}

        {/* Operation Modals */}
        {modal && (
          <Modal
            title={modal}
            isOpen={true}
            onClose={close}
            actions={[
              <Button key="close" variant={ButtonVariant.secondary} onClick={close}>
                Close
              </Button>
            ]}
          >
            <Form>
              {modal === 'retryMessage' && (
                <>
                  <FormGroup label="Message ID" fieldId="retry-id">
                    <TextInput
                      id="retry-id"
                      onChange={(event) => update('id', event.currentTarget.value)}
                    />
                  </FormGroup>

                  <Button
                    variant={ButtonVariant.primary}
                    onClick={() =>
                      run(() => activemq.retryMessage(mbean, form.id as string))
                    }
                  >
                    Retry
                  </Button>
                </>
              )}

              {modal === 'moveMessage' && (
                <>
                  <FormGroup label="Message ID" fieldId="move-id">
                    <TextInput
                      id="move-id"
                      onChange={(event) => update('id', event.currentTarget.value)}
                    />
                  </FormGroup>

                  <FormGroup label="Destination" fieldId="move-dest">
                    <TextInput
                      id="move-dest"
                      onChange={(event) => update('id', event.currentTarget.value)}
                    />
                  </FormGroup>

                  <Button
                    variant={ButtonVariant.primary}
                    onClick={() =>
                      confirmAction(
                        `Move message ${form.id} to ${form.dest}?`,
                        () =>
                          run(() =>
                            activemq.moveMessageTo(
                              mbean,
                              form.id as string,
                              form.dest as string
                            )
                          )
                      )
                    }
                  >
                    Move
                  </Button>
                </>
              )}

              {/* Qui puoi aggiungere tutte le altre modali nello stesso stile */}
            </Form>
          </Modal>
        )}
      </CardBody>
    </Card>
  );
};
