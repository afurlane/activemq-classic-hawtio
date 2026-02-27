import React, { useState } from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@patternfly/react-table'
import { Message } from '../../types/domain';
import { MessageModal } from './MessageModal';
import { renderBody } from './RenderBody';
import { Button } from '@patternfly/react-core'; 
import { EllipsisVIcon } from '@patternfly/react-icons';
interface Props {
  messages: Message[]
}

export const MessageTable: React.FC<Props> = ({  messages }) => {
  const [selected, setSelected] = useState<Message | null>(null)

  if (!messages || messages.length === 0) {
    return <div>No messages</div>
  }

  return (
    <>
      <Table variant="compact">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Timestamp</Th>
            <Th>Body</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>

        <Tbody>
          {messages.map((m, i) => (
            <Tr key={i}>
              <Td>{m.id ?? m.id}</Td>

              <Td>
                {m.timestamp
                  ? new Date(m.timestamp).toLocaleString()
                  : m.timestamp
                  ? new Date(m.timestamp).toLocaleString()
                  : "—"}
              </Td>

              <Td>
                {renderBody(m, 5)}
              </Td>
              <Td>
                <Button
                  variant="plain"
                  aria-label="Apri dettagli"
                  onClick={() => setSelected(m)}>
                  <EllipsisVIcon />
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <MessageModal
        message={selected}
        isOpen={!!selected}
        onClose={() => setSelected(null)}
      />
    </>
  )
}
