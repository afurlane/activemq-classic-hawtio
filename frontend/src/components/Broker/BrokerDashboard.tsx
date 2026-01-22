import React from 'react'
import {
  PageSection,
  PageSectionVariants,
  Title,
  Grid,
  GridItem,
  Card,
  CardBody,
  Alert
} from '@patternfly/react-core'

import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'

import { BrokerTrends } from './BrokerTrends'
import { BrokerThroughput } from './BrokerThroughput'
import { BrokerStorage } from './BrokerStorage'
import { BrokerAlerts } from './BrokerAlerts'
import { TopConsumers } from './TopConsumers'
import { TopProducers } from './TopProducers'

export const BrokerDashboard: React.FC = () => {
  const brokerName = useSelectedBrokerName()

  if (!brokerName) {
    return (
      <PageSection>
        <Card isFlat isCompact>
          <CardBody>
            <Alert
              variant="danger"
              title="No broker selected"
              isInline
            />
          </CardBody>
        </Card>
      </PageSection>
    )
  }

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h2">Broker Dashboard</Title>
      </PageSection>

      <PageSection isFilled>
        <Grid hasGutter md={6} lg={4} xl={3}>
          <GridItem><BrokerTrends /></GridItem>
          <GridItem><BrokerThroughput /></GridItem>
          <GridItem><BrokerStorage /></GridItem>
          <GridItem><BrokerAlerts /></GridItem>
          <GridItem><TopConsumers /></GridItem>
          <GridItem><TopProducers /></GridItem>
        </Grid>
      </PageSection>
    </>
  )
}
