import React from 'react';
import {
  Card,
  CardBody,
  Title,
  Button
} from '@patternfly/react-core';

import { topics } from '../../../src/services/topics';

export const TopicOperations: React.FC<{ mbean: string }> = ({ mbean }) => {
  const reset = async () => {
    await topics.resetStatistics(mbean);
  };

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Operations</Title>

        <Button variant="secondary" onClick={reset}>
          Reset statistics
        </Button>
      </CardBody>
    </Card>
  );
};
