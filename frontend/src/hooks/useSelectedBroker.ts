import { useBrokerContext } from '../context/BrokerContext'

export function useSelectedBroker() {
  const { selectedBroker } = useBrokerContext()
  return selectedBroker
}

export function useSelectedBrokerName() {
  const { selectedBroker } = useBrokerContext()
  return selectedBroker?.name ?? null
}
