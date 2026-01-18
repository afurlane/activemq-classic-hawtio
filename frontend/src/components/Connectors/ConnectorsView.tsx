import React, { useEffect, useState } from 'react';
import { activemq } from '../../services/activemq';
import {
  PageSection,
  Title,
  Button,
  Badge,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelContent,
  Card,
  CardBody
} from '@patternfly/react-core';
import {  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';
import { Label } from '@patternfly/react-core';

export const ConnectorsView: React.FC = () => {
  const [connectors, setConnectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [connections, setConnections] = useState<any[]>([]);
  const [isDrawerExpanded, setDrawerExpanded] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await activemq.listConnectors();
    setConnectors(data);
    setLoading(false);
  };

  const loadConnections = async (connector: any) => {
    setSelected(connector);
    const list = await activemq.listConnections(connector.mbean);
    setConnections(list);
    setDrawerExpanded(true);
  };

  const closeDrawer = () => {
    setDrawerExpanded(false);
    setSelected(null);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div>Loading connectors…</div>;

  const panel = selected && (
    <DrawerPanelContent widths={{ default: 'width_50' }}>
      <Card isFlat>
        <CardBody>
          <Title headingLevel="h3">Connections for {selected.name}</Title>

          <Table variant="compact">
            <Thead>
              <Tr>
                <Th>Connection ID</Th>
                <Th>Client ID</Th>
                <Th>Remote Address</Th>
                <Th>Protocol</Th>
                <Th>Uptime</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {connections.map((conn, i) => (
                <Tr key={i}>
                  <Td>{conn.connectionId}</Td>
                  <Td>{conn.clientId}</Td>
                  <Td>{conn.remoteAddress}</Td>
                  <Td>{conn.protocol}</Td>
                  <Td>{conn.uptime}</Td>
                  <Td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        activemq.dropConnection(selected.mbean, conn.connectionId)
                      }
                    >
                      Drop
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Button variant="secondary" onClick={closeDrawer} style={{ marginTop: '1rem' }}>
            Close
          </Button>
        </CardBody>
      </Card>
    </DrawerPanelContent>
  );

  return (
    <PageSection>
      <Title headingLevel="h2">Connectors</Title>

      <Drawer isExpanded={isDrawerExpanded}>
        <DrawerContent panelContent={panel}>
          <DrawerContentBody>
            <Table variant="compact">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Protocol</Th>
                  <Th>Status</Th>
                  <Th>Connections</Th>
                  <Th>Inbound</Th>
                  <Th>Outbound</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {connectors.map((c, i) => (
                  <Tr key={i}>
                    <Td>{c.name}</Td>
                    <Td>{c.protocol}</Td>
                    <Td>
                      <Label color={c.active ? 'green' : 'red'}>
                        {c.active ? 'Active' : 'Inactive'}
                      </Label>
                    </Td>
                    <Td>{c.connectionCount}</Td>
                    <Td>{c.inbound}</Td>
                    <Td>{c.outbound}</Td>
                    <Td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => loadConnections(c)}
                      >
                        Details
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </DrawerContentBody>
        </DrawerContent>
      </Drawer>
    </PageSection>
  );
};
