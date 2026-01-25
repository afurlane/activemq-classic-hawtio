import React from 'react'
import {
  Card,
  CardBody,
  Title,
  Alert,
  AlertGroup
} from '@patternfly/react-core'

import { ActiveMQTopicAttributes } from '../../types/activemq'

interface Props {
  attrs: ActiveMQTopicAttributes
}

type Severity = 'success' | 'warning' | 'danger'

export const TopicAlerts: React.FC<Props> = ({ attrs }) => {

  const rules: Array<{
    when: boolean
    message: string
    severity: Severity
  }> = [
    {
      when: attrs.MemoryPercentUsage > 80,
      message: 'High memory usage',
      severity: 'danger'
    },
    {
      when: attrs.ProducerCount === 0,
      message: 'No producers',
      severity: 'warning'
    },
    {
      when: attrs.ConsumerCount === 0,
      message: 'No subscribers',
      severity: 'warning'
    }
  ]

  const alerts = rules.filter(r => r.when)

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
                variant={a.severity}
                title={a.message}
                isInline
              />
            ))}
          </AlertGroup>
        )}
      </CardBody>
    </Card>
  )
}
