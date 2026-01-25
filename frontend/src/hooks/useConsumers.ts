import useSWR from 'swr'
import { activemq } from '../services/activemq/ActiveMQClassicService'

export function useConsumers(brokerName: string | null) {
  return useSWR<string[]>(
    brokerName ? ['consumers', brokerName] : null,
    () => activemq.listConsumers(brokerName!),
    { refreshInterval: 5000 }
  )
}
