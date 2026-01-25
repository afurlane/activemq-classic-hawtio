import useSWR from 'swr'
import { activemq } from '../services/activemq/ActiveMQClassicService'
import { DLQ } from '../types/domain'

export function useDLQ(mbean: string | null) {
  return useSWR<DLQ>(
    mbean ? ['dlq', mbean] : null,
    () => activemq.getDLQInfo(mbean!),
    { refreshInterval: 5000 }
  )
}
