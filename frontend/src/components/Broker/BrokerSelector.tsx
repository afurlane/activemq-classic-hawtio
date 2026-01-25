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

  return (
    <Select
      isOpen={open}
      selected={brokerName ?? undefined}
      onOpenChange={setOpen}
      toggle={toggleRef => (
        <MenuToggle
          ref={toggleRef}
          onClick={() => setOpen(!open)}
          isExpanded={open}
        >
          {brokerName ?? 'Select broker'}
        </MenuToggle>
      )}
    >
      <SelectList>
        {brokers.map(b => (
          <SelectOption
            key={b.name}
            value={b.name}
            onClick={() => {
              setBrokerName(b.name)
              setOpen(false)
            }}
          >
            {b.name}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  )
}
