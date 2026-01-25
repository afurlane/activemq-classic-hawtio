import React, { createContext, useContext, useState, ReactNode } from 'react'
import { useBrokers } from './useBrokers'

interface BrokerContextValue {
  brokerName: string | null
  setBrokerName: (name: string | null) => void
}

const BrokerContext = createContext<BrokerContextValue | undefined>(undefined)

export const BrokerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [brokerName, setBrokerName] = useState<string | null>(null)

  return (
    <BrokerContext.Provider value={{ brokerName, setBrokerName }}>
      {children}
    </BrokerContext.Provider>
  )
}

export function useSelectedBrokerName() {
  const ctx = useContext(BrokerContext)
  if (!ctx) throw new Error('useSelectedBrokerName must be used inside BrokerProvider')
  return ctx.brokerName
}

export function useSetBrokerName() {
  const ctx = useContext(BrokerContext)
  if (!ctx) throw new Error('useSetBrokerName must be used inside BrokerProvider')
  return ctx.setBrokerName
}

/**
 * Restituisce l’oggetto BrokerInfo completo (name + mbean)
 * oppure null se non selezionato.
 */
export function useSelectedBroker() {
  const brokerName = useSelectedBrokerName()
  const { brokers } = useBrokers()

  if (!brokerName) return null
  return brokers.find(b => b.name === brokerName) ?? null
}
