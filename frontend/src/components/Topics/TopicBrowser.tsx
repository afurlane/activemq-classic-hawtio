import React, { useCallback, useState } from 'react'
import {
  Card, CardBody, Spinner, EmptyState, EmptyStateBody,
  Pagination
} from '@patternfly/react-core'
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table'
import { CodeBlock, CodeBlockCode } from '@patternfly/react-core'
import { useTopicMessages } from '../../hooks/useTopicMessages'
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm'

interface Props {
  mbean: string 
}

export const TopicBrowser: React.FC<Props> = ({ mbean }) => {
  const [page, setPage] = useState(0)
  const pageSize = 20
  const handleSetPage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage - 1)
  }, [])

  const { data, isLoading, error } = useTopicMessages(mbean, page, pageSize)

  const messages = data?.messages ?? []
  const total = data?.total ?? 0

  if (!mbean) {
    return (
      <Card isCompact>
        <CardBody>
          <EmptyState titleText="No topic selected" headingLevel="h4" icon={ExclamationCircleIcon}>
            <EmptyStateBody>Please select a topic to view its messages.</EmptyStateBody>
          </EmptyState>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card isCompact>
      <CardBody>

        {/* PAGINATION TOP */}
        <Pagination
          itemCount={total}
          perPage={pageSize}
          page={page + 1}
          onSetPage={handleSetPage}
          isCompact
        />

        {isLoading && <Spinner size="xl" />}
        {error && (
          <EmptyState titleText="Failed to load messages" headingLevel="h4" icon={ExclamationCircleIcon}>
            <EmptyStateBody>Try refreshing.</EmptyStateBody>
          </EmptyState>
        )}
        {!isLoading && !error && messages.length === 0 && (
          <EmptyState titleText="No messages" headingLevel="h4" icon={ExclamationCircleIcon}>
            <EmptyStateBody>There are no messages to display.</EmptyStateBody>
          </EmptyState>
        )}

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
                      <CodeBlock>
                        <CodeBlockCode>
                          {JSON.stringify(m.body, null, 2)}
                        </CodeBlockCode>
                      </CodeBlock>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            {/* PAGINATION BOTTOM */}
            <Pagination
              itemCount={total}
              perPage={pageSize}
              page={page + 1}
              onSetPage={handleSetPage}
              isCompact
            />
          </>
        )}
      </CardBody>
    </Card>
  )
}
