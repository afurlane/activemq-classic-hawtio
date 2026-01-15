import React, { useEffect, useState } from 'react';
import { activemq } from '../../services/activemq';
import {
  Card,
  CardBody,
  Title,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription
} from '@patternfly/react-core';

export const BrokerStorage: React.FC = () => {
  const [storage, setStorage] = useState({
    store: 0,
    temp: 0,
    cursor: 0,
    memory: 0,
  });

  const poll = async () => {
    const queues = await activemq.listQueuesWithAttributes();

    let store = 0;
    let cursor = 0;
    let memory = 0;
    let tempSum = 0;

    queues.forEach(({ attrs }) => {
      store += attrs.StoreMessageSize;
      cursor += attrs.CursorMemoryUsage;
      memory += attrs.MemoryUsageByteCount;
      tempSum += attrs.TempUsagePercentUsage;
    });

    const temp = queues.length > 0 ? tempSum / queues.length : 0;

    setStorage({ store, temp, cursor, memory });
  };

  useEffect(() => {
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Broker Storage</Title>

        <DescriptionList isHorizontal>
          <DescriptionListGroup>
            <DescriptionListTerm>Total Store Size</DescriptionListTerm>
            <DescriptionListDescription>
              {storage.store} bytes
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
              {storage.cursor} bytes
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Total Memory Usage</DescriptionListTerm>
            <DescriptionListDescription>
              {storage.memory} bytes
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardBody>
    </Card>
  );
};
