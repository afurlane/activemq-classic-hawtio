import React from 'react';
import { BrokerTrends } from './BrokerTrends';
import { BrokerThroughput } from './BrokerThroughput';
import { BrokerStorage } from './BrokerStorage';
import { BrokerAlerts } from './BrokerAlerts';
import { TopConsumers } from './TopConsumers';
import { TopProducers } from './TopProducers';
import './BrokerOverview.css';

export const BrokerDashboard: React.FC = () => {
  return (
    <div>
      <h2>Broker Dashboard</h2>

      <div className="broker-grid">
        <BrokerTrends />
        <BrokerThroughput />
        <BrokerStorage />
        <BrokerAlerts />
        <TopConsumers />
        <TopProducers />
      </div>
    </div>
  );
};
