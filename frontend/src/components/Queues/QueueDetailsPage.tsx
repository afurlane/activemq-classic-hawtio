import React, { useEffect, useRef, useState } from 'react'
import {
  PageSection,
  PageSectionVariants,
  Title,
  Button,
  Grid,
  GridItem,
  Card,
  CardBody,
  Tabs,
  Tab,
  TabTitleText,
  Alert,
} from '@patternfly/react-core'

import { activemq } from '../../services/activemq/ActiveMQClassicService'
import { buildQueuesUrl } from '../../router/router'

import { QueueBrowser } from './QueueBrowser'
import { QueueOperations } from './QueueOperations'
import { QueueAttributes } from './QueueAttributes'
import { QueueMetricsOverview } from './QueueMetrics'
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

export const QueueDetailsPage: React.FC<{ queueName: string }> = ({ queueName }) => {
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
  const [activeTab, setActiveTab] = useState<string>('overview')
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
      {/* HEADER */}
      <PageSection variant={PageSectionVariants.light}>
        <Grid hasGutter>
          <GridItem span={8}>
            <Title headingLevel="h2">{queue.name}</Title>
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

      {/* SUMMARY */}
      <PageSection>
        <Card isFlat>
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

      {/* TABS */}
      <PageSection>
        <Tabs
          activeKey={activeTab}
          onSelect={(_, key) => setActiveTab(key as string)}
        >
          <Tab eventKey="overview" title={<TabTitleText>Overview</TabTitleText>} />
          <Tab eventKey="metrics" title={<TabTitleText>Metrics</TabTitleText>} />
          <Tab eventKey="messages" title={<TabTitleText>Messages</TabTitleText>} />
          <Tab eventKey="consumers" title={<TabTitleText>Consumers</TabTitleText>} />
          <Tab eventKey="storage" title={<TabTitleText>Storage</TabTitleText>} />
          <Tab eventKey="dlq" title={<TabTitleText>DLQ</TabTitleText>} />
          <Tab eventKey="attributes" title={<TabTitleText>Attributes</TabTitleText>} />
          <Tab eventKey="alerts" title={<TabTitleText>Alerts</TabTitleText>} />
          <Tab eventKey="operations" title={<TabTitleText>Operations</TabTitleText>} />
        </Tabs>
      </PageSection>

      {/* TAB CONTENT */}
      <PageSection>
        {activeTab === 'overview' && (
          <>
            <QueueHealth queue={latest} />
            <QueueThroughput history={history} />
            <QueueLag queue={latest} />
            <QueueMetricsOverview history={history} />
          </>
        )}

        {activeTab === 'metrics' && (
          <>
            <QueueMetricsOverview history={history} />
            <QueueThroughput history={history} />
            <QueueLag queue={latest} />
          </>
        )}

        {activeTab === 'messages' && <QueueBrowser queue={queue} />}

        {activeTab === 'consumers' && (
          <QueueConsumers queue={latest} history={history} />
        )}

        {activeTab === 'storage' && <QueueStorage queue={latest} />}

        {activeTab === 'dlq' && <QueueDLQ queue={latest} />}

        {activeTab === 'attributes' && <QueueAttributes queue={latest} />}

        {activeTab === 'alerts' && (
          <QueueAlerts queue={latest} history={history} />
        )}

        {activeTab === 'operations' && (
          <QueueOperations queue={queue} onAction={loadInfo} />
        )}
      </PageSection>
    </>
  )
}
