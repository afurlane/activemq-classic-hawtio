import React, { useEffect, useRef, useState } from 'react'
import { activemq } from '../../services/activemq/ActiveMQClassicService'
import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'
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
  Alert
} from '@patternfly/react-core'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table'

export const ConnectorsView: React.FC = () => {
  const brokerName = useSelectedBrokerName()

  if (!brokerName) {
    return (
      <Card isFlat isCompact>
        <CardBody>
          <Alert variant="danger" title="No broker selected" isInline />
        </CardBody>
      </Card>
    )
  }

  const [connectors, setConnectors] = useState<any[]>([])
  const [selected, setSelected] = useState<any | null>(null)
  const [connections, setConnections] = useState<any[]>([])
  const [isDrawerExpanded, setDrawerExpanded] = useState(false)

  const mounted = useRef(false)

  const load = async () => {
    if (!brokerName || !mounted.current) return
    const data = await activemq.listConnectors(brokerName)
    if (mounted.current) setConnectors(data)
  }

  const loadConnections = async (connector: any) => {
    setSelected(connector)
    const list = await activemq.listConnections(connector.mbean)
    if (mounted.current) {
      setConnections(list)
      setDrawerExpanded(true)
    }
  }

  const closeDrawer = () => {
    setDrawerExpanded(false)
    setSelected(null)
  }

  useEffect(() => {
    mounted.current = true
    load()
    const id = setInterval(load, 5000)
    return () => {
      mounted.current = false
      clearInterval(id)
    }
  }, [brokerName])

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
  )

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
                  <Th modifier="fitContent" screenReaderText="Actions"></Th>
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
  )
}
