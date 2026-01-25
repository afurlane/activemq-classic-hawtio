import React, { useState } from 'react'
import { Card, CardBody, Spinner, EmptyState, EmptyStateHeader, EmptyStateBody } from '@patternfly/react-core'
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table'
import { CodeBlock, CodeBlockCode } from '@patternfly/react-core'
import { useTopicMessages } from '../../hooks/useTopicMessages'

interface Props {
    mbean: string 
}

export const TopicBrowser: React.FC<Props> = ({ mbean }) => {
  const [page, setPage] = useState(0)
  const pageSize = 20

  const { data: messages = [], isLoading, error } = useTopicMessages(mbean, page, pageSize)

  return (
    <Card isFlat isCompact>
      <CardBody>
        {isLoading && <Spinner size="xl" />}
        {error && (
          <EmptyState>
            <EmptyStateHeader titleText="Failed to load messages" />
            <EmptyStateBody>Try refreshing.</EmptyStateBody>
          </EmptyState>
        )}
        {!isLoading && !error && messages.length === 0 && (
          <EmptyState>
            <EmptyStateHeader titleText="No messages" />
          </EmptyState>
        )}
        {!isLoading && !error && messages.length > 0 && (
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
                      <CodeBlockCode>{JSON.stringify(m.body, null, 2)}</CodeBlockCode>
                    </CodeBlock>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  )
}
