import { useBrokerContext } from '../context/BrokerContext'

export function useBroker() {
  const { brokers, selectedBroker, setSelectedBroker } = useBrokerContext()

  return {
    brokers,
    broker: selectedBroker,
    setBroker: setSelectedBroker,
    hasBroker: !!selectedBroker,
    brokerName: selectedBroker?.name ?? null,
  }
}
