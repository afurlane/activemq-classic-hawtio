import React from 'react'
import {
  Card,
  CardBody,
  Title
} from '@patternfly/react-core'

export const TopicOperations: React.FC = () => {
  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Operations</Title>
        <p>No operations available for topics.</p>
      </CardBody>
    </Card>
  )
}
