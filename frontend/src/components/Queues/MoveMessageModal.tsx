import React, { useCallback, useMemo, useState } from "react"
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
  const handleConfirm = useCallback(() => onConfirm(id, dest), [onConfirm, id, dest])
  const fields = useMemo(() => [
    { name: 'id', label: 'Message ID', required: true, value: id, onChange: (_: unknown, v: string) => setId(v) },
    { name: 'dest', label: 'Destination', required: true, value: dest, onChange: (_: unknown, v: string) => setDest(v) }
  ], [id, dest])

  return (
    <BaseModal
      title="Move Message"
      isOpen={isOpen}
      onClose={onClose}
      confirmLabel="Move"
      confirmIcon={<ArrowRightIcon />}
      isConfirmDisabled={!id || !dest}
      onConfirm={handleConfirm}
    >
      <FormModal
        fields={fields}
      />
    </BaseModal>
  )
}
