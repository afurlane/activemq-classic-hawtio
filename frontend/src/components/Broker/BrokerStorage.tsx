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

import type { BrokerMetrics } from '../../hooks/useBrokerMetrics'

interface Props {
  latest: BrokerMetrics
}

const labelAutoMarginStyle = { marginLeft: 'auto' }

export const BrokerStorage: React.FC<Props> = ({ latest }) => {
  const storage = latest.storage

  if (!storage) {
    return (
      <Card isCompact>
        <CardBody>
          <Alert variant="danger" title="No storage metrics available" isInline />
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
    <Card isCompact>
      <CardHeader>
        <CardTitle>Broker Storage</CardTitle>
        <Label color={severity} style={labelAutoMarginStyle}>
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
