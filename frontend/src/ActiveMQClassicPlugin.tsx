import React from 'react'
import { BrokerPanel } from './components/Broker/BrokerPanel'
import { SWRConfig } from 'swr'
import { BrokerProvider } from './context/BrokerProvider'

export const ActiveMQClassicPlugin: React.FC = () => {
  console.log('Rendering ActiveMQClassicPlugin')

  return (
    <SWRConfig value={{
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
      errorRetryInterval: 5000,
    }}>
      <BrokerProvider>
        <BrokerPanel />
      </BrokerProvider>
    </SWRConfig>
  )
}
