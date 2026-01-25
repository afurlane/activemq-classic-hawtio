import React, { useEffect, useState } from 'react'
import {
  PageSection,
  PageSectionVariants,
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

export const TopicsView: React.FC = () => {
  const [list, setList] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      setLoading(true)
      const data = await activemq.listTopics()
      setList(data)
      setError(null)
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load topics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 5000)
    return () => clearInterval(id)
  }, [])

  /* ────────────────────────────────────────────────
     LOADING
     ──────────────────────────────────────────────── */

  if (loading) {
    return (
      <PageSection>
        <Spinner size="lg" />
        <Title headingLevel="h3" style={{ marginTop: 12 }}>
          Loading topics…
        </Title>
      </PageSection>
    )
  }

  /* ────────────────────────────────────────────────
     ERROR
     ──────────────────────────────────────────────── */

  if (error) {
    return (
      <PageSection>
        <Alert variant="danger" title="Failed to load topics" isInline>
          {error}
        </Alert>
      </PageSection>
    )
  }

  /* ────────────────────────────────────────────────
     TABLE
     ──────────────────────────────────────────────── */

  return (
    <PageSection variant={PageSectionVariants.light}>
      <Title headingLevel="h2">Topics</Title>

      <Card isFlat isCompact style={{ marginTop: '1rem' }}>
        <CardBody>
          <Table variant="compact" aria-label="Topics table">
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
                      onClick={() => (window.location.hash = buildTopicUrl(t.name))}
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
