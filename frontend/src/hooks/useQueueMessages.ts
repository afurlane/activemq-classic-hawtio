import useSWR from 'swr'
import { activemq } from '../services/activemq/ActiveMQClassicService'

export function useQueueMessages(mbean: string, page: number, pageSize: number) {
  return useSWR(
    ['queue-messages', mbean, page],
    async () => {
      const raw = await activemq.browseQueue(mbean) // carica TUTTI
      const total = raw.length

      const start = page * pageSize
      const messages = raw.slice(start, start + pageSize)

      return { messages, total }
    },
    { revalidateOnFocus: false }
  )
}
