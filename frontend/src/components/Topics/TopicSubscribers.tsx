import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Title,
  DataList,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell
} from '@patternfly/react-core';

import { topics } from '../../services/topics';

export const TopicSubscribers: React.FC<{ topicName: string }> = ({ topicName }) => {
  const [subs, setSubs] = useState<any[]>([]);

  const load = async () => {
    const data = await topics.listSubscribers(topicName);
    setSubs(data);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [topicName]);

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Subscribers</Title>

        <DataList aria-label="Topic subscribers list" isCompact>
          {subs.map((s, i) => (
            <DataListItem key={i}>
              <DataListItemRow>
                <DataListItemCells
                  dataListCells={[
                    <DataListCell key="client">
                      <strong>{s.ClientId}</strong> — dispatched {s.DispatchedCounter}, pending {s.PendingQueueSize}
                    </DataListCell>
                  ]}
                />
              </DataListItemRow>
            </DataListItem>
          ))}
        </DataList>
      </CardBody>
    </Card>
  );
};
