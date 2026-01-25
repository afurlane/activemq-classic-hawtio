import React from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@patternfly/react-table'
import { CodeBlock, CodeBlockCode } from '@patternfly/react-core'

interface Props {
  messages: any[]
}

export const MessageTable: React.FC<Props> = ({ messages }) => {
  if (!messages || messages.length === 0) {
    return <div>No messages</div>
  }

  return (
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
            <Td>{m.JMSMessageID ?? m.id}</Td>
            <Td>
              {m.JMSTimestamp
                ? new Date(m.JMSTimestamp).toLocaleString()
                : m.timestamp
                ? new Date(m.timestamp).toLocaleString()
                : '—'}
            </Td>
            <Td>
              <CodeBlock readOnly>
                <CodeBlockCode>
                  {JSON.stringify(m.body ?? m, null, 2)}
                </CodeBlockCode>
              </CodeBlock>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}
