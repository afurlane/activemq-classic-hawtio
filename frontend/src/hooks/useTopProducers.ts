import useSWR from 'swr'
import { activemq } from '../services/activemq/ActiveMQClassicService'

export function useTopProducers(brokerName: string | null) {
  return useSWR(
    brokerName ? ['top-producers', brokerName] : null,
    async () => {
      const mbeans = await activemq.listProducers(brokerName!)
      const attrs = await Promise.all(
        mbeans.map(m => activemq.getProducerAttributes(m))
      )

      return attrs
        .map(a => ({
          clientId: a.ClientId ?? 'unknown',
          destination: a.DestinationName ?? 'unknown',
          sent: a.SentCount ?? 0,
          blocked: a.ProducerBlocked ?? false,
          pctBlocked: a.PercentageBlocked ?? 0,
        }))
        .sort((a, b) => b.sent - a.sent)
        .slice(0, 10)
    },
    {
      refreshInterval: 5000,
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  )
}
