import useSWR from 'swr'
import { activemq } from '../services/activemq/ActiveMQClassicService'
import { Message } from '../types/domain'

interface TopicMessagesResult {
  messages: Message[]
  total: number
}

export function useTopicMessages(mbean: string, page: number, pageSize: number) {
  return useSWR<TopicMessagesResult>(
    ['topic-messages', mbean, page],
    async () => {
      // 1. Carica TUTTI i messaggi
      const all = await activemq.browseTopic(mbean);

      const total = all.length

      // 2. Calcola la pagina corrente
      const start = page * pageSize
      const end = start + pageSize
      const messages = all.slice(start, end)

      return { messages, total }
    },
    { revalidateOnFocus: false }
  )
}
