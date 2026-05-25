import React, { useCallback, useState } from 'react'
import {
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Button,
  Switch,
  Select,
  SelectOption
} from '@patternfly/react-core'

const toolbarStyle = { marginBottom: '1rem' }

interface RefreshToolbarProps {
  autoRefresh: boolean
  onToggle: (checked: boolean) => void
  interval: number
  onIntervalChange: (value: number) => void
  onManualRefresh: () => void
}

export const RefreshToolbar: React.FC<RefreshToolbarProps> = ({
  autoRefresh,
  onToggle,
  interval,
  onIntervalChange,
  onManualRefresh,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleAutoRefreshChange = useCallback((_: unknown, checked: boolean) => {
    onToggle(checked)
  }, [onToggle])
  const handleIntervalSelect = useCallback((_: unknown, value: string | number | undefined) => {
    if (value !== undefined) {
      onIntervalChange(Number(value))
    }
    setIsOpen(false)
  }, [onIntervalChange])
  const handleToggleClick = useCallback(() => setIsOpen(prev => !prev), [])
  const renderToggle = useCallback((toggleRef: React.Ref<HTMLButtonElement>) => (
    <Button
      ref={toggleRef}
      variant="secondary"
      onClick={handleToggleClick}
    >
      {interval / 1000}s
    </Button>
  ), [handleToggleClick, interval])

  return (
    <Toolbar style={toolbarStyle}>
      <ToolbarContent>

        <ToolbarGroup>

          <ToolbarItem>
            <Button variant="secondary" onClick={onManualRefresh}>
              Refresh
            </Button>
          </ToolbarItem>

          <ToolbarItem>
            <Switch
              id="auto-refresh"
              label="Auto-refresh"
              isChecked={autoRefresh}
              onChange={handleAutoRefreshChange}
            />
          </ToolbarItem>

          <ToolbarItem>
            <Select
              aria-label="Refresh interval"
              isOpen={isOpen}
              selected={interval}
              onOpenChange={setIsOpen}
              onSelect={handleIntervalSelect}
              toggle={renderToggle}
            >
              <SelectOption value={5000}>5s</SelectOption>
              <SelectOption value={10000}>10s</SelectOption>
              <SelectOption value={30000}>30s</SelectOption>
              <SelectOption value={60000}>60s</SelectOption>
            </Select>
          </ToolbarItem>

        </ToolbarGroup>

      </ToolbarContent>
    </Toolbar>
  )
}
