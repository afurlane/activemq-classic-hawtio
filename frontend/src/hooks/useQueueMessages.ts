import useSWR from 'swr'
import { activemq } from '../services/activemq/ActiveMQClassicService'
import { Message } from '../types/domain'

export function useQueueMessages(mbean: string, page: number, pageSize: number) {
  return useSWR<Message[]>(
    ['queue-messages', mbean, page],
    () => activemq.browseQueue(mbean, page, pageSize),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  )
}
