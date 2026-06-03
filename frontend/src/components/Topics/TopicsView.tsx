import React, { useCallback, useEffect, useState } from 'react'
import {
  PageSection,
  Title,
  Card,
  CardBody,
  Button,
  Alert,
  Spinner
} from '@patternfly/react-core'

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@patternfly/react-table'

import { buildTopicUrl } from '../../router/router'
import { activemq } from '../../services/activemq/ActiveMQClassicService'
import { Topic } from '../../types/domain'
import { useSelectedBrokerName } from 'src/hooks/useSelectedBroker'

const TITLE_STYLE = { marginTop: 12 } as const
const CARD_STYLE = { marginTop: '1rem' } as const

export const TopicsView: React.FC = () => {
  const brokerName = useSelectedBrokerName()

  const [list, setList] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleDetails = useCallback((name: string) => {
    window.location.hash = buildTopicUrl(name)
  }, [])

  const handleDetailsClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const name = event.currentTarget.dataset.topicName
    if (name) {
      handleDetails(name)
    }
  }, [handleDetails])


  const load = useCallback(async () => {
    if (!brokerName) return

    try {
      setLoading(true)
      const data = await activemq.listTopics(brokerName)
      setList(data)
      setError(null)
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load topics')
    } finally {
      setLoading(false)
    }
  }, [brokerName])


  useEffect(() => {
    load()
    const id = setInterval(load, 5000)
    return () => clearInterval(id)
  }, [load])

  // NO BROKER SELECTED
  if (!brokerName) {
    return (
      <PageSection hasBodyWrapper={false}>
        <Card isCompact>
          <CardBody>
            <Alert variant="danger" title="No broker selected" isInline />
          </CardBody>
        </Card>
      </PageSection>
    )
  }

  if (loading) {
    return (
      <PageSection hasBodyWrapper={false}>
        <Spinner size="lg" />
        <Title headingLevel="h3" style={TITLE_STYLE}>
          Loading topics…
        </Title>
      </PageSection>
    )
  }

  if (error) {
    return (
      <PageSection hasBodyWrapper={false}>
        <Alert variant="danger" title="Failed to load topics" isInline>
          {error}
        </Alert>
      </PageSection>
    )
  }

  return (
    <PageSection hasBodyWrapper={false} >
      <Title headingLevel="h2">Topics</Title>

      <Card isCompact style={CARD_STYLE}>
        <CardBody>
          <Table variant="compact">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Enqueued</Th>
                <Th>Dequeued</Th>
                <Th>Producers</Th>
                <Th>Subscribers</Th>
                <Th>Size</Th>
                <Th modifier="fitContent" />
              </Tr>
            </Thead>

            <Tbody>
              {list.map((t, i) => (
                <Tr key={i}>
                  <Td>{t.name}</Td>
                  <Td>{t.stats.enqueue}</Td>
                  <Td>{t.stats.dequeue}</Td>
                  <Td>{t.stats.producers}</Td>
                  <Td>{t.stats.consumers}</Td>
                  <Td>{t.stats.size}</Td>
                  <Td>
                    <Button
                      variant="secondary"
                      data-topic-name={t.name}
                      onClick={handleDetailsClick}
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
