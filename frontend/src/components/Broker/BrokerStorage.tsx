import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Alert,
  Label
} from '@patternfly/react-core'

import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'
import { useBrokerStorage } from '../../hooks/useBrokerStorage'

export const BrokerStorage: React.FC = () => {
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

  const { data: storage, isLoading, error } = useBrokerStorage(brokerName)

  if (isLoading) {
    return (
      <Card isFlat isCompact>
        <CardBody>
          <Alert variant="info" title="Loading storage metrics…" isInline />
        </CardBody>
      </Card>
    )
  }

  if (error || !storage) {
    return (
      <Card isFlat isCompact>
        <CardBody>
          <Alert variant="danger" title="Failed to load storage metrics" isInline />
        </CardBody>
      </Card>
    )
  }

  const severity =
    storage.temp > 80 || storage.memory > 80_000_000
      ? 'red'
      : storage.temp > 60 || storage.memory > 40_000_000
      ? 'orange'
      : 'green'

  return (
    <Card isFlat isCompact>
      <CardHeader>
        <CardTitle>Broker Storage</CardTitle>
        <Label color={severity} style={{ marginLeft: 'auto' }}>
          {severity === 'red'
            ? 'Critical'
            : severity === 'orange'
            ? 'Warning'
            : 'Healthy'}
        </Label>
      </CardHeader>

      <CardBody>
        <DescriptionList isHorizontal>

          <DescriptionListGroup>
            <DescriptionListTerm>Total Store Size</DescriptionListTerm>
            <DescriptionListDescription>
              {storage.store.toLocaleString()} bytes
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Average Temp Usage</DescriptionListTerm>
            <DescriptionListDescription>
              {storage.temp.toFixed(1)}%
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Total Cursor Memory</DescriptionListTerm>
            <DescriptionListDescription>
              {storage.cursor.toLocaleString()} bytes
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Total Memory Usage</DescriptionListTerm>
            <DescriptionListDescription>
              {storage.memory.toLocaleString()} bytes
            </DescriptionListDescription>
          </DescriptionListGroup>

        </DescriptionList>
      </CardBody>
    </Card>
  )
}
