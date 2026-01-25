import useSWR from 'swr'
import { activemq } from '../services/activemq/ActiveMQClassicService'
import { Queue } from '../types/domain'

export function useQueues(brokerName: string | null) {
  return useSWR<Queue[]>(
    brokerName ? ['queues', brokerName] : null,
    () => activemq.listQueues(brokerName!),
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  )
}
