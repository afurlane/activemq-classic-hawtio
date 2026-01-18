import React, { useEffect, useState } from 'react';
import {
  Page,
  PageSection,
  PageSectionVariants,
  Title,
  Tabs,
  Tab,
  TabTitleText
} from '@patternfly/react-core';

import {
  parseHashRoute,
  buildConnectorsUrl,
  buildQueuesUrl,
  buildTopicsUrl,
  buildBrokerUrl,
  buildOverviewUrl,
  Route
} from './router/router';

import { ConnectorsView } from './components/Connectors/ConnectorsView';
import { QueuesView } from './components/Queues/QueuesView';
import { QueueDetailsPage } from './components/Queues/QueueDetailsPage';

import { TopicsView } from './components/Topics/TopicsView';
import { TopicDetailsPage } from './components/Topics/TopicDetailsPage';

import { BrokerDashboard } from './components/Broker/BrokerDashboard';
import { BrokerOverview } from './components/Broker/BrokerOverview';

export const ActiveMQClassicPlugin: React.FC = () => {
  const [route, setRoute] = useState<Route>(() =>
    parseHashRoute(window.location.hash)
  );

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHashRoute(window.location.hash));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const viewToTab = {
    connectors: 0,
    queues: 1,
    topics: 2,
    broker: 3,
    overview: 4
  } as const;

  const tabToView = Object.fromEntries(
    Object.entries(viewToTab).map(([view, key]) => [key, view])
  ) as Record<number, Route['view']>;

  const viewToUrl = {
    connectors: buildConnectorsUrl,
    queues: buildQueuesUrl,
    topics: buildTopicsUrl,
    broker: buildBrokerUrl,
    overview: buildOverviewUrl
  } as const;

  const activeKey = viewToTab[route.view];

  const onSelect = (_event: React.MouseEvent, eventKey: string | number) => {
    const key = Number(eventKey);
    const view = tabToView[key];
    if (!view) return;

    window.location.hash = viewToUrl[view]();
  };

  return (
    <Page>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h1">ActiveMQ Classic</Title>

        <Tabs activeKey={activeKey} onSelect={onSelect} isBox>
          <Tab eventKey={0} title={<TabTitleText>Connectors</TabTitleText>} />
          <Tab eventKey={1} title={<TabTitleText>Queues</TabTitleText>} />
          <Tab eventKey={2} title={<TabTitleText>Topics</TabTitleText>} />
          <Tab eventKey={3} title={<TabTitleText>Broker Dashboard</TabTitleText>} />
          <Tab eventKey={4} title={<TabTitleText>Broker Overview</TabTitleText>} />
        </Tabs>
      </PageSection>

      <PageSection isFilled>
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
    </Page>
  );
};
