import React, { useCallback, useState } from 'react'
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

import { buildQueuesUrl } from '../../router/router'

import { QueueBrowser } from './QueueBrowser'
import { QueueOperations } from './QueueOperations'
import { QueueAttributes } from './QueueAttributes'
import { QueueMetrics } from './QueueMetrics'
import { QueueHealth } from './QueueHealth'
import { QueueThroughput } from './QueueThroughput'
import { QueueLag } from './QueueLag'
import { QueueAlerts } from './QueueAlerts'
import { QueueStorage } from './QueueStorage'
import { QueueDLQ } from './QueueDLQ'
import { QueueConsumers } from './QueueConsumers'

import { useQueueMetrics } from '../../hooks/useQueueMetrics'
import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'
import { useQueue } from '../../hooks/useQueue'
import { QueueThroughputChart } from './QueueThroughputChart'
import { RefreshToolbar } from '../Common/RefreshControls'

const rightAlignedStyle: React.CSSProperties = { textAlign: 'right' }

export const QueueDetailsPage: React.FC<{ queueName: string }> = ({ queueName }) => {
  const brokerName = useSelectedBrokerName()
  const handleBackToQueuesClick = useCallback(() => {
    window.location.hash = buildQueuesUrl()
  }, [])

    // SWR: carica la queue
  const { data: queue, isLoading: queueLoading } = useQueue(brokerName, queueName)

  // SWR: carica metriche
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [interval, setInterval] = useState(10000)
  const { latest, history, loading: metricsLoading, refresh: poll } = useQueueMetrics(queue?.mbean ?? '', autoRefresh, interval)

  const [activeTab, setActiveTab] = useState<string>('overview')
  const handleTabSelect = useCallback((_: React.SyntheticEvent, key: string | number) => {
    setActiveTab(String(key))
  }, [])
  const handleManualRefresh = useCallback(() => {
    poll()
  }, [poll])
  const handleNoopAction = useCallback(async () => {}, [])

  if (!brokerName) {
    return (
      <Card isFlat isCompact>
        <CardBody>
          <Alert variant="danger" title="No broker selected" isInline />
        </CardBody>
      </Card>
    )
  }

  if (queueLoading || metricsLoading || !queue || !latest) {
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
          <GridItem span={4} style={rightAlignedStyle}>
            <Button
              variant="secondary"
              onClick={handleBackToQueuesClick}
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
          onSelect={handleTabSelect}
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
          </>
        )}

        {activeTab === 'metrics' && (
          <>
            <QueueMetrics history={history} />
            <QueueThroughput history={history} />
            <QueueThroughputChart history={history} />
            <QueueLag queue={latest} />
          </>
        )}

        {activeTab === 'messages' && <QueueBrowser queue={queue} onAction={handleQueueAction} />}

        {activeTab === 'consumers' && (
          <QueueConsumers queue={latest} history={history} />
        )}

        {activeTab === 'storage' && <QueueStorage queue={latest} />}

        {activeTab === 'dlq' && <QueueDLQ queue={latest} />}

        {activeTab === 'attributes' && <QueueAttributes queue={latest} />}

        {activeTab === 'alerts' && (
          <>
            <RefreshToolbar
              autoRefresh={autoRefresh}
              onToggle={setAutoRefresh}
              interval={interval}
              onIntervalChange={setInterval}
              onManualRefresh={handleManualRefresh}
            />

            <QueueAlerts queue={latest} history={history} />
          </>
        )}


        {activeTab === 'operations' && (
          <QueueOperations queue={queue} onAction={handleNoopAction} />
        )}
      </PageSection>
    </>
  )
}
