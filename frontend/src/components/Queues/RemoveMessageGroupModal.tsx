import { TimesIcon } from "@patternfly/react-icons"
import { BaseModal } from "./BaseModal"
import { ButtonVariant } from "@patternfly/react-core"
import { useState } from "react"
import { FormModal } from "./FormModal"

interface RemoveMessageGroupModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (group: string) => void
}

export const RemoveMessageGroupModal: React.FC<RemoveMessageGroupModalProps> = ({
  isOpen, onClose, onConfirm
}) => {
  const [group, setGroup] = useState('')

  return (
    <BaseModal
      title="Remove Message Group"
      isOpen={isOpen}
      onClose={onClose}
      confirmLabel="Remove Group"
      confirmIcon={<TimesIcon />}
      confirmVariant={ButtonVariant.danger}
      isConfirmDisabled={!group}
      onConfirm={() => onConfirm(group)}
    >
      <FormModal
        fields={[
          { name: 'group', label: 'Group Name', required: true, value: group, onChange: setGroup }
        ]}
      />
    </BaseModal>
  )
}
