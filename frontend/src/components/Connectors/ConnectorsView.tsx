import React, { useState, useCallback } from 'react'
import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'
import { useConnectors } from '../../hooks/useConnectors'
import { useConnections } from '../../hooks/useConnections'

import {
  PageSection,
  Title,
  Button,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelContent,
  Card,
  CardBody,
  Label,
  Alert,
} from '@patternfly/react-core'

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table'

import { activemq } from '../../services/activemq/ActiveMQClassicService'

const drawerPanelWidths = { default: 'width_50' } as const
const closeButtonStyle = { marginTop: '1rem' } as const

export const ConnectorsView: React.FC = () => {
  const brokerName = useSelectedBrokerName()

  // SWR: lista connectors
  const { data: connectors = [], error: connectorsError } = useConnectors(brokerName)

  // Drawer state
  const [selected, setSelected] = useState<any | null>(null)
  const isDrawerExpanded = !!selected

  // SWR: connections del connector selezionato
  const { data: connections = [] } = useConnections(selected?.mbean ?? null)

  const openDrawer = useCallback((connector: any) => {
    setSelected(connector)
  }, [])

  const closeDrawer = useCallback(() => {
    setSelected(null)
  }, [])

  const handleDropConnection = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!selected?.mbean) return
      const connectionId = event.currentTarget.dataset.connectionId
      if (!connectionId) return
      activemq.dropConnection(selected.mbean, connectionId)
    },
    [selected],
  )

  const handleOpenDrawer = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const mbean = event.currentTarget.dataset.mbean
      if (!mbean) return
      const connector = connectors.find((c) => c.mbean === mbean)
      if (!connector) return
      openDrawer(connector)
    },
    [connectors, openDrawer],
  )

  if (!brokerName) {
    return (
      <Card isFlat isCompact>
        <CardBody>
          <Alert variant="danger" title="No broker selected" isInline />
        </CardBody>
      </Card>
    )
  }

  const panel = selected && (
    <DrawerPanelContent widths={drawerPanelWidths}>
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
                <Th modifier="fitContent"></Th>
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
                      data-connection-id={conn.connectionId}
                      onClick={handleDropConnection}
                    >
                      Drop
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Button variant="secondary" onClick={closeDrawer} style={closeButtonStyle}>
            Close
          </Button>
        </CardBody>
      </Card>
    </DrawerPanelContent>
  )

  return (
    <PageSection>
      <Title headingLevel="h2">Connectors</Title>

      <Drawer isExpanded={isDrawerExpanded}>
        <DrawerContent panelContent={panel}>
          <DrawerContentBody>
            {connectorsError && (
              <Alert variant="danger" title="Failed to load connectors" isInline />
            )}

            <Table variant="compact">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Protocol</Th>
                  <Th>Status</Th>
                  <Th>Connections</Th>
                  <Th>Inbound</Th>
                  <Th>Outbound</Th>
                  <Th modifier="fitContent"></Th>
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
                    <Td>{c.traffic.inbound}</Td>
                    <Td>{c.traffic.outbound}</Td>
                    <Td>
                      <Button
                        variant="primary"
                        size="sm"
                        data-mbean={c.mbean}
                        onClick={handleOpenDrawer}
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
  )
}
