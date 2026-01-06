import React, { useEffect, useState } from 'react';
import { parseHashRoute } from './router';

import { QueuesView } from '../components/Queues/QueuesView';
import { QueueDetailsPage } from '../components/Queues/QueueDetailsPage';

import { BrokerDashboard } from '../components/Broker/BrokerDashboard';
import { BrokerOverview } from '../components/Broker/BrokerOverview';

// Se hai anche ConnectorsView o TopicsView, importale qui
import { ConnectorsView } from '../components/Connectors/ConnectorsView';
// import { TopicsView } from '../components/Topics/TopicsView';

export const Router: React.FC = () => {
  const [route, setRoute] = useState(parseHashRoute(window.location.hash));

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHashRoute(window.location.hash));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  switch (route.view) {
    case 'queues':
      if (route.queueName) {
        return <QueueDetailsPage queueName={route.queueName} />;
      }
      return <QueuesView />;

    case 'broker':
      return <BrokerDashboard />;

    case 'overview':
      return <BrokerOverview />;

    case 'connectors':
      return <ConnectorsView />;

    case 'topics':
      return <div>Topics view not implemented</div>;
      // return <TopicsView />;

    default:
      return <QueuesView />;
  }
};
