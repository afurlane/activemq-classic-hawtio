import React, { useCallback, useMemo, useState } from 'react'
import {
  Alert,
  Button,
  ButtonVariant,
  Card,
  CardBody,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  Label,
  Spinner,
  Title,
} from '@patternfly/react-core'
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table'
import { ExclamationCircleIcon, TimesIcon, TrashIcon } from '@patternfly/react-icons'

import { Queue } from '../../types/domain'
import { activemq } from '../../services/activemq/ActiveMQClassicService'
import { useQueueMessageGroups } from '../../hooks/useQueueMessageGroups'
import { RefreshToolbar } from '../Common/RefreshControls'
import { BaseModal } from './BaseModal'

interface Props {
  queue: Queue
  onAction: () => Promise<void>
}

const dangerActionsStyle = { marginBottom: '1rem' }
const removeAllButtonStyle = { marginLeft: '0.5rem' }

export const QueueMessageGroups: React.FC<Props> = ({ queue, onAction }) => {
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [interval, setInterval] = useState(5000)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRemoveAllOpen, setIsRemoveAllOpen] = useState(false)
  const [groupToRemove, setGroupToRemove] = useState<string | null>(null)

  const { data, error, isLoading, mutate } = useQueueMessageGroups(queue.mbean, autoRefresh, interval)

  const handleManualRefresh = useCallback(() => {
    mutate()
  }, [mutate])

  const handleOpenRemoveAll = useCallback(() => {
    setIsRemoveAllOpen(true)
  }, [])

  const handleCloseRemoveAll = useCallback(() => {
    setIsRemoveAllOpen(false)
  }, [])

  const handleCloseRemoveSingle = useCallback(() => {
    setGroupToRemove(null)
  }, [])

  const handleSelectGroupToRemove = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const groupId = event.currentTarget.dataset.groupId
    if (groupId) {
      setGroupToRemove(groupId)
    }
  }, [])

  const handleRemoveAll = useCallback(async () => {
    setIsSubmitting(true)

    try {
      await activemq.removeAllMessageGroups(queue.mbean)
      await mutate()
      await onAction()
    } finally {
      setIsSubmitting(false)
      setIsRemoveAllOpen(false)
    }
  }, [mutate, onAction, queue.mbean])

  const handleRemoveSingle = useCallback(async () => {
    if (!groupToRemove) return

    setIsSubmitting(true)

    try {
      await activemq.removeMessageGroup(queue.mbean, groupToRemove)
      await mutate()
      await onAction()
    } finally {
      setIsSubmitting(false)
      setGroupToRemove(null)
    }
  }, [groupToRemove, mutate, onAction, queue.mbean])

  const groups = useMemo(
    () => [...(data?.groups ?? [])].sort((a, b) => a.id.localeCompare(b.id)),
    [data?.groups]
  )

  return (
    <Card isCompact>
      <CardBody>
        <Title headingLevel="h4">Message Groups</Title>

        <RefreshToolbar
          autoRefresh={autoRefresh}
          onToggle={setAutoRefresh}
          interval={interval}
          onIntervalChange={setInterval}
          onManualRefresh={handleManualRefresh}
        />

        {isLoading && (
          <div>
            <Spinner size="xl" />
          </div>
        )}

        {error && (
          <Alert variant="danger" title="Failed to load message groups" isInline>
            Try refreshing and check broker connectivity.
          </Alert>
        )}

        {!isLoading && !error && !data && (
          <Alert variant="info" title="Message groups are not available for this queue" isInline />
        )}

        {!isLoading && !error && data && (
          <>
            <div style={dangerActionsStyle}>
              {data.type && <Label color="blue">Type: {data.type}</Label>}
              <Label color="blue" style={removeAllButtonStyle}>Total: {data.totals.total}</Label>
              <Label color="green" style={removeAllButtonStyle}>Assigned: {data.totals.assigned}</Label>
              <Label color="orange" style={removeAllButtonStyle}>Unassigned: {data.totals.unassigned}</Label>
            </div>

            <div style={dangerActionsStyle}>
              <Button
                variant="danger"
                icon={<TrashIcon />}
                isDisabled={data.totals.total === 0 || isSubmitting}
                onClick={handleOpenRemoveAll}
              >
                Clear All Groups
              </Button>
            </div>

            {groups.length === 0 && (
              <EmptyState titleText="No active message groups" headingLevel="h4" icon={ExclamationCircleIcon}>
                <EmptyStateBody>
                  No group is currently locked to a consumer.
                </EmptyStateBody>
                <EmptyStateFooter>
                  Use Refresh to check for updates.
                </EmptyStateFooter>
              </EmptyState>
            )}

            {groups.length > 0 && (
              <Table variant="compact" aria-label="Queue message groups table">
                <Thead>
                  <Tr>
                    <Th>Group</Th>
                    <Th>Consumer</Th>
                    <Th>State</Th>
                    <Th modifier="fitContent">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {groups.map(group => (
                    <Tr key={group.id}>
                      <Td>{group.id}</Td>
                      <Td>{group.consumerId ?? '—'}</Td>
                      <Td>
                        <Label color={group.state === 'assigned' ? 'green' : 'orange'}>
                          {group.state}
                        </Label>
                      </Td>
                      <Td>
                        <Button
                          variant="danger"
                          icon={<TimesIcon />}
                          isDisabled={isSubmitting}
                          data-group-id={group.id}
                          onClick={handleSelectGroupToRemove}
                        >
                          Remove
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </>
        )}

        <BaseModal
          title="Clear all message groups"
          isOpen={isRemoveAllOpen}
          onClose={handleCloseRemoveAll}
          confirmLabel="Clear All"
          confirmIcon={<TrashIcon />}
          confirmVariant={ButtonVariant.danger}
          isConfirmDisabled={isSubmitting}
          onConfirm={handleRemoveAll}
        >
          This will remove every active message group lock on queue {queue.name}.
        </BaseModal>

        <BaseModal
          title="Remove message group"
          isOpen={groupToRemove !== null}
          onClose={handleCloseRemoveSingle}
          confirmLabel="Remove Group"
          confirmIcon={<TimesIcon />}
          confirmVariant={ButtonVariant.danger}
          isConfirmDisabled={isSubmitting}
          onConfirm={handleRemoveSingle}
        >
          {groupToRemove
            ? `This will remove message group ${groupToRemove} from queue ${queue.name}.`
            : 'Select a message group to remove.'}
        </BaseModal>
      </CardBody>
    </Card>
  )
}
