import React, { useEffect, useState } from 'react';
import {
  PageSection,
  PageSectionVariants,
  Title,
  Card,
  CardBody,
  Button
} from '@patternfly/react-core';
import {  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';
import { buildTopicUrl } from '../../router/router';
import { activemq } from '../../services/activemq/ActiveMQClassicService';

export const TopicsView: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await activemq.listTopics();
    setList(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  if (loading) {
    return (
      <PageSection>
        <Title headingLevel="h3">Loading topics…</Title>
      </PageSection>
    );
  }

  return (
    <PageSection variant={PageSectionVariants.light}>
      <Title headingLevel="h2">Topics</Title>

      <Card isFlat isCompact style={{ marginTop: '1rem' }}>
        <CardBody>
          <Table variant="compact">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Enq</Th>
                <Th>Deq</Th>
                <Th>Producers</Th>
                <Th>Subscribers</Th>
                <Th>Size</Th>
                <Th modifier="fitContent" screenReaderText="Actions"></Th>
              </Tr>
            </Thead>

            <Tbody>
              {list.map((t, i) => (
                <Tr key={i}>
                  <Td>{t.name}</Td>
                  <Td>{t.enqueueCount}</Td>
                  <Td>{t.dequeueCount}</Td>
                  <Td>{t.producerCount}</Td>
                  <Td>{t.consumerCount}</Td>
                  <Td>{t.queueSize}</Td>
                  <Td>
                    <Button
                      variant="secondary"
                      onClick={() => (window.location.hash = buildTopicUrl(t.name))}
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
