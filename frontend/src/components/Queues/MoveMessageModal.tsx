import React, { useState } from "react"
import { ArrowRightIcon } from "@patternfly/react-icons"
import { BaseModal } from "./BaseModal"
import { FormModal } from "./FormModal"

interface MoveMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string, dest: string) => void
}

export const MoveMessageModal: React.FC<MoveMessageModalProps> = ({
  isOpen, onClose, onConfirm
}) => {
  const [id, setId] = useState('')
  const [dest, setDest] = useState('')

  return (
    <BaseModal
      title="Move Message"
      isOpen={isOpen}
      onClose={onClose}
      confirmLabel="Move"
      confirmIcon={<ArrowRightIcon />}
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
