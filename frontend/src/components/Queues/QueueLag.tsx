import React from 'react'
import {
  Card,
  CardBody,
  Title,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Label
} from '@patternfly/react-core'

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon
} from '@patternfly/react-icons'

import { Queue } from '../../types/domain'

interface Props {
  queue: Queue
}

type Severity = 'green' | 'yellow' | 'red'

export const QueueLag: React.FC<Props> = ({ queue }) => {
  const lag = queue.size - queue.stats.inflight

  const severity: Severity =
    lag > 10000 ? 'red' :
    lag > 1000  ? 'yellow' :
                  'green'

  const icons: Record<Severity, React.ReactNode> = {
    green: <CheckCircleIcon />,
    yellow: <ExclamationTriangleIcon />,
    red: <ExclamationCircleIcon />
  }

  const colors: Record<Severity, "green" | "orange" | "red"> = {
    green: "green",
    yellow: "orange",
    red: "red"
  }

  const renderStatus = (value: number, sev: Severity) => (
    <Label color={colors[sev]} icon={icons[sev]}>
      {value.toLocaleString()}
    </Label>
  )

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Consumer Lag</Title>

        <DescriptionList isHorizontal>
          <DescriptionListGroup>
            <DescriptionListTerm>Lag</DescriptionListTerm>
            <DescriptionListDescription>
              {renderStatus(lag, severity)}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardBody>
    </Card>
  )
}
