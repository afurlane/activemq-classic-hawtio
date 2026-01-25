import useSWR from 'swr'
import { activemq } from '../services/activemq/ActiveMQClassicService'
import { Queue } from '../types/domain'

export function useQueue(brokerName: string | null, queueName: string) {
  return useSWR<Queue | null>(
    brokerName ? ['queue', brokerName, queueName] : null,
    async () => {
      const queues = await activemq.listQueues(brokerName!)
      return queues.find(q => q.name === queueName) ?? null
    },
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  )
}
