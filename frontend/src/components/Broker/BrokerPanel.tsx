import React, { useCallback, useEffect, useState } from 'react'
import { mutate } from 'swr'
import {
  PageSection,
  PageSectionVariants,
  Title,
  Tabs,
  Tab,
  TabTitleText,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Breadcrumb,
  BreadcrumbItem,
  MenuToggle,
  Dropdown,
  DropdownList,
  DropdownItem,
  Label,
} from '@patternfly/react-core'

import {
  parseHashRoute,
  buildConnectorsUrl,
  buildQueuesUrl,
  buildTopicsUrl,
  buildBrokerUrl,
  buildOverviewUrl,
  Route
} from '../../router/router'

import { ConnectorsView } from '../../components/Connectors/ConnectorsView'
import { QueuesView } from '../../components/Queues/QueuesView'
import { QueueDetailsPage } from '../../components/Queues/QueueDetailsPage'
import { TopicsView } from '../../components/Topics/TopicsView'
import { TopicDetailsPage } from '../../components/Topics/TopicDetailsPage'
import { BrokerDashboard } from '../../components/Broker/BrokerDashboard'
import { BrokerOverview } from '../../components/Broker/BrokerOverview'
import { BrokerSelector } from './BrokerSelector'

import { useSelectedBroker } from '../../hooks/useSelectedBroker'
import { useBrokers } from '../../hooks/useBrokers'

const noPadding = { default: 'noPadding' } as const;
const alighRight = { default: 'alignRight' } as const;

const viewToTab = {
  connectors: 0,
  queues: 1,
  topics: 2,
  broker: 3,
  overview: 4,
} as const


const tabToView = Object.fromEntries(
  Object.entries(viewToTab).map(([view, key]) => [key, view])
) as Record<number, Route['view']>

const viewToUrl = {
  connectors: buildConnectorsUrl,
  queues: buildQueuesUrl,
  topics: buildTopicsUrl,
  broker: buildBrokerUrl,
  overview: buildOverviewUrl,
} as const

const pluginRefreshKeys = new Set([
  'brokers',
  'queues',
  'queue',
  'queue-history',
  'queue-messages',
  'dlq',
  'topics',
  'topic-metrics',
  'topic-messages',
  'subscriptions',
  'connectors',
  'connections',
  'consumers',
  'producers',
  'top-producers',
])

const onSelect = (_event: React.MouseEvent, eventKey: string | number) => {
  const key = Number(eventKey)
  const view = tabToView[key]
  if (!view) return
  window.location.hash = viewToUrl[view]()
}

export const BrokerPanel: React.FC = () => {
  const [route, setRoute] = useState<Route>(() =>
    parseHashRoute(window.location.hash)
  )

  const { brokers, isLoading, error } = useBrokers()
  const broker = useSelectedBroker()

  const brokerExists = broker && brokers.some(b => b.name === broker.name)

  let statusLabel = <Label color="green">Connected</Label>
  if (isLoading) statusLabel = <Label color="blue">Connecting…</Label>
  if (error || !brokerExists) statusLabel = <Label color="red">Disconnected</Label>

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHashRoute(window.location.hash))
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const activeKey = viewToTab[route.view]
  const [refreshVersion, setRefreshVersion] = useState(0)

  const [actionsOpen, setActionsOpen] = useState(false)

  const onToggleClick = useCallback(() => setActionsOpen(prev => !prev), []);

  const renderToggle = useCallback(
    (toggleRef: any) => (
      <MenuToggle
        ref={toggleRef}
        onClick={onToggleClick}
        isExpanded={actionsOpen}
        variant="plain"
      >
        ⋮
      </MenuToggle>
    ),
    [actionsOpen, onToggleClick]
  );

  const onRefresh = useCallback(async () => {
    await mutate(
      key => {
        if (typeof key === 'string') {
          return pluginRefreshKeys.has(key)
        }
        if (!Array.isArray(key)) {
          return false
        }
        if (key[1] === 'disabled') {
          return false
        }
        return typeof key[0] === 'string' && pluginRefreshKeys.has(key[0])
      },
      undefined,
      { revalidate: true }
    )
    setRefreshVersion(prev => prev + 1)
  }, [])

  return (
    <>
      {/* HEADER */}
      <PageSection variant={PageSectionVariants.light} padding={noPadding}>
        <PageSection variant={PageSectionVariants.light}>
          <Breadcrumb>
            <BreadcrumbItem to="#">ActiveMQ</BreadcrumbItem>
            <BreadcrumbItem isActive>
              {broker?.name ?? 'No broker selected'}
            </BreadcrumbItem>
          </Breadcrumb>
        </PageSection>

        <PageSection variant={PageSectionVariants.light}>
          <Toolbar>
            <ToolbarContent>

              <ToolbarItem>
                <Title headingLevel="h1">ActiveMQ Classic</Title>
              </ToolbarItem>

              <ToolbarItem>{statusLabel}</ToolbarItem>

              <ToolbarItem align={alighRight}>
                <BrokerSelector />
              </ToolbarItem>

              <ToolbarItem>
                <Dropdown
                  isOpen={actionsOpen}
                  onOpenChange={setActionsOpen}
                  toggle={renderToggle}>
                  <DropdownList>
                    <DropdownItem key="refresh" onClick={onRefresh}>
                      Refresh All
                    </DropdownItem>
                    <DropdownItem key="docs" to="https://activemq.apache.org/components/classic/">
                      Documentation
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>

            </ToolbarContent>
          </Toolbar>

          <Tabs activeKey={activeKey} onSelect={onSelect} isBox>
            <Tab eventKey={0} title={<TabTitleText>Connectors</TabTitleText>} />
            <Tab eventKey={1} title={<TabTitleText>Queues</TabTitleText>} />
            <Tab eventKey={2} title={<TabTitleText>Topics</TabTitleText>} />
            <Tab eventKey={3} title={<TabTitleText>Broker Dashboard</TabTitleText>} />
            <Tab eventKey={4} title={<TabTitleText>Broker Overview</TabTitleText>} />
          </Tabs>
        </PageSection>
      </PageSection>

      {/* MAIN CONTENT */}
      <PageSection isFilled key={refreshVersion}>
        {route.view === 'connectors' && <ConnectorsView />}

        {route.view === 'queues' && !route.queueName && <QueuesView />}
        {route.view === 'queues' && route.queueName && (
          <QueueDetailsPage queueName={route.queueName} />
        )}

        {route.view === 'topics' && !route.topicName && <TopicsView />}
        {route.view === 'topics' && route.topicName && (
          <TopicDetailsPage topicName={route.topicName} />
        )}

        {route.view === 'broker' && <BrokerDashboard />}
        {route.view === 'overview' && <BrokerOverview />}
        
      </PageSection>
    </>
  )
}
