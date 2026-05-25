import useSWR from 'swr'
import { activemq } from '../services/activemq/ActiveMQClassicService'
import { Message } from '../types/domain'

interface TopicMessagesResult {
  messages: Message[]
  total: number
}

export function useTopicMessages(mbean: string | null, page: number, pageSize: number) {
  const enabled = !!mbean && mbean.trim() !== "";

  return useSWR<TopicMessagesResult>(
    enabled ? ['topic-messages', mbean, page] : ['topic-messages', 'disabled'],
    enabled
      ? async () => {
          const all = await activemq.browseTopic(mbean!)
          const total = all.length
          const start = page * pageSize
          const end = start + pageSize
          const messages = all.slice(start, end)
          return { messages, total }
        }
      : null,
    {
      revalidateOnFocus: enabled,
      refreshInterval: enabled ? 5000 : 0,
    }
  )
}
