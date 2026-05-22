import React, { useCallback, useMemo, useState } from "react"
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
  const handleConfirm = useCallback(() => onConfirm(id), [onConfirm, id])
  const handleIdChange = useCallback((_: unknown, v: string) => setId(v), [])
  const fields = useMemo(
    () => [{ name: 'id', label: 'Message ID', required: true, value: id, onChange: handleIdChange }],
    [id, handleIdChange]
  )

  return (
    <BaseModal
      title="Remove Message"
      isOpen={isOpen}
      onClose={onClose}
      confirmLabel="Remove"
      confirmIcon={<TrashIcon />}
      confirmVariant={ButtonVariant.danger}
      isConfirmDisabled={!id}
      onConfirm={handleConfirm}
    >
      <FormModal
        fields={fields}
      />
    </BaseModal>
  )
}
