import React, { useState } from 'react'
import {
  Card,
  CardBody,
  Pagination,
  CodeBlock,
  CodeBlockCode,
  Spinner,
  EmptyState,
  EmptyStateHeader,
  EmptyStateBody
} from '@patternfly/react-core'

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@patternfly/react-table'

import { Queue } from '../../types/domain'
import { useQueueMessages } from '../../hooks/useQueueMessages'

interface Props {
  queue: Queue
}

export const QueueBrowser: React.FC<Props> = ({ queue }) => {
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const { data, isLoading, error } = useQueueMessages(queue.mbean, page, pageSize);

  const messages = data?.messages ?? [];
  const total = data?.total ?? 0;

  const onSetPage = (_evt: any, newPage: number) => {
    setPage(newPage - 1) // PatternFly pages are 1-based
  }

  return (
    <Card isFlat isCompact>
      <CardBody>

        {/* LOADING */}
        {isLoading && (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <Spinner size="xl" />
          </div>
        )}

        {/* ERROR */}
        {error && (
          <EmptyState>
            <EmptyStateHeader
              titleText="Failed to load messages"
              headingLevel="h4"
            />
            <EmptyStateBody>
              Try refreshing or navigating to another page.
            </EmptyStateBody>
          </EmptyState>
        )}

        {/* EMPTY STATE */}
        {!isLoading && !error && messages.length === 0 && (
          <EmptyState>
            <EmptyStateHeader
              titleText="No messages in this page"
              headingLevel="h4"
            />
            <EmptyStateBody>
              Try navigating to another page or wait for new messages.
            </EmptyStateBody>
          </EmptyState>
        )}

        {/* TABLE */}
        {!isLoading && !error && messages.length > 0 && (
          <>
            <Table variant="compact">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Timestamp</Th>
                  <Th>Body</Th>
                </Tr>
              </Thead>

              <Tbody>
                {messages.map((m, i) => (
                  <Tr key={i}>
                    <Td>{m.id}</Td>
                    <Td>{new Date(m.timestamp).toLocaleString()}</Td>
                    <Td>
                      <CodeBlock readOnly>
                        <CodeBlockCode>
                          {JSON.stringify(m.body, null, 2)}
                        </CodeBlockCode>
                      </CodeBlock>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <Pagination
              itemCount={total}
              perPage={pageSize}
              page={page + 1}
              onSetPage={onSetPage}
              isCompact
              style={{ marginTop: '1rem' }}
            />
          </>
        )}

      </CardBody>
    </Card>
  )
}
