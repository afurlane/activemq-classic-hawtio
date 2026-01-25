import { useContext } from 'react'
import { useBrokers } from './useBrokers'
import { BrokerContext } from '../context/BrokerContext'


export function useSelectedBrokerName() {
  const ctx = useContext(BrokerContext)
  return ctx?.brokerName ?? null
}

export function useSetBrokerName() {
  const ctx = useContext(BrokerContext)
  return ctx?.setBrokerName ?? (() => {})
}

export function useSelectedBroker() {
  const brokerName = useSelectedBrokerName()
  const { brokers } = useBrokers()

  if (!brokerName) return null
  return brokers.find(b => b.name === brokerName) ?? null
}
