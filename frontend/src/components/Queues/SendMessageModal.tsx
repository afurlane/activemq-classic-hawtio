import React, { useState } from "react"
import { BaseModal } from "./BaseModal"
import {
  Button,
  FormGroup,
  TextInput,
  Flex,
  FlexItem,
} from "@patternfly/react-core"
import { Thead, Tbody, Tr, Th, Td, Table } from "@patternfly/react-table"
import { EnvelopeIcon, TrashIcon } from "@patternfly/react-icons"
import { FormModal } from "./FormModal"

interface HeaderEntry {
  key: string
  value: string
}

interface SendMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (body: string, headers: HeaderEntry[]) => void
}

export const SendMessageModal: React.FC<SendMessageModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [body, setBody] = useState("")
  const [headers, setHeaders] = useState<HeaderEntry[]>([])
  const [headerKey, setHeaderKey] = useState("")
  const [headerValue, setHeaderValue] = useState("")

  const addHeader = () => {
    if (!headerKey.trim() || !headerValue.trim()) return
    setHeaders([...headers, { key: headerKey.trim(), value: headerValue }])
    setHeaderKey("")
    setHeaderValue("")
  }

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index))
  }

  const confirm = () => {
    onConfirm(body, headers)
    setBody("")
    setHeaders([])
  }

  return (
    <BaseModal
      title="Send Text Message"
      isOpen={isOpen}
      onClose={onClose}
      confirmLabel="Send"
      confirmIcon={<EnvelopeIcon />}
      isConfirmDisabled={!body.trim()}
      onConfirm={confirm}
    >
      {/* Message body */}
      <FormModal
        fields={[
          {
            name: "body",
            label: "Message Body",
            required: true,
            type: "textarea",
            value: body,
            onChange: setBody,
          },
        ]}
      />

      {/* Header inputs */}
      <FormGroup label="Add Header" fieldId="headerKey">
        <Flex spaceItems={{ default: "spaceItemsMd" }}>
          <FlexItem>
            <TextInput
              id="headerKey"
              placeholder="Header key"
              value={headerKey}
              onChange={(_, v) => setHeaderKey(v)}
            />
          </FlexItem>
          <FlexItem>
            <TextInput
              id="headerValue"
              placeholder="Header value"
              value={headerValue}
              onChange={(_, v) => setHeaderValue(v)}
            />
          </FlexItem>
          <FlexItem>
            <Button variant="secondary" onClick={addHeader}>
              Add
            </Button>
          </FlexItem>
        </Flex>
      </FormGroup>

      {/* Header table */}
      {headers.length > 0 && (
        <FormGroup label="Headers" fieldId="headersTable">
          <Table aria-label="Headers table" variant="compact">
            <Thead>
              <Tr>
                <Th>Key</Th>
                <Th>Value</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {headers.map((h, i) => (
                <Tr key={i}>
                  <Td>{h.key}</Td>
                  <Td>{h.value}</Td>
                  <Td isActionCell>
                    <Button
                      variant="plain"
                      icon={<TrashIcon />}
                      onClick={() => removeHeader(i)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </FormGroup>
      )}
    </BaseModal>
  )
}
