import React from 'react'
import {
  Select,
  SelectList,
  SelectOption,
  MenuToggle,
} from '@patternfly/react-core'
import { useBroker } from '../../hooks/useBrokers'


export function BrokerSelector() {
  const { brokers, broker, setBroker } = useBroker()
  const [open, setOpen] = React.useState(false)

  return (
    <Select
      isOpen={open}
      selected={broker?.name}
      onOpenChange={setOpen}
      toggle={toggleRef => (
        <MenuToggle
          ref={toggleRef}
          onClick={() => setOpen(!open)}
          isExpanded={open}
        >
          {broker?.name ?? 'Select broker'}
        </MenuToggle>
      )}
    >
      <SelectList>
        {brokers.map(b => (
          <SelectOption
            key={b.name}
            value={b.name}
            onClick={() => {
              setBroker(b)
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
