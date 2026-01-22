import React from 'react'
import { BrokerProvider } from './context/BrokerContext'
import { BrokerPanel } from './components/Broker/BrokerPanel'

export const ActiveMQClassicPlugin: React.FC = () => (
  <BrokerProvider>
    <BrokerPanel />
  </BrokerProvider>
)