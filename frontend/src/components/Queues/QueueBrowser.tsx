import React, { useCallback, useState } from 'react'
import {
  Card,
  CardBody,
  Pagination,
  Spinner,
  EmptyState,
  EmptyStateBody
} from '@patternfly/react-core'
import { ExclamationCircleIcon } from '@patternfly/react-icons';

import { Queue, Message } from '../../types/domain'
import { useQueueMessages } from '../../hooks/useQueueMessages'
import { MessageTable } from '../Common/MessageTable'
import { RefreshToolbar } from '../Common/RefreshControls'

interface Props {
  queue: Queue
}

const spinnerStyle = { padding: '2rem', textAlign: 'center' as const }
const paginationStyle = { marginTop: '1rem' }
const perPageOptions = [
  { title: '10', value: 10 },
  { title: '20', value: 20 },
  { title: '50', value: 50 },
  { title: '100', value: 100 },
]

export const QueueBrowser: React.FC<Props> = ({ queue }) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [autoRefresh, setAutoRefresh] = useState(false);
  const [interval, setInterval] = useState(5000);

  const { data, isLoading, error, mutate } = useQueueMessages(queue.mbean, autoRefresh, interval);

  const raw = data ?? []

  // const messages: Message[] = data?.messages ?? [];
  const total = raw?.length ?? 0;

  const onSetPage = useCallback((_evt: any, newPage: number) => {
    setPage(newPage - 1) // PatternFly pages are 1-based
  }, [])

  const onPerPageSelect = useCallback((_evt: any, newSize: number) => {
    setPageSize(newSize)
    setPage(0) // reset alla prima pagina
  }, [])

  const onManualRefresh = useCallback(() => {
    mutate()
  }, [mutate])

  function getSortValue(msg: Message, sortBy: string) {
    switch (sortBy) {
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

  // 1. Sorting
  let sorted = [...raw]

  if (sortBy) {
    sorted.sort((a, b) => {
      const va = getSortValue(a, sortBy as string) ?? 0;
      const vb = getSortValue(b, sortBy as string) ?? 0;

      if (va < vb) return sortDirection === 'asc' ? -1 : 1
      if (va > vb) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }

  // 2. Pagination
  const start = page * pageSize
  const messages = sorted.slice(start, start + pageSize)


  return (
    <Card isCompact>
      <CardBody>
        <RefreshToolbar
          autoRefresh={autoRefresh}
          onToggle={setAutoRefresh}
          interval={interval}
          onIntervalChange={setInterval}
          onManualRefresh={onManualRefresh}
        />


        {/* LOADING */}
        {isLoading && (
          <div style={spinnerStyle}>
            <Spinner size="xl" />
          </div>
        )}

        {/* ERROR */}
        {error && (
          <EmptyState titleText="Failed to load messages" headingLevel="h4" icon={ExclamationCircleIcon}>
            <EmptyStateBody>
              Try refreshing or navigating to another page.
            </EmptyStateBody>
          </EmptyState>
        )}

        {/* EMPTY STATE */}
        {!isLoading && !error && messages.length === 0 && (
          <EmptyState titleText="No messages in this page" headingLevel="h4" icon={ExclamationCircleIcon}>
            <EmptyStateBody>
              Try navigating to another page or wait for new messages.
            </EmptyStateBody>
          </EmptyState>
        )}

        {/* TABLE */}
        {!isLoading && !error && messages.length > 0 && (
          <>
            <MessageTable messages={messages} sortDirection={sortDirection} onSort={handleSort} />

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

      </CardBody>
    </Card>
  )
}
