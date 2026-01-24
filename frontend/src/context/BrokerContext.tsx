import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { brokerRegistry, BrokerInfo } from '../services/activemq/BrokerRegistry'
import { log } from '../globals'

interface BrokerContextValue {
  brokers: BrokerInfo[]
  selectedBroker: BrokerInfo | null
  setSelectedBroker: (broker: BrokerInfo | null) => void
}

const BrokerContext = createContext<BrokerContextValue | undefined>(undefined)

export const BrokerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brokers, setBrokers] = useState<BrokerInfo[]>([])
  const [selectedBroker, setSelectedBroker] = useState<BrokerInfo | null>(null)

  const initialized = useRef(false)

  useEffect(() => {
    log.debug('[BrokerContext] mount: refreshing brokers…')

    brokerRegistry.refresh().then(b => {
      log.debug('[BrokerContext] initial brokers:', b)
      setBrokers(b)

      if (!initialized.current && b.length > 0) {
        initialized.current = true
        log.debug('[BrokerContext] selecting initial broker:', b[0])
        setSelectedBroker(b[0] ?? null)
      }
    })

    return brokerRegistry.onChange(b => {
      log.debug('[BrokerContext] brokers changed:', b)
      setBrokers(b)

      if (!initialized.current && b.length > 0) {
        initialized.current = true
        log.debug('[BrokerContext] selecting initial broker (onChange):', b[0])
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
