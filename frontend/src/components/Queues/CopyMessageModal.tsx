import React, { useState } from "react"
import { BaseModal } from "./BaseModal"
import { CopyIcon } from "@patternfly/react-icons"
import { FormModal } from "./FormModal"

interface CopyMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string, dest: string) => void
}

export const CopyMessageModal: React.FC<CopyMessageModalProps> = ({
  isOpen, onClose, onConfirm
}) => {
  const [id, setId] = useState('')
  const [dest, setDest] = useState('')

  return (
    <BaseModal
      title="Copy Message"
      isOpen={isOpen}
      onClose={onClose}
      confirmLabel="Copy"
      confirmIcon={<CopyIcon />}
      isConfirmDisabled={!id || !dest}
      onConfirm={() => onConfirm(id, dest)}
    >
      <FormModal
        fields={[
          { name: 'id', label: 'Message ID', required: true, value: id, onChange: setId },
          { name: 'dest', label: 'Destination', required: true, value: dest, onChange: setDest }
        ]}
      />
    </BaseModal>
  )
}
