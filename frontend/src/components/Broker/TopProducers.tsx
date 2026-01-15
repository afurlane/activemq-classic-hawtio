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

export const TopProducers: React.FC = () => {
  const [producers, setProducers] = useState<any[]>([]);

  const load = async () => {
    const mbeans = await activemq.listProducers();
    const attrs = await Promise.all(
      mbeans.map(m => activemq.getProducerAttributes(m))
    );

    const sorted = attrs
      .map(a => ({
        clientId: a.ClientId,
        destination: a.DestinationName,
        sent: a.SentCount,
        blocked: a.ProducerBlocked,
        pctBlocked: a.PercentageBlocked
      }))
      .sort((a, b) => b.sent - a.sent)
      .slice(0, 10);

    setProducers(sorted);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Top Producers</Title>

        {producers.length === 0 && <p>No producers found</p>}

        {producers.map((p, i) => (
          <DescriptionList key={i} isHorizontal>
            <DescriptionListGroup>
              <DescriptionListTerm>Client</DescriptionListTerm>
              <DescriptionListDescription>
                <b>{p.clientId}</b>
              </DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>Destination</DescriptionListTerm>
              <DescriptionListDescription>
                {p.destination}
              </DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>Sent</DescriptionListTerm>
              <DescriptionListDescription>
                {p.sent}
              </DescriptionListDescription>
            </DescriptionListGroup>

            {p.blocked && (
              <DescriptionListGroup>
                <DescriptionListTerm>Status</DescriptionListTerm>
                <DescriptionListDescription>
                  <Label color="red" icon={<ExclamationCircleIcon />}>Blocked</Label>
                </DescriptionListDescription>
              </DescriptionListGroup>
            )}
          </DescriptionList>
        ))}
      </CardBody>
    </Card>
  );
};
