import React from 'react'
import {
  Card,
  CardBody,
  Title,
  Alert
} from '@patternfly/react-core'

export const TopicOperations: React.FC = () => {
  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Operations</Title>

        <Alert
          variant="info"
          isInline
          title="No operations available for this topic"
        >
          This topic does not support administrative operations.
        </Alert>
      </CardBody>
    </Card>
  )
}
