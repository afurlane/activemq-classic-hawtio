import React, { useCallback, useState } from 'react'
import {
  PageSection,
  PageSectionVariants,
  Title,
  Card,
  CardBody,
  Button,
  Label,
  Alert,
  EmptyState,
  EmptyStateHeader,
  EmptyStateBody,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  TextInput,
  Select,
  Skeleton,
  MenuToggle,
  MenuItem
} from '@patternfly/react-core'

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@patternfly/react-table'

import {
  CheckCircleIcon,
  PauseCircleIcon,
  BanIcon,
  SyncIcon
} from '@patternfly/react-icons'

import { buildQueueUrl } from '../../router/router'
import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'
import { useQueues } from '../../hooks/useQueues'
import { Queue } from '../../types/domain'

const toolbarStyle: React.CSSProperties = { marginTop: '1rem' }
const rightAlignedToolbarGroup = { default: 'alignRight' } as const

export const QueuesView: React.FC = () => {
  const brokerName = useSelectedBrokerName()

    // SWR: carica le queue automaticamente
  const {
    data: queues = [],
    error,
    isLoading,
    mutate
  } = useQueues(brokerName)

  // FILTER UI STATE
  const [filterText, setFilterText] = useState('')
  const [stateFilter, setStateFilter] = useState<string | null>(null)
  const [isStateOpen, setIsStateOpen] = useState(false)

  // SORT UI STATE
  const [sortIndex, setSortIndex] = useState<number>(0)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleFilterTextChange = useCallback(
    (_event: React.FormEvent<HTMLInputElement>, value: string) => {
      setFilterText(value)
    },
    []
  )

  const handleStateSelect = useCallback(
    (_event?: React.MouseEvent, value?: string | number) => {
      setStateFilter(value === undefined ? null : String(value))
      setIsStateOpen(false)
    },
    []
  )

  const handleStateToggleClick = useCallback(() => {
    setIsStateOpen(prev => !prev)
  }, [])

  const handleRefreshClick = useCallback(() => {
    void mutate()
  }, [mutate])

  const handleDetailsClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const queueName = event.currentTarget.dataset.queueName
      if (queueName) {
        window.location.hash = buildQueueUrl(queueName)
      }
    },
    []
  )

  const sortBy = React.useMemo(
    () => ({ index: sortIndex, direction: sortDirection }),
    [sortIndex, sortDirection]
  )

  const onSort = useCallback(
    (_: React.MouseEvent, index: number, direction: 'asc' | 'desc') => {
      setSortIndex(index)
      setSortDirection(direction)
    },
    []
  )

  const nameColumnSort = React.useMemo(
    () => ({
      sortBy,
      onSort,
      columnIndex: 0
    }),
    [sortBy, onSort]
  )

  const renderStateToggle = useCallback(
    (toggleRef: React.Ref<HTMLButtonElement>) => (
      <MenuToggle
        ref={toggleRef}
        onClick={handleStateToggleClick}
        isExpanded={isStateOpen}
      >
        {stateFilter ?? 'Filter by state'}
      </MenuToggle>
    ),
    [handleStateToggleClick, isStateOpen, stateFilter]
  )

  if (!brokerName) {
    return (
      <Card isFlat isCompact>
        <CardBody>
          <Alert variant="danger" title="No broker selected" isInline />
        </CardBody>
      </Card>
    )
  }

  // FILTERING
  const filtered = queues.filter(q => {
    if (filterText && !q.name.toLowerCase().includes(filterText.toLowerCase()))
      return false
    if (stateFilter === 'running' && (q.state.paused || q.state.stopped))
      return false
    if (stateFilter === 'paused' && !q.state.paused)
      return false
    if (stateFilter === 'stopped' && !q.state.stopped)
      return false
    return true
  })

  // SORTING
  const sorted = [...filtered].sort((a, b) => {
    const fields = [
      a.name.localeCompare(b.name),
      a.size - b.size,
      a.stats.enqueue - b.stats.enqueue,
      a.stats.dequeue - b.stats.dequeue,
      a.consumers - b.consumers
    ]

    const value = fields[sortIndex] ?? 0
    return sortDirection === 'asc' ? value : -value
  })

  const renderState = (q: Queue) => {
    if (q.state.stopped) {
      return <Label color="red" icon={<BanIcon />}>Stopped</Label>
    }
    if (q.state.paused) {
      return <Label color="orange" icon={<PauseCircleIcon />}>Paused</Label>
    }
    return <Label color="green" icon={<CheckCircleIcon />}>Running</Label>
  }

  return (
    <PageSection variant={PageSectionVariants.light}>
      <Title headingLevel="h2">Queues</Title>

      {/* TOOLBAR */}
      <Toolbar style={toolbarStyle}>
        <ToolbarContent>

          {/* Left side: filters */}
          <ToolbarGroup variant="filter-group">

            {/* Filter by name */}
            <ToolbarItem>
              <TextInput
                id="filter-text"
                value={filterText}
                onChange={handleFilterTextChange}
                placeholder="Filter by name"
              />
            </ToolbarItem>

            {/* Filter by state */}
            <ToolbarItem>
              <Select
                isOpen={isStateOpen}
                onOpenChange={setIsStateOpen}
                selected={stateFilter}
                onSelect={handleStateSelect}
                toggle={renderStateToggle}
              >
                <MenuItem itemId={null}>All</MenuItem>
                <MenuItem itemId="running">Running</MenuItem>
                <MenuItem itemId="paused">Paused</MenuItem>
                <MenuItem itemId="stopped">Stopped</MenuItem>
              </Select>
            </ToolbarItem>

            {/* Refresh */}
            <ToolbarItem>
              <Button variant="plain" onClick={handleRefreshClick}>
                <SyncIcon />
              </Button>
            </ToolbarItem>

          </ToolbarGroup>

          {/* Right side: actions */}
          <ToolbarGroup align={rightAlignedToolbarGroup}>
            <ToolbarItem>
              <Button variant="primary">Create Queue</Button>
            </ToolbarItem>
          </ToolbarGroup>

        </ToolbarContent>
      </Toolbar>

      <Card isFlat isCompact className="pf-v5-u-mt-md">
        <CardBody>

          {/* ERROR */}
          {error && (
            <Alert variant="danger" title="Failed to load queues" isInline />
          )}

          {/* LOADING */}
          {isLoading && (
            <>
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} width="100%" height="2rem" />
              ))}
            </>
          )}

          {/* EMPTY STATE */}
          {!isLoading && sorted.length === 0 && (
            <EmptyState>
              <EmptyStateHeader
                titleText="No queues found"
                headingLevel="h4"
              />
              <EmptyStateBody>
                Try adjusting filters or refreshing.
              </EmptyStateBody>
            </EmptyState>
          )}

          {/* TABLE */}
          {!isLoading && sorted.length > 0 && (
            <Table variant="compact">
              <Thead>
                <Tr>
                  <Th
                    sort={nameColumnSort}
                  >
                    Name
                  </Th>
                  <Th>Size</Th>
                  <Th>Enq</Th>
                  <Th>Deq</Th>
                  <Th>Consumers</Th>
                  <Th>State</Th>
                  <Th modifier="fitContent" />
                </Tr>
              </Thead>

              <Tbody>
                {sorted.map(q => (
                  <Tr key={q.mbean}>
                    <Td dataLabel="Name">{q.name}</Td>
                    <Td dataLabel="Size">{q.size}</Td>
                    <Td dataLabel="Enq">{q.stats.enqueue}</Td>
                    <Td dataLabel="Deq">{q.stats.dequeue}</Td>
                    <Td dataLabel="Consumers">{q.consumers}</Td>
                    <Td dataLabel="State">{renderState(q)}</Td>
                    <Td>
                      <Button
                        variant="secondary"
                        data-queue-name={q.name}
                        onClick={handleDetailsClick}
                      >
                        Details
                      </Button>
                    </Td>
                    <Td modifier="fitContent" />
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}

        </CardBody>
      </Card>
    </PageSection>
  )
}
