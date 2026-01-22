import { useEffect, useState } from 'react'
import { brokerRegistry, BrokerInfo } from '../services/activemq/BrokerRegistry'

export function useBrokers() {
  const [brokers, setBrokers] = useState<BrokerInfo[]>([])

  useEffect(() => {
    brokerRegistry.refresh().then(setBrokers)
    return brokerRegistry.onChange(setBrokers)
  }, [])

  return brokers
}
