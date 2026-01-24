import React, { useState } from 'react'
import {
  Modal,
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  TextInput,
  TextArea,
} from '@patternfly/react-core'

import {
  ArrowRightIcon,
  CopyIcon,
  TrashIcon,
  RedoIcon,
  TimesIcon,
  EnvelopeIcon
} from '@patternfly/react-icons'

interface MoveMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string, dest: string) => void
}

interface CopyMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string, dest: string) => void
}

interface RemoveMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string) => void
}

interface RetryMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string) => void
}

interface RemoveMessageGroupModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (group: string) => void
}

interface SendMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (body: string) => void
}

/* -------------------------------------------
   Move Message
------------------------------------------- */
export const MoveMessageModal: React.FC<MoveMessageModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [id, setId] = useState('')
  const [dest, setDest] = useState('')

  return (
    <Modal
      title="Move Message"
      isOpen={isOpen}
      onClose={onClose}
      actions={[
        <Button
          key="confirm"
          variant={ButtonVariant.primary}
          icon={<ArrowRightIcon />}
          isDisabled={!id || !dest}
          onClick={() => onConfirm(id, dest)}
        >
          Move
        </Button>,
        <Button key="cancel" variant={ButtonVariant.secondary} onClick={onClose}>
          Cancel
        </Button>
      ]}
    >
      <Form>
        <FormGroup label="Message ID" isRequired>
          <TextInput value={id} onChange={(_, v) => setId(v)} />
        </FormGroup>

        <FormGroup label="Destination" isRequired>
          <TextInput value={dest} onChange={(_, v) => setDest(v)} />
        </FormGroup>
      </Form>
    </Modal>
  )
}

/* -------------------------------------------
   Copy Message
------------------------------------------- */
export const CopyMessageModal: React.FC<CopyMessageModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [id, setId] = useState('')
  const [dest, setDest] = useState('')

  return (
    <Modal
      title="Copy Message"
      isOpen={isOpen}
      onClose={onClose}
      actions={[
        <Button
          key="confirm"
          variant={ButtonVariant.primary}
          icon={<CopyIcon />}
          isDisabled={!id || !dest}
          onClick={() => onConfirm(id, dest)}
        >
          Copy
        </Button>,
        <Button key="cancel" variant={ButtonVariant.secondary} onClick={onClose}>
          Cancel
        </Button>
      ]}
    >
      <Form>
        <FormGroup label="Message ID" isRequired>
          <TextInput value={id} onChange={(_, v) => setId(v)} />
        </FormGroup>

        <FormGroup label="Destination" isRequired>
          <TextInput value={dest} onChange={(_, v) => setDest(v)} />
        </FormGroup>
      </Form>
    </Modal>
  )
}

/* -------------------------------------------
   Remove Message
------------------------------------------- */
export const RemoveMessageModal: React.FC<RemoveMessageModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [id, setId] = useState('')

  return (
    <Modal
      title="Remove Message"
      isOpen={isOpen}
      onClose={onClose}
      actions={[
        <Button
          key="confirm"
          variant={ButtonVariant.danger}
          icon={<TrashIcon />}
          isDisabled={!id}
          onClick={() => onConfirm(id)}
        >
          Remove
        </Button>,
        <Button key="cancel" variant={ButtonVariant.secondary} onClick={onClose}>
          Cancel
        </Button>
      ]}
    >
      <Form>
        <FormGroup label="Message ID" isRequired>
          <TextInput value={id} onChange={(_, v) => setId(v)} />
        </FormGroup>
      </Form>
    </Modal>
  )
}

/* -------------------------------------------
   Retry Single Message
------------------------------------------- */
export const RetryMessageModal: React.FC<RetryMessageModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [id, setId] = useState('')

  return (
    <Modal
      title="Retry Message"
      isOpen={isOpen}
      onClose={onClose}
      actions={[
        <Button
          key="confirm"
          variant={ButtonVariant.primary}
          icon={<RedoIcon />}
          isDisabled={!id}
          onClick={() => onConfirm(id)}
        >
          Retry
        </Button>,
        <Button key="cancel" variant={ButtonVariant.secondary} onClick={onClose}>
          Cancel
        </Button>
      ]}
    >
      <Form>
        <FormGroup label="Message ID" isRequired>
          <TextInput value={id} onChange={(_, v) => setId(v)} />
        </FormGroup>
      </Form>
    </Modal>
  )
}

/* -------------------------------------------
   Remove Message Group
------------------------------------------- */
export const RemoveMessageGroupModal: React.FC<RemoveMessageGroupModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [group, setGroup] = useState('')

  return (
    <Modal
      title="Remove Message Group"
      isOpen={isOpen}
      onClose={onClose}
      actions={[
        <Button
          key="confirm"
          variant={ButtonVariant.danger}
          icon={<TimesIcon />}
          isDisabled={!group}
          onClick={() => onConfirm(group)}
        >
          Remove Group
        </Button>,
        <Button key="cancel" variant={ButtonVariant.secondary} onClick={onClose}>
          Cancel
        </Button>
      ]}
    >
      <Form>
        <FormGroup label="Group Name" isRequired>
          <TextInput value={group} onChange={(_, v) => setGroup(v)} />
        </FormGroup>
      </Form>
    </Modal>
  )
}

/* -------------------------------------------
   Send Message
------------------------------------------- */
export const SendMessageModal: React.FC<SendMessageModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [body, setBody] = useState('')

  return (
    <Modal
      title="Send Text Message"
      isOpen={isOpen}
      onClose={onClose}
      actions={[
        <Button
          key="confirm"
          variant={ButtonVariant.primary}
          icon={<EnvelopeIcon />}
          isDisabled={!body}
          onClick={() => onConfirm(body)}
        >
          Send
        </Button>,
        <Button key="cancel" variant={ButtonVariant.secondary} onClick={onClose}>
          Cancel
        </Button>
      ]}
    >
      <Form>
        <FormGroup label="Message Body" isRequired>
          <TextArea
            id="message-body"
            value={body}
            onChange={(_, v) => setBody(v)}
            resizeOrientation="vertical"
          />
        </FormGroup>
      </Form>
    </Modal>
  )
}
