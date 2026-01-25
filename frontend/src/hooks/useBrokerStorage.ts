import useSWR from 'swr'
import { activemq } from '../services/activemq/ActiveMQClassicService'

export function useBrokerStorage(brokerName: string | null) {
  return useSWR(
    brokerName ? ['broker-storage', brokerName] : null,
    async () => {
      const queues = await activemq.listQueuesWithRawAttributes(brokerName!)

      let store = 0
      let cursor = 0
      let memory = 0
      let tempSum = 0
      let tempCount = 0

      queues.forEach(({ attrs }) => {
        store += attrs.StoreMessageSize ?? 0
        cursor += attrs.CursorMemoryUsage ?? 0
        memory += attrs.MemoryUsageByteCount ?? 0

        if (attrs.TempUsagePercentUsage !== undefined) {
          tempSum += attrs.TempUsagePercentUsage
          tempCount++
        }
      })

      const temp = tempCount > 0 ? tempSum / tempCount : 0

      return { store, temp, cursor, memory }
    },
    {
      refreshInterval: 5000,
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  )
}
