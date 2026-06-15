import React, { useCallback, useMemo, useState } from "react"
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
  const handleConfirm = useCallback(() => onConfirm(id, dest), [onConfirm, id, dest])
  const fields = useMemo(() => [
    { name: 'id', label: 'Message ID', required: true, value: id, onChange: (_: unknown, value: string) => setId(value) },
    { name: 'dest', label: 'Destination', required: true, value: dest, onChange: (_: unknown, value: string) => setDest(value) }
  ], [id, dest])

  return (
    <BaseModal
      title="Copy Message"
      isOpen={isOpen}
      onClose={onClose}
      confirmLabel="Copy"
      confirmIcon={<CopyIcon />}
      isConfirmDisabled={!id || !dest}
      onConfirm={handleConfirm}
    >
      <FormModal fields={fields} />
    </BaseModal>
  )
}
