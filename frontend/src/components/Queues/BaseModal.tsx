import React from 'react'
import {
  Modal,
  Button,
  ButtonVariant
} from '@patternfly/react-core'

interface BaseModalProps {
  title: string
  isOpen: boolean
  onClose: () => void
  confirmLabel: string
  confirmIcon?: React.ReactNode
  confirmVariant?: ButtonVariant
  isConfirmDisabled?: boolean
  onConfirm: () => void
  children: React.ReactNode
}

export const BaseModal: React.FC<BaseModalProps> = ({
  title,
  isOpen,
  onClose,
  confirmLabel,
  confirmIcon,
  confirmVariant = ButtonVariant.primary,
  isConfirmDisabled,
  onConfirm,
  children
}) => (
  <Modal
    title={title}
    isOpen={isOpen}
    onClose={onClose}
    actions={[
      <Button
        key="confirm"
        variant={confirmVariant}
        icon={confirmIcon}
        isDisabled={isConfirmDisabled}
        onClick={onConfirm}
      >
        {confirmLabel}
      </Button>,
      <Button key="cancel" variant={ButtonVariant.secondary} onClick={onClose}>
        Cancel
      </Button>
    ]}
  >
    {children}
  </Modal>
)
