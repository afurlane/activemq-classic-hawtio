import { TimesIcon } from "@patternfly/react-icons"
import { BaseModal } from "./BaseModal"
import { ButtonVariant } from "@patternfly/react-core"
import React, { useCallback, useMemo, useState } from "react"
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
  const handleConfirm = useCallback(() => onConfirm(group), [onConfirm, group])
  const handleGroupChange = useCallback((_: unknown, value: string) => setGroup(value), [])
  const fields = useMemo(() => [
    { name: 'group', label: 'Group Name', required: true, value: group, onChange: handleGroupChange }
  ], [group, handleGroupChange])

  return (
    <BaseModal
      title="Remove Message Group"
      isOpen={isOpen}
      onClose={onClose}
      confirmLabel="Remove Group"
      confirmIcon={<TimesIcon />}
      confirmVariant={ButtonVariant.danger}
      isConfirmDisabled={!group}
      onConfirm={handleConfirm}
    >
      <FormModal
        fields={fields}
      />
    </BaseModal>
  )
}
