import useSWR from 'swr'
import { activemq } from '../services/activemq/ActiveMQClassicService'

export function useQueueMessages(
  mbean: string,
  autoRefresh: boolean,
  interval: number
) {
  return useSWR(
    ['queue-messages', mbean],
    async () => {
      const raw = await activemq.browseQueue(mbean);
      return raw;
    },
    {
      revalidateOnFocus: false,
      refreshInterval: autoRefresh ? interval : 0,
    }
  );
}
