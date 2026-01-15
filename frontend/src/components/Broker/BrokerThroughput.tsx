import React, { useEffect, useState } from 'react';
import { activemq } from '../../services/activemq';
import {
  Card,
  CardBody,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Title
} from '@patternfly/react-core';

export const BrokerThroughput: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [rates, setRates] = useState({
    enqueue: 0,
    dequeue: 0,
    dispatch: 0,
  });

  const poll = async () => {
    const queues = await activemq.listQueuesWithAttributes();

    const total = queues.reduce(
      (acc, { attrs }) => {
        acc.enqueue += attrs.EnqueueCount;
        acc.dequeue += attrs.DequeueCount;
        acc.dispatch += attrs.DispatchCount;
        return acc;
      },
      { enqueue: 0, dequeue: 0, dispatch: 0 }
    );

    setHistory(prev => {
      const next = [...prev, total].slice(-2);
      if (next.length === 2) {
        const dt = 5; // polling 5s
        setRates({
          enqueue: (next[1].enqueue - next[0].enqueue) / dt,
          dequeue: (next[1].dequeue - next[0].dequeue) / dt,
          dispatch: (next[1].dispatch - next[0].dispatch) / dt,
        });
      }
      return next;
    });
  };

  useEffect(() => {
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <Card isFlat isCompact className="broker-panel">
      <CardBody>
        <Title headingLevel="h4">Broker Throughput (msg/sec)</Title>

        <DescriptionList isHorizontal>
          <DescriptionListGroup>
            <DescriptionListTerm>Enqueue</DescriptionListTerm>
            <DescriptionListDescription>
              {rates.enqueue.toFixed(1)}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Dequeue</DescriptionListTerm>
            <DescriptionListDescription>
              {rates.dequeue.toFixed(1)}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Dispatch</DescriptionListTerm>
            <DescriptionListDescription>
              {rates.dispatch.toFixed(1)}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardBody>
    </Card>
  );
};
