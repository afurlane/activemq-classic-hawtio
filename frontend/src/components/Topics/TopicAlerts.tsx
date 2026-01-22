import React from 'react'
import {
  Card,
  CardBody,
  Title,
  Alert,
  AlertGroup
} from '@patternfly/react-core'

import { ActiveMQTopicAttributes } from '../../types/activemq'

export const TopicAlerts: React.FC<{ attrs: ActiveMQTopicAttributes }> = ({ attrs }) => {
  const alerts: string[] = []

  if (attrs.MemoryPercentUsage > 80) alerts.push('High memory usage')
  if (attrs.ProducerCount === 0) alerts.push('No producers')
  if (attrs.ConsumerCount === 0) alerts.push('No subscribers')

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Alerts</Title>

        {alerts.length === 0 && (
          <Alert
            variant="success"
            title="No alerts"
            isInline
          />
        )}

        {alerts.length > 0 && (
          <AlertGroup isLiveRegion>
            {alerts.map((a, i) => (
              <Alert
                key={i}
                variant="danger"
                title={a}
                isInline
              />
            ))}
          </AlertGroup>
        )}
      </CardBody>
    </Card>
  )
}
