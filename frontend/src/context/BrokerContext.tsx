import React, { createContext, useContext, useEffect, useState } from 'react'
import { brokerRegistry, BrokerInfo } from '../services/activemq/BrokerRegistry'

interface BrokerContextValue {
  brokers: BrokerInfo[]
  selectedBroker: BrokerInfo | null
  setSelectedBroker: (broker: BrokerInfo | null) => void
}

const BrokerContext = createContext<BrokerContextValue | undefined>(undefined)

export const BrokerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brokers, setBrokers] = useState<BrokerInfo[]>([])
  const [selectedBroker, setSelectedBroker] = useState<BrokerInfo | null>(null)

  useEffect(() => {
    brokerRegistry.refresh().then(b => {
      setBrokers(b)
      if (!selectedBroker && b.length > 0) {
        setSelectedBroker(b[0] ?? null)
      }
    })

    return brokerRegistry.onChange(b => {
      setBrokers(b)
      if (!selectedBroker && b.length > 0) {
        setSelectedBroker(b[0] ?? null)
      }
    })
  }, [])

  return (
    <BrokerContext.Provider value={{ brokers, selectedBroker, setSelectedBroker }}>
        {children}
    </BrokerContext.Provider>
  )
}

export function useBrokerContext(): BrokerContextValue {
  const ctx = useContext(BrokerContext)
  if (!ctx) {
    throw new Error('useBrokerContext must be used within a BrokerProvider')
  }
  return ctx
}
