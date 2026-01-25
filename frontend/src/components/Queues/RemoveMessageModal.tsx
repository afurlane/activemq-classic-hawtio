import React, { useState } from "react"
import { BaseModal } from "./BaseModal"
import { TrashIcon } from "@patternfly/react-icons"
import { ButtonVariant } from "@patternfly/react-core"
import { FormModal } from "./FormModal"

interface RemoveMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string) => void
}

export const RemoveMessageModal: React.FC<RemoveMessageModalProps> = ({
  isOpen, onClose, onConfirm
}) => {
  const [id, setId] = useState('')

  return (
    <BaseModal
      title="Remove Message"
      isOpen={isOpen}
      onClose={onClose}
      confirmLabel="Remove"
      confirmIcon={<TrashIcon />}
      confirmVariant={ButtonVariant.danger}
      isConfirmDisabled={!id}
      onConfirm={() => onConfirm(id)}
    >
      <FormModal
        fields={[
          { name: 'id', label: 'Message ID', required: true, value: id, onChange: setId }
        ]}
      />
    </BaseModal>
  )
}
