import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Title,
  DataList,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
  Label
} from '@patternfly/react-core';

import { topics } from '../../services/topics';

export const TopicProducers: React.FC<{ topicName: string }> = ({ topicName }) => {
  const [prods, setProds] = useState<any[]>([]);

  const load = async () => {
    const data = await topics.listProducers(topicName);
    setProds(data);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [topicName]);

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Producers</Title>

        <DataList aria-label="Topic producers list" isCompact>
          {prods.map((p, i) => (
            <DataListItem key={i}>
              <DataListItemRow>
                <DataListItemCells
                  dataListCells={[
                    <DataListCell key="client">
                      <strong>{p.ClientId}</strong> — sent {p.SentCount}
                    </DataListCell>,
                    <DataListCell key="blocked">
                      {p.ProducerBlocked && (
                        <Label color="red">Blocked</Label>
                      )}
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
