import React, { useEffect, useRef, useState } from 'react'
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

import { activemq } from '../../services/activemq/ActiveMQClassicService'
import { buildQueueUrl } from '../../router/router'
import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'
import { Queue } from '../../types/domain'
import { createPolling } from '../../services/polling'
import { log } from '../../globals'

export const QueuesView: React.FC = () => {
  const brokerName = useSelectedBrokerName()

  if (!brokerName) {
    return (
      <Card isFlat isCompact>
        <CardBody>
          <Alert variant="danger" title="No broker selected" isInline />
        </CardBody>
      </Card>
    )
  }

  const [queues, setQueues] = useState<Queue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filterText, setFilterText] = useState('')
  const [stateFilter, setStateFilter] = useState<string | null>(null)
  const [isStateOpen, setIsStateOpen] = useState(false)

  const [sortIndex, setSortIndex] = useState<number>(0)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const mounted = useRef(false)

  const load = createPolling(async () => {
    if (!brokerName || !mounted.current) return

    log.debug('[QueuesView] loading queues for broker:', brokerName)

    setLoading(true)
    setError(null)

    try {
      const data = await activemq.listQueues(brokerName)
      if (mounted.current) {
        setQueues(data)
      }
    } catch (err) {
      log.debug('[QueuesView] error loading queues:', err)
      setError('Failed to load queues')
    } finally {
      if (mounted.current) {
        setLoading(false)
      }
    }
  })

  useEffect(() => {
    mounted.current = true
    load()

    const id = setInterval(load, 5000)
    return () => {
      mounted.current = false
      clearInterval(id)
    }
  }, [brokerName])

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

    const index = sortIndex ?? 0
    const value = fields[index] ?? 0

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
      <Toolbar style={{ marginTop: '1rem' }}>
        <ToolbarContent>

          {/* Left side: filters */}
          <ToolbarGroup variant="filter-group">

            {/* Filter by name */}
            <ToolbarItem>
              <TextInput
                value={filterText}
                onChange={(_, v) => setFilterText(v)}
                placeholder="Filter by name"
              />
            </ToolbarItem>

            {/* Filter by state */}
            <ToolbarItem>
              <Select
                isOpen={isStateOpen}
                onOpenChange={setIsStateOpen}
                selected={stateFilter}
                onSelect={(_, v) => {
                  setStateFilter(v as string)
                  setIsStateOpen(false)
                }}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsStateOpen(!isStateOpen)}
                    isExpanded={isStateOpen}
                  >
                    {stateFilter ?? 'Filter by state'}
                  </MenuToggle>
                )}
              >
                <MenuItem itemId={null}>All</MenuItem>
                <MenuItem itemId="running">Running</MenuItem>
                <MenuItem itemId="paused">Paused</MenuItem>
                <MenuItem itemId="stopped">Stopped</MenuItem>
              </Select>
            </ToolbarItem>

            {/* Refresh */}
            <ToolbarItem>
              <Button variant="plain" onClick={load}>
                <SyncIcon />
              </Button>
            </ToolbarItem>

          </ToolbarGroup>

          {/* Right side: actions */}
          <ToolbarGroup align={{ default: 'alignRight' }}>
            <ToolbarItem>
              <Button variant="primary">Create Queue</Button>
            </ToolbarItem>
          </ToolbarGroup>

        </ToolbarContent>
      </Toolbar>

      <Card isFlat isCompact style={{ marginTop: '1rem' }}>
        <CardBody>

          {/* ERROR */}
          {error && (
            <Alert variant="danger" title={error} isInline />
          )}

          {/* LOADING */}
          {loading && (
            <>
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} width="100%" height="2rem" />
              ))}
            </>
          )}

          {/* EMPTY STATE */}
          {!loading && sorted.length === 0 && (
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
          {!loading && sorted.length > 0 && (
            <Table variant="compact">
              <Thead>
                <Tr>
                  <Th
                    sort={{
                      sortBy: { index: sortIndex, direction: sortDirection },
                      onSort: (_, index, direction) => {
                        setSortIndex(index)
                        setSortDirection(direction)
                      },
                      columnIndex: 0
                    }}
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
                    <Td>{q.name}</Td>
                    <Td>{q.size}</Td>
                    <Td>{q.stats.enqueue}</Td>
                    <Td>{q.stats.dequeue}</Td>
                    <Td>{q.consumers}</Td>
                    <Td>{renderState(q)}</Td>
                    <Td>
                      <Button
                        variant="secondary"
                        onClick={() => (window.location.hash = buildQueueUrl(q.name))}
                      >
                        Details
                      </Button>
                    </Td>
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
