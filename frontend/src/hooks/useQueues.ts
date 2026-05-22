import useSWR from 'swr'
import { activemq } from '../services/activemq/ActiveMQClassicService'
import { Queue } from '../types/domain'

export function useQueues(brokerName: string | null) {
  const enabled = !!brokerName

  return useSWR<Queue[]>(
    enabled ? ['queues', brokerName] : ['queues', 'disabled'],
    enabled ? () => activemq.listQueues(brokerName!) : null,
    {
      refreshInterval: enabled ? 5000 : 0,
      revalidateOnFocus: enabled,
      revalidateOnReconnect: enabled,
    }
  )
}
