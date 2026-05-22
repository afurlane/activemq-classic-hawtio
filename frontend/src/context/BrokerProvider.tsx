import React, { useState, useMemo } from 'react'
import { BrokerContext } from './BrokerContext'

export const BrokerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brokerName, setBrokerName] = useState<string | null>(null)

  const value = useMemo(
    () => ({ brokerName, setBrokerName }),
    [brokerName]
  )

  return (
    <BrokerContext.Provider value={value}>
      {children}
    </BrokerContext.Provider>
  )
}
