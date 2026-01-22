import React, { useEffect, useRef, useState } from 'react'
import {
  PageSection,
  PageSectionVariants,
  Title,
  Card,
  CardBody,
  Button,
  Label,
  Alert
} from '@patternfly/react-core'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table'
import {
  CheckCircleIcon,
  PauseCircleIcon,
  BanIcon
} from '@patternfly/react-icons'

import { activemq } from '../../services/activemq/ActiveMQClassicService'
import { buildQueueUrl } from '../../router/router'
import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'
import { Queue } from '../../types/domain'

export const QueuesView: React.FC = () => {
  const brokerName = useSelectedBrokerName()

  if (!brokerName) {
    return (
      <Card isFlat isCompact>
        <CardBody>
          <Alert variant="danger" title="No broker selected" isInline />
        </CardBody>
      </Card>
    )
  }

  const [queues, setQueues] = useState<Queue[]>([])
  const mounted = useRef(false)

  const load = async () => {
    if (!brokerName || !mounted.current) return
    const data = await activemq.listQueues(brokerName)
    if (mounted.current) setQueues(data)
  }

  useEffect(() => {
    mounted.current = true
    load()
    const id = setInterval(load, 5000)
    return () => {
      mounted.current = false
      clearInterval(id)
    }
  }, [brokerName])

  const sorted = [...queues].sort((a, b) => a.name.localeCompare(b.name))

  const renderState = (q: Queue) => {
    if (q.state.stopped) {
      return <Label color="red" icon={<BanIcon />}>Stopped</Label>
    }
    if (q.state.paused) {
      return <Label color="orange" icon={<PauseCircleIcon />}>Paused</Label>
    }
    return <Label color="green" icon={<CheckCircleIcon />}>Running</Label>
  }

  return (
    <PageSection variant={PageSectionVariants.light}>
      <Title headingLevel="h2">Queues</Title>

      <Card isFlat isCompact style={{ marginTop: '1rem' }}>
        <CardBody>
          <Table variant="compact">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Size</Th>
                <Th>Enq</Th>
                <Th>Deq</Th>
                <Th>Consumers</Th>
                <Th>State</Th>
                <Th modifier="fitContent" screenReaderText="Actions"></Th>
              </Tr>
            </Thead>

            <Tbody>
              {sorted.map(q => (
                <Tr key={q.mbean}>
                  <Td>{q.name}</Td>
                  <Td>{q.size}</Td>
                  <Td>{q.stats.enqueue}</Td>
                  <Td>{q.stats.dequeue}</Td>
                  <Td>{q.consumers}</Td>
                  <Td>{renderState(q)}</Td>
                  <Td>
                    <Button
                      variant="secondary"
                      onClick={() => (window.location.hash = buildQueueUrl(q.name))}
                    >
                      Details
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </PageSection>
  )
}
