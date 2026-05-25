import React from 'react'
import {
  Select,
  SelectList,
  SelectOption,
  MenuToggle,
} from '@patternfly/react-core'

import { useBrokers } from '../../hooks/useBrokers'
import { useSelectedBrokerName, useSetBrokerName } from '../../hooks/useSelectedBroker'

export function BrokerSelector() {
  const { brokers } = useBrokers()
  const brokerName = useSelectedBrokerName()
  const setBrokerName = useSetBrokerName()

  const [open, setOpen] = React.useState(false)

  const handleToggleClick = React.useCallback(() => {
    setOpen(prevOpen => !prevOpen)
  }, [])

  const renderToggle = React.useCallback(
    (toggleRef: React.Ref<HTMLButtonElement>) => (
      <MenuToggle ref={toggleRef} onClick={handleToggleClick} isExpanded={open}>
        {brokerName ?? 'Select broker'}
      </MenuToggle>
    ),
    [brokerName, handleToggleClick, open],
  )

  const handleSelect = React.useCallback(
    (_event: unknown, value: string | number | undefined) => {
      if (typeof value === 'string') {
        setBrokerName(value)
        setOpen(false)
      }
    },
    [setBrokerName],
  )

  return (
    <Select
      isOpen={open}
      selected={brokerName ?? undefined}
      onOpenChange={setOpen}
      onSelect={handleSelect}
      toggle={renderToggle}
    >
      <SelectList>
        {brokers.map(b => (
          <SelectOption key={b.name} value={b.name}>
            {b.name}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  )
}
