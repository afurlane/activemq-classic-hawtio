import React from 'react'
import { BrokerPanel } from './components/Broker/BrokerPanel'
import { SWRConfig } from 'swr'

export const ActiveMQClassicPlugin: React.FC = () => (
  <SWRConfig value={{ 
    revalidateOnFocus: true, 
    revalidateOnReconnect: true, 
    dedupingInterval: 2000, 
    errorRetryInterval: 5000, }} > 
    <BrokerPanel />
  </SWRConfig>
)