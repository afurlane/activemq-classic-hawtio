import React, { useCallback, useMemo, useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  Label,
  Pagination,
  Spinner,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core'

import { Queue, Message } from '../../types/domain'
import { useQueueMessages } from '../../hooks/useQueueMessages'
import { useQueues } from '../../hooks/useQueues'
import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'
import { MessageTable } from '../Common/MessageTable'
import { RefreshToolbar } from '../Common/RefreshControls'
import { MoveMessageModal } from './MoveMessageModal'
import { CopyMessageModal } from './CopyMessageModal'
import { RemoveMessageModal } from './RemoveMessageModal'
import { RetryMessageModal } from './RetryMessageModal'
import { activemq } from '../../services/activemq/ActiveMQClassicService'

interface Props {
  queue: Queue
  onAction: () => Promise<void>
}

const spinnerStyle = { padding: '2rem', textAlign: 'center' as const }
const paginationStyle = { marginTop: '1rem' }
const perPageOptions = [
  { title: '10', value: 10 },
  { title: '20', value: 20 },
  { title: '50', value: 50 },
  { title: '100', value: 100 },
]

export const QueueBrowser: React.FC<Props> = ({ queue, onAction }) => {
  const brokerName = useSelectedBrokerName()
  const { data: brokerQueues = [] } = useQueues(brokerName)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [interval, setInterval] = useState(5000)
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([])
  const [isMoveOpen, setMoveOpen] = useState(false)
  const [isCopyOpen, setCopyOpen] = useState(false)
  const [isRemoveOpen, setRemoveOpen] = useState(false)
  const [isRetryOpen, setRetryOpen] = useState(false)

  const { data, isLoading, error, mutate } = useQueueMessages(queue.mbean, autoRefresh, interval)

  const raw = data ?? []
  const total = raw.length
  const availableDestinationQueues = useMemo(() => (
    brokerQueues
      .map((brokerQueue) => brokerQueue.name)
      .filter((queueName) => queueName !== queue.name)
      .sort((left, right) => left.localeCompare(right))
  ), [brokerQueues, queue.name])

  const onSetPage = useCallback((_evt: unknown, newPage: number) => {
    setPage(newPage - 1)
  }, [])

  const onPerPageSelect = useCallback((_evt: unknown, newSize: number) => {
    setPageSize(newSize)
    setPage(0)
  }, [])

  const onManualRefresh = useCallback(() => {
    mutate()
  }, [mutate])

  function getSortValue(msg: Message, column: string) {
    switch (column) {
      case 'id':
        return msg.id
      case 'timestamp':
        return msg.timestamp
      case 'priority':
        return msg.priority
      case 'size':
        return msg.extra.size ?? 0
      default:
        return null
    }
  }

  const handleSort = useCallback((column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortDirection('asc')
    }
  }, [sortBy, sortDirection])

  const sorted = [...raw]
  if (sortBy) {
    sorted.sort((a, b) => {
      const va = getSortValue(a, sortBy) ?? 0
      const vb = getSortValue(b, sortBy) ?? 0

      if (va < vb) return sortDirection === 'asc' ? -1 : 1
      if (va > vb) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }

  const start = page * pageSize
  const messages = sorted.slice(start, start + pageSize)
  const selectedMessageCount = selectedMessageIds.length

  const handleToggleMessage = useCallback((messageId: string, isSelected: boolean) => {
    setSelectedMessageIds((previous) => {
      if (isSelected) {
        return previous.includes(messageId) ? previous : [...previous, messageId]
      }

      return previous.filter((id) => id !== messageId)
    })
  }, [])

  const handleToggleAll = useCallback((isSelected: boolean) => {
    setSelectedMessageIds((previous) => {
      const currentPageIds = messages.map((message) => message.id)

      if (isSelected) {
        return Array.from(new Set([...previous, ...currentPageIds]))
      }

      return previous.filter((id) => !currentPageIds.includes(id))
    })
  }, [messages])

  const clearSelection = useCallback(() => {
    setSelectedMessageIds([])
  }, [])

  const openMoveModal = useCallback(() => setMoveOpen(true), [])
  const closeMoveModal = useCallback(() => setMoveOpen(false), [])
  const openCopyModal = useCallback(() => setCopyOpen(true), [])
  const closeCopyModal = useCallback(() => setCopyOpen(false), [])
  const openRemoveModal = useCallback(() => setRemoveOpen(true), [])
  const closeRemoveModal = useCallback(() => setRemoveOpen(false), [])
  const openRetryModal = useCallback(() => setRetryOpen(true), [])
  const closeRetryModal = useCallback(() => setRetryOpen(false), [])

  const handleMoveConfirm = useCallback(async (messageIds: string[], destination: string) => {
    await Promise.all(messageIds.map((messageId) => activemq.moveMessageTo(queue.mbean, messageId, destination)))
    await mutate()
    await onAction()
    clearSelection()
    setMoveOpen(false)
  }, [clearSelection, mutate, onAction, queue.mbean])

  const handleCopyConfirm = useCallback(async (messageIds: string[], destination: string) => {
    await Promise.all(messageIds.map((messageId) => activemq.copyMessageTo(queue.mbean, messageId, destination)))
    await mutate()
    await onAction()
    clearSelection()
    setCopyOpen(false)
  }, [clearSelection, mutate, onAction, queue.mbean])

  const handleRemoveConfirm = useCallback(async (messageIds: string[]) => {
    await Promise.all(messageIds.map((messageId) => activemq.removeMessage(queue.mbean, messageId)))
    await mutate()
    await onAction()
    clearSelection()
    setRemoveOpen(false)
  }, [clearSelection, mutate, onAction, queue.mbean])

  const handleRetryConfirm = useCallback(async (messageIds: string[]) => {
    await Promise.all(messageIds.map((messageId) => activemq.retryMessage(queue.mbean, messageId)))
    await mutate()
    await onAction()
    clearSelection()
    setRetryOpen(false)
  }, [clearSelection, mutate, onAction, queue.mbean])

  return (
    <Card isFlat isCompact>
      <CardBody>
        <RefreshToolbar
          autoRefresh={autoRefresh}
          onToggle={setAutoRefresh}
          interval={interval}
          onIntervalChange={setInterval}
          onManualRefresh={onManualRefresh}
        />

        <Toolbar style={paginationStyle}>
          <ToolbarContent>
            <ToolbarGroup>
              <ToolbarItem>
                <Label color="blue">{selectedMessageCount} selected</Label>
              </ToolbarItem>
              <ToolbarItem>
                <Button variant="secondary" isDisabled={selectedMessageCount === 0} onClick={openMoveModal}>
                  Move selected
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <Button variant="secondary" isDisabled={selectedMessageCount === 0} onClick={openCopyModal}>
                  Copy selected
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <Button variant="secondary" isDisabled={selectedMessageCount === 0} onClick={openRetryModal}>
                  Retry selected
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <Button variant="danger" isDisabled={selectedMessageCount === 0} onClick={openRemoveModal}>
                  Remove selected
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <Button variant="secondary" isDisabled={selectedMessageCount === 0} onClick={clearSelection}>
                  Clear selection
                </Button>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        {isLoading && (
          <div style={spinnerStyle}>
            <Spinner size="xl" />
          </div>
        )}

        {error && (
          <EmptyState>
            <EmptyStateHeader titleText="Failed to load messages" headingLevel="h4" />
            <EmptyStateBody>
              Try refreshing or navigating to another page.
            </EmptyStateBody>
          </EmptyState>
        )}

        {!isLoading && !error && messages.length === 0 && (
          <EmptyState>
            <EmptyStateHeader titleText="No messages in this page" headingLevel="h4" />
            <EmptyStateBody>
              Try navigating to another page or wait for new messages.
            </EmptyStateBody>
          </EmptyState>
        )}

        {!isLoading && !error && messages.length > 0 && (
          <>
            <MessageTable
              messages={messages}
              selectedMessageIds={selectedMessageIds}
              sortDirection={sortDirection}
              onSort={handleSort}
              onToggleMessage={handleToggleMessage}
              onToggleAll={handleToggleAll}
            />

            <Pagination
              itemCount={total}
              perPage={pageSize}
              page={page + 1}
              onSetPage={onSetPage}
              style={paginationStyle}
              onPerPageSelect={onPerPageSelect}
              perPageOptions={perPageOptions}
            />
          </>
        )}

        <MoveMessageModal
          isOpen={isMoveOpen}
          onClose={closeMoveModal}
          onConfirm={handleMoveConfirm}
          messageIds={selectedMessageIds}
          availableQueues={availableDestinationQueues}
        />

        <CopyMessageModal
          isOpen={isCopyOpen}
          onClose={closeCopyModal}
          onConfirm={handleCopyConfirm}
          messageIds={selectedMessageIds}
          availableQueues={availableDestinationQueues}
        />

        <RemoveMessageModal
          isOpen={isRemoveOpen}
          onClose={closeRemoveModal}
          onConfirm={handleRemoveConfirm}
          messageIds={selectedMessageIds}
        />

        <RetryMessageModal
          isOpen={isRetryOpen}
          onClose={closeRetryModal}
          onConfirm={handleRetryConfirm}
          messageIds={selectedMessageIds}
        />
      </CardBody>
    </Card>
  )
}
