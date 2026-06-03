import React from 'react'
import {
	Button,
	ButtonVariant,
	ModalFooter,
	ModalHeader,
	ModalBody
} from '@patternfly/react-core';
import {
	Modal
} from '@patternfly/react-core/deprecated';

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
}) => {
  const actions = React.useMemo(
    () => [
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
    ],
    [confirmVariant, confirmIcon, isConfirmDisabled, onConfirm, confirmLabel, onClose]
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose}>      
      <ModalHeader title={title} />
      <ModalBody>{children}</ModalBody>
      <ModalFooter>{actions}</ModalFooter>
    </Modal>
  )
}
