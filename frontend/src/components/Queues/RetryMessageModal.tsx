import { useState } from "react"
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

  return (
    <BaseModal
      title="Retry Message"
      isOpen={isOpen}
      onClose={onClose}
      confirmLabel="Retry"
      confirmIcon={<RedoIcon />}
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
