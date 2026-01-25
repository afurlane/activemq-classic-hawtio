import { useState } from "react"
import { BaseModal } from "./BaseModal"
import { EnvelopeIcon } from "@patternfly/react-icons"
import { FormModal } from "./FormModal"

interface SendMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (body: string) => void
}

export const SendMessageModal: React.FC<SendMessageModalProps> = ({
  isOpen, onClose, onConfirm
}) => {
  const [body, setBody] = useState('')

  return (
    <BaseModal
      title="Send Text Message"
      isOpen={isOpen}
      onClose={onClose}
      confirmLabel="Send"
      confirmIcon={<EnvelopeIcon />}
      isConfirmDisabled={!body}
      onConfirm={() => onConfirm(body)}
    >
      <FormModal
        fields={[
          { name: 'body', label: 'Message Body', required: true, type: 'textarea', value: body, onChange: setBody }
        ]}
      />
    </BaseModal>
  )
}
