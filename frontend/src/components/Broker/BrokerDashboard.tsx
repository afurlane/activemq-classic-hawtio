import React, { useState } from 'react'
import {
  PageSection,
  Title,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Grid,
  GridItem,
  Label,
  Alert,
  Flex,
  FlexItem
} from '@patternfly/react-core'

import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'
import { useBrokers } from '../../hooks/useBrokers'
import { useBrokerMetrics } from '../../hooks/useBrokerMetrics'

import { RefreshToolbar } from '../Common/RefreshControls'

import { BrokerTrends } from './BrokerTrends'
import { BrokerThroughput } from './BrokerThroughput'
import { BrokerStorage } from './BrokerStorage'
import { BrokerAlerts } from './BrokerAlerts'
import { TopConsumers } from './TopConsumers'
import { TopProducers } from './TopProducers'

const STATUS_LABELS = {
  disconnected: <Label color="red">Disconnected</Label>,
  connecting: <Label color="blue">Connecting…</Label>,
  connected: <Label color="green">Connected</Label>
}

const DASHBOARD_SUBTITLE_STYLE = {
  marginTop: '0.25rem',
  opacity: 0.7
}

const FLEX_ALIGN = { default: 'alignItemsCenter' } as const
const FLEX_JUSTIFY = { default: 'justifyContentSpaceBetween' } as const

export const BrokerDashboard: React.FC = () => {
  const brokerName = useSelectedBrokerName()
  const { brokers, isLoading, error } = useBrokers()
  const broker = brokers.find(b => b.name === brokerName)

  const [autoRefresh, setAutoRefresh] = useState(false)
  const [interval, setInterval] = useState(10000)

  const {
    latest,
    history,
    loading: metricsLoading,
    refresh
  } = useBrokerMetrics(brokerName, autoRefresh, interval)

  const handleToggle = React.useCallback(setAutoRefresh, [setAutoRefresh])
  const handleInterval = React.useCallback(setInterval, [setInterval])
  const handleManualRefresh = React.useCallback(() => refresh(), [refresh])

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

  // STATUS LABEL
  const statusLabel = error || !broker ? STATUS_LABELS.disconnected : isLoading ? STATUS_LABELS.connecting : STATUS_LABELS.connected

  // LOADING METRICS
  if (metricsLoading || !latest) {
    return (
      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h3">Loading broker metrics…</Title>
      </PageSection>
    )
  }

  return (
    <>
      {/* HEADER */}
      <PageSection hasBodyWrapper={false} >
        <Flex
          alignItems={FLEX_ALIGN}
          justifyContent={FLEX_JUSTIFY}
        >
          <FlexItem>{statusLabel}</FlexItem>

          <FlexItem>
            <Title headingLevel="h2">Broker Dashboard</Title>
            <div style={DASHBOARD_SUBTITLE_STYLE}>
              Live metrics for broker <strong>{brokerName}</strong>
            </div>
          </FlexItem>
        </Flex>
      </PageSection>

      {/* REFRESH CONTROLS */}
      <PageSection hasBodyWrapper={false} >
        <RefreshToolbar
          autoRefresh={autoRefresh}
          onToggle={handleToggle}
          interval={interval}
          onIntervalChange={handleInterval}
          onManualRefresh={handleManualRefresh}
        />
      </PageSection>

      {/* MAIN GRID */}
      <PageSection hasBodyWrapper={false} isFilled>
        <Grid hasGutter md={6} lg={4} xl={3}>

          <GridItem>
            <Card>
              <CardHeader><CardTitle>Trends</CardTitle></CardHeader>
              <CardBody>
                <BrokerTrends latest={latest} history={history} />
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card>
              <CardHeader><CardTitle>Throughput</CardTitle></CardHeader>
              <CardBody>
                <BrokerThroughput latest={latest} history={history} />
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card>
              <CardHeader><CardTitle>Storage</CardTitle></CardHeader>
              <CardBody>
                <BrokerStorage latest={latest} />
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card>
              <CardHeader><CardTitle>Alerts</CardTitle></CardHeader>
              <CardBody>
                <BrokerAlerts latest={latest} history={history} />
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card>
              <CardHeader><CardTitle>Top Consumers</CardTitle></CardHeader>
              <CardBody>
                <TopConsumers latest={latest} />
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card>
              <CardHeader><CardTitle>Top Producers</CardTitle></CardHeader>
              <CardBody>
                <TopProducers latest={latest} />
              </CardBody>
            </Card>
          </GridItem>

        </Grid>
      </PageSection>
    </>
  )
}
