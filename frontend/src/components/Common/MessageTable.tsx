import React, { useCallback, useMemo, useState } from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@patternfly/react-table'
import { Button, Checkbox } from '@patternfly/react-core'
import { Message } from '../../types/domain';
import { MessageModal } from './MessageModal';
import { EllipsisVIcon } from '@patternfly/react-icons';

interface Props {
  messages: Message[]
  selectedMessageIds: string[]
  sortDirection: 'asc' | 'desc'
  onSort: (column: string) => void
  onToggleMessage: (messageId: string, isSelected: boolean) => void
  onToggleAll: (isSelected: boolean) => void
}

const bodyCellStyle = {
  maxWidth: '350px',
  whiteSpace: 'pre-wrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
} as const

function previewBody(m: Message, maxLines: number = 2, maxChars: number = 120): string {
  if (!m.body) return "—"

  const lines = m.body.split("\n").slice(0, maxLines)

  const truncated = lines.map(line =>
    line.length > maxChars ? line.slice(0, maxChars) + "…" : line
  )

  if (m.body.split("\n").length > maxLines) {
    truncated.push("…")
  }

  return truncated.join("\n")
}

export const MessageTable: React.FC<Props> = ({
  messages,
  selectedMessageIds,
  sortDirection,
  onSort,
  onToggleMessage,
  onToggleAll,
}) => {
  const [selected, setSelected] = useState<Message | null>(null)
  const allSelected = messages.length > 0 && messages.every((message) => selectedMessageIds.includes(message.id))

  const onSortId = useCallback(() => onSort('id'), [onSort])
  const onSortTimestamp = useCallback(() => onSort('timestamp'), [onSort])
  const onSortPriority = useCallback(() => onSort('priority'), [onSort])
  const onSortSize = useCallback(() => onSort('size'), [onSort])
  const onToggleAllMessages = useCallback((_: unknown, isSelected: boolean) => {
    onToggleAll(isSelected)
  }, [onToggleAll])
  const onToggleMessageSelection = useCallback((messageId: string, isSelected: boolean) => {
    onToggleMessage(messageId, isSelected)
  }, [onToggleMessage])
  const onCloseDetails = useCallback(() => setSelected(null), [])
  const onOpenDetails = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const index = Number(event.currentTarget.dataset.index)
    if (!Number.isNaN(index)) {
      setSelected(messages[index] ?? null)
    }
  }, [messages])

  const idSort = useMemo(() => ({
    sortBy: {
      index: 0,
      direction: sortDirection,
    },
    onSort: onSortId,
    columnIndex: 0,
  }), [sortDirection, onSortId])

  const timestampSort = useMemo(() => ({
    sortBy: {
      index: 1,
      direction: sortDirection,
    },
    onSort: onSortTimestamp,
    columnIndex: 1,
  }), [sortDirection, onSortTimestamp])

  const prioritySort = useMemo(() => ({
    sortBy: {
      index: 2,
      direction: sortDirection,
    },
    onSort: onSortPriority,
    columnIndex: 2,
  }), [sortDirection, onSortPriority])

  const sizeSort = useMemo(() => ({
    sortBy: {
      index: 3,
      direction: sortDirection,
    },
    onSort: onSortSize,
    columnIndex: 3,
  }), [sortDirection, onSortSize])

  if (!messages || messages.length === 0) {
    return <div>No messages</div>
  }

  return (
    <>
      <Table variant="compact">
        <Thead>
          <Tr>

            {/* Select */}
            <Th>
              <Checkbox
                id="messages-select-all"
                label=""
                isChecked={allSelected}
                onChange={onToggleAllMessages}
              />
            </Th>

            {/* ID */}
            <Th
              sort={idSort}
            >
              ID
            </Th>

            {/* Timestamp */}
            <Th
              sort={timestampSort}
            >
              Timestamp
            </Th>

            {/* Priority */}
            <Th
              sort={prioritySort}
            >
              Priority
            </Th>

            {/* Size */}
            <Th
              sort={sizeSort}
            >
              Size
            </Th>

            {/* Body */}
            <Th>Body</Th>

            {/* Actions */}
            <Th>Actions</Th>

          </Tr>
        </Thead>

        <Tbody>
          {messages.map((m, i) => (
            <Tr key={i}>
              <Td>
                <Checkbox
                  id={`messages-select-${m.id}`}
                  label=""
                  isChecked={selectedMessageIds.includes(m.id)}
                  onChange={(_: unknown, isSelected: boolean) => onToggleMessageSelection(m.id, isSelected)}
                />
              </Td>

              <Td>{m.id}</Td>

              <Td>
                {m.timestamp
                  ? new Date(m.timestamp).toLocaleString()
                  : "—"}
              </Td>

              <Td>{m.priority}</Td>

              <Td>{m.extra.size ?? 0}</Td>

              <Td
                style={bodyCellStyle}
              >
                {previewBody(m)}
              </Td>

              <Td>
                <Button
                  variant="plain"
                  aria-label="Apri dettagli"
                  data-index={i}
                  onClick={onOpenDetails}
                >
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
        onClose={onCloseDetails}
      />
    </>
  )
}
