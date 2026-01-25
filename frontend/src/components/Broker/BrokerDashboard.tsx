import React from 'react'
import {
  PageSection,
  PageSectionVariants,
  Title,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Alert,
  Label,
  Flex,
  FlexItem
} from '@patternfly/react-core'

import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'
import { useBrokers } from '../../hooks/useBrokers'

import { BrokerTrends } from './BrokerTrends'
import { BrokerThroughput } from './BrokerThroughput'
import { BrokerStorage } from './BrokerStorage'
import { BrokerAlerts } from './BrokerAlerts'
import { TopConsumers } from './TopConsumers'
import { TopProducers } from './TopProducers'

export const BrokerDashboard: React.FC = () => {
  const brokerName = useSelectedBrokerName()

  const { brokers, isLoading, error } = useBrokers()
  const broker = brokers.find(b => b.name === brokerName)

  let statusLabel = <Label color="green">Connected</Label>
  if (isLoading) statusLabel = <Label color="blue">Connecting…</Label>
  if (error || !broker) statusLabel = <Label color="red">Disconnected</Label>

  if (!brokerName) {
    return (
      <PageSection>
        <Card isFlat isCompact>
          <CardBody>
            <Alert variant="danger" title="No broker selected" isInline />
          </CardBody>
        </Card>
      </PageSection>
    )
  }

  return (
    <>
      {/* HEADER PF5 */}
      <PageSection variant={PageSectionVariants.light}>
        <Flex
          alignItems={{ default: 'alignItemsCenter' }}
          justifyContent={{ default: 'justifyContentSpaceBetween' }}
        >
          <FlexItem>{statusLabel}</FlexItem>

          <FlexItem>
            <Title headingLevel="h2">Broker Dashboard</Title>
            <div style={{ marginTop: '0.25rem', opacity: 0.7 }}>
              Metrics and operational insights for broker <strong>{brokerName}</strong>
            </div>
          </FlexItem>
        </Flex>
      </PageSection>

      {/* MAIN GRID */}
      <PageSection isFilled>
        <Grid hasGutter md={6} lg={4} xl={3}>

          <GridItem>
            <Card isFlat>
              <CardHeader><CardTitle>Trends</CardTitle></CardHeader>
              <CardBody><BrokerTrends /></CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card isFlat>
              <CardHeader><CardTitle>Throughput</CardTitle></CardHeader>
              <CardBody><BrokerThroughput /></CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card isFlat>
              <CardHeader><CardTitle>Storage</CardTitle></CardHeader>
              <CardBody><BrokerStorage /></CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card isFlat>
              <CardHeader><CardTitle>Alerts</CardTitle></CardHeader>
              <CardBody><BrokerAlerts /></CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card isFlat>
              <CardHeader><CardTitle>Top Consumers</CardTitle></CardHeader>
              <CardBody><TopConsumers /></CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card isFlat>
              <CardHeader><CardTitle>Top Producers</CardTitle></CardHeader>
              <CardBody><TopProducers /></CardBody>
            </Card>
          </GridItem>

        </Grid>
      </PageSection>
    </>
  )
}
