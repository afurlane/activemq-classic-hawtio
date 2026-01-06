import React, { useState } from 'react';
import { activemq } from '../../services/activemq';
import { QueueInfo } from '../../types/activemq';
import './queues.css';

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
    <div className="operations">

      {/* Queue Control */}
      <h3>Queue Control</h3>

      <button
        onClick={() =>
          confirmAction(
            `Are you sure you want to purge all messages from ${queue.name}?`,
            () => run(() => activemq.purgeQueue(mbean))
          )
        }
      >
        Purge
      </button>

      {queue.paused ? (
        <button onClick={() => run(() => activemq.resumeQueue(mbean))}>Resume</button>
      ) : (
        <button onClick={() => run(() => activemq.pauseQueue(mbean))}>Pause</button>
      )}

      <button onClick={() => run(() => activemq.resetStats(mbean))}>Reset Stats</button>

      <button
        className="danger"
        onClick={() =>
          confirmAction(
            `Delete queue ${queue.name}? This cannot be undone.`,
            () => run(() => activemq.deleteQueue(queue.name))
          )
        }
      >
        Delete Queue
      </button>

      {/* DLQ Tools */}
      {queue.dlq && (
        <>
          <h3>DLQ Tools</h3>

          <button
            onClick={() =>
              confirmAction(
                `Retry ALL messages in DLQ ${queue.name}?`,
                () => run(() => activemq.retryMessages(mbean))
              )
            }
          >
            Retry All Messages
          </button>

          <button onClick={() => open('retryMessage')}>Retry Single Message</button>
        </>
      )}

      {/* Message Tools */}
      <h3>Message Tools</h3>
      <button onClick={() => open('moveMessage')}>Move Message</button>
      <button onClick={() => open('copyMessage')}>Copy Message</button>
      <button
        onClick={() =>
          open('removeMessage')
        }
      >
        Remove Message
      </button>

      {/* Bulk Tools */}
      <h3>Bulk Tools</h3>
      <button onClick={() => open('moveMatching')}>Move Matching Messages</button>
      <button onClick={() => open('copyMatching')}>Copy Matching Messages</button>
      <button onClick={() => open('removeMatching')}>Remove Matching Messages</button>

      {/* Message Groups */}
      <h3>Message Groups</h3>

      <button
        onClick={() =>
          confirmAction(
            `Remove ALL message groups from ${queue.name}?`,
            () => run(() => activemq.removeAllMessageGroups(mbean))
          )
        }
      >
        Remove All Message Groups
      </button>

      <button onClick={() => open('removeMessageGroup')}>Remove Message Group</button>

      {/* Send Message */}
      <h3>Send Message</h3>
      <button onClick={() => open('sendMessage')}>Send Text Message</button>

      {/* Confirmation Modal */}
      {confirm && (
        <div className="modal">
          <div className="modal-content">
            <h4>Confirm</h4>
            <p>{confirm.message}</p>
            <button onClick={() => confirm.action()}>Yes, proceed</button>
            <button className="close" onClick={() => setConfirm(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Operation Modals */}
      {modal && (
        <div className="modal">
          <div className="modal-content">
            {modal === 'retryMessage' && (
              <>
                <h4>Retry Message</h4>
                <input
                  placeholder="Message ID"
                  onChange={e => update('id', e.target.value)}
                />
                <button onClick={() =>
                  run(() => activemq.retryMessage(mbean, form.id as string))
                }>
                  Retry
                </button>
              </>
            )}

            {modal === 'moveMessage' && (
              <>
                <h4>Move Message</h4>
                <input
                  placeholder="Message ID"
                  onChange={e => update('id', e.target.value)}
                />
                <input
                  placeholder="Destination"
                  onChange={e => update('dest', e.target.value)}
                />
                <button onClick={() =>
                  confirmAction(
                    `Move message ${form.id} to ${form.dest}?`,
                    () => run(() =>
                      activemq.moveMessageTo(
                        mbean,
                        form.id as string,
                        form.dest as string
                      )
                    )
                  )
                }>
                  Move
                </button>
              </>
            )}

            {/* … (tutte le altre modali analoghe) … */}

            <button className="close" onClick={close}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
