import React, { useEffect, useState } from 'react';
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

import { BrokerDashboard } from './components/Broker/BrokerDashboard';
import { BrokerOverview } from './components/Broker/BrokerOverview';

// import { TopicsView } from './components/Topics/TopicsView';

import './style.css';
import { TopicsView } from './components/Topics/TopicsView';
import { TopicDetailsPage } from './components/Topics/TopicDetailsPage';

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

  const goConnectors = () => (window.location.hash = buildConnectorsUrl());
  const goQueues = () => (window.location.hash = buildQueuesUrl());
  const goTopics = () => (window.location.hash = buildTopicsUrl());
  const goBroker = () => (window.location.hash = buildBrokerUrl());
  const goOverview = () => (window.location.hash = buildOverviewUrl());

  return (
    <div className="amq-classic">
      <h1>ActiveMQ Classic</h1>

      <div className="tabs">
        <button
          className={route.view === 'connectors' ? 'active' : ''}
          onClick={goConnectors}
        >
          Connectors
        </button>

        <button
          className={route.view === 'queues' ? 'active' : ''}
          onClick={goQueues}
        >
          Queues
        </button>

        <button
          className={route.view === 'topics' ? 'active' : ''}
          onClick={goTopics}
        >          
          Topics
        </button>

        <button
          className={route.view === 'broker' ? 'active' : ''}
          onClick={goBroker}
        >
          Broker Dashboard
        </button>

        <button
          className={route.view === 'overview' ? 'active' : ''}
          onClick={goOverview}
        >
          Broker Overview
        </button>
      </div>

      <div className="content">
        {route.view === 'connectors' && <ConnectorsView />}

        {route.view === 'queues' && !route.queueName && <QueuesView />}

        {route.view === 'queues' && route.queueName && (
          <QueueDetailsPage queueName={route.queueName} />
        )}

        {route.view === 'topics' && !route.topicName && <TopicsView />} 
        {route.view === 'topics' && route.topicName && ( <TopicDetailsPage topicName={route.topicName} /> )}

        {route.view === 'broker' && <BrokerDashboard />}

        {route.view === 'overview' && <BrokerOverview />}
      </div>
    </div>
  );
};
