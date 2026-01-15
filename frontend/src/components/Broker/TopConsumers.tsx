import React, { useEffect, useState } from "react";
import { activemq } from "../../services/activemq";
import {
  Card,
  CardBody,
  Title,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription
} from "@patternfly/react-core";
import { Label } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon
} from '@patternfly/react-icons';

export const TopConsumers: React.FC = () => {
  const [consumers, setConsumers] = useState<any[]>([]);

  const load = async () => {
    const mbeans = await activemq.listConsumers();
    const attrs = await Promise.all(
      mbeans.map(m => activemq.getConsumerAttributes(m))
    );

    const sorted = attrs
      .map(a => ({
        clientId: a.ClientId,
        destination: a.DestinationName,
        dispatched: a.DispatchedCounter,
        dequeue: a.DequeueCounter,
        pending: a.PendingQueueSize,
        slow: a.SlowConsumer
      }))
      .sort((a, b) => b.dispatched - a.dispatched)
      .slice(0, 10);

    setConsumers(sorted);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Top Consumers</Title>

        {consumers.length === 0 && <p>No consumers found</p>}

        {consumers.map((c, i) => (
          <DescriptionList key={i} isHorizontal>
            <DescriptionListGroup>
              <DescriptionListTerm>Client</DescriptionListTerm>
              <DescriptionListDescription>
                <b>{c.clientId}</b>
              </DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>Destination</DescriptionListTerm>
              <DescriptionListDescription>
                {c.destination}
              </DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>Dispatched</DescriptionListTerm>
              <DescriptionListDescription>
                {c.dispatched}
              </DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>Pending</DescriptionListTerm>
              <DescriptionListDescription>
                {c.pending}
              </DescriptionListDescription>
            </DescriptionListGroup>

            {c.slow && (
              <DescriptionListGroup>
                <DescriptionListTerm>Status</DescriptionListTerm>
                <DescriptionListDescription>
                   <Label color="red" icon={<ExclamationCircleIcon />}> Slow </Label>
                </DescriptionListDescription>
              </DescriptionListGroup>
            )}
          </DescriptionList>
        ))}
      </CardBody>
    </Card>
  );
};
