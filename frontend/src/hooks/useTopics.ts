import useSWR from 'swr'
import { activemq } from '../services/activemq/ActiveMQClassicService'
import { Topic } from '../types/domain'

export function useTopics(brokerName: string | null) {
  return useSWR<Topic[]>(
    brokerName ? ['topics', brokerName] : null,
    () => activemq.listTopics(brokerName!),
    { refreshInterval: 5000 }
  )
}
