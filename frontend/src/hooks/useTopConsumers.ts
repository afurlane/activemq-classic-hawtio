import useSWR from 'swr'
import { activemq } from '../services/activemq/ActiveMQClassicService'

export function useTopConsumers(brokerName: string | null) {
  return useSWR(
    brokerName ? ['top-consumers', brokerName] : null,
    async () => {
      const mbeans = await activemq.listConsumers(brokerName!)
      const attrs = await Promise.all(
        mbeans.map(m => activemq.getConsumerAttributes(m))
      )

      return attrs
        .map(a => ({
          clientId: a.ClientId ?? 'unknown',
          destination: a.DestinationName ?? 'unknown',
          dispatched: a.DispatchedCounter ?? 0,
          dequeue: a.DequeueCounter ?? 0,
          pending: a.PendingQueueSize ?? 0,
          slow: a.SlowConsumer ?? false,
        }))
        .sort((a, b) => b.dispatched - a.dispatched)
        .slice(0, 10)
    },
    {
      refreshInterval: 5000,
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  )
}
