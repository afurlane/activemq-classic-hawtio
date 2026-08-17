import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
  Button,
  FormGroup,
  MenuToggle,
  Select,
  SelectList,
  SelectOption,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
} from '@patternfly/react-core'
import { TimesIcon } from '@patternfly/react-icons'

const createNewDestinationValue = '__create_new_destination__'

interface MessageDestinationFieldProps {
  destination: string
  availableQueues: string[]
  onDestinationChange: (value: string) => void
}

export const MessageDestinationField: React.FC<MessageDestinationFieldProps> = ({
  destination,
  availableQueues,
  onDestinationChange,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const textInputRef = useRef<HTMLInputElement>(null)

  const normalizedDestination = destination.trim()

  const filteredQueues = useMemo(() => {
    if (!normalizedDestination) {
      return availableQueues
    }

    return availableQueues.filter((queueName) => (
      queueName.toLowerCase().includes(normalizedDestination.toLowerCase())
    ))
  }, [availableQueues, normalizedDestination])

  const canCreateNewQueue = useMemo(() => (
    normalizedDestination.length > 0 && !availableQueues.includes(normalizedDestination)
  ), [availableQueues, normalizedDestination])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  const openMenu = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleSelect = useCallback((_: unknown, value: string | number | undefined) => {
    if (typeof value !== 'string') {
      return
    }

    if (value === createNewDestinationValue) {
      onDestinationChange(normalizedDestination)
    } else {
      onDestinationChange(value)
    }

    closeMenu()
  }, [closeMenu, normalizedDestination, onDestinationChange])

  const handleDestinationInputChange = useCallback((_: unknown, value: string) => {
    onDestinationChange(value)
    if (!isOpen) {
      openMenu()
    }
  }, [isOpen, onDestinationChange, openMenu])

  const handleInputClick = useCallback(() => {
    if (!isOpen) {
      openMenu()
    }
  }, [isOpen, openMenu])

  const handleClear = useCallback(() => {
    onDestinationChange('')
    openMenu()
    textInputRef.current?.focus()
  }, [onDestinationChange, openMenu])

  const handleToggleClick = useCallback(() => {
    setIsOpen((previous) => !previous)
    textInputRef.current?.focus()
  }, [])

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (!nextOpen) {
      closeMenu()
    }
  }, [closeMenu])

  const toggle = useCallback((toggleRef: React.Ref<HTMLButtonElement>) => (
    <MenuToggle
      ref={toggleRef}
      variant="typeahead"
      aria-label="Destination queue"
      onClick={handleToggleClick}
      isExpanded={isOpen}
      isFullWidth
    >
      <TextInputGroup isPlain>
        <TextInputGroupMain
          value={destination}
          onClick={handleInputClick}
          onChange={handleDestinationInputChange}
          id="destination-queue"
          aria-label="Destination queue"
          autoComplete="off"
          innerRef={textInputRef}
          placeholder="Select or type a queue name"
          role="combobox"
          isExpanded={isOpen}
          aria-controls="destination-queue-listbox"
        />

        <TextInputGroupUtilities {...(!destination ? { style: { display: 'none' } } : {})}>
          <Button variant="plain" onClick={handleClear} aria-label="Clear destination queue">
            <TimesIcon aria-hidden />
          </Button>
        </TextInputGroupUtilities>
      </TextInputGroup>
    </MenuToggle>
  ), [destination, handleClear, handleDestinationInputChange, handleInputClick, handleToggleClick, isOpen])

  const renderCreateOptionLabel = useMemo(() => {
    if (!canCreateNewQueue) {
      return null
    }

    return `Use new queue "${normalizedDestination}"`
  }, [canCreateNewQueue, normalizedDestination])

  return (
    <FormGroup
      label="Destination queue"
      fieldId="destination-queue"
      isRequired
    >
      <p>Select an existing queue or type a new queue name. Topic destinations are not supported by this broker operation.</p>
      <Select
        id="destination-queue-select"
        isOpen={isOpen}
        selected={normalizedDestination || undefined}
        onSelect={handleSelect}
        onOpenChange={handleOpenChange}
        toggle={toggle}
        variant="typeahead"
      >
        <SelectList id="destination-queue-listbox">
          {filteredQueues.map((queueName) => (
            <SelectOption key={queueName} value={queueName}>
              {queueName}
            </SelectOption>
          ))}
          {renderCreateOptionLabel && (
            <SelectOption value={createNewDestinationValue} description="Create or use a queue that is not in the current broker list.">
              {renderCreateOptionLabel}
            </SelectOption>
          )}
        </SelectList>
      </Select>
    </FormGroup>
  )
}