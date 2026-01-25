import useSWR from 'swr'
import { activemq } from '../services/activemq/ActiveMQClassicService'
import { Subscription } from '../types/domain'

export function useSubscriptions(mbean: string | null) {
  return useSWR<Subscription[]>(
    mbean ? ['subscriptions', mbean] : null,
    () => activemq.listSubscriptions(mbean!),
    { refreshInterval: 5000 }
  )
}
