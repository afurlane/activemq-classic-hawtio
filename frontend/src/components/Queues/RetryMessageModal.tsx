import React, { useCallback, useMemo, useState } from "react"
import { BaseModal } from "./BaseModal"
import { RedoIcon } from "@patternfly/react-icons"
import { FormModal } from "./FormModal"

interface RetryMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string) => void
}

export const RetryMessageModal: React.FC<RetryMessageModalProps> = ({
  isOpen, onClose, onConfirm
}) => {
  const [id, setId] = useState('')
  const handleConfirm = useCallback(() => onConfirm(id), [onConfirm, id])
  const handleIdChange = useCallback((_: unknown, value: string) => setId(value), [])
  const fields = useMemo(() => [
    { name: 'id', label: 'Message ID', required: true, value: id, onChange: handleIdChange }
  ], [id, handleIdChange])

  return (
    <BaseModal
      title="Retry Message"
      isOpen={isOpen}
      onClose={onClose}
      confirmLabel="Retry"
      confirmIcon={<RedoIcon />}
      isConfirmDisabled={!id}
      onConfirm={handleConfirm}
    >
      <FormModal fields={fields} />
    </BaseModal>
  )
}
