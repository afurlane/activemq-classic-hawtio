import { createContext } from 'react'

interface BrokerContextValue {
  brokerName: string | null
  setBrokerName: (name: string | null) => void
}

export const BrokerContext = createContext<BrokerContextValue | undefined>(undefined)

