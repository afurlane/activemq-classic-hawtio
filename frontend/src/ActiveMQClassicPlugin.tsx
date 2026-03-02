import React from 'react'
import { BrokerPanel } from './components/Broker/BrokerPanel'
import { SWRConfig } from 'swr'
import { BrokerProvider } from './context/BrokerProvider'

export const ActiveMQClassicPlugin: React.FC = () => {
  return (
    <SWRConfig value={{
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 10000,     // evita richieste duplicate per 10s
      refreshInterval: 5000,       // 1 richiesta ogni 5s
      errorRetryInterval: 10000,   // se fallisce, riprova dopo 10s
    }}>
      <BrokerProvider>
        <BrokerPanel />
      </BrokerProvider>
    </SWRConfig>
  )
}
