import React from 'react'
import { BrokerPanel } from './components/Broker/BrokerPanel'
import { SWRConfig } from 'swr'
import { BrokerProvider } from './context/BrokerProvider'

const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 10000,
  errorRetryInterval: 10000,
}

export const ActiveMQClassicPlugin: React.FC = () => {
  return (
    <SWRConfig value={swrConfig}>
      <BrokerProvider>
        <BrokerPanel />
      </BrokerProvider>
    </SWRConfig>
  )
}

