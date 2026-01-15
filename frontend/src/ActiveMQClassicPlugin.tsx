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

  const activeKey = (() => {
    switch (route.view) {
      case 'connectors': return 0;
      case 'queues': return 1;
      case 'topics': return 2;
      case 'broker': return 3;
      case 'overview': return 4;
      default: return 0;
    }
  })();

  const onSelect = (_: any, key: number) => {
    switch (key) {
      case 0: window.location.hash = buildConnectorsUrl(); break;
      case 1: window.location.hash = buildQueuesUrl(); break;
      case 2: window.location.hash = buildTopicsUrl(); break;
      case 3: window.location.hash = buildBrokerUrl(); break;
      case 4: window.location.hash = buildOverviewUrl(); break;
    }
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
