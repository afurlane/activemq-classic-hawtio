import useSWR from 'swr'
import { activemq } from '../services/activemq/ActiveMQClassicService'
import { Connector } from '../types/domain'

export function useConnectors(brokerName: string | null) {
  return useSWR<Connector[]>(
    brokerName ? ['connectors', brokerName] : null,
    () => activemq.listConnectors(brokerName!),
    { refreshInterval: 5000 }
  )
}
