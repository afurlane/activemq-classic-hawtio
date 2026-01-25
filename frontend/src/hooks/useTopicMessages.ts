import useSWR from 'swr'
import { activemq } from '../services/activemq/ActiveMQClassicService'
import { Message } from '../types/domain'

export function useTopicMessages(mbean: string, page: number, pageSize: number) {
  return useSWR<Message[]>(
    ['topic-messages', mbean, page],
    () => activemq.browseTopic(mbean, page, pageSize),
    { revalidateOnFocus: false }
  )
}
