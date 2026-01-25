import useSWR from 'swr'
import { activemq } from '../services/activemq/ActiveMQClassicService'

export function useBrokerThroughput(brokerName: string | null) {
  return useSWR(
    brokerName ? ['broker-throughput', brokerName] : null,
    async () => {
      const queues = await activemq.listQueues(brokerName!)

      const total = queues.reduce(
        (acc, q) => {
          acc.enqueue += q.stats.enqueue ?? 0
          acc.dequeue += q.stats.dequeue ?? 0
          acc.dispatch += q.stats.dispatch ?? 0
          return acc
        },
        { enqueue: 0, dequeue: 0, dispatch: 0 }
      )

      return total
    },
    {
      refreshInterval: 5000,
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  )
}
