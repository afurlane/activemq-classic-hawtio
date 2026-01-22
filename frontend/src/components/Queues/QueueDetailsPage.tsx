import React, { useEffect, useRef, useState } from 'react'
import { activemq } from '../../services/activemq/ActiveMQClassicService'
import { buildQueuesUrl } from '../../router/router'

import {
  PageSection,
  PageSectionVariants,
  Title,
  Button,
  Grid,
  GridItem,
  Card,
  CardBody,
  Alert
} from '@patternfly/react-core'

import { QueueBrowser } from './QueueBrowser'
import { QueueOperations } from './QueueOperations'
import { QueueAttributes } from './QueueAttributes'
import { QueueCharts } from './QueueCharts'
import { QueueHealth } from './QueueHealth'
import { QueueThroughput } from './QueueThroughput'
import { QueueLag } from './QueueLag'
import { QueueAlerts } from './QueueAlerts'
import { QueueStorage } from './QueueStorage'
import { QueueDLQ } from './QueueDLQ'
import { QueueConsumers } from './QueueConsumers'

import { Queue } from '../../types/domain'
import { useQueueMetrics } from '../../hooks/useQueueMetrics'
import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'

interface Props {
  queueName: string
}

export const QueueDetailsPage: React.FC<Props> = ({ queueName }) => {
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

  const [queue, setQueue] = useState<Queue | null>(null)
  const mounted = useRef(false)

  const loadInfo = async () => {
    if (!brokerName || !mounted.current) return

    const queues = await activemq.listQueues(brokerName)
    const q = queues.find(q => q.name === queueName)

    if (mounted.current) setQueue(q ?? null)
  }

  useEffect(() => {
    mounted.current = true
    loadInfo()
    const id = setInterval(loadInfo, 5000)
    return () => {
      mounted.current = false
      clearInterval(id)
    }
  }, [brokerName, queueName])

  const { latest, history, loading: metricsLoading } =
    useQueueMetrics(queue?.mbean ?? '')

  if (!queue || metricsLoading || !latest) {
    return (
      <PageSection>
        <Title headingLevel="h3">Loading queue {queueName}…</Title>
      </PageSection>
    )
  }

  return (
    <>
      {/* Header */}
      <PageSection variant={PageSectionVariants.light}>
        <Grid hasGutter>
          <GridItem span={8}>
            <Title headingLevel="h2">Queue: {queue.name}</Title>
          </GridItem>
          <GridItem span={4} style={{ textAlign: 'right' }}>
            <Button
              variant="secondary"
              onClick={() => (window.location.hash = buildQueuesUrl())}
            >
              Back to queues
            </Button>
          </GridItem>
        </Grid>
      </PageSection>

      {/* Summary */}
      <PageSection>
        <Card isFlat isCompact>
          <CardBody>
            <Grid hasGutter>
              <GridItem span={2}><b>Size:</b> {queue.size}</GridItem>
              <GridItem span={2}><b>Enqueue:</b> {queue.stats.enqueue}</GridItem>
              <GridItem span={2}><b>Dequeue:</b> {queue.stats.dequeue}</GridItem>
              <GridItem span={2}><b>Consumers:</b> {queue.consumers}</GridItem>
              <GridItem span={2}><b>Memory:</b> {queue.memory.percent}%</GridItem>
              <GridItem span={2}>
                <b>State:</b>{' '}
                {queue.state.stopped
                  ? 'Stopped'
                  : queue.state.paused
                  ? 'Paused'
                  : 'Running'}
              </GridItem>
            </Grid>
          </CardBody>
        </Card>
      </PageSection>

      {/* Operations */}
      <PageSection>
        <Title headingLevel="h3">Operations</Title>
        <QueueOperations queue={queue} onAction={loadInfo} />
      </PageSection>

      {/* Health */}
      <PageSection>
        <Title headingLevel="h3">Health</Title>
        <QueueHealth queue={latest} />
      </PageSection>

      {/* Throughput */}
      <PageSection>
        <Title headingLevel="h3">Throughput</Title>
        <QueueThroughput history={history} />
      </PageSection>

      {/* Lag */}
      <PageSection>
        <Title headingLevel="h3">Consumer Lag</Title>
        <QueueLag queue={latest} />
      </PageSection>

      {/* Charts */}
      <PageSection>
        <Title headingLevel="h3">Charts</Title>
        <QueueCharts history={history} />
      </PageSection>

      {/* Attributes */}
      <PageSection>
        <Title headingLevel="h3">Attributes</Title>
        <QueueAttributes queue={latest} />
      </PageSection>

      {/* Alerts */}
      <PageSection>
        <Title headingLevel="h3">Alerts</Title>
        <QueueAlerts queue={latest} history={history} />
      </PageSection>

      {/* Storage */}
      <PageSection>
        <Title headingLevel="h3">Storage</Title>
        <QueueStorage queue={latest} />
      </PageSection>

      {/* DLQ */}
      <PageSection>
        <Title headingLevel="h3">DLQ</Title>
        <QueueDLQ queue={latest} />
      </PageSection>

      {/* Consumers */}
      <PageSection>
        <Title headingLevel="h3">Consumers</Title>
        <QueueConsumers queue={latest} history={history} />
      </PageSection>

      {/* Messages */}
      <PageSection>
        <Title headingLevel="h3">Messages</Title>
        <QueueBrowser queue={queue} />
      </PageSection>
    </>
  )
}
