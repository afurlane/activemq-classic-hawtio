import useSWR from 'swr'
import { activemq } from '../services/activemq/ActiveMQClassicService'
import { QueueMessageGroupsInfo } from '../types/domain'

export function useQueueMessageGroups(
  mbean: string,
  autoRefresh: boolean,
  interval: number
) {
  return useSWR<QueueMessageGroupsInfo | null>(
    mbean ? ['queue-message-groups', mbean] : null,
    async () => {
      const queue = await activemq.getQueue(mbean)
      return queue?.messageGroups ?? null
    },
    {
      revalidateOnFocus: false,
      refreshInterval: autoRefresh ? interval : 0,
    }
  )
}
