import React, { useEffect, useState } from 'react';
import {
  PageSection,
  PageSectionVariants,
  Title,
  Card,
  CardBody,
  Button,
  Label
} from '@patternfly/react-core';
import {  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';
import {
  CheckCircleIcon,
  PauseCircleIcon,
  BanIcon
} from '@patternfly/react-icons';

import { activemq } from '../../services/activemq';
import { buildQueueUrl } from '../../router/router';

export const QueuesView: React.FC = () => {
  const [queues, setQueues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await activemq.listQueues();
    setQueues(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <PageSection>
        <Title headingLevel="h3">Loading queues…</Title>
      </PageSection>
    );
  }

  const renderState = (q: any) => {
    if (q.stopped) {
      return (
        <Label color="red" icon={<BanIcon />}>
          Stopped
        </Label>
      );
    }
    if (q.paused) {
      return (
        <Label color="orange" icon={<PauseCircleIcon />}>
          Paused
        </Label>
      );
    }
    return (
      <Label color="green" icon={<CheckCircleIcon />}>
        Running
      </Label>
    );
  };

  return (
    <PageSection variant={PageSectionVariants.light}>
      <Title headingLevel="h2">Queues</Title>

      <Card isFlat isCompact style={{ marginTop: '1rem' }}>
        <CardBody>
          <Table variant="compact">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Size</Th>
                <Th>Enq</Th>
                <Th>Deq</Th>
                <Th>Consumers</Th>
                <Th>State</Th>
                <Th></Th>
              </Tr>
            </Thead>

            <Tbody>
              {queues.map((q, i) => (
                <Tr key={i}>
                  <Td>{q.name}</Td>
                  <Td>{q.queueSize}</Td>
                  <Td>{q.enqueueCount}</Td>
                  <Td>{q.dequeueCount}</Td>
                  <Td>{q.consumerCount}</Td>
                  <Td>{renderState(q)}</Td>
                  <Td>
                    <Button
                      variant="secondary"
                      onClick={() => (window.location.hash = buildQueueUrl(q.name))}
                    >
                      Details
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </PageSection>
  );
};
