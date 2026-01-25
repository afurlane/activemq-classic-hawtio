import useSWR from 'swr'
import { activemq } from '../services/activemq/ActiveMQClassicService'

export function useBrokerTrendsSnapshot(brokerName: string | null) {
  return useSWR(
    brokerName ? ['broker-trends-snapshot', brokerName] : null,
    async () => {
      const queues = await activemq.listQueues(brokerName!)

      let totalSize = 0
      let totalInflight = 0
      let totalLag = 0
      let consumers = 0
      let memorySum = 0

      queues.forEach(q => {
        const size = q.size ?? 0
        const inflight = q.stats.inflight ?? 0
        const mem = q.memory.percent ?? 0

        totalSize += size
        totalInflight += inflight
        totalLag += size - inflight
        consumers += q.consumers
        memorySum += mem
      })

      const avgMemory = queues.length > 0 ? memorySum / queues.length : 0

      return {
        totalSize,
        totalInflight,
        totalLag,
        consumers,
        avgMemory,
      }
    },
    {
      refreshInterval: 5000,
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  )
}
