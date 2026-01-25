import React, { useState } from 'react'
import { BrokerContext } from './BrokerContext'

export const BrokerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brokerName, setBrokerName] = useState<string | null>(null)

  return (
    <BrokerContext.Provider value={{ brokerName, setBrokerName }}>
      {children}
    </BrokerContext.Provider>
  )
}
