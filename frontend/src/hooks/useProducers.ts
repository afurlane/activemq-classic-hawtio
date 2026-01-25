import useSWR from 'swr'
import { activemq } from '../services/activemq/ActiveMQClassicService'

export function useProducers(brokerName: string | null) {
  return useSWR<string[]>(
    brokerName ? ['producers', brokerName] : null,
    () => activemq.listProducers(brokerName!),
    { refreshInterval: 5000 }
  )
}
