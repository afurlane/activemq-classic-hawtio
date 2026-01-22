import React, { useEffect, useState } from 'react'
import { activemq } from '../../services/activemq/ActiveMQClassicService'
import {
  Card,
  CardBody,
  Pagination,
  CodeBlock,
  CodeBlockCode
} from '@patternfly/react-core'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table'

import { Queue, Message } from '../../types/domain'

interface Props {
  queue: Queue
}

export const QueueBrowser: React.FC<Props> = ({ queue }) => {
  const [page, setPage] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const pageSize = 20

  const load = async () => {
    const data = await activemq.browseQueue(queue.mbean, page, pageSize)
    setMessages(data)
  }

  useEffect(() => {
    load()
  }, [page, queue.mbean])

  const onSetPage = (_evt: any, newPage: number) => {
    setPage(newPage - 1) // PatternFly pages are 1-based
  }

  return (
    <Card isFlat isCompact>
      <CardBody>
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
          itemCount={999999} // ActiveMQ non dà il totale, usiamo "infinite"
          perPage={pageSize}
          page={page + 1}
          onSetPage={onSetPage}
          isCompact
          style={{ marginTop: '1rem' }}
        />
      </CardBody>
    </Card>
  )
}
